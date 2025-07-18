import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useSignalData } from '@/hooks/useSignalData'
import FounderProfileModal from '@/components/FounderProfileModal'
import type { Signal } from '@/hooks/useSignalData'
import { 
  TrendingUp, 
  Users, 
  Target, 
  Zap,
  Twitter,
  Linkedin,
  Github,
  ArrowUpRight,
  Clock,
  MapPin,
  Star,
  ExternalLink,
  Play,
  Pause
} from 'lucide-react'

const stats = [
  {
    title: 'Active Signals',
    value: '1,247',
    change: '+12%',
    trend: 'up',
    icon: Zap,
    color: 'text-yellow-600'
  },
  {
    title: 'New Founders',
    value: '89',
    change: '+23%',
    trend: 'up',
    icon: Users,
    color: 'text-blue-600'
  },
  {
    title: 'High Priority',
    value: '34',
    change: '+8%',
    trend: 'up',
    icon: Target,
    color: 'text-red-600'
  },
  {
    title: 'Conversion Rate',
    value: '4.2%',
    change: '+0.8%',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-green-600'
  }
]

const recentSignals = [
  {
    id: 1,
    founder: 'Arjun Sharma',
    company: 'TechFlow AI',
    signal: 'Announced seed funding round',
    source: 'twitter',
    strength: 95,
    location: 'Bangalore',
    time: '2 min ago',
    description: 'Building AI-powered workflow automation for SMEs'
  },
  {
    id: 2,
    founder: 'Priya Patel',
    company: 'GreenLogistics',
    signal: 'Launched MVP on Product Hunt',
    source: 'linkedin',
    strength: 88,
    location: 'Mumbai',
    time: '15 min ago',
    description: 'Sustainable last-mile delivery solutions'
  },
  {
    id: 3,
    founder: 'Rahul Gupta',
    company: 'FinanceOS',
    signal: 'Open sourced core library',
    source: 'github',
    strength: 82,
    location: 'Delhi',
    time: '32 min ago',
    description: 'Modern financial infrastructure for Indian businesses'
  },
  {
    id: 4,
    founder: 'Sneha Reddy',
    company: 'HealthTech Pro',
    signal: 'Hiring senior engineers',
    source: 'linkedin',
    strength: 76,
    location: 'Hyderabad',
    time: '1 hour ago',
    description: 'Telemedicine platform for rural healthcare'
  }
]

