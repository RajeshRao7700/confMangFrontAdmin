import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { speakersApi } from '@/api/speakers.api';
import { filesApi } from '@/api/files.api';
import { Speaker, SpeakerCategory, SpeakerRequest } from '@/types/people.types';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge';
import { Toast, ToastMessage } from '@/components/ui/Toast';
import { Plus, Edit2, Trash2, UserCheck, Upload, User } from 'lucide-react';
import { clsx } from 'clsx';

export const SpeakersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const activeCategoryParam = searchParams.get('category') as SpeakerCategory | null;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Speaker | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Form State
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [designation, setDesignation] = useState<string>('');
  const [organization, setOrganization] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [category, setCategory] = useState<SpeakerCategory>(SpeakerCategory.KEYNOTE);
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [status, setStatus] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);

  const { data: speakers = [], isLoading } = useQuery({
    queryKey: ['speakers', activeCategoryParam],
    queryFn: () => speakersApi.list(activeCategoryParam || undefined),
  });

  const createMutation = useMutation({
    mutationFn: speakersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['speakers'] });
      setToast({ id: Date.now().toString(), type: 'success', message: 'Speaker created successfully!' });
      closeModal();
    },
    onError: (err: any) => {
      setToast({ id: Date.now().toString(), type: 'error', message: err?.response?.data?.message || 'Failed to create speaker' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: SpeakerRequest }) => speakersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['speakers'] });
      setToast({ id: Date.now().toString(), type: 'success', message: 'Speaker updated successfully!' });
      closeModal();
    },
    onError: (err: any) => {
      setToast({ id: Date.now().toString(), type: 'error', message: err?.response?.data?.message || 'Failed to update speaker' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: speakersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['speakers'] });
      setToast({ id: Date.now().toString(), type: 'success', message: 'Speaker deleted.' });
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
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setDesignation('');
    setOrganization('');
    setCountry('');
    setBio('');
    setPhotoUrl('');
    setCategory(activeCategoryParam || SpeakerCategory.KEYNOTE);
    setDisplayOrder(speakers.length);
    setStatus(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: Speaker) => {
    setSelectedItem(item);
    setFirstName(item.firstName);
    setLastName(item.lastName || '');
    setEmail(item.email || '');
    setPhone(item.phone || '');
    setDesignation(item.designation || '');
    setOrganization(item.organization || '');
    setCountry(item.country || '');
    setBio(item.bio || '');
    setPhotoUrl(item.photoUrl || '');
    setCategory(item.category);
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
    const payload: SpeakerRequest = {
      firstName,
      lastName,
      email,
      phone,
      designation,
      organization,
      country,
      bio,
      photoUrl,
      category,
      displayOrder: Number(displayOrder),
      status,
    };

    if (selectedItem) {
      updateMutation.mutate({ id: selectedItem.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const categoriesList = [
    { label: 'All Categories', value: '' },
    { label: 'Signed Up', value: SpeakerCategory.SIGNED_UP },
    { label: 'Plenary', value: SpeakerCategory.PLENARY },
    { label: 'Keynote', value: SpeakerCategory.KEYNOTE },
    { label: 'Invited', value: SpeakerCategory.INVITED },
    { label: 'YRF', value: SpeakerCategory.YRF },
    { label: 'Featured', value: SpeakerCategory.FEATURED },
    { label: 'Delegate', value: SpeakerCategory.DELEGATE },
    { label: 'Poster', value: SpeakerCategory.POSTER },
    { label: 'Unable to Attend', value: SpeakerCategory.UNABLE_TO_ATTEND },
  ];

  const columns: Column<Speaker>[] = [
    { header: 'Order', accessor: 'displayOrder', className: 'w-16 font-mono font-bold' },
    {
      header: 'Photo',
      cell: (row) => (
        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-300 flex items-center justify-center">
          {row.photoUrl ? (
            <img src={row.photoUrl} alt={row.firstName} className="w-full h-full object-cover" />
          ) : (
            <User className="w-5 h-5 text-slate-400" />
          )}
        </div>
      ),
    },
    {
      header: 'Speaker Name',
      cell: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.firstName} {row.lastName}</p>
          <p className="text-xs text-slate-500">{row.designation} {row.organization && `• ${row.organization}`}</p>
        </div>
      ),
    },
    { header: 'Country', accessor: 'country' },
    {
      header: 'Category',
      cell: (row) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
          {row.category}
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Conference Speakers</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage keynote, plenary, invited, delegate, poster, and registered speakers.
          </p>
        </div>
        <Button variant="primary" onClick={openCreateModal} icon={<Plus className="w-4 h-4" />}>
          Add Speaker
        </Button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-medium scrollbar-thin">
        {categoriesList.map((cat) => {
          const isActive = (activeCategoryParam === cat.value) || (!activeCategoryParam && !cat.value);
          return (
            <button
              key={cat.value}
              onClick={() => {
                if (cat.value) {
                  setSearchParams({ category: cat.value });
                } else {
                  setSearchParams({});
                }
              }}
              className={clsx(
                'px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors',
                isActive
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              )}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <DataTable columns={columns} data={speakers} loading={isLoading} emptyMessage="No speakers found for this category." />

      {/* Create / Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedItem ? 'Edit Speaker' : 'Add Speaker'} maxWidth="xl">
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Dr. John" />
            <Input label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Smith" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@university.edu" />
            <Input label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555-0199" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input label="Designation" value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="Professor & Chair" />
            <Input label="Organization / Institute" value={organization} onChange={(e) => setOrganization(e.target.value)} placeholder="Harvard University" />
            <Input label="Country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="United States" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Speaker Category"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value as SpeakerCategory)}
              options={Object.values(SpeakerCategory).map((cat) => ({ label: cat, value: cat }))}
            />
            <Input label="Display Order" type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} />
          </div>

          <div className="space-y-2">
            <Input label="Photo URL" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="https://example.com/speaker.jpg" />
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-md hover:bg-indigo-100">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? 'Uploading...' : 'Upload Speaker Photo'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
              </label>
              {photoUrl && <span className="text-xs text-emerald-600 font-medium">✓ Photo Attached</span>}
            </div>
          </div>

          <Textarea label="Speaker Biography" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Keynote speaker research profile..." />

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Status</label>
            <select className="w-full rounded-md border border-slate-300 p-2 text-sm" value={status ? 'true' : 'false'} onChange={(e) => setStatus(e.target.value === 'true')}>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
            <Button variant="outline" type="button" onClick={closeModal}>Cancel</Button>
            <Button variant="primary" type="submit" loading={createMutation.isPending || updateMutation.isPending}>Save Speaker</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        message="Are you sure you want to delete this speaker?"
        loading={deleteMutation.isPending}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};
