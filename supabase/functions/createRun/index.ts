import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get request body (optional - can include userAgent)
    let userAgent = null
    let ipHash = null
    
    let fonte = 'F360' // fallback padrão
    let origem = null
    
    try {
      const body = await req.json()
      userAgent = body.userAgent || null
      ipHash = body.ipHash || null
      if (body.fonte) fonte = body.fonte
      if (body.origem) origem = body.origem
    } catch {
      // No body provided, that's fine
    }

    // Get the active questionnaire version
    const { data: version, error: versionError } = await supabase
      .from('questionnaireVersions')
      .select('id')
      .eq('ativo', true)
      .single()

    if (versionError || !version) {
      console.error('Error fetching active questionnaire version:', versionError)
      return new Response(
        JSON.stringify({ error: 'No active questionnaire version found' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate a new publicToken
    const publicToken = crypto.randomUUID()

    // Create the diagnostic run
    const { data: run, error: runError } = await supabase
      .from('diagnosticRuns')
      .insert({
        questionnaireVersionId: version.id,
        publicToken: publicToken,
        status: 'IN_PROGRESS',
        userAgent: userAgent,
        ipHash: ipHash,
        fonte: fonte,
        origem: origem,
      })
      .select('id, publicToken')
      .single()

    if (runError) {
      console.error('Error creating diagnostic run:', runError)
      return new Response(
        JSON.stringify({ error: 'Failed to create diagnostic run', details: runError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Created diagnostic run:', run.id, 'with publicToken:', run.publicToken)

    return new Response(
      JSON.stringify({ 
        publicToken: run.publicToken,
        runId: run.id 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error in createRun:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
