import React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Radio, 
  Users, 
  Bookmark, 
  BarChart3, 
  Settings,
  Target,
  Bell,
  Download
} from 'lucide-react'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'signals', label: 'Signals Feed', icon: Radio },
  { id: 'founders', label: 'Founder Profiles', icon: Users },
  { id: 'watchlists', label: 'Watchlists', icon: Bookmark },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'alerts', label: 'Alert System', icon: Bell },
  { id: 'export', label: 'Export & CRM', icon: Download },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">SignalSource</h1>
            <p className="text-xs text-gray-500">VC Intelligence</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? 'default' : 'ghost'}
              className={cn(
                'w-full justify-start text-left',
                activeTab === item.id 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              )}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon className="w-4 h-4 mr-3" />
              {item.label}
            </Button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Real-time sourcing for<br />
          Indian pre-seed VCs
        </div>
      </div>
    </div>
  )
}