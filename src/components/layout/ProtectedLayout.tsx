import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Role } from '@/types/auth.types';
import { Loader2, ShieldAlert } from 'lucide-react';
import { Button } from '../ui/Button';

interface ProtectedLayoutProps {
  allowedRoles?: Role[];
}

export const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ allowedRoles }) => {
  const { authenticated, loading, role, logout } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-sm font-medium text-slate-600">Verifying session security...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/conference-login" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Access Restricted (403 Forbidden)</h2>
        <p className="text-sm text-slate-600 max-w-md mb-6">
          Your account role (<span className="font-semibold text-slate-800">{role}</span>) does not have sufficient permission to access this administration module.
        </p>
        <Button variant="secondary" onClick={() => logout()}>
          Return to Login
        </Button>
      </div>
    );
  }

  return <Outlet />;
};
