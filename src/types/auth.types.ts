export enum Role {
  MASTER_ADMIN = 'MASTER_ADMIN',
  CONFERENCE_ADMIN = 'CONFERENCE_ADMIN',
}

export interface MasterLoginRequest {
  username: string;
  password: string;
}

export interface UserInfo {
  id: number;
  username: string;
  role: Role;
  organizationId: number;
  organizationName: string;
}

export interface MasterLoginResponse {
  message: string;
  accessToken?: string;
  tokenType?: string;
  expiresIn?: number;
  user: UserInfo;
}

export interface ConferenceOtpRequest {
  shortName: string;
}

export interface ConferenceOtpResponse {
  message: string;
  expiresInSeconds?: number;
  debugOtp?: string;
}

export interface ConferenceOtpVerifyRequest {
  shortName: string;
  otp: string;
}

export interface AuthenticatedUserResponse {
  role: string;
  organizationId: number;
  organizationName: string;
  conferenceId?: number;
  conferenceShortName?: string;
  username: string;
  email: string;
}

export interface ConferenceOtpVerifyResponse {
  message: string;
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthenticatedUserResponse;
}

export interface ErrorResponse {
  timestamp?: string;
  status?: number;
  error?: string;
  message?: string;
  path?: string;
  details?: string[];
}
