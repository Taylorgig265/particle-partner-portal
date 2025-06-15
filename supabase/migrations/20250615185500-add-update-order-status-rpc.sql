
CREATE OR REPLACE FUNCTION public.update_order_status(order_id_param uuid, new_status text)
RETURNS void AS $$
BEGIN
  UPDATE public.orders
  SET status = new_status
  WHERE id = order_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
