/**
 * Digest Section Header Component
 * Styled header for digest sections
 */

interface DigestSectionHeaderProps {
  title: string;
  count?: number;
  icon?: string;
}

export function DigestSectionHeader({ title, count, icon }: DigestSectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
      <div className="flex items-center space-x-3">
        {icon && <span className="text-2xl">{icon}</span>}
        <h2 className="text-xl font-bold text-slate-100">{title}</h2>
        {count !== undefined && (
          <span className="px-2 py-1 bg-[#3AA9BE]/20 text-[#3AA9BE] border border-[#3AA9BE]/30 rounded text-sm font-mono">
            {count}
          </span>
        )}
      </div>
    </div>
  );
}
