-- Migration: Lee College Survey V2 - Sentiment-Based, No Categories
-- Replaces old 31 category-based questions with 26 new questions.
-- Sentiment (good/ok/bad) drives all pin coloring instead of categories.

-- ============================================
-- SCHEMA: Add sentiment column to survey_pins
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'survey_pins' AND column_name = 'sentiment'
  ) THEN
    ALTER TABLE survey_pins ADD COLUMN sentiment text CHECK (sentiment IN ('good', 'ok', 'bad'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_survey_pins_sentiment ON survey_pins(sentiment);

-- ============================================
-- SCHEMA: Add boundary_polygon and sections to surveys (multi-survey support)
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'surveys' AND column_name = 'boundary_polygon'
  ) THEN
    ALTER TABLE surveys ADD COLUMN boundary_polygon jsonb;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'surveys' AND column_name = 'sections'
  ) THEN
    ALTER TABLE surveys ADD COLUMN sections jsonb;
  END IF;
END $$;

-- ============================================
-- DELETE old survey data (cascades to questions, responses, answers, pins)
-- ============================================
DELETE FROM surveys WHERE project_id = 'X26-RB08';

-- ============================================
-- INSERT new survey
-- ============================================
INSERT INTO surveys (project_id, title, description, slug, is_active, map_center_lat, map_center_lng, map_zoom, roles, boundary_polygon, sections)
VALUES (
  'X26-RB08',
  'Lee College Community Discovery Survey',
  'This survey is a core part of Lee College''s comprehensive campus master planning effort. Your feedback will directly inform decisions about physical spaces, facilities, and investments that shape the learning environment for years to come. The survey takes approximately 10-15 minutes to complete.',
  'LeeCollegeMapSurveySpring2026',
  true,
  29.731609,
  -94.977375,
  16,
  '["Student", "Faculty", "Staff", "Other"]'::jsonb,
  '[[-94.98003392626333,29.73728390164641],[-94.98026680778955,29.7362245466406],[-94.97994758091579,29.73611213706491],[-94.98023472889521,29.73555965639588],[-94.9810798632486,29.73531616858645],[-94.98032373607042,29.73408650959582],[-94.97846727829557,29.73490870425564],[-94.97825036631228,29.73442691557635],[-94.97820252185326,29.73399353001699],[-94.97817777978511,29.73369660299584],[-94.97837071625727,29.73343632524895],[-94.9785631114835,29.73324782208751],[-94.9787643811968,29.73305054214907],[-94.97900367844501,29.732737735653],[-94.97908014186132,29.73249723692],[-94.97908202874716,29.73215094952845],[-94.97899875661199,29.73177970826987],[-94.97891759401598,29.73143657617207],[-94.978849751857,29.73120875106844],[-94.97876152855817,29.73091136273915],[-94.97862050796223,29.73051933538711],[-94.9785102529823,29.73013790710168],[-94.97849210149494,29.72981890315342],[-94.97433973735936,29.72987949759868],[-94.97213767519371,29.73507213633389],[-94.9783129221989,29.73708615842378],[-94.98003392626333,29.73728390164641]]'::jsonb,
  '[{"key":"about-you","label":"About You","color":"#9CA3AF","lightColor":"rgba(156,163,175,0.15)","description":"Tell us about yourself.","skipIntro":true},{"key":"campus-experience","label":"Campus Experience","color":"#38BDF8","lightColor":"rgba(56,189,248,0.15)","description":"Share your experience of campus spaces and places by dropping pins on the map.","skipIntro":false},{"key":"campus-use","label":"Campus Use","color":"#A78BFA","lightColor":"rgba(167,139,250,0.15)","description":"Tell us how you use different areas of campus day to day.","skipIntro":false},{"key":"structured-survey","label":"Structured Survey","color":"#F59E0B","lightColor":"rgba(245,158,11,0.15)","description":"Answer targeted questions about campus facilities and services.","skipIntro":false}]'::jsonb
);

-- ============================================
-- INSERT 26 new questions
-- ============================================
DO $$
DECLARE
  survey_uuid uuid;
