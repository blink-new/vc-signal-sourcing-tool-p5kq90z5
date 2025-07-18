import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Users, 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  TrendingUp,
  Twitter,
  Linkedin,
  Github,
  ExternalLink,
  Mail,
  Building,
  Calendar,
  Zap,
  Eye,
  Bookmark,
  Plus,
  BarChart3
} from 'lucide-react'

// Mock data - in real app this would come from the database
const founders = [
  {
    id: 'founder_1',
    name: 'Arjun Sharma',
    email: 'arjun@techflow.ai',
    company: 'TechFlow AI',
    description: 'Building AI-powered workflow automation for SMEs. Former Microsoft engineer with 8 years experience in distributed systems and machine learning.',
    location: 'Bangalore',
    score: 95,
    signals_count: 8,
    twitter_handle: 'arjun_techflow',
    linkedin_url: 'https://linkedin.com/in/arjunsharma',
    github_username: 'arjunsharma',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    created_at: '2024-01-15',
    recent_signals: [
      { type: 'funding', title: 'Announced $2M seed round', date: '2 min ago', strength: 95 },
      { type: 'hiring', title: 'Hiring senior ML engineers', date: '2 days ago', strength: 88 },
      { type: 'product', title: 'Beta launch announcement', date: '1 week ago', strength: 82 }
    ],
    metrics: {
      total_engagement: 15420,
      avg_signal_strength: 88,
      growth_rate: 23,
      follower_growth: 12
    }
  },
  {
    id: 'founder_2',
    name: 'Priya Patel',
    email: 'priya@greenlogistics.in',
    company: 'GreenLogistics',
    description: 'Sustainable last-mile delivery solutions using electric vehicles and AI route optimization. Former consultant at McKinsey with focus on supply chain.',
    location: 'Mumbai',
    score: 88,
    signals_count: 6,
    twitter_handle: 'priya_green',
    linkedin_url: 'https://linkedin.com/in/priyapatel',
    github_username: 'priyapatel',
    avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b9c5e8e1?w=150&h=150&fit=crop&crop=face',
    created_at: '2024-01-20',
    recent_signals: [
      { type: 'product', title: 'Product Hunt #3 launch', date: '15 min ago', strength: 88 },
      { type: 'partnership', title: 'Partnership with Flipkart', date: '3 days ago', strength: 91 },
      { type: 'recognition', title: 'Featured in Economic Times', date: '1 week ago', strength: 85 }
    ],
    metrics: {
      total_engagement: 8920,
      avg_signal_strength: 88,
      growth_rate: 31,
      follower_growth: 18
    }
  }
]

const getSignalTypeColor = (type: string) => {
  switch (type) {
    case 'funding': return 'bg-green-50 text-green-700 border-green-200'
    case 'product': return 'bg-purple-50 text-purple-700 border-purple-200'
    case 'technical': return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'hiring': return 'bg-orange-50 text-orange-700 border-orange-200'
    case 'partnership': return 'bg-indigo-50 text-indigo-700 border-indigo-200'
    case 'recognition': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    default: return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}

const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-green-600'
  if (score >= 80) return 'text-yellow-600'
  return 'text-orange-600'
}

