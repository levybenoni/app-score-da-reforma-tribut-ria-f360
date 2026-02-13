
-- Allow anonymous users to view their diagnostic run by ID (usuarioId may be null before account creation)
CREATE POLICY "Anonymous can view run by id"
  ON public."diagnosticRuns" FOR SELECT
  USING (true);

-- Allow anonymous users to view scores for any run they know the ID of
CREATE POLICY "Anonymous can view scores by runId"
  ON public."diagnosticScores" FOR SELECT
  USING (true);

-- Allow anonymous users to view AI reports for any run they know the ID of  
DROP POLICY IF EXISTS "Users can view reports for their runs" ON public."aiReports";
CREATE POLICY "Anyone can view reports by runId"
  ON public."aiReports" FOR SELECT
  USING (true);
