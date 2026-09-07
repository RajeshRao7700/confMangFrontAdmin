import { apiClient } from './axios';
import {
  AbstractSubmission,
  AbstractSubmissionStatus,
  AbstractSubmissionStatusUpdateRequest,
  PageResponse,
} from '@/types/transactions.types';

export const abstractsApi = {
  list: async (page = 0, size = 20, search?: string): Promise<PageResponse<AbstractSubmission>> => {
    const res = await apiClient.get<PageResponse<AbstractSubmission>>('/api/conference/abstracts', {
      params: { page, size, search },
    });
    return res.data;
  },

  getById: async (id: number): Promise<AbstractSubmission> => {
    const res = await apiClient.get<AbstractSubmission>(`/api/conference/abstracts/${id}`);
    return res.data;
  },

  updateStatus: async (
    id: number,
    submissionStatus: AbstractSubmissionStatus,
    reviewComments?: string
  ): Promise<AbstractSubmission> => {
    const res = await apiClient.patch<AbstractSubmission>(`/api/conference/abstracts/${id}/status`, {
      submissionStatus,
      reviewComments,
    } as AbstractSubmissionStatusUpdateRequest);
    return res.data;
  },
};
