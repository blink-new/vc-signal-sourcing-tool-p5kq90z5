import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Zap, 
  Target,
  Calendar,
  Filter,
  Twitter,
  Linkedin,
  Github,
  MapPin,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  PieChart,
  LineChart
} from 'lucide-react'
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Cell, Pie } from 'recharts'

// Mock analytics data
const overviewStats = [
  {
    title: 'Total Signals',
    value: '2,847',
    change: '+12.5%',
    trend: 'up',
    icon: Zap,
    color: 'text-blue-600'
  },
  {
    title: 'Unique Founders',
    value: '1,234',
    change: '+8.3%',
    trend: 'up',
    icon: Users,
    color: 'text-green-600'
  },
  {
    title: 'High Priority',
    value: '156',
    change: '+23.1%',
    trend: 'up',
    icon: Target,
    color: 'text-red-600'
  },
  {
    title: 'Conversion Rate',
    value: '4.7%',
    change: '+0.8%',
    trend: 'up',
    icon: TrendingUp,
    color: 'text-purple-600'
  }
]

const signalTrendData = [
  { date: '2024-01-01', signals: 45, high_priority: 8 },
  { date: '2024-01-02', signals: 52, high_priority: 12 },
  { date: '2024-01-03', signals: 38, high_priority: 6 },
  { date: '2024-01-04', signals: 67, high_priority: 15 },
  { date: '2024-01-05', signals: 71, high_priority: 18 },
  { date: '2024-01-06', signals: 58, high_priority: 11 },
  { date: '2024-01-07', signals: 84, high_priority: 22 },
  { date: '2024-01-08', signals: 76, high_priority: 19 },
  { date: '2024-01-09', signals: 92, high_priority: 25 },
  { date: '2024-01-10', signals: 88, high_priority: 21 }
]

const sourceDistribution = [
  { name: 'Twitter', value: 45, color: '#1DA1F2' },
  { name: 'LinkedIn', value: 35, color: '#0077B5' },
  { name: 'GitHub', value: 20, color: '#333' }
]

const signalTypeData = [
  { type: 'Funding', count: 234, percentage: 28 },
  { type: 'Product', count: 198, percentage: 24 },
  { type: 'Technical', count: 156, percentage: 19 },
  { type: 'Hiring', count: 134, percentage: 16 },
  { type: 'Partnership', count: 89, percentage: 11 },
  { type: 'Recognition', count: 67, percentage: 8 }
]

const locationData = [
  { location: 'Bangalore', founders: 156, signals: 487, avg_score: 84 },
  { location: 'Mumbai', founders: 134, signals: 398, avg_score: 81 },
  { location: 'Delhi', founders: 98, signals: 312, avg_score: 79 },
  { location: 'Hyderabad', founders: 87, signals: 267, avg_score: 82 },
  { location: 'Pune', founders: 76, signals: 234, avg_score: 85 },
  { location: 'Chennai', founders: 65, signals: 198, avg_score: 80 },
  { location: 'Gurgaon', founders: 54, signals: 167, avg_score: 83 }
]

const topFounders = [
  { name: 'Arjun Sharma', company: 'TechFlow AI', score: 95, signals: 8, engagement: 15420 },
  { name: 'Meera Joshi', company: 'AgriSmart', score: 91, signals: 9, engagement: 18750 },
  { name: 'Priya Patel', company: 'GreenLogistics', score: 88, signals: 6, engagement: 8920 },
  { name: 'Karan Singh', company: 'EduVerse', score: 84, signals: 7, engagement: 11230 },
  { name: 'Rahul Gupta', company: 'FinanceOS', score: 82, signals: 5, engagement: 5640 }
]

const performanceMetrics = [
  { metric: 'Signal Quality Score', value: 87, target: 85, status: 'above' },
  { metric: 'Response Time (avg)', value: '2.3 min', target: '3 min', status: 'above' },
  { metric: 'False Positive Rate', value: '8.2%', target: '10%', status: 'above' },
  { metric: 'Coverage Rate', value: '94.5%', target: '90%', status: 'above' },
  { metric: 'User Engagement', value: '76%', target: '70%', status: 'above' }
]

