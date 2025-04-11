-- Create admin roles table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create a secure RLS policy
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Only allow admins to view the admin_users table
CREATE POLICY "Admins can view admin list" ON admin_users
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM admin_users)
  );

-- Insert your admin user (replace with your actual admin user's UUID)
-- You can get this from the Supabase dashboard > Authentication > Users
INSERT INTO admin_users (id)
VALUES ('REPLACE_WITH_ADMIN_USER_UUID')
ON CONFLICT (id) DO NOTHING;
