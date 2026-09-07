export interface WorkReport {
  id: number;
  conferenceId?: number;
  title: string;
  description?: string;
  reportDate?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkReportRequest {
  title: string;
  description?: string;
  reportDate?: string;
  status?: string;
}

export interface WorkPositive {
  id: number;
  conferenceId?: number;
  title: string;
  description?: string;
  positiveDate?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WorkPositiveRequest {
  title: string;
  description?: string;
  positiveDate?: string;
  status?: string;
}
