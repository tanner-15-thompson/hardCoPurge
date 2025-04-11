-- Create a simpler workout logs table
CREATE TABLE IF NOT EXISTS simple_workout_logs (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL,
  day_id TEXT NOT NULL,
  notes TEXT,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(client_id, day_id)
);

-- Create workout completions table
CREATE TABLE IF NOT EXISTS workout_completions (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL,
  day_id TEXT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  UNIQUE(client_id, day_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_simple_workout_logs_client_id ON simple_workout_logs(client_id);
CREATE INDEX IF NOT EXISTS idx_workout_completions_client_id ON workout_completions(client_id);

-- Create function to ensure tables exist
CREATE OR REPLACE FUNCTION create_simple_workout_logs_table_if_not_exist()
RETURNS void AS $$
BEGIN
  -- Simple workout logs table
  CREATE TABLE IF NOT EXISTS simple_workout_logs (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL,
    day_id TEXT NOT NULL,
    notes TEXT,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(client_id, day_id)
  );
  
  -- Workout completions table
  CREATE TABLE IF NOT EXISTS workout_completions (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL,
    day_id TEXT NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    UNIQUE(client_id, day_id)
  );
  
  -- Create indexes if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_simple_workout_logs_client_id'
  ) THEN
    CREATE INDEX idx_simple_workout_logs_client_id ON simple_workout_logs(client_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_workout_completions_client_id'
  ) THEN
    CREATE INDEX idx_workout_completions_client_id ON workout_completions(client_id);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to ensure all workout tables exist
CREATE OR REPLACE FUNCTION create_workout_tables_if_not_exist()
RETURNS void AS $$
BEGIN
  -- Client workouts table
  CREATE TABLE IF NOT EXISTS client_workouts (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL,
    workout_html TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(client_id)
  );

  -- Workout completions table
  CREATE TABLE IF NOT EXISTS workout_completions (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL,
    day_id TEXT NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    UNIQUE(client_id, day_id)
  );

  -- Simple workout logs table
  CREATE TABLE IF NOT EXISTS simple_workout_logs (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL,
    day_id TEXT NOT NULL,
    notes TEXT,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(client_id, day_id)
  );
  
  -- Create indexes if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_workout_completions_client_id'
  ) THEN
    CREATE INDEX idx_workout_completions_client_id ON workout_completions(client_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_simple_workout_logs_client_id'
  ) THEN
    CREATE INDEX idx_simple_workout_logs_client_id ON simple_workout_logs(client_id);
  END IF;
END;
$$ LANGUAGE plpgsql;
