import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sponsorsApi } from '@/api/sponsors.api';
import { filesApi } from '@/api/files.api';
import { Sponsor, SponsorRequest } from '@/types/people.types';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge';
import { Toast, ToastMessage } from '@/components/ui/Toast';
import { Plus, Edit2, Trash2, Building2, Upload, ExternalLink } from 'lucide-react';

export const SponsorsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Sponsor | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [websiteUrl, setWebsiteUrl] = useState<string>('');
  const [sponsorshipLevel, setSponsorshipLevel] = useState<string>('Platinum');
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [status, setStatus] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);

  const { data: sponsorsList = [], isLoading } = useQuery({
    queryKey: ['sponsors'],
    queryFn: sponsorsApi.list,
  });

  const createMutation = useMutation({
    mutationFn: sponsorsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsors'] });
      setToast({ id: Date.now().toString(), type: 'success', message: 'Sponsor created!' });
      closeModal();
    },
    onError: (err: any) => {
      setToast({ id: Date.now().toString(), type: 'error', message: err?.response?.data?.message || 'Failed to create sponsor' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: SponsorRequest }) => sponsorsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsors'] });
      setToast({ id: Date.now().toString(), type: 'success', message: 'Sponsor updated!' });
      closeModal();
    },
    onError: (err: any) => {
      setToast({ id: Date.now().toString(), type: 'error', message: err?.response?.data?.message || 'Failed to update sponsor' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: sponsorsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sponsors'] });
      setToast({ id: Date.now().toString(), type: 'success', message: 'Sponsor deleted.' });
      setDeleteId(null);
    },
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await filesApi.uploadImage(file);
      setLogoUrl(res.downloadUrl);
      setToast({ id: Date.now().toString(), type: 'success', message: 'Logo uploaded!' });
    } catch {
      setToast({ id: Date.now().toString(), type: 'error', message: 'Logo upload failed.' });
    } finally {
      setUploading(false);
    }
  };

  const openCreateModal = () => {
    setSelectedItem(null);
    setName('');
    setDescription('');
    setLogoUrl('');
    setWebsiteUrl('');
    setSponsorshipLevel('Platinum');
    setDisplayOrder(sponsorsList.length);
    setStatus(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: Sponsor) => {
    setSelectedItem(item);
    setName(item.name);
    setDescription(item.description || '');
    setLogoUrl(item.logoUrl || '');
    setWebsiteUrl(item.websiteUrl || '');
    setSponsorshipLevel(item.sponsorshipLevel || 'Platinum');
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
    const payload: SponsorRequest = {
      name,
      description,
      logoUrl,
      websiteUrl,
      sponsorshipLevel,
      displayOrder: Number(displayOrder),
      status,
    };
    if (selectedItem) {
      updateMutation.mutate({ id: selectedItem.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const columns: Column<Sponsor>[] = [
    { header: 'Order', accessor: 'displayOrder', className: 'w-16 font-mono font-bold' },
    {
      header: 'Logo',
      cell: (row) => (
        <div className="w-12 h-8 rounded border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center p-1">
          {row.logoUrl ? (
            <img src={row.logoUrl} alt={row.name} className="w-full h-full object-contain" />
          ) : (
            <Building2 className="w-4 h-4 text-slate-400" />
          )}
        </div>
      ),
    },
    {
      header: 'Sponsor Name',
      cell: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.name}</p>
          {row.websiteUrl && (
            <a href={row.websiteUrl} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
              <ExternalLink className="w-3 h-3" /> {row.websiteUrl}
            </a>
          )}
        </div>
      ),
    },
    {
      header: 'Level',
      cell: (row) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          {row.sponsorshipLevel || 'Sponsor'}
        </span>
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
          <h2 className="text-xl font-bold text-slate-900">Conference Sponsors</h2>
          <p className="text-xs text-slate-500 mt-1">
            Corporate, institutional, and research sponsors across Platinum, Gold, Silver tiers.
          </p>
        </div>
        <Button variant="primary" onClick={openCreateModal} icon={<Plus className="w-4 h-4" />}>
          Add Sponsor
        </Button>
      </div>

      <DataTable columns={columns} data={sponsorsList} loading={isLoading} emptyMessage="No sponsors added." />

      <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedItem ? 'Edit Sponsor' : 'Add Sponsor'}>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <Input label="Sponsor Name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. OpenAI Inc." />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Sponsorship Level" value={sponsorshipLevel} onChange={(e) => setSponsorshipLevel(e.target.value)} placeholder="e.g. Platinum, Gold, Silver" />
            <Input label="Website URL" type="url" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://openai.com" />
          </div>

          <div className="space-y-2">
            <Input label="Logo URL" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://example.com/logo.png" />
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-md hover:bg-indigo-100">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? 'Uploading...' : 'Upload Logo'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploading} />
              </label>
              {logoUrl && <span className="text-xs text-emerald-600 font-medium">✓ Logo Attached</span>}
            </div>
          </div>

          <Textarea label="Sponsor Description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief summary..." />

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
        message="Are you sure you want to delete this sponsor?"
        loading={deleteMutation.isPending}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};
