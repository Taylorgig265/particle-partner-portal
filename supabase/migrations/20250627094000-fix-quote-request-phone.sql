
-- Create a new function that handles quote requests with explicit contact info
CREATE OR REPLACE FUNCTION public.submit_quote_request_with_contact(
  product_id uuid, 
  quantity integer, 
  message text DEFAULT '',
  phone text DEFAULT '',
  company text DEFAULT ''
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

    -- Ensure phone is not empty
    IF phone IS NULL OR trim(phone) = '' THEN
        RAISE EXCEPTION 'Phone number is required for quote requests';
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
        COALESCE(user_profile.name, 'N/A'),
        COALESCE(user_profile.email, 'N/A'),
        trim(phone),
        COALESCE(NULLIF(trim(company), ''), user_profile.company, ''),
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
