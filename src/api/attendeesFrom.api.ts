import { apiClient } from './axios';
import { AttendeeFrom, AttendeeFromRequest } from '@/types/content.types';

export const attendeesFromApi = {
  list: async (): Promise<AttendeeFrom[]> => {
    const res = await apiClient.get<AttendeeFrom[]>('/api/conference/attendees-from');
    return res.data;
  },

  getById: async (id: number): Promise<AttendeeFrom> => {
    const res = await apiClient.get<AttendeeFrom>(`/api/conference/attendees-from/${id}`);
    return res.data;
  },

  create: async (data: AttendeeFromRequest): Promise<AttendeeFrom> => {
    const res = await apiClient.post<AttendeeFrom>('/api/conference/attendees-from', data);
    return res.data;
  },

  update: async (id: number, data: AttendeeFromRequest): Promise<AttendeeFrom> => {
    const res = await apiClient.put<AttendeeFrom>(`/api/conference/attendees-from/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/conference/attendees-from/${id}`);
  },
};
