
-- JOBS review workflow
ALTER TABLE public.jobs
  ADD COLUMN IF NOT EXISTS review_status text NOT NULL DEFAULT 'pending_review',
  ADD COLUMN IF NOT EXISTS review_notes text,
  ADD COLUMN IF NOT EXISTS reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz;

ALTER TABLE public.jobs DROP CONSTRAINT IF EXISTS jobs_review_status_check;
ALTER TABLE public.jobs ADD CONSTRAINT jobs_review_status_check
  CHECK (review_status IN ('pending_review','approved','rejected'));

UPDATE public.jobs SET review_status = 'approved' WHERE review_status = 'pending_review';

CREATE INDEX IF NOT EXISTS idx_jobs_review_status ON public.jobs(review_status);

DROP POLICY IF EXISTS "jobs public read open" ON public.jobs;
DROP POLICY IF EXISTS "jobs public read approved" ON public.jobs;
CREATE POLICY "jobs public read approved" ON public.jobs FOR SELECT
  USING (
    (status = 'open' AND review_status = 'approved')
    OR auth.uid() = client_id
    OR auth.uid() = awarded_pro_id
    OR public.has_role(auth.uid(), 'admin')
  );

DROP POLICY IF EXISTS "jobs admin update" ON public.jobs;
CREATE POLICY "jobs admin update" ON public.jobs FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- PROFILES review workflow
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS review_status text NOT NULL DEFAULT 'approved',
  ADD COLUMN IF NOT EXISTS review_notes text,
  ADD COLUMN IF NOT EXISTS reviewed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz;

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_review_status_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_review_status_check
  CHECK (review_status IN ('pending_review','approved','rejected'));

CREATE INDEX IF NOT EXISTS idx_profiles_review_status ON public.profiles(review_status);

CREATE OR REPLACE FUNCTION public.set_profile_review_status()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.primary_type = 'professional' THEN
      NEW.review_status := 'pending_review';
    ELSE
      NEW.review_status := 'approved';
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.primary_type = 'professional' AND OLD.primary_type <> 'professional'
       AND NOT public.has_role(auth.uid(), 'admin') THEN
      NEW.review_status := 'pending_review';
      NEW.reviewed_by := NULL;
      NEW.reviewed_at := NULL;
    END IF;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_profiles_review_status ON public.profiles;
CREATE TRIGGER trg_profiles_review_status
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_profile_review_status();

DROP POLICY IF EXISTS "profiles public read" ON public.profiles;
DROP POLICY IF EXISTS "profiles public read approved" ON public.profiles;
CREATE POLICY "profiles public read approved" ON public.profiles FOR SELECT
  USING (
    primary_type <> 'professional'
    OR review_status = 'approved'
    OR auth.uid() = id
    OR public.has_role(auth.uid(), 'admin')
  );

DROP POLICY IF EXISTS "profiles admin update" ON public.profiles;
CREATE POLICY "profiles admin update" ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- QUOTES: alleen approved professionals mogen indienen
DROP POLICY IF EXISTS "quotes pro insert" ON public.quotes;
CREATE POLICY "quotes pro insert" ON public.quotes FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = pro_id
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.review_status = 'approved'
    )
  );
