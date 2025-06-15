
-- This function will automatically update the `updated_at` column for any table it is a trigger for.
CREATE OR REPLACE FUNCTION public.moddatetime()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- This trigger will call the function whenever a row in the `orders` table is updated.
CREATE TRIGGER handle_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE PROCEDURE public.moddatetime();

-- For consistency, we'll also apply this to other tables with an `updated_at` column.
CREATE TRIGGER handle_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE PROCEDURE public.moddatetime();

CREATE TRIGGER handle_gallery_updated_at
BEFORE UPDATE ON public.gallery
FOR EACH ROW
EXECUTE PROCEDURE public.moddatetime();

CREATE TRIGGER handle_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE PROCEDURE public.moddatetime();

CREATE TRIGGER handle_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE PROCEDURE public.moddatetime();
