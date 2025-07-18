import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { 
  Bell, 
  Plus, 
  Edit, 
  Trash2, 
  Settings,
  Mail,
  Smartphone,
  Slack,
  Webhook,
  Zap,
  Target,
  Filter,
  Clock,
  TrendingUp,
  Users,
  MapPin,
  Twitter,
  Linkedin,
  Github,
  DollarSign,
  Rocket,
  Code,
  Briefcase,
  Star,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'

// Mock data for alerts
const alerts = [
  {
    id: 'alert_1',
    name: 'High Strength Signals',
    description: 'Notify when signals with 90%+ strength are detected',
    conditions: {
      min_strength: 90,
      sources: ['twitter', 'linkedin', 'github'],
      signal_types: [],
      keywords: [],
      locations: []
    },
    is_active: true,
    notification_channels: ['email', 'slack'],
    notification_email: 'investor@vc-firm.com',
    created_at: '2024-01-15',
    last_triggered: '2024-01-20 10:30:00',
    trigger_count: 23
  },
  {
    id: 'alert_2',
    name: 'Funding Announcements',
    description: 'Track all funding-related signals above 80% strength',
    conditions: {
      min_strength: 80,
      sources: ['twitter', 'linkedin'],
      signal_types: ['funding'],
      keywords: ['seed', 'series', 'funding', 'investment', 'raised'],
      locations: []
    },
    is_active: true,
    notification_channels: ['email', 'webhook'],
    notification_email: 'investor@vc-firm.com',
    created_at: '2024-01-18',
    last_triggered: '2024-01-20 14:15:00',
    trigger_count: 12
  }
]

const recentTriggers = [
  {
    id: 'trigger_1',
    alert_name: 'High Strength Signals',
    founder_name: 'Arjun Sharma',
    company: 'TechFlow AI',
    signal: 'Announced $2M seed round',
    strength: 95,
    triggered_at: '2024-01-20 10:30:00',
    status: 'sent'
  },
  {
    id: 'trigger_2',
    alert_name: 'Funding Announcements',
    founder_name: 'Meera Joshi',
    company: 'AgriSmart',
    signal: 'Series A discussions initiated',
    strength: 89,
    triggered_at: '2024-01-20 14:15:00',
    status: 'sent'
  }
]

const sourceOptions = [
  { id: 'twitter', label: 'Twitter', icon: Twitter },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { id: 'github', label: 'GitHub', icon: Github }
]

const signalTypeOptions = [
  { id: 'funding', label: 'Funding', icon: DollarSign },
  { id: 'product', label: 'Product', icon: Rocket },
  { id: 'technical', label: 'Technical', icon: Code },
  { id: 'hiring', label: 'Hiring', icon: Users },
  { id: 'partnership', label: 'Partnership', icon: Briefcase },
  { id: 'recognition', label: 'Recognition', icon: Star }
]

const locationOptions = [
  'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai', 'Gurgaon', 'Kolkata'
]

const notificationChannels = [
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'slack', label: 'Slack', icon: Slack },
  { id: 'webhook', label: 'Webhook', icon: Webhook },
  { id: 'sms', label: 'SMS', icon: Smartphone }
]

