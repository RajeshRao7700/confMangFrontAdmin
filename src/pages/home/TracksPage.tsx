import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tracksApi } from '@/api/tracks.api';
import { Track, TrackRequest } from '@/types/content.types';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge';
import { Toast, ToastMessage } from '@/components/ui/Toast';
import { Plus, Edit2, Trash2, Layers } from 'lucide-react';

export const TracksPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Track | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [status, setStatus] = useState<boolean>(true);

  const { data: tracks = [], isLoading } = useQuery({
    queryKey: ['tracks'],
    queryFn: tracksApi.list,
  });

  const createMutation = useMutation({
    mutationFn: tracksApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracks'] });
      setToast({ id: Date.now().toString(), type: 'success', message: 'Track created successfully!' });
      closeModal();
    },
    onError: (err: any) => {
      setToast({ id: Date.now().toString(), type: 'error', message: err?.response?.data?.message || 'Failed to create track' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: TrackRequest }) => tracksApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracks'] });
      setToast({ id: Date.now().toString(), type: 'success', message: 'Track updated successfully!' });
      closeModal();
    },
    onError: (err: any) => {
      setToast({ id: Date.now().toString(), type: 'error', message: err?.response?.data?.message || 'Failed to update track' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: tracksApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tracks'] });
      setToast({ id: Date.now().toString(), type: 'success', message: 'Track deleted.' });
      setDeleteId(null);
    },
  });

  const openCreateModal = () => {
    setSelectedItem(null);
    setName('');
    setDescription('');
    setDisplayOrder(tracks.length);
    setStatus(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: Track) => {
    setSelectedItem(item);
    setName(item.name);
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
    const payload: TrackRequest = { name, description, displayOrder: Number(displayOrder), status };
    if (selectedItem) {
      updateMutation.mutate({ id: selectedItem.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const columns: Column<Track>[] = [
    { header: 'Order', accessor: 'displayOrder', className: 'w-16 font-mono font-bold' },
    {
      header: 'Track Name',
      cell: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.name}</p>
          {row.description && <p className="text-xs text-slate-500 line-clamp-1">{row.description}</p>}
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
          <h2 className="text-xl font-bold text-slate-900">Conference Tracks</h2>
          <p className="text-xs text-slate-500 mt-1">
            Research domains and topic tracks for abstract submissions and oral sessions.
          </p>
        </div>
        <Button variant="primary" onClick={openCreateModal} icon={<Plus className="w-4 h-4" />}>
          Add Track
        </Button>
      </div>

      <DataTable columns={columns} data={tracks} loading={isLoading} emptyMessage="No tracks configured." />

      <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedItem ? 'Edit Track' : 'Add Track'}>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <Input label="Track Name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Track 1: Generative Models & LLMs" />
          <Textarea label="Track Scope / Description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Topics included in this track..." />
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
        message="Are you sure you want to delete this track?"
        loading={deleteMutation.isPending}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};
