
-- 1. Lock down SECURITY DEFINER trigger functions: only the table owner/system invokes them
REVOKE EXECUTE ON FUNCTION public.validate_review_job() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_quote_pro_update() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.grant_admin_if_owner() FROM PUBLIC, anon, authenticated;

-- has_role only reads user_roles which authenticated already has SELECT on; switch to INVOKER
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- 2. quotes client update: limit so client can only change status, not amount/pro_id/job_id
DROP POLICY IF EXISTS "quotes client update status" ON public.quotes;
CREATE POLICY "quotes client update status"
ON public.quotes
FOR UPDATE
TO authenticated
USING (
  auth.uid() IN (SELECT jobs.client_id FROM public.jobs WHERE jobs.id = quotes.job_id)
)
WITH CHECK (
  auth.uid() IN (SELECT jobs.client_id FROM public.jobs WHERE jobs.id = quotes.job_id)
);

-- Trigger to prevent client from changing immutable fields on quotes
CREATE OR REPLACE FUNCTION public.protect_quote_client_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() <> OLD.pro_id THEN
    -- updater is not the pro; treat as client path
    IF NEW.amount IS DISTINCT FROM OLD.amount
       OR NEW.pro_id IS DISTINCT FROM OLD.pro_id
       OR NEW.job_id IS DISTINCT FROM OLD.job_id
       OR NEW.message IS DISTINCT FROM OLD.message THEN
      RAISE EXCEPTION 'clients can only change the quote status';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.protect_quote_client_update() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_protect_quote_client_update ON public.quotes;
CREATE TRIGGER trg_protect_quote_client_update
BEFORE UPDATE ON public.quotes
FOR EACH ROW EXECUTE FUNCTION public.protect_quote_client_update();

-- Re-create pro-update trigger binding (may not exist as trigger yet)
DROP TRIGGER IF EXISTS trg_protect_quote_pro_update ON public.quotes;
CREATE TRIGGER trg_protect_quote_pro_update
BEFORE UPDATE ON public.quotes
FOR EACH ROW EXECUTE FUNCTION public.protect_quote_pro_update();

-- 3. quotes pro update: only allow updating quotes that are still pending
DROP POLICY IF EXISTS "quotes pro update" ON public.quotes;
CREATE POLICY "quotes pro update"
ON public.quotes
FOR UPDATE
TO authenticated
USING (auth.uid() = pro_id AND status = 'pending')
WITH CHECK (auth.uid() = pro_id AND status = 'pending');

-- 4. reviews client insert: enforce job ownership & completed status in the policy itself
DROP POLICY IF EXISTS "reviews client insert" ON public.reviews;
CREATE POLICY "reviews client insert"
ON public.reviews
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = client_id
  AND rating >= 1 AND rating <= 5
  AND EXISTS (
    SELECT 1 FROM public.jobs j
    WHERE j.id = job_id
      AND j.client_id = auth.uid()
      AND j.status = 'completed'
  )
);
