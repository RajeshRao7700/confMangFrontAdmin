import { apiClient } from './axios';
import { ImportantDate, ImportantDateRequest } from '@/types/content.types';

export const importantDatesApi = {
  list: async (): Promise<ImportantDate[]> => {
    const res = await apiClient.get<ImportantDate[]>('/api/conference/important-dates');
    return res.data;
  },

  getById: async (id: number): Promise<ImportantDate> => {
    const res = await apiClient.get<ImportantDate>(`/api/conference/important-dates/${id}`);
    return res.data;
  },

  create: async (data: ImportantDateRequest): Promise<ImportantDate> => {
    const res = await apiClient.post<ImportantDate>('/api/conference/important-dates', data);
    return res.data;
  },

  update: async (id: number, data: ImportantDateRequest): Promise<ImportantDate> => {
    const res = await apiClient.put<ImportantDate>(`/api/conference/important-dates/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/conference/important-dates/${id}`);
  },
};
