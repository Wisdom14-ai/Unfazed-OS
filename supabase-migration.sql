-- ============================================================
-- UNFAZED OS: Multi-User Migration
-- Run this SQL in your Supabase SQL Editor
-- ============================================================

-- 1. Add user_id column to all tables (with default = auth.uid())
--    This means existing app code does NOT need to change —
--    Supabase auto-fills user_id on every insert.
-- ============================================================

-- habits
ALTER TABLE habits ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();

-- habit_logs
ALTER TABLE habit_logs ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();

-- deep_work_sessions
ALTER TABLE deep_work_sessions ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();

-- workouts
ALTER TABLE workouts ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();

-- daily_metadata
ALTER TABLE daily_metadata ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();

-- journal_entries
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();

-- book_notes
ALTER TABLE book_notes ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();

-- transactions
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();

-- leads
ALTER TABLE leads ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();

-- user_profile
ALTER TABLE user_profile ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();

-- 2. Create subscriptions table
-- ============================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL UNIQUE,
  plan text NOT NULL DEFAULT 'free',
  status text DEFAULT 'active',
  billplz_bill_id text,
  starts_at timestamptz DEFAULT now(),
  ends_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 3. Enable Row Level Security on ALL tables
-- ============================================================
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
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies (users can only access their own data)
-- ============================================================

-- habits
CREATE POLICY "Users can view own habits" ON habits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own habits" ON habits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own habits" ON habits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own habits" ON habits FOR DELETE USING (auth.uid() = user_id);

-- habit_logs
CREATE POLICY "Users can view own habit_logs" ON habit_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own habit_logs" ON habit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own habit_logs" ON habit_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own habit_logs" ON habit_logs FOR DELETE USING (auth.uid() = user_id);

-- deep_work_sessions
CREATE POLICY "Users can view own deep_work_sessions" ON deep_work_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own deep_work_sessions" ON deep_work_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own deep_work_sessions" ON deep_work_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own deep_work_sessions" ON deep_work_sessions FOR DELETE USING (auth.uid() = user_id);

-- workouts
CREATE POLICY "Users can view own workouts" ON workouts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own workouts" ON workouts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own workouts" ON workouts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own workouts" ON workouts FOR DELETE USING (auth.uid() = user_id);

-- daily_metadata
CREATE POLICY "Users can view own daily_metadata" ON daily_metadata FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own daily_metadata" ON daily_metadata FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own daily_metadata" ON daily_metadata FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own daily_metadata" ON daily_metadata FOR DELETE USING (auth.uid() = user_id);

-- journal_entries
CREATE POLICY "Users can view own journal_entries" ON journal_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own journal_entries" ON journal_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own journal_entries" ON journal_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own journal_entries" ON journal_entries FOR DELETE USING (auth.uid() = user_id);

-- book_notes
CREATE POLICY "Users can view own book_notes" ON book_notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own book_notes" ON book_notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own book_notes" ON book_notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own book_notes" ON book_notes FOR DELETE USING (auth.uid() = user_id);

-- transactions
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own transactions" ON transactions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own transactions" ON transactions FOR DELETE USING (auth.uid() = user_id);

-- leads
CREATE POLICY "Users can view own leads" ON leads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own leads" ON leads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own leads" ON leads FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own leads" ON leads FOR DELETE USING (auth.uid() = user_id);

-- user_profile
CREATE POLICY "Users can view own user_profile" ON user_profile FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own user_profile" ON user_profile FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own user_profile" ON user_profile FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own user_profile" ON user_profile FOR DELETE USING (auth.uid() = user_id);

-- subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscriptions" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subscriptions" ON subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- 5. After you sign in for the first time, run this to assign existing data:
-- Replace YOUR_USER_ID with your actual auth.users id from Supabase dashboard
-- ============================================================
-- UPDATE habits SET user_id = 'YOUR_USER_ID' WHERE user_id IS NULL;
-- UPDATE habit_logs SET user_id = 'YOUR_USER_ID' WHERE user_id IS NULL;
-- UPDATE deep_work_sessions SET user_id = 'YOUR_USER_ID' WHERE user_id IS NULL;
-- UPDATE workouts SET user_id = 'YOUR_USER_ID' WHERE user_id IS NULL;
-- UPDATE daily_metadata SET user_id = 'YOUR_USER_ID' WHERE user_id IS NULL;
-- UPDATE journal_entries SET user_id = 'YOUR_USER_ID' WHERE user_id IS NULL;
-- UPDATE book_notes SET user_id = 'YOUR_USER_ID' WHERE user_id IS NULL;
-- UPDATE transactions SET user_id = 'YOUR_USER_ID' WHERE user_id IS NULL;
-- UPDATE leads SET user_id = 'YOUR_USER_ID' WHERE user_id IS NULL;
-- UPDATE user_profile SET user_id = 'YOUR_USER_ID' WHERE user_id IS NULL;
