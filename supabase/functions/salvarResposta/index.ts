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
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const body = await req.json()
    const { publicToken, questionId, respostaBool } = body

    // Validate required fields
    if (!publicToken || !questionId || respostaBool === undefined) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: publicToken, questionId, respostaBool' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get the run by publicToken
    const { data: run, error: runError } = await supabase
      .from('diagnosticRuns')
      .select('id, status')
      .eq('publicToken', publicToken)
      .single()

    if (runError || !run) {
      console.error('Error finding diagnostic run:', runError)
      return new Response(
        JSON.stringify({ error: 'Diagnostic run not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if run is still in progress
    if (run.status !== 'IN_PROGRESS') {
      return new Response(
        JSON.stringify({ error: 'Diagnostic run is already completed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Upsert the answer (update if exists, insert if not)
    const { data: answer, error: answerError } = await supabase
      .from('diagnosticAnswers')
      .upsert(
        {
          runId: run.id,
          questionId: questionId,
          respostaBool: respostaBool,
        },
        {
          onConflict: 'runId,questionId',
        }
      )
      .select()
      .single()

    if (answerError) {
      console.error('Error saving answer:', answerError)
      return new Response(
        JSON.stringify({ error: 'Failed to save answer', details: answerError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Saved answer for run:', run.id, 'question:', questionId, 'answer:', respostaBool)

    return new Response(
      JSON.stringify({ success: true, answerId: answer.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error in salvarResposta:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
