export function StatusBadge({ status }: { status: 'draft' | 'active' | 'paused' | 'completed' }) {
  const styles: Record<string, string> = {
    draft: 'bg-slate-100 text-slate-700',
    active: 'bg-primary/10 text-primary',
    paused: 'bg-amber-100 text-amber-700',
    completed: 'bg-green-100 text-green-700',
  };
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}




