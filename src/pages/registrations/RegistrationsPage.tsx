import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { registrationsApi } from '@/api/registrations.api';
import { Registration, RegistrationStatus } from '@/types/transactions.types';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge';
import { Toast, ToastMessage } from '@/components/ui/Toast';
import { CreditCard, Eye, Search, Copy, Check } from 'lucide-react';

export const RegistrationsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const [page, setPage] = useState<number>(0);
  const [search, setSearch] = useState<string>('');

  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [generatedLink, setGeneratedLink] = useState<{ link: string; ref: string } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const { data: regData, isLoading } = useQuery({
    queryKey: ['registrations', page, search],
    queryFn: () => registrationsApi.list(page, 15, search || undefined),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: RegistrationStatus }) =>
      registrationsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
      setToast({ id: Date.now().toString(), type: 'success', message: 'Registration status updated!' });
    },
  });

  const paymentLinkMutation = useMutation({
    mutationFn: (id: number) => registrationsApi.generatePaymentLink(id),
    onSuccess: (res) => {
      setGeneratedLink({ link: res.paymentLink, ref: res.paymentReference });
      setToast({ id: Date.now().toString(), type: 'success', message: 'Payment link generated!' });
    },
    onError: (err: any) => {
      setToast({ id: Date.now().toString(), type: 'error', message: err?.response?.data?.message || 'Failed to generate link' });
    },
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const columns: Column<Registration>[] = [
    { header: 'Reg #', accessor: 'registrationNumber', className: 'font-mono font-bold w-28 text-indigo-700' },
    {
      header: 'Attendee',
      cell: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.firstName} {row.lastName}</p>
          <p className="text-xs text-slate-500">{row.email}</p>
        </div>
      ),
    },
    { header: 'Type', accessor: 'registrationType' },
    {
      header: 'Payment Status',
      cell: (row) => (
        <Badge variant={getStatusBadgeVariant(row.paymentStatus)}>
          {row.paymentStatus}
        </Badge>
      ),
    },
    {
      header: 'Status',
      cell: (row) => (
        <Badge variant={getStatusBadgeVariant(row.registrationStatus)}>
          {row.registrationStatus}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedReg(row);
              setIsDetailsOpen(true);
            }}
            icon={<Eye className="w-3.5 h-3.5" />}
          >
            Details
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => paymentLinkMutation.mutate(row.id)}
            loading={paymentLinkMutation.isPending}
            icon={<CreditCard className="w-3.5 h-3.5" />}
          >
            Payment Link
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Conference Registrations</h2>
          <p className="text-xs text-slate-500 mt-1">
            Registered attendees, delegate status, payment link generation, and attendee profiles.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs max-w-md">
        <Input
          placeholder="Search by name, email, or reg number..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          icon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={regData?.content || []}
        loading={isLoading}
        emptyMessage="No registrations found."
        pagination={{
          page: regData?.number || 0,
          totalPages: regData?.totalPages || 1,
          totalElements: regData?.totalElements,
          onPageChange: (p) => setPage(p),
        }}
      />

      {/* Details Modal */}
      <Modal isOpen={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} title="Registration Details">
        {selectedReg && (
          <div className="space-y-4 py-2 text-sm">
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <div>
                <p className="text-slate-400 font-semibold uppercase">Registration #</p>
                <p className="font-mono font-bold text-indigo-700 text-sm mt-0.5">{selectedReg.registrationNumber}</p>
              </div>
              <div>
                <p className="text-slate-400 font-semibold uppercase">Type</p>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedReg.registrationType}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p><strong className="text-slate-500">Full Name:</strong> {selectedReg.firstName} {selectedReg.lastName}</p>
              <p><strong className="text-slate-500">Email:</strong> {selectedReg.email}</p>
              <p><strong className="text-slate-500">Organization:</strong> {selectedReg.organization || '—'}</p>
              <p><strong className="text-slate-500">Designation:</strong> {selectedReg.designation || '—'}</p>
              <p><strong className="text-slate-500">Country:</strong> {selectedReg.country || '—'}</p>
              <p><strong className="text-slate-500">Amount:</strong> {selectedReg.amount ? `${selectedReg.currency || '$'} ${selectedReg.amount}` : 'N/A'}</p>
            </div>

            <div className="space-y-1 border-t border-slate-100 pt-3">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Update Registration Status</label>
              <Select
                value={selectedReg.registrationStatus}
                onChange={(e) => statusMutation.mutate({ id: selectedReg.id, status: e.target.value as RegistrationStatus })}
                options={Object.values(RegistrationStatus).map((st) => ({ label: st, value: st }))}
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Payment Link Generated Modal */}
      <Modal isOpen={generatedLink !== null} onClose={() => setGeneratedLink(null)} title="Generated Payment Link">
        {generatedLink && (
          <div className="space-y-4 py-2">
            <p className="text-xs text-slate-600">
              Payment link generated via backend payment provider abstraction. Send this link to attendee to complete payment.
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 font-mono text-xs">
              <p className="text-slate-400 uppercase font-semibold">Payment Reference:</p>
              <p className="font-bold text-slate-900">{generatedLink.ref}</p>
              <p className="text-slate-400 uppercase font-semibold mt-2">Payment URL:</p>
              <p className="text-indigo-600 font-medium break-all">{generatedLink.link}</p>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(generatedLink.link)} icon={copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}>
                {copied ? 'Copied to Clipboard' : 'Copy Link'}
              </Button>
              <Button variant="primary" size="sm" onClick={() => setGeneratedLink(null)}>Done</Button>
            </div>
          </div>
        )}
      </Modal>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};
