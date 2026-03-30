export const API_BASE = 'https://ddinggok.com';
export const APP_NAME = "Kenny's Music Studio";
export const APP_VERSION = '1.0.0';

export const GENRES = [
  {id: 'kpop', label: 'K-Pop', icon: 'flag'},
  {id: 'hiphop', label: 'Hip-Hop', icon: 'mic'},
  {id: 'electronic', label: 'Electronic', icon: 'pulse'},
  {id: 'rock', label: 'Rock', icon: 'flash'},
  {id: 'lofi', label: 'Lo-Fi', icon: 'moon'},
  {id: 'jazz', label: 'Jazz', icon: 'musical-note'},
  {id: 'classical', label: 'Classical', icon: 'musical-notes'},
  {id: 'acoustic', label: 'Acoustic', icon: 'leaf'},
  {id: 'rnb', label: 'R&B', icon: 'heart'},
  {id: 'ost', label: 'OST', icon: 'film'},
  {id: 'edm', label: 'EDM', icon: 'volume-high'},
  {id: 'ballad', label: 'Ballad', icon: 'musical-notes'},
];

export const MOODS = [
  {id: 'happy', label: '\ud589\ubcf5\ud55c', icon: 'happy'},
  {id: 'sad', label: '\uc2ac\ud508', icon: 'sad'},
  {id: 'energetic', label: '\uc5d0\ub108\uc9c0\ud2f1', icon: 'flash'},
  {id: 'chill', label: '\ud3b8\uc548\ud55c', icon: 'leaf'},
  {id: 'romantic', label: '\ub85c\ub9e8\ud2f1', icon: 'heart'},
  {id: 'dark', label: '\uc5b4\ub450\uc6b4', icon: 'moon'},
  {id: 'dreamy', label: '\ubabd\ud658\uc801', icon: 'sparkles'},
  {id: 'epic', label: '\uc6c5\uc7a5\ud55c', icon: 'trophy'},
];

export const VOCAL_TYPES = [
  {id: 'male', label: '\ub0a8\uc131 \ubcf4\uceec'},
  {id: 'female', label: '\uc5ec\uc131 \ubcf4\uceec'},
  {id: 'instrumental', label: '\uc778\uc2a4\ud2b8\ub8e8\uba58\ud0c8'},
];

export const PLAN_LIMITS: Record<string, {songs: number; mv: number; lyrics: number; label: string; price: number}> = {
  free: {songs: 5, mv: 0, lyrics: 5, label: 'Free', price: 0},
  pro: {songs: 50, mv: 3, lyrics: 50, label: 'Pro', price: 9900},
  creator: {songs: 999, mv: 20, lyrics: 999, label: 'Creator', price: 19900},
};
