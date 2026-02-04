import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    // Get authorization header to verify user
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - no valid token provided' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create client with user's token to get claims
    const userSupabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    const token = authHeader.replace('Bearer ', '')
    const { data: claimsData, error: claimsError } = await userSupabase.auth.getClaims(token)

    if (claimsError || !claimsData?.claims) {
      console.error('Error getting user claims:', claimsError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized - invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const userId = claimsData.claims.sub
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - no user ID in token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Use service role for database operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const body = await req.json()
    const { publicToken } = body

    if (!publicToken) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: publicToken' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get the run by publicToken
    const { data: run, error: runError } = await supabase
      .from('diagnosticRuns')
      .select('id, usuarioId')
      .eq('publicToken', publicToken)
      .single()

    if (runError || !run) {
      console.error('Error finding diagnostic run:', runError)
      return new Response(
        JSON.stringify({ error: 'Diagnostic run not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if already claimed by another user
    if (run.usuarioId && run.usuarioId !== userId) {
      return new Response(
        JSON.stringify({ error: 'Diagnostic run already claimed by another user' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if already claimed by same user
    if (run.usuarioId === userId) {
      console.log('Run already claimed by same user:', run.id)
      return new Response(
        JSON.stringify({ success: true, runId: run.id, alreadyClaimed: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Claim the run
    const { error: updateError } = await supabase
      .from('diagnosticRuns')
      .update({ usuarioId: userId })
      .eq('id', run.id)

    if (updateError) {
      console.error('Error claiming run:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to claim diagnostic run', details: updateError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Claimed diagnostic run:', run.id, 'for user:', userId)

    return new Response(
      JSON.stringify({ success: true, runId: run.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error in claimRun:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
