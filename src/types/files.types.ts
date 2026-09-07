export enum FileCategory {
  PDF = 'PDF',
  IMAGE = 'IMAGE',
  DOCUMENT = 'DOCUMENT',
  OTHER = 'OTHER',
}

export enum FileEntityType {
  CONFERENCE = 'CONFERENCE',
  SPEAKER = 'SPEAKER',
  COMMITTEE = 'COMMITTEE',
  SPONSOR = 'SPONSOR',
  MEDIA_PARTNER = 'MEDIA_PARTNER',
  WORKSHOP_BANNER = 'WORKSHOP_BANNER',
  ABSTRACT = 'ABSTRACT',
  REGISTRATION = 'REGISTRATION',
  INVOICE = 'INVOICE',
  RECEIPT = 'RECEIPT',
  OTHER = 'OTHER',
}

export interface FileMetadata {
  id: number;
  conferenceId?: number;
  originalFileName: string;
  contentType?: string;
  fileSize?: number;
  fileCategory?: FileCategory;
  entityType?: FileEntityType;
  entityId?: number;
  downloadUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FileUploadResponse {
  id: number;
  originalFileName: string;
  downloadUrl: string;
  message?: string;
}
