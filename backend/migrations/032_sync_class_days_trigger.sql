-- Migration to ensure data consistency between day_of_week and days_of_week
-- This trigger will keep the legacy column in sync while we transition the code.

-- 1. Create the sync function
CREATE OR REPLACE FUNCTION sync_class_days()
RETURNS TRIGGER AS $$
BEGIN
    -- If days_of_week was changed, update the legacy day_of_week with the first element
    IF (TG_OP = 'INSERT' OR OLD.days_of_week IS DISTINCT FROM NEW.days_of_week) THEN
        IF NEW.days_of_week IS NOT NULL AND array_length(NEW.days_of_week, 1) > 0 THEN
            NEW.day_of_week = NEW.days_of_week[1];
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Create the trigger
DROP TRIGGER IF EXISTS trg_sync_class_days ON classes;
CREATE TRIGGER trg_sync_class_days
BEFORE INSERT OR UPDATE ON classes
FOR EACH ROW
EXECUTE FUNCTION sync_class_days();

-- 3. Initial data repair: ensure all classes have at least the current day_of_week in their array
UPDATE classes 
SET days_of_week = ARRAY[day_of_week] 
WHERE days_of_week IS NULL OR array_length(days_of_week, 1) = 0;
