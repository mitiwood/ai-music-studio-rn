import {create} from 'zustand';
import {Track} from '../api/tracks';

interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  isFullPlayer: boolean;
  position: number;
  duration: number;
  shuffle: boolean;
  repeat: 'off' | 'one' | 'all';

  play: (track: Track) => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  previous: () => void;
  setQueue: (tracks: Track[]) => void;
  addToQueue: (track: Track) => void;
  setPosition: (pos: number) => void;
  setDuration: (dur: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  openFullPlayer: () => void;
  closeFullPlayer: () => void;
  setIsPlaying: (v: boolean) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  queue: [],
  isPlaying: false,
  isFullPlayer: false,
  position: 0,
  duration: 0,
  shuffle: false,
  repeat: 'off',

  play: (track) => set({currentTrack: track, isPlaying: true, position: 0}),
  pause: () => set({isPlaying: false}),
  resume: () => set({isPlaying: true}),

  next: () => {
    const {queue, currentTrack, shuffle} = get();
    if (queue.length === 0) return;
    const idx = queue.findIndex(t => t.id === currentTrack?.id);
    let nextIdx = shuffle ? Math.floor(Math.random() * queue.length) : idx + 1;
    if (nextIdx >= queue.length) nextIdx = 0;
    set({currentTrack: queue[nextIdx], isPlaying: true, position: 0});
  },

  previous: () => {
    const {queue, currentTrack} = get();
    if (queue.length === 0) return;
    const idx = queue.findIndex(t => t.id === currentTrack?.id);
    const prevIdx = idx <= 0 ? queue.length - 1 : idx - 1;
    set({currentTrack: queue[prevIdx], isPlaying: true, position: 0});
  },

  setQueue: (tracks) => set({queue: tracks}),
  addToQueue: (track) => set(s => ({queue: [...s.queue, track]})),
  setPosition: (pos) => set({position: pos}),
  setDuration: (dur) => set({duration: dur}),
  toggleShuffle: () => set(s => ({shuffle: !s.shuffle})),
  toggleRepeat: () => set(s => ({
    repeat: s.repeat === 'off' ? 'all' : s.repeat === 'all' ? 'one' : 'off',
  })),
  openFullPlayer: () => set({isFullPlayer: true}),
  closeFullPlayer: () => set({isFullPlayer: false}),
  setIsPlaying: (v) => set({isPlaying: v}),
}));
