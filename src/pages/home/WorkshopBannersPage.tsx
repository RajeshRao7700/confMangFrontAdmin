import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workshopBannersApi } from '@/api/workshopBanners.api';
import { filesApi } from '@/api/files.api';
import { WorkshopBanner, WorkshopBannerRequest } from '@/types/content.types';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge';
import { Toast, ToastMessage } from '@/components/ui/Toast';
import { Plus, Edit2, Trash2, Image, Upload, ExternalLink } from 'lucide-react';

export const WorkshopBannersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<WorkshopBanner | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [title, setTitle] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [targetUrl, setTargetUrl] = useState<string>('');
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [status, setStatus] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ['workshop-banners'],
    queryFn: workshopBannersApi.list,
  });

  const createMutation = useMutation({
    mutationFn: workshopBannersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workshop-banners'] });
      setToast({ id: Date.now().toString(), type: 'success', message: 'Workshop banner created!' });
      closeModal();
    },
    onError: (err: any) => {
      setToast({ id: Date.now().toString(), type: 'error', message: err?.response?.data?.message || 'Failed to create banner' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: WorkshopBannerRequest }) => workshopBannersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workshop-banners'] });
      setToast({ id: Date.now().toString(), type: 'success', message: 'Banner updated!' });
      closeModal();
    },
    onError: (err: any) => {
      setToast({ id: Date.now().toString(), type: 'error', message: err?.response?.data?.message || 'Failed to update banner' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: workshopBannersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workshop-banners'] });
      setToast({ id: Date.now().toString(), type: 'success', message: 'Banner deleted.' });
      setDeleteId(null);
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await filesApi.uploadImage(file);
      setImageUrl(res.downloadUrl);
      setToast({ id: Date.now().toString(), type: 'success', message: 'Image uploaded successfully!' });
    } catch (err: any) {
      setToast({ id: Date.now().toString(), type: 'error', message: 'Image upload failed.' });
    } finally {
      setUploading(false);
    }
  };

  const openCreateModal = () => {
    setSelectedItem(null);
    setTitle('');
    setImageUrl('');
    setTargetUrl('');
    setDisplayOrder(banners.length);
    setStatus(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: WorkshopBanner) => {
    setSelectedItem(item);
    setTitle(item.title);
    setImageUrl(item.imageUrl);
    setTargetUrl(item.targetUrl || '');
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
    const payload: WorkshopBannerRequest = {
      title,
      imageUrl,
      targetUrl,
      displayOrder: Number(displayOrder),
      status,
    };
    if (selectedItem) {
      updateMutation.mutate({ id: selectedItem.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const columns: Column<WorkshopBanner>[] = [
    { header: 'Order', accessor: 'displayOrder', className: 'w-16 font-mono font-bold' },
    {
      header: 'Preview',
      cell: (row) => (
        <div className="w-16 h-10 rounded border border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center">
          {row.imageUrl ? (
            <img src={row.imageUrl} alt={row.title} className="w-full h-full object-cover" />
          ) : (
            <Image className="w-4 h-4 text-slate-400" />
          )}
        </div>
      ),
    },
    {
      header: 'Title & Target',
      cell: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.title}</p>
          {row.targetUrl && (
            <a href={row.targetUrl} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
              <ExternalLink className="w-3 h-3" /> {row.targetUrl}
            </a>
          )}
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
          <h2 className="text-xl font-bold text-slate-900">Workshop Banners</h2>
          <p className="text-xs text-slate-500 mt-1">
            Promotional workshop banners, event posters, and session links.
          </p>
        </div>
        <Button variant="primary" onClick={openCreateModal} icon={<Plus className="w-4 h-4" />}>
          Add Workshop Banner
        </Button>
      </div>

      <DataTable columns={columns} data={banners} loading={isLoading} emptyMessage="No workshop banners configured." />

      <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedItem ? 'Edit Workshop Banner' : 'Add Workshop Banner'}>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <Input label="Banner Title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Hands-on Agentic AI Workshop" />

          {/* Image Upload / URL Input */}
          <div className="space-y-2">
            <Input label="Image URL" required value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/banner.jpg" />
            <div className="flex items-center gap-3 pt-1">
              <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-md hover:bg-indigo-100 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? 'Uploading...' : 'Upload Image File'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
              </label>
              {imageUrl && <span className="text-xs text-emerald-600 font-medium">✓ Image Attached</span>}
            </div>
          </div>

          <Input label="Target Redirect URL (Optional)" type="url" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} placeholder="https://giai2027.org/workshops/agentic-ai" />

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
        message="Are you sure you want to delete this workshop banner?"
        loading={deleteMutation.isPending}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};
