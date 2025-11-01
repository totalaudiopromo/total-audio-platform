'use client';

export function IntelligenceBar({ patterns }: { patterns: any[] }) {
  if (patterns.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-3">
          YOUR INSIGHTS
        </h3>
        <p className="text-gray-400">
          Add campaigns to see your performance patterns
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-sm font-medium text-gray-500 mb-3">YOUR INSIGHTS</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              Strong Timing Performance
            </p>
            <p className="text-xs text-gray-500">
              Your 6-week advance pitching outperforms industry average
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
