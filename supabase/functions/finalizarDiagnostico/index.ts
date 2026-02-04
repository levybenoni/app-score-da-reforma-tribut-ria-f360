import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BlockScore {
  blockId: string
  pontos: number
  pontosMaximos: number
  percentual: number
  nivelMaturidade: string
  statusCor: string
}

function calculateMaturityLevel(percentual: number): { nivel: string; cor: string } {
  if (percentual >= 70) {
    return { nivel: 'ALTA', cor: 'green' }
  } else if (percentual >= 40) {
    return { nivel: 'INTERMEDIARIA', cor: 'yellow' }
  } else {
    return { nivel: 'BAIXA', cor: 'red' }
  }
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
      .select('id, status, questionnaireVersionId')
      .eq('publicToken', publicToken)
      .single()

    if (runError || !run) {
      console.error('Error finding diagnostic run:', runError)
      return new Response(
        JSON.stringify({ error: 'Diagnostic run not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if already completed
    if (run.status === 'COMPLETED') {
      console.log('Run already completed, returning existing runId')
      return new Response(
        JSON.stringify({ success: true, runId: run.id, alreadyCompleted: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get all questions for this questionnaire version
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('id, blockId')
      .eq('questionnaireVersionId', run.questionnaireVersionId)
      .eq('ativo', true)

    if (questionsError || !questions) {
      console.error('Error fetching questions:', questionsError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch questions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get all answers for this run
    const { data: answers, error: answersError } = await supabase
      .from('diagnosticAnswers')
      .select('questionId, respostaBool')
      .eq('runId', run.id)

    if (answersError) {
      console.error('Error fetching answers:', answersError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch answers' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate all questions are answered
    const answeredQuestionIds = new Set(answers?.map(a => a.questionId) || [])
    const unansweredQuestions = questions.filter(q => !answeredQuestionIds.has(q.id))

    if (unansweredQuestions.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Not all questions answered', 
          unansweredCount: unansweredQuestions.length,
          totalQuestions: questions.length,
          answeredQuestions: answers?.length || 0
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create a map of answers by questionId
    const answerMap = new Map(answers?.map(a => [a.questionId, a.respostaBool]) || [])

    // Group questions by block and calculate scores
    const blockQuestions = new Map<string, { total: number; correct: number }>()
    
    for (const question of questions) {
      const blockId = question.blockId
      if (!blockQuestions.has(blockId)) {
        blockQuestions.set(blockId, { total: 0, correct: 0 })
      }
      
      const blockData = blockQuestions.get(blockId)!
      blockData.total += 1
      
      // SIM (true) = 1 point, NÃO (false) = 0 points
      if (answerMap.get(question.id) === true) {
        blockData.correct += 1
      }
    }

    // Calculate and insert scores for each block
    const blockScores: BlockScore[] = []
    let totalPontos = 0
    let totalPontosMaximos = 0

    for (const [blockId, data] of blockQuestions) {
      const percentual = (data.correct / data.total) * 100
      const { nivel, cor } = calculateMaturityLevel(percentual)
      
      blockScores.push({
        blockId,
        pontos: data.correct,
        pontosMaximos: data.total,
        percentual: Math.round(percentual * 100) / 100,
        nivelMaturidade: nivel,
        statusCor: cor,
      })

      totalPontos += data.correct
      totalPontosMaximos += data.total
    }

    // Insert block scores
    const { error: blockScoresError } = await supabase
      .from('diagnosticScores')
      .insert(
        blockScores.map(score => ({
          runId: run.id,
          blockId: score.blockId,
          pontos: score.pontos,
          pontosMaximos: score.pontosMaximos,
          percentual: score.percentual,
          nivelMaturidade: score.nivelMaturidade,
          statusCor: score.statusCor,
        }))
      )

    if (blockScoresError) {
      console.error('Error inserting block scores:', blockScoresError)
      return new Response(
        JSON.stringify({ error: 'Failed to save block scores', details: blockScoresError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Calculate and insert overall score
    const overallPercentual = (totalPontos / totalPontosMaximos) * 100
    const { nivel: overallNivel, cor: overallCor } = calculateMaturityLevel(overallPercentual)

    const { error: overallScoreError } = await supabase
      .from('diagnosticScores')
      .insert({
        runId: run.id,
        blockId: null, // null blockId indicates overall score
        pontos: totalPontos,
        pontosMaximos: totalPontosMaximos,
        percentual: Math.round(overallPercentual * 100) / 100,
        nivelMaturidade: overallNivel,
        statusCor: overallCor,
      })

    if (overallScoreError) {
      console.error('Error inserting overall score:', overallScoreError)
      return new Response(
        JSON.stringify({ error: 'Failed to save overall score', details: overallScoreError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update run status to COMPLETED
    const { error: updateError } = await supabase
      .from('diagnosticRuns')
      .update({
        status: 'COMPLETED',
        concluidoEm: new Date().toISOString(),
      })
      .eq('id', run.id)

    if (updateError) {
      console.error('Error updating run status:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update run status', details: updateError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Finalized diagnostic run:', run.id, 'Overall score:', overallPercentual.toFixed(1) + '%')

    return new Response(
      JSON.stringify({ 
        success: true, 
        runId: run.id,
        overallScore: {
          percentual: Math.round(overallPercentual * 100) / 100,
          nivelMaturidade: overallNivel,
        },
        blockScores: blockScores.map(s => ({
          percentual: s.percentual,
          nivelMaturidade: s.nivelMaturidade,
        }))
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error in finalizarDiagnostico:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
