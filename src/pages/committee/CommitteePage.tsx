import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { committeeApi } from '@/api/committee.api';
import { filesApi } from '@/api/files.api';
import { CoreCommitteeMember, CoreCommitteeMemberRequest } from '@/types/people.types';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge';
import { Toast, ToastMessage } from '@/components/ui/Toast';
import { Plus, Edit2, Trash2, User, Upload } from 'lucide-react';

export const CommitteePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<CoreCommitteeMember | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [name, setName] = useState<string>('');
  const [designation, setDesignation] = useState<string>('');
  const [organization, setOrganization] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [status, setStatus] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['committee-members'],
    queryFn: committeeApi.list,
  });

  const createMutation = useMutation({
    mutationFn: committeeApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['committee-members'] });
      setToast({ id: Date.now().toString(), type: 'success', message: 'Committee member added!' });
      closeModal();
    },
    onError: (err: any) => {
      setToast({ id: Date.now().toString(), type: 'error', message: err?.response?.data?.message || 'Failed to add member' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CoreCommitteeMemberRequest }) => committeeApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['committee-members'] });
      setToast({ id: Date.now().toString(), type: 'success', message: 'Committee member updated!' });
      closeModal();
    },
    onError: (err: any) => {
      setToast({ id: Date.now().toString(), type: 'error', message: err?.response?.data?.message || 'Failed to update member' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: committeeApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['committee-members'] });
      setToast({ id: Date.now().toString(), type: 'success', message: 'Member deleted.' });
      setDeleteId(null);
    },
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await filesApi.uploadImage(file);
      setPhotoUrl(res.downloadUrl);
      setToast({ id: Date.now().toString(), type: 'success', message: 'Photo uploaded!' });
    } catch {
      setToast({ id: Date.now().toString(), type: 'error', message: 'Photo upload failed.' });
    } finally {
      setUploading(false);
    }
  };

  const openCreateModal = () => {
    setSelectedItem(null);
    setName('');
    setDesignation('');
    setOrganization('');
    setEmail('');
    setPhone('');
    setPhotoUrl('');
    setBio('');
    setDisplayOrder(members.length);
    setStatus(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: CoreCommitteeMember) => {
    setSelectedItem(item);
    setName(item.name);
    setDesignation(item.designation || '');
    setOrganization(item.organization || '');
    setEmail(item.email || '');
    setPhone(item.phone || '');
    setPhotoUrl(item.photoUrl || '');
    setBio(item.bio || '');
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
    const payload: CoreCommitteeMemberRequest = {
      name,
      designation,
      organization,
      email,
      phone,
      photoUrl,
      bio,
      displayOrder: Number(displayOrder),
      status,
    };

    if (selectedItem) {
      updateMutation.mutate({ id: selectedItem.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const columns: Column<CoreCommitteeMember>[] = [
    { header: 'Order', accessor: 'displayOrder', className: 'w-16 font-mono font-bold' },
    {
      header: 'Photo',
      cell: (row) => (
        <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-300 flex items-center justify-center">
          {row.photoUrl ? (
            <img src={row.photoUrl} alt={row.name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-5 h-5 text-slate-400" />
          )}
        </div>
      ),
    },
    {
      header: 'Member Details',
      cell: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.name}</p>
          <p className="text-xs text-slate-500">{row.designation} {row.organization && `• ${row.organization}`}</p>
        </div>
      ),
    },
    { header: 'Email / Phone', cell: (row) => <span className="text-xs text-slate-600">{row.email || '—'}</span> },
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
          <h2 className="text-xl font-bold text-slate-900">Core Committee Members</h2>
          <p className="text-xs text-slate-500 mt-1">
            Organizing committee, session chairs, scientific advisory board, and key personnel.
          </p>
        </div>
        <Button variant="primary" onClick={openCreateModal} icon={<Plus className="w-4 h-4" />}>
          Add Committee Member
        </Button>
      </div>

      <DataTable columns={columns} data={members} loading={isLoading} emptyMessage="No committee members added." />

      <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedItem ? 'Edit Member' : 'Add Committee Member'}>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <Input label="Full Name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Prof. David Miller" />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Designation / Role" value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="e.g. General Chair" />
            <Input label="Organization / University" value={organization} onChange={(e) => setOrganization(e.target.value)} placeholder="e.g. MIT" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="miller@mit.edu" />
            <Input label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555-0192" />
          </div>

          <div className="space-y-2">
            <Input label="Photo URL" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="https://example.com/photo.jpg" />
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-md hover:bg-indigo-100">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? 'Uploading...' : 'Upload Photo'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
              </label>
              {photoUrl && <span className="text-xs text-emerald-600 font-medium">✓ Photo Attached</span>}
            </div>
          </div>

          <Textarea label="Biography / Short Profile" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Brief professional background..." />

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
        message="Are you sure you want to delete this committee member?"
        loading={deleteMutation.isPending}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};
