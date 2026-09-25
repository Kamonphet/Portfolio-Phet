-- ============================================================================
-- KruPhet IT // Normalized Relational Database Schema for Supabase (PostgreSQL)
-- ============================================================================
-- Standard: 3NF Relational Model, Foreign Keys, Referential Integrity, RLS, Indexes
-- Target Data: ข้อมูลของฉัน, ประวัติการศึกษา, ทักษะ, ผลงาน, ประสบการณ์, การติดต่อ
-- ============================================================================

-- 0. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ────────────────────────────────────────────────────────────────────────────
-- 1. Helper Function: Automatic updated_at timestamp trigger
-- ────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ────────────────────────────────────────────────────────────────────────────
-- 2. TABLE: profiles (ข้อมูลของฉัน / ข้อมูลส่วนตัว / Bio & Social)
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language VARCHAR(10) NOT NULL DEFAULT 'th', -- 'th' | 'en'
  name VARCHAR(255) NOT NULL,
  role_title VARCHAR(255) NOT NULL,
  tagline TEXT,
  bio_paragraph_1 TEXT,
  bio_paragraph_2 TEXT,
  avatar_url TEXT,
  hero_image_url TEXT,
  resume_url TEXT,
  email VARCHAR(255),
  phone VARCHAR(50),
  location VARCHAR(255),
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  facebook_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_profiles_language UNIQUE(language)
);

DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ────────────────────────────────────────────────────────────────────────────
-- 3. TABLE: education (ประวัติต่าง ๆ / ประวัติการศึกษาและการฝึกอบรม)
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  language VARCHAR(10) NOT NULL DEFAULT 'th',
  institution VARCHAR(255) NOT NULL,
  degree VARCHAR(255) NOT NULL,
  field_of_study VARCHAR(255),
  year_range VARCHAR(100),
  grade VARCHAR(50),
  description TEXT,
  logo_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_education_profile_lang ON public.education(profile_id, language, sort_order);

-- ────────────────────────────────────────────────────────────────────────────
-- 4. TABLE: system_specs (สเปกระบบ / ความเชี่ยวชาญเฉพาะทางใน About)
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.system_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  language VARCHAR(10) NOT NULL DEFAULT 'th',
  spec_label VARCHAR(100) NOT NULL,
  spec_value VARCHAR(255) NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────────────────────
-- 5. TABLE: stats (สถิติและผลงานสำคัญ)
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  language VARCHAR(10) NOT NULL DEFAULT 'th',
  label VARCHAR(100) NOT NULL,
  stat_value VARCHAR(50) NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────────────────────
-- 6. TABLE: skill_categories (หมวดหมู่ทักษะ)
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.skill_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language VARCHAR(10) NOT NULL DEFAULT 'th',
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_skill_cat_lang_name UNIQUE(language, name)
);

-- ────────────────────────────────────────────────────────────────────────────
-- 7. TABLE: skills (ทักษะ)
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.skill_categories(id) ON DELETE CASCADE,
  language VARCHAR(10) NOT NULL DEFAULT 'th',
  name VARCHAR(150) NOT NULL,
  level INT CHECK (level >= 0 AND level <= 100) DEFAULT 80,
  icon VARCHAR(100),
  description TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skills_cat_lang ON public.skills(category_id, language, sort_order);

-- ────────────────────────────────────────────────────────────────────────────
-- 8. TABLE: project_categories (หมวดหมู่ผลงาน)
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.project_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language VARCHAR(10) NOT NULL DEFAULT 'th',
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100),
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_proj_cat_lang_name UNIQUE(language, name)
);

-- ────────────────────────────────────────────────────────────────────────────
-- 9. TABLE: projects (คลังผลงาน)
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.project_categories(id) ON DELETE SET NULL,
  language VARCHAR(10) NOT NULL DEFAULT 'th',
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  demo_url TEXT,
  github_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_lang_featured ON public.projects(language, featured, sort_order);

DROP TRIGGER IF EXISTS trigger_projects_updated_at ON public.projects;
CREATE TRIGGER trigger_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ────────────────────────────────────────────────────────────────────────────
-- 10. TABLE: project_technologies (เทคโนโลยีประจำผลงาน - Normalized 1:N)
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.project_technologies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_proj_tech UNIQUE(project_id, name)
);

CREATE INDEX IF NOT EXISTS idx_proj_tech_proj_id ON public.project_technologies(project_id);

-- ────────────────────────────────────────────────────────────────────────────
-- 11. TABLE: experiences (ประสบการณ์ต่าง ๆ / ประวัติการทำงาน)
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  language VARCHAR(10) NOT NULL DEFAULT 'th',
  role VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  company_logo TEXT,
  location VARCHAR(255),
  period VARCHAR(100),
  description TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_experiences_profile_lang ON public.experiences(profile_id, language, sort_order);

