export interface AboutConference {
  id?: number;
  conferenceId?: number;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ImportantDate {
  id: number;
  conferenceId?: number;
  title: string;
  date: string;
  description?: string;
  displayOrder?: number;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ImportantDateRequest {
  title: string;
  date: string;
  description?: string;
  displayOrder?: number;
  status?: boolean;
}

export interface Track {
  id: number;
  conferenceId?: number;
  name: string;
  description?: string;
  displayOrder?: number;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TrackRequest {
  name: string;
  description?: string;
  displayOrder?: number;
  status?: boolean;
}

export interface AttendeeFrom {
  id: number;
  conferenceId?: number;
  name: string;
  displayOrder?: number;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AttendeeFromRequest {
  name: string;
  displayOrder?: number;
  status?: boolean;
}

export interface WorkshopBanner {
  id: number;
  conferenceId?: number;
  title: string;
  imageUrl: string;
  targetUrl?: string;
  displayOrder?: number;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkshopBannerRequest {
  title: string;
  imageUrl: string;
  targetUrl?: string;
  displayOrder?: number;
  status?: boolean;
}
