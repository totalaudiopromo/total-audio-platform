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
  Upload, 
  FileText, 
  Check, 
  ArrowRight, 
  Star, 
  Clock, 
  TrendingUp,
  Music,
  MessageSquare,
  Instagram,
  Twitter,
  Smartphone,
  Zap,
  Target,
  Users,
  ExternalLink
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function VoiceTrainingPage() {
  const [uploadedPosts, setUploadedPosts] = useState<string[]>([])
  const [platformTags, setPlatformTags] = useState<{[key: string]: string}>({})
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [textInput, setTextInput] = useState('')

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        const posts = text.split('\n').filter(post => post.trim())
        setUploadedPosts(posts)
      }
      reader.readAsText(file)
    }
  }

  const handleTextPaste = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value
    setTextInput(text)
    // Don't automatically split - let user control when to process
  }

  const processTextInput = () => {
    if (textInput.trim()) {
      const posts = textInput.split('\n').filter(post => post.trim())
      setUploadedPosts(posts)
    }
  }

  const handlePlatformTag = (index: number, platform: string) => {
    setPlatformTags(prev => ({
      ...prev,
      [index]: platform
    }))
  }

  const startVoiceAnalysis = async () => {
    setIsAnalyzing(true)
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false)
      setAnalysisComplete(true)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-500 rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 font-bold">Beta</Badge>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-bold text-gray-700 hover:text-purple-600 transition-colors">
              Home
            </Link>
            <Link href="/demo" className="text-sm font-bold text-gray-700 hover:text-purple-600 transition-colors">
              Demo
            </Link>
            <Button variant="outline" size="sm" className="font-bold border-2">
              Sign In
            </Button>
            <Button 
              size="sm" 
              className="bg-purple-600 hover:bg-purple-700 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              onClick={() => window.location.href = '/demo'}
            >
              Get Started
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container px-4 py-24 mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-6 bg-purple-100 text-purple-800 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Zap className="w-4 h-4 mr-2" />
            Voice Training
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 leading-tight">
            Train Your
            <span className="block text-purple-600">Authentic Voice</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-bold">
            Upload 10-15 of your best social media posts. Our AI will learn your unique voice, 
            tone, style, and personality to create content that sounds exactly like you.
          </p>
        </div>
      </section>

      {/* Upload Section */}
      <section className="container px-4 py-12 mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Upload Interface */}
            <div className="space-y-8">
              <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader>
                  <CardTitle className="text-2xl font-black flex items-center gap-3">
                    <Upload className="w-6 h-6" />
                    Upload Your Posts
                  </CardTitle>
                  <CardDescription className="text-lg font-bold">
                    Choose how you want to upload your social media posts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Tabs defaultValue="file" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="file" className="font-bold">File Upload</TabsTrigger>
                      <TabsTrigger value="paste" className="font-bold">Text Paste</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="file" className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <Label htmlFor="file-upload" className="cursor-pointer">
                          <div className="text-lg font-bold text-gray-700 mb-2">
                            Click to upload or drag and drop
                          </div>
                          <div className="text-sm text-gray-500">
                            TXT, CSV, or any text file with your posts
                          </div>
                        </Label>
                        <Input
                          id="file-upload"
                          type="file"
                          accept=".txt,.csv"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="paste" className="space-y-4">
                      <div>
                        <Label htmlFor="posts-text" className="text-lg font-bold mb-2 block">
                          Paste your posts (one per line)
                        </Label>
                        <Textarea
                          id="posts-text"
                          placeholder="Just dropped my new track! Been working on this for months 🎵

Studio session today was 🔥 Can't wait to share what we're cooking up

Big thanks to everyone who came to the show last night!