-- ────────────────────────────────────────────────────────────────────────────
-- 12. TABLE: experience_highlights (จุดเด่นประสบการณ์ - Normalized 1:N)
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.experience_highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
  highlight TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

-- ────────────────────────────────────────────────────────────────────────────
-- 13. TABLE: contact_messages (การติดต่อ / ข้อความจากผู้ใช้เว็บไซต์)
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON public.contact_messages(created_at DESC);

-- ────────────────────────────────────────────────────────────────────────────
-- 14. TABLE: portfolio_data (Fast caching / High-performance backward compatibility)
-- ────────────────────────────────────────────────────────────────────────────
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

-- ────────────────────────────────────────────────────────────────────────────
-- 15. ROW LEVEL SECURITY (RLS) - Security Hardened Policies
-- ────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_data ENABLE ROW LEVEL SECURITY;

-- Read Access: Allow anyone (anon + authenticated) to view public portfolio content
CREATE POLICY "Public Read: profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public Read: education" ON public.education FOR SELECT USING (true);
CREATE POLICY "Public Read: system_specs" ON public.system_specs FOR SELECT USING (true);
CREATE POLICY "Public Read: stats" ON public.stats FOR SELECT USING (true);
CREATE POLICY "Public Read: skill_categories" ON public.skill_categories FOR SELECT USING (true);
CREATE POLICY "Public Read: skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Public Read: project_categories" ON public.project_categories FOR SELECT USING (true);
CREATE POLICY "Public Read: projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public Read: project_technologies" ON public.project_technologies FOR SELECT USING (true);
CREATE POLICY "Public Read: experiences" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Public Read: experience_highlights" ON public.experience_highlights FOR SELECT USING (true);
CREATE POLICY "Public Read: portfolio_data" ON public.portfolio_data FOR SELECT USING (true);

-- Contact Form: Allow public to send messages (INSERT only)
CREATE POLICY "Public Insert: contact_messages"
  ON public.contact_messages
  FOR INSERT
  WITH CHECK (length(trim(name)) > 0 AND length(trim(email)) > 3 AND length(trim(message)) > 0);

-- Sync / Write Policies: Allow insert/update for configured client
CREATE POLICY "Public Upsert: portfolio_data" ON public.portfolio_data FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Upsert: profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Upsert: education" ON public.education FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Upsert: skills" ON public.skills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Upsert: projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Upsert: experiences" ON public.experiences FOR ALL USING (true) WITH CHECK (true);

-- ────────────────────────────────────────────────────────────────────────────
-- 16. SUPABASE STORAGE: Setup 'portfolio-media' Bucket
-- ────────────────────────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Allow public access to view media
DROP POLICY IF EXISTS "Public Access Media" ON storage.objects;
CREATE POLICY "Public Access Media" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio-media');

-- Allow image uploads to portfolio-media bucket
DROP POLICY IF EXISTS "Public Upload Media" ON storage.objects;
CREATE POLICY "Public Upload Media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'portfolio-media');

-- ────────────────────────────────────────────────────────────────────────────
-- 17. ENABLE REALTIME UPDATES
-- ────────────────────────────────────────────────────────────────────────────
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
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'projects'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
  END IF;
END $$;

-- ────────────────────────────────────────────────────────────────────────────
-- 18. INITIAL SEED DATA (ข้อมูลเริ่มต้นตามฉบับครูเพชร IT)
-- ────────────────────────────────────────────────────────────────────────────
DO $$
DECLARE
  v_th_profile_id UUID;
  v_p1_id UUID;
  v_p2_id UUID;
  v_p3_id UUID;
  v_cat_edtech UUID;
  v_cat_sec UUID;
  v_cat_web UUID;
