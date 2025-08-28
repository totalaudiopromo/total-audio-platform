import { useEffect, useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import Link from 'next/link';
import Image from 'next/image';

interface AirtableRecord {
  id: string;
  fields: {
    [key: string]: any;
    Email?: string;
    'First Name'?: string;
    'Last Name'?: string;
    Station?: string;
    'Contact Type'?: string;
    Status?: string;
    'Last Engagement'?: string;
    Region?: string;
    Genres?: string[];
    'Publication Tier'?: string;
    'Contact Method'?: string;
    'Response Rate'?: number;
    Photo?: string;
    'Campaign Replies'?: string;
    Influencer?: boolean;
    Playlisting?: boolean;
    Press?: boolean;
    Radio?: boolean;
    'Promo Reply'?: string;
  };
}

const STATUS_OPTIONS = ['Active', 'Opted-out', 'Unsubscribed', 'VIP'];
const GENRE_OPTIONS = [
  'All', 'Electronic', 'Dance', 'Pop', 'Indie', 'Alternative', 'Hip-Hop', 'R&B / Soul', 
  'Jazz / Funk', 'Rock', 'Punk', 'Singer-Songwriter', 'Experimental', 'Ambient / Chill', 
  'World / Global', 'Reggae / Dub', 'Synthpop'
];
const REGION_OPTIONS = [
  'UK', 'USA', 'CANADA', 'AUSTRALIA', 'EUROPE', 'ASIA', 'Other',
];
const TIER_OPTIONS = ['Tier 1', 'Tier 2', 'Tier 3'];

// Enhanced color scheme mapping
const LABEL_COLORS: Record<string, string> = {
  'Campaign Replies': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Influencer: 'bg-amber-100 text-amber-800 border-amber-200',
  Playlisting: 'bg-purple-100 text-purple-800 border-purple-200',
  Press: 'bg-green-100 text-green-800 border-green-200',
  Radio: 'bg-blue-100 text-blue-800 border-blue-200',
  'Promo Reply: Positive': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Promo Reply: Negative': 'bg-red-100 text-red-800 border-red-200',
};

export default function ContactsPage() {
  // Remove useEffect and API call, use static data
  const [records] = useState<AirtableRecord[]>([
    {
      id: '1',
      fields: {
        Email: 'sarah.johnson@musicweekly.com',
        'First Name': 'Sarah',
        'Last Name': 'Johnson',
        Station: 'Music Weekly',
        'Contact Type': 'Journalist',
        Status: 'Active',
        'Last Engagement': '2024-01-15',
        Region: 'UK',
        Genres: ['Electronic', 'Dance'],
        'Publication Tier': 'Tier 1',
        'Contact Method': 'Email',
        'Response Rate': 85,
        Photo: '',
        'Campaign Replies': 'Campaign Replies',
        Influencer: true,
        Playlisting: true,
        Press: true,
        Radio: false,
        'Promo Reply': 'Positive',
      },
    },
    // Add more mock contacts as needed
  ]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [genreFilter, setGenreFilter] = useState<string[]>([]);
  const [regionFilter, setRegionFilter] = useState('');
  const [tierFilter, setTierFilter] = useState('');
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({ from: '', to: '' });

  // Enhanced filtering logic with better search
  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const f = rec.fields;
      
      // Enhanced global search across all fields
      const searchableText = [
        f['First Name'] || '',
        f['Last Name'] || '',
        f.Email || '',
        f.Station || '',
        f['Contact Type'] || '',
        f.Status || '',
        f.Region || '',
        f['Publication Tier'] || '',
        ...(f.Genres || []),
        f['Campaign Replies'] || '',
        f['Promo Reply'] || ''
      ].join(' ').toLowerCase();
      
      const globalMatch = globalFilter === '' || searchableText.includes(globalFilter.toLowerCase());
      
      const statusMatch = statusFilter.length === 0 || (f.Status && statusFilter.includes(f.Status));
      const genreMatch = genreFilter.length === 0 || genreFilter.includes('All') || 
        (f.Genres && genreFilter.some((g) => (f.Genres || []).includes(g)));
      const regionMatch = regionFilter === '' || f.Region === regionFilter;
      const tierMatch = tierFilter === '' || f['Publication Tier'] === tierFilter;
      
      let dateMatch = true;
      if (dateRange.from || dateRange.to) {
        const date = f['Last Engagement'] ? new Date(f['Last Engagement']) : null;
        if (dateRange.from && (!date || date < new Date(dateRange.from))) dateMatch = false;
        if (dateRange.to && (!date || date > new Date(dateRange.to))) dateMatch = false;
      }
      
      return globalMatch && statusMatch && genreMatch && regionMatch && tierMatch && dateMatch;
    });
  }, [records, globalFilter, statusFilter, genreFilter, regionFilter, tierFilter, dateRange]);

  // Restore columns definition
  const columns = useMemo(
    () => [
      {
        accessorKey: 'Photo',
        header: '',
        cell: ({ row }: any) => (
          <AvatarCell record={row.original.fields} />
        ),
        size: 48,
      },
      {
        accessorKey: 'Name',
        header: 'Name',
        cell: ({ row }: any) => (
          <div className="space-y-1">
            <div className="font-semibold text-gray-900">
              {row.original.fields['First Name'] || ''} {row.original.fields['Last Name'] || ''}
            </div>
            <div className="text-sm text-gray-500 font-medium">{row.original.fields.Email}</div>
          </div>
        ),
      },
      {
        accessorKey: 'Station',
        header: 'Publication/Station',
        cell: ({ row }: any) => (
          <div className="truncate max-w-[160px] font-medium text-gray-700" title={row.original.fields.Station || ''}>
            {row.original.fields.Station || '-'}
          </div>
        ),
      },
      {
        accessorKey: 'Genres',
        header: 'Primary Genre',
        cell: ({ row }: any) => (
          <div className="flex flex-wrap gap-1">
            {(row.original.fields.Genres || []).slice(0, 2).map((g: string, i: number) => (
              <span key={i} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-xs font-medium border border-indigo-200">
                {g}
              </span>
            ))}
            {(row.original.fields.Genres || []).length > 2 && (
              <span className="text-xs text-gray-500">+{(row.original.fields.Genres || []).length - 2} more</span>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'Region',
        header: 'Region',
        cell: ({ row }: any) => (
          <div className="font-medium text-gray-700">
            {row.original.fields.Region || '-'}
          </div>
        ),
      },
      {
        accessorKey: 'Status',
        header: 'Status',
        cell: ({ row }: any) => <StatusBadge status={row.original.fields.Status} />,
      },
      {
        accessorKey: 'Last Engagement',
        header: 'Last Engagement',
        cell: ({ row }: any) => (
          <div className="text-sm text-gray-600">
            {row.original.fields['Last Engagement']
              ? <ClientRelativeDate dateString={row.original.fields['Last Engagement']} />
              : '-'}
          </div>
        ),
      },
      {
        accessorKey: 'Contact Method',
        header: 'Contact Method',
        cell: ({ row }: any) => <ContactMethodIcons method={row.original.fields['Contact Method']} />,
      },
      {
        accessorKey: 'Response Rate',
        header: 'Response Rate',
        cell: ({ row }: any) => (
          <div className="font-medium">
            {row.original.fields['Response Rate'] !== undefined
              ? `${row.original.fields['Response Rate']}%`
              : '-'}
          </div>
        ),
      },
      {
        accessorKey: 'Tags',
        header: 'Tags',
        cell: ({ row }: any) => <LabelBadges fields={row.original.fields} />,
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredRecords,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <Image src="/assets/totalaudiopromo-dog-logo.jpg" alt="Total Audio Promo Logo" width={40} height={40} className="rounded-lg shadow-sm" />
                <span className="text-lg font-bold text-gray-700">Total Audio Promo</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  Contacts Database
                </h1>
                <p className="text-gray-600 text-sm">
                  Manage your PR contacts and journalist relationships
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <nav className="flex items-center gap-6">
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 font-medium">Dashboard</Link>
                <Link href="/contacts" className="text-gray-600 hover:text-gray-900 font-medium">Contacts</Link>
                <Link href="/campaigns" className="text-gray-600 hover:text-gray-900 font-medium">Campaigns</Link>
                <Link href="/analytics" className="text-gray-600 hover:text-gray-900 font-medium">Reports</Link>
                <Link href="/integrations" className="text-gray-600 hover:text-gray-900 font-medium">Integrations</Link>
              </nav>
              <div className="text-right">
                <div className="text-xl font-bold text-gray-900">{filteredRecords.length}</div>
                <div className="text-xs text-gray-500">Total Contacts</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Button */}
        <div className="mb-6">
          <Link href="/dashboard" className="bg-gray-900 text-white rounded-lg px-6 py-2 text-md font-semibold shadow hover:bg-gray-800 transition-all">← Back to Dashboard</Link>
        </div>
        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {/* Search - Made smaller and more proportional */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '16px', height: '16px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90 backdrop-blur-sm text-sm"
                  placeholder="Search contacts..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                />
              </div>
            </div>

            {/* Genre Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
              <MultiSelect
                options={GENRE_OPTIONS}
                value={genreFilter}
                onChange={setGenreFilter}
                placeholder="Select genres"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <MultiSelect
                options={STATUS_OPTIONS}
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="Select status"
              />
            </div>

            {/* Region Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
              <Dropdown
                options={REGION_OPTIONS}
                value={regionFilter}
                onChange={setRegionFilter}
                placeholder="Select region"
              />
            </div>

            {/* Tier Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Publication Tier</label>
              <Dropdown
                options={TIER_OPTIONS}
                value={tierFilter}
                onChange={setTierFilter}
                placeholder="Select tier"
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </div>
        </div>

        {/* Table */}
        {(
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200/50">
                <thead className="bg-gray-50/90 backdrop-blur-sm">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-white/70 backdrop-blur-sm divide-y divide-gray-200/30">
                  {table.getRowModel().rows.map((row, index) => (
                    <tr 
                      key={row.id} 
                      className={`hover:bg-blue-50/60 transition-all duration-200 ${
                        index % 2 === 0 ? 'bg-white/40' : 'bg-gray-50/40'
                      }`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Empty State */}
            {filteredRecords.length === 0 && (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No contacts found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AvatarCell({ record }: { record: any }) {
  if (record.Photo) {
    return (
      <div className="flex items-center">
        <img 
          src={record.Photo} 
          alt="avatar" 
          className="w-10 h-10 rounded-full border-2 border-blue-200 shadow-sm object-cover" 
        />
      </div>
    );
  }
  
  // Improved initials logic
  const firstName = record['First Name'] || '';
  const lastName = record['Last Name'] || '';
  const email = record.Email || '';
  
  let initials = '';
  if (firstName && lastName) {
    initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  } else if (firstName) {
    initials = firstName.charAt(0).toUpperCase();
  } else if (lastName) {
    initials = lastName.charAt(0).toUpperCase();
  } else if (email) {
    initials = email.charAt(0).toUpperCase();
  } else {
    initials = '?';
  }
  
  const colors = [
    'bg-gradient-to-br from-blue-500 to-blue-600',
    'bg-gradient-to-br from-green-500 to-green-600',
    'bg-gradient-to-br from-purple-500 to-purple-600',
    'bg-gradient-to-br from-red-500 to-red-600',
    'bg-gradient-to-br from-yellow-500 to-yellow-600',
    'bg-gradient-to-br from-pink-500 to-pink-600',
    'bg-gradient-to-br from-indigo-500 to-indigo-600',
    'bg-gradient-to-br from-emerald-500 to-emerald-600'
  ];
  const colorIndex = (firstName + lastName + email).length % colors.length;
  
  return (
    <div className="flex items-center">
      <div className={`w-10 h-10 rounded-full border-2 border-white shadow-lg ${colors[colorIndex]} flex items-center justify-center text-white font-bold text-sm`}>
        {initials}
      </div>
    </div>
  );
}

function LabelBadges({ fields }: { fields: any }) {
  const badges = [];
  if (fields['Campaign Replies']) badges.push({ label: 'Campaign Replies', value: fields['Campaign Replies'] });
  if (fields.Influencer) badges.push({ label: 'Influencer' });
  if (fields.Playlisting) badges.push({ label: 'Playlisting' });
  if (fields.Press) badges.push({ label: 'Press' });
  if (fields.Radio) badges.push({ label: 'Radio' });
  if (fields['Promo Reply'] === 'Positive') badges.push({ label: 'Promo Reply: Positive' });
  if (fields['Promo Reply'] === 'Negative') badges.push({ label: 'Promo Reply: Negative' });
  
  return (
    <div className="flex flex-wrap gap-1">
      {badges.slice(0, 3).map((b, i) => (
        <span
          key={i}
          className={`px-2 py-1 rounded-md text-xs font-semibold border ${LABEL_COLORS[b.label] || 'bg-gray-100 text-gray-800 border-gray-200'}`}
        >
          {b.label}
        </span>
      ))}
      {badges.length > 3 && (
        <span className="text-xs text-gray-500 font-medium">+{badges.length - 3} more</span>
      )}
    </div>
  );
}

function MultiSelect({ options, value, onChange, placeholder }: any) {
  return (
    <select
      multiple
      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90 backdrop-blur-sm text-sm"
      value={value}
      onChange={(e) => {
        const selected = Array.from(e.target.selectedOptions, (o: any) => o.value);
        onChange(selected);
      }}
    >
      <option value="">{placeholder}</option>
      {options.map((opt: string) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

function Dropdown({ options, value, onChange, placeholder }: any) {
  return (
    <select
      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90 backdrop-blur-sm text-sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {options.map((opt: string) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

function DateRangePicker({ value, onChange }: any) {
  return (
    <div className="flex gap-3 items-center">
      <div className="flex-1">
        <label className="block text-xs font-medium text-gray-700 mb-1">From</label>
        <input
          type="date"
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90 backdrop-blur-sm text-sm"
          value={value.from}
          onChange={(e) => onChange({ ...value, from: e.target.value })}
        />
      </div>
      <div className="flex-1">
        <label className="block text-xs font-medium text-gray-700 mb-1">To</label>
        <input
          type="date"
          className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90 backdrop-blur-sm text-sm"
          value={value.to}
          onChange={(e) => onChange({ ...value, to: e.target.value })}
        />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  let color = 'bg-gray-100 text-gray-800 border-gray-200';
  if (status === 'Active') color = 'bg-emerald-100 text-emerald-800 border-emerald-200';
  else if (status === 'Unsubscribed') color = 'bg-red-100 text-red-800 border-red-200';
  else if (status === 'Opted-out') color = 'bg-amber-100 text-amber-800 border-amber-200';
  else if (status === 'VIP') color = 'bg-purple-100 text-purple-800 border-purple-200';
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${color}`}>
      {status || '-'}
    </span>
  );
}

function ContactMethodIcons({ method }: { method?: string }) {
  if (!method) return <span className="text-gray-400">-</span>;
  
  const iconMap: Record<string, { icon: string; color: string; label: string }> = {
    email: { icon: '📧', color: 'text-blue-600', label: 'Email' },
    phone: { icon: '📞', color: 'text-green-600', label: 'Phone' },
    social: { icon: '💬', color: 'text-purple-600', label: 'Social' },
  };
  
  const config = iconMap[method] || { icon: '📱', color: 'text-gray-600', label: method };
  
  return (
    <span className={`text-lg ${config.color}`} title={config.label}>
      {config.icon}
    </span>
  );
}

function relativeDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return `${diff} days ago`;
  if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
  if (diff < 365) return `${Math.floor(diff / 30)} months ago`;
  return date.toLocaleDateString();
} 

// Add ClientRelativeDate helper
function ClientRelativeDate({ dateString }: { dateString: string }) {
  const [relative, setRelative] = useState('');
  useEffect(() => {
    setRelative(relativeDate(dateString));
  }, [dateString]);
  return <>{relative}</>;
} 