export default function AlertSystem() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [alertName, setAlertName] = useState('')
  const [alertDescription, setAlertDescription] = useState('')
  const [minStrength, setMinStrength] = useState([80])
  const [selectedSources, setSelectedSources] = useState<string[]>([])
  const [selectedSignalTypes, setSelectedSignalTypes] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [keywords, setKeywords] = useState('')
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['email'])
  const [notificationEmail, setNotificationEmail] = useState('')

  const handleCreateAlert = () => {
    const newAlert = {
      name: alertName,
      description: alertDescription,
      conditions: {
        min_strength: minStrength[0],
        sources: selectedSources,
        signal_types: selectedSignalTypes,
        locations: selectedLocations,
        keywords: keywords.split(',').map(k => k.trim()).filter(k => k)
      },
      notification_channels: selectedChannels,
      notification_email: notificationEmail
    }
    
    console.log('Creating alert:', newAlert)
    setIsCreateDialogOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setAlertName('')
    setAlertDescription('')
    setMinStrength([80])
    setSelectedSources([])
    setSelectedSignalTypes([])
    setSelectedLocations([])
    setKeywords('')
    setSelectedChannels(['email'])
    setNotificationEmail('')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-green-600'
      case 'failed': return 'text-red-600'
      case 'pending': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />
      default: return <AlertTriangle className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Alert System</h1>
          <p className="text-gray-600">Custom notifications for high-priority signals</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{alerts.length} alerts</Badge>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Alert
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Alert</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Alert Name</label>
                    <Input
                      placeholder="Enter alert name..."
                      value={alertName}
                      onChange={(e) => setAlertName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Description</label>
                    <Textarea
                      placeholder="Describe what this alert monitors..."
                      value={alertDescription}
                      onChange={(e) => setAlertDescription(e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>

                {/* Conditions */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Alert Conditions</h3>
                  
                  {/* Minimum Strength */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Minimum Signal Strength: {minStrength[0]}%
                    </label>
                    <Slider
                      value={minStrength}
                      onValueChange={setMinStrength}
                      max={100}
                      min={50}
                      step={5}
                      className="w-full"
                    />
                  </div>

                  {/* Sources */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Sources</label>
                    <div className="grid grid-cols-3 gap-2">
                      {sourceOptions.map((source) => {
                        const Icon = source.icon
                        return (
                          <div key={source.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={source.id}
                              checked={selectedSources.includes(source.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedSources([...selectedSources, source.id])
                                } else {
                                  setSelectedSources(selectedSources.filter(s => s !== source.id))
                                }
                              }}
                            />
                            <label htmlFor={source.id} className="flex items-center space-x-1 text-sm cursor-pointer">
                              <Icon className="w-4 h-4" />
                              <span>{source.label}</span>
                            </label>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Keywords */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Keywords (optional)</label>
                    <Input
                      placeholder="Enter keywords separated by commas..."
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">e.g., AI, machine learning, fintech</p>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Notification Settings</h3>
                  
                  {/* Channels */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Notification Channels</label>
                    <div className="grid grid-cols-2 gap-2">
                      {notificationChannels.map((channel) => {
                        const Icon = channel.icon
                        return (
                          <div key={channel.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={channel.id}
                              checked={selectedChannels.includes(channel.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedChannels([...selectedChannels, channel.id])
                                } else {
                                  setSelectedChannels(selectedChannels.filter(c => c !== channel.id))
                                }
                              }}
                            />
                            <label htmlFor={channel.id} className="flex items-center space-x-1 text-sm cursor-pointer">
                              <Icon className="w-4 h-4" />
                              <span>{channel.label}</span>
                            </label>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Email Settings */}
                  {selectedChannels.includes('email') && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Email Address</label>
                      <Input
                        type="email"
                        placeholder="Enter email address..."
                        value={notificationEmail}
                        onChange={(e) => setNotificationEmail(e.target.value)}
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateAlert} disabled={!alertName.trim() || selectedSources.length === 0}>
                    Create Alert
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts List */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{alert.name}</h3>
                      <Badge variant={alert.is_active ? 'default' : 'secondary'}>
                        {alert.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Zap className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs text-gray-500">{alert.trigger_count} triggers</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{alert.description}</p>
                    
                    {/* Conditions Summary */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">
                        ≥{alert.conditions.min_strength}% strength
                      </Badge>
                      {alert.conditions.sources.map(source => (
                        <Badge key={source} variant="outline" className="text-xs capitalize">
                          {source}
                        </Badge>
                      ))}
                    </div>

                    {alert.last_triggered && (
                      <p className="text-xs text-gray-500 mt-2">
                        Last triggered: {new Date(alert.last_triggered).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch checked={alert.is_active} />
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Triggers */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Triggers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentTriggers.map((trigger) => (
                <div key={trigger.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{trigger.alert_name}</h4>
                      <p className="text-xs text-gray-600">{trigger.founder_name} • {trigger.company}</p>
                    </div>
                    {getStatusIcon(trigger.status)}
                  </div>
                  <p className="text-xs text-primary mb-2">{trigger.signal}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Target className="w-3 h-3" />
                      <span>{trigger.strength}% match</span>
                    </div>
                    <span>{new Date(trigger.triggered_at).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}