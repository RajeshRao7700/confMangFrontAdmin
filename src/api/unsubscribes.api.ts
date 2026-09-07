import { apiClient } from './axios';
import { ConferenceUnsubscribe } from '@/types/reports.types';
import { PageResponse } from '@/types/transactions.types';

export const unsubscribesApi = {
  list: async (page = 0, size = 20): Promise<PageResponse<ConferenceUnsubscribe>> => {
    const res = await apiClient.get<PageResponse<ConferenceUnsubscribe>>('/api/conference/unsubscribes', {
      params: { page, size },
    });
    return res.data;
  },

  create: async (email: string, reason?: string): Promise<ConferenceUnsubscribe> => {
    const res = await apiClient.post<ConferenceUnsubscribe>('/api/conference/unsubscribes', { email, reason });
    return res.data;
  },

  exportCsv: async (): Promise<string> => {
    const res = await apiClient.get<string>('/api/conference/unsubscribes/export', {
      responseType: 'text',
    });
    return res.data;
  },
};
