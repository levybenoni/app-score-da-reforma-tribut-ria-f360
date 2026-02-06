-- Allow users to update scheduling fields on their own entitlements
CREATE POLICY "Usuario pode atualizar agendamento do seu entitlement"
ON public.entitlements
FOR UPDATE
USING ("usuarioId" = auth.uid())
WITH CHECK ("usuarioId" = auth.uid());