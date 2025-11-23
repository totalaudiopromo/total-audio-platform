import React from 'react';
import { clsx } from 'clsx';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  className?: string;
}

/**
 * TAP DataTable Component
 *
 * Simple table for displaying structured data.
 * - Slate styling with subtle borders
 * - Hover states on rows
 * - Responsive horizontal scroll
 */
export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  className,
}: DataTableProps<T>) {
  return (
    <div className={clsx('overflow-x-auto', className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-tap-border">
            {columns.map((column) => (
              <th
                key={column.key}
                className={clsx(
                  'text-left px-4 py-3 text-sm font-semibold text-tap-slate-200',
                  'bg-tap-slate-800/50',
                  column.className
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={keyExtractor(item, index)}
              className="border-b border-tap-border-subtle hover:bg-tap-slate-800/50 transition-colors duration-tap"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={clsx(
                    'px-4 py-3 text-sm text-tap-slate-300',
                    column.className
                  )}
                >
                  {column.render ? column.render(item) : item[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
