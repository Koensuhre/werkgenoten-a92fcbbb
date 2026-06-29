
-- Drop the broken WITH CHECK policy and replace with a simple owner policy.
DROP POLICY IF EXISTS "profiles owner update" ON public.profiles;

CREATE POLICY "profiles owner update"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Trigger enforces that non-admins cannot mutate moderation/privilege fields.
-- We compare NEW vs OLD here (which the broken subquery couldn't do reliably).
CREATE OR REPLACE FUNCTION public.protect_profile_moderation_fields()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin boolean;
BEGIN
  -- Service role / superuser bypass (no auth.uid()).
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT public.has_role(auth.uid(), 'admin') INTO is_admin;
  IF is_admin THEN
    RETURN NEW;
  END IF;

  -- Non-admin: force moderation/privilege fields back to OLD values.
  NEW.verified      := OLD.verified;
  NEW.review_status := OLD.review_status;
  NEW.reviewed_by   := OLD.reviewed_by;
  NEW.reviewed_at   := OLD.reviewed_at;
  NEW.review_notes  := OLD.review_notes;

  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.protect_profile_moderation_fields() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS trg_protect_profile_moderation_fields ON public.profiles;
CREATE TRIGGER trg_protect_profile_moderation_fields
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_moderation_fields();
