
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from 'react';

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

export interface CategoryWithProducts {
  name: string;
  products: Product[];
}

export interface GalleryItem {
  id: string;
  created_at?: string;
  title: string;
  description?: string;
  image_url: string;
  project_id?: string;
}

export interface Order {
  id: string;
  created_at?: string;
  status: OrderStatus;
  total_amount: number;
  user_id?: string;
  contact_details?: {
    name: string;
    email: string;
    phone: string;
    company?: string;
  };
  shipping_address?: {
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface QuoteItem {
  id: string;
  created_at?: string;
  product_id: string;
  product_name?: string;
  quantity: number;
  contact_info: {
    name: string;
    email: string;
    phone: string;
    company: string;
    message: string;
  };
  status: string;
}

export const getProducts = async (): Promise<Product[]> => {
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

export const getProductById = async (id?: string): Promise<Product | null> => {
  if (!id) return null;
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
    return data;
  } catch (error: any) {
    console.error('Error in getProductById:', error);
    throw new Error(error.message || "Could not retrieve product");
  }
};

export const useAdminProducts = () => {
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

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryWithProducts[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProducts();
        setProducts(data);
        
        // Group products by category
        const groupedProducts = data.reduce((acc, product) => {
          if (!product.category) return acc;
          
          if (!acc[product.category]) {
            acc[product.category] = {
              name: product.category,
              products: []
            };
          }
          
          acc[product.category].products.push(product);
          return acc;
        }, {} as Record<string, CategoryWithProducts>);
        
        setCategories(Object.values(groupedProducts));
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
    categories,
    loading,
    error,
  };
};

export const useProduct = (id?: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return {
    product,
    loading,
    error,
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

      // Use proper typing for the RPC call
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

// Mock implementation for useGallery to be replaced with actual implementation
export const useGallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGalleryItems = async (projectId?: string) => {
    setLoading(true);
    try {
      let query = supabase.from('gallery').select('*');
      
      if (projectId) {
        query = query.eq('project_id', projectId);
      }
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) throw new Error(fetchError.message);
      
      setItems(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load gallery items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  return {
    items,
    loading,
    error,
    fetchGalleryItems
  };
};

// Mock implementation for useAdminOrders to be replaced with actual implementation
export const useAdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data for orders
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setOrders([]);
      setQuotes([]);
      setLoading(false);
    }, 1000);
  }, []);

  return {
    orders,
    quotes,
    loading,
    error,
  };
};

// Mock implementation for useAdminCustomers to be replaced with actual implementation
export const useAdminCustomers = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data for customers
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCustomers([]);
      setLoading(false);
    }, 1000);
  }, []);

  return {
    customers,
    loading,
    error,
  };
};
