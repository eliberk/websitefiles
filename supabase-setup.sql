-- Run this in your Supabase SQL editor (https://supabase.com/dashboard → SQL Editor)

-- CRM contacts table
CREATE TABLE contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  first_name text,
  last_name text,
  email text,
  company text,
  phone text,
  status text DEFAULT 'lead',
  notes text
);

-- Raw contact form submissions
CREATE TABLE contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  first_name text,
  last_name text,
  company text,
  email text,
  message text
);

-- Enable Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- contacts: only authenticated users can read/write
CREATE POLICY "Authenticated users can manage contacts"
  ON contacts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- contact_submissions: anyone can insert, only authenticated can read
CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);
