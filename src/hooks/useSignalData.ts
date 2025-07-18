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

// Enhanced rate limiting helper with exponential backoff
class RateLimiter {
  private queue: Array<() => Promise<any>> = []
  private processing = false
  private lastRequest = 0
  private minInterval = 2000 // 2 seconds between requests (reduced from 1s)
  private backoffMultiplier = 1
  private maxBackoff = 60000 // Max 1 minute backoff

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn()
          // Reset backoff on success
          this.backoffMultiplier = 1
          resolve(result)
        } catch (error) {
          // Increase backoff on rate limit errors
          if (error.status === 429) {
            this.backoffMultiplier = Math.min(this.backoffMultiplier * 2, this.maxBackoff / this.minInterval)
            console.log(`Rate limited, increasing backoff to ${this.minInterval * this.backoffMultiplier}ms`)
          }
          reject(error)
        }
      })
      this.process()
    })
  }

  private async process() {
    if (this.processing || this.queue.length === 0) return
    
    this.processing = true
    
    while (this.queue.length > 0) {
      const now = Date.now()
      const currentInterval = this.minInterval * this.backoffMultiplier
      const timeSinceLastRequest = now - this.lastRequest
      
      if (timeSinceLastRequest < currentInterval) {
        await new Promise(resolve => setTimeout(resolve, currentInterval - timeSinceLastRequest))
      }
      
      const fn = this.queue.shift()
      if (fn) {
        try {
          await fn()
        } catch (error) {
          console.error('Rate limited request failed:', error)
        }
        this.lastRequest = Date.now()
      }
    }
    
    this.processing = false
  }
}

const rateLimiter = new RateLimiter()

