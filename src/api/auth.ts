import api from './client';
import {API_BASE} from '../utils/constants';
import {Linking} from 'react-native';

export interface User {
  name: string;
  email: string;
  avatar: string;
  provider: 'google' | 'kakao' | 'naver' | 'guest';
  id?: string;
  plan?: 'free' | 'pro' | 'creator';
}

export const authApi = {
  loginWithGoogle() { Linking.openURL(API_BASE + '/api/auth/google'); },
  loginWithKakao() { Linking.openURL(API_BASE + '/api/auth/kakao'); },
  loginWithNaver() { Linking.openURL(API_BASE + '/api/auth/naver'); },

  async saveLogin(user: User) {
    return api.post('/api/users', {
      ...user, ua: 'KMS-RN/1.0', isMobile: true,
      lastLogin: new Date().toISOString(),
    });
  },

  async getProfile(name: string, provider: string) {
    const {data} = await api.get('/api/profile', {params: {name, provider}});
    return data;
  },

  async follow(followerName: string, followerProvider: string, followingName: string, followingProvider: string) {
    return api.post('/api/profile', {
      action: 'follow', followerName, followerProvider, followingName, followingProvider,
    });
  },

  async unfollow(followerName: string, followerProvider: string, followingName: string, followingProvider: string) {
    return api.post('/api/profile', {
      action: 'unfollow', followerName, followerProvider, followingName, followingProvider,
    });
  },
};
