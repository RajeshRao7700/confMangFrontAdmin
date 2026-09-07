import { apiClient } from './axios';
import { AbstractReportResponse, PaymentReportResponse, RegistrationReportResponse } from '@/types/reports.types';

export const reportsApi = {
  getRegistrationReport: async (): Promise<RegistrationReportResponse> => {
    const res = await apiClient.get<RegistrationReportResponse>('/api/conference/reports/registrations');
    return res.data;
  },

  getPaymentReport: async (): Promise<PaymentReportResponse> => {
    const res = await apiClient.get<PaymentReportResponse>('/api/conference/reports/payments');
    return res.data;
  },

  getAbstractReport: async (): Promise<AbstractReportResponse> => {
    const res = await apiClient.get<AbstractReportResponse>('/api/conference/reports/abstracts');
    return res.data;
  },
};
