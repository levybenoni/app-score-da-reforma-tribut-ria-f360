-- Add unique constraint for upsert in diagnosticAnswers
ALTER TABLE "diagnosticAnswers"
ADD CONSTRAINT "diagnosticAnswers_runId_questionId_unique" UNIQUE ("runId", "questionId");

-- RLS policy for aiReports - allow users to read their reports via run
ALTER TABLE "aiReports" ENABLE ROW LEVEL SECURITY;

-- Policy: Allow reading aiReports for runs that the user owns OR for any run (anonymous users can access via runId)
CREATE POLICY "Usuario pode ver relatorios do seu run"
ON "aiReports"
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM "diagnosticRuns" r
    WHERE r.id = "aiReports"."runId"
  )
);

-- Also need to allow public read access to questions, questionBlocks, questionnaireVersions
-- (they already have RLS disabled based on spec)

-- Grant SELECT on the read-only tables for anon users
GRANT SELECT ON "questions" TO anon;
GRANT SELECT ON "questionBlocks" TO anon;
GRANT SELECT ON "questionnaireVersions" TO anon;