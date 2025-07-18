import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

interface TwitterUser {
  id: string;
  name: string;
  username: string;
  location?: string;
  public_metrics: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
  };
}

interface TwitterTweet {
  id: string;
  text: string;
  author_id: string;
  created_at: string;
  public_metrics: {
    retweet_count: number;
    like_count: number;
    reply_count: number;
    quote_count: number;
  };
}

interface TwitterResponse {
  data: TwitterTweet[];
  includes?: {
    users: TwitterUser[];
  };
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    const bearerToken = Deno.env.get('TWITTER_BEARER_TOKEN');
    if (!bearerToken) {
      throw new Error('Twitter Bearer Token not found');
    }

    // Simplified query to avoid rate limits and complexity
    // Focus on high-value keywords only
    const query = '("raised funding" OR "seed round" OR "launched product") (India OR Bangalore OR Mumbai) -is:retweet lang:en';

    const url = new URL('https://api.twitter.com/2/tweets/search/recent');
    url.searchParams.set('query', query);
    url.searchParams.set('tweet.fields', 'author_id,created_at,public_metrics');
    url.searchParams.set('user.fields', 'name,username,location,public_metrics,description');
    url.searchParams.set('expansions', 'author_id');
    url.searchParams.set('max_results', '20'); // Reduced to avoid rate limits

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'User-Agent': 'SignalSource-VC-Tool/1.0'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Twitter API Error:', response.status, errorText);
      
      // Handle rate limiting gracefully
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          success: true, 
          signals: [],
          message: 'Twitter API rate limit reached. Please try again later.',
          rateLimited: true
        }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
      
      throw new Error(`Twitter API error: ${response.status} ${errorText}`);
    }

    const data: TwitterResponse = await response.json();
    
    if (!data.data || data.data.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        signals: [],
        message: 'No Twitter signals found'
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Process tweets into signals
    const signals = data.data.map(tweet => {
      const author = data.includes?.users?.find(user => user.id === tweet.author_id);
      
      // Calculate signal strength based on engagement and keywords
      const engagement = tweet.public_metrics.like_count + 
                        tweet.public_metrics.retweet_count + 
                        tweet.public_metrics.reply_count;
      
      let strength = 60; // Higher base strength for filtered results
      
      // Boost for high engagement
      if (engagement > 50) strength += 15;
      if (engagement > 200) strength += 15;
      
      // Boost for follower count
      if (author && author.public_metrics.followers_count > 1000) strength += 10;
      if (author && author.public_metrics.followers_count > 10000) strength += 10;
      
      // Boost for funding-related keywords
      if (tweet.text.toLowerCase().includes('funding') || 
          tweet.text.toLowerCase().includes('raised') ||
          tweet.text.toLowerCase().includes('seed')) {
        strength += 20;
      }
      
      // Boost for product launch keywords
      if (tweet.text.toLowerCase().includes('launch') || 
          tweet.text.toLowerCase().includes('mvp') ||
          tweet.text.toLowerCase().includes('product hunt')) {
        strength += 15;
      }

      // Determine signal type
      let signalType = 'recognition';
      if (tweet.text.toLowerCase().includes('funding') || tweet.text.toLowerCase().includes('raised')) {
        signalType = 'funding';
      } else if (tweet.text.toLowerCase().includes('launch') || tweet.text.toLowerCase().includes('mvp')) {
        signalType = 'product';
      } else if (tweet.text.toLowerCase().includes('hiring') || tweet.text.toLowerCase().includes('engineer')) {
        signalType = 'hiring';
      }

      return {
        id: `twitter_${tweet.id}`,
        founder: {
          name: author?.name || 'Unknown',
          username: author?.username || '',
          location: author?.location || 'Unknown',
          followers: author?.public_metrics.followers_count || 0,
          description: author?.description || ''
        },
        signal: {
          title: tweet.text.substring(0, 100) + (tweet.text.length > 100 ? '...' : ''),
          description: tweet.text,
          url: `https://twitter.com/${author?.username}/status/${tweet.id}`,
          source: 'twitter',
          signalType,
          strength: Math.min(strength, 100),
          engagement: engagement,
          createdAt: tweet.created_at
        }
      };
    });

    return new Response(JSON.stringify({ 
      success: true, 
      signals,
      count: signals.length 
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Error fetching Twitter signals:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
});