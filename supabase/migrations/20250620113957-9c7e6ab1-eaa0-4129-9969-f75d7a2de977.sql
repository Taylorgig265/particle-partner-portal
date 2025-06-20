
-- First, let's ensure we have proper admin user tracking
-- Update the admin_users table to have better constraints
ALTER TABLE public.admin_users 
ADD CONSTRAINT admin_users_user_id_unique UNIQUE (user_id);

-- Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin_user(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE user_id = user_uuid
  );
$$;

-- Add some RLS policies for admin_users table
DROP POLICY IF EXISTS "Only admins can access admin_users" ON public.admin_users;

CREATE POLICY "Admins can view admin_users" 
  ON public.admin_users 
  FOR SELECT 
  USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Only existing admins can manage admin_users" 
  ON public.admin_users 
  FOR ALL 
  USING (public.is_admin_user(auth.uid()));

-- For now, let's insert a test admin user (you can replace this email with your actual admin email)
-- This will allow you to access the admin panel
INSERT INTO public.admin_users (user_id, is_super_admin) 
SELECT id, true 
FROM auth.users 
WHERE email = 'admin@example.com'  -- Replace with your admin email
ON CONFLICT (user_id) DO NOTHING;
