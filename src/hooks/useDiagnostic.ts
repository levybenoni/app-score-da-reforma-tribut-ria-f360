import { useState, useCallback, useRef } from 'react';
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

  // Track pending saves
  const pendingSaves = useRef<Map<string, Promise<unknown>>>(new Map());

  // Create a new diagnostic run (always creates fresh, clears old data)
  const createRun = useCallback(async (forceNew = false) => {
    // If forcing new or no existing token, clear old data
    if (forceNew) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(RUN_ID_KEY);
    }

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
      
      // Clear pending saves for new run
      pendingSaves.current.clear();
      
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

  // Save an answer with tracking
  const saveAnswer = useCallback(async (questionId: string, respostaBool: boolean) => {
    const publicToken = localStorage.getItem(STORAGE_KEY);
    
    if (!publicToken) {
      throw new Error('No diagnostic run found');
    }

    // Create save promise and track it
    const savePromise = supabase.functions.invoke('salvarResposta', {
      body: {
        publicToken,
        questionId,
        respostaBool,
      },
    }).then(response => {
      if (response.error) {
        throw new Error(response.error.message || 'Failed to save answer');
      }
      return response.data;
    }).finally(() => {
      // Remove from pending when complete
      pendingSaves.current.delete(questionId);
    });

    // Track this save
    pendingSaves.current.set(questionId, savePromise);

    return savePromise;
  }, []);

  // Wait for all pending saves to complete
  const waitForPendingSaves = useCallback(async () => {
    const pending = Array.from(pendingSaves.current.values());
    if (pending.length > 0) {
      console.log(`Waiting for ${pending.length} pending saves...`);
      await Promise.all(pending);
      console.log('All saves complete');
    }
  }, []);

  // Check if there are pending saves
  const hasPendingSaves = useCallback(() => {
    return pendingSaves.current.size > 0;
  }, []);

  // Finalize diagnostic
  const finalizeDiagnostic = useCallback(async () => {
    const publicToken = localStorage.getItem(STORAGE_KEY);
    
    if (!publicToken) {
      throw new Error('No diagnostic run found');
    }

    // Wait for any pending saves first
    await waitForPendingSaves();

    const response = await supabase.functions.invoke('finalizarDiagnostico', {
      body: { publicToken },
    });

    if (response.error) {
      throw new Error(response.error.message || 'Failed to finalize diagnostic');
    }

    return response.data;
  }, [waitForPendingSaves]);

  // Call external webhook and store raw HTML response
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

    // Get raw HTML response (NOT JSON)
    const htmlContent = await response.text();
    
    // Store the raw HTML in localStorage for the result page
    localStorage.setItem('diagnosticHtmlReport', htmlContent);

    return htmlContent;
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

  // Get runId from storage
  const getRunId = useCallback(() => {
    return localStorage.getItem(RUN_ID_KEY);
  }, []);

  // Clear diagnostic data
  const clearDiagnostic = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(RUN_ID_KEY);
    pendingSaves.current.clear();
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
    waitForPendingSaves,
    hasPendingSaves,
    finalizeDiagnostic,
    callWebhook,
    claimRun,
    getRunId,
    clearDiagnostic,
  };
}
