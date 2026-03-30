-- Migration: Expand survey schema for Lee College Faculty Discovery Survey
-- DESTRUCTIVE: Drops all existing survey data and rebuilds tables with new schema.

-- ============================================
-- DROP existing tables (reverse dependency order)
-- ============================================
DROP TABLE IF EXISTS survey_pins CASCADE;
DROP TABLE IF EXISTS survey_answers CASCADE;
DROP TABLE IF EXISTS survey_responses CASCADE;
DROP TABLE IF EXISTS survey_questions CASCADE;
DROP TABLE IF EXISTS surveys CASCADE;

-- ============================================
-- TABLE: surveys
-- Added: roles (configurable per survey)
-- ============================================
CREATE TABLE surveys (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id text NOT NULL REFERENCES projects(id),
  title text NOT NULL,
  description text,
  slug text UNIQUE NOT NULL,
  is_active boolean DEFAULT true,
  map_center_lat double precision,
  map_center_lng double precision,
  map_zoom integer DEFAULT 16,
  roles jsonb, -- configurable role options per survey, e.g. ["Full-Time Faculty", "Adjunct"]
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- TABLE: survey_questions
-- Added: category, allow_pin, sub_items, scale_labels
-- Expanded: question_type (matrix_likert, ranking, likert_single)
-- ============================================
CREATE TABLE survey_questions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  survey_id uuid NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  project_id text NOT NULL,
  question_order integer NOT NULL,
  question_text text NOT NULL,
  question_type text NOT NULL CHECK (question_type IN (
    'multiple_choice',
    'open_ended',
    'matrix_likert',
    'ranking',
    'likert_single'
  )),
  category text,           -- principle grouping: people-centered, future-evolution, etc.
  is_map_based boolean DEFAULT false,  -- Part 1: primary map-based question (free pin placement)
  allow_pin boolean DEFAULT false,     -- Part 2: optional pin alongside structured answer
  max_pins integer,
  options jsonb,           -- multiple choice / likert_single options array
  max_selections integer,  -- max choices for multi-select questions
  sub_items jsonb,         -- matrix_likert: array of items to rate
  scale_labels jsonb,      -- matrix_likert: scale labels array e.g. ["Very Safe", ..., "Very Unsafe"]
  required boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- TABLE: survey_responses
-- Changed: role is now plain text (no constraint)
-- ============================================
CREATE TABLE survey_responses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  survey_id uuid NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  project_id text NOT NULL,
  first_name text,
  role text,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- TABLE: survey_answers
-- Added: answer_matrix, answer_ranking
-- ============================================
CREATE TABLE survey_answers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  response_id uuid NOT NULL REFERENCES survey_responses(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES survey_questions(id) ON DELETE CASCADE,
  survey_id uuid NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  project_id text NOT NULL,
  answer_text text,         -- open_ended responses
  answer_choices jsonb,     -- multiple_choice / likert_single selections
  answer_matrix jsonb,      -- matrix_likert: {"sub_item_text": "selected_scale_label", ...}
  answer_ranking jsonb,     -- ranking: ["item1", "item2", ...] in ranked order
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- TABLE: survey_pins
-- Removed: color column (derived from question category)
-- ============================================
CREATE TABLE survey_pins (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  answer_id uuid NOT NULL REFERENCES survey_answers(id) ON DELETE CASCADE,
  response_id uuid NOT NULL REFERENCES survey_responses(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES survey_questions(id) ON DELETE CASCADE,
  survey_id uuid NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  project_id text NOT NULL,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  note text,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_surveys_slug ON surveys(slug);
CREATE INDEX idx_survey_questions_survey_id ON survey_questions(survey_id);
CREATE INDEX idx_survey_questions_category ON survey_questions(category);
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
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_pins ENABLE ROW LEVEL SECURITY;

-- surveys & questions: public read
CREATE POLICY "public_read_surveys" ON surveys FOR SELECT USING (true);
CREATE POLICY "public_read_questions" ON survey_questions FOR SELECT USING (true);

-- responses, answers, pins: anonymous insert, authenticated read
CREATE POLICY "anon_insert_responses" ON survey_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "auth_read_responses" ON survey_responses FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "anon_insert_answers" ON survey_answers FOR INSERT WITH CHECK (true);
CREATE POLICY "auth_read_answers" ON survey_answers FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "anon_insert_pins" ON survey_pins FOR INSERT WITH CHECK (true);
CREATE POLICY "auth_read_pins" ON survey_pins FOR SELECT USING (auth.role() = 'authenticated');

-- Authenticated users can manage surveys and questions (admin)
CREATE POLICY "auth_manage_surveys" ON surveys FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_manage_questions" ON survey_questions FOR ALL USING (auth.role() = 'authenticated');