BEGIN
  -- Insert or update Thai Profile
  INSERT INTO public.profiles (
    language, name, role_title, tagline,
    bio_paragraph_1, bio_paragraph_2,
    avatar_url, email, phone, location,
    github_url
  ) VALUES (
    'th',
    'ครูเพชร IT',
    'นักการศึกษาด้านเทคโนโลยี & Full-Stack Developer',
    'พัฒนาสื่อการสอนดิจิทัล นวัตกรรมเทคโนโลยีเพื่อการศึกษา และสถาปัตยกรรมระบบความปลอดภัย',
    'เชี่ยวชาญด้านหลักสูตรการศึกษาและการออกแบบการเรียนรู้แบบ Active Learning สนับสนุนครูและผู้เรียนในการผสานเทคโนโลยี AI, Web Graphics และความมั่นคงปลอดภัยทางไซเบอร์',
    'มุ่งมั่นสร้างสรรค์แพลตฟอร์มการเรียนรู้ที่ใช้งานได้จริง เข้าถึงง่าย และเปิดโอกาสทางการศึกษาในยุคดิจิทัล',
    '/img/profile.jpg',
    'kamonpach.siri@gmail.com',
    '08x-xxx-xxxx',
    'Bangkok, Thailand',
    'https://github.com/Kamonphet'
  )
  ON CONFLICT (language) DO UPDATE
  SET name = EXCLUDED.name, role_title = EXCLUDED.role_title
  RETURNING id INTO v_th_profile_id;

  -- Education
  INSERT INTO public.education (profile_id, language, institution, degree, field_of_study, year_range, grade, description, logo_url, sort_order)
  VALUES 
    (v_th_profile_id, 'th', 'มหาวิทยาลัยศรีนครินทรวิโรฒ (SWU)', 'ปริญญาตรี การศึกษาบัณฑิต (กศ.บ.)', 'วิทยาการคอมพิวเตอร์และเทคโนโลยีการศึกษา', '2561 - 2565', 'เกียรตินิยม', 'มุ่งเน้นการออกแบบระบบการเรียนรู้ดิจิทัล การเขียนโปรแกรม Full-Stack และระบบเครือข่ายความปลอดภัย', '/img/university_icon_1790301854810.jpg', 1),
    (v_th_profile_id, 'th', 'โรงเรียนสาธิตมหาวิทยาลัย', 'มัธยมศึกษาตอนปลาย', 'แผนการเรียนวิทยาศาสตร์-คณิตศาสตร์ (คอมพิวเตอร์)', '2555 - 2561', '3.85', 'ตัวแทนแข่งขันโอลิมปิกวิชาการคอมพิวเตอร์และโครงงานนวัตกรรมสิ่งประดิษฐ์', '/img/school_icon_1790301827426.jpg', 2)
  ON CONFLICT DO NOTHING;

  -- Project Categories
  INSERT INTO public.project_categories (language, name, slug, sort_order)
  VALUES 
    ('th', 'EdTech & Web', 'edtech', 1),
    ('th', 'Security', 'security', 2),
    ('th', 'Web App', 'web-app', 3)
  ON CONFLICT (language, name) DO NOTHING;

  SELECT id INTO v_cat_edtech FROM public.project_categories WHERE language = 'th' AND name = 'EdTech & Web' LIMIT 1;
  SELECT id INTO v_cat_sec FROM public.project_categories WHERE language = 'th' AND name = 'Security' LIMIT 1;
  SELECT id INTO v_cat_web FROM public.project_categories WHERE language = 'th' AND name = 'Web App' LIMIT 1;

  -- Projects
  INSERT INTO public.projects (id, category_id, language, title, description, image_url, demo_url, github_url, featured, sort_order)
  VALUES 
    (gen_random_uuid(), v_cat_edtech, 'th', 'ครูเพชร IT - แพลตฟอร์มการเรียนรู้และเทคโนโลยีเพื่อการศึกษา', 'คลังสื่อการสอนดิจิทัล นวัตกรรมเทคโนโลยีเพื่อการศึกษาแบบ Active Learning พัฒนาศักยภาพด้านวิทยาการคำนวณและเทคโนโลยี', '/img/main.png', 'https://example.com', 'https://github.com', true, 1),
    (gen_random_uuid(), v_cat_sec, 'th', 'Cybersecurity Defense Lab (ป้องกันไว้ก่อนดีกว่า 🛡️)', 'ระบบจำลองสถานการณ์ความมั่นคงปลอดภัยไซเบอร์และ CTF Training Lab เพื่อสร้างความตระหนักรู้ด้านความปลอดภัยดิจิทัล', '/img/10.png', 'https://example.com', 'https://github.com', true, 2),
    (gen_random_uuid(), v_cat_web, 'th', 'Full-Stack Development Studio (Good Code Good Life 🎧)', 'การพัฒนาเว็บแอปพลิเคชันคุณภาพสูง ออกแบบสถาปัตยกรรมระบบที่ปลอดภัยและมีประสิทธิภาพ โฟกัสทุกการเขียนโค้ดด้วยมาตรฐานสูงสุด', '/img/work2.png', 'https://example.com', 'https://github.com', true, 3)
  ON CONFLICT DO NOTHING;
END $$;

-- ────────────────────────────────────────────────────────────────────────────
-- 19. FINAL VERIFICATION QUERY
-- ────────────────────────────────────────────────────────────────────────────
SELECT 'Profiles' as table_name, count(*) as count FROM public.profiles
UNION ALL
SELECT 'Education', count(*) FROM public.education
UNION ALL
SELECT 'Projects', count(*) FROM public.projects
UNION ALL
SELECT 'Contact Messages', count(*) FROM public.contact_messages;
