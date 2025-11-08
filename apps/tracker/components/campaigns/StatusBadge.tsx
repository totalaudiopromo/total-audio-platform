export function StatusBadge({
  status,
}: {
  status: 'draft' | 'active' | 'paused' | 'completed';
}) {
  const styles: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800 border-gray-300',
    active: 'bg-teal-100 text-teal-800 border-teal-600',
    paused: 'bg-orange-100 text-orange-800 border-orange-600',
    completed: 'bg-green-100 text-green-800 border-green-600',
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${styles[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
