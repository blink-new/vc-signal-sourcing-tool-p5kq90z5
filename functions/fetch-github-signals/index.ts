import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

interface GitHubUser {
  id: number;
  login: string;
  name?: string;
  location?: string;
  followers: number;
  public_repos: number;
  bio?: string;
  company?: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  stargazers_count: number;
  forks_count: number;
  language?: string;
  owner: GitHubUser;
  html_url: string;
}

interface GitHubSearchResponse {
  total_count: number;
  items: GitHubRepo[];
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
    const githubToken = Deno.env.get('GITHUB_TOKEN');
    if (!githubToken) {
      throw new Error('GitHub Token not found');
    }

    // Simplified query to avoid "too many operators" error
    // Focus on high-value indicators with fewer OR operators
    const query = 'startup saas mvp created:>2024-01-01 stars:>10';

    const url = new URL('https://api.github.com/search/repositories');
    url.searchParams.set('q', query);
    url.searchParams.set('sort', 'updated');
    url.searchParams.set('order', 'desc');
    url.searchParams.set('per_page', '30'); // Reduced to avoid rate limits

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'SignalSource-VC-Tool/1.0'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GitHub API Error:', response.status, errorText);
      
      // Handle validation errors gracefully
      if (response.status === 422) {
        return new Response(JSON.stringify({ 
          success: true, 
          signals: [],
          message: 'GitHub search query needs refinement. Using fallback approach.',
          queryError: true
        }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
      
      throw new Error(`GitHub API error: ${response.status} ${errorText}`);
    }

    const data: GitHubSearchResponse = await response.json();
    
    if (!data.items || data.items.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        signals: [],
        message: 'No GitHub signals found'
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Process repositories into signals (limit to avoid rate limits on user API calls)
    const limitedRepos = data.items.slice(0, 10);
    const signals = [];

    for (const repo of limitedRepos) {
      try {
        // Get additional user info with rate limiting consideration
        let userDetails = repo.owner;
        
        // Only fetch user details for high-potential repos to save API calls
        if (repo.stargazers_count > 20 || repo.forks_count > 5) {
          try {
            const userResponse = await fetch(`https://api.github.com/users/${repo.owner.login}`, {
              headers: {
                'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'SignalSource-VC-Tool/1.0'
              }
            });
            if (userResponse.ok) {
              userDetails = await userResponse.json();
            }
          } catch (error) {
            console.error('Error fetching user details:', error);
          }
        }

        // Calculate signal strength based on repo metrics and activity
        let strength = 50; // Base strength for GitHub signals
        
        // Boost for stars
        if (repo.stargazers_count > 20) strength += 15;
        if (repo.stargazers_count > 100) strength += 20;
        
        // Boost for forks
        if (repo.forks_count > 10) strength += 10;
        if (repo.forks_count > 50) strength += 15;
        
        // Boost for recent activity
        const lastUpdate = new Date(repo.updated_at);
        const daysSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceUpdate < 7) strength += 20;
        else if (daysSinceUpdate < 30) strength += 10;
        
        // Boost for user followers
        if (userDetails.followers > 100) strength += 15;
        if (userDetails.followers > 500) strength += 15;
        
        // Boost for multiple repos (indicates active developer)
        if (userDetails.public_repos > 20) strength += 10;

        // Determine signal type based on repo characteristics
        let signalType = 'technical';
        const description = repo.description?.toLowerCase() || '';
        const name = repo.name.toLowerCase();
        
        if (description.includes('startup') || description.includes('business') || description.includes('saas')) {
          signalType = 'product';
        } else if (description.includes('mvp') || description.includes('prototype')) {
          signalType = 'product';
        } else if (name.includes('api') || name.includes('backend') || name.includes('service')) {
          signalType = 'technical';
        }

        // Create signal description
        const signalDescription = repo.description || 
          `${repo.owner.login} is actively developing ${repo.name}, a ${repo.language || 'software'} project with ${repo.stargazers_count} stars and ${repo.forks_count} forks.`;

        const signal = {
          id: `github_${repo.id}`,
          founder: {
            name: userDetails.name || repo.owner.login,
            username: repo.owner.login,
            location: userDetails.location || 'Unknown',
            followers: userDetails.followers || 0,
            description: userDetails.bio || '',
            company: userDetails.company || ''
          },
          signal: {
            title: `Active development on ${repo.name}`,
            description: signalDescription,
            url: repo.html_url,
            source: 'github',
            signalType,
            strength: Math.min(strength, 100),
            engagement: repo.stargazers_count + repo.forks_count,
            createdAt: repo.updated_at
          }
        };

        signals.push(signal);
        
        // Add small delay to avoid hitting rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error('Error processing repo:', repo.name, error);
        continue;
      }
    }

    // Filter out low-quality signals
    const qualitySignals = signals.filter(signal => signal.signal.strength >= 60);

    return new Response(JSON.stringify({ 
      success: true, 
      signals: qualitySignals,
      count: qualitySignals.length 
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Error fetching GitHub signals:', error);
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