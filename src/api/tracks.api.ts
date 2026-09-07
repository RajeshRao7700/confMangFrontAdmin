import { apiClient } from './axios';
import { Track, TrackRequest } from '@/types/content.types';

export const tracksApi = {
  list: async (): Promise<Track[]> => {
    const res = await apiClient.get<Track[]>('/api/conference/tracks');
    return res.data;
  },

  getById: async (id: number): Promise<Track> => {
    const res = await apiClient.get<Track>(`/api/conference/tracks/${id}`);
    return res.data;
  },

  create: async (data: TrackRequest): Promise<Track> => {
    const res = await apiClient.post<Track>('/api/conference/tracks', data);
    return res.data;
  },

  update: async (id: number, data: TrackRequest): Promise<Track> => {
    const res = await apiClient.put<Track>(`/api/conference/tracks/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/conference/tracks/${id}`);
  },
};
