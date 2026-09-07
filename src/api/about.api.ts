import { apiClient } from './axios';
import { AboutConference } from '@/types/content.types';

export const aboutApi = {
  getAbout: async (): Promise<AboutConference> => {
    const res = await apiClient.get<AboutConference>('/api/conference/about');
    return res.data;
  },

  createAbout: async (data: { title: string; description: string }): Promise<AboutConference> => {
    const res = await apiClient.post<AboutConference>('/api/conference/about', data);
    return res.data;
  },

  updateAbout: async (data: { title: string; description: string }): Promise<AboutConference> => {
    const res = await apiClient.put<AboutConference>('/api/conference/about', data);
    return res.data;
  },

  deleteAbout: async (): Promise<void> => {
    await apiClient.delete('/api/conference/about');
  },
};
