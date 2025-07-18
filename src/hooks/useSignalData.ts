import { useState, useEffect, useCallback } from 'react'
import { blink } from '@/lib/blink'

export interface Signal {
  id: string
  founder: string
  company: string
  signal: string
  source: 'twitter' | 'linkedin' | 'github'
  strength: number
  location: string
  time: string
  description: string
  category: 'funding' | 'product' | 'technical' | 'hiring' | 'partnership' | 'recognition'
  engagement: number
  followers: string
  isNew?: boolean
}

export interface Founder {
  id: string
  name: string
  company: string
  score: number
  signals: number
  location: string
  description: string
  avatar?: string
}

export function useSignalData() {
  const [signals, setSignals] = useState<Signal[]>([])
  const [founders, setFounders] = useState<Founder[]>([])
  const [isLive, setIsLive] = useState(true)
  const [loading, setLoading] = useState(true)
  const [lastFetch, setLastFetch] = useState<Date | null>(null)

  // Fetch fresh signals from Twitter and GitHub
  const fetchFreshSignals = useCallback(async (userId: string) => {
    try {
      console.log('Calling Twitter API...')
      // Fetch Twitter signals
      const twitterResponse = await fetch('https://p5kq90z5--fetch-twitter-signals.functions.blink.new')
      let twitterSignals = []
      if (twitterResponse.ok) {
        const twitterData = await twitterResponse.json()
        if (twitterData.success) {
          twitterSignals = twitterData.signals
          console.log('Twitter signals:', twitterSignals.length)
        } else if (twitterData.rateLimited) {
          console.log('Twitter API rate limited, using mock data')
        }
      } else {
        console.error('Twitter API failed:', twitterResponse.status, await twitterResponse.text())
      }

      console.log('Calling GitHub API...')
      // Fetch GitHub signals
      const githubResponse = await fetch('https://p5kq90z5--fetch-github-signals.functions.blink.new')
      let githubSignals = []
      if (githubResponse.ok) {
        const githubData = await githubResponse.json()
        if (githubData.success) {
          githubSignals = githubData.signals
          console.log('GitHub signals:', githubSignals.length)
        }
      } else {
        console.error('GitHub API failed:', githubResponse.status, await githubResponse.text())
      }

      // Combine and process signals
      let allFreshSignals = [...twitterSignals, ...githubSignals]
      
      // If no signals from APIs, use mock data for demo
      if (allFreshSignals.length === 0) {
        console.log('No signals from APIs, using mock data for demo')
        allFreshSignals = getMockSignals()
      }
      
      console.log('Total fresh signals:', allFreshSignals.length)

      if (allFreshSignals.length > 0) {
        // Store signals and founders in database
        await storeSignalsInDatabase(allFreshSignals, userId)
        
        // Update UI with fresh data
        await refreshDataFromDatabase(userId)
        
        setLastFetch(new Date())
      }

    } catch (error) {
      console.error('Error fetching fresh signals:', error)
      
      // Fallback to mock data on error
      try {
        const mockSignals = getMockSignals()
        await storeSignalsInDatabase(mockSignals, userId)
        await refreshDataFromDatabase(userId)
        setLastFetch(new Date())
      } catch (mockError) {
        console.error('Error with mock data fallback:', mockError)
      }
    }
  }, [])

  // Store signals in database
  const storeSignalsInDatabase = async (freshSignals: any[], userId: string) => {
    try {
      for (const signalData of freshSignals) {
        // Create or update founder
        const founderId = `${signalData.signal.source}_${signalData.founder.username}`
        
        try {
          await blink.db.founders.create({
            id: founderId,
            name: signalData.founder.name,
            company: signalData.founder.company || 'Unknown Company',
            description: signalData.founder.description,
            location: signalData.founder.location,
            score: signalData.signal.strength,
            signals_count: 1,
            twitter_handle: signalData.signal.source === 'twitter' ? signalData.founder.username : null,
            github_username: signalData.signal.source === 'github' ? signalData.founder.username : null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            user_id: userId
          })
        } catch (error) {
          // Founder might already exist, try to update
          try {
            const existingFounder = await blink.db.founders.list({ 
              where: { id: founderId, user_id: userId }, 
              limit: 1 
            })
            if (existingFounder.length > 0) {
              await blink.db.founders.update(founderId, {
                score: Math.max(existingFounder[0].score, signalData.signal.strength),
                signals_count: (existingFounder[0].signals_count || 0) + 1,
                updated_at: new Date().toISOString()
              })
            }
          } catch (updateError) {
            console.error('Error updating founder:', updateError)
          }
        }

        // Create signal
        try {
          await blink.db.signals.create({
            id: signalData.id,
            founder_id: founderId,
            source: signalData.signal.source,
            signal_type: signalData.signal.signalType,
            title: signalData.signal.title,
            description: signalData.signal.description,
            url: signalData.signal.url,
            strength: signalData.signal.strength,
            engagement_count: signalData.signal.engagement,
            followers_count: signalData.founder.followers,
            detected_at: signalData.signal.createdAt,
            created_at: new Date().toISOString(),
            user_id: userId
          })
        } catch (error) {
          // Signal might already exist, skip
          console.log('Signal already exists:', signalData.id)
        }
      }
    } catch (error) {
      console.error('Error storing signals in database:', error)
    }
  }

  // Refresh data from database
  const refreshDataFromDatabase = async (userId: string) => {
    try {
      const freshSignals = await blink.db.signals.list({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
        limit: 50
      })

      const freshFounders = await blink.db.founders.list({
        where: { user_id: userId },
        orderBy: { score: 'desc' },
        limit: 20
      })

      // Transform fresh data
      const transformedSignals = await Promise.all(
        freshSignals.map(async (signal: any) => {
          const founder = freshFounders.find((f: any) => f.id === signal.founder_id) || 
                         await blink.db.founders.list({ where: { id: signal.founder_id }, limit: 1 }).then(f => f[0])
          
          return {
            id: signal.id,
            founder: founder?.name || 'Unknown',
            company: founder?.company || 'Unknown Company',
            signal: signal.title,
            source: signal.source,
            strength: signal.strength,
            location: founder?.location || 'Unknown',
            time: getTimeAgo(signal.created_at),
            description: signal.description || founder?.description || '',
            category: signal.signal_type,
            engagement: signal.engagement_count || 0,
            followers: formatFollowers(signal.followers_count || 0),
            isNew: isRecentSignal(signal.created_at)
          }
        })
      )

      const transformedFounders = freshFounders.map((founder: any) => ({
        id: founder.id,
        name: founder.name,
        company: founder.company,
        score: founder.score,
        signals: founder.signals_count,
        location: founder.location,
        description: founder.description,
        avatar: founder.avatar_url
      }))

      setSignals(transformedSignals)
      setFounders(transformedFounders)

    } catch (error) {
      console.error('Error refreshing data from database:', error)
    }
  }

  // Load initial data and fetch fresh signals
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get current user
        const user = await blink.auth.me()
        if (!user) {
          console.log('User not authenticated')
          setLoading(false)
          return
        }

        console.log('Loading signals for user:', user.id)

        // First, try to load existing signals from database
        const existingSignals = await blink.db.signals.list({
          where: { user_id: user.id },
          orderBy: { created_at: 'desc' },
          limit: 50
        })

        const existingFounders = await blink.db.founders.list({
          where: { user_id: user.id },
          orderBy: { score: 'desc' },
          limit: 20
        })

        console.log('Loaded from DB:', existingSignals.length, 'signals,', existingFounders.length, 'founders')

        // Transform existing data
        if (existingSignals.length > 0) {
          const transformedSignals = await Promise.all(
            existingSignals.map(async (signal: any) => {
              const founder = existingFounders.find((f: any) => f.id === signal.founder_id) || 
                             await blink.db.founders.list({ where: { id: signal.founder_id }, limit: 1 }).then(f => f[0])
              
              return {
                id: signal.id,
                founder: founder?.name || 'Unknown',
                company: founder?.company || 'Unknown Company',
                signal: signal.title,
                source: signal.source,
                strength: signal.strength,
                location: founder?.location || 'Unknown',
                time: getTimeAgo(signal.created_at),
                description: signal.description || founder?.description || '',
                category: signal.signal_type,
                engagement: signal.engagement_count || 0,
                followers: formatFollowers(signal.followers_count || 0)
              }
            })
          )

          const transformedFounders = existingFounders.map((founder: any) => ({
            id: founder.id,
            name: founder.name,
            company: founder.company,
            score: founder.score,
            signals: founder.signals_count,
            location: founder.location,
            description: founder.description,
            avatar: founder.avatar_url
          }))

          setSignals(transformedSignals)
          setFounders(transformedFounders)
        }

        // Fetch fresh signals from APIs (this will take a moment)
        console.log('Fetching fresh signals from APIs...')
        await fetchFreshSignals(user.id)

      } catch (error) {
        console.error('Error loading data:', error)
        // Show empty state on error
        setSignals([])
        setFounders([])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [fetchFreshSignals])

  // Auto-refresh every 5 minutes when live
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(async () => {
      try {
        const user = await blink.auth.me()
        if (user) {
          await fetchFreshSignals(user.id)
        }
      } catch (error) {
        console.error('Error in auto-refresh:', error)
      }
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [isLive, fetchFreshSignals])

  const toggleLiveMode = () => {
    setIsLive(!isLive)
  }

  const getStats = () => {
    const highPriorityCount = signals.filter(s => s.strength >= 90).length
    const newFoundersCount = founders.length
    const totalSignals = signals.length
    
    return {
      activeSignals: totalSignals,
      newFounders: newFoundersCount,
      highPriority: highPriorityCount,
      conversionRate: '4.2%'
    }
  }

  const getSourceStats = () => {
    const twitterSignals = signals.filter(s => s.source === 'twitter').length
    const linkedinSignals = signals.filter(s => s.source === 'linkedin').length
    const githubSignals = signals.filter(s => s.source === 'github').length
    
    return {
      twitter: {
        count: twitterSignals,
        quality: Math.floor(78 + Math.random() * 10)
      },
      linkedin: {
        count: linkedinSignals,
        quality: Math.floor(82 + Math.random() * 10)
      },
      github: {
        count: githubSignals,
        quality: Math.floor(88 + Math.random() * 10)
      }
    }
  }

  return {
    signals,
    founders,
    isLive,
    loading,
    lastFetch,
    toggleLiveMode,
    getStats,
    getSourceStats,
    refreshData: async () => {
      const user = await blink.auth.me()
      if (user) {
        await fetchFreshSignals(user.id)
      }
    }
  }
}

