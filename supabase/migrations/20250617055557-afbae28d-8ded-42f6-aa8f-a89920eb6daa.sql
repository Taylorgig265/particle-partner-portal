
-- Add new columns to existing profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS billing_address jsonb;

-- Update quotes table to link to authenticated users
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Add quote tracking fields
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS admin_notes text;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS quoted_price numeric;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS quoted_at timestamp with time zone;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS expires_at timestamp with time zone;

-- Enable RLS on quotes if not already enabled
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their own quotes" ON public.quotes;
DROP POLICY IF EXISTS "Users can insert their own quotes" ON public.quotes;
DROP POLICY IF EXISTS "Admins can view all quotes" ON public.quotes;

-- Create policies for quotes
CREATE POLICY "Users can view their own quotes" 
  ON public.quotes 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quotes" 
  ON public.quotes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Admin policies for quotes (for authenticated admin users)
CREATE POLICY "Admins can view all quotes" 
  ON public.quotes 
  FOR ALL 
  USING (true);

-- Enable RLS on orders if not already enabled
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;

-- Create policies for orders
CREATE POLICY "Users can view their own orders" 
  ON public.orders 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Admin policies for orders
CREATE POLICY "Admins can view all orders" 
  ON public.orders 
  FOR ALL 
  USING (true);

-- Create admin roles table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  created_at timestamp with time zone DEFAULT now(),
  is_super_admin boolean DEFAULT false
);

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists and recreate it
DROP POLICY IF EXISTS "Only admins can access admin_users" ON public.admin_users;

-- Create policy for admin_users
CREATE POLICY "Only admins can access admin_users" 
  ON public.admin_users 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au 
      WHERE au.user_id = auth.uid()
    )
  );

-- Update the submit_quote_request function to work with authenticated users
CREATE OR REPLACE FUNCTION public.submit_quote_request(
  product_id uuid, 
  quantity integer, 
  message text DEFAULT ''
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_quote_id UUID;
    user_profile RECORD;
BEGIN
    -- Check if user is authenticated
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'User must be authenticated to submit quote requests';
    END IF;
    
    -- Get user profile data
    SELECT * INTO user_profile 
    FROM public.profiles 
    WHERE id = auth.uid();
    
    IF user_profile IS NULL THEN
        RAISE EXCEPTION 'User profile not found';
    END IF;

    -- Create a new quote request
    INSERT INTO quotes (
        user_id,
        product_id,
        quantity,
        name,
        email,
        phone,
        company,
        message,
        status,
        created_at
    ) VALUES (
        auth.uid(),
        product_id,
        quantity,
        user_profile.name,
        user_profile.email,
        user_profile.phone,
        user_profile.company,
        message,
        'pending',
        NOW()
    )
    RETURNING id INTO new_quote_id;
    
    RETURN new_quote_id;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error submitting quote request: %', SQLERRM;
END;
$$;
