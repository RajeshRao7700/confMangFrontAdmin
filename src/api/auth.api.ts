import { apiClient } from './axios';
import {
  MasterLoginRequest,
  MasterLoginResponse,
  ConferenceOtpRequest,
  ConferenceOtpResponse,
  ConferenceOtpVerifyRequest,
  ConferenceOtpVerifyResponse,
  AuthenticatedUserResponse,
} from '@/types/auth.types';

export const authApi = {
  masterLogin: async (data: MasterLoginRequest): Promise<MasterLoginResponse> => {
    const res = await apiClient.post<MasterLoginResponse>('/api/auth/master/login', data);
    return res.data;
  },

  requestConferenceOtp: async (data: ConferenceOtpRequest): Promise<ConferenceOtpResponse> => {
    const res = await apiClient.post<ConferenceOtpResponse>('/api/auth/conference/request-otp', data);
    return res.data;
  },

  verifyConferenceOtp: async (data: ConferenceOtpVerifyRequest): Promise<ConferenceOtpVerifyResponse> => {
    const res = await apiClient.post<ConferenceOtpVerifyResponse>('/api/auth/conference/verify-otp', data);
    return res.data;
  },

  getCurrentUser: async (): Promise<AuthenticatedUserResponse> => {
    const res = await apiClient.get<AuthenticatedUserResponse>('/api/auth/me');
    return res.data;
  },
};