New music coming soon... this one's special 👆"
                          className="min-h-[200px] font-mono"
                          value={textInput}
                          onChange={handleTextPaste}
                        />
                        <Button 
                          onClick={processTextInput}
                          disabled={!textInput.trim()}
                          className="mt-4 bg-purple-600 hover:bg-purple-700 font-bold"
                        >
                          Process Posts
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Platform Tagging */}
              {uploadedPosts.length > 0 && (
                <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <CardHeader>
                    <CardTitle className="text-2xl font-black flex items-center gap-3">
                      <Target className="w-6 h-6" />
                      Tag Platforms
                    </CardTitle>
                    <CardDescription className="text-lg font-bold">
                      Tell us which platform each post came from for better voice learning
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {uploadedPosts.map((post, index) => (
                        <div key={index} className="border-2 border-gray-200 rounded-lg p-4">
                          <div className="text-sm font-bold text-gray-700 mb-2">
                            Post {index + 1}:
                          </div>
                          <div className="text-gray-900 mb-3 font-mono">
                            "{post}"
                          </div>
                          <div className="flex gap-2">
                            {['X/Twitter', 'Instagram', 'Threads', 'TikTok'].map((platform) => (
                              <Button
                                key={platform}
                                variant={platformTags[index] === platform ? "default" : "outline"}
                                size="sm"
                                onClick={() => handlePlatformTag(index, platform)}
                                className="font-bold"
                              >
                                {platform === 'X/Twitter' && <Twitter className="w-4 h-4 mr-1" />}
                                {platform === 'Instagram' && <Instagram className="w-4 h-4 mr-1" />}
                                {platform === 'Threads' && <MessageSquare className="w-4 h-4 mr-1" />}
                                {platform === 'TikTok' && <Smartphone className="w-4 h-4 mr-1" />}
                                {platform}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Start Analysis */}
              {uploadedPosts.length >= 5 && (
                <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <CardContent className="pt-6">
                    <Button
                      onClick={startVoiceAnalysis}
                      disabled={isAnalyzing}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black text-xl py-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
                    >
                      {isAnalyzing ? (
                        <>
                          <Clock className="w-6 h-6 mr-2 animate-spin" />
                          Analyzing Your Voice...
                        </>
                      ) : (
                        <>
                          <Zap className="w-6 h-6 mr-2" />
                          Start Voice Analysis
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Instructions & Tips */}
            <div className="space-y-8">
              <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader>
                  <CardTitle className="text-2xl font-black flex items-center gap-3">
                    <Star className="w-6 h-6" />
                    How It Works
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                        <span className="text-white font-black">1</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-gray-900 mb-2">Upload Your Best Posts</h4>
                        <p className="text-gray-700 font-bold">
                          Share 10-15 posts that represent your authentic voice and style
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                        <span className="text-white font-black">2</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-gray-900 mb-2">Tag Platforms</h4>
                        <p className="text-gray-700 font-bold">
                          Tell us which platform each post came from for better optimization
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                        <span className="text-white font-black">3</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-gray-900 mb-2">AI Analysis</h4>
                        <p className="text-gray-700 font-bold">
                          Our AI learns your voice patterns, tone, and personality
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
                        <span className="text-white font-black">4</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-gray-900 mb-2">Start Creating</h4>
                        <p className="text-gray-700 font-bold">
                          Generate platform-perfect content that sounds exactly like you
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader>
                  <CardTitle className="text-2xl font-black flex items-center gap-3">
                    <TrendingUp className="w-6 h-6" />
                    Tips for Best Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-gray-900">Include variety:</span>
                      <span className="text-gray-700"> Mix of different content types and tones</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-gray-900">Use your best posts:</span>
                      <span className="text-gray-700"> Posts that got good engagement</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-gray-900">Tag platforms accurately:</span>
                      <span className="text-gray-700"> Helps AI understand platform-specific voice</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-gray-900">Include emojis and style:</span>
                      <span className="text-gray-700"> Your unique writing style and personality</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Analysis Complete */}
      {analysisComplete && (
        <section className="container px-4 py-12 mx-auto">
          <div className="max-w-4xl mx-auto">
            <Card className="border-4 border-green-500 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-green-50">
              <CardContent className="pt-6 text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mx-auto mb-6">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4">Voice Analysis Complete!</h3>
                <p className="text-xl font-bold text-gray-700 mb-8">
                  Your authentic voice has been learned. You can now generate platform-perfect content that sounds exactly like you.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white p-4 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="text-2xl font-black text-purple-600">95%</div>
                    <div className="text-sm font-bold text-gray-700">Voice Match</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="text-2xl font-black text-green-600">4</div>
                    <div className="text-sm font-bold text-gray-700">Platforms</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="text-2xl font-black text-purple-600">12</div>
                    <div className="text-sm font-bold text-gray-700">Posts Analyzed</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="text-2xl font-black text-orange-600">High</div>
                    <div className="text-sm font-bold text-gray-700">Confidence</div>
                  </div>
                </div>
                <Button
                  onClick={() => window.location.href = '/content-generation'}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-black text-xl px-8 py-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
                >
                  <ArrowRight className="w-6 h-6 mr-2" />
                  Start Creating Content
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </div>
  )
} 