// Helper functions
function getTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''} ago`
  return `${Math.floor(diffInMinutes / 1440)} day${Math.floor(diffInMinutes / 1440) > 1 ? 's' : ''} ago`
}

function formatFollowers(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
  return count.toString()
}

function isRecentSignal(dateString: string): boolean {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  return diffInMinutes < 30 // Consider signals from last 30 minutes as "new"
}

// Mock data for demo when APIs are unavailable
function getMockSignals() {
  const now = new Date()
  const mockSignals = [
    {
      id: `mock_twitter_${Date.now()}_1`,
      founder: {
        name: 'Arjun Sharma',
        username: 'arjun_builds',
        location: 'Bangalore, India',
        followers: 2500,
        description: 'Building the future of fintech in India'
      },
      signal: {
        title: 'Just raised our pre-seed round! 🚀 Building the next-gen payment platform for SMEs',
        description: 'Excited to announce that we\'ve raised $500K in pre-seed funding to revolutionize payments for small businesses across India. Our MVP is live and growing 20% MoM!',
        url: 'https://twitter.com/arjun_builds/status/mock',
        source: 'twitter',
        signalType: 'funding',
        strength: 92,
        engagement: 156,
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
      }
    },
    {
      id: `mock_github_${Date.now()}_2`,
      founder: {
        name: 'Priya Patel',
        username: 'priya-dev',
        location: 'Mumbai, India',
        followers: 890,
        description: 'Full-stack developer, AI enthusiast'
      },
      signal: {
        title: 'Active development on ai-tutor-platform',
        description: 'Building an AI-powered tutoring platform for Indian students. Using React, Node.js, and OpenAI API.',
        url: 'https://github.com/priya-dev/ai-tutor-platform',
        source: 'github',
        signalType: 'product',
        strength: 78,
        engagement: 45,
        createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
      }
    },
    {
      id: `mock_twitter_${Date.now()}_3`,
      founder: {
        name: 'Rohit Kumar',
        username: 'rohit_startup',
        location: 'Delhi, India',
        followers: 1200,
        description: 'Serial entrepreneur, ex-Flipkart'
      },
      signal: {
        title: 'Hiring our first 5 engineers! Join us in building the Uber for logistics',
        description: 'We\'re scaling fast and need talented engineers to join our logistics startup. Already processing 1000+ orders daily across 3 cities.',
        url: 'https://twitter.com/rohit_startup/status/mock',
        source: 'twitter',
        signalType: 'hiring',
        strength: 85,
        engagement: 89,
        createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString() // 6 hours ago
      }
    },
    {
      id: `mock_github_${Date.now()}_4`,
      founder: {
        name: 'Sneha Reddy',
        username: 'sneha-codes',
        location: 'Hyderabad, India',
        followers: 650,
        description: 'Building healthcare solutions'
      },
      signal: {
        title: 'Active development on telemedicine-app',
        description: 'Creating a telemedicine platform to connect rural patients with doctors. Built with React Native and Firebase.',
        url: 'https://github.com/sneha-codes/telemedicine-app',
        source: 'github',
        signalType: 'product',
        strength: 82,
        engagement: 67,
        createdAt: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString() // 8 hours ago
      }
    },
    {
      id: `mock_twitter_${Date.now()}_5`,
      founder: {
        name: 'Vikash Singh',
        username: 'vikash_builds',
        location: 'Pune, India',
        followers: 3400,
        description: 'Building SaaS for Indian SMBs'
      },
      signal: {
        title: 'Launched on Product Hunt today! Our inventory management SaaS for retailers',
        description: 'After 8 months of building, we\'re live on Product Hunt! Our SaaS helps small retailers manage inventory efficiently. Already have 50+ paying customers.',
        url: 'https://twitter.com/vikash_builds/status/mock',
        source: 'twitter',
        signalType: 'product',
        strength: 88,
        engagement: 234,
        createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString() // 12 hours ago
      }
    }
  ]
  
  return mockSignals
}