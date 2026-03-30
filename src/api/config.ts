import api from './client';

export const configApi = {
  async getTossConfig() {
    const {data} = await api.get('/api/toss-config');
    return data;
  },
  async getCommunityConfig() {
    const {data} = await api.get('/api/community-config');
    return data;
  },
  async checkCredit(userName: string, userProvider: string) {
    const {data} = await api.get('/api/check-credit', {params: {userName, userProvider}});
    return data;
  },
};
