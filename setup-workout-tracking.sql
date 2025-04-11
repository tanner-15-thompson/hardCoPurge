-- Create table for detailed workout tracking
CREATE TABLE IF NOT EXISTS workout_logs (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL,
  day_id TEXT NOT NULL,
  exercise_name TEXT NOT NULL,
  planned_sets INTEGER,
  actual_sets INTEGER,
  planned_reps TEXT,
  actual_reps TEXT,
  planned_weight TEXT,
  actual_weight TEXT,
  planned_duration TEXT,
  actual_duration TEXT,
  planned_distance TEXT,
  actual_distance TEXT,
  planned_pace TEXT,
  actual_pace TEXT,
  planned_zone TEXT,
  actual_zone TEXT,
  notes TEXT,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(client_id, day_id, exercise_name)
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_workout_logs_client_id ON workout_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_day_id ON workout_logs(client_id, day_id);
