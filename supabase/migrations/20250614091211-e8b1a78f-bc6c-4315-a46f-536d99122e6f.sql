
-- Add the is_featured column to the products table
ALTER TABLE public.products
ADD COLUMN is_featured BOOLEAN DEFAULT FALSE;

-- Update existing products to have a default value if you wish
-- For example, to set all existing products to not be featured:
-- UPDATE public.products SET is_featured = FALSE WHERE is_featured IS NULL;
-- Or, if you want to feature all existing products by default (less likely):
-- UPDATE public.products SET is_featured = TRUE WHERE is_featured IS NULL;
-- For now, we'll rely on the DEFAULT FALSE, new products will be false, existing will be NULL until set.
-- A better approach might be to ensure it's NOT NULL and has a default.

-- Let's ensure it's not null and defaults to false for clarity
ALTER TABLE public.products
ALTER COLUMN is_featured SET DEFAULT FALSE,
ALTER COLUMN is_featured SET NOT NULL;

-- If there are existing rows with NULL for is_featured, update them first
UPDATE public.products SET is_featured = FALSE WHERE is_featured IS NULL;

