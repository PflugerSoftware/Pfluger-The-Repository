-- Survey System Tables
-- Generic, reusable survey system for The Repository

-- ============================================
-- TABLE: surveys
-- Top-level survey configuration
-- ============================================
CREATE TABLE IF NOT EXISTS surveys (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id text NOT NULL REFERENCES projects(id),
  title text NOT NULL,
  description text,
  slug text UNIQUE NOT NULL,
  is_active boolean DEFAULT true,
  map_center_lat double precision,
  map_center_lng double precision,
  map_zoom integer DEFAULT 16,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- TABLE: survey_questions
-- Individual questions within a survey
-- ============================================
CREATE TABLE IF NOT EXISTS survey_questions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  survey_id uuid NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  project_id text NOT NULL,
  question_order integer NOT NULL,
  question_text text NOT NULL,
  question_type text NOT NULL CHECK (question_type IN ('multiple_choice', 'open_ended')),
  is_map_based boolean DEFAULT false,
  max_pins integer,
  options jsonb,
  max_selections integer,
  required boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- TABLE: survey_responses
-- One row per person completing a survey
-- ============================================
CREATE TABLE IF NOT EXISTS survey_responses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  survey_id uuid NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  project_id text NOT NULL,
  first_name text,
  role text CHECK (role IN ('student', 'parent', 'teacher', 'staff', 'other')),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- TABLE: survey_answers
-- One row per question per response
-- ============================================
CREATE TABLE IF NOT EXISTS survey_answers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  response_id uuid NOT NULL REFERENCES survey_responses(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES survey_questions(id) ON DELETE CASCADE,
  survey_id uuid NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  project_id text NOT NULL,
  answer_text text,
  answer_choices jsonb,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- TABLE: survey_pins
-- Map pins associated with answers
-- ============================================
CREATE TABLE IF NOT EXISTS survey_pins (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  answer_id uuid NOT NULL REFERENCES survey_answers(id) ON DELETE CASCADE,
  response_id uuid NOT NULL REFERENCES survey_responses(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES survey_questions(id) ON DELETE CASCADE,
  survey_id uuid NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  project_id text NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  color text NOT NULL CHECK (color IN ('green', 'yellow', 'red')),
  note text,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_surveys_slug ON surveys(slug);
CREATE INDEX idx_survey_questions_survey_id ON survey_questions(survey_id);
CREATE INDEX idx_survey_responses_survey_id ON survey_responses(survey_id);
CREATE INDEX idx_survey_answers_survey_id ON survey_answers(survey_id);
CREATE INDEX idx_survey_answers_question_id ON survey_answers(question_id);
CREATE INDEX idx_survey_answers_response_id ON survey_answers(response_id);
CREATE INDEX idx_survey_pins_survey_id ON survey_pins(survey_id);
CREATE INDEX idx_survey_pins_question_id ON survey_pins(question_id);
CREATE INDEX idx_survey_pins_response_id ON survey_pins(response_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_pins ENABLE ROW LEVEL SECURITY;

-- surveys: anyone can read (need to load survey config)
CREATE POLICY "public_read_surveys" ON surveys
  FOR SELECT USING (true);

-- survey_questions: anyone can read (need to see questions to take survey)
CREATE POLICY "public_read_questions" ON survey_questions
  FOR SELECT USING (true);

-- survey_responses: anonymous insert (write-only), authenticated read
CREATE POLICY "anon_insert_responses" ON survey_responses
  FOR INSERT WITH CHECK (true);
CREATE POLICY "auth_read_responses" ON survey_responses
  FOR SELECT USING (auth.role() = 'authenticated');

-- survey_answers: anonymous insert, authenticated read
CREATE POLICY "anon_insert_answers" ON survey_answers
  FOR INSERT WITH CHECK (true);
CREATE POLICY "auth_read_answers" ON survey_answers
  FOR SELECT USING (auth.role() = 'authenticated');

-- survey_pins: anonymous insert, authenticated read
CREATE POLICY "anon_insert_pins" ON survey_pins
  FOR INSERT WITH CHECK (true);
CREATE POLICY "auth_read_pins" ON survey_pins
  FOR SELECT USING (auth.role() = 'authenticated');

-- Authenticated users can manage surveys and questions (admin)
CREATE POLICY "auth_manage_surveys" ON surveys
  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_manage_questions" ON survey_questions
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- SEED DATA: Lee College Campus Survey
-- ============================================
INSERT INTO surveys (project_id, title, description, slug, is_active, map_center_lat, map_center_lng, map_zoom)
VALUES (
  'X26-RB08',
  'Lee College Campus Survey',
  'Help us understand how you experience the Lee College campus. Share your thoughts on campus spaces, safety, and areas for improvement by dropping pins on the map and answering a few questions.',
  'LeeCollegeMapSurveySpring2026',
  true,
  29.731609,
  -94.977375,
  16
);
