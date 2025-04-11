-- Create generated_prompts table
CREATE TABLE IF NOT EXISTS generated_prompts (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  prompt_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMP WITH TIME ZONE
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_generated_prompts_client_id ON generated_prompts(client_id);

-- Add permissions for authenticated users
ALTER TABLE generated_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can insert generated_prompts"
  ON generated_prompts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view generated_prompts"
  ON generated_prompts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update generated_prompts"
  ON generated_prompts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
