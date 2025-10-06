export function PitchAnalyser({
  pitchBody,
  contactName,
  tone
}: {
  pitchBody: string;
  contactName?: string;
  tone?: string;
}) {
  return (
    <div className="glass-panel p-6">
      <h3 className="text-lg font-semibold mb-4">Pitch Analysis</h3>
      <p className="text-sm text-gray-600">
        Analysis features coming soon...
      </p>
    </div>
  );
}
