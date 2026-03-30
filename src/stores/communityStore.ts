import {create} from 'zustand';
import {Track, tracksApi} from '../api/tracks';

interface CommunityState {
  tracks: Track[];
  isLoading: boolean;
  sort: string;
  filter: string;
  loadTracks: (sort?: string) => Promise<void>;
  setFilter: (f: string) => void;
  likeTrack: (id: string, userName: string, userProvider: string) => Promise<void>;
}

export const useCommunityStore = create<CommunityState>((set, get) => ({
  tracks: [],
  isLoading: false,
  sort: 'latest',
  filter: 'all',

  loadTracks: async (sort) => {
    set({isLoading: true});
    if (sort) set({sort});
    try {
      const tracks = await tracksApi.getPublic(sort || get().sort);
      set({tracks, isLoading: false});
    } catch {
      set({isLoading: false});
    }
  },

  setFilter: (filter) => set({filter}),

  likeTrack: async (id, userName, userProvider) => {
    await tracksApi.likeTrack(id, userName, userProvider);
    set(s => ({
      tracks: s.tracks.map(t =>
        t.id === id ? {...t, comm_likes: (t.comm_likes || 0) + 1} : t
      ),
    }));
  },
}));