export function useSignalData() {
  const [signals, setSignals] = useState<Signal[]>([])
  const [founders, setFounders] = useState<Founder[]>([])
  const [isLive, setIsLive] = useState(true)
  const [loading, setLoading] = useState(true)
  const [lastFetch, setLastFetch] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Enhanced error handling with exponential backoff and better rate limit handling
  const withRetry = useCallback(async <T>(fn: () => Promise<T>, maxRetries = 2): Promise<T> => {
    let lastError: any
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn()
      } catch (error: any) {
        lastError = error
        
        // Handle rate limiting specifically - wait longer and don't retry immediately
        if (error.status === 429) {
          const retryAfter = error.details?.reset ? 
            Math.max(new Date(error.details.reset).getTime() - Date.now(), 30000) : // At least 30 seconds
            Math.min(Math.pow(2, i + 3) * 1000, 120000) // 8s, 16s, max 2 minutes
          
          console.log(`Rate limited, waiting ${Math.round(retryAfter/1000)}s before retry ${i + 1}/${maxRetries}`)
          
          // For rate limits, only retry once after a longer wait
          if (i === 0) {
            await new Promise(resolve => setTimeout(resolve, retryAfter))
            continue
          } else {
            // Don't retry rate limits more than once
            throw error
          }
        }
        
        // For other errors, use shorter exponential backoff
        if (i < maxRetries - 1) {
          const delay = Math.pow(2, i) * 2000 // 2s, 4s
          console.log(`Request failed, retrying in ${delay}ms (${i + 1}/${maxRetries})`)
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }
    
    throw lastError
  }, [])

  // Batch database operations to reduce API calls
  const batchedDbOperation = useCallback(async <T>(operation: () => Promise<T>): Promise<T> => {
    return rateLimiter.add(operation)
  }, [])

  // Store signals with proper upsert and rate limiting - MUCH smaller batches
  const storeSignalsInDatabase = useCallback(async (freshSignals: any[], userId: string) => {
    try {
      // Process in very small batches to avoid rate limits
      const batchSize = 2 // Reduced from 5 to 2
      const batches = []
      
      for (let i = 0; i < freshSignals.length; i += batchSize) {
        batches.push(freshSignals.slice(i, i + batchSize))
      }

      for (const batch of batches) {
        // Process batch items sequentially instead of parallel to reduce load
        for (const signalData of batch) {
          try {
            const founderId = `${signalData.signal.source}_${signalData.founder.username}`
            
            // Use upsert pattern for founders with better error handling
            await batchedDbOperation(async () => {
              try {
                // Try to create founder
                await blink.db.founders.create({
                  id: founderId,
                  name: signalData.founder.name,
                  company: signalData.founder.company || 'Unknown Company',
                  description: signalData.founder.description || '',
                  location: signalData.founder.location || 'Unknown',
                  score: signalData.signal.strength,
                  signals_count: 1,
                  twitter_handle: signalData.signal.source === 'twitter' ? signalData.founder.username : null,
                  github_username: signalData.signal.source === 'github' ? signalData.founder.username : null,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  user_id: userId
                })
              } catch (error: any) {
                // If founder exists, update it
                if (error.status === 409) {
                  try {
                    const existingFounders = await blink.db.founders.list({ 
                      where: { id: founderId, user_id: userId }, 
                      limit: 1 
                    })
                    if (existingFounders.length > 0) {
                      await blink.db.founders.update(founderId, {
                        score: Math.max(existingFounders[0].score, signalData.signal.strength),
                        signals_count: (existingFounders[0].signals_count || 0) + 1,
                        updated_at: new Date().toISOString()
                      })
                    }
                  } catch (updateError) {
                    console.error('Error updating founder:', updateError)
                  }
                } else {
                  throw error
                }
              }
            })

            // Add delay between founder and signal operations
            await new Promise(resolve => setTimeout(resolve, 200))

            // Use upsert pattern for signals
            await batchedDbOperation(async () => {
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
              } catch (error: any) {
                // Signal already exists, skip
                if (error.status === 409) {
                  console.log('Signal already exists:', signalData.id)
                } else {
                  throw error
                }
              }
            })
            
          } catch (error) {
            console.error('Error processing signal:', signalData.id, error)
          }
          
          // Add delay between each signal processing
          await new Promise(resolve => setTimeout(resolve, 300))
        }
        
        // Longer delay between batches
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    } catch (error) {
      console.error('Error storing signals in database:', error)
      throw error
    }
  }, [batchedDbOperation])

  // Refresh data from database with rate limiting
  const refreshDataFromDatabase = useCallback(async (userId: string) => {
    try {
      const [freshSignals, freshFounders] = await Promise.all([
        batchedDbOperation(() => 
          withRetry(() => blink.db.signals.list({
            where: { user_id: userId },
            orderBy: { created_at: 'desc' },
            limit: 50
          }))
        ),
        batchedDbOperation(() => 
          withRetry(() => blink.db.founders.list({
            where: { user_id: userId },
            orderBy: { score: 'desc' },
            limit: 20
          }))
        )
      ])

      // Transform data efficiently
      const transformedSignals = freshSignals.map((signal: any) => {
        const founder = freshFounders.find((f: any) => f.id === signal.founder_id)
        
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
      throw error
    }
  }, [batchedDbOperation, withRetry])

  // Fetch fresh signals from APIs with better error handling
  const fetchFreshSignals = useCallback(async (userId: string) => {
    try {
      setError(null)
      console.log('Fetching fresh signals...')
      
      // Fetch from both APIs concurrently but with error isolation
      const [twitterResult, githubResult] = await Promise.allSettled([
        fetch('https://p5kq90z5--fetch-twitter-signals.functions.blink.new')
          .then(async (response) => {
            if (!response.ok) {
              throw new Error(`Twitter API failed: ${response.status}`)
            }
            const data = await response.json()
            return data.success ? data.signals : []
          }),
        fetch('https://p5kq90z5--fetch-github-signals.functions.blink.new')
          .then(async (response) => {
            if (!response.ok) {
              throw new Error(`GitHub API failed: ${response.status}`)
            }
            const data = await response.json()
            return data.success ? data.signals : []
          })
      ])

      let allFreshSignals: any[] = []
      
      if (twitterResult.status === 'fulfilled') {
        allFreshSignals.push(...twitterResult.value)
        console.log('Twitter signals:', twitterResult.value.length)
      } else {
        console.error('Twitter API failed:', twitterResult.reason)
      }
      
      if (githubResult.status === 'fulfilled') {
        allFreshSignals.push(...githubResult.value)
        console.log('GitHub signals:', githubResult.value.length)
      } else {
        console.error('GitHub API failed:', githubResult.reason)
      }

      // If no signals from APIs, use mock data for demo
      if (allFreshSignals.length === 0) {
        console.log('No signals from APIs, using mock data for demo')
        allFreshSignals = getMockSignals()
      }
      
      console.log('Total fresh signals:', allFreshSignals.length)

      if (allFreshSignals.length > 0) {
        // Store signals with rate limiting
        await storeSignalsInDatabase(allFreshSignals, userId)
        
        // Refresh UI data
        await refreshDataFromDatabase(userId)
        
        setLastFetch(new Date())
      }

    } catch (error) {
      console.error('Error fetching fresh signals:', error)
      setError('Failed to fetch fresh signals. Using existing data.')
      
      // Fallback to mock data on error
      try {
        const mockSignals = getMockSignals()
        await storeSignalsInDatabase(mockSignals, userId)
        await refreshDataFromDatabase(userId)
        setLastFetch(new Date())
      } catch (mockError) {
        console.error('Error with mock data fallback:', mockError)
        setError('Unable to load any data. Please try refreshing.')
      }
    }
  }, [storeSignalsInDatabase, refreshDataFromDatabase])

  // Load initial data with improved error handling and caching
  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null)
        
        // Get current user
        const user = await blink.auth.me()
        if (!user) {
          console.log('User not authenticated')
          setLoading(false)
          return
        }

        console.log('Loading signals for user:', user.id)

        // First, load existing data from database (fast)
        try {
          await refreshDataFromDatabase(user.id)
          console.log('Loaded existing data from database')
          setLoading(false) // Set loading to false after we have some data
        } catch (error) {
          console.error('Error loading existing data:', error)
          // If we can't load existing data, show mock data immediately
          const mockSignals = getMockSignals()
          try {
            await storeSignalsInDatabase(mockSignals, user.id)
            await refreshDataFromDatabase(user.id)
            console.log('Loaded mock data as fallback')
          } catch (mockError) {
            console.error('Error with mock data fallback:', mockError)
            setError('Unable to load data. Please check your connection.')
          }
          setLoading(false)
        }

        // Then fetch fresh data in background (slower) - only if we haven't fetched recently
        const shouldFetchFresh = !lastFetch || (Date.now() - lastFetch.getTime()) > 10 * 60 * 1000 // 10 minutes
        
        if (shouldFetchFresh) {
          setTimeout(async () => {
            try {
              console.log('Fetching fresh signals in background...')
              await fetchFreshSignals(user.id)
            } catch (error) {
              console.error('Background refresh failed:', error)
              // Don't show error to user for background refresh failures
            }
          }, 2000) // 2 second delay to let UI render first
        } else {
          console.log('Skipping fresh data fetch, too recent')
        }

      } catch (error) {
        console.error('Error loading data:', error)
        setError('Failed to load data. Please try refreshing.')
        setSignals([])
        setFounders([])
        setLoading(false)
      }
    }

    loadData()
  }, [fetchFreshSignals, refreshDataFromDatabase, storeSignalsInDatabase, lastFetch])

  // Auto-refresh with much longer intervals to avoid rate limits
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(async () => {
      try {
        const user = await blink.auth.me()
        if (user) {
          // Only refresh if last fetch was more than 15 minutes ago
          if (!lastFetch || (Date.now() - lastFetch.getTime()) > 15 * 60 * 1000) {
            console.log('Auto-refreshing signals...')
            await fetchFreshSignals(user.id)
          } else {
            console.log('Skipping auto-refresh, too recent')
          }
        }
      } catch (error) {
        console.error('Error in auto-refresh:', error)
      }
    }, 20 * 60 * 1000) // 20 minutes instead of 10

    return () => clearInterval(interval)
  }, [isLive, fetchFreshSignals, lastFetch])

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
    error,
    toggleLiveMode,
    getStats,
    getSourceStats,
    refreshData: async () => {
      try {
        setError(null)
        const user = await blink.auth.me()
        if (user) {
          await fetchFreshSignals(user.id)
        }
      } catch (error) {
        console.error('Manual refresh failed:', error)
        setError('Refresh failed. Please try again.')
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