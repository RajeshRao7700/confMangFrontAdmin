import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { reportsApi } from '@/api/reports.api';
import { speakersApi } from '@/api/speakers.api';
import { sponsorsApi } from '@/api/sponsors.api';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { Link, Navigate } from 'react-router-dom';
import { Role } from '@/types/auth.types';
import {
  Users,
  CreditCard,
  FileSpreadsheet,
  UserCheck,
  Building2,
  Calendar,
  ArrowRight,
  ShieldCheck,
  PlusCircle,
  FolderOpen,
  Receipt,
  BarChart3,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { conferenceContext, user, role } = useAuth();

  if (role === Role.MASTER_ADMIN) {
    return <Navigate to="/master/conferences" replace />;
  }

  const isConfAdmin = role === Role.CONFERENCE_ADMIN;

  const { data: regReport } = useQuery({
    queryKey: ['report-registrations'],
    queryFn: reportsApi.getRegistrationReport,
    enabled: isConfAdmin,
  });

  const { data: paymentReport } = useQuery({
    queryKey: ['report-payments'],
    queryFn: reportsApi.getPaymentReport,
    enabled: isConfAdmin,
  });

  const { data: abstractReport } = useQuery({
    queryKey: ['report-abstracts'],
    queryFn: reportsApi.getAbstractReport,
    enabled: isConfAdmin,
  });

  const { data: speakers = [] } = useQuery({
    queryKey: ['speakers-summary'],
    queryFn: () => speakersApi.list(),
    enabled: isConfAdmin,
  });

  const { data: sponsors = [] } = useQuery({
    queryKey: ['sponsors-summary'],
    queryFn: () => sponsorsApi.list(),
    enabled: isConfAdmin,
  });

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl p-6 sm:p-8 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Active Conference Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {conferenceContext?.shortName || 'Conference Management System'}
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Welcome back, <strong className="text-white">{user?.username}</strong>. Overview of active registrations, financial metrics, speakers, and submitted abstracts.
          </p>
        </div>
        <div className="shrink-0 flex flex-wrap gap-3">
          <Link to="/registrations">
            <Button variant="primary" icon={<Users className="w-4 h-4" />}>
              Registrations
            </Button>
          </Link>
          <Link to="/abstracts">
            <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20" icon={<FileSpreadsheet className="w-4 h-4" />}>
              Abstracts
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Conference Performance Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Registrations"
            value={regReport?.total ?? '—'}
            subtitle={`Active: ${regReport?.active ?? 0} | Completed: ${regReport?.completed ?? 0}`}
            icon={<Users className="w-5 h-5" />}
            color="indigo"
          />
          <StatCard
            title="Total Revenue Collected"
            value={paymentReport?.totalPaidAmount ? `$${Number(paymentReport.totalPaidAmount).toLocaleString()}` : '$0'}
            subtitle={`Paid Transactions: ${paymentReport?.paidCount ?? 0}`}
            icon={<CreditCard className="w-5 h-5" />}
            color="emerald"
          />
          <StatCard
            title="Abstract Submissions"
            value={abstractReport?.total ?? '—'}
            subtitle={`Accepted: ${abstractReport?.accepted ?? 0} | Under Review: ${abstractReport?.underReview ?? 0}`}
            icon={<FileSpreadsheet className="w-5 h-5" />}
            color="sky"
          />
          <StatCard
            title="Confirmed Speakers"
            value={speakers.length}
            subtitle={`Sponsors Count: ${sponsors.length}`}
            icon={<UserCheck className="w-5 h-5" />}
            color="amber"
          />
        </div>
      </div>

      {/* Detailed Breakdown Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registration & Payment Summary */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-semibold text-slate-900 text-sm">Registration Status</h4>
            <Link to="/registrations" className="text-xs text-indigo-600 font-medium hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Active Registrations</span>
              <span className="font-bold text-slate-900">{regReport?.active ?? 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Pending Payment</span>
              <span className="font-bold text-amber-600">{regReport?.pending ?? 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Cancelled Registrations</span>
              <span className="font-bold text-rose-600">{regReport?.cancelled ?? 0}</span>
            </div>
          </div>
        </div>

        {/* Abstract Submissions Summary */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-semibold text-slate-900 text-sm">Abstract Pipeline</h4>
            <Link to="/abstracts" className="text-xs text-indigo-600 font-medium hover:underline flex items-center gap-1">
              Manage Abstracts <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Submitted</span>
              <span className="font-bold text-slate-900">{abstractReport?.submitted ?? 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Accepted Abstracts</span>
              <span className="font-bold text-emerald-600">{abstractReport?.accepted ?? 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Rejected / Withdrawn</span>
              <span className="font-bold text-rose-600">{(abstractReport?.rejected ?? 0) + (abstractReport?.withdrawn ?? 0)}</span>
            </div>
          </div>
        </div>

        {/* Quick Operations */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <h4 className="font-semibold text-slate-900 text-sm border-b border-slate-100 pb-3">Quick Administrative Actions</h4>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/speakers" className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 flex flex-col items-center gap-1 text-center transition-colors">
              <UserCheck className="w-5 h-5 text-indigo-600" />
              <span>Speakers</span>
            </Link>
            <Link to="/files" className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 flex flex-col items-center gap-1 text-center transition-colors">
              <FolderOpen className="w-5 h-5 text-sky-600" />
              <span>PDFs & Files</span>
            </Link>
            <Link to="/invoices" className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 flex flex-col items-center gap-1 text-center transition-colors">
              <Receipt className="w-5 h-5 text-amber-600" />
              <span>Invoices</span>
            </Link>
            <Link to="/reports" className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 flex flex-col items-center gap-1 text-center transition-colors">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <span>Reports</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
