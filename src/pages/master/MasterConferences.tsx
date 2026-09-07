import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { masterConferenceApi } from '@/api/masterConference.api';
import { Conference, ConferenceCreateRequest } from '@/types/conference.types';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge';
import { Toast, ToastMessage } from '@/components/ui/Toast';
import { Plus, Edit2, Globe, Building } from 'lucide-react';

export const MasterConferences: React.FC = () => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedConf, setSelectedConf] = useState<Conference | null>(null);

  // Form State
  const [organizationId, setOrganizationId] = useState<number>(1);
  const [shortName, setShortName] = useState<string>('');
  const [desiredUserName, setDesiredUserName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [conferenceDate, setConferenceDate] = useState<string>('');
  const [conferenceUrl, setConferenceUrl] = useState<string>('');

  const { data: conferences = [], isLoading } = useQuery({
    queryKey: ['master-conferences'],
    queryFn: masterConferenceApi.listConferences,
  });

  const { data: organizations = [] } = useQuery({
    queryKey: ['organizations'],
    queryFn: masterConferenceApi.listOrganizations,
  });

  const createMutation = useMutation({
    mutationFn: masterConferenceApi.createConference,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-conferences'] });
      setToast({ id: Date.now().toString(), type: 'success', message: 'Conference created successfully!' });
      closeModal();
    },
    onError: (err: any) => {
      setToast({ id: Date.now().toString(), type: 'error', message: err?.response?.data?.message || 'Failed to create conference' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => masterConferenceApi.updateConference(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['master-conferences'] });
      setToast({ id: Date.now().toString(), type: 'success', message: 'Conference updated successfully!' });
      closeModal();
    },
    onError: (err: any) => {
      setToast({ id: Date.now().toString(), type: 'error', message: err?.response?.data?.message || 'Failed to update conference' });
    },
  });

  const openCreateModal = () => {
    setSelectedConf(null);
    setOrganizationId(organizations[0]?.id || 1);
    setShortName('');
    setDesiredUserName('');
    setEmail('');
    setConferenceDate('');
    setConferenceUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (conf: Conference) => {
    setSelectedConf(conf);
    setOrganizationId(conf.organizationId);
    setShortName(conf.shortName);
    setDesiredUserName(conf.desiredUserName);
    setEmail(conf.email);
    setConferenceDate(conf.conferenceDate);
    setConferenceUrl(conf.conferenceUrl || '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedConf(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedConf) {
      updateMutation.mutate({
        id: selectedConf.id,
        data: {
          shortName,
          desiredUserName,
          email,
          conferenceDate,
          conferenceUrl,
          status: selectedConf.status,
        },
      });
    } else {
      const payload: ConferenceCreateRequest = {
        organizationId: Number(organizationId),
        shortName,
        desiredUserName,
        email,
        conferenceDate,
        conferenceUrl,
      };
      createMutation.mutate(payload);
    }
  };

  const columns: Column<Conference>[] = [
    { header: 'ID', accessor: 'id', className: 'w-16 font-mono' },
    {
      header: 'Conference',
      cell: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.shortName}</p>
          {row.conferenceUrl && (
            <a
              href={row.conferenceUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-indigo-600 hover:underline flex items-center gap-1 mt-0.5"
            >
              <Globe className="w-3 h-3" /> {row.conferenceUrl}
            </a>
          )}
        </div>
      ),
    },
    { header: 'Admin User', accessor: 'desiredUserName' },
    { header: 'Email', accessor: 'email' },
    { header: 'Date', accessor: 'conferenceDate' },
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
        <Button variant="outline" size="sm" onClick={() => openEditModal(row)} icon={<Edit2 className="w-3.5 h-3.5" />}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Master Conference Management</h2>
          <p className="text-xs text-slate-500 mt-1">
            Provision and manage tenant conferences across organizations.
          </p>
        </div>
        <Button variant="primary" onClick={openCreateModal} icon={<Plus className="w-4 h-4" />}>
          Provision Conference
        </Button>
      </div>

      {/* Table */}
      <DataTable columns={columns} data={conferences} loading={isLoading} emptyMessage="No conferences created yet." />

      {/* Create / Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={selectedConf ? 'Edit Conference' : 'Provision New Conference'}>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {!selectedConf && (
            <Select
              label="Organization Tenant"
              required
              value={organizationId}
              onChange={(e) => setOrganizationId(Number(e.target.value))}
              options={organizations.map((org) => ({ label: `${org.name} (${org.code})`, value: org.id }))}
            />
          )}

          <Input
            label="Conference Short Name (Identifier)"
            required
            value={shortName}
            onChange={(e) => setShortName(e.target.value)}
            placeholder="e.g. GIAI2027"
          />

          <Input
            label="Desired Admin Username"
            required
            value={desiredUserName}
            onChange={(e) => setDesiredUserName(e.target.value)}
            placeholder="e.g. giai2027_admin"
          />

          <Input
            label="Conference Admin Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@giai2027.org"
          />

          <Input
            label="Conference Date"
            type="date"
            required
            value={conferenceDate}
            onChange={(e) => setConferenceDate(e.target.value)}
          />

          <Input
            label="Conference Website URL"
            type="url"
            value={conferenceUrl}
            onChange={(e) => setConferenceUrl(e.target.value)}
            placeholder="https://giai2027.org"
          />

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
            <Button variant="outline" type="button" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" loading={createMutation.isPending || updateMutation.isPending}>
              {selectedConf ? 'Save Changes' : 'Provision Conference'}
            </Button>
          </div>
        </form>
      </Modal>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};
