export enum RegistrationStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export enum RegistrationType {
  DELEGATE = 'DELEGATE',
  STUDENT = 'STUDENT',
  RESEARCHER = 'RESEARCHER',
  AUTHOR = 'AUTHOR',
  SPEAKER = 'SPEAKER',
  EXHIBITOR = 'EXHIBITOR',
  OTHER = 'OTHER',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PresentationType {
  ORAL = 'ORAL',
  POSTER = 'POSTER',
  WORKSHOP = 'WORKSHOP',
  OTHER = 'OTHER',
}

export enum AbstractSubmissionStatus {
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  ISSUED = 'ISSUED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export enum ReceiptStatus {
  ISSUED = 'ISSUED',
  VOID = 'VOID',
  REFUNDED = 'REFUNDED',
}

export interface Registration {
  id: number;
  conferenceId?: number;
  registrationNumber: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  organization?: string;
  designation?: string;
  country?: string;
  registrationType: RegistrationType;
  amount?: number;
  currency?: string;
  paymentStatus: PaymentStatus;
  registrationStatus: RegistrationStatus;
  paymentReference?: string;
  paymentLink?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegistrationCreateRequest {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  organization?: string;
  designation?: string;
  country?: string;
  registrationType: RegistrationType;
  amount?: number;
  currency?: string;
}

export interface AbstractSubmission {
  id: number;
  conferenceId?: number;
  registrationId?: number;
  abstractNumber: string;
  title: string;
  abstractText: string;
  keywords?: string;
  authorName?: string;
  authorEmail?: string;
  authorPhone?: string;
  authorOrganization?: string;
  authorCountry?: string;
  presentationType: PresentationType;
  submissionStatus: AbstractSubmissionStatus;
  submittedAt?: string;
  reviewedAt?: string;
  reviewComments?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AbstractSubmissionStatusUpdateRequest {
  submissionStatus: AbstractSubmissionStatus;
  reviewComments?: string;
}

export interface PaymentLinkResponse {
  registrationId: number;
  paymentLink: string;
  paymentReference: string;
  expiresAt?: string;
}

export interface Invoice {
  id: number;
  conferenceId?: number;
  registrationId?: number;
  invoiceNumber: string;
  invoiceDate?: string;
  dueDate?: string;
  subtotal: number;
  taxAmount?: number;
  discountAmount?: number;
  totalAmount: number;
  currency?: string;
  status: InvoiceStatus;
  billingName?: string;
  billingEmail?: string;
  billingAddress?: string;
  taxNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceRequest {
  registrationId?: number;
  invoiceDate?: string;
  dueDate?: string;
  subtotal: number;
  taxAmount?: number;
  discountAmount?: number;
  currency?: string;
  billingName?: string;
  billingEmail?: string;
  billingAddress?: string;
  taxNumber?: string;
}

export interface Receipt {
  id: number;
  conferenceId?: number;
  registrationId?: number;
  invoiceId?: number;
  receiptNumber: string;
  receiptDate?: string;
  amount: number;
  currency?: string;
  paymentReference?: string;
  paymentMethod?: string;
  status: ReceiptStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReceiptRequest {
  registrationId?: number;
  invoiceId?: number;
  receiptDate?: string;
  amount: number;
  currency?: string;
  paymentReference?: string;
  paymentMethod?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
