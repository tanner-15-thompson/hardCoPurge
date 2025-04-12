-- Create client_questionnaires table if it doesn't exist
CREATE TABLE IF NOT EXISTS client_questionnaires (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('workout', 'nutrition')),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_client_questionnaires_client_id ON client_questionnaires(client_id);
CREATE INDEX IF NOT EXISTS idx_client_questionnaires_type ON client_questionnaires(type);
CREATE UNIQUE INDEX IF NOT EXISTS idx_client_questionnaires_client_type ON client_questionnaires(client_id, type);

-- Create client_questionnaire_responses table if it doesn't exist
CREATE TABLE IF NOT EXISTS client_questionnaire_responses (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  questionnaire_id INTEGER NOT NULL REFERENCES client_questionnaires(id) ON DELETE CASCADE,
  responses JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_client_questionnaire_responses_client_id ON client_questionnaire_responses(client_id);
CREATE INDEX IF NOT EXISTS idx_client_questionnaire_responses_questionnaire_id ON client_questionnaire_responses(questionnaire_id);