const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-green-600'
  if (score >= 80) return 'text-yellow-600'
  return 'text-orange-600'
}

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('signals')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Performance metrics and sourcing insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat) => {
          const Icon = stat.icon
          const isPositive = stat.trend === 'up'
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center mt-1">
                      {isPositive ? (
                        <ArrowUpRight className="w-3 h-3 mr-1 text-green-600" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 mr-1 text-red-600" />
                      )}
                      <span className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change} from last period
                      </span>
                    </div>
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

      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="trends">Signal Trends</TabsTrigger>
          <TabsTrigger value="sources">Source Analysis</TabsTrigger>
          <TabsTrigger value="locations">Geographic</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Signal Trends Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Signal Volume Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={signalTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="signals" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Total Signals"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="high_priority" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      name="High Priority"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Signal Types */}
            <Card>
              <CardHeader>
                <CardTitle>Signal Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {signalTypeData.map((item) => (
                  <div key={item.type} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{item.type}</span>
                        <span className="text-sm text-gray-500">{item.count}</span>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Source Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Source Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={sourceDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {sourceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Source Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Source Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Twitter className="w-8 h-8 text-blue-400" />
                    <div>
                      <h3 className="font-semibold">Twitter</h3>
                      <p className="text-sm text-gray-600">487 signals today</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">78%</p>
                    <p className="text-xs text-gray-500">Quality Score</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Linkedin className="w-8 h-8 text-blue-600" />
                    <div>
                      <h3 className="font-semibold">LinkedIn</h3>
                      <p className="text-sm text-gray-600">312 signals today</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">85%</p>
                    <p className="text-xs text-gray-500">Quality Score</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Github className="w-8 h-8 text-gray-700" />
                    <div>
                      <h3 className="font-semibold">GitHub</h3>
                      <p className="text-sm text-gray-600">156 signals today</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-700">92%</p>
                    <p className="text-xs text-gray-500">Quality Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="locations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {locationData.map((location, index) => (
                  <div key={location.location} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <h3 className="font-semibold">{location.location}</h3>
                        </div>
                        <p className="text-sm text-gray-600">
                          {location.founders} founders • {location.signals} signals
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className={`font-semibold ${getScoreColor(location.avg_score)}`}>
                          {location.avg_score}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">Avg Score</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {performanceMetrics.map((metric) => (
                  <div key={metric.metric} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{metric.metric}</h4>
                      <p className="text-sm text-gray-600">Target: {metric.target}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{metric.value}</p>
                      <div className="flex items-center">
                        {metric.status === 'above' ? (
                          <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                        )}
                        <span className={`text-xs ${metric.status === 'above' ? 'text-green-600' : 'text-red-600'}`}>
                          {metric.status === 'above' ? 'Above' : 'Below'} target
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Founders</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {topFounders.map((founder, index) => (
                  <div key={founder.name} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">#{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{founder.name}</h4>
                      <p className="text-sm text-gray-600">{founder.company}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className={`text-sm font-medium ${getScoreColor(founder.score)}`}>
                          {founder.score}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{founder.signals} signals</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle>AI-Generated Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <h4 className="font-semibold text-blue-900 mb-2">Trending Sectors</h4>
                  <p className="text-sm text-blue-800">
                    AI/ML startups are showing 34% higher signal strength this week, particularly in the fintech and healthcare sectors.
                  </p>
                </div>
                <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
                  <h4 className="font-semibold text-green-900 mb-2">Geographic Opportunity</h4>
                  <p className="text-sm text-green-800">
                    Pune and Hyderabad are emerging as high-potential markets with 28% growth in quality signals.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                  <h4 className="font-semibold text-yellow-900 mb-2">Signal Pattern</h4>
                  <p className="text-sm text-yellow-800">
                    Funding announcements typically follow product launches by 2-3 weeks. Consider early engagement.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded">
                  <h4 className="font-semibold text-purple-900 mb-2">Optimal Timing</h4>
                  <p className="text-sm text-purple-800">
                    Tuesday-Thursday 10-11 AM shows highest founder response rates for outreach.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-red-900">High Priority</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Review 23 high-strength signals from the last 24 hours that match your investment criteria.
                      </p>
                      <Button size="sm" className="mt-2">
                        Review Now
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-yellow-900">Medium Priority</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Update alert criteria to capture emerging trends in sustainable technology.
                      </p>
                      <Button size="sm" variant="outline" className="mt-2">
                        Update Alerts
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-green-900">Optimization</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Consider expanding monitoring to include Telegram and Discord for Web3 founders.
                      </p>
                      <Button size="sm" variant="outline" className="mt-2">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}