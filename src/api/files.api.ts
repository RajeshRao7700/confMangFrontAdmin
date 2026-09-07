import { apiClient } from './axios';
import { FileCategory, FileEntityType, FileMetadata, FileUploadResponse } from '@/types/files.types';
import { PageResponse } from '@/types/transactions.types';

export const filesApi = {
  uploadFile: async (
    file: File,
    category?: FileCategory,
    entityType?: FileEntityType,
    entityId?: number
  ): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    if (category) formData.append('category', category);
    if (entityType) formData.append('entityType', entityType);
    if (entityId) formData.append('entityId', entityId.toString());

    const res = await apiClient.post<FileUploadResponse>('/api/conference/files', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  uploadPdf: async (file: File): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post<FileUploadResponse>('/api/conference/files/pdf', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  uploadImage: async (file: File): Promise<FileUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post<FileUploadResponse>('/api/conference/files/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  listFiles: async (
    page = 0,
    size = 20,
    category?: FileCategory,
    entityType?: FileEntityType
  ): Promise<PageResponse<FileMetadata>> => {
    const params: Record<string, any> = { page, size };
    if (category) params.category = category;
    if (entityType) params.entityType = entityType;

    const res = await apiClient.get<PageResponse<FileMetadata>>('/api/conference/files', { params });
    return res.data;
  },

  getFileMetadata: async (id: number): Promise<FileMetadata> => {
    const res = await apiClient.get<FileMetadata>(`/api/conference/files/${id}/metadata`);
    return res.data;
  },

  downloadFileUrl: (id: number): string => {
    const baseURL = import.meta.env.VITE_API_BASE_URL ?? '';
    return `${baseURL}/api/conference/files/${id}`;
  },

  deleteFile: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/conference/files/${id}`);
  },
};
