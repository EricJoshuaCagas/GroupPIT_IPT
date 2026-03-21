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
        <div className="flex justify-center items-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full"
          />
        </div>
      );
    }

    if (data.length === 0) {
      return (
        <div className="flex justify-center items-center py-12">
          <p className="text-gray-400 text-lg">📭 {emptyMessage}</p>
        </div>
      );
    }

    return (
      <div ref={ref} className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, index) => (
              <motion.tr
                key={keyExtractor(row, index)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
                whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.02)' }}
                className="hover:shadow-sm transition-all duration-200"
              >
                {columns.map((column) => {
                  const value = row[column.key];
                  const rendered = column.render ? column.render(value, row) : value;
                  return (
                    <td
                      key={`${keyExtractor(row, index)}-${String(column.key)}`}
                      className="px-6 py-4 text-sm text-gray-800"
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
