-- Insert a test client with ID 1
INSERT INTO clients (id, name, email, phone, created_at)
VALUES (1, 'Test Client', 'test@example.com', '555-123-4567', NOW())
ON CONFLICT (id) DO UPDATE
SET name = 'Test Client', email = 'test@example.com', phone = '555-123-4567';
