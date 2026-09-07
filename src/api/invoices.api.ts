import { apiClient } from './axios';
import { Invoice, InvoiceRequest, InvoiceStatus, PageResponse } from '@/types/transactions.types';

export const invoicesApi = {
  list: async (page = 0, size = 20): Promise<PageResponse<Invoice>> => {
    const res = await apiClient.get<PageResponse<Invoice>>('/api/conference/invoices', {
      params: { page, size },
    });
    return res.data;
  },

  getById: async (id: number): Promise<Invoice> => {
    const res = await apiClient.get<Invoice>(`/api/conference/invoices/${id}`);
    return res.data;
  },

  create: async (data: InvoiceRequest): Promise<Invoice> => {
    const res = await apiClient.post<Invoice>('/api/conference/invoices', data);
    return res.data;
  },

  update: async (id: number, data: InvoiceRequest): Promise<Invoice> => {
    const res = await apiClient.put<Invoice>(`/api/conference/invoices/${id}`, data);
    return res.data;
  },

  updateStatus: async (id: number, status: InvoiceStatus): Promise<Invoice> => {
    const res = await apiClient.patch<Invoice>(`/api/conference/invoices/${id}/status`, { status });
    return res.data;
  },
};
