import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import {
  Loader2,
  TrendingUp,
  Search,
  Users,
  BarChart3,
  Globe,
  Zap,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface HybridSEOData {
  source: 'dataforseo' | 'free' | 'hybrid';
  success: boolean;
  data?: any;
  error?: string;
  cost?: number;
  performance?: {
    responseTime: number;
    dataQuality: 'high' | 'medium' | 'low';
  };
}

interface HybridSEOIntegrationProps {
  className?: string;
}

export default function HybridSEOIntegration({ className }: HybridSEOIntegrationProps) {
  const [activeTab, setActiveTab] = useState('analysis');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Record<string, HybridSEOData>>({});
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [lastQuery, setLastQuery] = useState('');
  const [costAnalysis, setCostAnalysis] = useState<any>(null);
  const [serviceStatus, setServiceStatus] = useState<any>(null);

  const features = [
    {
      icon: '📈',
      title: 'Intelligent Routing',
      description: 'Automatically chooses the best tool for each analysis',
      color: 'text-blue-600',
    },
    {
      icon: '💰',
      title: 'Cost Optimization',
      description: 'Minimizes API costs while maximizing data quality',
      color: 'text-green-600',
    },
    {
      icon: '⏰',
      title: 'Fast Fallback',
      description: 'Seamlessly switches to free tools when needed',
      color: 'text-purple-600',
    },
    {
      icon: CheckCircle,
      title: 'Best of Both',
      description: 'Combines paid accuracy with free accessibility',
      color: 'text-orange-600',
    },
  ];

  useEffect(() => {
    fetchCostAnalysis();
    fetchServiceStatus();
  }, []);

  const fetchCostAnalysis = async () => {
    try {
      const response = await fetch('/api/hybrid-seo/cost-analysis');
      const result = await response.json();
      if (result.success) {
        setCostAnalysis(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch cost analysis:', err);
    }
  };

  const fetchServiceStatus = async () => {
    try {
      const response = await fetch('/api/hybrid-seo/status');
      const result = await response.json();
      if (result.success) {
        setServiceStatus(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch service status:', err);
    }
  };

  const fetchData = async (endpoint: string, query: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/hybrid-seo/${endpoint}/${encodeURIComponent(query)}`);
      const result = await response.json();

      if (result.success) {
        setData(prev => ({ ...prev, [endpoint]: result }));
      } else {
        setError(result.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setLastQuery(inputValue);

    switch (activeTab) {
      case 'analysis':
        fetchData('analyze', inputValue);
        break;
      case 'keywords':
        fetchData('keywords', inputValue);
        break;
      case 'competitors':
        fetchData('competitors', inputValue);
        break;
      case 'trends':
        fetchData('trends', inputValue);
        break;
      case 'report':
        fetchData('report', inputValue);
        break;
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'high':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getQualityBadge = (quality: string) => {
    switch (quality) {
      case 'high':
        return <Badge className="bg-green-100 text-green-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-red-100 text-red-800">Low</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const renderAnalysisData = () => {
    const analysisData = data.analyze;
    if (!analysisData) return null;

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="h-5 w-5 text-green-600">✅</span>
              Analysis Results
            </CardTitle>
            <CardDescription>
              Source: {analysisData.source} | Cost: ${analysisData.cost || 0} | Response Time:{' '}
              {analysisData.performance?.responseTime || 0}ms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{analysisData.data?.score || 'N/A'}/100</div>
                <p className="text-xs text-muted-foreground">SEO Score</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {analysisData.data?.metrics?.estimatedTraffic?.toLocaleString() || 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">Est. Traffic</p>
              </div>
              <div className="text-center">
                {getQualityBadge(analysisData.performance?.dataQuality || 'low')}
                <p className="text-xs text-muted-foreground mt-1">Data Quality</p>
              </div>
            </div>

            {analysisData.data?.issues && analysisData.data.issues.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Issues Found:</h4>
                <ul className="space-y-1">
                  {analysisData.data.issues.map((issue: string, index: number) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <span className="h-4 w-4 text-red-500">❌</span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderKeywordsData = () => {
    const keywordsData = data.keywords;
    if (!keywordsData) return null;

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="h-5 w-5 text-blue-600">🔍</span>
              Keyword Research Results
            </CardTitle>
            <CardDescription>
              Source: {keywordsData.source} | Cost: ${keywordsData.cost || 0} | Found{' '}
              {keywordsData.data?.length || 0} keywords
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {keywordsData.data?.slice(0, 6).map((keyword: any, index: number) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="font-medium text-sm mb-2">{keyword.keyword}</div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Volume:</span>
                        <span className="font-medium">{keyword.searchVolume}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Difficulty:</span>
                        <Badge
                          variant={
                            keyword.difficulty === 'low'
                              ? 'default'
                              : keyword.difficulty === 'medium'
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {keyword.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCompetitorsData = () => {
    const competitorsData = data.competitors;
    if (!competitorsData) return null;

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="h-5 w-5 text-purple-600">👥</span>
              Competitor Analysis Results
            </CardTitle>
            <CardDescription>
              Source: {competitorsData.source} | Cost: ${competitorsData.cost || 0} | Found{' '}
              {competitorsData.data?.length || 0} competitors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {competitorsData.data?.map((competitor: any, index: number) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="font-medium mb-2">{competitor.domain}</div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="font-medium">
                          {competitor.estimatedTraffic?.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">Est. Traffic</p>
                      </div>
                      <div>
                        <div className="font-medium">{competitor.topKeywords?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">Top Keywords</p>
                      </div>
                      <div>
                        <div className="font-medium">{competitor.contentGaps?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">Content Gaps</p>
                      </div>
                      <div>
                        <div className="font-medium">
                          {competitor.linkOpportunities?.length || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">Link Opportunities</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderTrendsData = () => {
    const trendsData = data.trends;
    if (!trendsData) return null;

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="h-5 w-5 text-orange-600">📈</span>
              Trends Analysis Results
            </CardTitle>
            <CardDescription>
              Source: {trendsData.source} | Cost: ${trendsData.cost || 0} | Interest:{' '}
              {trendsData.data?.interest || 'N/A'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{trendsData.data?.interest || 'N/A'}</div>
                <p className="text-xs text-muted-foreground">Interest Score</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold capitalize">
                  {trendsData.data?.trend || 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">Trend Direction</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {trendsData.data?.relatedQueries?.length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Related Queries</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="h-5 w-5 text-blue-600">⚡</span>
            Hybrid SEO Integration
          </CardTitle>
          <CardDescription>
            Intelligent SEO analysis that combines Data for SEO with free alternatives.
            Automatically chooses the best tool for each analysis while minimizing costs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                <span className={`h-5 w-5 mt-0.5 ${feature.color}`}>{String(feature.icon)}</span>
                <div>
                  <h4 className="font-medium text-sm">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Cost Analysis */}
          {costAnalysis && (
            <Card className="mb-6 bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Cost Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-blue-800">
                      ${costAnalysis.dataForSEOCost}
                    </div>
                    <p className="text-xs text-blue-600">Data for SEO Cost</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-800">
                      ${costAnalysis.freeToolsCost}
                    </div>
                    <p className="text-xs text-green-600">Free Tools Cost</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-800">
                      ${costAnalysis.totalCost}
                    </div>
                    <p className="text-xs text-purple-600">Total Monthly Cost</p>
                  </div>
                </div>
                {costAnalysis.recommendations && costAnalysis.recommendations.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-blue-800 mb-2">Recommendations:</h4>
                    <ul className="space-y-1">
                      {costAnalysis.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="text-sm text-blue-700 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Service Status */}
          {serviceStatus && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Service Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    {serviceStatus.dataForSEOAvailable ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm">Data for SEO</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {serviceStatus.freeToolsAvailable ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm">Free Tools</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {serviceStatus.hybridMode ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm">Hybrid Mode</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter keyword or domain..."
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={loading || !inputValue.trim()}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze'
                )}
              </Button>
            </div>
          </form>

          {/* Tabs */}
          <Tabs defaultValue={activeTab} className="mt-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
              <TabsTrigger value="competitors">Competitors</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="report">Report</TabsTrigger>
            </TabsList>

            {error && (
              <Alert className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <TabsContent value="analysis" className="mt-4">
              {renderAnalysisData()}
            </TabsContent>

            <TabsContent value="keywords" className="mt-4">
              {renderKeywordsData()}
            </TabsContent>

            <TabsContent value="competitors" className="mt-4">
              {renderCompetitorsData()}
            </TabsContent>

            <TabsContent value="trends" className="mt-4">
              {renderTrendsData()}
            </TabsContent>

            <TabsContent value="report" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Comprehensive SEO Report</CardTitle>
                  <CardDescription>
                    Generate a complete SEO analysis report for {lastQuery}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => fetchData('report', lastQuery || inputValue)}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Report...
                      </>
                    ) : (
                      'Generate Full Report'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Benefits Info */}
          <Card className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-4 w-4 text-blue-600">⚡</span>
                <span className="font-medium text-blue-800">Hybrid Benefits</span>
              </div>
              <p className="text-sm text-blue-700">
                This hybrid approach intelligently routes requests to the most appropriate tool,
                ensuring you get the best data quality while minimizing costs. Free tools handle
                basic research while Data for SEO provides advanced analysis when needed.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
