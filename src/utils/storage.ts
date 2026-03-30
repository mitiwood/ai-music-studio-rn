import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  AUTH_TOKEN: 'kms_auth_token',
  USER: 'kms_user',
  THEME: 'kms_theme',
  HISTORY: 'kms_history',
  SETTINGS: 'kms_settings',
};

export const storage = {
  async get<T>(key: string): Promise<T | null> {
    const v = await AsyncStorage.getItem(key);
    return v ? JSON.parse(v) : null;
  },
  async set(key: string, value: any) {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },
  async remove(key: string) {
    await AsyncStorage.removeItem(key);
  },
  KEYS,
};
