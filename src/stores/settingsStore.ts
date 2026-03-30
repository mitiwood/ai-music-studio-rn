import {create} from 'zustand';
import {storage} from '../utils/storage';
import {ThemeMode} from '../theme';

interface SettingsState {
  theme: ThemeMode;
  language: 'ko' | 'en' | 'ja';
  notificationsEnabled: boolean;
  setTheme: (t: ThemeMode) => void;
  setLanguage: (l: 'ko' | 'en' | 'ja') => void;
  toggleNotifications: () => void;
  loadSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  theme: 'dark',
  language: 'ko',
  notificationsEnabled: true,

  setTheme: (theme) => {
    set({theme});
    storage.set(storage.KEYS.THEME, theme);
  },

  setLanguage: (language) => set({language}),

  toggleNotifications: () => set(s => ({notificationsEnabled: !s.notificationsEnabled})),

  loadSettings: async () => {
    const theme = await storage.get<ThemeMode>(storage.KEYS.THEME);
    if (theme) set({theme});
  },
}));
