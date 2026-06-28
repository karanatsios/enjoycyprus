-- Funktion: 1 Credit abziehen (atomisch, verhindert negative Credits)
-- Im Supabase SQL Editor ausführen!

CREATE OR REPLACE FUNCTION deduct_notification_credit(p_user_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE notification_credits
  SET credits = credits - 1, updated_at = NOW()
  WHERE user_id = p_user_id AND credits > 0;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Nicht genug Credits';
  END IF;
END;
$$;
