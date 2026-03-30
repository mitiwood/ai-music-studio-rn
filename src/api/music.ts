import api from './client';

export interface GenerateParams {
  prompt: string;
  title?: string;
  tags?: string;
  lyrics?: string;
  isInstrumental?: boolean;
  model?: string;
  negativePrompt?: string;
}

export const musicApi = {
  async generate(params: GenerateParams, userName?: string, userProvider?: string) {
    const body: any = {
      prompt: params.prompt, mv: params.title || 'Untitled',
      lyrics: params.lyrics || '', tags: params.tags || '',
    };
    if (params.isInstrumental) body.instrumental = true;
    if (params.model) body.model = params.model;
    if (params.negativePrompt) body.negative_tags = params.negativePrompt;

    const {data} = await api.post('/api/kie-proxy', {
      path: '/api/v1/generate', method: 'POST', body, userName, userProvider,
    }, {timeout: 55000});
    return data;
  },

  async pollStatus(taskId: string) {
    const {data} = await api.post('/api/kie-proxy', {
      path: '/api/v1/generate/record-info?taskId=' + taskId, method: 'GET',
    }, {timeout: 15000});
    return data;
  },

  async generateLyrics(prompt: string, userName?: string, userProvider?: string) {
    const {data} = await api.post('/api/kie-proxy', {
      path: '/api/v1/lyrics/generate', method: 'POST',
      body: {prompt, callBackUrl: 'https://ddinggok.com/api/callback'},
      userName, userProvider,
    });
    return data;
  },

  async extend(audioUrl: string, userName?: string, userProvider?: string) {
    const {data} = await api.post('/api/kie-proxy', {
      path: '/api/v1/generate/extend', method: 'POST',
      body: {audioUrl}, userName, userProvider,
    });
    return data;
  },

  async cover(audioUrl: string, prompt: string, userName?: string, userProvider?: string) {
    const {data} = await api.post('/api/kie-proxy', {
      path: '/api/v1/generate/cover', method: 'POST',
      body: {audioUrl, prompt}, userName, userProvider,
    });
    return data;
  },

  async vocalRemoval(audioUrl: string, userName?: string, userProvider?: string) {
    const {data} = await api.post('/api/kie-proxy', {
      path: '/api/v1/vocal-removal/create', method: 'POST',
      body: {audioUrl}, userName, userProvider,
    });
    return data;
  },

  async generateMV(audioUrl: string, prompt: string, userName?: string, userProvider?: string) {
    const {data} = await api.post('/api/kie-proxy', {
      path: '/api/v1/generate/mv', method: 'POST',
      body: {audioUrl, prompt}, userName, userProvider,
    });
    return data;
  },
};
