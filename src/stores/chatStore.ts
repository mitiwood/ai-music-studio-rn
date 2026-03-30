import {create} from 'zustand';
import {ChatMessage, chatApi} from '../api/chat';

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  onlineCount: number;
  typingUsers: string[];
  loadMessages: (user?: string, provider?: string) => Promise<void>;
  sendMessage: (content: string, authorName: string, authorAvatar: string, authorProvider: string, replyTo?: {id: string; name: string}) => Promise<void>;
  deleteMessage: (msgId: string, authorName: string, authorProvider: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  onlineCount: 0,
  typingUsers: [],

  loadMessages: async (user, provider) => {
    set({isLoading: true});
    try {
      const res = await chatApi.getMessages('general', 50, user, provider);
      set({
        messages: res.messages || [],
        onlineCount: res.insight?.onlineCount || 0,
        typingUsers: res.typing || [],
        isLoading: false,
      });
    } catch {
      set({isLoading: false});
    }
  },

  sendMessage: async (content, authorName, authorAvatar, authorProvider, replyTo) => {
    await chatApi.sendMessage({content, author_name: authorName, author_avatar: authorAvatar, author_provider: authorProvider, reply_to: replyTo});
  },

  deleteMessage: async (msgId, authorName, authorProvider) => {
    await chatApi.deleteMessage(msgId, authorName, authorProvider);
    set(s => ({messages: s.messages.filter(m => m.id !== msgId)}));
  },
}));
