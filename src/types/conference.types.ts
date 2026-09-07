export interface Conference {
  id: number;
  organizationId: number;
  organizationName?: string;
  shortName: string;
  desiredUserName: string;
  email: string;
  conferenceDate: string;
  conferenceUrl?: string;
  url?: string;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ConferenceCreateRequest {
  organizationId: number;
  shortName: string;
  desiredUserName: string;
  email: string;
  conferenceDate: string;
  conferenceUrl?: string;
  url?: string;
}

export interface ConferenceUpdateRequest {
  shortName: string;
  desiredUserName: string;
  email: string;
  conferenceDate: string;
  conferenceUrl?: string;
  url?: string;
  status?: boolean;
}

export interface Organization {
  id: number;
  name: string;
  code: string;
  workflowDomain: string;
  status: boolean;
  createdAt?: string;
  updatedAt?: string;
}
