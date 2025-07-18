import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Bookmark, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Star, 
  MapPin, 
  TrendingUp,
  Eye,
  Search,
  Share,
  Download
} from 'lucide-react'

// Mock data
const watchlists = [
  {
    id: 'watchlist_1',
    name: 'High Priority Founders',
    description: 'Top-scored founders with strong signals and high potential',
    founder_count: 3,
    created_at: '2024-01-15',
    updated_at: '2024-01-20',
    founders: [
      {
        id: 'founder_1',
        name: 'Arjun Sharma',
        company: 'TechFlow AI',
        location: 'Bangalore',
        score: 95,
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        recent_signal: 'Announced $2M seed round',
        signal_time: '2 min ago'
      },
      {
        id: 'founder_6',
        name: 'Meera Joshi',
        company: 'AgriSmart',
        location: 'Pune',
        score: 91,
        avatar_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
        recent_signal: 'Won National Startup Award 2024',
        signal_time: '3 hours ago'
      }
    ]
  },
  {
    id: 'watchlist_2',
    name: 'AI/ML Startups',
    description: 'Founders building AI and machine learning solutions',
    founder_count: 2,
    created_at: '2024-01-18',
    updated_at: '2024-01-22',
    founders: [
      {
        id: 'founder_1',
        name: 'Arjun Sharma',
        company: 'TechFlow AI',
        location: 'Bangalore',
        score: 95,
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        recent_signal: 'Announced $2M seed round',
        signal_time: '2 min ago'
      }
    ]
  }
]

const availableFounders = [
  {
    id: 'founder_1',
    name: 'Arjun Sharma',
    company: 'TechFlow AI',
    location: 'Bangalore',
    score: 95,
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: 'founder_2',
    name: 'Priya Patel',
    company: 'GreenLogistics',
    location: 'Mumbai',
    score: 88,
    avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b9c5e8e1?w=150&h=150&fit=crop&crop=face'
  }
]

const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-green-600'
  if (score >= 80) return 'text-yellow-600'
  return 'text-orange-600'
}

export default function Watchlists() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedWatchlist, setSelectedWatchlist] = useState<typeof watchlists[0] | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newWatchlistName, setNewWatchlistName] = useState('')
  const [newWatchlistDescription, setNewWatchlistDescription] = useState('')
  const [selectedFounders, setSelectedFounders] = useState<string[]>([])

  const filteredWatchlists = watchlists.filter(watchlist =>
    watchlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    watchlist.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateWatchlist = () => {
    console.log('Creating watchlist:', { name: newWatchlistName, description: newWatchlistDescription, founders: selectedFounders })
    setIsCreateDialogOpen(false)
    setNewWatchlistName('')
    setNewWatchlistDescription('')
    setSelectedFounders([])
  }

  const handleDeleteWatchlist = (watchlistId: string) => {
    console.log('Deleting watchlist:', watchlistId)
  }

  const toggleFounderSelection = (founderId: string) => {
    setSelectedFounders(prev => 
      prev.includes(founderId) 
        ? prev.filter(id => id !== founderId)
        : [...prev, founderId]
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Watchlists</h1>
          <p className="text-gray-600">Organize and track your most promising founders</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{filteredWatchlists.length} watchlists</Badge>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Watchlist
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Watchlist</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Name</label>
                  <Input
                    placeholder="Enter watchlist name..."
                    value={newWatchlistName}
                    onChange={(e) => setNewWatchlistName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Description</label>
                  <Textarea
                    placeholder="Enter watchlist description..."
                    value={newWatchlistDescription}
                    onChange={(e) => setNewWatchlistDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Add Founders</label>
                  <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto border rounded-lg p-3">
                    {availableFounders.map((founder) => (
                      <div 
                        key={founder.id} 
                        className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
                          selectedFounders.includes(founder.id) 
                            ? 'bg-primary/10 border border-primary/20' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => toggleFounderSelection(founder.id)}
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={founder.avatar_url} alt={founder.name} />
                          <AvatarFallback className="text-xs">
                            {founder.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{founder.name}</p>
                          <p className="text-xs text-gray-500">{founder.company} • {founder.location}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className={`text-xs font-medium ${getScoreColor(founder.score)}`}>
                            {founder.score}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateWatchlist} disabled={!newWatchlistName.trim()}>
                    Create Watchlist
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search watchlists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Watchlists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWatchlists.map((watchlist) => (
          <Card key={watchlist.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">{watchlist.name}</CardTitle>
                  <p className="text-sm text-gray-600 line-clamp-2">{watchlist.description}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteWatchlist(watchlist.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1 text-gray-500" />
                    <span className="text-gray-600">{watchlist.founder_count} founders</span>
                  </div>
                </div>
                <span className="text-gray-500">
                  Updated {new Date(watchlist.updated_at).toLocaleDateString()}
                </span>
              </div>

              {/* Founder Previews */}
              <div className="space-y-2">
                {watchlist.founders.slice(0, 3).map((founder) => (
                  <div key={founder.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={founder.avatar_url} alt={founder.name} />
                      <AvatarFallback className="text-xs">
                        {founder.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">{founder.name}</p>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className={`text-xs font-medium ${getScoreColor(founder.score)}`}>
                            {founder.score}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{founder.company}</p>
                      <p className="text-xs text-primary truncate">{founder.recent_signal}</p>
                    </div>
                  </div>
                ))}
                {watchlist.founder_count > 3 && (
                  <p className="text-xs text-gray-500 text-center py-2">
                    +{watchlist.founder_count - 3} more founders
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => setSelectedWatchlist(watchlist)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Watchlist: {selectedWatchlist?.name}</DialogTitle>
                    </DialogHeader>
                    {selectedWatchlist && (
                      <div className="space-y-6">
                        {/* Watchlist Info */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-gray-600 mb-2">{selectedWatchlist.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Created: {new Date(selectedWatchlist.created_at).toLocaleDateString()}</span>
                            <span>Updated: {new Date(selectedWatchlist.updated_at).toLocaleDateString()}</span>
                            <span>{selectedWatchlist.founder_count} founders</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Share className="w-4 h-4 mr-2" />
                            Share
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Export
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </div>

                        {/* Founders List */}
                        <div className="space-y-3">
                          <h3 className="font-semibold text-gray-900">Founders in this watchlist</h3>
                          {selectedWatchlist.founders.map((founder) => (
                            <Card key={founder.id}>
                              <CardContent className="p-4">
                                <div className="flex items-start space-x-4">
                                  <Avatar className="w-12 h-12">
                                    <AvatarImage src={founder.avatar_url} alt={founder.name} />
                                    <AvatarFallback>
                                      {founder.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                      <div>
                                        <h4 className="font-semibold text-gray-900">{founder.name}</h4>
                                        <p className="text-sm text-gray-600">{founder.company}</p>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                        <span className={`text-sm font-medium ${getScoreColor(founder.score)}`}>
                                          {founder.score}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <div className="flex items-center">
                                          <MapPin className="w-3 h-3 mr-1" />
                                          {founder.location}
                                        </div>
                                        <div className="flex items-center">
                                          <TrendingUp className="w-3 h-3 mr-1" />
                                          {founder.recent_signal}
                                        </div>
                                      </div>
                                      <span className="text-xs text-gray-500">{founder.signal_time}</span>
                                    </div>
                                  </div>
                                  <Button size="sm" variant="outline">
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Profile
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                <Button size="sm" variant="outline">
                  <Share className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWatchlists.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Bookmark className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No watchlists found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Try adjusting your search criteria.' : 'Create your first watchlist to start organizing founders.'}
            </p>
            {!searchTerm && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Watchlist
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}