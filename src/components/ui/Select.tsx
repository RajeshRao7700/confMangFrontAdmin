import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

interface Option {
  label: string;
  value: string | number;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            {label} {props.required && <span className="text-rose-500">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={clsx(
            'block w-full rounded-md border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 py-2 px-3 bg-white text-slate-900',
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500'
              : 'border-slate-300 hover:border-slate-400',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={String(opt.value)} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-slate-500">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
