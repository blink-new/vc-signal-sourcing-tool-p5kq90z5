import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSignalData } from '@/hooks/useSignalData'
import FounderProfileModal from '@/components/FounderProfileModal'
import type { Signal } from '@/hooks/useSignalData'
import { 
  Twitter,
  Linkedin,
  Github,
  Clock,
  MapPin,
  Star,
  Filter,
  Search,
  TrendingUp,
  Users,
  Briefcase,
  Code,
  DollarSign,
  Rocket,
  Eye,
  Bookmark,
  ExternalLink
} from 'lucide-react'

const signals = [
  {
    id: 1,
    founder: 'Arjun Sharma',
    company: 'TechFlow AI',
    signal: 'Announced seed funding round of $2M',
    source: 'twitter',
    strength: 95,
    location: 'Bangalore',
    time: '2 min ago',
    description: 'Building AI-powered workflow automation for SMEs. Former Microsoft engineer with 8 years experience.',
    category: 'funding',
    engagement: 234,
    followers: '12.5K'
  },
  {
    id: 2,
    founder: 'Priya Patel',
    company: 'GreenLogistics',
    signal: 'Launched MVP on Product Hunt - #3 product of the day',
    source: 'linkedin',
    strength: 88,
    location: 'Mumbai',
    time: '15 min ago',
    description: 'Sustainable last-mile delivery solutions using electric vehicles and AI route optimization.',
    category: 'product',
    engagement: 156,
    followers: '8.2K'
  },
  {
    id: 3,
    founder: 'Rahul Gupta',
    company: 'FinanceOS',
    signal: 'Open sourced core library - 500+ GitHub stars in 24h',
    source: 'github',
    strength: 82,
    location: 'Delhi',
    time: '32 min ago',
    description: 'Modern financial infrastructure for Indian businesses. Ex-Razorpay senior engineer.',
    category: 'technical',
    engagement: 89,
    followers: '5.8K'
  },
  {
    id: 4,
    founder: 'Sneha Reddy',
    company: 'HealthTech Pro',
    signal: 'Hiring 5 senior engineers - rapid team expansion',
    source: 'linkedin',
    strength: 76,
    location: 'Hyderabad',
    time: '1 hour ago',
    description: 'Telemedicine platform for rural healthcare. AIIMS graduate with healthcare tech experience.',
    category: 'hiring',
    engagement: 67,
    followers: '4.1K'
  },
  {
    id: 5,
    founder: 'Karan Singh',
    company: 'EduVerse',
    signal: 'Partnership announcement with 50+ schools',
    source: 'twitter',
    strength: 84,
    location: 'Gurgaon',
    time: '2 hours ago',
    description: 'VR-based education platform for K-12 students. IIT Bombay alumnus.',
    category: 'partnership',
    engagement: 198,
    followers: '9.7K'
  },
  {
    id: 6,
    founder: 'Meera Joshi',
    company: 'AgriSmart',
    signal: 'Won National Startup Award 2024',
    source: 'linkedin',
    strength: 91,
    location: 'Pune',
    time: '3 hours ago',
    description: 'IoT-based precision farming solutions. Agricultural engineering background.',
    category: 'recognition',
    engagement: 312,
    followers: '6.9K'
  }
]

const getSourceIcon = (source: string) => {
  switch (source) {
    case 'twitter':
      return <Twitter className="w-4 h-4 text-blue-400" />
    case 'linkedin':
      return <Linkedin className="w-4 h-4 text-blue-600" />
    case 'github':
      return <Github className="w-4 h-4 text-gray-700" />
    default:
      return null
  }
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'funding':
      return <DollarSign className="w-4 h-4 text-green-600" />
    case 'product':
      return <Rocket className="w-4 h-4 text-purple-600" />
    case 'technical':
      return <Code className="w-4 h-4 text-blue-600" />
    case 'hiring':
      return <Users className="w-4 h-4 text-orange-600" />
    case 'partnership':
      return <Briefcase className="w-4 h-4 text-indigo-600" />
    case 'recognition':
      return <Star className="w-4 h-4 text-yellow-600" />
    default:
      return <TrendingUp className="w-4 h-4 text-gray-600" />
  }
}

const getStrengthColor = (strength: number) => {
  if (strength >= 90) return 'text-green-600 bg-green-50 border-green-200'
  if (strength >= 80) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
  return 'text-orange-600 bg-orange-50 border-orange-200'
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'funding':
      return 'bg-green-50 text-green-700 border-green-200'
    case 'product':
      return 'bg-purple-50 text-purple-700 border-purple-200'
    case 'technical':
      return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'hiring':
      return 'bg-orange-50 text-orange-700 border-orange-200'
    case 'partnership':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200'
    case 'recognition':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}

