-- Set max_pins = 2 for all map-based questions in the Lee College survey
UPDATE survey_questions
SET max_pins = 2
WHERE is_map_based = true
  AND project_id = 'X26-RB08';

-- Exception: "heart of the Baytown campus" question only needs 1 pin
UPDATE survey_questions
SET max_pins = 1
WHERE question_text ILIKE '%heart of the Baytown campus%'
  AND project_id = 'X26-RB08';
