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

    // Use service role for database operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check for optional auth header
    const authHeader = req.headers.get('Authorization')
    let userId: string | null = null

    if (authHeader?.startsWith('Bearer ')) {
      const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
      const userSupabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } }
      })

      const token = authHeader.replace('Bearer ', '')
      const { data: claimsData, error: claimsError } = await userSupabase.auth.getClaims(token)

      if (!claimsError && claimsData?.claims?.sub) {
        userId = claimsData.claims.sub
        console.log('Authenticated user:', userId)
      }
    }

    const body = await req.json()
    const { publicToken, nome, email, whatsapp, empresa, cargo, faturamento, regime, fonte } = body

    console.log('Received data:', { publicToken, nome, email, empresa, cargo, faturamento, regime })

    if (!publicToken) {
      console.error('Missing publicToken')
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

    console.log('Found run:', run.id, 'with usuarioId:', run.usuarioId)

    // If authenticated, handle claiming
    if (userId) {
      if (!run.usuarioId) {
        console.log('Claiming run for user:', userId)
        const { error: claimError } = await supabase
          .from('diagnosticRuns')
          .update({ usuarioId: userId })
          .eq('id', run.id)

        if (claimError) {
          console.error('Error claiming run:', claimError)
          return new Response(
            JSON.stringify({ error: 'Failed to claim diagnostic run', details: claimError.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      } else if (run.usuarioId !== userId) {
        console.error('Run belongs to another user:', run.usuarioId)
        return new Response(
          JSON.stringify({ error: 'This diagnostic run belongs to another user' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Update the run with complementary data
    const updateData: Record<string, string | null> = {}

    // Usa fonte enviada pelo frontend, com fallback para F360
    updateData.fonte = fonte || 'F360'

    if (userId) updateData.usuarioId = userId
    if (nome) updateData.leadNome = nome
    if (email) updateData.leadEmail = email
    if (whatsapp) updateData.leadWhatsapp = whatsapp
    if (empresa) updateData.nomeEmpresa = empresa
    if (cargo) updateData.cargoUsuario = cargo
    if (faturamento) updateData.faturamentoAnual = faturamento
    if (regime) updateData.regimeTributario = regime

    console.log('Updating run with data:', updateData)

    const { data: updatedRun, error: updateError } = await supabase
      .from('diagnosticRuns')
      .update(updateData)
      .eq('id', run.id)
      .select()

    if (updateError) {
      console.error('Error updating run:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update diagnostic run', details: updateError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Successfully updated run:', updatedRun)

    return new Response(
      JSON.stringify({ success: true, runId: run.id, data: updatedRun?.[0] }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
