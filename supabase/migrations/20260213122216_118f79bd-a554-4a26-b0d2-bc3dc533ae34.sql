
-- ============================================================
-- 1. Enable RLS on reference tables and add public SELECT
-- ============================================================

-- questionBlocks: public reference data
ALTER TABLE public."questionBlocks" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access to questionBlocks"
  ON public."questionBlocks" FOR SELECT
  USING (true);

-- questionnaireVersions: public reference data
ALTER TABLE public."questionnaireVersions" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access to questionnaireVersions"
  ON public."questionnaireVersions" FOR SELECT
  USING (true);

-- questions: public reference data
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access to questions"
  ON public.questions FOR SELECT
  USING (true);

-- ============================================================
-- 2. Add policies for payments (RLS enabled but no policies)
-- ============================================================

CREATE POLICY "Users can view their own payments"
  ON public.payments FOR SELECT
  USING ("usuarioId" = auth.uid());

-- ============================================================
-- 3. Add policies for reportAssets (RLS enabled but no policies)
-- ============================================================

CREATE POLICY "Users can view their own report assets"
  ON public."reportAssets" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public."diagnosticRuns" dr
      WHERE dr.id = "reportAssets"."runId"
        AND dr."usuarioId" = auth.uid()
    )
  );

-- ============================================================
-- 4. Fix aiReports: replace USING(true) with ownership check
-- ============================================================

DROP POLICY IF EXISTS "Acesso publico aos relatorios por runId" ON public."aiReports";

CREATE POLICY "Users can view reports for their runs"
  ON public."aiReports" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public."diagnosticRuns" dr
      WHERE dr.id = "aiReports"."runId"
        AND dr."usuarioId" = auth.uid()
    )
  );

-- ============================================================
-- 5. Recreate views with security_invoker=on
-- ============================================================

-- vwScoreGeral
DROP VIEW IF EXISTS public."vwScoreCompleto";
DROP VIEW IF EXISTS public."vwScoreGeral";
CREATE VIEW public."vwScoreGeral"
WITH (security_invoker=on) AS
SELECT "runId",
    pontos AS "pontosTotais",
    "pontosMaximos" AS "pontosTotaisMaximos",
    percentual AS "percentualGeral",
    "nivelMaturidade" AS "nivelMaturidadeGeral",
    "statusCor" AS "statusCorGeral",
    "calculadoEm"
FROM public."diagnosticScores" ds
WHERE "blockId" IS NULL;

-- vwScorePorBloco
DROP VIEW IF EXISTS public."vwScorePorBloco";
CREATE VIEW public."vwScorePorBloco"
WITH (security_invoker=on) AS
SELECT ds."runId",
    qb.id AS "blockId",
    qb.codigo AS "codigoBloco",
    qb.titulo AS "tituloBloco",
    ds.pontos,
    ds."pontosMaximos",
    ds.percentual,
    ds."nivelMaturidade",
    ds."statusCor",
    ds."calculadoEm"
FROM public."diagnosticScores" ds
JOIN public."questionBlocks" qb ON qb.id = ds."blockId"
WHERE ds."blockId" IS NOT NULL;

-- vwScoreCompleto (depends on vwScoreGeral and vwScorePorBloco)
CREATE VIEW public."vwScoreCompleto"
WITH (security_invoker=on) AS
SELECT r.id AS "runId",
    r."criadoEm",
    r."concluidoEm",
    r.status,
    sg."percentualGeral",
    sg."nivelMaturidadeGeral",
    sg."statusCorGeral",
    max(CASE WHEN sb."codigoBloco" = 'FISCAL_CREDITO' THEN sb.percentual ELSE NULL END) AS "blocoFiscalCreditoPercentual",
    max(CASE WHEN sb."codigoBloco" = 'FISCAL_CREDITO' THEN sb."nivelMaturidade" ELSE NULL END) AS "blocoFiscalCreditoNivel",
    max(CASE WHEN sb."codigoBloco" = 'CAIXA' THEN sb.percentual ELSE NULL END) AS "blocoCaixaPercentual",
    max(CASE WHEN sb."codigoBloco" = 'CAIXA' THEN sb."nivelMaturidade" ELSE NULL END) AS "blocoCaixaNivel",
    max(CASE WHEN sb."codigoBloco" = 'COMPRAS' THEN sb.percentual ELSE NULL END) AS "blocoComprasPercentual",
    max(CASE WHEN sb."codigoBloco" = 'COMPRAS' THEN sb."nivelMaturidade" ELSE NULL END) AS "blocoComprasNivel",
    max(CASE WHEN sb."codigoBloco" = 'CONTRATOS' THEN sb.percentual ELSE NULL END) AS "blocoContratosPercentual",
    max(CASE WHEN sb."codigoBloco" = 'CONTRATOS' THEN sb."nivelMaturidade" ELSE NULL END) AS "blocoContratosNivel"
FROM public."diagnosticRuns" r
LEFT JOIN public."vwScoreGeral" sg ON sg."runId" = r.id
LEFT JOIN public."vwScorePorBloco" sb ON sb."runId" = r.id
GROUP BY r.id, r."criadoEm", r."concluidoEm", r.status, sg."percentualGeral", sg."nivelMaturidadeGeral", sg."statusCorGeral";

-- vwProgressoDiagnostico
DROP VIEW IF EXISTS public."vwProgressoDiagnostico";
CREATE VIEW public."vwProgressoDiagnostico"
WITH (security_invoker=on) AS
SELECT r.id AS "runId",
    count(a.id) AS "respostasRespondidas",
    20 AS "totalPerguntas",
    round(((count(a.id))::numeric / 20::numeric) * 100::numeric, 2) AS "percentualConcluido"
FROM public."diagnosticRuns" r
LEFT JOIN public."diagnosticAnswers" a ON a."runId" = r.id
GROUP BY r.id;
