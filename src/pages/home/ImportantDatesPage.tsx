import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { importantDatesApi } from '@/api/importantDates.api';
import { ImportantDate, ImportantDateRequest } from '@/types/content.types';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge';
import { Toast, ToastMessage } from '@/components/ui/Toast';
import { Plus, Edit2, Trash2, Calendar } from 'lucide-react';

export const ImportantDatesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ImportantDate | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [title, setTitle] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [status, setStatus] = useState<boolean>(true);

  const { data: datesList = [], isLoading } = useQuery({
    queryKey: ['important-dates'],
    queryFn: importantDatesApi.list,
  });

  const createMutation = useMutation({
    mutationFn: importantDatesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['important-dates'] });
      setToast({ id: Date.now().toString(), type: 'success', message: 'Important date added!' });
      closeModal();
    },
    onError: (err: any) => {
      setToast({ id: Date.now().toString(), type: 'error', message: err?.response?.data?.message || 'Failed to add date' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ImportantDateRequest }) => importantDatesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['important-dates'] });
      setToast({ id: Date.now().toString(), type: 'success', message: 'Important date updated!' });
      closeModal();
    },
    onError: (err: any) => {
      setToast({ id: Date.now().toString(), type: 'error', message: err?.response?.data?.message || 'Failed to update date' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: importantDatesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['important-dates'] });
      setToast({ id: Date.now().toString(), type: 'success', message: 'Date deleted successfully.' });
      setDeleteId(null);
    },
  });

  const openCreateModal = () => {
    setSelectedItem(null);
    setTitle('');
    setDate('');
    setDescription('');
    setDisplayOrder(datesList.length);
    setStatus(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: ImportantDate) => {
    setSelectedItem(item);
    setTitle(item.title);
    setDate(item.date);
    setDescription(item.description || '');
    setDisplayOrder(item.displayOrder ?? 0);
    setStatus(item.status);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ImportantDateRequest = {
      title,
      date,
      description,
      displayOrder: Number(displayOrder),
      status,
    };

    if (selectedItem) {
      updateMutation.mutate({ id: selectedItem.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const columns: Column<ImportantDate>[] = [
    { header: 'Order', accessor: 'displayOrder', className: 'w-16 font-mono font-bold' },
    {
      header: 'Title',
      cell: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.title}</p>
          {row.description && <p className="text-xs text-slate-500 line-clamp-1">{row.description}</p>}
        </div>
      ),
    },
    {
      header: 'Date',
      cell: (row) => (
        <div className="flex items-center gap-1.5 font-medium text-slate-800 text-xs">
          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
          <span>{row.date}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (row) => (
        <Badge variant={getStatusBadgeVariant(row.status)}>
          {row.status ? 'ACTIVE' : 'INACTIVE'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => openEditModal(row)} icon={<Edit2 className="w-3.5 h-3.5" />}>
            Edit
          </Button>
          <Button variant="ghost" size="sm" className="text-rose-600 hover:bg-rose-50" onClick={() => setDeleteId(row.id)} icon={<Trash2 className="w-3.5 h-3.5" />}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Important Dates</h2>
          <p className="text-xs text-slate-500 mt-1">
            Deadlines for paper submission, registration, notification, and conference event dates.
          </p>
        </div>
        <Button variant="primary" onClick={openCreateModal} icon={<Plus className="w-4 h-4" />}>
          Add Important Date
        </Button>
      </div>

      <DataTable columns={columns} data={datesList} loading={isLoading} emptyMessage="No important dates configured." />

      <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedItem ? 'Edit Important Date' : 'Add Important Date'}>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <Input label="Event / Milestone Title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Abstract Submission Deadline" />
          <Input label="Target Date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
          <Textarea label="Description / Details" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional deadline instructions..." />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Display Order" type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} />
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</label>
              <select className="w-full rounded-md border border-slate-300 p-2 text-sm" value={status ? 'true' : 'false'} onChange={(e) => setStatus(e.target.value === 'true')}>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
            <Button variant="outline" type="button" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" type="submit" loading={createMutation.isPending || updateMutation.isPending}>Save</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        message="Are you sure you want to delete this important date?"
        loading={deleteMutation.isPending}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};
