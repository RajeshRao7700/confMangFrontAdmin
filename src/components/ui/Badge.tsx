import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', size = 'sm' }) => {
  const base = 'inline-flex items-center font-medium rounded-full';
  
  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  const variantStyles = {
    default: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    info: 'bg-sky-50 text-sky-700 border border-sky-200',
    neutral: 'bg-slate-100 text-slate-600 border border-slate-200',
  };

  return (
    <span className={clsx(base, sizeStyles[size], variantStyles[variant])}>
      {children}
    </span>
  );
};

export const getStatusBadgeVariant = (status: string | boolean | undefined): BadgeProps['variant'] => {
  if (status === true || status === 'ACTIVE' || status === 'PAID' || status === 'ACCEPTED' || status === 'COMPLETED' || status === 'ISSUED') {
    return 'success';
  }
  if (status === 'PENDING' || status === 'UNDER_REVIEW' || status === 'DRAFT') {
    return 'warning';
  }
  if (status === false || status === 'CANCELLED' || status === 'FAILED' || status === 'REJECTED' || status === 'VOID' || status === 'WITHDRAWN') {
    return 'danger';
  }
  if (status === 'REFUNDED' || status === 'INACTIVE') {
    return 'neutral';
  }
  return 'default';
};
