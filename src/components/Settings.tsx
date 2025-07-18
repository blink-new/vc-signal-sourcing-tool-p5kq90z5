import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Database,
  Zap,
  Twitter,
  Linkedin,
  Github,
  Key,
  Globe,
  Mail,
  Smartphone,
  Slack,
  Webhook,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react'

export default function Settings() {
  const [showApiKey, setShowApiKey] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    slack: false,
    webhook: false,
    sms: false
  })
  const [signalThreshold, setSignalThreshold] = useState([85])
  const [autoSync, setAutoSync] = useState(true)
  const [dataRetention, setDataRetention] = useState('90')
  
  // API Integration settings
  const [apiSettings, setApiSettings] = useState({
    twitter_bearer_token: '••••••••••••••••••••••••••••••••••••••••',
    linkedin_access_token: '••••••••••••••••••••••••••••••••••••••••',
    github_token: '••••••••••••••••••••••••••••••••••••••••',
    openai_api_key: '••••••••••••••••••••••••••••••••••••••••'
  })

  const handleSaveSettings = () => {
    console.log('Saving settings...')
    // In real app, this would save to backend
  }

  const handleTestConnection = (service: string) => {
    console.log(`Testing ${service} connection...`)
    // In real app, this would test the API connection
  }

  const handleRegenerateApiKey = () => {
    console.log('Regenerating API key...')
    // In real app, this would regenerate the API key
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Configure your account and system preferences</p>
        </div>
        <Button onClick={handleSaveSettings}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">First Name</label>
                  <Input defaultValue="John" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Last Name</label>
                  <Input defaultValue="Doe" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Email</label>
                <Input type="email" defaultValue="john.doe@vc-firm.com" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Company</label>
                <Input defaultValue="Accel Partners" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Role</label>
                <Select defaultValue="partner">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="partner">Partner</SelectItem>
                    <SelectItem value="principal">Principal</SelectItem>
                    <SelectItem value="associate">Associate</SelectItem>
                    <SelectItem value="analyst">Analyst</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Investment Focus</label>
                <Textarea 
                  placeholder="Describe your investment focus areas..."
                  defaultValue="Early-stage B2B SaaS, AI/ML, and fintech startups in India"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Notification Channels */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Notification Channels</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-600">Receive alerts via email</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Slack className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Slack Integration</p>
                        <p className="text-sm text-gray-600">Send alerts to Slack channels</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.slack}
                      onCheckedChange={(checked) => setNotifications({...notifications, slack: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Webhook className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium">Webhook Notifications</p>
                        <p className="text-sm text-gray-600">Send to custom endpoints</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.webhook}
                      onCheckedChange={(checked) => setNotifications({...notifications, webhook: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium">SMS Alerts</p>
                        <p className="text-sm text-gray-600">Critical alerts via SMS</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications.sms}
                      onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                    />
                  </div>
                </div>
              </div>

              {/* Alert Thresholds */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Alert Thresholds</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Minimum Signal Strength for Alerts: {signalThreshold[0]}%
                    </label>
                    <Slider
                      value={signalThreshold}
                      onValueChange={setSignalThreshold}
                      max={100}
                      min={50}
                      step={5}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Only signals above this threshold will trigger notifications
                    </p>
                  </div>
                </div>
              </div>

              {/* Notification Schedule */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Notification Schedule</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Quiet Hours Start</label>
                    <Input type="time" defaultValue="22:00" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Quiet Hours End</label>
                    <Input type="time" defaultValue="08:00" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  No notifications will be sent during quiet hours
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Integrations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Twitter Integration */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Twitter className="w-6 h-6 text-blue-400" />
                    <div>
                      <h3 className="font-semibold">Twitter API</h3>
                      <p className="text-sm text-gray-600">Monitor tweets and user activities</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Connected</Badge>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Bearer Token</label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        type={showApiKey ? 'text' : 'password'}
                        value={apiSettings.twitter_bearer_token}
                        readOnly
                      />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleTestConnection('twitter')}>
                        Test
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* LinkedIn Integration */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Linkedin className="w-6 h-6 text-blue-600" />
                    <div>
                      <h3 className="font-semibold">LinkedIn API</h3>
                      <p className="text-sm text-gray-600">Track professional updates and posts</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Connected</Badge>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Access Token</label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        type="password"
                        value={apiSettings.linkedin_access_token}
                        readOnly
                      />
                      <Button size="sm" variant="outline" onClick={() => handleTestConnection('linkedin')}>
                        Test
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* GitHub Integration */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Github className="w-6 h-6 text-gray-700" />
                    <div>
                      <h3 className="font-semibold">GitHub API</h3>
                      <p className="text-sm text-gray-600">Monitor repositories and developer activity</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Connected</Badge>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Personal Access Token</label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        type="password"
                        value={apiSettings.github_token}
                        readOnly
                      />
                      <Button size="sm" variant="outline" onClick={() => handleTestConnection('github')}>
                        Test
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* OpenAI Integration */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Zap className="w-6 h-6 text-purple-600" />
                    <div>
                      <h3 className="font-semibold">OpenAI API</h3>
                      <p className="text-sm text-gray-600">AI-powered signal analysis and insights</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Connected</Badge>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">API Key</label>
                    <div className="flex items-center space-x-2">
                      <Input 
                        type="password"
                        value={apiSettings.openai_api_key}
                        readOnly
                      />
                      <Button size="sm" variant="outline" onClick={() => handleTestConnection('openai')}>
                        Test
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monitoring Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Auto Sync */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto Sync</p>
                  <p className="text-sm text-gray-600">Automatically sync data from connected sources</p>
                </div>
                <Switch 
                  checked={autoSync}
                  onCheckedChange={setAutoSync}
                />
              </div>

              {/* Sync Frequency */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Sync Frequency</label>
                <Select defaultValue="hourly">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="15min">Every 15 minutes</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Data Retention */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Data Retention Period</label>
                <Select value={dataRetention} onValueChange={setDataRetention}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">6 months</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                    <SelectItem value="forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  How long to keep historical signal data
                </p>
              </div>

              {/* Monitoring Regions */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Geographic Focus</label>
                <div className="grid grid-cols-2 gap-2">
                  {['India', 'Southeast Asia', 'Middle East', 'Global'].map(region => (
                    <div key={region} className="flex items-center space-x-2">
                      <input type="checkbox" id={region} defaultChecked={region === 'India'} />
                      <label htmlFor={region} className="text-sm">{region}</label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* API Key Management */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">API Key Management</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium">Primary API Key</p>
                      <p className="text-sm text-gray-600">Used for external integrations</p>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input 
                      type="password" 
                      value="sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" 
                      readOnly 
                      className="font-mono"
                    />
                    <Button size="sm" variant="outline">
                      Copy
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleRegenerateApiKey}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Regenerate
                    </Button>
                  </div>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                </div>
                <Button variant="outline">
                  Enable 2FA
                </Button>
              </div>

              {/* Session Management */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Active Sessions</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-sm text-gray-600">Chrome on macOS • 192.168.1.100</p>
                      <p className="text-xs text-gray-500">Last active: Just now</p>
                    </div>
                    <Badge variant="secondary">Current</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">Mobile Session</p>
                      <p className="text-sm text-gray-600">Safari on iOS • 192.168.1.101</p>
                      <p className="text-xs text-gray-500">Last active: 2 hours ago</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Revoke
                    </Button>
                  </div>
                </div>
              </div>

              {/* Data Privacy */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Data Privacy</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Analytics Tracking</p>
                      <p className="text-sm text-gray-600">Help improve the product with usage analytics</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Data Sharing</p>
                      <p className="text-sm text-gray-600">Share anonymized data for research purposes</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Plan */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-blue-900">Professional Plan</h3>
                    <p className="text-sm text-blue-800">$299/month • Billed annually</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-blue-600 font-medium">API Calls</p>
                    <p className="text-blue-900">45,230 / 100,000</p>
                  </div>
                  <div>
                    <p className="text-blue-600 font-medium">Signals Tracked</p>
                    <p className="text-blue-900">2,847 / 10,000</p>
                  </div>
                  <div>
                    <p className="text-blue-600 font-medium">Founders</p>
                    <p className="text-blue-900">1,234 / 5,000</p>
                  </div>
                </div>
              </div>

              {/* Usage Statistics */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">This Month's Usage</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded">
                    <p className="text-sm font-medium text-gray-600">API Requests</p>
                    <p className="text-2xl font-bold text-gray-900">45,230</p>
                    <p className="text-xs text-green-600">↑ 12% from last month</p>
                  </div>
                  <div className="p-4 border rounded">
                    <p className="text-sm font-medium text-gray-600">Data Export</p>
                    <p className="text-2xl font-bold text-gray-900">23</p>
                    <p className="text-xs text-gray-500">exports this month</p>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
                <div className="flex items-center justify-between p-4 border rounded">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                      VISA
                    </div>
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-gray-600">Expires 12/25</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Update
                  </Button>
                </div>
              </div>

              {/* Billing History */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Recent Invoices</h3>
                <div className="space-y-2">
                  {[
                    { date: '2024-01-01', amount: '$299.00', status: 'Paid' },
                    { date: '2023-12-01', amount: '$299.00', status: 'Paid' },
                    { date: '2023-11-01', amount: '$299.00', status: 'Paid' }
                  ].map((invoice, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{invoice.date}</p>
                        <p className="text-sm text-gray-600">{invoice.amount}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{invoice.status}</Badge>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}