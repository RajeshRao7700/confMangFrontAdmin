# Admin Panel API Endpoint Mapping Document (`ADMIN_API_MAPPING.md`)

This document details the exact mapping between the **React Admin Panel Frontend** (`conference-admin`) and the **Spring Boot REST API Backend** (`confMangSys`).

---

## 1. Authentication (`/api/auth`)

| Frontend Page / Component | Backend Endpoint | HTTP Method | Request DTO | Response DTO | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/login` (Master Admin) | `/api/auth/master/login` | `POST` | `MasterLoginRequest` | `MasterLoginResponse` | Authenticates Master Admin |
| `/conference-login` (Step 1) | `/api/auth/conference/request-otp` | `POST` | `ConferenceOtpRequest` | `ConferenceOtpResponse` | Sends 6-digit email OTP |
| `/conference-login` (Step 2) | `/api/auth/conference/verify-otp` | `POST` | `ConferenceOtpVerifyRequest` | `ConferenceOtpVerifyResponse` | Issues JWT `accessToken` |
| Navigation Header / Auth Guard | `/api/auth/me` | `GET` | — | `AuthenticatedUserResponse` | Returns active user session & conference context |

---

## 2. Master Admin Conference Management (`/api/master/conferences`)

| Frontend Page | Backend Endpoint | HTTP Method | Request DTO | Response DTO | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/master/conferences` | `/api/master/conferences` | `GET` | — | `List<ConferenceResponse>` | Lists all conferences |
| `/master/conferences` | `/api/master/conferences` | `POST` | `ConferenceCreateRequest` | `ConferenceResponse` | Provisions new conference |
| `/master/conferences` | `/api/master/conferences/{id}` | `PUT` | `ConferenceUpdateRequest` | `ConferenceResponse` | Updates conference details & status |
| `/master/conferences` | `/api/organizations` | `GET` | — | `List<OrganizationResponse>` | Fetches available organization tenants |

---

## 3. Home Page Content Management (`/api/conference/*`)

