import { apiClient } from './axios';
import { WorkshopBanner, WorkshopBannerRequest } from '@/types/content.types';

export const workshopBannersApi = {
  list: async (): Promise<WorkshopBanner[]> => {
    const res = await apiClient.get<WorkshopBanner[]>('/api/conference/workshop-banners');
    return res.data;
  },

  getById: async (id: number): Promise<WorkshopBanner> => {
    const res = await apiClient.get<WorkshopBanner>(`/api/conference/workshop-banners/${id}`);
    return res.data;
  },

  create: async (data: WorkshopBannerRequest): Promise<WorkshopBanner> => {
    const res = await apiClient.post<WorkshopBanner>('/api/conference/workshop-banners', data);
    return res.data;
  },

  update: async (id: number, data: WorkshopBannerRequest): Promise<WorkshopBanner> => {
    const res = await apiClient.put<WorkshopBanner>(`/api/conference/workshop-banners/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/conference/workshop-banners/${id}`);
  },
};
