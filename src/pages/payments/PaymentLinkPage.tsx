import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { registrationsApi } from '@/api/registrations.api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Toast, ToastMessage } from '@/components/ui/Toast';
import { CreditCard, Copy, Check, Link as LinkIcon, ShieldCheck } from 'lucide-react';

export const PaymentLinkPage: React.FC = () => {
  const [registrationId, setRegistrationId] = useState<string>('');
  const [result, setResult] = useState<{ link: string; ref: string } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const mutation = useMutation({
    mutationFn: (id: number) => registrationsApi.generatePaymentLink(id),
    onSuccess: (res) => {
      setResult({ link: res.paymentLink, ref: res.paymentReference });
      setToast({ id: Date.now().toString(), type: 'success', message: 'Payment link generated successfully!' });
    },
    onError: (err: any) => {
      setToast({ id: Date.now().toString(), type: 'error', message: err?.response?.data?.message || 'Failed to generate payment link.' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registrationId) return;
    mutation.mutate(Number(registrationId));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Generate Payment Link</h2>
            <p className="text-xs text-slate-500">
              Create a secure, trackable payment checkout link for an attendee registration.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Registration ID"
            type="number"
            required
            value={registrationId}
            onChange={(e) => setRegistrationId(e.target.value)}
            placeholder="Enter numeric Registration ID (e.g. 1)"
            icon={<LinkIcon className="w-4 h-4" />}
            helperText="The payment link will be linked directly to this registration record."
          />

          <Button type="submit" variant="primary" loading={mutation.isPending} icon={<CreditCard className="w-4 h-4" />}>
            Generate Payment Link
          </Button>
        </form>

        {/* Result Card */}
        {result && (
          <div className="p-5 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-4">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <span>Payment Link Ready</span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div>
                <span className="text-slate-500 uppercase font-semibold block">Payment Reference:</span>
                <span className="font-bold text-slate-900 text-sm">{result.ref}</span>
              </div>
              <div>
                <span className="text-slate-500 uppercase font-semibold block">Checkout URL:</span>
                <p className="text-indigo-700 font-medium break-all bg-white p-2.5 rounded border border-indigo-200">
                  {result.link}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(result.link)}
              icon={copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            >
              {copied ? 'Copied URL!' : 'Copy Payment Link'}
            </Button>
          </div>
        )}
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};
