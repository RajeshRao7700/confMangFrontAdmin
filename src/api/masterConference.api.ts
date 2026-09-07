import { apiClient } from './axios';
import { Conference, ConferenceCreateRequest, ConferenceUpdateRequest, Organization } from '@/types/conference.types';

export const masterConferenceApi = {
  listConferences: async (): Promise<Conference[]> => {
    const res = await apiClient.get<Conference[]>('/api/master/conferences');
    return res.data;
  },

  getConferenceById: async (id: number): Promise<Conference> => {
    const res = await apiClient.get<Conference>(`/api/master/conferences/${id}`);
    return res.data;
  },

  createConference: async (data: ConferenceCreateRequest): Promise<Conference> => {
    const res = await apiClient.post<Conference>('/api/master/conferences', data);
    return res.data;
  },

  updateConference: async (id: number, data: ConferenceUpdateRequest): Promise<Conference> => {
    const res = await apiClient.put<Conference>(`/api/master/conferences/${id}`, data);
    return res.data;
  },

  listOrganizations: async (): Promise<Organization[]> => {
    const res = await apiClient.get<Organization[]>('/api/organizations');
    return res.data;
  },
};
