-- Create client_workouts table if it doesn't exist
CREATE TABLE IF NOT EXISTS client_workouts (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL,
  workout_html TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(client_id)
);

-- Create workout_completions table if it doesn't exist
CREATE TABLE IF NOT EXISTS workout_completions (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL,
  day_id TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  UNIQUE(client_id, day_id)
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_workout_completions_client_id ON workout_completions(client_id);
