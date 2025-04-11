-- Create table for workout plan history
CREATE TABLE IF NOT EXISTS workout_plan_history (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL,
  workout_html TEXT NOT NULL,
  plan_name VARCHAR(255) NOT NULL,
  start_date DATE,
  end_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(255)
);

-- Create table for nutrition plan history
CREATE TABLE IF NOT EXISTS nutrition_plan_history (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL,
  nutrition_html TEXT NOT NULL,
  plan_name VARCHAR(255) NOT NULL,
  start_date DATE,
  end_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(255)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS workout_plan_history_client_id_idx ON workout_plan_history(client_id);
CREATE INDEX IF NOT EXISTS nutrition_plan_history_client_id_idx ON nutrition_plan_history(client_id);
