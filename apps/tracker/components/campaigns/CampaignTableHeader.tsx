'use client';

import { ChevronUp, ChevronDown } from 'lucide-react';

export type SortField =
  | 'name'
  | 'artist_name'
  | 'platform'
  | 'status'
  | 'performance_score'
  | 'budget'
  | 'success_rate'
  | 'start_date'
  | 'client_name';

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

interface ColumnConfig {
  key: SortField | 'checkbox' | 'actions' | 'open_rate' | 'reply_rate';
  label: string;
  sortable: boolean;
  className?: string;
  hideOnTablet?: boolean;
}

const columns: ColumnConfig[] = [
  { key: 'checkbox', label: '', sortable: false, className: 'w-12' },
  {
    key: 'name',
    label: 'Campaign',
    sortable: true,
    className: 'min-w-[200px]',
  },
  { key: 'platform', label: 'Platform', sortable: true, className: 'w-28' },
  { key: 'status', label: 'Status', sortable: true, className: 'w-28' },
  {
    key: 'performance_score',
    label: 'Health',
    sortable: true,
    className: 'w-32',
  },
  { key: 'budget', label: 'Budget', sortable: true, className: 'w-24' },
  { key: 'success_rate', label: 'Success', sortable: true, className: 'w-24' },
  {
    key: 'open_rate',
    label: 'Open %',
    sortable: false,
    className: 'w-20',
    hideOnTablet: true,
  },
  {
    key: 'reply_rate',
    label: 'Reply %',
    sortable: false,
    className: 'w-20',
    hideOnTablet: true,
  },
  { key: 'start_date', label: 'Start Date', sortable: true, className: 'w-28' },
  {
    key: 'client_name',
    label: 'Client',
    sortable: true,
    className: 'w-32',
    hideOnTablet: true,
  },
  { key: 'actions', label: '', sortable: false, className: 'w-16' },
];

interface CampaignTableHeaderProps {
  sortConfig: SortConfig | null;
  onSort: (field: SortField) => void;
  onSelectAll: () => void;
  allSelected: boolean;
  someSelected: boolean;
}

export function CampaignTableHeader({
  sortConfig,
  onSort,
  onSelectAll,
  allSelected,
  someSelected,
}: CampaignTableHeaderProps) {
  const renderSortIndicator = (field: string) => {
    if (!sortConfig || sortConfig.field !== field) {
      return <div className="w-4" />;
    }

    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  return (
    <thead className="bg-gray-50 border-b-4 border-black">
      <tr>
        {columns.map(column => (
          <th
            key={column.key}
            className={`px-4 py-3 text-left text-xs font-black text-gray-700 uppercase tracking-wider ${
              column.sortable
                ? 'cursor-pointer hover:bg-gray-100 transition-colors select-none'
                : ''
            } ${column.className || ''} ${
              column.hideOnTablet ? 'hidden xl:table-cell' : ''
            }`}
            onClick={() => {
              if (
                column.sortable &&
                column.key !== 'checkbox' &&
                column.key !== 'actions'
              ) {
                onSort(column.key as SortField);
              }
            }}
          >
            {column.key === 'checkbox' ? (
              <input
                type="checkbox"
                checked={allSelected}
                ref={input => {
                  if (input) {
                    input.indeterminate = someSelected && !allSelected;
                  }
                }}
                onChange={onSelectAll}
                aria-label="Select all campaigns"
                className="h-4 w-4 rounded border-2 border-black text-teal-600 focus:ring-teal-500 focus:ring-offset-0"
              />
            ) : column.sortable ? (
              <div className="flex items-center gap-1">
                <span>{column.label}</span>
                {renderSortIndicator(column.key)}
              </div>
            ) : (
              column.label
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export { columns };
