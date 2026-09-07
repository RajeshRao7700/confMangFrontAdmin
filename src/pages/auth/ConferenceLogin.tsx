import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Building, KeyRound, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';

export const ConferenceLogin: React.FC = () => {
  const { requestConferenceOtp, verifyConferenceOtp } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2>(1);
  const [shortName, setShortName] = useState<string>('GIAI2027');
  const [otp, setOtp] = useState<string>('');
  const [debugOtp, setDebugOtp] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const res = await requestConferenceOtp(shortName);
      setMessage(res.message || 'OTP sent successfully to conference admin email.');
      if (res.debugOtp) {
        setDebugOtp(res.debugOtp);
      }
      setStep(2);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Conference short name not found or inactive.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await verifyConferenceOtp(shortName, otp);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100 items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-950 p-6 text-white text-center">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center mx-auto mb-3 text-white shadow-md">
            <Building className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold">Conference Admin Sign In</h2>
          <p className="text-xs text-indigo-300 mt-1">2-Step Email OTP Authentication</p>
        </div>

        {/* Step 1: Request OTP */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="p-6 space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Input
              label="Conference Short Name"
              type="text"
              required
              value={shortName}
              onChange={(e) => setShortName(e.target.value.toUpperCase())}
              icon={<Building className="w-4 h-4" />}
              placeholder="e.g. GIAI2027"
              helperText="Enter your registered conference code (e.g. GIAI2027)"
            />

            <Button type="submit" variant="primary" className="w-full" loading={loading}>
              Send Verification OTP
            </Button>

            <div className="pt-4 border-t border-slate-100 text-center">
              <Link to="/login" className="text-xs text-slate-500 hover:text-slate-800 font-medium">
                Master Admin Login →
              </Link>
            </div>
          </form>
        )}

        {/* Step 2: Verify OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="p-6 space-y-4">
            {message && (
              <div className="flex items-start gap-2 p-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                <div>
                  <p>{message}</p>
                  {debugOtp && (
                    <p className="mt-1 font-mono font-bold text-indigo-700">
                      Debug OTP: <span className="bg-indigo-100 px-1.5 py-0.5 rounded">{debugOtp}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
              Conference: <strong className="text-slate-900">{shortName}</strong>
            </div>

            <Input
              label="6-Digit OTP Code"
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              icon={<KeyRound className="w-4 h-4" />}
              placeholder="123456"
              className="text-center tracking-widest text-lg font-mono"
            />

            <Button type="submit" variant="primary" className="w-full" loading={loading}>
              Verify & Enter Dashboard
            </Button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 pt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Short Name</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
