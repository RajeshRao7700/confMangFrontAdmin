import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workReportsApi } from '@/api/workReports.api';
import { WorkReport, WorkReportRequest } from '@/types/work.types';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge';
import { Toast, ToastMessage } from '@/components/ui/Toast';
import { Plus, Edit2, Trash2, ClipboardList } from 'lucide-react';

export const WorkReportsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const [page, setPage] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<WorkReport | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [reportDate, setReportDate] = useState<string>('');
  const [status, setStatus] = useState<string>('COMPLETED');

  const { data: reportData, isLoading } = useQuery({
    queryKey: ['work-reports', page],
    queryFn: () => workReportsApi.list(page, 15),
  });

  const createMutation = useMutation({
    mutationFn: workReportsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-reports'] });
      setToast({ id: Date.now().toString(), type: 'success', message: 'Work report logged!' });
      closeModal();
    },
    onError: (err: any) => {
      setToast({ id: Date.now().toString(), type: 'error', message: err?.response?.data?.message || 'Failed to log work report' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: WorkReportRequest }) => workReportsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-reports'] });
      setToast({ id: Date.now().toString(), type: 'success', message: 'Work report updated!' });
      closeModal();
    },
    onError: (err: any) => {
      setToast({ id: Date.now().toString(), type: 'error', message: err?.response?.data?.message || 'Failed to update report' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: workReportsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-reports'] });
      setToast({ id: Date.now().toString(), type: 'success', message: 'Report deleted.' });
      setDeleteId(null);
    },
  });

  const openCreateModal = () => {
    setSelectedItem(null);
    setTitle('');
    setDescription('');
    setReportDate(new Date().toISOString().split('T')[0]);
    setStatus('COMPLETED');
    setIsModalOpen(true);
  };

  const openEditModal = (item: WorkReport) => {
    setSelectedItem(item);
    setTitle(item.title);
    setDescription(item.description || '');
    setReportDate(item.reportDate || '');
    setStatus(item.status || 'COMPLETED');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: WorkReportRequest = { title, description, reportDate, status };
    if (selectedItem) {
      updateMutation.mutate({ id: selectedItem.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const columns: Column<WorkReport>[] = [
    { header: 'ID', accessor: 'id', className: 'w-16 font-mono font-bold' },
    {
      header: 'Report Title',
      cell: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.title}</p>
          {row.description && <p className="text-xs text-slate-500 line-clamp-1">{row.description}</p>}
        </div>
      ),
    },
    { header: 'Report Date', accessor: 'reportDate', className: 'font-mono text-xs' },
    {
      header: 'Status',
      cell: (row) => (
        <Badge variant={getStatusBadgeVariant(row.status)}>
          {row.status || 'LOGGED'}
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
          <h2 className="text-xl font-bold text-slate-900">Daily Work Reports</h2>
          <p className="text-xs text-slate-500 mt-1">
            Operational work updates, committee tasks completed, and progress logs.
          </p>
        </div>
        <Button variant="primary" onClick={openCreateModal} icon={<Plus className="w-4 h-4" />}>
          Log Work Report
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={reportData?.content || []}
        loading={isLoading}
        emptyMessage="No work reports logged."
        pagination={{
          page: reportData?.number || 0,
          totalPages: reportData?.totalPages || 1,
          totalElements: reportData?.totalElements,
          onPageChange: (p) => setPage(p),
        }}
      />

      <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedItem ? 'Edit Work Report' : 'Log Daily Work Report'}>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <Input label="Report Title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Speaker Outreach Completed" />
          <Input label="Report Date" type="date" required value={reportDate} onChange={(e) => setReportDate(e.target.value)} />
          <Textarea label="Report Description / Output" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Summary of progress..." />
          <Input label="Status" value={status} onChange={(e) => setStatus(e.target.value)} placeholder="COMPLETED" />

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
            <Button variant="outline" type="button" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" type="submit" loading={createMutation.isPending || updateMutation.isPending}>Save Report</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        message="Are you sure you want to delete this report?"
        loading={deleteMutation.isPending}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};
