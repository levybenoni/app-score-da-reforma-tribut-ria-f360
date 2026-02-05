import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BlockScore {
  blockId: string | null;
  codigoBloco: string | null;
  tituloBloco: string | null;
  percentual: number | null;
  nivelMaturidade: string | null;
  statusCor: string | null;
}

interface DiagnosticResult {
  runId: string;
  status: string | null;
  percentualGeral: number | null;
  nivelMaturidadeGeral: string | null;
  statusCorGeral: string | null;
  blockScores: BlockScore[];
}

interface AIReport {
  id: string;
  runId: string;
  tipoRelatorio: string;
  conteudoMarkdown: string;
  conteudoHtml: string | null;
  criadoEm: string;
}

export function useDiagnosticResult() {
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [report, setReport] = useState<AIReport | null>(null);
  const [htmlReport, setHtmlReport] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadResult = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const runId = localStorage.getItem('diagnosticRunId');
      
      if (!runId) {
        throw new Error('No diagnostic run found');
      }

      // Load general score from vwScoreGeral
      const { data: scoreGeralData, error: scoreGeralError } = await supabase
        .from('vwScoreGeral')
        .select('*')
        .eq('runId', runId)
        .maybeSingle();

      if (scoreGeralError) {
        console.error('Error loading general score:', scoreGeralError);
      }

      // Load block scores from vwScorePorBloco (source of truth)
      const { data: blockScoresData, error: blockScoresError } = await supabase
        .from('vwScorePorBloco')
        .select('*')
        .eq('runId', runId);

      if (blockScoresError) {
        console.error('Error loading block scores:', blockScoresError);
        throw new Error('Failed to load diagnostic scores');
      }

      // Load run status
      const { data: runData, error: runError } = await supabase
        .from('diagnosticRuns')
        .select('status')
        .eq('id', runId)
        .maybeSingle();

      if (runError) {
        console.error('Error loading run status:', runError);
      }

      // Build result object
      const blockScores: BlockScore[] = (blockScoresData || []).map(block => ({
        blockId: block.blockId,
        codigoBloco: block.codigoBloco,
        tituloBloco: block.tituloBloco,
        percentual: block.percentual,
        nivelMaturidade: block.nivelMaturidade,
        statusCor: block.statusCor,
      }));

      setResult({
        runId,
        status: runData?.status || null,
        percentualGeral: scoreGeralData?.percentualGeral || null,
        nivelMaturidadeGeral: scoreGeralData?.nivelMaturidadeGeral || null,
        statusCorGeral: scoreGeralData?.statusCorGeral || null,
        blockScores,
      });

      // Load AI report
      const { data: reportData, error: reportError } = await supabase
        .from('aiReports')
        .select('*')
        .eq('runId', runId)
        .eq('tipoRelatorio', 'FREE_SUMMARY')
        .maybeSingle();

      if (reportError) {
        console.error('Error loading report:', reportError);
      }

      if (reportData) {
        setReport(reportData);
        // Use conteudoHtml as the source of truth for the HTML report
        if (reportData.conteudoHtml) {
          setHtmlReport(reportData.conteudoHtml);
        }
      }

      // Check entitlements for premium status
      const { data: entitlementData, error: entitlementError } = await supabase
        .from('entitlements')
        .select('*')
        .eq('runId', runId)
        .eq('codigoProduto', 'RT_DIAG_PREMIUM')
        .eq('ativo', true)
        .maybeSingle();

      if (!entitlementError && entitlementData) {
        setIsPremium(true);
      }

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResult();
  }, [loadResult]);

  return {
    result,
    report,
    htmlReport,
    isPremium,
    isLoading,
    error,
    reload: loadResult,
  };
}
