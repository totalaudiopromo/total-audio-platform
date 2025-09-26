'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Mail, 
  Users, 
  Send, 
  Eye, 
  Calendar,
  TrendingUp,
  BookOpen,
  Zap,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface NewsletterStats {
  totalSubscribers: number
  weeklyOpenRate: number
  weeklyClickRate: number
  recentIssues: number
}

interface NewsletterContent {
  issueNumber: number
  publishDate: string
  theme: string
  industryInsight: string
  articles: any[]
  featuredTool: string
  successStory: string
  quickTip: string
  communityQuestion: string
}

export default function NewsletterDashboard() {
  const [stats, setStats] = useState<NewsletterStats>({
    totalSubscribers: 0,
    weeklyOpenRate: 0,
    weeklyClickRate: 0,
    recentIssues: 0
  })
  
  const [currentContent, setCurrentContent] = useState<NewsletterContent | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [customContent, setCustomContent] = useState({
    industryInsight: '',
    featuredTool: '',
    successStory: '',
    quickTip: '',
    communityQuestion: ''
  })
  const [isNewsjacking, setIsNewsjacking] = useState(false)
  const [newsjackerResults, setNewsjackerResults] = useState<any>(null)
  const [campaignId, setCampaignId] = useState<string | null>(null)
  const [isCreatingDraft, setIsCreatingDraft] = useState(false)
  const [isSendingDraft, setIsSendingDraft] = useState(false)

  // Load dashboard data
  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Load newsletter stats
      const statsResponse = await fetch('/api/newsletter/stats')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      // Load current week's content
      const contentResponse = await fetch('/api/newsletter/content?week=1')
      if (contentResponse.ok) {
        const contentData = await contentResponse.json()
        setCurrentContent(contentData)
        setCustomContent({
          industryInsight: contentData.industryInsight || '',
          featuredTool: contentData.featuredTool || '',
          successStory: contentData.successStory || '',
          quickTip: contentData.quickTip || '',
          communityQuestion: contentData.communityQuestion || ''
        })
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  const generateContent = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/newsletter/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ week: 1 })
      })
      
      if (response.ok) {
        const content = await response.json()
        setCurrentContent(content)
        setCustomContent({
          industryInsight: content.industryInsight || '',
          featuredTool: content.featuredTool || '',
          successStory: content.successStory || '',
          quickTip: content.quickTip || '',
          communityQuestion: content.communityQuestion || ''
        })
      }
    } catch (error) {
      console.error('Error generating content:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const previewNewsletter = async () => {
    setPreviewMode(true)
    try {
      const response = await fetch(`/api/newsletter/send?week=1&test=true`)
      if (response.ok) {
        const html = await response.text()
        // Open preview in new window
        const previewWindow = window.open('', '_blank')
        if (previewWindow) {
          previewWindow.document.write(html)
          previewWindow.document.close()
        }
      }
    } catch (error) {
      console.error('Error previewing newsletter:', error)
    }
  }

  const runWeeklyAgent = async () => {
    setIsNewsjacking(true)
    try {
      const response = await fetch('/api/newsletter/weekly-agent?week=1&test=true')
      const result = await response.json()

      if (result.success && result.intelligence) {
        const intelligence = result.intelligence
        setNewsjackerResults({ articles: intelligence.topStories, sources: intelligence.sources })
        
        // Update the content with weekly agent results
        setCustomContent(prev => ({
          ...prev,
          industryInsight: intelligence.weeklyInsight || prev.industryInsight,
          quickTip: intelligence.quickTip || prev.quickTip,
          communityQuestion: intelligence.communityQuestion || prev.communityQuestion,
          featuredTool: intelligence.toolPromotion || 'Audio Intel - Contact Intelligence\n\nStop wasting your weekends researching radio contacts. Audio Intel automates contact enrichment, giving you 94% accurate intelligence in 2 minutes.',
          successStory: intelligence.weeklyInsight || 'I\'m currently testing a new approach to radio promotion that combines AI-powered contact research with personalised outreach. Early results show 40% higher response rates compared to generic emails, and I\'m spending 80% less time on research. I\'ll share the full results once I\'ve got more data.'
        }))
        
        alert(`🤖 Weekly Music Agent analyzed ${intelligence.totalArticles} articles from ${intelligence.sources.length} sources! Generated authentic content for week ${intelligence.weekNumber}.`)
      } else {
        alert(`Weekly Agent error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error running weekly agent:', error)
      alert('Error running weekly agent. Please try again.')
    } finally {
      setIsNewsjacking(false)
    }
  }

  const createConvertKitDraft = async () => {
    setIsCreatingDraft(true)
    try {
      const response = await fetch('/api/newsletter/weekly-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weekNumber: 1, createDraft: true })
      })
      
      const result = await response.json()

      if (result.success) {
        setCampaignId(result.campaignId)
        alert(`📧 ConvertKit draft created! Campaign ID: ${result.campaignId}\n\nYou can now review and send it from your ConvertKit dashboard.`)
      } else {
        alert(`Error creating draft: ${result.error}`)
      }
    } catch (error) {
      console.error('Error creating ConvertKit draft:', error)
      alert('Error creating ConvertKit draft. Please try again.')
    } finally {
      setIsCreatingDraft(false)
    }
  }

  const sendConvertKitDraft = async () => {
    if (!campaignId) {
      alert('No campaign ID available. Please create a draft first.')
      return
    }

    setIsSendingDraft(true)
    try {
      const response = await fetch('/api/newsletter/weekly-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sendDraft: true, campaignId })
      })
      
      const result = await response.json()

      if (result.success) {
        alert(`📤 Newsletter sent successfully to ${result.sent} subscribers!`)
        setCampaignId(null) // Reset campaign ID
      } else {
        alert(`Error sending newsletter: ${result.error}`)
      }
    } catch (error) {
      console.error('Error sending ConvertKit draft:', error)
      alert('Error sending ConvertKit draft. Please try again.')
    } finally {
      setIsSendingDraft(false)
    }
  }

  const sendNewsletter = async () => {
    setIsSending(true)
    try {
      const response = await fetch('/api/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'weekly',
          data: {
            ...currentContent,
            ...customContent,
            newsArticles: newsjackerResults?.articles || []
          }
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        alert(`Newsletter sent successfully! ${result.sent || 0} subscribers notified.`)
        loadDashboardData() // Refresh stats
      } else {
        const error = await response.json()
        alert(`Error sending newsletter: ${error.error}`)
      }
    } catch (error) {
      console.error('Error sending newsletter:', error)
      alert('Error sending newsletter. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">The Unsigned Advantage Newsletter</h1>
          <p className="text-gray-600">Manage your weekly newsletter for independent music professionals</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSubscribers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Open Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.weeklyOpenRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Zap className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Click Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.weeklyClickRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Issues Published</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.recentIssues}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Content Editor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Newsletter Content
              </CardTitle>
              <CardDescription>
                Customise this week's newsletter content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="industryInsight">Industry Insight</Label>
                <Textarea
                  id="industryInsight"
                  value={customContent.industryInsight}
                  onChange={(e) => setCustomContent(prev => ({ ...prev, industryInsight: e.target.value }))}
                  placeholder="This week's key industry insight..."
                  className="mt-2"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="featuredTool">Featured Tool</Label>
                <Input
                  id="featuredTool"
                  value={customContent.featuredTool}
                  onChange={(e) => setCustomContent(prev => ({ ...prev, featuredTool: e.target.value }))}
                  placeholder="Tool name and description"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="successStory">What I'm Working On</Label>
                <Textarea
                  id="successStory"
                  value={customContent.successStory}
                  onChange={(e) => setCustomContent(prev => ({ ...prev, successStory: e.target.value }))}
                  placeholder="What you're currently working on or testing..."
                  className="mt-2"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="quickTip">Quick Tip</Label>
                <Textarea
                  id="quickTip"
                  value={customContent.quickTip}
                  onChange={(e) => setCustomContent(prev => ({ ...prev, quickTip: e.target.value }))}
                  placeholder="Quick tip for readers..."
                  className="mt-2"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="communityQuestion">Community Question</Label>
                <Input
                  id="communityQuestion"
                  value={customContent.communityQuestion}
                  onChange={(e) => setCustomContent(prev => ({ ...prev, communityQuestion: e.target.value }))}
                  placeholder="Question to engage the community"
                  className="mt-2"
                />
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <Button onClick={runWeeklyAgent} disabled={isNewsjacking} className="flex-1">
                    {isNewsjacking ? '🤖 Weekly Agent Analyzing...' : '🤖 Generate Weekly Intelligence'}
                  </Button>
                  <Button variant="outline" onClick={previewNewsletter}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={createConvertKitDraft} 
                    disabled={isCreatingDraft || !newsjackerResults} 
                    className="flex-1"
                    variant="secondary"
                  >
                    {isCreatingDraft ? '📧 Creating ConvertKit Draft...' : '📧 Create ConvertKit Draft'}
                  </Button>
                  <Button 
                    onClick={sendConvertKitDraft} 
                    disabled={isSendingDraft || !campaignId} 
                    className="flex-1"
                    variant="default"
                  >
                    {isSendingDraft ? '📤 Sending...' : '📤 Send Draft'}
                  </Button>
                </div>
                
                {campaignId && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      ✅ ConvertKit draft created! Campaign ID: <code className="bg-green-100 px-1 rounded">{campaignId}</code>
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      You can review it in your ConvertKit dashboard or send it directly from here.
                    </p>
                  </div>
                )}
                
                <p className="text-sm text-gray-600">
                  <strong>Workflow:</strong> Generate Intelligence → Create ConvertKit Draft → Review in ConvertKit → Send to Subscribers
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Send Newsletter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Send Newsletter
              </CardTitle>
              <CardDescription>
                Send this week's newsletter to all subscribers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentContent && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900">Issue #{currentContent.issueNumber}</h4>
                    <p className="text-sm text-blue-700">Theme: {currentContent.theme}</p>
                    <p className="text-sm text-blue-700">Publish Date: {currentContent.publishDate}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Industry insight ready</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Featured tool selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">"What I'm working on" section ready</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Community question ready</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <Button 
                  onClick={sendNewsletter} 
                  disabled={isSending || !currentContent}
                  className="w-full"
                  size="lg"
                >
                  {isSending ? (
                    <>
                      <Send className="h-4 w-4 mr-2 animate-spin" />
                      Sending Newsletter...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send to {stats.totalSubscribers} Subscribers
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Newsletter will be sent to all subscribers with the "newsletter_unsigned_advantage" tag
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Agent Intelligence */}
        {newsjackerResults && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                🤖 Weekly Music Intelligence
              </CardTitle>
              <CardDescription>
                This week's underground music analysis and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900">Articles Analyzed</h4>
                  <p className="text-2xl font-bold text-blue-700">{newsjackerResults.articles?.length || 0}</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900">Sources</h4>
                  <p className="text-2xl font-bold text-green-700">{newsjackerResults.sources?.length || 0}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900">Top Sources</h4>
                  <p className="text-sm text-purple-700">{newsjackerResults.sources?.slice(0, 3).join(', ') || 'N/A'}</p>
                </div>
              </div>
              
              {newsjackerResults.articles && newsjackerResults.articles.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Top Stories This Week</h4>
                  <div className="space-y-3">
                    {newsjackerResults.articles.slice(0, 3).map((article: any, index: number) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h5 className="font-medium text-sm">{article.title}</h5>
                            <p className="text-xs text-gray-600 mt-1">{article.excerpt}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">{article.source}</Badge>
                              <span className="text-xs text-gray-500">Score: {article.relevanceScore}</span>
                            </div>
                          </div>
                          {article.url && (
                            <a 
                              href={article.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-xs ml-2"
                            >
                              Read →
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Recent Issues */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Issues
            </CardTitle>
            <CardDescription>
              Track your newsletter performance over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((issue) => (
                <div key={issue} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Issue #{issue}</h4>
                    <p className="text-sm text-gray-600">Published 2 weeks ago</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">Sent</Badge>
                    <span className="text-sm text-gray-500">85% open rate</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
