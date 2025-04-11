-- Check if client_questionnaires table exists
CREATE TABLE IF NOT EXISTS client_questionnaires (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  workout_data JSONB NOT NULL DEFAULT '{}',
  nutrition_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_client_questionnaires_client_id ON client_questionnaires(client_id);

-- Add activity type for questionnaire updates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type 
    WHERE typname = 'activity_type_enum' 
    AND typelem = 0
  ) THEN
    CREATE TYPE activity_type_enum AS ENUM (
      'login', 
      'logout', 
      'view_workout', 
      'view_nutrition', 
      'questionnaire_updated'
    );
  ELSE
    -- Check if the enum already has the value we want to add
    IF NOT EXISTS (
      SELECT 1 FROM pg_enum 
      WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'activity_type_enum')
      AND enumlabel = 'questionnaire_updated'
    ) THEN
      -- Add the new value to the enum
      ALTER TYPE activity_type_enum ADD VALUE 'questionnaire_updated';
    END IF;
  END IF;
END$$;