const topFounders = [
  {
    name: 'Vikram Singh',
    company: 'DataVault',
    score: 96,
    signals: 8,
    location: 'Bangalore',
    description: 'Ex-Google, building data privacy tools'
  },
  {
    name: 'Anita Krishnan',
    company: 'EduNext',
    score: 94,
    signals: 6,
    location: 'Chennai',
    description: 'Former McKinsey, EdTech for Tier-2 cities'
  },
  {
    name: 'Rohit Agarwal',
    company: 'AgriTech Solutions',
    score: 91,
    signals: 5,
    location: 'Pune',
    description: 'IIT Delhi, precision farming technology'
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

const getStrengthColor = (strength: number) => {
  if (strength >= 90) return 'text-green-600 bg-green-50'
  if (strength >= 80) return 'text-yellow-600 bg-yellow-50'
  return 'text-orange-600 bg-orange-50'
}

export default function Dashboard() {
  const { signals, founders, isLive, loading, toggleLiveMode, getStats, getSourceStats, refreshData } = useSignalData()
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Real-time VC sourcing intelligence</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    )
  }
  
  const stats = getStats()
  const sourceStats = getSourceStats()

  const recentSignals = signals.slice(0, 4)
  const topFounders = founders.slice(0, 3)

  const handleViewProfile = (signal: Signal) => {
    setSelectedSignal(signal)
    setIsModalOpen(true)
  }

  const statsData = [
    {
      title: 'Active Signals',
      value: stats.activeSignals.toString(),
      change: '+12%',
      trend: 'up',
      icon: Zap,
      color: 'text-yellow-600'
    },
    {
      title: 'New Founders',
      value: stats.newFounders.toString(),
      change: '+23%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'High Priority',
      value: stats.highPriority.toString(),
      change: '+8%',
      trend: 'up',
      icon: Target,
      color: 'text-red-600'
    },
    {
      title: 'Conversion Rate',
      value: stats.conversionRate,
      change: '+0.8%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-600'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header with Live Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Real-time VC sourcing intelligence</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 rounded-full">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className={`text-sm font-medium ${isLive ? 'text-green-700' : 'text-gray-600'}`}>
              {isLive ? 'Live Monitoring' : 'Paused'}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            className="flex items-center space-x-2"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Refresh Data</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLiveMode}
            className="flex items-center space-x-2"
          >
            {isLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isLive ? 'Pause' : 'Resume'}</span>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <ArrowUpRight className="w-3 h-3 mr-1" />
                      {stat.change} from last week
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Signals */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent High-Quality Signals</CardTitle>
            <Button variant="outline" size="sm">
              View All
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentSignals.map((signal) => (
              <div 
                key={signal.id} 
                className={`p-4 border rounded-lg transition-all duration-300 ${
                  signal.isNew 
                    ? 'border-green-400 bg-green-50/50 shadow-md' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{signal.founder}</h3>
                      <Badge variant="outline" className="text-xs">
                        {signal.company}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        {getSourceIcon(signal.source)}
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getStrengthColor(signal.strength)}`}
                        >
                          {signal.strength}% match
                        </Badge>
                        {signal.isNew && (
                          <Badge className="bg-green-500 text-white text-xs animate-bounce">
                            NEW
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{signal.description}</p>
                    <p className="text-sm font-medium text-primary mb-2">{signal.signal}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {signal.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {signal.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewProfile(signal)}
                    >
                      View Profile
                    </Button>
                    <Button size="sm">
                      Add to Watch
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Founders */}
        <Card>
          <CardHeader>
            <CardTitle>Top Scored Founders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topFounders.map((founder, index) => (
              <div key={founder.name} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">#{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                      {founder.name}
                    </h4>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs font-medium">{founder.score}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{founder.company}</p>
                  <p className="text-xs text-gray-500 mb-2">{founder.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{founder.signals} signals</span>
                    <span>{founder.location}</span>
                  </div>
                  <Progress value={founder.score} className="h-1 mt-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Signal Sources Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Twitter className="w-5 h-5 text-blue-400" />
                <h3 className="font-semibold">X (Twitter)</h3>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Signals Today</span>
                <span className="font-medium">{sourceStats.twitter.count}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">High Priority</span>
                <span className="font-medium">{Math.floor(sourceStats.twitter.count * 0.15)}</span>
              </div>
              <Progress value={sourceStats.twitter.quality} className="h-2" />
              <p className="text-xs text-gray-500">{sourceStats.twitter.quality}% signal quality</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Linkedin className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold">LinkedIn</h3>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Signals Today</span>
                <span className="font-medium">{sourceStats.linkedin.count}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">High Priority</span>
                <span className="font-medium">{Math.floor(sourceStats.linkedin.count * 0.18)}</span>
              </div>
              <Progress value={sourceStats.linkedin.quality} className="h-2" />
              <p className="text-xs text-gray-500">{sourceStats.linkedin.quality}% signal quality</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Github className="w-5 h-5 text-gray-700" />
                <h3 className="font-semibold">GitHub</h3>
              </div>
              <Badge variant="secondary">Active</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Signals Today</span>
                <span className="font-medium">{sourceStats.github.count}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">High Priority</span>
                <span className="font-medium">{Math.floor(sourceStats.github.count * 0.22)}</span>
              </div>
              <Progress value={sourceStats.github.quality} className="h-2" />
              <p className="text-xs text-gray-500">{sourceStats.github.quality}% signal quality</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Founder Profile Modal */}
      <FounderProfileModal 
        signal={selectedSignal}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
