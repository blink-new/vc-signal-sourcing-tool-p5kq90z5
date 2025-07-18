import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { 
  Download, 
  Upload,
  Database,
  FileText,
  Table,
  Mail,
  Webhook,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Zap,
  Filter,
  Calendar,
  Users,
  Target,
  BarChart3
} from 'lucide-react'

// Mock data for export history
const exportHistory = [
  {
    id: 'export_1',
    name: 'High Priority Founders - January 2024',
    type: 'csv',
    format: 'Founder Profiles',
    records: 156,
    status: 'completed',
    created_at: '2024-01-20 10:30:00',
    file_size: '2.3 MB',
    download_url: '#'
  },
  {
    id: 'export_2',
    name: 'Signal Analytics Report',
    type: 'pdf',
    format: 'Analytics Report',
    records: 1,
    status: 'completed',
    created_at: '2024-01-19 15:45:00',
    file_size: '8.7 MB',
    download_url: '#'
  }
]

// CRM integrations
const crmIntegrations = [
  {
    id: 'salesforce',
    name: 'Salesforce',
    description: 'Sync founder profiles and signals to Salesforce CRM',
    icon: Database,
    status: 'connected',
    last_sync: '2024-01-20 14:30:00',
    records_synced: 234,
    config: {
      api_endpoint: 'https://your-org.salesforce.com',
      object_mapping: 'Lead',
      sync_frequency: 'hourly'
    }
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    description: 'Import founder data into HubSpot contacts and companies',
    icon: Target,
    status: 'disconnected',
    last_sync: null,
    records_synced: 0,
    config: null
  }
]

const exportFormats = [
  { id: 'csv', label: 'CSV', description: 'Comma-separated values for spreadsheets' },
  { id: 'xlsx', label: 'Excel', description: 'Microsoft Excel format' },
  { id: 'json', label: 'JSON', description: 'JavaScript Object Notation for APIs' },
  { id: 'pdf', label: 'PDF', description: 'Formatted report document' }
]

const exportTypes = [
  { id: 'founders', label: 'Founder Profiles', description: 'Complete founder information and metrics' },
  { id: 'signals', label: 'Signal Feed', description: 'All detected signals with metadata' },
  { id: 'watchlists', label: 'Watchlist Data', description: 'Organized founder collections' },
  { id: 'analytics', label: 'Analytics Report', description: 'Performance metrics and insights' }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
    case 'connected':
    case 'active':
      return 'text-green-600'
    case 'processing':
    case 'pending':
      return 'text-yellow-600'
    case 'failed':
    case 'disconnected':
    case 'inactive':
      return 'text-red-600'
    default:
      return 'text-gray-600'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
    case 'connected':
    case 'active':
      return <CheckCircle className="w-4 h-4 text-green-600" />
    case 'processing':
    case 'pending':
      return <Clock className="w-4 h-4 text-yellow-600" />
    case 'failed':
    case 'disconnected':
    case 'inactive':
      return <XCircle className="w-4 h-4 text-red-600" />
    default:
      return <Clock className="w-4 h-4 text-gray-600" />
  }
}

