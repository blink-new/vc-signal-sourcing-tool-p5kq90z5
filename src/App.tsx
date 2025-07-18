import React, { useState, useEffect } from 'react'
import { Toaster } from '@/components/ui/toaster'
import Dashboard from '@/components/Dashboard'
import SignalsFeed from '@/components/SignalsFeed'
import FounderProfiles from '@/components/FounderProfiles'
import Watchlists from '@/components/Watchlists'
import Analytics from '@/components/Analytics'
import AlertSystem from '@/components/AlertSystem'
import ExportIntegration from '@/components/ExportIntegration'
import Settings from '@/components/Settings'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import SignalNotification from '@/components/SignalNotification'
import { blink } from '@/lib/blink'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading SignalSource...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-primary mb-2">SignalSource</h1>
            <p className="text-muted-foreground">VC Sourcing Intelligence Platform</p>
          </div>
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Welcome to SignalSource</h2>
            <p className="text-muted-foreground mb-6">
              Monitor X, LinkedIn, and GitHub to identify high-quality founders the moment they start building.
            </p>
            <button
              onClick={() => blink.auth.login()}
              className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Sign In to Continue
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'signals':
        return <SignalsFeed />
      case 'founders':
        return <FounderProfiles />
      case 'watchlists':
        return <Watchlists />
      case 'analytics':
        return <Analytics />
      case 'alerts':
        return <AlertSystem />
      case 'export':
        return <ExportIntegration />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            {renderContent()}
          </main>
        </div>
      </div>
      <SignalNotification />
      <Toaster />
    </div>
  )
}

export default App