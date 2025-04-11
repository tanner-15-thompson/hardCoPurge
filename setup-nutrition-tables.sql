-- Create table for storing client nutrition plans
CREATE TABLE IF NOT EXISTS client_nutrition_plans (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL,
  nutrition_html TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(client_id)
);

-- Create table for tracking meal completions
CREATE TABLE IF NOT EXISTS meal_completions (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL,
  day_id TEXT NOT NULL,
  meal_id TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  UNIQUE(client_id, day_id, meal_id)
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_meal_completions_client_id ON meal_completions(client_id);
