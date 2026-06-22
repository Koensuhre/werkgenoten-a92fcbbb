REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM authenticated;
GRANT SELECT ON public.user_roles TO authenticated;

CREATE POLICY "Only service role can insert roles"
ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (false);

CREATE POLICY "Only service role can update roles"
ON public.user_roles FOR UPDATE TO authenticated
USING (false) WITH CHECK (false);

CREATE POLICY "Only service role can delete roles"
ON public.user_roles FOR DELETE TO authenticated
USING (false);