export default function SignalsFeed() {
  const { signals, isLive, loading, toggleLiveMode, refreshData } = useSignalData()
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSource, setSelectedSource] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStrength, setSelectedStrength] = useState('all')

  const handleViewProfile = (signal: Signal) => {
    setSelectedSignal(signal)
    setIsModalOpen(true)
  }

  const filteredSignals = signals.filter(signal => {
    const matchesSearch = signal.founder.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         signal.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         signal.signal.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSource = selectedSource === 'all' || signal.source === selectedSource
    const matchesCategory = selectedCategory === 'all' || signal.category === selectedCategory
    const matchesStrength = selectedStrength === 'all' || 
                           (selectedStrength === 'high' && signal.strength >= 90) ||
                           (selectedStrength === 'medium' && signal.strength >= 80 && signal.strength < 90) ||
                           (selectedStrength === 'low' && signal.strength < 80)
    
    return matchesSearch && matchesSource && matchesCategory && matchesStrength
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Signals Feed</h1>
            <p className="text-gray-600">Real-time monitoring of founder activities across platforms</p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading signals feed...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Signals Feed</h1>
          <p className="text-gray-600">Real-time monitoring of founder activities across platforms</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 rounded-full">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className={`text-sm font-medium ${isLive ? 'text-green-700' : 'text-gray-600'}`}>
              {isLive ? 'Live Monitoring' : 'Paused'}
            </span>
          </div>
          <Badge variant="secondary">{filteredSignals.length} signals</Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            className="flex items-center space-x-1"
          >
            <TrendingUp className="w-4 h-4" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLiveMode}
            className="flex items-center space-x-1"
          >
            {isLive ? 'Pause' : 'Resume'}
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
                  placeholder="Search signals, founders, or companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="github">GitHub</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="funding">Funding</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="hiring">Hiring</SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
                <SelectItem value="recognition">Recognition</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStrength} onValueChange={setSelectedStrength}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Strength" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Strength</SelectItem>
                <SelectItem value="high">High (90%+)</SelectItem>
                <SelectItem value="medium">Medium (80-89%)</SelectItem>
                <SelectItem value="low">Low (&lt;80%)</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Signals ({filteredSignals.length})</TabsTrigger>
          <TabsTrigger value="high">High Priority ({filteredSignals.filter(s => s.strength >= 90).length})</TabsTrigger>
          <TabsTrigger value="recent">Recent (24h)</TabsTrigger>
          <TabsTrigger value="bookmarked">Bookmarked</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          {filteredSignals.map((signal) => (
            <Card 
              key={signal.id} 
              className={`hover:shadow-md transition-all duration-300 ${
                signal.isNew 
                  ? 'border-green-400 bg-green-50/30 shadow-lg animate-pulse' 
                  : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900 text-lg">{signal.founder}</h3>
                        <Badge variant="outline" className="text-xs">
                          {signal.company}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {getSourceIcon(signal.source)}
                        <Badge 
                          variant="outline" 
                          className={`text-xs border ${getStrengthColor(signal.strength)}`}
                        >
                          {signal.strength}% match
                        </Badge>
                        <Badge 
                          variant="outline"
                          className={`text-xs border ${getCategoryColor(signal.category)}`}
                        >
                          {getCategoryIcon(signal.category)}
                          <span className="ml-1 capitalize">{signal.category}</span>
                        </Badge>
                        {signal.isNew && (
                          <Badge className="bg-green-500 text-white text-xs animate-bounce">
                            NEW
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Signal */}
                    <div className="mb-3">
                      <p className="text-primary font-medium mb-2">{signal.signal}</p>
                      <p className="text-gray-600 text-sm">{signal.description}</p>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {signal.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {signal.location}
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        {signal.engagement} engagement
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {signal.followers} followers
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 ml-6">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewProfile(signal)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                    <Button size="sm" variant="outline">
                      <Bookmark className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Source
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="high" className="space-y-4 mt-6">
          {filteredSignals.filter(s => s.strength >= 90).map((signal) => (
            <Card key={signal.id} className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900 text-lg">{signal.founder}</h3>
                        <Badge variant="outline" className="text-xs">
                          {signal.company}
                        </Badge>
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          HIGH PRIORITY
                        </Badge>
                      </div>
                    </div>
                    <p className="text-primary font-medium mb-2">{signal.signal}</p>
                    <p className="text-gray-600 text-sm mb-3">{signal.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {signal.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {signal.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 ml-6">
                    <Button 
                      size="sm"
                      onClick={() => handleViewProfile(signal)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                    <Button size="sm" variant="outline">
                      <Bookmark className="w-4 h-4 mr-2" />
                      Add to Watch
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="recent" className="space-y-4 mt-6">
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Recent signals from the last 24 hours will appear here</p>
          </div>
        </TabsContent>

        <TabsContent value="bookmarked" className="space-y-4 mt-6">
          <div className="text-center py-8 text-gray-500">
            <Bookmark className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Your bookmarked signals will appear here</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Founder Profile Modal */}
      <FounderProfileModal 
        signal={selectedSignal}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}