import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

const MAX_RETRY_ATTEMPTS = 10;
const RETRY_INTERVAL_MS = 500;

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
  const [isLoadingHtml, setIsLoadingHtml] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const retryCountRef = useRef(0);

  // Fetch HTML report with retry logic
  const fetchHtmlReport = useCallback(async (runId: string): Promise<string | null> => {
    const { data: reportData, error: reportError } = await supabase
      .from('aiReports')
      .select('*')
      .eq('runId', runId)
      .eq('tipoRelatorio', 'FREE_SUMMARY')
      .maybeSingle();

    if (reportError) {
      console.error('Error loading report:', reportError);
      return null;
    }

    if (reportData) {
      setReport(reportData);
      return reportData.conteudoHtml || null;
    }

    return null;
  }, []);

  // Retry mechanism for HTML report
  const fetchHtmlWithRetry = useCallback(async (runId: string) => {
    setIsLoadingHtml(true);
    retryCountRef.current = 0;

    const attemptFetch = async (): Promise<void> => {
      const html = await fetchHtmlReport(runId);
      
      if (html) {
        setHtmlReport(html);
        setIsLoadingHtml(false);
        retryCountRef.current = 0;
        return;
      }

      retryCountRef.current += 1;
      
      if (retryCountRef.current < MAX_RETRY_ATTEMPTS) {
        console.log(`HTML not available yet, retry ${retryCountRef.current}/${MAX_RETRY_ATTEMPTS}...`);
        setTimeout(attemptFetch, RETRY_INTERVAL_MS);
      } else {
        console.log('Max retries reached for HTML report');
        setIsLoadingHtml(false);
      }
    };

    await attemptFetch();
  }, [fetchHtmlReport]);

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

      // Load AI report with retry mechanism (handles race condition with webhook)
      fetchHtmlWithRetry(runId);

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
  }, [fetchHtmlWithRetry]);

  useEffect(() => {
    loadResult();
  }, [loadResult]);

  return {
    result,
    report,
    htmlReport,
    isPremium,
    isLoading,
    isLoadingHtml,
    error,
    reload: loadResult,
  };
}
