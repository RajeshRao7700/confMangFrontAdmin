import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { abstractsApi } from '@/api/abstracts.api';
import { AbstractSubmission, AbstractSubmissionStatus } from '@/types/transactions.types';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge';
import { Toast, ToastMessage } from '@/components/ui/Toast';
import { Search, Eye, CheckCircle2 } from 'lucide-react';

export const AbstractsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const [page, setPage] = useState<number>(0);
  const [search, setSearch] = useState<string>('');

  const [selectedAbstract, setSelectedAbstract] = useState<AbstractSubmission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newStatus, setNewStatus] = useState<AbstractSubmissionStatus>(AbstractSubmissionStatus.ACCEPTED);
  const [reviewComments, setReviewComments] = useState<string>('');

  const { data: abstractData, isLoading } = useQuery({
    queryKey: ['abstracts', page, search],
    queryFn: () => abstractsApi.list(page, 15, search || undefined),
  });

  const statusMutation = useMutation({
    mutationFn: () => {
      if (!selectedAbstract) throw new Error('No abstract selected');
      return abstractsApi.updateStatus(selectedAbstract.id, newStatus, reviewComments);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['abstracts'] });
      setToast({ id: Date.now().toString(), type: 'success', message: 'Abstract status updated!' });
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      setToast({ id: Date.now().toString(), type: 'error', message: err?.response?.data?.message || 'Failed to update abstract status' });
    },
  });

  const openReviewModal = (item: AbstractSubmission) => {
    setSelectedAbstract(item);
    setNewStatus(item.submissionStatus);
    setReviewComments(item.reviewComments || '');
    setIsModalOpen(true);
  };

  const columns: Column<AbstractSubmission>[] = [
    { header: 'Abstract #', accessor: 'abstractNumber', className: 'font-mono font-bold w-28 text-indigo-700' },
    {
      header: 'Title & Keywords',
      cell: (row) => (
        <div>
          <p className="font-semibold text-slate-900 line-clamp-1">{row.title}</p>
          {row.keywords && <p className="text-xs text-slate-500 italic">Keywords: {row.keywords}</p>}
        </div>
      ),
    },
    {
      header: 'Author / Contact',
      cell: (row) => (
        <div>
          <p className="font-semibold text-slate-900 line-clamp-1">{row.authorName || '—'}</p>
          <p className="text-xs text-slate-500">{row.authorEmail || '—'}</p>
          {row.authorOrganization && <p className="text-xs text-slate-400">{row.authorOrganization}</p>}
        </div>
      ),
    },
    { header: 'Presentation', accessor: 'presentationType' },
    {
      header: 'Submission Status',
      cell: (row) => (
        <Badge variant={getStatusBadgeVariant(row.submissionStatus)}>
          {row.submissionStatus}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <Button variant="outline" size="sm" onClick={() => openReviewModal(row)} icon={<Eye className="w-3.5 h-3.5" />}>
          Review & Decision
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Abstract Submissions</h2>
          <p className="text-xs text-slate-500 mt-1">
            Peer review, acceptance workflow, presentation assignment, and scientific decisioning.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs max-w-md">
        <Input
          placeholder="Search by title, abstract #, keywords..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          icon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={abstractData?.content || []}
        loading={isLoading}
        emptyMessage="No abstracts submitted."
        pagination={{
          page: abstractData?.number || 0,
          totalPages: abstractData?.totalPages || 1,
          totalElements: abstractData?.totalElements,
          onPageChange: (p) => setPage(p),
        }}
      />

      {/* Decision Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Abstract Review & Status Update" maxWidth="xl">
        {selectedAbstract && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              statusMutation.mutate();
            }}
            className="space-y-4 py-2"
          >
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <span className="font-mono text-xs font-bold text-indigo-700">{selectedAbstract.abstractNumber}</span>
              <h4 className="font-bold text-slate-900 text-sm">{selectedAbstract.title}</h4>
              <p className="text-xs text-slate-600 line-clamp-4 pt-1 whitespace-pre-line">{selectedAbstract.abstractText}</p>
            </div>

            {/* Author Information Card */}
            {(selectedAbstract.authorName || selectedAbstract.authorEmail) && (
              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-lg text-xs space-y-1.5">
                <span className="font-semibold text-indigo-900 uppercase tracking-wider text-[10px]">Author Information</span>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div><strong className="text-slate-900">Name:</strong> {selectedAbstract.authorName || '—'}</div>
                  <div><strong className="text-slate-900">Email:</strong> {selectedAbstract.authorEmail || '—'}</div>
                  {selectedAbstract.authorPhone && <div><strong className="text-slate-900">Phone:</strong> {selectedAbstract.authorPhone}</div>}
                  {selectedAbstract.authorOrganization && <div><strong className="text-slate-900">Organization:</strong> {selectedAbstract.authorOrganization}</div>}
                  {selectedAbstract.authorCountry && <div><strong className="text-slate-900">Country:</strong> {selectedAbstract.authorCountry}</div>}
                  {selectedAbstract.registrationId && <div><strong className="text-slate-900">Linked Reg ID:</strong> #{selectedAbstract.registrationId}</div>}
                </div>
              </div>
            )}

            <Select
              label="Review Decision / Status"
              required
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as AbstractSubmissionStatus)}
              options={Object.values(AbstractSubmissionStatus).map((st) => ({ label: st, value: st }))}
            />

            <Textarea
              label="Peer Review Comments & Feedback"
              rows={3}
              value={reviewComments}
              onChange={(e) => setReviewComments(e.target.value)}
              placeholder="Comments sent to author regarding scientific decision..."
            />

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
              <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button variant="primary" type="submit" loading={statusMutation.isPending} icon={<CheckCircle2 className="w-4 h-4" />}>
                Save Review Decision
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};