BEGIN
  SELECT id INTO survey_uuid FROM surveys WHERE slug = 'LeeCollegeMapSurveySpring2026';

  -- ============================================
  -- PART 0: About You (3 questions)
  -- ============================================

  INSERT INTO survey_questions (survey_id, project_id, question_order, question_text, question_type, category, options, max_selections, is_map_based, allow_pin, required) VALUES
  (survey_uuid, 'X26-RB08', 1,
   'What is your primary relationship to Lee College?',
   'multiple_choice', 'about-you',
   '["Student", "Faculty", "Staff", "Other"]'::jsonb,
   1, false, false, true),

  (survey_uuid, 'X26-RB08', 2,
   'Which campus location are you primarily affiliated with?',
   'multiple_choice', 'about-you',
   '["Baytown Campus", "McNair Center", "Primarily Online"]'::jsonb,
   1, false, false, true),

  (survey_uuid, 'X26-RB08', 3,
   'How often do you physically come to the Baytown campus each week (on average)?',
   'multiple_choice', 'about-you',
   '["5 or more days", "3-4 days", "1-2 days", "I am primarily remote/online"]'::jsonb,
   1, false, false, true);

  -- ============================================
  -- PART 1a: Campus Experience (10 map questions)
  -- ============================================

  INSERT INTO survey_questions (survey_id, project_id, question_order, question_text, question_type, category, is_map_based, max_pins, required) VALUES
  (survey_uuid, 'X26-RB08', 4,
   'Which building is your department located in?',
   'open_ended', 'campus-experience', true, 1, true),

  (survey_uuid, 'X26-RB08', 5,
   'What makes the Baytown campus special?',
   'open_ended', 'campus-experience', true, 5, true),

  (survey_uuid, 'X26-RB08', 6,
   'What/where do you consider to be the heart of the Baytown campus?',
   'open_ended', 'campus-experience', true, 3, true),

  (survey_uuid, 'X26-RB08', 7,
   'What is your favorite photo-op location / "Instagram moment" on the Baytown campus? (Select your top two choices.)',
   'open_ended', 'campus-experience', true, 2, true),

  (survey_uuid, 'X26-RB08', 8,
   'Identify your favorite outdoor spaces on the Baytown campus. (Select your top two choices.)',
   'open_ended', 'campus-experience', true, 2, true),

  (survey_uuid, 'X26-RB08', 9,
   'Identify areas of the Baytown campus you think need the most improvement. (Select your top two choices.)',
   'open_ended', 'campus-experience', true, 2, true),

  (survey_uuid, 'X26-RB08', 10,
   'Identify any areas on or near the Baytown campus you consider unsafe. (Select your top two choices.)',
   'open_ended', 'campus-experience', true, 2, true),

  (survey_uuid, 'X26-RB08', 11,
   'What three things about the Baytown campus do you appreciate the most?',
   'open_ended', 'campus-experience', true, 3, true),

  (survey_uuid, 'X26-RB08', 12,
   'Which buildings need the most improvement?',
   'open_ended', 'campus-experience', true, 3, true),

  (survey_uuid, 'X26-RB08', 13,
   'Where on the Baytown campus do you currently engage in outdoor recreation activities?',
   'open_ended', 'campus-experience', true, 3, true);

  -- ============================================
  -- PART 1b: Campus Use (4 map + 1 text)
  -- ============================================

  INSERT INTO survey_questions (survey_id, project_id, question_order, question_text, question_type, category, is_map_based, max_pins, required) VALUES
  (survey_uuid, 'X26-RB08', 14,
   'Where do you collaborate with your colleagues? (Select your top two choices.)',
   'open_ended', 'campus-use', true, 2, true),

  (survey_uuid, 'X26-RB08', 15,
   'Where do you typically eat on the Baytown campus? (Select your top two choices.)',
   'open_ended', 'campus-use', true, 2, true),

  (survey_uuid, 'X26-RB08', 16,
   'Where do you typically socialize on the Baytown campus? (Select your top two choices.)',
   'open_ended', 'campus-use', true, 2, true),

  (survey_uuid, 'X26-RB08', 17,
   'Are there campus destinations you would walk to if there were pedestrian pathways, or if pathways were more direct or continuous?',
   'open_ended', 'campus-use', true, 5, true);

  -- Text-only comment question (no map)
  INSERT INTO survey_questions (survey_id, project_id, question_order, question_text, question_type, category, is_map_based, allow_pin, required) VALUES
  (survey_uuid, 'X26-RB08', 18,
   'Please comment on the reasons you chose the above locations.',
   'open_ended', 'campus-use', false, false, false);

  -- ============================================
  -- PART 2: Structured Survey (8 questions)
  -- ============================================

  -- Q19: Community spaces (multiple choice, top 2, allow pin)
  INSERT INTO survey_questions (survey_id, project_id, question_order, question_text, question_type, category, options, max_selections, allow_pin, required) VALUES
  (survey_uuid, 'X26-RB08', 19,
   'Which types of new or improved spaces would most strengthen the connection between Lee College and the wider community? (Select your top 2)',
   'multiple_choice', 'structured-survey',
   '["Public access to outdoor plazas or green spaces", "Flexible event or performance venues", "Shared spaces with community partners", "Public-facing workforce training and demo facilities", "An improved campus entry and gateway experience"]'::jsonb,
   2, true, true);

  -- Q20: General agree/disagree (matrix likert, NO pin)
  INSERT INTO survey_questions (survey_id, project_id, question_order, question_text, question_type, category, sub_items, scale_labels, allow_pin, required) VALUES
  (survey_uuid, 'X26-RB08', 20,
   'How strongly do you agree or disagree with the following statements?',
   'matrix_likert', 'structured-survey',
   '["Lee College''s campus feels like an active part of the Baytown community", "The campus is attractive and offers an appealing first impression", "I physically work close to other employees within my department or college", "Sufficient lighting is provided throughout the campus", "The general appearance of the buildings represents the College well", "I would use outdoor classrooms and outdoor learning environments if they were available"]'::jsonb,
   '["Strongly Agree", "Agree", "Disagree", "Strongly Disagree", "No Opinion"]'::jsonb,
   false, true);

  -- Q21: Signage (matrix likert, allow pin)
  INSERT INTO survey_questions (survey_id, project_id, question_order, question_text, question_type, category, sub_items, scale_labels, allow_pin, required) VALUES
  (survey_uuid, 'X26-RB08', 21,
   'How strongly do you agree or disagree with the statements below about signage on the Baytown Campus?',
   'matrix_likert', 'structured-survey',
   '["Signage is attractive, visible, illuminated, and appropriately located to allow easy navigation throughout campus", "Exterior building signage is easy to find and easy to read", "Interior building signage is easy to find and understand"]'::jsonb,
   '["Strongly Agree", "Agree", "Disagree", "Strongly Disagree", "No Opinion"]'::jsonb,
   true, true);

  -- Q22: Parking (matrix likert, allow pin)
  INSERT INTO survey_questions (survey_id, project_id, question_order, question_text, question_type, category, sub_items, scale_labels, allow_pin, required) VALUES
  (survey_uuid, 'X26-RB08', 22,
   'How strongly do you agree or disagree with the statements below about parking on the Baytown Campus?',
   'matrix_likert', 'structured-survey',
   '["There are enough parking spaces overall", "Parking is sufficiently close to where I need to go", "I easily understand where I''m allowed to park", "I feel safe in campus parking lots"]'::jsonb,
   '["Strongly Agree", "Agree", "Disagree", "Strongly Disagree", "No Opinion"]'::jsonb,
   true, true);

  -- Q23: Pedestrian/bicycle (matrix likert, allow pin)
  INSERT INTO survey_questions (survey_id, project_id, question_order, question_text, question_type, category, sub_items, scale_labels, allow_pin, required) VALUES
  (survey_uuid, 'X26-RB08', 23,
   'How strongly do you agree or disagree with the statements below about pedestrian/bicycle comfort and safety on the Baytown Campus?',
   'matrix_likert', 'structured-survey',
   '["The campus is easy to navigate", "I feel safe walking throughout campus", "Buildings are well connected for walking between classes", "I feel safe in campus parking lots", "The campus is easily navigated by bicycle, and proper amenities such as bicycle lanes and storage racks are provided", "As a pedestrian, I feel safe crossing roads within the campus"]'::jsonb,
   '["Strongly Agree", "Agree", "Disagree", "Strongly Disagree", "No Opinion"]'::jsonb,
   true, true);

  -- Q24: Recreation facilities (multiple choice, top 2, allow pin)
  INSERT INTO survey_questions (survey_id, project_id, question_order, question_text, question_type, category, options, max_selections, allow_pin, required) VALUES
  (survey_uuid, 'X26-RB08', 24,
   'Which recreation facilities or wellness experiences do you think the campus needs more of? (Select your top two choices.)',
   'multiple_choice', 'structured-survey',
   '["Indoor recreation facilities", "Quiet spaces", "Recreation fields or courts"]'::jsonb,
   2, true, true);

  -- Q25: Departments to relocate (open ended, allow pin)
  INSERT INTO survey_questions (survey_id, project_id, question_order, question_text, question_type, category, allow_pin, required) VALUES
  (survey_uuid, 'X26-RB08', 25,
   'Are there departments or colleges that should be moved or relocated to better serve their functional relationships with other facilities, given their size, location, or condition?',
   'open_ended', 'structured-survey', true, false);

  -- Q26: Other comments (open ended, allow pin)
  INSERT INTO survey_questions (survey_id, project_id, question_order, question_text, question_type, category, allow_pin, required) VALUES
  (survey_uuid, 'X26-RB08', 26,
   'Do you have any other comments or points you wish to make about the current or future condition of the Baytown Campus?',
   'open_ended', 'structured-survey', true, false);

END $$;
