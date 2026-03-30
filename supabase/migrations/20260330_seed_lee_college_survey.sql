-- Seed Data: Lee College Faculty Discovery Survey
-- Full survey with Part 1 (map exercise) and Part 2 (structured questions)

-- ============================================
-- SURVEY
-- ============================================
INSERT INTO surveys (project_id, title, description, slug, is_active, map_center_lat, map_center_lng, map_zoom, roles)
VALUES (
  'X26-RB08',
  'Lee College Faculty Discovery Survey',
  'This survey is a core part of Lee College''s comprehensive campus master planning effort. Your feedback will directly inform decisions about physical spaces, facilities, and investments that shape the learning environment for years to come. The survey takes approximately 8-12 minutes to complete.',
  'lee-college-faculty-2026',
  true,
  29.731609,
  -94.977375,
  16,
  '["Full-Time Faculty", "Adjunct / Part-Time Faculty", "Department Chair / Program Lead", "Faculty with Administrative Responsibilities", "Other"]'::jsonb
);

-- Get the survey ID for FK references
DO $$
DECLARE
  survey_uuid uuid;
BEGIN
  SELECT id INTO survey_uuid FROM surveys WHERE slug = 'lee-college-faculty-2026';

  -- ============================================
  -- PART 1: Interactive Mapping Exercise
  -- 6 map-based questions, one per principle
  -- ============================================

  INSERT INTO survey_questions (survey_id, project_id, question_order, question_text, question_type, category, is_map_based, max_pins, required) VALUES
  (survey_uuid, 'X26-RB08', 1,
   'Mark places where you feel a sense of belonging, inclusion, safety, or support.',
   'open_ended', 'people-centered', true, 10, true),

  (survey_uuid, 'X26-RB08', 2,
   'Mark spaces with untapped potential, flexibility, or opportunities for redevelopment.',
   'open_ended', 'future-evolution', true, 10, true),

  (survey_uuid, 'X26-RB08', 3,
   'Mark areas that support or could better support workforce training, academics, or partnerships.',
   'open_ended', 'build-for-opportunity', true, 10, true),

  (survey_uuid, 'X26-RB08', 4,
   'Mark spaces that bring people together or strengthen campus-community connections.',
   'open_ended', 'community-engagement', true, 10, true),

  (survey_uuid, 'X26-RB08', 5,
   'Mark places that embody Lee College''s character, history, and lasting institutional spirit.',
   'open_ended', 'enduring-identity', true, 10, true),

  (survey_uuid, 'X26-RB08', 6,
   'Mark locations with physical barriers, safety concerns, or obstacles to teaching and learning.',
   'open_ended', 'barriers', true, 10, true);

  -- ============================================
  -- PART 2: Structured Survey
  -- Section 0: About You
  -- ============================================

  INSERT INTO survey_questions (survey_id, project_id, question_order, question_text, question_type, category, options, max_selections, allow_pin, required) VALUES
  (survey_uuid, 'X26-RB08', 7,
   'What is your primary role at Lee College?',
   'multiple_choice', 'about-you',
   '["Full-Time Faculty", "Adjunct / Part-Time Faculty", "Department Chair / Program Lead", "Faculty with Administrative Responsibilities", "Other"]'::jsonb,
   1, false, true),

  (survey_uuid, 'X26-RB08', 8,
   'How many years have you been employed at Lee College?',
   'multiple_choice', 'about-you',
   '["Less than 1 year", "1-3 years", "4-7 years", "8-15 years", "More than 15 years"]'::jsonb,
   1, false, true),

  (survey_uuid, 'X26-RB08', 9,
   'Which campus location are you primarily affiliated with?',
   'multiple_choice', 'about-you',
   '["Baytown Campus", "McNair Center", "Multiple Locations", "Primarily Online"]'::jsonb,
   1, false, true),

  (survey_uuid, 'X26-RB08', 10,
   'How often do you physically come to the Baytown campus each week (on average)?',
   'multiple_choice', 'about-you',
   '["5 or more days", "3-4 days", "1-2 days", "Less than once per week", "I am primarily remote/online"]'::jsonb,
   1, false, true);

  -- ============================================
  -- Principle 1: People-Centered Campus
  -- ============================================

  INSERT INTO survey_questions (survey_id, project_id, question_order, question_text, question_type, category, sub_items, scale_labels, allow_pin, required) VALUES
  (survey_uuid, 'X26-RB08', 11,
   'How safe do you feel in the following campus areas at different times of day?',
   'matrix_likert', 'people-centered',
   '["Building interiors - Daytime", "Building interiors - Evening", "Parking lots - Daytime", "Parking lots - Evening", "Outdoor spaces and pedestrian pathways - Daytime", "Outdoor spaces and pedestrian pathways - Evening"]'::jsonb,
   '["Very Safe", "Safe", "Neutral", "Unsafe", "Very Unsafe"]'::jsonb,
   true, true);

  INSERT INTO survey_questions (survey_id, project_id, question_order, question_text, question_type, category, sub_items, scale_labels, allow_pin, required) VALUES
  (survey_uuid, 'X26-RB08', 12,
   'To what extent do the following campus environments feel welcoming and inclusive to a diverse range of students and faculty?',
   'matrix_likert', 'people-centered',
   '["Classrooms and labs", "Outdoor common areas and pedestrian pathways", "Administrative and service offices", "Study and library spaces"]'::jsonb,
   '["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"]'::jsonb,
   true, true);

  INSERT INTO survey_questions (survey_id, project_id, question_order, question_text, question_type, category, sub_items, scale_labels, allow_pin, required) VALUES
  (survey_uuid, 'X26-RB08', 13,
   'How well does the campus support the following aspects of the student experience?',
   'matrix_likert', 'people-centered',
   '["Sense of belonging and connection", "Physical and mental wellness", "Navigation and wayfinding", "Access to services (advising, tutoring, financial aid)", "Basic needs (food, quiet rest spaces)"]'::jsonb,
   '["Very Well", "Well", "Adequately", "Poorly", "Very Poorly"]'::jsonb,
   true, true);

  INSERT INTO survey_questions (survey_id, project_id, question_order, question_text, question_type, category, options, max_selections, allow_pin, required) VALUES
  (survey_uuid, 'X26-RB08', 14,
   'Which of the following physical accessibility issues have you personally observed or experienced on the Baytown campus? (Select all that apply)',
   'multiple_choice', 'people-centered',
   '["Insufficient ADA-compliant ramps or pathways", "Inadequate accessible parking", "Barriers to building entry", "Poor lighting in pedestrian areas and outdoor common spaces", "Insufficient seating in common areas", "None of the above"]'::jsonb,
   null, true, true);

  -- ============================================
  -- Principle 2: Future Evolution
  -- ============================================

  INSERT INTO survey_questions (survey_id, project_id, question_order, question_text, question_type, category, options, max_selections, allow_pin, required) VALUES
  (survey_uuid, 'X26-RB08', 15,
   'Which types of space changes would have the greatest positive impact on instruction? (Select your top 3)',
   'multiple_choice', 'future-evolution',
   '["Flexible, reconfigurable, larger classrooms", "Updated laboratory and maker spaces", "Faculty collaboration and prep rooms", "Improved outdoor learning environments", "Larger lecture halls with modern tech", "Small-group and seminar rooms", "Simulation or industry-specific training spaces"]'::jsonb,
   3, true, true);

  INSERT INTO survey_questions (survey_id, project_id, question_order, question_text, question_type, category, sub_items, scale_labels, allow_pin, required) VALUES
  (survey_uuid, 'X26-RB08', 16,
   'How confident are you that the current campus infrastructure can support the following over the next 10 years?',
   'matrix_likert', 'future-evolution',
   '["Growth in enrollment and student population", "Evolving technology in education", "New academic programs and disciplines", "Increased demand for hybrid instruction", "Industry and workforce training needs"]'::jsonb,
   '["Very Confident", "Confident", "Uncertain", "Not Confident", "Very Unlikely"]'::jsonb,
   true, true);

  INSERT INTO survey_questions (survey_id, project_id, question_order, question_text, question_type, category, options, max_selections, allow_pin, required) VALUES
  (survey_uuid, 'X26-RB08', 17,
   'Which of the following best describes how your department''s space needs have changed over the last 5 years?',
   'likert_single', 'future-evolution',
   '["Our space needs have grown significantly", "Our space needs have grown somewhat", "Our space needs have stayed about the same", "Our space needs have decreased somewhat", "Our space needs have decreased significantly"]'::jsonb,
   1, false, true);

  INSERT INTO survey_questions (survey_id, project_id, question_order, question_text, question_type, category, sub_items, scale_labels, allow_pin, required) VALUES
  (survey_uuid, 'X26-RB08', 18,
   'How important is it that new campus construction or renovation prioritizes each of the following?',
   'matrix_likert', 'future-evolution',
   '["Long-term durability and low maintenance", "Environmental sustainability", "Adaptability for future program changes", "Compatibility with digital and remote learning", "Energy efficiency"]'::jsonb,
   '["Extremely Important", "Very Important", "Somewhat Important", "Not Very Important", "Not at All Important"]'::jsonb,
   true, true);

  -- ============================================
  -- Principle 3: Build for Opportunity
  -- ============================================

  INSERT INTO survey_questions (survey_id, project_id, question_order, question_text, question_type, category, sub_items, scale_labels, allow_pin, required) VALUES
  (survey_uuid, 'X26-RB08', 19,
   'How well does the current campus support the following academic and career pathways?',
   'matrix_likert', 'build-for-opportunity',
   '["Applied Business", "Health Services", "Liberal & Fine Arts", "Manufacturing and Industrial", "Public Service", "Science, Technology, Engineering & Math"]'::jsonb,
   '["Very Well", "Well", "Adequately", "Poorly", "Very Poorly"]'::jsonb,
   true, true);

  INSERT INTO survey_questions (survey_id, project_id, question_order, question_text, question_type, category, options, max_selections, allow_pin, required) VALUES
  (survey_uuid, 'X26-RB08', 20,
   'How cohesive and logically organized does the current campus layout feel for students navigating between academic disciplines?',
   'likert_single', 'build-for-opportunity',
   '["Very cohesive and well-organized", "Mostly cohesive", "Neutral", "Somewhat fragmented", "Very fragmented and confusing"]'::jsonb,
   1, true, true);

  INSERT INTO survey_questions (survey_id, project_id, question_order, question_text, question_type, category, sub_items, scale_labels, allow_pin, required) VALUES
  (survey_uuid, 'X26-RB08', 21,
   'To what extent do you agree with the following statements about campus support for academic and workforce opportunity?',
   'matrix_likert', 'build-for-opportunity',
   '["Students have convenient access to career services and advice from within academic buildings", "Campus spaces support effective collaboration between departments", "Physical facilities adequately support the technical depth of my program", "Campus resources reflect the quality of instruction we deliver"]'::jsonb,
   '["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"]'::jsonb,
   true, true);

  INSERT INTO survey_questions (survey_id, project_id, question_order, question_text, question_type, category, options, max_selections, allow_pin, required) VALUES
  (survey_uuid, 'X26-RB08', 22,
   'Which of the following best describes the primary barrier to better industry partnerships or workforce training at Lee College?',
   'multiple_choice', 'build-for-opportunity',
   '["Lack of appropriate physical space for training", "Insufficient technology or equipment", "Difficulty hosting industry partners on campus", "Inadequate visibility of programs to employers", "Lack of dedicated collaboration or meeting space", "No significant barrier at this time"]'::jsonb,
   1, false, true);

  -- ============================================
  -- Principle 4: Community Engagement
  -- ============================================

  INSERT INTO survey_questions (survey_id, project_id, question_order, question_text, question_type, category, sub_items, scale_labels, allow_pin, required) VALUES
  (survey_uuid, 'X26-RB08', 23,
   'How often do you use each of the following campus spaces for collaboration with colleagues?',
   'matrix_likert', 'community-engagement',
   '["Faculty offices or department suites", "Common areas or lounges", "Dedicated collaboration rooms", "Outdoor spaces", "Campus dining areas", "Virtual/remote spaces"]'::jsonb,
   '["Daily", "Several times a week", "Weekly", "Rarely", "Never"]'::jsonb,
   true, true);

  INSERT INTO survey_questions (survey_id, project_id, question_order, question_text, question_type, category, options, max_selections, allow_pin, required) VALUES
  (survey_uuid, 'X26-RB08', 24,
   'Which of the following best represents the campus''s role in the broader Baytown community? (Select all that apply)',
   'multiple_choice', 'community-engagement',
   '["A destination for community events and programs", "An employer and economic anchor", "A provider of continuing education and workforce training", "A venue for community gatherings and celebrations", "The campus currently has limited community engagement"]'::jsonb,
   null, false, true);

  INSERT INTO survey_questions (survey_id, project_id, question_order, question_text, question_type, category, options, max_selections, allow_pin, required) VALUES
  (survey_uuid, 'X26-RB08', 25,
   'Which types of new or improved spaces would most strengthen the connection between Lee College and the wider community? (Select your top 2)',
   'multiple_choice', 'community-engagement',
   '["Public-access outdoor plazas or green spaces", "Flexible event or performance venues", "Shared spaces with community partners", "Public-facing workforce training and demo facilities", "An improved campus entry and gateway experience"]'::jsonb,
   2, true, true);

  INSERT INTO survey_questions (survey_id, project_id, question_order, question_text, question_type, category, sub_items, scale_labels, allow_pin, required) VALUES
  (survey_uuid, 'X26-RB08', 26,
   'To what extent do you agree with the following statements?',
   'matrix_likert', 'community-engagement',
   '["Lee College''s campus feels like an active part of the Baytown community", "Community members would feel welcome visiting the campus", "The campus has adequate spaces to host community events", "Students have meaningful opportunities to connect with local employers on campus"]'::jsonb,
   '["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"]'::jsonb,
   true, true);

  -- ============================================
  -- Principle 5: Enduring Identity
  -- ============================================

  INSERT INTO survey_questions (survey_id, project_id, question_order, question_text, question_type, category, sub_items, scale_labels, allow_pin, required) VALUES
  (survey_uuid, 'X26-RB08', 27,
   'How strongly does each of the following contribute to Lee College''s sense of identity and character?',
   'matrix_likert', 'enduring-identity',
   '["The physical appearance and design of its buildings", "The character and feel of its outdoor spaces", "Campus gateways and arrival experience", "Signage, branding, and wayfinding", "Landmark or historic spaces on campus"]'::jsonb,
   '["Very Strongly", "Strongly", "Somewhat", "Weakly", "Not at All"]'::jsonb,
   true, true);

  INSERT INTO survey_questions (survey_id, project_id, question_order, question_text, question_type, category, options, max_selections, allow_pin, required) VALUES
  (survey_uuid, 'X26-RB08', 28,
   'Which of the following words or phrases best describes the current physical character of the Baytown campus? (Select up to 3)',
   'multiple_choice', 'enduring-identity',
   '["Historic and established", "Modern and current", "Welcoming and approachable", "Utilitarian / Functional", "Uneven or inconsistent", "Vibrant and active", "Under-invested or dated", "Community-centered"]'::jsonb,
   3, false, true);

  INSERT INTO survey_questions (survey_id, project_id, question_order, question_text, question_type, category, sub_items, scale_labels, allow_pin, required) VALUES
  (survey_uuid, 'X26-RB08', 29,
   'How important is it that future campus development prioritize each of the following design values?',
   'matrix_likert', 'enduring-identity',
   '["Architectural consistency and campus coherence", "Celebrating Lee College''s history and legacy", "High-quality, durable materials that age well", "A distinct and recognizable visual identity", "Spaces that feel inspiring and motivating to students"]'::jsonb,
   '["Extremely Important", "Very Important", "Somewhat Important", "Not Very Important", "Not at All Important"]'::jsonb,
   true, true);

  INSERT INTO survey_questions (survey_id, project_id, question_order, question_text, question_type, category, options, allow_pin, required) VALUES
  (survey_uuid, 'X26-RB08', 30,
   'Rank the following campus elements from most to least in need of a design identity investment. (Rank 1 = Greatest Need)',
   'ranking', 'enduring-identity',
   '["Campus entry points and gateways", "Main pedestrian circulation and plazas", "Building facades and exterior design", "Interior common areas and lobbies", "Outdoor gathering and landscape areas", "Signage, lighting, and wayfinding systems"]'::jsonb,
   false, true);

  INSERT INTO survey_questions (survey_id, project_id, question_order, question_text, question_type, category, options, max_selections, allow_pin, required) VALUES
  (survey_uuid, 'X26-RB08', 31,
   'Overall, how proud are you to bring students, colleagues, or guests to the Baytown campus?',
   'likert_single', 'enduring-identity',
   '["Very proud - the campus reflects our quality and mission", "Somewhat proud - the campus is decent but has room to grow", "Neutral - the campus is functional but not inspiring", "Somewhat embarrassed - the campus does not reflect our quality", "Very embarrassed - the campus actively undermines our reputation"]'::jsonb,
   1, false, true);

END $$;
