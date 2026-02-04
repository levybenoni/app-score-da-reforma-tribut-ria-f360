import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Question {
  id: string;
  codigo: string;
  texto: string;
  ordem: number;
  blockId: string;
}

interface QuestionBlock {
  id: string;
  codigo: string;
  titulo: string;
  ordem: number;
  questions: Question[];
}

export function useQuestions() {
  const [blocks, setBlocks] = useState<QuestionBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadQuestions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get active questionnaire version
      const { data: version, error: versionError } = await supabase
        .from('questionnaireVersions')
        .select('id')
        .eq('ativo', true)
        .maybeSingle();

      if (versionError || !version) {
        throw new Error('No active questionnaire version found');
      }

      // Get question blocks
      const { data: blocksData, error: blocksError } = await supabase
        .from('questionBlocks')
        .select('id, codigo, titulo, ordem')
        .eq('questionnaireVersionId', version.id)
        .order('ordem');

      if (blocksError || !blocksData) {
        throw new Error('Failed to load question blocks');
      }

      // Get questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('id, codigo, texto, ordem, blockId')
        .eq('questionnaireVersionId', version.id)
        .eq('ativo', true)
        .order('ordem');

      if (questionsError || !questionsData) {
        throw new Error('Failed to load questions');
      }

      // Group questions by block
      const blocksWithQuestions: QuestionBlock[] = blocksData.map(block => ({
        ...block,
        questions: questionsData.filter(q => q.blockId === block.id),
      }));

      setBlocks(blocksWithQuestions);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  return {
    blocks,
    isLoading,
    error,
    reload: loadQuestions,
  };
}
