export const createTablesSQL = `
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

-- Create detailed workout_logs table if it doesn't exist
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

-- Create client_nutrition_plans table if it doesn't exist
CREATE TABLE IF NOT EXISTS client_nutrition_plans (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL,
  nutrition_html TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(client_id)
);

-- Create meal_completions table if it doesn't exist
CREATE TABLE IF NOT EXISTS meal_completions (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL,
  day_id TEXT NOT NULL,
  meal_id TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  UNIQUE(client_id, day_id, meal_id)
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_workout_completions_client_id ON workout_completions(client_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_client_id ON workout_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_day_id ON workout_logs(client_id, day_id);
CREATE INDEX IF NOT EXISTS idx_meal_completions_client_id ON meal_completions(client_id);
`
