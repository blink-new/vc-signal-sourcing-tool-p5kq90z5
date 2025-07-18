import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: 'vc-signal-sourcing-tool-p5kq90z5',
  authRequired: true
})

// Types for our data models
export interface Founder {
  id: string
  name: string
  email?: string
  company: string
  description: string
  location: string
  score: number
  signals_count: number
  twitter_handle?: string
  linkedin_url?: string
  github_username?: string
  avatar_url?: string
  created_at: string
  updated_at: string
  user_id: string
}

export interface Signal {
  id: string
  founder_id: string
  source: 'twitter' | 'linkedin' | 'github'
  signal_type: 'funding' | 'product' | 'technical' | 'hiring' | 'partnership' | 'recognition'
  title: string
  description: string
  url?: string
  strength: number
  engagement_count: number
  followers_count: number
  detected_at: string
  created_at: string
  user_id: string
}

export interface Watchlist {
  id: string
  name: string
  description?: string
  founder_ids: string[]
  created_at: string
  updated_at: string
  user_id: string
}

export interface Alert {
  id: string
  name: string
  conditions: {
    sources?: string[]
    signal_types?: string[]
    min_strength?: number
    keywords?: string[]
    locations?: string[]
  }
  is_active: boolean
  notification_email?: string
  created_at: string
  user_id: string
}

// API Integration helpers
export const apiIntegrations = {
  // Twitter API integration
  async fetchTwitterSignals(keywords: string[]) {
    try {
      const response = await blink.data.fetch({
        url: 'https://api.twitter.com/2/tweets/search/recent',
        method: 'GET',
        query: {
          query: keywords.join(' OR '),
          'tweet.fields': 'author_id,created_at,public_metrics',
          'user.fields': 'name,username,location,public_metrics',
          expansions: 'author_id'
        },
        headers: {
          'Authorization': 'Bearer {{twitter_bearer_token}}'
        }
      })
      return response.body
    } catch (error) {
      console.error('Twitter API error:', error)
      return null
    }
  },

  // LinkedIn API integration
  async fetchLinkedInSignals(keywords: string[]) {
    try {
      const response = await blink.data.fetch({
        url: 'https://api.linkedin.com/v2/shares',
        method: 'GET',
        headers: {
          'Authorization': 'Bearer {{linkedin_access_token}}'
        }
      })
      return response.body
    } catch (error) {
      console.error('LinkedIn API error:', error)
      return null
    }
  },

  // GitHub API integration
  async fetchGitHubSignals(keywords: string[]) {
    try {
      const response = await blink.data.fetch({
        url: 'https://api.github.com/search/repositories',
        method: 'GET',
        query: {
          q: keywords.join(' '),
          sort: 'updated',
          order: 'desc'
        },
        headers: {
          'Authorization': 'token {{github_token}}',
          'Accept': 'application/vnd.github.v3+json'
        }
      })
      return response.body
    } catch (error) {
      console.error('GitHub API error:', error)
      return null
    }
  }
}