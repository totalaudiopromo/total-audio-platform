'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  MessageSquare, 
  FileText, 
  Check, 
  ArrowRight, 
  Star, 
  Clock, 
  TrendingUp,
  Music,
  Instagram,
  Twitter,
  Smartphone,
  Zap,
  Target,
  Users,
  ExternalLink,
  Copy,
  Edit,
  Share,
  BarChart3,
  Sparkles,
  Play
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function DemoPage() {
  const [demoStep, setDemoStep] = useState(1)
  const [musicContext, setMusicContext] = useState('Just released my new single and it\'s getting amazing feedback!')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['twitter', 'instagram'])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<{[key: string]: string}>({})

  const platforms = [
    { id: 'twitter', name: 'X/Twitter', icon: Twitter, color: 'text-blue-500' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
    { id: 'threads', name: 'Threads', icon: MessageSquare, color: 'text-gray-500' },
    { id: 'tiktok', name: 'TikTok', icon: Smartphone, color: 'text-black' }
  ]

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    )
  }

  const generateDemoContent = async () => {
    setIsGenerating(true)
    
    // Simulate API call
    setTimeout(() => {
      const mockContent = {
        twitter: "🔥 Just dropped my new single! Been working on this for months and finally ready to share it with you all. Link in bio 👆 #NewMusic #UKArtist",
        instagram: "Behind the scenes of my new single 🎵 This one's been brewing for months and I'm so excited to finally share it with you all! Link in bio for the full story 👆",
        threads: "Just dropped my new single! Been working on this for months and finally ready to share it with you all. Link in bio 👆",
        tiktok: "New single just dropped! 🔥 Been working on this for months 🎵 Link in bio 👆"
      }

      const filteredContent: {[key: string]: string} = {}
      selectedPlatforms.forEach(platform => {
        filteredContent[platform] = mockContent[platform as keyof typeof mockContent]
      })

      setGeneratedContent(filteredContent)
      setIsGenerating(false)
      setDemoStep(3)
    }, 2000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Image 
                src="/t-a-p-new dog logo.png" 
                alt="Total Audio Promo Logo" 
                width={32} 
                height={32}
                className="rounded-lg"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-black text-gray-900">Voice Echo</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Beta</Badge>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/voice-training" className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors">
              Voice Training
            </Link>
            <Link href="/content-generation" className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors">
              Content Generation
            </Link>
            <Button variant="outline" size="sm" className="font-bold border-2">
              Sign In
            </Button>
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              onClick={() => window.location.href = '/voice-training'}
            >
              Get Started
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container px-4 py-24 mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-6 bg-blue-100 text-blue-800 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Play className="w-4 h-4 mr-2" />
            Interactive Demo
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-tight">
            See Voice Echo
            <span className="block text-blue-600">In Action</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-bold">
            Experience how Voice Echo learns your authentic voice and creates platform-perfect content for X, Instagram, Threads & TikTok.
          </p>
        </div>
      </section>

      {/* Demo Interface */}
      <section className="container px-4 py-12 mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Demo Steps */}
            <div className="space-y-8">
              <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader>
                  <CardTitle className="text-2xl font-black flex items-center gap-3">
                    <Sparkles className="w-6 h-6" />
                    Step {demoStep}: {demoStep === 1 ? 'Input Your Music News' : demoStep === 2 ? 'Generate Content' : 'View Results'}
                  </CardTitle>
                  <CardDescription className="text-lg font-bold">
                    {demoStep === 1 ? 'Tell us what\'s happening with your music' : 
                     demoStep === 2 ? 'Choose platforms and generate content' : 
                     'See your platform-optimized content'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {demoStep === 1 && (
                    <div>
                      <Label htmlFor="demo-context" className="text-lg font-bold mb-2 block">
                        What's happening with your music?
                      </Label>
                      <Textarea
                        id="demo-context"
                        placeholder="e.g., Just released my new single, working on a new album, playing a show next week..."
                        className="min-h-[120px] font-mono"
                        value={musicContext}
                        onChange={(e) => setMusicContext(e.target.value)}
                      />
                      <Button
                        onClick={() => setDemoStep(2)}
                        disabled={!musicContext.trim()}
                        className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
                      >
                        <ArrowRight className="w-5 h-5 mr-2" />
                        Next: Choose Platforms
                      </Button>
                    </div>
                  )}

                  {demoStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <Label className="text-lg font-bold mb-4 block">
                          Select platforms to generate content for:
                        </Label>
                        <div className="grid grid-cols-2 gap-4">
                          {platforms.map((platform) => {
                            const Icon = platform.icon
                            return (
                              <Button
                                key={platform.id}
                                variant={selectedPlatforms.includes(platform.id) ? "default" : "outline"}
                                onClick={() => handlePlatformToggle(platform.id)}
                                className="h-auto p-4 font-bold"
                              >
                                <Icon className={`w-5 h-5 mr-2 ${platform.color}`} />
                                {platform.name}
                              </Button>
                            )
                          })}
                        </div>
                      </div>
                      
                      <Button
                        onClick={generateDemoContent}
                        disabled={selectedPlatforms.length === 0 || isGenerating}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xl py-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
                      >
                        {isGenerating ? (
                          <>
                            <Clock className="w-6 h-6 mr-2 animate-spin" />
                            Generating Content...
                          </>
                        ) : (
                          <>
                            <Zap className="w-6 h-6 mr-2" />
                            Generate Content
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {demoStep === 3 && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mx-auto mb-4">
                          <Check className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">Content Generated!</h3>
                        <p className="text-gray-700 font-bold">
                          Your platform-optimized content is ready. See the results on the right.
                        </p>
                      </div>
                      
                      <Button
                        onClick={() => setDemoStep(1)}
                        className="w-full bg-gray-600 hover:bg-gray-700 text-white font-black py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
                      >
                        Try Again
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Results Display */}
            <div className="space-y-8">
              {Object.keys(generatedContent).length > 0 && (
                <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <CardHeader>
                    <CardTitle className="text-2xl font-black flex items-center gap-3">
                      <FileText className="w-6 h-6" />
                      Generated Content
                    </CardTitle>
                    <CardDescription className="text-lg font-bold">
                      Platform-optimized content in your authentic voice
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {Object.entries(generatedContent).map(([platform, content]) => {
                      const platformInfo = platforms.find(p => p.id === platform)
                      const Icon = platformInfo?.icon || MessageSquare
                      
                      return (
                        <div key={platform} className="border-2 border-gray-200 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Icon className={`w-6 h-6 ${platformInfo?.color}`} />
                              <span className="font-black text-lg">{platformInfo?.name}</span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(content)}
                              className="font-bold"
                            >
                              <Copy className="w-4 h-4 mr-1" />
                              Copy
                            </Button>
                          </div>
                          
                          <div className="bg-gray-50 rounded-lg p-4 mb-4 font-mono text-sm">
                            {content}
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex gap-4">
                              <div className="text-center">
                                <div className="text-lg font-black text-blue-600">95%</div>
                                <div className="text-xs font-bold text-gray-600">Authenticity</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-black text-green-600">88%</div>
                                <div className="text-xs font-bold text-gray-600">Engagement</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-gray-600">
                                {content.length} characters
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              )}

              {/* Demo Info */}
              <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader>
                  <CardTitle className="text-2xl font-black flex items-center gap-3">
                    <Star className="w-6 h-6" />
                    How It Works
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mt-1">
                      1
                    </div>
                    <div>
                      <span className="font-bold text-gray-900">Upload your best posts:</span>
                      <span className="text-gray-700"> Share 10-15 posts that represent your authentic voice</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mt-1">
                      2
                    </div>
                    <div>
                      <span className="font-bold text-gray-900">AI learns your voice:</span>
                      <span className="text-gray-700"> Our AI analyzes your writing style, tone, and personality</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mt-1">
                      3
                    </div>
                    <div>
                      <span className="font-bold text-gray-900">Generate content:</span>
                      <span className="text-gray-700"> Create platform-perfect posts that sound exactly like you</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-24 mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-8">
            Ready to Train Your Voice?
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-bold">
            Start uploading your best social media posts and let Voice Echo learn your authentic voice.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 font-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
              onClick={() => window.location.href = '/voice-training'}
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Voice Training
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 font-bold border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
              onClick={() => window.location.href = '/content-generation'}
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Try Content Generation
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
} 