import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aboutApi } from '@/api/about.api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Toast, ToastMessage } from '@/components/ui/Toast';
import { FileText, Save, Trash2, Eye } from 'lucide-react';

export const AboutConferencePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  const { data: aboutData, isLoading } = useQuery({
    queryKey: ['about-conference'],
    queryFn: aboutApi.getAbout,
  });

  useEffect(() => {
    if (aboutData) {
      setTitle(aboutData.title || '');
      setDescription(aboutData.description || '');
    }
  }, [aboutData]);

  const saveMutation = useMutation({
    mutationFn: (payload: { title: string; description: string }) => {
      if (aboutData?.id) {
        return aboutApi.updateAbout(payload);
      }
      return aboutApi.createAbout(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about-conference'] });
      setToast({ id: Date.now().toString(), type: 'success', message: 'About conference content saved successfully!' });
    },
    onError: (err: any) => {
      setToast({ id: Date.now().toString(), type: 'error', message: err?.response?.data?.message || 'Failed to save content' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: aboutApi.deleteAbout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about-conference'] });
      setTitle('');
      setDescription('');
      setToast({ id: Date.now().toString(), type: 'success', message: 'Content cleared.' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({ title, description });
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">About Conference Content</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage the primary conference narrative, theme, scope, and objectives.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            icon={<Eye className="w-4 h-4" />}
          >
            {isPreviewMode ? 'Edit Mode' : 'Live Preview'}
          </Button>
          {aboutData && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => deleteMutation.mutate()}
              icon={<Trash2 className="w-4 h-4" />}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        {isPreviewMode ? (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-slate-900">{title || 'Untitled Conference'}</h3>
            <div className="prose prose-slate max-w-none text-slate-700 whitespace-pre-line text-sm leading-relaxed border-t border-slate-100 pt-4">
              {description || 'No description provided.'}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Conference Main Title / Headline"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. International Conference on Generative AI & Agentic AI (GIAI 2027)"
            />

            <Textarea
              label="Conference Overview & Detailed Narrative"
              required
              rows={12}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter comprehensive conference background, topics covered, target audience, key highlights..."
            />

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <Button type="submit" variant="primary" loading={saveMutation.isPending} icon={<Save className="w-4 h-4" />}>
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};
