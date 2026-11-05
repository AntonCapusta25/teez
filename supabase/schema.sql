-- Supabase Schema for Rijschool TEEZ
-- Run this in the Supabase Dashboard SQL Editor (or via CLI) to create tables and policies

-- 1. Table: Trial Lessons (Gratis Proefles / Intake)
CREATE TABLE IF NOT EXISTS public.trial_lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  preferred_date TEXT,
  notes TEXT,
  status TEXT DEFAULT 'nieuw' NOT NULL CHECK (status IN ('nieuw', 'in_behandeling', 'ingepland', 'ingeschreven', 'gearchiveerd')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Table: Registrations (Aanmelden bij Rijschool TEEZ)
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  gender TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  birth_date TEXT NOT NULL,
  birth_place TEXT NOT NULL,
  address TEXT NOT NULL,
  postal_city TEXT NOT NULL,
  package_choice TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'nieuw' NOT NULL CHECK (status IN ('nieuw', 'in_behandeling', 'ingepland', 'ingeschreven', 'gearchiveerd')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Table: Contact Messages & Terugbelverzoeken
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'nieuw' NOT NULL CHECK (status IN ('nieuw', 'in_behandeling', 'ingepland', 'ingeschreven', 'gearchiveerd')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.trial_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- 5. Policies: Allow public anonymous INSERT (for website visitors submitting forms)
DROP POLICY IF EXISTS "Allow public insert to trial_lessons" ON public.trial_lessons;
CREATE POLICY "Allow public insert to trial_lessons"
  ON public.trial_lessons FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert to registrations" ON public.registrations;
CREATE POLICY "Allow public insert to registrations"
  ON public.registrations FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert to contact_messages" ON public.contact_messages;
CREATE POLICY "Allow public insert to contact_messages"
  ON public.contact_messages FOR INSERT TO anon WITH CHECK (true);

-- 6. Policies: Allow authenticated users (Admin / Instructors) full read and update access
DROP POLICY IF EXISTS "Allow authenticated read/manage trial_lessons" ON public.trial_lessons;
CREATE POLICY "Allow authenticated read/manage trial_lessons"
  ON public.trial_lessons FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated read/manage registrations" ON public.registrations;
CREATE POLICY "Allow authenticated read/manage registrations"
  ON public.registrations FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated read/manage contact_messages" ON public.contact_messages;
CREATE POLICY "Allow authenticated read/manage contact_messages"
  ON public.contact_messages FOR ALL TO authenticated USING (true);

-- 7. Indexes for fast queries in admin dashboard
CREATE INDEX IF NOT EXISTS idx_trial_lessons_created ON public.trial_lessons (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_registrations_created ON public.registrations (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON public.contact_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON public.registrations (email);
