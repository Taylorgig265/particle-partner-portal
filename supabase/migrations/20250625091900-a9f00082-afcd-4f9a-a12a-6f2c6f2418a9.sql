
-- First, let's check the current foreign key constraints on admin_users table
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name='admin_users';

-- Drop the problematic foreign key constraint if it exists
ALTER TABLE public.admin_users DROP CONSTRAINT IF EXISTS admin_users_user_id_fkey;

-- Recreate the foreign key constraint correctly to reference auth.users
ALTER TABLE public.admin_users 
ADD CONSTRAINT admin_users_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Also drop the problematic approved_by foreign key and recreate it properly
ALTER TABLE public.admin_users DROP CONSTRAINT IF EXISTS admin_users_approved_by_fkey;

-- The approved_by should reference the id column of admin_users table, not user_id
ALTER TABLE public.admin_users 
ADD CONSTRAINT admin_users_approved_by_fkey 
FOREIGN KEY (approved_by) REFERENCES public.admin_users(id);
