
-- Create the update_order_status function if it doesn't exist
CREATE OR REPLACE FUNCTION public.update_order_status(order_id_param uuid, new_status text)
RETURNS void AS $$
BEGIN
  UPDATE public.orders
  SET status = new_status, updated_at = now()
  WHERE id = order_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
