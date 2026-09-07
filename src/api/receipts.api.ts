import { apiClient } from './axios';
import { PageResponse, Receipt, ReceiptRequest } from '@/types/transactions.types';

export const receiptsApi = {
  list: async (page = 0, size = 20): Promise<PageResponse<Receipt>> => {
    const res = await apiClient.get<PageResponse<Receipt>>('/api/conference/receipts', {
      params: { page, size },
    });
    return res.data;
  },

  getById: async (id: number): Promise<Receipt> => {
    const res = await apiClient.get<Receipt>(`/api/conference/receipts/${id}`);
    return res.data;
  },

  create: async (data: ReceiptRequest): Promise<Receipt> => {
    const res = await apiClient.post<Receipt>('/api/conference/receipts', data);
    return res.data;
  },
};
