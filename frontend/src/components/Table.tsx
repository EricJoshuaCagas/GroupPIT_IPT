import React from 'react';
import { motion } from 'framer-motion';

interface TableProps<T> {
  columns: Array<{
    key: keyof T;
    label: string;
    render?: (value: T[keyof T], row: T) => React.ReactNode;
  }>;
  data: T[];
  keyExtractor: (row: T, index: number) => string | number;
  loading?: boolean;
  emptyMessage?: string;
}

export const Table = React.forwardRef<HTMLDivElement, TableProps<any>>(
  (
    {
      columns,
      data,
      keyExtractor,
      loading = false,
      emptyMessage = 'No data available',
    },
    ref
  ) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="h-8 w-8 rounded-full border-4 border-primary-100 border-t-primary-500"
          />
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className="flex items-center justify-center py-12">
          <p className="text-lg text-text-secondary">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div ref={ref} className="overflow-x-auto rounded-xl border border-border shadow-sm">
        <table className="w-full">
          <thead className="border-b border-border bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-dark"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-white">
            {data.map((row, index) => (
              <motion.tr
                key={keyExtractor(row, index)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.2 }}
                whileHover={{ backgroundColor: 'rgba(20, 184, 166, 0.04)' }}
                className="transition-colors duration-200"
              >
                {columns.map((column) => {
                  const value = row[column.key];
                  const rendered = column.render ? column.render(value, row) : value;
                  return (
                    <td
                      key={`${keyExtractor(row, index)}-${String(column.key)}`}
                      className="px-6 py-4 text-sm text-text-primary"
                    >
                      {rendered}
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);

Table.displayName = 'Table';
