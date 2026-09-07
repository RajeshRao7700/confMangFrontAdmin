# Conference Management System - Admin Panel Frontend (`conference-admin`)

A modern, enterprise-grade, high-density **Admin Panel** for the Conference Management System, built with **React 19, TypeScript, Vite, Tailwind CSS, TanStack Query, and Axios**.

This application runs as a completely independent frontend application that communicates exclusively via REST APIs with the Spring Boot backend (`confMangSys`).

---

## Key Architectural Guarantees

- **Zero Server-Side Rendering**: Completely decoupled from Spring Boot templates, Thymeleaf, or JSP.
- **Strict REST Communication**: Interacts solely with backend REST controllers at `http://localhost:8080`.
- **Tenant Context Aware**: Automatically passes tenant headers (`X-Tenant-Domain`) and `Authorization: Bearer <token>` on all requests.
- **Enterprise Design System**: Modern, compact data tables, status color indicators, responsive navigation shell, accessible modals, and toast notifications.

---

## Tech Stack

- **Framework**: React 19 + TypeScript 5
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v4
- **State & Data Fetching**: TanStack Query v5 + Axios
- **Routing**: React Router v7
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

---

## Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_NAME=Conference Management System
VITE_TENANT_DOMAIN=apex.com
```

> **Note**: Never hardcode backend URLs in component logic; always rely on `import.meta.env.VITE_API_BASE_URL`.

---

## Development Setup

```bash
# Install dependencies
npm install

# Start local development server (runs on http://localhost:5173)
npm run dev

# Run TypeScript check & build production bundle
npm run build

# Preview production build
npm run preview
```

---

## Authentication Workflows

### 1. Master Admin Login (`/login`)
- **Endpoint**: `POST /api/auth/master/login`
- **Default Credentials**: `username: masteradmin`, `password: Password@123`
- **Permissions**: Provision and manage conferences across organizations (`/master/conferences`).

### 2. Conference Admin OTP Login (`/conference-login`)
- **Step 1**: Enter Conference Short Name (e.g., `GIAI2027`). Calls `POST /api/auth/conference/request-otp`.
- **Step 2**: Enter 6-digit email OTP. Calls `POST /api/auth/conference/verify-otp`.
- **Token Management**: Receives JWT `accessToken` which is attached as `Bearer <token>` to all protected API calls.

---

## Information Architecture & Route Mapping

- `/login` - Master Admin Authentication
- `/conference-login` - Conference Admin 2-Step OTP Authentication
- `/dashboard` - Overview metrics, revenue summaries, quick actions
- `/master/conferences` - Master Admin conference management
- `/home/about` - About Conference content narrative
- `/home/important-dates` - Milestones and deadlines table
- `/home/tracks` - Topic tracks management
- `/home/attendees-from` - Featured attendee origins
- `/home/workshops` - Workshop promotional banners & image uploads
- `/committee` - Core Committee members & photo upload
- `/speakers` - Speakers management with filtering by `SpeakerCategory` enum (`SIGNED_UP`, `PLENARY`, `KEYNOTE`, `INVITED`, `YRF`, `FEATURED`, `DELEGATE`, `POSTER`, `UNABLE_TO_ATTEND`)
- `/partners/sponsors` - Sponsors management & tier configuration
- `/partners/media` - Media partners management
- `/files` - PDF and file repository with multipart upload & download
- `/registrations` - Registrations list, search, status filter, payment link generation
- `/abstracts` - Peer review decision workflow (`ACCEPTED`, `REJECTED`, `UNDER_REVIEW`, `WITHDRAWN`)
- `/payments/generate-link` - Standalone payment link generator
- `/invoices` - Invoice issuing and status updates (`DRAFT`, `ISSUED`, `PAID`, `CANCELLED`)
- `/receipts` - Confirmed payment receipts
- `/work-reports` - Operational work reports CRUD
- `/positives` - Major positive highlights & milestones
- `/reports` - Registration, financial, abstract analytics, and unsubscribe CSV export
