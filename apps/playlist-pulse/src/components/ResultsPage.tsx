'use client'
import { useState } from 'react'
import { Download, Filter, Search, SortAsc, ChevronLeft, Users, Mail, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useApp } from '@/context/AppContext'
import CuratorCard from './CuratorCard'

export default function ResultsPage() {
  const { state, dispatch } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('compatibility')
  const [filterGenre, setFilterGenre] = useState('all')
  const [filterFollowers, setFilterFollowers] = useState('all')

  const backToCustomization = () => {
    dispatch({ type: 'SET_SHOW_RESULTS', payload: false })
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'customize' })
  }

  const exportContacts = () => {
    const csvContent = [
      ['Name', 'Email', 'Playlist', 'Genre', 'Followers', 'Compatibility', 'Instagram', 'Twitter', 'YouTube'].join(','),
      ...filteredAndSortedCurators.map(curator => [
        curator.name,
        curator.email,
        curator.playlistName,
        curator.genre,
        curator.followers,
        curator.compatibility,
        curator.social.instagram || '',
        curator.social.twitter || '',
        curator.social.youtube || ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'playlist-curators.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Filter and sort curators
  const filteredAndSortedCurators = state.curators
    .filter(curator => {
      const matchesSearch = curator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           curator.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           curator.playlistName.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesGenre = filterGenre === 'all' || curator.genre === filterGenre
      
      const matchesFollowers = filterFollowers === 'all' || 
        (filterFollowers === 'high' && parseInt(curator.followers.replace('K', '')) >= 100) ||
        (filterFollowers === 'medium' && parseInt(curator.followers.replace('K', '')) >= 50 && parseInt(curator.followers.replace('K', '')) < 100) ||
        (filterFollowers === 'low' && parseInt(curator.followers.replace('K', '')) < 50)
      
      return matchesSearch && matchesGenre && matchesFollowers
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'compatibility':
          return b.compatibility - a.compatibility
        case 'followers':
          return parseInt(b.followers.replace('K', '')) - parseInt(a.followers.replace('K', ''))
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  const genres = Array.from(new Set(state.curators.map(c => c.genre)))
  const averageCompatibility = Math.round(state.curators.reduce((sum, c) => sum + c.compatibility, 0) / state.curators.length)
  const totalFollowers = state.curators.reduce((sum, c) => sum + parseInt(c.followers.replace('K', '')), 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <Button
          onClick={backToCustomization}
          variant="ghost"
          className="text-white/60 hover:text-white hover:bg-white/10 mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Customization
        </Button>
        
        <h2 className="text-3xl font-bold text-white mb-4">Perfect Matches Found</h2>
        <p className="text-white/70 text-lg mb-6">
          We found {filteredAndSortedCurators.length} curators who would love your track
        </p>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4">
            <CardContent className="p-0 text-center">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-lg flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div className="text-xl font-bold text-white">{averageCompatibility}%</div>
              <div className="text-white/60 text-sm">Avg. Compatibility</div>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4">
            <CardContent className="p-0 text-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div className="text-xl font-bold text-white">{totalFollowers}K+</div>
              <div className="text-white/60 text-sm">Total Reach</div>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4">
            <CardContent className="p-0 text-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <div className="text-xl font-bold text-white">{state.curators.length}</div>
              <div className="text-white/60 text-sm">Ready to Contact</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={exportContacts}
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
          >
            <Download className="w-4 h-4 mr-2" />
            Export All Contacts
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
              <Input
                placeholder="Search curators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SortAsc className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compatibility">Sort by Compatibility</SelectItem>
                <SelectItem value="followers">Sort by Followers</SelectItem>
                <SelectItem value="name">Sort by Name</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterGenre} onValueChange={setFilterGenre}>
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {genres.map(genre => (
                  <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterFollowers} onValueChange={setFilterFollowers}>
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <Users className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Followers</SelectItem>
                <SelectItem value="high">100K+ Followers</SelectItem>
                <SelectItem value="medium">50K-100K Followers</SelectItem>
                <SelectItem value="low">Under 50K Followers</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedCurators.map((curator) => (
          <CuratorCard key={curator.id} curator={curator} />
        ))}
      </div>

      {filteredAndSortedCurators.length === 0 && (
        <Card className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-12">
          <CardContent className="p-0 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-white/60" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No curators found</h3>
            <p className="text-white/60">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}