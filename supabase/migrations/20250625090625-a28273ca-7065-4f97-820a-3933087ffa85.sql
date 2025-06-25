
-- Add approval status and privileges to admin_users table
ALTER TABLE public.admin_users 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS name text,
ADD COLUMN IF NOT EXISTS can_manage_products boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS can_process_orders boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS can_access_clients boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS can_view_statistics boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES public.admin_users(id),
ADD COLUMN IF NOT EXISTS approved_at timestamp with time zone;

-- Update the is_admin_user function to check approval status
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
    AND status = 'approved'
  );
$$;

-- Create function to check specific admin privileges
CREATE OR REPLACE FUNCTION public.admin_has_privilege(user_uuid uuid, privilege_name text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT CASE 
    WHEN privilege_name = 'manage_products' THEN 
      COALESCE((SELECT can_manage_products FROM public.admin_users WHERE user_id = user_uuid AND status = 'approved'), false)
    WHEN privilege_name = 'process_orders' THEN 
      COALESCE((SELECT can_process_orders FROM public.admin_users WHERE user_id = user_uuid AND status = 'approved'), false)
    WHEN privilege_name = 'access_clients' THEN 
      COALESCE((SELECT can_access_clients FROM public.admin_users WHERE user_id = user_uuid AND status = 'approved'), false)
    WHEN privilege_name = 'view_statistics' THEN 
      COALESCE((SELECT can_view_statistics FROM public.admin_users WHERE user_id = user_uuid AND status = 'approved'), false)
    WHEN privilege_name = 'super_admin' THEN 
      COALESCE((SELECT is_super_admin FROM public.admin_users WHERE user_id = user_uuid AND status = 'approved'), false)
    ELSE false
  END;
$$;

-- Create function for admin registration
CREATE OR REPLACE FUNCTION public.register_admin_user(
  user_uuid uuid,
  admin_name text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_admin_id uuid;
BEGIN
  -- Insert new admin user with pending status
  INSERT INTO public.admin_users (
    user_id,
    name,
    status,
    is_super_admin,
    can_manage_products,
    can_process_orders,
    can_access_clients,
    can_view_statistics
  ) VALUES (
    user_uuid,
    admin_name,
    'pending',
    false,
    false,
    false,
    false,
    false
  )
  RETURNING id INTO new_admin_id;
  
  RETURN new_admin_id;
EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'Admin user already exists for this account';
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error registering admin user: %', SQLERRM;
END;
$$;

-- Create function for approving admin users (only super admins can use this)
CREATE OR REPLACE FUNCTION public.approve_admin_user(
  admin_id_to_approve uuid,
  approver_user_id uuid,
  grant_manage_products boolean DEFAULT false,
  grant_process_orders boolean DEFAULT false,
  grant_access_clients boolean DEFAULT false,
  grant_view_statistics boolean DEFAULT false
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  approver_admin_id uuid;
BEGIN
  -- Check if the approver is a super admin
  SELECT id INTO approver_admin_id
  FROM public.admin_users 
  WHERE user_id = approver_user_id 
    AND is_super_admin = true 
    AND status = 'approved';
    
  IF approver_admin_id IS NULL THEN
    RAISE EXCEPTION 'Only super admins can approve other admin users';
  END IF;
  
  -- Update the admin user to approved status with specified privileges
  UPDATE public.admin_users 
  SET 
    status = 'approved',
    can_manage_products = grant_manage_products,
    can_process_orders = grant_process_orders,
    can_access_clients = grant_access_clients,
    can_view_statistics = grant_view_statistics,
    approved_by = approver_admin_id,
    approved_at = now()
  WHERE id = admin_id_to_approve;
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error approving admin user: %', SQLERRM;
END;
$$;

-- Add RLS policies for admin_users table
DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Only existing admins can manage admin_users" ON public.admin_users;

CREATE POLICY "Approved admins can view admin_users" 
  ON public.admin_users 
  FOR SELECT 
  USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Super admins can manage admin_users" 
  ON public.admin_users 
  FOR ALL 
  USING (public.admin_has_privilege(auth.uid(), 'super_admin'));

-- Allow pending admins to view their own record
CREATE POLICY "Users can view their own admin record" 
  ON public.admin_users 
  FOR SELECT 
  USING (user_id = auth.uid());
