import { apiClient } from './axios';
import { Sponsor, SponsorRequest } from '@/types/people.types';

export const sponsorsApi = {
  list: async (): Promise<Sponsor[]> => {
    const res = await apiClient.get<Sponsor[]>('/api/conference/sponsors');
    return res.data;
  },

  getById: async (id: number): Promise<Sponsor> => {
    const res = await apiClient.get<Sponsor>(`/api/conference/sponsors/${id}`);
    return res.data;
  },

  create: async (data: SponsorRequest): Promise<Sponsor> => {
    const res = await apiClient.post<Sponsor>('/api/conference/sponsors', data);
    return res.data;
  },

  update: async (id: number, data: SponsorRequest): Promise<Sponsor> => {
    const res = await apiClient.put<Sponsor>(`/api/conference/sponsors/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/conference/sponsors/${id}`);
  },
};
