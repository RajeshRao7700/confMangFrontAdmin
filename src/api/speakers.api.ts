import { apiClient } from './axios';
import { Speaker, SpeakerCategory, SpeakerRequest } from '@/types/people.types';

export const speakersApi = {
  list: async (category?: SpeakerCategory): Promise<Speaker[]> => {
    const res = await apiClient.get<Speaker[]>('/api/conference/speakers', {
      params: category ? { category } : undefined,
    });
    return res.data;
  },

  getById: async (id: number): Promise<Speaker> => {
    const res = await apiClient.get<Speaker>(`/api/conference/speakers/${id}`);
    return res.data;
  },

  create: async (data: SpeakerRequest): Promise<Speaker> => {
    const res = await apiClient.post<Speaker>('/api/conference/speakers', data);
    return res.data;
  },

  update: async (id: number, data: SpeakerRequest): Promise<Speaker> => {
    const res = await apiClient.put<Speaker>(`/api/conference/speakers/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/conference/speakers/${id}`);
  },
};
