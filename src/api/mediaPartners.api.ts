import { apiClient } from './axios';
import { MediaPartner, MediaPartnerRequest } from '@/types/people.types';

export const mediaPartnersApi = {
  list: async (): Promise<MediaPartner[]> => {
    const res = await apiClient.get<MediaPartner[]>('/api/conference/media-partners');
    return res.data;
  },

  getById: async (id: number): Promise<MediaPartner> => {
    const res = await apiClient.get<MediaPartner>(`/api/conference/media-partners/${id}`);
    return res.data;
  },

  create: async (data: MediaPartnerRequest): Promise<MediaPartner> => {
    const res = await apiClient.post<MediaPartner>('/api/conference/media-partners', data);
    return res.data;
  },

  update: async (id: number, data: MediaPartnerRequest): Promise<MediaPartner> => {
    const res = await apiClient.put<MediaPartner>(`/api/conference/media-partners/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/conference/media-partners/${id}`);
  },
};
