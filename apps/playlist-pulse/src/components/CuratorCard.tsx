'use client'
import { useState } from 'react'
import { Mail, Users, Instagram, Twitter, Youtube, Copy, Check, ExternalLink, Music2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Curator } from '@/context/AppContext'

interface CuratorCardProps {
  curator: Curator
}

export default function CuratorCard({ curator }: CuratorCardProps) {
  const [pitchCopied, setPitchCopied] = useState(false)
  const [emailCopied, setEmailCopied] = useState(false)

  const copyToClipboard = async (text: string, type: 'pitch' | 'email') => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'pitch') {
        setPitchCopied(true)
        setTimeout(() => setPitchCopied(false), 2000)
      } else {
        setEmailCopied(true)
        setTimeout(() => setEmailCopied(false), 2000)
      }
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const openEmailClient = () => {
    const subject = encodeURIComponent(`Submission for ${curator.playlistName}`)
    const body = encodeURIComponent(curator.pitch)
    window.open(`mailto:${curator.email}?subject=${subject}&body=${body}`)
  }

  const getCompatibilityColor = (compatibility: number) => {
    if (compatibility >= 90) return 'from-green-400 to-emerald-500'
    if (compatibility >= 80) return 'from-blue-400 to-cyan-500'
    if (compatibility >= 70) return 'from-yellow-400 to-orange-500'
    return 'from-red-400 to-pink-500'
  }

  const getCompatibilityLabel = (compatibility: number) => {
    if (compatibility >= 90) return 'Excellent Match'
    if (compatibility >= 80) return 'Great Match'
    if (compatibility >= 70) return 'Good Match'
    return 'Fair Match'
  }

  return (
    <Card className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105 group">
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">{curator.name}</h3>
            <div className="flex items-center space-x-2 mb-2">
              <Music2 className="w-3 h-3 text-purple-300" />
              <p className="text-purple-300 text-sm font-medium">{curator.playlistName}</p>
            </div>
            <p className="text-white/60 text-xs">{curator.genre}</p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold bg-gradient-to-r ${getCompatibilityColor(curator.compatibility)} bg-clip-text text-transparent`}>
              {curator.compatibility}%
            </div>
            <div className="text-white/60 text-xs">{getCompatibilityLabel(curator.compatibility)}</div>
          </div>
        </div>

        {/* Compatibility Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/70 text-sm">Compatibility Score</span>
          </div>
          <div className="relative">
            <Progress value={curator.compatibility} className="w-full h-2 bg-white/20" />
            <div 
              className={`absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r ${getCompatibilityColor(curator.compatibility)} transition-all duration-500`}
              style={{ width: `${curator.compatibility}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-white/60" />
            <div>
              <div className="text-white/80 text-sm font-medium">{curator.email}</div>
              <div className="text-white/60 text-xs">Email Contact</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-white/60" />
            <div>
              <div className="text-white/80 text-sm font-medium">{curator.followers}</div>
              <div className="text-white/60 text-xs">Followers</div>
            </div>
          </div>
        </div>

        {/* Personalized Pitch */}
        <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-white font-medium text-sm">Personalized Pitch</h4>
            <Button
              onClick={() => copyToClipboard(curator.pitch, 'pitch')}
              size="sm"
              variant="ghost"
              className="text-white/60 hover:text-white hover:bg-white/10 h-6 px-2"
            >
              {pitchCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </Button>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">{curator.pitch}</p>
        </div>

        {/* Social Links and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {curator.social.instagram && (
              <Button
                size="sm"
                variant="ghost"
                className="w-8 h-8 p-0 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
                onClick={() => window.open(`https://instagram.com/${curator.social.instagram?.replace('@', '')}`, '_blank')}
              >
                <Instagram className="w-4 h-4" />
              </Button>
            )}
            {curator.social.twitter && (
              <Button
                size="sm"
                variant="ghost"
                className="w-8 h-8 p-0 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
                onClick={() => window.open(`https://twitter.com/${curator.social.twitter?.replace('@', '')}`, '_blank')}
              >
                <Twitter className="w-4 h-4" />
              </Button>
            )}
            {curator.social.youtube && (
              <Button
                size="sm"
                variant="ghost"
                className="w-8 h-8 p-0 text-white/60 hover:text-white hover:bg-white/10 rounded-lg"
                onClick={() => window.open(`https://youtube.com/@${curator.social.youtube}`, '_blank')}
              >
                <Youtube className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={() => copyToClipboard(curator.email, 'email')}
              size="sm"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 px-3 py-1 text-xs"
            >
              {emailCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </Button>
            <Button
              onClick={openEmailClient}
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-4 py-1 text-xs font-medium transition-all duration-300 group-hover:scale-105"
            >
              <Mail className="w-3 h-3 mr-1" />
              Contact
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}