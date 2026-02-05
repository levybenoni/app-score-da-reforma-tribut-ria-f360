-- Drop a política restritiva atual
DROP POLICY IF EXISTS "Usuario pode ver relatorios do seu run" ON "aiReports";

-- Criar política permissiva para acesso público aos relatórios
-- (o sistema usa publicToken anônimo, então qualquer um com o runId pode ver)
CREATE POLICY "Acesso publico aos relatorios por runId"
ON "aiReports"
FOR SELECT
USING (true);