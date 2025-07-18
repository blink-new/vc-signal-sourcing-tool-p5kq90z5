import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Bell, 
  Filter,
  Plus,
  Activity
} from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex items-center space-x-4 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search founders, companies, or signals..."
              className="pl-10 pr-4"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {/* Live Status */}
          <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-green-700 font-medium">Live</span>
          </div>

          {/* New Signals Badge */}
          <Badge variant="secondary" className="bg-accent/10 text-accent">
            <Activity className="w-3 h-3 mr-1" />
            12 new signals
          </Badge>

          {/* Notifications */}
          <Button variant="outline" size="sm" className="relative">
            <Bell className="w-4 h-4" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          </Button>

          {/* Add to Watchlist */}
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Watch
          </Button>
        </div>
      </div>
    </header>
  )
}