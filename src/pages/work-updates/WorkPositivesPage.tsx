import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workPositivesApi } from '@/api/workPositives.api';
import { WorkPositive, WorkPositiveRequest } from '@/types/work.types';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge';
import { Toast, ToastMessage } from '@/components/ui/Toast';
import { Plus, Edit2, Trash2, Smile } from 'lucide-react';

export const WorkPositivesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const [page, setPage] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<WorkPositive | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [positiveDate, setPositiveDate] = useState<string>('');
  const [status, setStatus] = useState<string>('ACHIEVED');

  const { data: positiveData, isLoading } = useQuery({
    queryKey: ['work-positives', page],
    queryFn: () => workPositivesApi.list(page, 15),
  });

  const createMutation = useMutation({
    mutationFn: workPositivesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-positives'] });
      setToast({ id: Date.now().toString(), type: 'success', message: 'Positive milestone logged!' });
      closeModal();
    },
    onError: (err: any) => {
      setToast({ id: Date.now().toString(), type: 'error', message: err?.response?.data?.message || 'Failed to log positive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: WorkPositiveRequest }) => workPositivesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-positives'] });
      setToast({ id: Date.now().toString(), type: 'success', message: 'Positive milestone updated!' });
      closeModal();
    },
    onError: (err: any) => {
      setToast({ id: Date.now().toString(), type: 'error', message: err?.response?.data?.message || 'Failed to update milestone' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: workPositivesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-positives'] });
      setToast({ id: Date.now().toString(), type: 'success', message: 'Milestone deleted.' });
      setDeleteId(null);
    },
  });

  const openCreateModal = () => {
    setSelectedItem(null);
    setTitle('');
    setDescription('');
    setPositiveDate(new Date().toISOString().split('T')[0]);
    setStatus('ACHIEVED');
    setIsModalOpen(true);
  };

  const openEditModal = (item: WorkPositive) => {
    setSelectedItem(item);
    setTitle(item.title);
    setDescription(item.description || '');
    setPositiveDate(item.positiveDate || '');
    setStatus(item.status || 'ACHIEVED');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: WorkPositiveRequest = { title, description, positiveDate, status };
    if (selectedItem) {
      updateMutation.mutate({ id: selectedItem.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const columns: Column<WorkPositive>[] = [
    { header: 'ID', accessor: 'id', className: 'w-16 font-mono font-bold' },
    {
      header: 'Positive Highlight / Milestone',
      cell: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.title}</p>
          {row.description && <p className="text-xs text-slate-500 line-clamp-1">{row.description}</p>}
        </div>
      ),
    },
    { header: 'Date', accessor: 'positiveDate', className: 'font-mono text-xs' },
    {
      header: 'Status',
      cell: (row) => (
        <Badge variant={getStatusBadgeVariant(row.status)}>
          {row.status || 'ACHIEVED'}
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
          <h2 className="text-xl font-bold text-slate-900">Work Positives & Milestones</h2>
          <p className="text-xs text-slate-500 mt-1">
            Major achievements, positive highlights, venue milestones, and sponsor wins.
          </p>
        </div>
        <Button variant="primary" onClick={openCreateModal} icon={<Plus className="w-4 h-4" />}>
          Add Positive Highlight
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={positiveData?.content || []}
        loading={isLoading}
        emptyMessage="No positive highlights logged."
        pagination={{
          page: positiveData?.number || 0,
          totalPages: positiveData?.totalPages || 1,
          totalElements: positiveData?.totalElements,
          onPageChange: (p) => setPage(p),
        }}
      />

      <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedItem ? 'Edit Positive Milestone' : 'Add Positive Milestone'}>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <Input label="Highlight / Win Title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Keynote Speaker Confirmed" />
          <Input label="Achievement Date" type="date" required value={positiveDate} onChange={(e) => setPositiveDate(e.target.value)} />
          <Textarea label="Milestone Impact & Details" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Positive details..." />
          <Input label="Status" value={status} onChange={(e) => setStatus(e.target.value)} placeholder="ACHIEVED" />

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
            <Button variant="outline" type="button" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" type="submit" loading={createMutation.isPending || updateMutation.isPending}>Save Highlight</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        message="Are you sure you want to delete this highlight?"
        loading={deleteMutation.isPending}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};
