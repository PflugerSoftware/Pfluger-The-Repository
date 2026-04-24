-- Remove sentiment from survey pins.
--
-- Leadership decision: sentiment should not be collected or displayed anywhere.
-- We keep the column for now so any stale browser bundles still in caches that
-- POST a sentiment value do not throw a "column does not exist" error.
-- A trigger nullifies any sentiment value on insert/update.

UPDATE survey_pins SET sentiment = NULL WHERE sentiment IS NOT NULL;

DROP INDEX IF EXISTS idx_survey_pins_sentiment;

CREATE OR REPLACE FUNCTION survey_pins_force_null_sentiment()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.sentiment := NULL;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_survey_pins_force_null_sentiment ON survey_pins;

CREATE TRIGGER trg_survey_pins_force_null_sentiment
BEFORE INSERT OR UPDATE OF sentiment ON survey_pins
FOR EACH ROW
EXECUTE FUNCTION survey_pins_force_null_sentiment();
