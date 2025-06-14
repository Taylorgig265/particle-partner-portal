import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from 'react';
import { Json } from '@/integrations/supabase/types';

export interface Product {
  id: string;
  created_at?: string;
  name: string;
  description?: string;
  full_description?: string;
  price: number;
  category?: string;
  image_url?: string;
  additional_images?: string[];
  in_stock?: boolean;
  is_featured?: boolean; // Added is_featured
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

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'completed' | 'quote_requested' | 'quote_sent' | 'approved' | 'rejected';

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
    message?: string;
  };
  shipping_address?: {
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

export interface QuoteItem {
  id: string;
  created_at?: string;
  product_id: string;
  product_name?: string;
  quantity: number;
  price_at_purchase?: number;
  contact_info: {
    name: string;
    email: string;
    phone: string;
    company: string;
    message: string;
  };
  status: string;
  product?: Product;
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

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (product: Omit<Product, 'id'>): Promise<void> => {
    try {
      const newProduct = { ...product, id: uuidv4(), is_featured: product.is_featured || false }; // Ensure is_featured has a default
      const { error } = await supabase
        .from('products')
        .insert([newProduct]);

      if (error) {
        console.error('Error adding product:', error);
        throw error;
      }
      
      await fetchProducts();
    } catch (error: any) {
      console.error('Error in addProduct:', error);
      throw new Error(error.message || "Could not add product");
    }
  };

  const updateProduct = async (product: Product): Promise<boolean> => {
    try {
      // Ensure is_featured is included in the update, defaulting to false if undefined
      const productToUpdate = { ...product, is_featured: product.is_featured || false };
      const { error } = await supabase
        .from('products')
        .update(productToUpdate)
        .eq('id', product.id);

      if (error) {
        console.error('Error updating product:', error);
        return false;
      }
      
      await fetchProducts();
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
      
      // Refresh products after deleting
      await fetchProducts();
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
    fetchProducts,
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

      const { data, error } = await supabase.rpc(
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

// Implementation for useGallery with required functions
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

  const addGalleryItem = async (item: Omit<GalleryItem, 'id' | 'created_at'>) => {
    setLoading(true);
    try {
      const { data, error: insertError } = await supabase
        .from('gallery')
        .insert([{ ...item, id: uuidv4() }])
        .select();
      
      if (insertError) throw new Error(insertError.message);
      await fetchGalleryItems(item.project_id);
      return data?.[0];
    } catch (err: any) {
      setError(err.message || 'Failed to add gallery item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteGalleryItem = async (id: string) => {
    setLoading(true);
    try {
      const { error: deleteError } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);
      
      if (deleteError) throw new Error(deleteError.message);
      await fetchGalleryItems();
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete gallery item');
      throw err;
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
    fetchGalleryItems,
    addGalleryItem,
    deleteGalleryItem
  };
};


// Implementation for useAdminOrders with required functions
export const useAdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (ordersError) throw new Error(ordersError.message);
      
      // Convert string status to OrderStatus type and assert contact_details type
      const typedOrders: Order[] = (ordersData || []).map(order => ({
        ...order,
        status: order.status as OrderStatus,
        contact_details: order.contact_details as Order['contact_details'], // Added type assertion
        shipping_address: order.shipping_address as Order['shipping_address'] // Added type assertion for consistency
      }));
      
      setOrders(typedOrders);
      
      // We cannot directly query the quotes table as it's not in Supabase types
      // Instead, let's create a workaround by using a generic type
      const { data: quotesData, error: quotesError } = await supabase
        .from('quotes')
        .select('*, products:product_id(*)');
      
      if (quotesError) throw new Error(quotesError.message);
      
      // Process quotes data to match our QuoteItem interface
      const processedQuotes: QuoteItem[] = (quotesData || []).map((quote: any) => ({
        id: quote.id,
        created_at: quote.created_at,
        product_id: quote.product_id,
        product_name: quote.products?.name,
        quantity: quote.quantity,
        price_at_purchase: quote.products?.price,
        contact_info: {
          name: quote.name,
          email: quote.email,
          phone: quote.phone,
          company: quote.company || '',
          message: quote.message || ''
        },
        status: quote.status || 'pending',
        product: quote.products
      }));
      
      setQuotes(processedQuotes);
    } catch (err: any) {
      setError(err.message || 'Failed to load orders and quotes');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
      
      if (error) throw new Error(error.message);
      
      // Refresh orders after update
      await fetchOrders();
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to update order status');
      return false;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    quotes,
    loading,
    error,
    fetchOrders,
    updateOrderStatus
  };
};

// Implementation for useAdminCustomers with required functions
export const useAdminCustomers = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*');
      
      if (fetchError) throw new Error(fetchError.message);
      setCustomers(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    error,
    fetchCustomers
  };
};
