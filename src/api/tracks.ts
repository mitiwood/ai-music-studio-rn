import api from './client';

export interface Track {
  id: string;
  title: string;
  audio_url: string;
  image_url?: string;
  video_url?: string;
  tags?: string;
  lyrics?: string;
  gen_mode?: string;
  owner_name: string;
  owner_provider: string;
  owner_avatar?: string;
  is_public?: boolean;
  duration?: number;
  comm_likes?: number;
  comm_dislikes?: number;
  comm_plays?: number;
  comm_rating?: number;
  comm_rating_count?: number;
  created_at?: string;
}

export const tracksApi = {
  async getPublic(sort = 'latest', limit = 50) {
    const {data} = await api.get('/api/tracks', {params: {public: true, sort, limit, mode: 'community'}});
    return data.tracks || [];
  },
  async getUserTracks(name: string, provider: string) {
    const {data} = await api.get('/api/tracks', {params: {owner: name, provider}});
    return data.tracks || [];
  },
  async saveTrack(track: Partial<Track>) {
    return api.post('/api/tracks', track);
  },
  async deleteTrack(id: string, owner: string, provider: string) {
    return api.delete('/api/tracks', {params: {id, owner, provider}});
  },
  async likeTrack(id: string, userName: string, userProvider: string) {
    return api.patch('/api/tracks', {userName, userProvider}, {params: {id, action: 'like'}});
  },
  async unlikeTrack(id: string, userName: string, userProvider: string) {
    return api.patch('/api/tracks', {userName, userProvider}, {params: {id, action: 'unlike'}});
  },
  async playTrack(id: string) {
    return api.patch('/api/tracks', {}, {params: {id, action: 'play'}});
  },
  async rateTrack(id: string, rating: number, userName: string, userProvider: string) {
    return api.patch('/api/tracks', {rating, userName, userProvider}, {params: {id, action: 'rate'}});
  },
  async getMyLikes(userName: string, userProvider: string) {
    const {data} = await api.get('/api/tracks', {params: {action: 'my-likes', userName, userProvider}});
    return data.likes || [];
  },
  async getNotifications(userName: string, userProvider: string) {
    const {data} = await api.get('/api/tracks', {params: {action: 'notifications', userName, userProvider}});
    return data.notifications || [];
  },
};