export default function ExportIntegration() {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [selectedExportType, setSelectedExportType] = useState('')
  const [selectedFormat, setSelectedFormat] = useState('')
  const [exportName, setExportName] = useState('')
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [dateRange, setDateRange] = useState('7d')

  const availableFields = {
    founders: ['name', 'email', 'company', 'location', 'score', 'signals_count', 'social_links'],
    signals: ['title', 'description', 'source', 'signal_type', 'strength', 'founder_name', 'detected_at'],
    watchlists: ['name', 'description', 'founder_count', 'created_at', 'founder_list'],
    analytics: ['signal_volume', 'source_distribution', 'location_metrics', 'performance_kpis']
  }

  const handleExport = () => {
    const exportConfig = {
      type: selectedExportType,
      format: selectedFormat,
      name: exportName,
      fields: selectedFields,
      date_range: dateRange
    }
    
    console.log('Starting export:', exportConfig)
    setIsExportDialogOpen(false)
    // Reset form
    setSelectedExportType('')
    setSelectedFormat('')
    setExportName('')
    setSelectedFields([])
  }

  const handleToggleIntegration = (integrationId: string) => {
    console.log('Toggling integration:', integrationId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Export & Integrations</h1>
          <p className="text-gray-600">CRM integration and data export capabilities</p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Export Data</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Export Name</label>
                  <Input
                    placeholder="Enter export name..."
                    value={exportName}
                    onChange={(e) => setExportName(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Data Type</label>
                    <Select value={selectedExportType} onValueChange={setSelectedExportType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select data type" />
                      </SelectTrigger>
                      <SelectContent>
                        {exportTypes.map(type => (
                          <SelectItem key={type.id} value={type.id}>
                            <div>
                              <div className="font-medium">{type.label}</div>
                              <div className="text-xs text-gray-500">{type.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Format</label>
                    <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        {exportFormats.map(format => (
                          <SelectItem key={format.id} value={format.id}>
                            <div>
                              <div className="font-medium">{format.label}</div>
                              <div className="text-xs text-gray-500">{format.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Date Range</label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">Last 24 hours</SelectItem>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 90 days</SelectItem>
                      <SelectItem value="all">All time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedExportType && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Fields to Include</label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded p-3">
                      {availableFields[selectedExportType as keyof typeof availableFields]?.map(field => (
                        <div key={field} className="flex items-center space-x-2">
                          <Checkbox
                            id={field}
                            checked={selectedFields.includes(field)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedFields([...selectedFields, field])
                              } else {
                                setSelectedFields(selectedFields.filter(f => f !== field))
                              }
                            }}
                          />
                          <label htmlFor={field} className="text-sm cursor-pointer capitalize">
                            {field.replace('_', ' ')}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleExport} 
                    disabled={!selectedExportType || !selectedFormat || !exportName.trim()}
                  >
                    Start Export
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="exports" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="exports">Export History</TabsTrigger>
          <TabsTrigger value="crm">CRM Integrations</TabsTrigger>
          <TabsTrigger value="api">API Access</TabsTrigger>
        </TabsList>

        <TabsContent value="exports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Exports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exportHistory.map((export_item) => (
                  <div key={export_item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-gray-100 rounded">
                        <FileText className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{export_item.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span>{export_item.format}</span>
                          <span>{export_item.records} records</span>
                          <span>{new Date(export_item.created_at).toLocaleString()}</span>
                          {export_item.file_size && <span>{export_item.file_size}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(export_item.status)}
                        <span className={`text-sm capitalize ${getStatusColor(export_item.status)}`}>
                          {export_item.status}
                        </span>
                      </div>
                      {export_item.status === 'completed' && (
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crm" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {crmIntegrations.map((integration) => {
              const Icon = integration.icon
              return (
                <Card key={integration.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded">
                          <Icon className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                          <p className="text-sm text-gray-600">{integration.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(integration.status)}
                        <span className={`text-sm capitalize ${getStatusColor(integration.status)}`}>
                          {integration.status}
                        </span>
                      </div>
                    </div>

                    {integration.status === 'connected' && integration.config && (
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Records Synced</span>
                          <span className="font-medium">{integration.records_synced}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Last Sync</span>
                          <span className="font-medium">
                            {integration.last_sync ? new Date(integration.last_sync).toLocaleString() : 'Never'}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      {integration.status === 'connected' ? (
                        <>
                          <Button size="sm" variant="outline">
                            <Settings className="w-4 h-4 mr-2" />
                            Configure
                          </Button>
                          <Button size="sm" variant="outline">
                            Sync Now
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleToggleIntegration(integration.id)}
                          >
                            Disconnect
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" onClick={() => handleToggleIntegration(integration.id)}>
                          Connect
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">API Documentation</h3>
                <p className="text-sm text-blue-800 mb-3">
                  Access your data programmatically using our REST API. Perfect for custom integrations and automated workflows.
                </p>
                <Button size="sm" variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Documentation
                </Button>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">API Key</h3>
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
                  <Button size="sm" variant="outline">
                    Regenerate
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Keep your API key secure and never share it publicly.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Rate Limits</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded">
                    <p className="text-sm font-medium">Requests per minute</p>
                    <p className="text-2xl font-bold text-primary">1,000</p>
                  </div>
                  <div className="p-3 border rounded">
                    <p className="text-sm font-medium">Daily limit</p>
                    <p className="text-2xl font-bold text-primary">100,000</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}