import {
  CampaignCardSkeleton,
  DashboardStatsSkeleton,
  IntegrationsSkeleton,
} from '@/components/ui/SkeletonLoader';

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <header className="w-full border-b-4 border-black bg-white shadow-brutal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded-xl w-24 animate-pulse"></div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero Message Skeleton */}
        <div className="mb-8 animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-96 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-72"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <DashboardStatsSkeleton />

        {/* Integrations Skeleton */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
          <IntegrationsSkeleton />
          <IntegrationsSkeleton />
        </div>

        {/* Campaign List Skeleton */}
        <div className="bg-white rounded-2xl p-6 md:p-8 border-4 border-black shadow-brutal">
          <div className="flex justify-between items-center mb-8 animate-pulse">
            <div>
              <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-64"></div>
            </div>
            <div className="flex gap-3">
              <div className="h-12 bg-gray-200 rounded-xl w-32"></div>
              <div className="h-12 bg-gray-200 rounded-xl w-40"></div>
            </div>
          </div>

          <div className="space-y-6">
            <CampaignCardSkeleton />
            <CampaignCardSkeleton />
            <CampaignCardSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
