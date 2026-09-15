import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '@/api/reports.api';
import { unsubscribesApi } from '@/api/unsubscribes.api';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { Toast, ToastMessage } from '@/components/ui/Toast';
import { BarChart3, Download, Users, CreditCard, FileSpreadsheet, MailX } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

export const ReportsPage: React.FC = () => {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [exporting, setExporting] = useState<boolean>(false);

  const { data: regReport } = useQuery({
    queryKey: ['report-registrations-page'],
    queryFn: reportsApi.getRegistrationReport,
  });

  const { data: payReport } = useQuery({
    queryKey: ['report-payments-page'],
    queryFn: reportsApi.getPaymentReport,
  });

  const { data: abstractReport } = useQuery({
    queryKey: ['report-abstracts-page'],
    queryFn: reportsApi.getAbstractReport,
  });

  const handleExportUnsubscribes = async () => {
    setExporting(true);
    try {
      const csvData = await unsubscribesApi.exportCsv();
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'conference_unsubscribes.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setToast({ id: Date.now().toString(), type: 'success', message: 'Unsubscribes exported to CSV.' });
    } catch {
      setToast({ id: Date.now().toString(), type: 'error', message: 'Export failed.' });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Analytics & Conference Reports</h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time analytics for registrations, revenue payments, abstract submissions, and email unsubscribes.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleExportUnsubscribes}
          loading={exporting}
          icon={<Download className="w-4 h-4 text-rose-600" />}
        >
          Export Unsubscribes CSV
        </Button>
      </div>

      {/* Registrations Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Users className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-sm">Registration Analytics</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <StatCard title="Total Reg" value={regReport?.total ?? 0} color="indigo" />
          <StatCard title="Active" value={regReport?.active ?? 0} color="emerald" />
          <StatCard title="Pending" value={regReport?.pending ?? 0} color="amber" />
          <StatCard title="Completed" value={regReport?.completed ?? 0} color="sky" />
          <StatCard title="Cancelled" value={regReport?.cancelled ?? 0} color="rose" />
        </div>
      </div>

      {/* Payments Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <CreditCard className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-slate-900 text-sm">Financial & Payment Revenue</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            title="Total Paid Revenue"
            value={formatCurrency(payReport?.totalPaidAmount, payReport?.currency)}
            color="emerald"
          />
          <StatCard title="Paid Count" value={payReport?.paidCount ?? 0} color="emerald" />
          <StatCard title="Pending Payments" value={payReport?.pendingCount ?? 0} color="amber" />
          <StatCard title="Failed / Refunded" value={(payReport?.failedCount ?? 0) + (payReport?.refundedCount ?? 0)} color="rose" />
        </div>
      </div>

      {/* Abstracts Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <FileSpreadsheet className="w-5 h-5 text-sky-600" />
          <h3 className="font-bold text-slate-900 text-sm">Abstract Submission Pipeline</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <StatCard title="Total Abstracts" value={abstractReport?.total ?? 0} color="indigo" />
          <StatCard title="Submitted" value={abstractReport?.submitted ?? 0} color="slate" />
          <StatCard title="Under Review" value={abstractReport?.underReview ?? 0} color="amber" />
          <StatCard title="Accepted" value={abstractReport?.accepted ?? 0} color="emerald" />
          <StatCard title="Rejected / Withdrawn" value={(abstractReport?.rejected ?? 0) + (abstractReport?.withdrawn ?? 0)} color="rose" />
        </div>
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};
