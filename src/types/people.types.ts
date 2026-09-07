export enum SpeakerCategory {
  SIGNED_UP = 'SIGNED_UP',
  PLENARY = 'PLENARY',
  KEYNOTE = 'KEYNOTE',
  INVITED = 'INVITED',
  YRF = 'YRF',
  FEATURED = 'FEATURED',
  DELEGATE = 'DELEGATE',
  POSTER = 'POSTER',
  UNABLE_TO_ATTEND = 'UNABLE_TO_ATTEND',
}

export interface Speaker {
  id: number;
  conferenceId?: number;
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  designation?: string;
  organization?: string;
  country?: string;
  bio?: string;
  photoUrl?: string;
  category: SpeakerCategory;
  displayOrder?: number;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SpeakerRequest {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  designation?: string;
  organization?: string;
  country?: string;
  bio?: string;
  photoUrl?: string;
  category: SpeakerCategory;
  displayOrder?: number;
  status?: boolean;
}

export interface CoreCommitteeMember {
  id: number;
  conferenceId?: number;
  name: string;
  designation?: string;
  organization?: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  bio?: string;
  displayOrder?: number;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CoreCommitteeMemberRequest {
  name: string;
  designation?: string;
  organization?: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  bio?: string;
  displayOrder?: number;
  status?: boolean;
}

export interface Sponsor {
  id: number;
  conferenceId?: number;
  name: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  sponsorshipLevel?: string;
  displayOrder?: number;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SponsorRequest {
  name: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  sponsorshipLevel?: string;
  displayOrder?: number;
  status?: boolean;
}

export interface MediaPartner {
  id: number;
  conferenceId?: number;
  name: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  displayOrder?: number;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MediaPartnerRequest {
  name: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  displayOrder?: number;
  status?: boolean;
}
