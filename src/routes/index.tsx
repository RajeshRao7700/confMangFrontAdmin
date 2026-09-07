import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedLayout } from '@/components/layout/ProtectedLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { MasterLogin } from '@/pages/auth/MasterLogin';
import { ConferenceLogin } from '@/pages/auth/ConferenceLogin';
import { MasterConferences } from '@/pages/master/MasterConferences';
import { Dashboard } from '@/pages/dashboard/Dashboard';
import { AboutConferencePage } from '@/pages/home/AboutConferencePage';
import { ImportantDatesPage } from '@/pages/home/ImportantDatesPage';
import { TracksPage } from '@/pages/home/TracksPage';
import { AttendeesFromPage } from '@/pages/home/AttendeesFromPage';
import { WorkshopBannersPage } from '@/pages/home/WorkshopBannersPage';
import { CommitteePage } from '@/pages/committee/CommitteePage';
import { SpeakersPage } from '@/pages/speakers/SpeakersPage';
import { SponsorsPage } from '@/pages/partners/SponsorsPage';
import { MediaPartnersPage } from '@/pages/partners/MediaPartnersPage';
import { FilesPage } from '@/pages/files/FilesPage';
import { RegistrationsPage } from '@/pages/registrations/RegistrationsPage';
import { AbstractsPage } from '@/pages/abstracts/AbstractsPage';
import { PaymentLinkPage } from '@/pages/payments/PaymentLinkPage';
import { InvoicesPage } from '@/pages/invoices/InvoicesPage';
import { ReceiptsPage } from '@/pages/receipts/ReceiptsPage';
import { WorkReportsPage } from '@/pages/work-updates/WorkReportsPage';
import { WorkPositivesPage } from '@/pages/work-updates/WorkPositivesPage';
import { ReportsPage } from '@/pages/reports/ReportsPage';
import { Role } from '@/types/auth.types';
import { useAuth } from '@/context/AuthContext';

const DefaultRoute: React.FC = () => {
  const { role } = useAuth();
  if (role === Role.MASTER_ADMIN) {
    return <Navigate to="/master/conferences" replace />;
  }
  return <Navigate to="/dashboard" replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<MasterLogin />} />
      <Route path="/conference-login" element={<ConferenceLogin />} />

      {/* Protected Routes Wrapper */}
      <Route element={<ProtectedLayout />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<DefaultRoute />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Master Admin Only Routes */}
          <Route element={<ProtectedLayout allowedRoles={[Role.MASTER_ADMIN]} />}>
            <Route path="/master/conferences" element={<MasterConferences />} />
          </Route>

          {/* Home Module */}
          <Route path="/home/about" element={<AboutConferencePage />} />
          <Route path="/home/important-dates" element={<ImportantDatesPage />} />
          <Route path="/home/tracks" element={<TracksPage />} />
          <Route path="/home/attendees-from" element={<AttendeesFromPage />} />
          <Route path="/home/workshops" element={<WorkshopBannersPage />} />

          {/* Committee & Speakers */}
          <Route path="/committee" element={<CommitteePage />} />
          <Route path="/speakers" element={<SpeakersPage />} />

          {/* Partners & Files */}
          <Route path="/partners/sponsors" element={<SponsorsPage />} />
          <Route path="/partners/media" element={<MediaPartnersPage />} />
          <Route path="/files" element={<FilesPage />} />

          {/* Registrations & Abstracts */}
          <Route path="/registrations" element={<RegistrationsPage />} />
          <Route path="/abstracts" element={<AbstractsPage />} />
          <Route path="/payments/generate-link" element={<PaymentLinkPage />} />

          {/* Financials */}
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/receipts" element={<ReceiptsPage />} />

          {/* Work Updates & Reports */}
          <Route path="/work-reports" element={<WorkReportsPage />} />
          <Route path="/positives" element={<WorkPositivesPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Route>
      </Route>

      {/* Fallback Catch-All Route */}
      <Route path="*" element={<DefaultRoute />} />
    </Routes>
  );
};
