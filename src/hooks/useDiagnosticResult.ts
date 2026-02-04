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
  blocoCaixaPercentual: number | null;
  blocoCaixaNivel: string | null;
  blocoComprasPercentual: number | null;
  blocoComprasNivel: string | null;
  blocoContratosPercentual: number | null;
  blocoContratosNivel: string | null;
  blocoFiscalCreditoPercentual: number | null;
  blocoFiscalCreditoNivel: string | null;
}

interface AIReport {
  id: string;
  runId: string;
  tipoRelatorio: string;
  conteudoMarkdown: string;
  criadoEm: string;
}

interface Entitlement {
  id: string;
  usuarioId: string;
  codigoProduto: string;
  ativo: boolean;
}

export function useDiagnosticResult() {
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [report, setReport] = useState<AIReport | null>(null);
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

      // Load scores from view
      const { data: scoreData, error: scoreError } = await supabase
        .from('vwScoreCompleto')
        .select('*')
        .eq('runId', runId)
        .maybeSingle();

      if (scoreError) {
        console.error('Error loading scores:', scoreError);
        throw new Error('Failed to load diagnostic scores');
      }

      if (scoreData) {
        setResult(scoreData as DiagnosticResult);
      }

      // Load AI report
      const { data: reportData, error: reportError } = await supabase
        .from('aiReports')
        .select('*')
        .eq('runId', runId)
        .eq('tipoRelatorio', 'FREE_SUMMARY')
        .maybeSingle();

      if (reportError) {
        console.error('Error loading report:', reportError);
        // Not critical - report may not exist yet
      }

      if (reportData) {
        setReport(reportData);
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
    isPremium,
    isLoading,
    error,
    reload: loadResult,
  };
}
