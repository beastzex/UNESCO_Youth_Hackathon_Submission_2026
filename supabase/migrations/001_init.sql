-- Supabase SQL Migration for VoIS: The MIL Immune System
-- UNESCO Youth Hackathon 2026

-- 1. Create Strains Table
CREATE TABLE IF NOT EXISTS strains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  technique TEXT NOT NULL, -- deepfake | out_of_context_image | fabricated_statistic | cloned_voice | doctored_screenshot | other
  intent TEXT,
  summary TEXT,
  report_count INT DEFAULT 1,
  regions_affected TEXT[] DEFAULT '{}',
  distributed_regions TEXT[] DEFAULT '{}',
  has_vaccine BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Submissions Table
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_text TEXT NOT NULL,
  image_url TEXT,
  region TEXT NOT NULL,
  language TEXT NOT NULL,
  ai_suggested_technique TEXT,
  ai_confidence FLOAT,
  ai_summary TEXT,
  status TEXT DEFAULT 'pending_review', -- pending_review | confirmed | rejected
  strain_id UUID REFERENCES strains(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Vaccine Content Table
CREATE TABLE IF NOT EXISTS vaccine_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  strain_id UUID REFERENCES strains(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  explainer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for high-performance querying
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_strain_id ON submissions(strain_id);
CREATE INDEX IF NOT EXISTS idx_strains_has_vaccine ON strains(has_vaccine);
CREATE INDEX IF NOT EXISTS idx_vaccine_content_strain_id ON vaccine_content(strain_id);
