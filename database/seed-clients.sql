-- Insert a test client with ID 1
INSERT INTO clients (id, name, email, phone, created_at)
VALUES 
  (1, 'John Doe', 'john@example.com', '555-123-4567', NOW())
ON CONFLICT (id) DO NOTHING;

-- Reset the sequence if needed
SELECT setval('clients_id_seq', (SELECT MAX(id) FROM clients));
