import {create} from 'zustand';
import {musicApi, GenerateParams} from '../api/music';
import {tracksApi, Track} from '../api/tracks';
import {randomId} from '../utils/helpers';

type GenStatus = 'idle' | 'generating' | 'polling' | 'success' | 'error';

interface MusicState {
  status: GenStatus;
  progress: number;
  statusText: string;
  generatedTracks: Track[];
  error: string | null;
  taskId: string | null;
  generateParams: Partial<GenerateParams>;

  setGenerateParams: (params: Partial<GenerateParams>) => void;
  generate: (params: GenerateParams, userName?: string, userProvider?: string) => Promise<void>;
  reset: () => void;
}

export const useMusicStore = create<MusicState>((set, get) => ({
  status: 'idle',
  progress: 0,
  statusText: '',
  generatedTracks: [],
  error: null,
  taskId: null,
  generateParams: {},

  setGenerateParams: (params) => set((state) => ({generateParams: {...state.generateParams, ...params}})),

  generate: async (params, userName, userProvider) => {
    set({status: 'generating', progress: 0, statusText: '\uc74c\uc545 \uc0dd\uc131 \uc900\ube44 \uc911...', error: null, generatedTracks: []});

    try {
      const res = await musicApi.generate(params, userName, userProvider);
      if (res.error) {
        set({status: 'error', error: res.reason || res.error});
        return;
      }

      const taskId = res.data?.taskId || res.taskId;
      if (!taskId) {
        set({status: 'error', error: 'taskId\ub97c \ubc1b\uc9c0 \ubabb\ud588\uc2b5\ub2c8\ub2e4'});
        return;
      }

      set({status: 'polling', taskId, progress: 5, statusText: '\uc74c\uc545 \uc0dd\uc131 \uc911...'});

      // Polling loop
      let attempts = 0;
      const maxAttempts = 120;

      while (attempts < maxAttempts) {
        attempts++;
        const delay = attempts <= 3 ? 500 : attempts <= 8 ? 1000 : attempts <= 20 ? 1500 : 2000;
        await new Promise(r => setTimeout(r, delay));

        if (get().status !== 'polling') return;

        try {
          const poll = await musicApi.pollStatus(taskId);
          const d = poll.data || poll;
          const st = d.status || '';

          // Progress mapping
          let prog = get().progress;
          if (st === 'CREATE') prog = Math.max(prog, 10);
          else if (st === 'GENERATE') prog = Math.max(prog, 25);
          else if (st === 'TEXT_SUCCESS') prog = Math.max(prog, 50);
          else if (st === 'FIRST_SUCCESS') prog = Math.max(prog, 75);
          else if (st === 'SUCCESS' || st === 'COMPLETE') prog = 100;

          // Time-based progress
          const timeProg = Math.min(95, (attempts / maxAttempts) * 100);
          prog = Math.max(prog, timeProg);

          set({progress: Math.round(prog), statusText: _statusLabel(st)});

          // Check for valid tracks
          const tracks = d.sunoData || d.tracks || d.response?.sunoData || d.response?.tracks || [];
          const validTracks = tracks.filter((t: any) => t.audioUrl && t.audioUrl.startsWith('http'));

          if ((st === 'SUCCESS' || st === 'COMPLETE' || st === 'FIRST_SUCCESS') && validTracks.length > 0) {
            const saved: Track[] = validTracks.map((t: any) => ({
              id: randomId(),
              title: t.title || params.title || 'Untitled',
              audio_url: t.audioUrl || t.streamAudioUrl,
              image_url: t.imageUrl || '',
              tags: params.tags || '',
              lyrics: params.lyrics || '',
              gen_mode: 'custom',
              owner_name: userName || '',
              owner_provider: userProvider || 'guest',
              duration: t.duration || 0,
            }));
            set({status: 'success', progress: 100, generatedTracks: saved, statusText: '\uc644\ub8cc!'});

            // Save to server
            for (const track of saved) {
              try { await tracksApi.saveTrack(track); } catch {}
            }
            return;
          }

          if (st === 'FAILED' || st === 'ERROR' || st === 'TIMEOUT') {
            set({status: 'error', error: d.errorMessage || '\uc0dd\uc131 \uc2e4\ud328'});
            return;
          }
        } catch {
          // Polling error, continue
        }
      }

      set({status: 'error', error: '\uc2dc\uac04 \ucd08\uacfc'});
    } catch (e: any) {
      const msg = e.response?.data?.reason || e.response?.data?.error || e.message || '\uc0dd\uc131 \uc2e4\ud328';
      set({status: 'error', error: msg});
    }
  },

  reset: () => set({status: 'idle', progress: 0, statusText: '', generatedTracks: [], error: null, taskId: null}),
}));

function _statusLabel(st: string): string {
  switch (st) {
    case 'PENDING': return '\ub300\uae30 \uc911...';
    case 'CREATE': return 'AI \ubd84\uc11d \uc911...';
    case 'GENERATE': return '\uc74c\uc545 \uc0dd\uc131 \uc911...';
    case 'TEXT_SUCCESS': return '\uac00\uc0ac \uc644\ub8cc, \uc74c\uc545 \uc0dd\uc131 \uc911...';
    case 'FIRST_SUCCESS': return '\uac70\uc758 \uc644\ub8cc!';
    case 'SUCCESS': case 'COMPLETE': return '\uc644\ub8cc!';
    default: return '\ucc98\ub9ac \uc911...';
  }
}
