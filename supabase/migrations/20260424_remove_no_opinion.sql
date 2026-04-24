-- Remove "No Opinion" from the four matrix-likert questions on the Lee
-- College survey (Q14-17) before broader distribution.
--
-- Step 1: Remap existing "No Opinion" picks to "Agree" so historical answers
--         stay on a valid scale value.
-- Step 2: Drop "No Opinion" from scale_labels on the affected questions.

UPDATE survey_answers a
SET answer_matrix = (
  SELECT jsonb_object_agg(
    kv.key,
    CASE
      WHEN kv.value = to_jsonb('No Opinion'::text) THEN to_jsonb('Agree'::text)
      ELSE kv.value
    END
  )
  FROM jsonb_each(a.answer_matrix) AS kv
)
WHERE a.answer_matrix::text ILIKE '%No Opinion%';

UPDATE survey_questions q
SET scale_labels = (
  SELECT jsonb_agg(elem ORDER BY ord)
  FROM jsonb_array_elements(q.scale_labels) WITH ORDINALITY AS t(elem, ord)
  WHERE elem <> to_jsonb('No Opinion'::text)
)
WHERE q.scale_labels @> to_jsonb(ARRAY['No Opinion']);
