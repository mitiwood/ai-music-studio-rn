import api from './client';

export interface ChatMessage {
  id: string;
  room: string;
  author_name: string;
  author_avatar?: string;
  author_provider: string;
  content: string;
  reply_to?: {name: string; id: string};
  created_at: string;
}

export const chatApi = {
  async getMessages(room = 'general', limit = 50, user?: string, provider?: string) {
    const {data} = await api.get('/api/chat', {params: {room, limit, user, provider}});
    return data;
  },
  async sendMessage(msg: {room?: string; content: string; author_name: string; author_avatar?: string; author_provider: string; reply_to?: {id: string; name: string}}) {
    return api.post('/api/chat', {room: 'general', ...msg});
  },
  async deleteMessage(msgId: string, authorName: string, authorProvider: string) {
    return api.post('/api/chat', {action: 'delete', msgId, author_name: authorName, author_provider: authorProvider});
  },
  async typing(name: string, provider: string) {
    return api.post('/api/chat', {action: 'typing', author_name: name, author_provider: provider});
  },
};
