import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, Lock, User, AlertCircle } from 'lucide-react';

export const MasterLogin: React.FC = () => {
  const { masterLogin } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>('masteradmin');
  const [password, setPassword] = useState<string>('Password@123');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await masterLogin(username, password);
      navigate('/master/conferences');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100 items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white text-center">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center mx-auto mb-3 text-white shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold">Master Admin Authentication</h2>
          <p className="text-xs text-slate-400 mt-1">Multi-Tenant System Master Portal</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Input
            label="Master Username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            icon={<User className="w-4 h-4" />}
            placeholder="masteradmin"
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            placeholder="••••••••"
          />

          <Button type="submit" variant="primary" className="w-full" loading={loading}>
            Sign In as Master Admin
          </Button>

          <div className="pt-4 border-t border-slate-100 text-center">
            <Link
              to="/conference-login"
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Switch to Conference Admin OTP Login →
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
