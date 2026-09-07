import React from 'react';
import { Loader2, Inbox, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

export interface Column<T> {
  header: string;
  accessor?: keyof T | ((row: T) => React.ReactNode);
  cell?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  pagination?: {
    page: number;
    totalPages: number;
    totalElements?: number;
    onPageChange: (newPage: number) => void;
  };
}

export function DataTable<T extends { id?: number | string }>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No records found',
  pagination,
}: DataTableProps<T>) {
  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-xs border-b border-slate-200 tracking-wider">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} scope="col" className={`py-3.5 px-4 ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                    <span className="text-sm font-medium">Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Inbox className="w-8 h-8 text-slate-300" />
                    <span className="text-sm font-medium">{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={row.id ?? rowIndex} className="hover:bg-slate-50/80 transition-colors">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className={`py-3.5 px-4 text-slate-700 ${col.className || ''}`}>
                      {col.cell
                        ? col.cell(row)
                        : typeof col.accessor === 'function'
                        ? col.accessor(row)
                        : col.accessor
                        ? (row[col.accessor] as React.ReactNode)
                        : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50/50">
          <div className="text-xs text-slate-500">
            Page <span className="font-semibold text-slate-700">{pagination.page + 1}</span> of{' '}
            <span className="font-semibold text-slate-700">{pagination.totalPages}</span>
            {pagination.totalElements !== undefined && (
              <span> ({pagination.totalElements} total items)</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === 0 || loading}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              icon={<ChevronLeft className="w-4 h-4" />}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages - 1 || loading}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              icon={<ChevronRight className="w-4 h-4" />}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
