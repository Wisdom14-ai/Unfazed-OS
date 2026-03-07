-- ============================================================
-- UNFAZED OS: User Isolation Hardening
-- Run in Supabase SQL Editor
-- ============================================================

-- 1) Ensure every app table has user_id with auth.uid() default
ALTER TABLE habits ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE habit_logs ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE deep_work_sessions ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE workouts ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE daily_metadata ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE book_notes ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE user_profile ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

ALTER TABLE habits ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE habit_logs ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE deep_work_sessions ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE workouts ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE daily_metadata ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE journal_entries ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE book_notes ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE transactions ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE leads ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE user_profile ALTER COLUMN user_id SET DEFAULT auth.uid();

-- 2) Enable RLS on all user-scoped tables
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE deep_work_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;

-- 3) Idempotent per-table RLS policies
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'habits',
    'habit_logs',
    'deep_work_sessions',
    'workouts',
    'daily_metadata',
    'journal_entries',
    'book_notes',
    'transactions',
    'leads',
    'user_profile'
  ] LOOP
    IF NOT EXISTS (
      SELECT 1
      FROM pg_policies
      WHERE schemaname = 'public' AND tablename = t AND policyname = t || '_select_own'
    ) THEN
      EXECUTE format('CREATE POLICY %I ON public.%I FOR SELECT USING (auth.uid() = user_id)', t || '_select_own', t);
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM pg_policies
      WHERE schemaname = 'public' AND tablename = t AND policyname = t || '_insert_own'
    ) THEN
      EXECUTE format('CREATE POLICY %I ON public.%I FOR INSERT WITH CHECK (auth.uid() = user_id)', t || '_insert_own', t);
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM pg_policies
      WHERE schemaname = 'public' AND tablename = t AND policyname = t || '_update_own'
    ) THEN
      EXECUTE format('CREATE POLICY %I ON public.%I FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)', t || '_update_own', t);
    END IF;

    IF NOT EXISTS (
      SELECT 1
      FROM pg_policies
      WHERE schemaname = 'public' AND tablename = t AND policyname = t || '_delete_own'
    ) THEN
      EXECUTE format('CREATE POLICY %I ON public.%I FOR DELETE USING (auth.uid() = user_id)', t || '_delete_own', t);
    END IF;
  END LOOP;
END
$$;

-- 4) Per-user uniqueness for date-based tables (prevents cross-user upsert collisions)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'habit_logs_user_habit_date_key'
  ) THEN
    ALTER TABLE habit_logs
      ADD CONSTRAINT habit_logs_user_habit_date_key UNIQUE (user_id, habit_id, date);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'daily_metadata_user_date_key'
  ) THEN
    ALTER TABLE daily_metadata
      ADD CONSTRAINT daily_metadata_user_date_key UNIQUE (user_id, date);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'journal_entries_user_date_key'
  ) THEN
    ALTER TABLE journal_entries
      ADD CONSTRAINT journal_entries_user_date_key UNIQUE (user_id, date);
  END IF;
END
$$;

-- 5) Legacy data ownership fix (manual)
-- IMPORTANT: If existing rows have NULL user_id, assign them to the correct owner(s).
-- Replace USER_ID_HERE with each auth.users.id and run only for rows that belong to that user.
--
-- UPDATE habits SET user_id = 'USER_ID_HERE' WHERE user_id IS NULL;
-- UPDATE habit_logs SET user_id = 'USER_ID_HERE' WHERE user_id IS NULL;
-- UPDATE deep_work_sessions SET user_id = 'USER_ID_HERE' WHERE user_id IS NULL;
-- UPDATE workouts SET user_id = 'USER_ID_HERE' WHERE user_id IS NULL;
-- UPDATE daily_metadata SET user_id = 'USER_ID_HERE' WHERE user_id IS NULL;
-- UPDATE journal_entries SET user_id = 'USER_ID_HERE' WHERE user_id IS NULL;
-- UPDATE book_notes SET user_id = 'USER_ID_HERE' WHERE user_id IS NULL;
-- UPDATE transactions SET user_id = 'USER_ID_HERE' WHERE user_id IS NULL;
-- UPDATE leads SET user_id = 'USER_ID_HERE' WHERE user_id IS NULL;
-- UPDATE user_profile SET user_id = 'USER_ID_HERE' WHERE user_id IS NULL;
