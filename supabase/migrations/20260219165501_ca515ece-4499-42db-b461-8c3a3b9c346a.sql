-- Drop old check constraint first
ALTER TABLE public."diagnosticRuns" DROP CONSTRAINT "diagnosticRuns_faturamentoAnual_check";

-- Update existing data to match new values BEFORE adding constraint
UPDATE public."diagnosticRuns" SET "faturamentoAnual" = '0 a 360 mil' WHERE "faturamentoAnual" = '0 - 360 mil';
UPDATE public."diagnosticRuns" SET "faturamentoAnual" = '361 mil a 4.800.000' WHERE "faturamentoAnual" = '361 - 4.800';
UPDATE public."diagnosticRuns" SET "faturamentoAnual" = '4.800.001 a 10 milhões' WHERE "faturamentoAnual" = '4.800 a 10 milhões';
UPDATE public."diagnosticRuns" SET "faturamentoAnual" = 'Acima de 40 milhões' WHERE "faturamentoAnual" = '+40 milhões';

-- Add new check constraint with correct values
ALTER TABLE public."diagnosticRuns" ADD CONSTRAINT "diagnosticRuns_faturamentoAnual_check" 
CHECK (
  "faturamentoAnual" IS NULL 
  OR "faturamentoAnual" = ANY (ARRAY[
    '0 a 360 mil'::text, 
    '361 mil a 4.800.000'::text, 
    '4.800.001 a 10 milhões'::text, 
    '10 a 40 milhões'::text, 
    'Acima de 40 milhões'::text
  ])
);