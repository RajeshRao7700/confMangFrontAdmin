export interface RegistrationReportResponse {
  conferenceId?: number;
  total: number;
  active: number;
  cancelled: number;
  pending: number;
  completed: number;
}

export interface PaymentReportResponse {
  conferenceId?: number;
  pendingCount: number;
  paidCount: number;
  failedCount: number;
  cancelledCount: number;
  refundedCount: number;
  totalPaidAmount: number;
  currency?: string;
}

export interface AbstractReportResponse {
  conferenceId?: number;
  total: number;
  submitted: number;
  underReview: number;
  accepted: number;
  rejected: number;
  withdrawn: number;
}

export interface ConferenceUnsubscribe {
  id: number;
  conferenceId?: number;
  email: string;
  reason?: string;
  source?: string;
  unsubscribedAt?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}
