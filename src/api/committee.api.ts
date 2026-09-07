import { apiClient } from './axios';
import { CoreCommitteeMember, CoreCommitteeMemberRequest } from '@/types/people.types';

export const committeeApi = {
  list: async (): Promise<CoreCommitteeMember[]> => {
    const res = await apiClient.get<CoreCommitteeMember[]>('/api/conference/committee');
    return res.data;
  },

  getById: async (id: number): Promise<CoreCommitteeMember> => {
    const res = await apiClient.get<CoreCommitteeMember>(`/api/conference/committee/${id}`);
    return res.data;
  },

  create: async (data: CoreCommitteeMemberRequest): Promise<CoreCommitteeMember> => {
    const res = await apiClient.post<CoreCommitteeMember>('/api/conference/committee', data);
    return res.data;
  },

  update: async (id: number, data: CoreCommitteeMemberRequest): Promise<CoreCommitteeMember> => {
    const res = await apiClient.put<CoreCommitteeMember>(`/api/conference/committee/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/conference/committee/${id}`);
  },
};
