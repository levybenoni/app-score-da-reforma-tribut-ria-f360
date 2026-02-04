import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const STORAGE_KEY = 'diagnosticPublicToken';
const RUN_ID_KEY = 'diagnosticRunId';

interface DiagnosticState {
  publicToken: string | null;
  runId: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useDiagnostic() {
  const [state, setState] = useState<DiagnosticState>({
    publicToken: localStorage.getItem(STORAGE_KEY),
    runId: localStorage.getItem(RUN_ID_KEY),
    isLoading: false,
    error: null,
  });

  // Create a new diagnostic run
  const createRun = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await supabase.functions.invoke('createRun', {
        body: {
          userAgent: navigator.userAgent,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to create diagnostic run');
      }

      const { publicToken, runId } = response.data;
      
      localStorage.setItem(STORAGE_KEY, publicToken);
      localStorage.setItem(RUN_ID_KEY, runId);
      
      setState({
        publicToken,
        runId,
        isLoading: false,
        error: null,
      });

      return { publicToken, runId };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({ ...prev, isLoading: false, error: message }));
      throw error;
    }
  }, []);

  // Save an answer
  const saveAnswer = useCallback(async (questionId: string, respostaBool: boolean) => {
    const publicToken = localStorage.getItem(STORAGE_KEY);
    
    if (!publicToken) {
      throw new Error('No diagnostic run found');
    }

    const response = await supabase.functions.invoke('salvarResposta', {
      body: {
        publicToken,
        questionId,
        respostaBool,
      },
    });

    if (response.error) {
      throw new Error(response.error.message || 'Failed to save answer');
    }

    return response.data;
  }, []);

  // Finalize diagnostic
  const finalizeDiagnostic = useCallback(async () => {
    const publicToken = localStorage.getItem(STORAGE_KEY);
    
    if (!publicToken) {
      throw new Error('No diagnostic run found');
    }

    const response = await supabase.functions.invoke('finalizarDiagnostico', {
      body: { publicToken },
    });

    if (response.error) {
      throw new Error(response.error.message || 'Failed to finalize diagnostic');
    }

    return response.data;
  }, []);

  // Call external webhook
  const callWebhook = useCallback(async () => {
    const runId = localStorage.getItem(RUN_ID_KEY);
    
    if (!runId) {
      throw new Error('No diagnostic run ID found');
    }

    const response = await fetch('https://webhook.bwa.global/webhook/appdiagnosticort', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ runId }),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status}`);
    }

    return await response.json();
  }, []);

  // Claim run for authenticated user
  const claimRun = useCallback(async () => {
    const publicToken = localStorage.getItem(STORAGE_KEY);
    
    if (!publicToken) {
      throw new Error('No diagnostic run found');
    }

    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('User not authenticated');
    }

    const response = await supabase.functions.invoke('claimRun', {
      body: { publicToken },
    });

    if (response.error) {
      throw new Error(response.error.message || 'Failed to claim run');
    }

    return response.data;
  }, []);

  // Get runId from storage or fetch if needed
  const getRunId = useCallback(() => {
    return localStorage.getItem(RUN_ID_KEY);
  }, []);

  // Clear diagnostic data
  const clearDiagnostic = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(RUN_ID_KEY);
    setState({
      publicToken: null,
      runId: null,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    createRun,
    saveAnswer,
    finalizeDiagnostic,
    callWebhook,
    claimRun,
    getRunId,
    clearDiagnostic,
  };
}
