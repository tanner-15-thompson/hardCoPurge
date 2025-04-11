-- Add new fields to clients table
ALTER TABLE clients ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE clients ADD COLUMN IF NOT EXISTS payment_amount DECIMAL(10, 2);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS payment_frequency INTEGER; -- in months
ALTER TABLE clients ADD COLUMN IF NOT EXISTS last_payment_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS notes TEXT;

-- Create client_documents table if it doesn't exist
CREATE TABLE IF NOT EXISTS client_documents (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  description TEXT
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_client_documents_client_id ON client_documents(client_id);
