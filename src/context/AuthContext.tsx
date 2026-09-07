import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '@/api/auth.api';
import {
  AuthenticatedUserResponse,
  ConferenceOtpResponse,
  ConferenceOtpVerifyResponse,
  MasterLoginResponse,
  Role,
} from '@/types/auth.types';

interface AuthContextType {
  authenticated: boolean;
  loading: boolean;
  user: AuthenticatedUserResponse | null;
  role: Role | null;
  conferenceContext: { id?: number; shortName?: string } | null;
  masterLogin: (u: string, p: string) => Promise<MasterLoginResponse>;
  requestConferenceOtp: (shortName: string) => Promise<ConferenceOtpResponse>;
  verifyConferenceOtp: (shortName: string, otp: string) => Promise<ConferenceOtpVerifyResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<AuthenticatedUserResponse | null>(null);
  const [role, setRole] = useState<Role | null>(null);

  const initAuth = async () => {
    const token = localStorage.getItem('conference_admin_token');
    const storedUser = localStorage.getItem('conference_admin_user');

    if (token) {
      try {
        const userRes = await authApi.getCurrentUser();
        setUser(userRes);
        setRole(userRes.role as Role);
        setAuthenticated(true);
      } catch (err) {
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            setRole(parsed.role as Role);
            setAuthenticated(true);
          } catch {
            logout();
          }
        } else {
          logout();
        }
      }
    } else if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        setRole(parsed.role as Role);
        setAuthenticated(true);
      } catch {
        logout();
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    initAuth();

    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const masterLogin = async (username: string, password: string): Promise<MasterLoginResponse> => {
    const res = await authApi.masterLogin({ username, password });
    if (res.accessToken) {
      localStorage.setItem('conference_admin_token', res.accessToken);
    }
    const userPayload: AuthenticatedUserResponse = {
      role: res.user.role,
      organizationId: res.user.organizationId,
      organizationName: res.user.organizationName,
      username: res.user.username,
      email: `${res.user.username}@apex.com`,
    };
    setUser(userPayload);
    setRole(res.user.role);
    setAuthenticated(true);
    localStorage.setItem('conference_admin_user', JSON.stringify(userPayload));
    return res;
  };

  const requestConferenceOtp = async (shortName: string): Promise<ConferenceOtpResponse> => {
    return await authApi.requestConferenceOtp({ shortName });
  };

  const verifyConferenceOtp = async (shortName: string, otp: string): Promise<ConferenceOtpVerifyResponse> => {
    const res = await authApi.verifyConferenceOtp({ shortName, otp });
    if (res.accessToken) {
      localStorage.setItem('conference_admin_token', res.accessToken);
    }
    setUser(res.user);
    setRole(res.user.role as Role);
    setAuthenticated(true);
    localStorage.setItem('conference_admin_user', JSON.stringify(res.user));
    return res;
  };

  const logout = () => {
    localStorage.removeItem('conference_admin_token');
    localStorage.removeItem('conference_admin_user');
    setAuthenticated(false);
    setUser(null);
    setRole(null);
  };

  const conferenceContext = user?.conferenceShortName
    ? { id: user.conferenceId, shortName: user.conferenceShortName }
    : null;

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        loading,
        user,
        role,
        conferenceContext,
        masterLogin,
        requestConferenceOtp,
        verifyConferenceOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
