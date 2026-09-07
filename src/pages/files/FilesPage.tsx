import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { filesApi } from '@/api/files.api';
import { FileCategory, FileEntityType, FileMetadata } from '@/types/files.types';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Toast, ToastMessage } from '@/components/ui/Toast';
import { Upload, Download, Trash2, FileText, File, Image as ImageIcon } from 'lucide-react';

export const FilesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const [page, setPage] = useState<number>(0);
  const [filterCategory, setFilterCategory] = useState<FileCategory | ''>('');
  const [filterEntity, setFilterEntity] = useState<FileEntityType | ''>('');

  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState<FileCategory>(FileCategory.PDF);
  const [entityType, setEntityType] = useState<FileEntityType>(FileEntityType.CONFERENCE);
  const [entityId, setEntityId] = useState<string>('');

  const { data: filesData, isLoading } = useQuery({
    queryKey: ['files', page, filterCategory, filterEntity],
    queryFn: () => filesApi.listFiles(page, 15, filterCategory || undefined, filterEntity || undefined),
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile) throw new Error('Please select a file');
      return filesApi.uploadFile(
        selectedFile,
        category,
        entityType,
        entityId ? Number(entityId) : undefined
      );
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      setToast({ id: Date.now().toString(), type: 'success', message: res.message || 'File uploaded successfully!' });
      closeUploadModal();
    },
    onError: (err: any) => {
      setToast({ id: Date.now().toString(), type: 'error', message: err?.response?.data?.message || 'File upload failed' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: filesApi.deleteFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      setToast({ id: Date.now().toString(), type: 'success', message: 'File deleted.' });
      setDeleteId(null);
    },
  });

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
    setSelectedFile(null);
    setEntityId('');
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const getFileIcon = (cat?: FileCategory) => {
    if (cat === FileCategory.PDF) return <FileText className="w-5 h-5 text-rose-500" />;
    if (cat === FileCategory.IMAGE) return <ImageIcon className="w-5 h-5 text-sky-500" />;
    return <File className="w-5 h-5 text-slate-400" />;
  };

  const columns: Column<FileMetadata>[] = [
    { header: 'ID', accessor: 'id', className: 'w-16 font-mono font-bold' },
    {
      header: 'File Name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          {getFileIcon(row.fileCategory)}
          <div>
            <p className="font-semibold text-slate-900 line-clamp-1">{row.originalFileName}</p>
            <p className="text-[11px] text-slate-400">{row.contentType || 'binary'}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Size',
      cell: (row) => <span className="text-xs font-mono text-slate-700">{formatFileSize(row.fileSize)}</span>,
    },
    {
      header: 'Category',
      cell: (row) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
          {row.fileCategory || 'OTHER'}
        </span>
      ),
    },
    {
      header: 'Entity Scope',
      cell: (row) => (
        <span className="text-xs text-slate-600 font-medium">
          {row.entityType || 'GLOBAL'} {row.entityId ? `#${row.entityId}` : ''}
        </span>
      ),
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <a
            href={filesApi.downloadFileUrl(row.id)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Download
          </a>
          <Button
            variant="ghost"
            size="sm"
            className="text-rose-600 hover:bg-rose-50"
            onClick={() => setDeleteId(row.id)}
            icon={<Trash2 className="w-3.5 h-3.5" />}
          >
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
          <h2 className="text-xl font-bold text-slate-900">PDF & File Repository</h2>
          <p className="text-xs text-slate-500 mt-1">
            Centralized file management for conference brochures, PDFs, images, abstracts, and receipts.
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsUploadModalOpen(true)} icon={<Upload className="w-4 h-4" />}>
          Upload New File
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="w-48">
          <Select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as FileCategory)}
            options={[
              { label: 'All Categories', value: '' },
              ...Object.values(FileCategory).map((c) => ({ label: c, value: c })),
            ]}
          />
        </div>
        <div className="w-48">
          <Select
            value={filterEntity}
            onChange={(e) => setFilterEntity(e.target.value as FileEntityType)}
            options={[
              { label: 'All Entity Types', value: '' },
              ...Object.values(FileEntityType).map((e) => ({ label: e, value: e })),
            ]}
          />
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filesData?.content || []}
        loading={isLoading}
        emptyMessage="No files found matching filters."
        pagination={{
          page: filesData?.number || 0,
          totalPages: filesData?.totalPages || 1,
          totalElements: filesData?.totalElements,
          onPageChange: (newPage) => setPage(newPage),
        }}
      />

      {/* Upload Modal */}
      <Modal isOpen={isUploadModalOpen} onClose={closeUploadModal} title="Upload File to Repository">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            uploadMutation.mutate();
          }}
          className="space-y-4 py-2"
        >
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center bg-slate-50 hover:bg-slate-100 transition-colors">
            <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <input
              type="file"
              required
              id="file-input"
              className="hidden"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
            <label htmlFor="file-input" className="cursor-pointer text-xs font-semibold text-indigo-600 hover:underline">
              {selectedFile ? selectedFile.name : 'Click to select file from device'}
            </label>
            {selectedFile && <p className="text-[11px] text-slate-500 mt-1 font-mono">{formatFileSize(selectedFile.size)}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="File Category"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value as FileCategory)}
              options={Object.values(FileCategory).map((c) => ({ label: c, value: c }))}
            />
            <Select
              label="Entity Association"
              required
              value={entityType}
              onChange={(e) => setEntityType(e.target.value as FileEntityType)}
              options={Object.values(FileEntityType).map((e) => ({ label: e, value: e }))}
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
            <Button variant="outline" type="button" onClick={closeUploadModal}>Cancel</Button>
            <Button variant="primary" type="submit" loading={uploadMutation.isPending}>Upload File</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        message="Are you sure you want to delete this file?"
        loading={deleteMutation.isPending}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};
