import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

interface ProcessedSignal {
  id: string;
  founder: {
    name: string;
    username: string;
    location: string;
    followers: number;
    description: string;
    company?: string;
  };
  signal: {
    title: string;
    description: string;
    url: string;
    source: 'twitter' | 'github';
    signalType: string;
    strength: number;
    engagement: number;
    createdAt: string;
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

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  try {
    const { userId } = await req.json();
    
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Fetch signals from Twitter
    const twitterResponse = await fetch(`${req.url.replace('/process-signals', '/fetch-twitter-signals')}`, {
      method: 'GET',
    });
    
    let twitterSignals: ProcessedSignal[] = [];
    if (twitterResponse.ok) {
      const twitterData = await twitterResponse.json();
      if (twitterData.success) {
        twitterSignals = twitterData.signals;
      }
    }

    // Fetch signals from GitHub
    const githubResponse = await fetch(`${req.url.replace('/process-signals', '/fetch-github-signals')}`, {
      method: 'GET',
    });
    
    let githubSignals: ProcessedSignal[] = [];
    if (githubResponse.ok) {
      const githubData = await githubResponse.json();
      if (githubData.success) {
        githubSignals = githubData.signals;
      }
    }

    // Combine all signals
    const allSignals = [...twitterSignals, ...githubSignals];
    
    if (allSignals.length === 0) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'No new signals found',
        processed: 0
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Process and store signals
    const processedSignals = [];
    const processedFounders = [];

    for (const signalData of allSignals) {
      try {
        // Create or update founder
        const founderId = `${signalData.signal.source}_${signalData.founder.username}`;
        const founderData = {
          id: founderId,
          name: signalData.founder.name,
          company: signalData.founder.company || 'Unknown Company',
          description: signalData.founder.description,
          location: signalData.founder.location,
          score: signalData.signal.strength,
          signals_count: 1,
          twitter_handle: signalData.signal.source === 'twitter' ? signalData.founder.username : null,
          github_username: signalData.signal.source === 'github' ? signalData.founder.username : null,
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: userId
        };

        processedFounders.push(founderData);

        // Create signal
        const signalRecord = {
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
        };

        processedSignals.push(signalRecord);
      } catch (error) {
        console.error('Error processing signal:', error);
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Processed ${processedSignals.length} signals from ${processedFounders.length} founders`,
      processed: processedSignals.length,
      signals: processedSignals.slice(0, 10), // Return first 10 for preview
      founders: processedFounders.slice(0, 10)
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Error processing signals:', error);
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