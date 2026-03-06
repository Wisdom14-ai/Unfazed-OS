-- ============================================================
-- UNFAZED OS: Habit Time Tracking Upgrade
-- Run this SQL in Supabase SQL Editor
-- ============================================================

-- 1) Habits metadata
ALTER TABLE habits
    ADD COLUMN IF NOT EXISTS time_mode text;

ALTER TABLE habits
    ALTER COLUMN time_mode SET DEFAULT 'clock';

UPDATE habits
SET time_mode = 'clock'
WHERE time_mode IS NULL;

-- 2) Habit log metadata for multi-input tracking
ALTER TABLE habit_logs
    ADD COLUMN IF NOT EXISTS entry_type text;

ALTER TABLE habit_logs
    ADD COLUMN IF NOT EXISTS time_minutes integer;

-- 3) Optional guardrails (safe to run once)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'habits_time_mode_check'
    ) THEN
        ALTER TABLE habits
            ADD CONSTRAINT habits_time_mode_check
            CHECK (time_mode IS NULL OR time_mode IN ('clock', 'sleep'));
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'habit_logs_entry_type_check'
    ) THEN
        ALTER TABLE habit_logs
            ADD CONSTRAINT habit_logs_entry_type_check
            CHECK (entry_type IS NULL OR entry_type IN ('boolean', 'number', 'time'));
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'habit_logs_time_minutes_check'
    ) THEN
        ALTER TABLE habit_logs
            ADD CONSTRAINT habit_logs_time_minutes_check
            CHECK (time_minutes IS NULL OR (time_minutes >= 0 AND time_minutes <= 1439));
    END IF;
END $$;

