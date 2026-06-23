
-- 1) Subscriptions table
CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_subscription_id text NOT NULL UNIQUE,
  stripe_customer_id text NOT NULL,
  product_id text NOT NULL,
  price_id text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  environment text NOT NULL DEFAULT 'sandbox',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_id ON public.subscriptions(stripe_subscription_id);

GRANT SELECT ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role manages subscriptions"
  ON public.subscriptions FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 2) Hide moderation fields on jobs from non-admins via column grants
REVOKE SELECT (review_notes, reviewed_by, reviewed_at) ON public.jobs FROM anon, authenticated;

-- 3) Hide moderation fields on profiles from non-admins via column grants
REVOKE SELECT (review_notes, reviewed_by, reviewed_at) ON public.profiles FROM anon, authenticated;

-- 4) Replace "profiles owner update" policy with WITH CHECK that blocks
--    self-escalation of moderation/privilege fields.
DROP POLICY IF EXISTS "profiles owner update" ON public.profiles;

CREATE POLICY "profiles owner update"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND review_status IS NOT DISTINCT FROM (SELECT review_status FROM public.profiles WHERE id = profiles.id)
    AND verified IS NOT DISTINCT FROM (SELECT verified FROM public.profiles WHERE id = profiles.id)
    AND reviewed_by IS NOT DISTINCT FROM (SELECT reviewed_by FROM public.profiles WHERE id = profiles.id)
    AND reviewed_at IS NOT DISTINCT FROM (SELECT reviewed_at FROM public.profiles WHERE id = profiles.id)
    AND review_notes IS NOT DISTINCT FROM (SELECT review_notes FROM public.profiles WHERE id = profiles.id)
  );
