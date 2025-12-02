import { createClient } from '@/lib/supabase/server';
import { PageContainer } from '@/components/layout/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  MapPinIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

// Fetch coverage data from Supabase
async function getCoverageData(userId: string) {
  const supabase = await createClient();

  // Fetch campaigns with coverage-related data
  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('id, title, status, created_at, performance_score, artist_name, genre')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  // Fetch campaign activities for coverage events
  const { data: activities } = await supabase
    .from('campaign_activities')
    .select(
      `
      id,
      activity_type,
      description,
      timestamp,
      importance,
      platform,
      contact_name,
      contact_org,
      campaign_id,
      campaigns!inner(title, user_id, artist_name)
    `
    )
    .order('timestamp', { ascending: false })
    .limit(50);

  // Type for joined campaign data
  type CampaignJoin = { title: string; user_id: string; artist_name?: string };

  // Filter activities to user's campaigns
  const userActivities =
    activities?.filter(a => {
      const campaign = a.campaigns as unknown as CampaignJoin | null;
      return campaign?.user_id === userId;
    }) || [];

  // Calculate coverage metrics
  const totalCampaigns = campaigns?.length || 0;
  const activeCampaigns = campaigns?.filter(c => c.status === 'active').length || 0;
  const avgPerformance =
    (campaigns?.reduce((acc, c) => acc + (c.performance_score || 0), 0) || 0) /
    (totalCampaigns || 1);

  // Group activities by type for coverage breakdown
  const coverageByType = userActivities.reduce(
    (acc, activity) => {
      const type = activity.activity_type || 'other';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Extract unique platforms/outlets
  const platforms = [...new Set(userActivities.map(a => a.platform).filter(Boolean))];
  const organisations = [...new Set(userActivities.map(a => a.contact_org).filter(Boolean))];

  return {
    overview: {
      totalEvents: userActivities.length,
      countriesReached: 1, // UK-focused for now
      citiesReached: Math.max(1, activeCampaigns),
      coverageScore: Math.round(avgPerformance) || 0,
      activeCampaigns,
      totalCampaigns,
    },
    breakdown: coverageByType,
    platforms: platforms.slice(0, 10),
    organisations: organisations.slice(0, 10),
    recentEvents: userActivities.slice(0, 20).map(a => {
      const campaign = a.campaigns as unknown as CampaignJoin;
      return {
        id: a.id,
        type: a.activity_type,
        description: a.description,
        timestamp: a.timestamp,
        importance: a.importance,
        platform: a.platform,
        contactName: a.contact_name,
        contactOrg: a.contact_org,
        campaignTitle: campaign?.title,
        artistName: campaign?.artist_name,
      };
    }),
    campaigns:
      campaigns?.map(c => ({
        id: c.id,
        title: c.title,
        status: c.status,
        artistName: c.artist_name,
        genre: c.genre,
        performanceScore: c.performance_score,
      })) || [],
  };
}

// Fallback data for unauthenticated users
function getDefaultCoverageData() {
  return {
    overview: {
      totalEvents: 0,
      countriesReached: 0,
      citiesReached: 0,
      coverageScore: 0,
      activeCampaigns: 0,
      totalCampaigns: 0,
    },
    breakdown: {},
    platforms: [],
    organisations: [],
    recentEvents: [],
    campaigns: [],
  };
}

export default async function CoveragePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const data = user ? await getCoverageData(user.id) : getDefaultCoverageData();

  return (
    <PageContainer>
      <SectionHeader
        title="Coverage"
        description="Geographic reach and media coverage across your campaigns"
      />

      <div className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <ChartBarIcon className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{data.overview.totalEvents}</p>
                <p className="text-sm text-slate-500">Total Events</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <GlobeAltIcon className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {data.overview.countriesReached}
                </p>
                <p className="text-sm text-slate-500">Countries</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <MapPinIcon className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{data.overview.citiesReached}</p>
                <p className="text-sm text-slate-500">Cities</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <BuildingOfficeIcon className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{data.overview.coverageScore}%</p>
                <p className="text-sm text-slate-500">Score</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Coverage Breakdown */}
          <Card>
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">Coverage by Type</h3>
            </div>
            <div className="p-4">
              {Object.keys(data.breakdown).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(data.breakdown).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-slate-700 capitalize">{type.replace(/_/g, ' ')}</span>
                      <Badge variant="slate">{count}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">
                  No coverage data yet. Start a campaign to track coverage.
                </p>
              )}
            </div>
          </Card>

          {/* Platforms & Outlets */}
          <Card>
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">Platforms & Outlets</h3>
            </div>
            <div className="p-4">
              {data.platforms.length > 0 || data.organisations.length > 0 ? (
                <div className="space-y-4">
                  {data.platforms.length > 0 && (
                    <div>
                      <p className="text-xs uppercase text-slate-500 mb-2">Platforms</p>
                      <div className="flex flex-wrap gap-2">
                        {data.platforms.map(platform => (
                          <Badge key={platform} variant="teal">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {data.organisations.length > 0 && (
                    <div>
                      <p className="text-xs uppercase text-slate-500 mb-2">Organisations</p>
                      <div className="flex flex-wrap gap-2">
                        {data.organisations.map(org => (
                          <Badge key={org} variant="amber">
                            {org}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-slate-500 text-sm">
                  No platforms tracked yet. Coverage will appear here as you run campaigns.
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Recent Coverage Events */}
        <Card>
          <div className="p-4 border-b border-slate-200">
            <h3 className="font-semibold text-slate-900">Recent Coverage Events</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {data.recentEvents.length > 0 ? (
              data.recentEvents.map(event => (
                <div key={event.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{event.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {event.campaignTitle && (
                          <Badge variant="slate" size="sm">
                            {event.campaignTitle}
                          </Badge>
                        )}
                        {event.platform && (
                          <Badge variant="teal" size="sm">
                            {event.platform}
                          </Badge>
                        )}
                        {event.contactOrg && (
                          <span className="text-xs text-slate-500">{event.contactOrg}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <Badge
                        variant={
                          event.importance === 'high'
                            ? 'amber'
                            : event.importance === 'medium'
                              ? 'teal'
                              : 'slate'
                        }
                        size="sm"
                      >
                        {event.importance || 'normal'}
                      </Badge>
                      {event.timestamp && (
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(event.timestamp).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <GlobeAltIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No coverage events yet</p>
                <p className="text-sm text-slate-400 mt-1">
                  Coverage events will appear here as your campaigns gain traction
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Campaign Coverage Summary */}
        {data.campaigns.length > 0 && (
          <Card>
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">Campaign Coverage Summary</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="text-left p-3 text-xs uppercase text-slate-500 font-medium">
                      Campaign
                    </th>
                    <th className="text-left p-3 text-xs uppercase text-slate-500 font-medium">
                      Artist
                    </th>
                    <th className="text-left p-3 text-xs uppercase text-slate-500 font-medium">
                      Genre
                    </th>
                    <th className="text-left p-3 text-xs uppercase text-slate-500 font-medium">
                      Status
                    </th>
                    <th className="text-right p-3 text-xs uppercase text-slate-500 font-medium">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.campaigns.map(campaign => (
                    <tr key={campaign.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-medium text-slate-900">{campaign.title}</td>
                      <td className="p-3 text-slate-600">{campaign.artistName || '-'}</td>
                      <td className="p-3 text-slate-600">{campaign.genre || '-'}</td>
                      <td className="p-3">
                        <Badge variant={campaign.status === 'active' ? 'teal' : 'slate'} size="sm">
                          {campaign.status}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        <span className="font-medium text-slate-900">
                          {campaign.performanceScore || 0}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
