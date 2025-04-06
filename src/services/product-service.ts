import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export interface Product {
  id: string;
  created_at?: string;
  name: string;
  description?: string;
  fullDescription?: string;
  price: number;
  category?: string;
  image_url?: string;
  additional_images?: string[];
  in_stock?: boolean;
}

export const useAdminProducts = () => {
  const getProducts = async (): Promise<Product[]> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      return data || [];
    } catch (error: any) {
      console.error('Error in getProducts:', error);
      throw new Error(error.message || "Could not retrieve products");
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>): Promise<void> => {
    try {
      const newProduct = { ...product, id: uuidv4() };
      const { error } = await supabase
        .from('products')
        .insert([newProduct]);

      if (error) {
        console.error('Error adding product:', error);
        throw error;
      }
    } catch (error: any) {
      console.error('Error in addProduct:', error);
      throw new Error(error.message || "Could not add product");
    }
  };

  const updateProduct = async (product: Product): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('products')
        .update(product)
        .eq('id', product.id);

      if (error) {
        console.error('Error updating product:', error);
        return false;
      }
      return true;
    } catch (error: any) {
      console.error('Error in updateProduct:', error);
      throw new Error(error.message || "Could not update product");
    }
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting product:', error);
        return false;
      }
      return true;
    } catch (error: any) {
      console.error('Error in deleteProduct:', error);
      throw new Error(error.message || "Could not delete product");
    }
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};

export const useQuoteRequest = () => {
  const submitQuoteRequest = async (
    productId: string,
    quantity: number,
    contactInfo: {
      name: string;
      email: string;
      phone: string;
      company: string;
      message: string;
    }
  ) => {
    try {
      const quoteRequest = {
        product_id: productId,
        quantity: quantity,
        name: contactInfo.name,
        email: contactInfo.email,
        phone: contactInfo.phone,
        company: contactInfo.company,
        message: contactInfo.message
      };

      // Use a proper type for the RPC function name
      const { data, error } = await supabase.rpc<any>(
        'submit_quote_request', 
        quoteRequest
      );

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error submitting quote request:', error);
      throw error;
    }
  };

  return { submitQuoteRequest };
};
