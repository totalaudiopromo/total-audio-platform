import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
// import { Loader2, TrendingUp, Search, Users, BarChart3, Globe, Zap } from 'lucide-react';

interface SEOToolsData {
  trends?: any;
  keywords?: any[];
  competitors?: any[];
  analysis?: any;
  report?: any;
}

interface FreeSEOToolsIntegrationProps {
  className?: string;
}

export default function FreeSEOToolsIntegration({ className }: FreeSEOToolsIntegrationProps) {
  const [activeTab, setActiveTab] = useState('trends');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SEOToolsData>({});
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [lastQuery, setLastQuery] = useState('');

  const features = [
    {
      icon: '📈',
      title: 'Google Trends',
      description: 'Track keyword trends and interest over time',
      color: 'text-blue-600'
    },
    {
      icon: '🔍',
      title: 'Keyword Research',
      description: 'Find related keywords and search volume',
      color: 'text-green-600'
    },
    {
      icon: '👥',
      title: 'Competitor Analysis',
      description: 'Analyze competitor strategies and gaps',
      color: 'text-purple-600'
    },
    {
      icon: '📊',
      title: 'Domain Analysis',
      description: 'Comprehensive SEO analysis and scoring',
      color: 'text-orange-600'
    },
    {
      icon: '🌐',
      title: 'Geographic Interest',
      description: 'See where your keywords are popular',
      color: 'text-red-600'
    },
    {
      icon: '⚡',
      title: 'Free & Fast',
      description: 'No API costs, instant results',
      color: 'text-emerald-600'
    }
  ];

  const fetchData = async (endpoint: string, query: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/free-seo-tools/${endpoint}/${encodeURIComponent(query)}`);
      const result = await response.json();
      
      if (result.success) {
        setData(prev => ({ ...prev, [endpoint]: result.data }));
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
      case 'trends':
        fetchData('trends', inputValue);
        break;
      case 'keywords':
        fetchData('keywords', inputValue);
        break;
      case 'competitors':
        fetchData('competitors', inputValue);
        break;
      case 'analysis':
        fetchData('analyze', inputValue);
        break;
      case 'report':
        fetchData('report', inputValue);
        break;
    }
  };

  const renderTrendsData = () => {
    if (!data.trends) return null;
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{data.trends.interest}</div>
              <p className="text-xs text-muted-foreground">Interest Score</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold capitalize">{data.trends.trend}</div>
              <p className="text-xs text-muted-foreground">Trend Direction</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{data.trends.relatedQueries?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Related Queries</p>
            </CardContent>
          </Card>
        </div>
        
        {data.trends.relatedQueries && data.trends.relatedQueries.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Related Queries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {data.trends.relatedQueries.slice(0, 10).map((query: string, index: number) => (
                  <Badge key={index} variant="secondary">{query}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  const renderKeywordsData = () => {
    if (!data.keywords) return null;
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.keywords.slice(0, 9).map((keyword: any, index: number) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{keyword.keyword}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Volume:</span>
                    <span className="text-xs font-medium">{keyword.searchVolume}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Difficulty:</span>
                    <Badge variant={keyword.difficulty === 'low' ? 'default' : keyword.difficulty === 'medium' ? 'secondary' : 'destructive'}>
                      {keyword.difficulty}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderCompetitorsData = () => {
    if (!data.competitors) return null;
    
    return (
      <div className="space-y-4">
        {data.competitors.map((competitor: any, index: number) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{competitor.domain}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-2xl font-bold">{competitor.estimatedTraffic?.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Est. Traffic</p>
                </div>
                <div>
                  <div className="text-2xl font-bold">{competitor.topKeywords?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">Top Keywords</p>
                </div>
                <div>
                  <div className="text-2xl font-bold">{competitor.contentGaps?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">Content Gaps</p>
                </div>
                <div>
                  <div className="text-2xl font-bold">{competitor.linkOpportunities?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">Link Opportunities</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderAnalysisData = () => {
    if (!data.analysis) return null;
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{data.analysis.score}/100</div>
              <p className="text-xs text-muted-foreground">SEO Score</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{data.analysis.metrics?.estimatedTraffic?.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Est. Traffic</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{data.analysis.metrics?.topKeywords}</div>
              <p className="text-xs text-muted-foreground">Top Keywords</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{data.analysis.metrics?.contentGaps}</div>
              <p className="text-xs text-muted-foreground">Content Gaps</p>
            </CardContent>
          </Card>
        </div>
        
        {data.analysis.issues && data.analysis.issues.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Issues Found</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {data.analysis.issues.map((issue: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm">{issue}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
        
        {data.analysis.recommendations && data.analysis.recommendations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {data.analysis.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="h-5 w-5 text-emerald-600">⚡</span>
            Free SEO Tools Integration
          </CardTitle>
          <CardDescription>
            Access powerful SEO analysis tools without any API costs. Get keyword research, 
            competitor analysis, and domain insights using free Google APIs and public data sources.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                 <span className={`h-5 w-5 mt-0.5 ${feature.color}`}>{feature.icon}</span>
                <div>
                  <h4 className="font-medium text-sm">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter keyword or domain..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={loading || !inputValue.trim()}>
                {loading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin">⏳</span>
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
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
              <TabsTrigger value="competitors">Competitors</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="report">Report</TabsTrigger>
            </TabsList>

            {error && (
              <Alert className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <TabsContent value="trends" className="mt-4">
              {renderTrendsData()}
            </TabsContent>

            <TabsContent value="keywords" className="mt-4">
              {renderKeywordsData()}
            </TabsContent>

            <TabsContent value="competitors" className="mt-4">
              {renderCompetitorsData()}
            </TabsContent>

            <TabsContent value="analysis" className="mt-4">
              {renderAnalysisData()}
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
                        <span className="mr-2 h-4 w-4 animate-spin">⏳</span>
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

          {/* Cost Savings Info */}
          <Card className="mt-6 bg-emerald-50 border-emerald-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-4 w-4 text-emerald-600">⚡</span>
                <span className="font-medium text-emerald-800">Cost Savings</span>
              </div>
              <p className="text-sm text-emerald-700">
                This integration uses free Google APIs and public data sources, 
                saving you hundreds of dollars in monthly API costs compared to 
                paid SEO tools.
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
} 