export const API_BASE = 'https://ddinggok.com';
export const APP_NAME = "Kenny's Music Studio";
export const APP_VERSION = '1.0.0';

export const GENRES = [
  {id: 'kpop', label: 'K-Pop', icon: '\ud83c\uddf0\ud83c\uddf7'},
  {id: 'hiphop', label: 'Hip-Hop', icon: '\ud83c\udfa4'},
  {id: 'electronic', label: 'Electronic', icon: '\ud83c\udfdb\ufe0f'},
  {id: 'rock', label: 'Rock', icon: '\ud83c\udfb8'},
  {id: 'lofi', label: 'Lo-Fi', icon: '\ud83c\udf19'},
  {id: 'jazz', label: 'Jazz', icon: '\ud83c\udfb7'},
  {id: 'classical', label: 'Classical', icon: '\ud83c\udfbb'},
  {id: 'acoustic', label: 'Acoustic', icon: '\ud83e\ude95'},
  {id: 'rnb', label: 'R&B', icon: '\ud83d\udc9c'},
  {id: 'ost', label: 'OST', icon: '\ud83c\udfac'},
  {id: 'edm', label: 'EDM', icon: '\ud83d\udd0a'},
  {id: 'ballad', label: 'Ballad', icon: '\ud83c\udfb5'},
];

export const MOODS = [
  {id: 'happy', label: '\ud589\ubcf5\ud55c', icon: '\ud83d\ude0a'},
  {id: 'sad', label: '\uc2ac\ud508', icon: '\ud83d\ude22'},
  {id: 'energetic', label: '\uc5d0\ub108\uc9c0\ud2f1', icon: '\u26a1'},
  {id: 'chill', label: '\ud3b8\uc548\ud55c', icon: '\ud83e\uddd8'},
  {id: 'romantic', label: '\ub85c\ub9e8\ud2f1', icon: '\ud83d\udc95'},
  {id: 'dark', label: '\uc5b4\ub450\uc6b4', icon: '\ud83c\udf11'},
  {id: 'dreamy', label: '\ubabd\ud658\uc801', icon: '\u2728'},
  {id: 'epic', label: '\uc6c5\uc7a5\ud55c', icon: '\ud83c\udfd4\ufe0f'},
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