export default function FounderProfiles() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [selectedScore, setSelectedScore] = useState('all')
  const [sortBy, setSortBy] = useState('score')
  const [selectedFounder, setSelectedFounder] = useState<typeof founders[0] | null>(null)

  const filteredFounders = founders.filter(founder => {
    const matchesSearch = founder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         founder.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         founder.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = selectedLocation === 'all' || founder.location === selectedLocation
    const matchesScore = selectedScore === 'all' || 
                        (selectedScore === 'high' && founder.score >= 90) ||
                        (selectedScore === 'medium' && founder.score >= 80 && founder.score < 90) ||
                        (selectedScore === 'low' && founder.score < 80)
    
    return matchesSearch && matchesLocation && matchesScore
  }).sort((a, b) => {
    switch (sortBy) {
      case 'score': return b.score - a.score
      case 'signals': return b.signals_count - a.signals_count
      case 'recent': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      default: return 0
    }
  })

  const locations = [...new Set(founders.map(f => f.location))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Founder Profiles</h1>
          <p className="text-gray-600">Comprehensive profiles of tracked founders with aggregated data</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{filteredFounders.length} founders</Badge>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Founder
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search founders, companies, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedScore} onValueChange={setSelectedScore}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Score" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Scores</SelectItem>
                <SelectItem value="high">High (90%+)</SelectItem>
                <SelectItem value="medium">Medium (80-89%)</SelectItem>
                <SelectItem value="low">Low (&lt;80%)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">Score</SelectItem>
                <SelectItem value="signals">Signals</SelectItem>
                <SelectItem value="recent">Recent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Founders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFounders.map((founder) => (
          <Card key={founder.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4 mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={founder.avatar_url} alt={founder.name} />
                  <AvatarFallback>{founder.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{founder.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className={`text-sm font-medium ${getScoreColor(founder.score)}`}>
                        {founder.score}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{founder.company}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <MapPin className="w-3 h-3 mr-1" />
                    {founder.location}
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{founder.description}</p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center">
                    <Zap className="w-3 h-3 mr-1" />
                    {founder.signals_count} signals
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {founder.metrics.growth_rate}% growth
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {founder.twitter_handle && <Twitter className="w-4 h-4 text-blue-400" />}
                  {founder.linkedin_url && <Linkedin className="w-4 h-4 text-blue-600" />}
                  {founder.github_username && <Github className="w-4 h-4 text-gray-700" />}
                </div>
              </div>

              <Progress value={founder.score} className="h-2 mb-4" />

              <div className="flex items-center space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => setSelectedFounder(founder)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Founder Profile</DialogTitle>
                    </DialogHeader>
                    {selectedFounder && (
                      <div className="space-y-6">
                        {/* Profile Header */}
                        <div className="flex items-start space-x-6">
                          <Avatar className="w-20 h-20">
                            <AvatarImage src={selectedFounder.avatar_url} alt={selectedFounder.name} />
                            <AvatarFallback className="text-lg">
                              {selectedFounder.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h2 className="text-2xl font-bold text-gray-900">{selectedFounder.name}</h2>
                              <div className="flex items-center space-x-2">
                                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                                <span className={`text-xl font-bold ${getScoreColor(selectedFounder.score)}`}>
                                  {selectedFounder.score}
                                </span>
                              </div>
                            </div>
                            <p className="text-lg text-gray-700 mb-2">{selectedFounder.company}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {selectedFounder.location}
                              </div>
                              <div className="flex items-center">
                                <Mail className="w-4 h-4 mr-1" />
                                {selectedFounder.email}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                Tracked since {new Date(selectedFounder.created_at).toLocaleDateString()}
                              </div>
                            </div>
                            <p className="text-gray-600">{selectedFounder.description}</p>
                          </div>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center space-x-4">
                          {selectedFounder.twitter_handle && (
                            <Button variant="outline" size="sm">
                              <Twitter className="w-4 h-4 mr-2" />
                              @{selectedFounder.twitter_handle}
                              <ExternalLink className="w-3 h-3 ml-2" />
                            </Button>
                          )}
                          {selectedFounder.linkedin_url && (
                            <Button variant="outline" size="sm">
                              <Linkedin className="w-4 h-4 mr-2" />
                              LinkedIn
                              <ExternalLink className="w-3 h-3 ml-2" />
                            </Button>
                          )}
                          {selectedFounder.github_username && (
                            <Button variant="outline" size="sm">
                              <Github className="w-4 h-4 mr-2" />
                              @{selectedFounder.github_username}
                              <ExternalLink className="w-3 h-3 ml-2" />
                            </Button>
                          )}
                        </div>

                        <Tabs defaultValue="signals" className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="signals">Recent Signals</TabsTrigger>
                            <TabsTrigger value="metrics">Metrics</TabsTrigger>
                            <TabsTrigger value="timeline">Timeline</TabsTrigger>
                          </TabsList>

                          <TabsContent value="signals" className="space-y-4">
                            {selectedFounder.recent_signals.map((signal, index) => (
                              <Card key={index}>
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2 mb-2">
                                        <Badge 
                                          variant="outline"
                                          className={`text-xs border ${getSignalTypeColor(signal.type)}`}
                                        >
                                          {signal.type}
                                        </Badge>
                                        <Badge 
                                          variant="outline" 
                                          className={`text-xs ${signal.strength >= 90 ? 'text-green-600 bg-green-50' : signal.strength >= 80 ? 'text-yellow-600 bg-yellow-50' : 'text-orange-600 bg-orange-50'}`}
                                        >
                                          {signal.strength}% match
                                        </Badge>
                                      </div>
                                      <h4 className="font-medium text-gray-900 mb-1">{signal.title}</h4>
                                      <p className="text-sm text-gray-500">{signal.date}</p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </TabsContent>

                          <TabsContent value="metrics" className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <Card>
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-sm text-gray-600">Total Engagement</p>
                                      <p className="text-2xl font-bold">{selectedFounder.metrics.total_engagement.toLocaleString()}</p>
                                    </div>
                                    <BarChart3 className="w-8 h-8 text-blue-500" />
                                  </div>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-sm text-gray-600">Avg Signal Strength</p>
                                      <p className="text-2xl font-bold">{selectedFounder.metrics.avg_signal_strength}%</p>
                                    </div>
                                    <TrendingUp className="w-8 h-8 text-green-500" />
                                  </div>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-sm text-gray-600">Growth Rate</p>
                                      <p className="text-2xl font-bold">{selectedFounder.metrics.growth_rate}%</p>
                                    </div>
                                    <Zap className="w-8 h-8 text-purple-500" />
                                  </div>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-sm text-gray-600">Follower Growth</p>
                                      <p className="text-2xl font-bold">{selectedFounder.metrics.follower_growth}%</p>
                                    </div>
                                    <Users className="w-8 h-8 text-orange-500" />
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </TabsContent>

                          <TabsContent value="timeline" className="space-y-4">
                            <div className="text-center py-8 text-gray-500">
                              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                              <p>Timeline view coming soon</p>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                <Button size="sm" variant="outline">
                  <Bookmark className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFounders.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No founders found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters to find more founders.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}