| Frontend Page | Backend Endpoint | HTTP Method | Request DTO | Response DTO | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/home/about` | `/api/conference/about` | `GET` | — | `AboutConferenceResponse` | Retrieves about conference text |
| `/home/about` | `/api/conference/about` | `POST` | `AboutConferenceRequest` | `AboutConferenceResponse` | Creates about conference entry |
| `/home/about` | `/api/conference/about` | `PUT` | `AboutConferenceRequest` | `AboutConferenceResponse` | Updates about conference entry |
| `/home/about` | `/api/conference/about` | `DELETE` | — | `Void` | Clears about conference text |
| `/home/important-dates` | `/api/conference/important-dates` | `GET` | — | `List<ImportantDateResponse>` | Lists important dates |
| `/home/important-dates` | `/api/conference/important-dates` | `POST` | `ImportantDateRequest` | `ImportantDateResponse` | Adds important date |
| `/home/important-dates` | `/api/conference/important-dates/{id}` | `PUT` | `ImportantDateRequest` | `ImportantDateResponse` | Updates date |
| `/home/important-dates` | `/api/conference/important-dates/{id}` | `DELETE` | — | `Void` | Deletes date |
| `/home/tracks` | `/api/conference/tracks` | `GET` | — | `List<TrackResponse>` | Lists conference tracks |
| `/home/tracks` | `/api/conference/tracks` | `POST` | `TrackRequest` | `TrackResponse` | Adds track |
| `/home/tracks` | `/api/conference/tracks/{id}` | `PUT` | `TrackRequest` | `TrackResponse` | Updates track |
| `/home/tracks` | `/api/conference/tracks/{id}` | `DELETE` | — | `Void` | Deletes track |
| `/home/attendees-from` | `/api/conference/attendees-from` | `GET` | — | `List<AttendeeFromResponse>` | Lists attendee origin countries |
| `/home/attendees-from` | `/api/conference/attendees-from` | `POST` | `AttendeeFromRequest` | `AttendeeFromResponse` | Adds attendee origin |
| `/home/attendees-from` | `/api/conference/attendees-from/{id}` | `PUT` | `AttendeeFromRequest` | `AttendeeFromResponse` | Updates origin |
| `/home/attendees-from` | `/api/conference/attendees-from/{id}` | `DELETE` | — | `Void` | Deletes origin |
| `/home/workshops` | `/api/conference/workshop-banners` | `GET` | — | `List<WorkshopBannerResponse>` | Lists workshop banners |
| `/home/workshops` | `/api/conference/workshop-banners` | `POST` | `WorkshopBannerRequest` | `WorkshopBannerResponse` | Adds banner |
| `/home/workshops` | `/api/conference/workshop-banners/{id}` | `PUT` | `WorkshopBannerRequest` | `WorkshopBannerResponse` | Updates banner |
| `/home/workshops` | `/api/conference/workshop-banners/{id}` | `DELETE` | — | `Void` | Deletes banner |

---

## 4. Committee & Speakers (`/api/conference/*`)

| Frontend Page | Backend Endpoint | HTTP Method | Request DTO / Query | Response DTO | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/committee` | `/api/conference/committee` | `GET` | — | `List<CoreCommitteeMemberResponse>` | Lists committee members |
| `/committee` | `/api/conference/committee` | `POST` | `CoreCommitteeMemberRequest` | `CoreCommitteeMemberResponse` | Adds committee member |
| `/committee` | `/api/conference/committee/{id}` | `PUT` | `CoreCommitteeMemberRequest` | `CoreCommitteeMemberResponse` | Updates member |
| `/committee` | `/api/conference/committee/{id}` | `DELETE` | — | `Void` | Deletes member |
| `/speakers` | `/api/conference/speakers` | `GET` | `category?: SpeakerCategory` | `List<SpeakerResponse>` | Filtered by `SpeakerCategory` enum |
| `/speakers` | `/api/conference/speakers` | `POST` | `SpeakerRequest` | `SpeakerResponse` | Adds speaker |
| `/speakers` | `/api/conference/speakers/{id}` | `PUT` | `SpeakerRequest` | `SpeakerResponse` | Updates speaker |
| `/speakers` | `/api/conference/speakers/{id}` | `DELETE` | — | `Void` | Deletes speaker |

---

## 5. Partners & File Management (`/api/conference/*`)

| Frontend Page | Backend Endpoint | HTTP Method | Request DTO | Response DTO | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/partners/sponsors` | `/api/conference/sponsors` | `GET` | — | `List<SponsorResponse>` | Lists sponsors |
| `/partners/sponsors` | `/api/conference/sponsors` | `POST` | `SponsorRequest` | `SponsorResponse` | Adds sponsor |
| `/partners/sponsors` | `/api/conference/sponsors/{id}` | `PUT` | `SponsorRequest` | `SponsorResponse` | Updates sponsor |
| `/partners/sponsors` | `/api/conference/sponsors/{id}` | `DELETE` | — | `Void` | Deletes sponsor |
| `/partners/media` | `/api/conference/media-partners` | `GET` | — | `List<MediaPartnerResponse>` | Lists media partners |
| `/partners/media` | `/api/conference/media-partners` | `POST` | `MediaPartnerRequest` | `MediaPartnerResponse` | Adds partner |
| `/partners/media` | `/api/conference/media-partners/{id}` | `PUT` | `MediaPartnerRequest` | `MediaPartnerResponse` | Updates partner |
| `/partners/media` | `/api/conference/media-partners/{id}` | `DELETE` | — | `Void` | Deletes partner |
| `/files` | `/api/conference/files` | `GET` | `page, size, category, entityType` | `Page<FileMetadataResponse>` | Paginated files list |
| `/files` | `/api/conference/files` | `POST` | `multipart/form-data` | `FileUploadResponse` | Uploads file |
| `/files` | `/api/conference/files/pdf` | `POST` | `multipart/form-data` | `FileUploadResponse` | Uploads PDF file |
| `/files` | `/api/conference/files/image` | `POST` | `multipart/form-data` | `FileUploadResponse` | Uploads Image file |
| `/files` | `/api/conference/files/{id}` | `GET` | — | `Resource` | File download stream |
| `/files` | `/api/conference/files/{id}` | `DELETE` | — | `Void` | Deletes file |

---

## 6. Registrations, Abstracts & Payments (`/api/conference/*`)

| Frontend Page | Backend Endpoint | HTTP Method | Request DTO | Response DTO | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/registrations` | `/api/conference/registrations` | `GET` | `page, size, search` | `Page<RegistrationResponse>` | Paginated registrations list |
| `/registrations` | `/api/conference/registrations` | `POST` | `RegistrationCreateRequest` | `RegistrationResponse` | Creates registration |
| `/registrations` | `/api/conference/registrations/{id}/status` | `PATCH` | `RegistrationStatusUpdateRequest` | `RegistrationResponse` | Updates registration status |
| `/registrations` / `/payments/generate-link` | `/api/conference/registrations/{id}/payment-link` | `POST` | — | `PaymentLinkResponse` | Generates checkout URL |
| `/abstracts` | `/api/conference/abstracts` | `GET` | `page, size, search` | `Page<AbstractSubmissionResponse>` | Paginated abstracts list |
| `/abstracts` | `/api/conference/abstracts/{id}/status` | `PATCH` | `AbstractSubmissionStatusUpdateRequest` | `AbstractSubmissionResponse` | Updates peer review status |

---

## 7. Financial Invoices & Receipts (`/api/conference/*`)

| Frontend Page | Backend Endpoint | HTTP Method | Request DTO | Response DTO | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/invoices` | `/api/conference/invoices` | `GET` | `page, size` | `Page<InvoiceResponse>` | Lists invoices |
| `/invoices` | `/api/conference/invoices` | `POST` | `InvoiceRequest` | `InvoiceResponse` | Issues new invoice |
| `/invoices` | `/api/conference/invoices/{id}/status` | `PATCH` | `InvoiceStatusUpdateRequest` | `InvoiceResponse` | Updates status (`DRAFT`, `ISSUED`, `PAID`, `CANCELLED`) |
| `/receipts` | `/api/conference/receipts` | `GET` | `page, size` | `Page<ReceiptResponse>` | Lists receipts |
| `/receipts` | `/api/conference/receipts` | `POST` | `ReceiptRequest` | `ReceiptResponse` | Issues payment receipt |

---

## 8. Work Updates & Reports (`/api/conference/*`)

| Frontend Page | Backend Endpoint | HTTP Method | Request DTO | Response DTO | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/work-reports` | `/api/conference/work-reports` | `GET` | `page, size` | `Page<WorkReportResponse>` | Paginated work reports |
| `/work-reports` | `/api/conference/work-reports` | `POST` | `WorkReportRequest` | `WorkReportResponse` | Logs work report |
| `/work-reports` | `/api/conference/work-reports/{id}` | `PUT` | `WorkReportRequest` | `WorkReportResponse` | Updates work report |
| `/work-reports` | `/api/conference/work-reports/{id}` | `DELETE` | — | `Void` | Deletes work report |
| `/positives` | `/api/conference/positives` | `GET` | `page, size` | `Page<WorkPositiveResponse>` | Paginated work positives |
| `/positives` | `/api/conference/positives` | `POST` | `WorkPositiveRequest` | `WorkPositiveResponse` | Logs work positive |
| `/positives` | `/api/conference/positives/{id}` | `PUT` | `WorkPositiveRequest` | `WorkPositiveResponse` | Updates positive |
| `/positives` | `/api/conference/positives/{id}` | `DELETE` | — | `Void` | Deletes positive |
| `/dashboard` / `/reports` | `/api/conference/reports/registrations` | `GET` | — | `RegistrationReportResponse` | Registration counts summary |
| `/dashboard` / `/reports` | `/api/conference/reports/payments` | `GET` | — | `PaymentReportResponse` | Revenue & payment status breakdown |
| `/dashboard` / `/reports` | `/api/conference/reports/abstracts` | `GET` | — | `AbstractReportResponse` | Abstract pipeline status counts |
| `/reports` | `/api/conference/unsubscribes/export` | `GET` | — | `text/csv` | Exports unsubscribes CSV |
