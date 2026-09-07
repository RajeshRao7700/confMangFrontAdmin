import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { receiptsApi } from '@/api/receipts.api';
import { Receipt, ReceiptRequest } from '@/types/transactions.types';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge';
import { Toast, ToastMessage } from '@/components/ui/Toast';
import { Plus, Receipt as ReceiptIcon, Eye } from 'lucide-react';

export const ReceiptsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const [page, setPage] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  // Form State
  const [registrationId, setRegistrationId] = useState<string>('');
  const [invoiceId, setInvoiceId] = useState<string>('');
  const [amount, setAmount] = useState<number>(100);
  const [currency, setCurrency] = useState<string>('USD');
  const [paymentReference, setPaymentReference] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('Credit Card');

  const { data: receiptData, isLoading } = useQuery({
    queryKey: ['receipts', page],
    queryFn: () => receiptsApi.list(page, 15),
  });

  const createMutation = useMutation({
    mutationFn: receiptsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      setToast({ id: Date.now().toString(), type: 'success', message: 'Receipt created!' });
      closeModal();
    },
    onError: (err: any) => {
      setToast({ id: Date.now().toString(), type: 'error', message: err?.response?.data?.message || 'Failed to create receipt' });
    },
  });

  const openCreateModal = () => {
    setSelectedReceipt(null);
    setRegistrationId('');
    setInvoiceId('');
    setAmount(100);
    setCurrency('USD');
    setPaymentReference('');
    setPaymentMethod('Credit Card');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReceipt(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ReceiptRequest = {
      registrationId: registrationId ? Number(registrationId) : undefined,
      invoiceId: invoiceId ? Number(invoiceId) : undefined,
      amount: Number(amount),
      currency,
      paymentReference,
      paymentMethod,
    };
    createMutation.mutate(payload);
  };

  const columns: Column<Receipt>[] = [
    { header: 'Receipt #', accessor: 'receiptNumber', className: 'font-mono font-bold w-32 text-indigo-700' },
    {
      header: 'Amount Paid',
      cell: (row) => (
        <span className="font-bold text-slate-900 font-mono">
          {row.currency || '$'} {Number(row.amount).toLocaleString()}
        </span>
      ),
    },
    { header: 'Method', accessor: 'paymentMethod' },
    { header: 'Reference', accessor: 'paymentReference', className: 'font-mono text-xs' },
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
        <Button variant="outline" size="sm" onClick={() => { setSelectedReceipt(row); setIsModalOpen(true); }} icon={<Eye className="w-3.5 h-3.5" />}>
          Details
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Payment Receipts</h2>
          <p className="text-xs text-slate-500 mt-1">
            Confirmed payment vouchers, transaction references, and paid receipts.
          </p>
        </div>
        <Button variant="primary" onClick={openCreateModal} icon={<Plus className="w-4 h-4" />}>
          Create Receipt
        </Button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={receiptData?.content || []}
        loading={isLoading}
        emptyMessage="No payment receipts recorded."
        pagination={{
          page: receiptData?.number || 0,
          totalPages: receiptData?.totalPages || 1,
          totalElements: receiptData?.totalElements,
          onPageChange: (p) => setPage(p),
        }}
      />

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedReceipt ? `Receipt Details #${selectedReceipt.receiptNumber}` : 'Create Payment Receipt'}>
        {selectedReceipt ? (
          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <p><strong className="text-slate-500">Receipt #:</strong> {selectedReceipt.receiptNumber}</p>
              <p><strong className="text-slate-500">Amount Paid:</strong> {selectedReceipt.currency} {selectedReceipt.amount}</p>
              <p><strong className="text-slate-500">Method:</strong> {selectedReceipt.paymentMethod}</p>
              <p><strong className="text-slate-500">Payment Reference:</strong> {selectedReceipt.paymentReference || '—'}</p>
              <p><strong className="text-slate-500">Date:</strong> {selectedReceipt.receiptDate || selectedReceipt.createdAt}</p>
            </div>
            <div className="flex justify-end border-t border-slate-100 pt-4">
              <Button variant="outline" onClick={closeModal}>Close</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Registration ID (Optional)" type="number" value={registrationId} onChange={(e) => setRegistrationId(e.target.value)} placeholder="e.g. 1" />
              <Input label="Invoice ID (Optional)" type="number" value={invoiceId} onChange={(e) => setInvoiceId(e.target.value)} placeholder="e.g. 10" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Amount Paid" type="number" required value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
              <Input label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)} placeholder="USD" />
            </div>

            <Input label="Payment Reference / Transaction ID" value={paymentReference} onChange={(e) => setPaymentReference(e.target.value)} placeholder="ch_3M..." />
            <Input label="Payment Method" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} placeholder="Credit Card / Wire Transfer" />

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
              <Button variant="outline" type="button" onClick={closeModal}>Cancel</Button>
              <Button variant="primary" type="submit" loading={createMutation.isPending}>Issue Receipt</Button>
            </div>
          </form>
        )}
      </Modal>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};
