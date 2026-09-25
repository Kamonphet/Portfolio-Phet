-- ========================================================
-- Supabase Schema for Cyberpunk Portfolio
-- ========================================================
-- Run this script in your Supabase SQL Editor:
-- 1. Go to your Supabase Project Dashboard: https://supabase.com/dashboard
-- 2. Open "SQL Editor" from the left sidebar
-- 3. Paste this script and click "Run"
-- ========================================================

-- 1. Create table for portfolio content
CREATE TABLE IF NOT EXISTS public.portfolio_data (
  id BIGSERIAL PRIMARY KEY,
  language TEXT UNIQUE NOT NULL, -- 'th' | 'en' | 'settings'
  hero JSONB,
  about JSONB,
  skills JSONB,
  projects JSONB,
  experience JSONB,
  contact JSONB,
  settings JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.portfolio_data ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow anyone (anon + authenticated) to READ portfolio data
DROP POLICY IF EXISTS "Allow public read access" ON public.portfolio_data;
CREATE POLICY "Allow public read access"
  ON public.portfolio_data
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 4. Policy: Allow insert for anon and authenticated
DROP POLICY IF EXISTS "Allow anon insert" ON public.portfolio_data;
CREATE POLICY "Allow anon insert"
  ON public.portfolio_data
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 5. Policy: Allow update for anon and authenticated
DROP POLICY IF EXISTS "Allow anon update" ON public.portfolio_data;
CREATE POLICY "Allow anon update"
  ON public.portfolio_data
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 6. Enable Realtime updates for live syncing
-- (If publication already exists, add table to it)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'portfolio_data'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.portfolio_data;
  END IF;
END $$;

-- 7. Verification query
SELECT * FROM public.portfolio_data;
