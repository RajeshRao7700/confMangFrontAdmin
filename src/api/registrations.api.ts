import { apiClient } from './axios';
import {
  PageResponse,
  PaymentLinkResponse,
  Registration,
  RegistrationCreateRequest,
  RegistrationStatus,
} from '@/types/transactions.types';

export const registrationsApi = {
  list: async (page = 0, size = 20, search?: string): Promise<PageResponse<Registration>> => {
    const res = await apiClient.get<PageResponse<Registration>>('/api/conference/registrations', {
      params: { page, size, search },
    });
    return res.data;
  },

  getById: async (id: number): Promise<Registration> => {
    const res = await apiClient.get<Registration>(`/api/conference/registrations/${id}`);
    return res.data;
  },

  create: async (data: RegistrationCreateRequest): Promise<Registration> => {
    const res = await apiClient.post<Registration>('/api/conference/registrations', data);
    return res.data;
  },

  update: async (id: number, data: Partial<RegistrationCreateRequest>): Promise<Registration> => {
    const res = await apiClient.put<Registration>(`/api/conference/registrations/${id}`, data);
    return res.data;
  },

  updateStatus: async (id: number, status: RegistrationStatus): Promise<Registration> => {
    const res = await apiClient.patch<Registration>(`/api/conference/registrations/${id}/status`, {
      registrationStatus: status,
    });
    return res.data;
  },

  generatePaymentLink: async (id: number): Promise<PaymentLinkResponse> => {
    const res = await apiClient.post<PaymentLinkResponse>(`/api/conference/registrations/${id}/payment-link`);
    return res.data;
  },
};
