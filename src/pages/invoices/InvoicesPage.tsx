import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoicesApi } from '@/api/invoices.api';
import { Invoice, InvoiceRequest, InvoiceStatus } from '@/types/transactions.types';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge';
import { Toast, ToastMessage } from '@/components/ui/Toast';
import { Plus, Edit2, Receipt, FileText } from 'lucide-react';

export const InvoicesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const [page, setPage] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Form State
  const [registrationId, setRegistrationId] = useState<string>('');
  const [billingName, setBillingName] = useState<string>('');
  const [billingEmail, setBillingEmail] = useState<string>('');
  const [billingAddress, setBillingAddress] = useState<string>('');
  const [subtotal, setSubtotal] = useState<number>(100);
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('USD');
  const [invoiceStatus, setInvoiceStatus] = useState<InvoiceStatus>(InvoiceStatus.DRAFT);

  const { data: invoiceData, isLoading } = useQuery({
    queryKey: ['invoices', page],
    queryFn: () => invoicesApi.list(page, 15),
  });

  const createMutation = useMutation({
    mutationFn: invoicesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      setToast({ id: Date.now().toString(), type: 'success', message: 'Invoice created!' });
      closeModal();
    },
    onError: (err: any) => {
      setToast({ id: Date.now().toString(), type: 'error', message: err?.response?.data?.message || 'Failed to create invoice' });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: InvoiceStatus }) =>
      invoicesApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      setToast({ id: Date.now().toString(), type: 'success', message: 'Invoice status updated!' });
      closeModal();
    },
    onError: (err: any) => {
      setToast({ id: Date.now().toString(), type: 'error', message: err?.response?.data?.message || 'Failed to update status' });
    },
  });

  const openCreateModal = () => {
    setSelectedInvoice(null);
    setRegistrationId('');
    setBillingName('');
    setBillingEmail('');
    setBillingAddress('');
    setSubtotal(100);
    setTaxAmount(0);
    setDiscountAmount(0);
    setCurrency('USD');
    setIsModalOpen(true);
  };

  const openStatusModal = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setInvoiceStatus(inv.status);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInvoice(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedInvoice) {
      statusMutation.mutate({ id: selectedInvoice.id, status: invoiceStatus });
    } else {
      const payload: InvoiceRequest = {
        registrationId: registrationId ? Number(registrationId) : undefined,
        billingName,
        billingEmail,
        billingAddress,
        subtotal: Number(subtotal),
        taxAmount: Number(taxAmount),
        discountAmount: Number(discountAmount),
        currency,
      };
      createMutation.mutate(payload);
    }
  };

  const columns: Column<Invoice>[] = [
    { header: 'Invoice #', accessor: 'invoiceNumber', className: 'font-mono font-bold w-32 text-indigo-700' },
    {
      header: 'Billed To',
      cell: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.billingName || '—'}</p>
          <p className="text-xs text-slate-500">{row.billingEmail || '—'}</p>
        </div>
      ),
    },
    {
      header: 'Total Amount',
      cell: (row) => (
        <span className="font-bold text-slate-900 font-mono">
          {row.currency || '$'} {Number(row.totalAmount ?? row.subtotal).toLocaleString()}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (row) => (
        <Badge variant={getStatusBadgeVariant(row.status)}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <Button variant="outline" size="sm" onClick={() => openStatusModal(row)} icon={<Edit2 className="w-3.5 h-3.5" />}>
          Update Status
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Invoices & Billing</h2>
          <p className="text-xs text-slate-500 mt-1">
            Issue, track, and manage delegate invoices, tax calculations, and status transitions.
          </p>
        </div>
        <Button variant="primary" onClick={openCreateModal} icon={<Plus className="w-4 h-4" />}>
          Create New Invoice
        </Button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={invoiceData?.content || []}
        loading={isLoading}
        emptyMessage="No invoices issued yet."
        pagination={{
          page: invoiceData?.number || 0,
          totalPages: invoiceData?.totalPages || 1,
          totalElements: invoiceData?.totalElements,
          onPageChange: (p) => setPage(p),
        }}
      />

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedInvoice ? `Update Invoice #${selectedInvoice.invoiceNumber}` : 'Issue New Invoice'}>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {selectedInvoice ? (
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                <p><strong className="text-slate-500">Invoice Number:</strong> {selectedInvoice.invoiceNumber}</p>
                <p><strong className="text-slate-500">Billing Name:</strong> {selectedInvoice.billingName}</p>
                <p><strong className="text-slate-500">Total:</strong> {selectedInvoice.currency} {selectedInvoice.totalAmount}</p>
              </div>

              <Select
                label="Invoice Status"
                required
                value={invoiceStatus}
                onChange={(e) => setInvoiceStatus(e.target.value as InvoiceStatus)}
                options={Object.values(InvoiceStatus).map((st) => ({ label: st, value: st }))}
              />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Registration ID (Optional)" type="number" value={registrationId} onChange={(e) => setRegistrationId(e.target.value)} placeholder="e.g. 1" />
                <Input label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} placeholder="USD" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="Billing Name" required value={billingName} onChange={(e) => setBillingName(e.target.value)} placeholder="John Doe" />
                <Input label="Billing Email" type="email" value={billingEmail} onChange={(e) => setBillingEmail(e.target.value)} placeholder="john@domain.com" />
              </div>

              <Input label="Billing Address" value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} placeholder="123 Science Park, Suite 400" />

              <div className="grid grid-cols-3 gap-4">
                <Input label="Subtotal" type="number" required value={subtotal} onChange={(e) => setSubtotal(Number(e.target.value))} />
                <Input label="Tax Amount" type="number" value={taxAmount} onChange={(e) => setTaxAmount(Number(e.target.value))} />
                <Input label="Discount Amount" type="number" value={discountAmount} onChange={(e) => setDiscountAmount(Number(e.target.value))} />
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
            <Button variant="outline" type="button" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" type="submit" loading={createMutation.isPending || statusMutation.isPending}>Save</Button>
          </div>
        </form>
      </Modal>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};
