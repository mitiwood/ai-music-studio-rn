import {create} from 'zustand';
import {User} from '../api/auth';
import {storage} from '../utils/storage';

interface AuthState {
  user: User | null;
  isGuest: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  loginAsGuest: () => void;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isGuest: false,
  isLoading: true,

  setUser: (user) => {
    set({user, isGuest: false, isLoading: false});
    if (user) storage.set(storage.KEYS.USER, user);
    else storage.remove(storage.KEYS.USER);
  },

  loginAsGuest: () => {
    const guest: User = {
      name: '\uac8c\uc2a4\ud2b8',
      email: '',
      avatar: '',
      provider: 'guest',
      plan: 'free',
    };
    set({user: guest, isGuest: true, isLoading: false});
  },

  logout: () => {
    set({user: null, isGuest: false});
    storage.remove(storage.KEYS.USER);
  },

  loadUser: async () => {
    const user = await storage.get<User>(storage.KEYS.USER);
    set({user, isGuest: false, isLoading: false});
  },
}));
