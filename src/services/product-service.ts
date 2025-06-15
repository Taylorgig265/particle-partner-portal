import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect, useCallback } from 'react'; // Added useCallback
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

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
      setProducts([]); // Clear products on error
    } finally {
      setLoading(false);
    }
  }, []); // Dependencies: setLoading, setError, setProducts are stable

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = useCallback(async (product: Omit<Product, 'id'>): Promise<void> => {
    try {
      const newProduct = { ...product, id: uuidv4(), is_featured: product.is_featured || false };
      const { error: insertError } = await supabase
        .from('products')
        .insert([newProduct]);

      if (insertError) {
        console.error('Error adding product:', insertError);
        throw insertError;
      }
      await fetchProducts();
    } catch (error: any) {
      console.error('Error in addProduct:', error);
      throw new Error(error.message || "Could not add product");
    }
  }, [fetchProducts]);

  const updateProduct = useCallback(async (product: Product): Promise<boolean> => {
    try {
      const productToUpdate = { ...product, is_featured: product.is_featured || false };
      const { error: updateError } = await supabase
        .from('products')
        .update(productToUpdate)
        .eq('id', product.id);

      if (updateError) {
        console.error('Error updating product:', updateError);
        return false;
      }
      await fetchProducts();
      return true;
    } catch (error: any) {
      console.error('Error in updateProduct:', error);
      throw new Error(error.message || "Could not update product");
    }
  }, [fetchProducts]);

  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('Error deleting product:', deleteError);
        return false;
      }
      await fetchProducts();
      return true;
    } catch (error: any) {
      console.error('Error in deleteProduct:', error);
      throw new Error(error.message || "Could not delete product");
    }
  }, [fetchProducts]);

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
    const fetchProductsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProducts();
        setProducts(data);
        
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
        setProducts([]); // Clear products on error
        setCategories([]); // Clear categories on error
      } finally {
        setLoading(false);
      }
    };

    fetchProductsData();
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
    const fetchProductData = async () => {
      if (!id) {
        setLoading(false);
        setProduct(null); // Ensure product is null if no id
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load product');
        setProduct(null); // Clear product on error
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  return {
    product,
    loading,
    error,
  };
};

export const useQuoteRequest = () => {
  const submitQuoteRequest = useCallback(async (
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
  }, []); // No dependencies that change

  return { submitQuoteRequest };
};

export const useGallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGalleryItems = useCallback(async (projectId?: string) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase.from('gallery').select('*');
      if (projectId) {
        query = query.eq('project_id', projectId);
      }
      // Add default ordering, e.g., by creation date
      const { data, error: fetchError } = await query.order('created_at', { ascending: false });
      
      if (fetchError) throw new Error(fetchError.message);
      setItems(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load gallery items');
      setItems([]); // Clear items on error
    } finally {
      setLoading(false);
    }
  }, []); // setLoading, setItems, setError are stable

  const addGalleryItem = useCallback(async (item: Omit<GalleryItem, 'id' | 'created_at'>) => {
    try {
      const { data, error: insertError } = await supabase
        .from('gallery')
        .insert([{ ...item, id: uuidv4() }])
        .select();
      
      if (insertError) throw new Error(insertError.message);
      await fetchGalleryItems(item.project_id); // Refresh items for the specific project
      return data?.[0];
    } catch (err: any) {
      console.error('Error in addGalleryItem:', err);
      throw err;
    }
  }, [fetchGalleryItems]);

  const deleteGalleryItem = useCallback(async (id: string) => {
    // To refresh correctly, we might need to know the current project context,
    // or always refresh all. For simplicity, refreshing all for now.
    // AdminGallery.tsx might depend on this behavior.
    try {
      const { error: deleteError } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);
      
      if (deleteError) throw new Error(deleteError.message);
      await fetchGalleryItems(); // Refresh all gallery items
      return true;
    } catch (err: any) {
      console.error('Error in deleteGalleryItem:', err);
      throw err;
    }
  }, [fetchGalleryItems]);

  useEffect(() => {
    fetchGalleryItems(); // Initial fetch for all items
  }, [fetchGalleryItems]); // Depend on memoized fetchGalleryItems

  return {
    items,
    loading,
    error,
    fetchGalleryItems,
    addGalleryItem,
    deleteGalleryItem
  };
};

export const useAdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (ordersError) throw new Error(ordersError.message);
      
      const typedOrders: Order[] = (ordersData || []).map(order => ({
        ...order,
        status: order.status as OrderStatus,
        contact_details: order.contact_details as Order['contact_details'],
        shipping_address: order.shipping_address as Order['shipping_address']
      }));
      setOrders(typedOrders);
      
      const { data: quotesData, error: quotesError } = await supabase
        .from('quotes')
        .select('*, products:product_id(*)'); // products:product_id(*) will embed product details
      
      if (quotesError) throw new Error(quotesError.message);
      
      const processedQuotes: QuoteItem[] = (quotesData || []).map((quote: any) => ({
        id: quote.id,
        created_at: quote.created_at,
        product_id: quote.product_id,
        product_name: quote.products?.name,
        quantity: quote.quantity,
        price_at_purchase: quote.products?.price, // This assumes price is on product, adjust if needed
        contact_info: {
          name: quote.name,
          email: quote.email,
          phone: quote.phone,
          company: quote.company || '',
          message: quote.message || ''
        },
        status: quote.status || 'pending',
        product: quote.products // Store the embedded product object
      }));
      setQuotes(processedQuotes);

    } catch (err: any) {
      setError(err.message || 'Failed to load orders and quotes');
      setOrders([]); // Clear on error
      setQuotes([]); // Clear on error
    } finally {
      setLoading(false);
    }
  }, []); // Dependencies are stable state setters

  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus): Promise<void> => {
    const { data, error: updateError } = await supabase
      .from('orders')
      .update({ status }) // The `updated_at` field is now handled by the database trigger.
      .eq('id', orderId)
      .select('*')
      .single();

    if (updateError) {
      console.error('Error updating order status:', updateError);
      throw new Error(updateError.message);
    }

    if (!data) {
      throw new Error("Order not found or update failed to return data.");
    }
    
    setOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.id === orderId) {
          return {
            ...data,
            status: data.status as OrderStatus,
            contact_details: data.contact_details as Order['contact_details'],
            shipping_address: data.shipping_address as Order['shipping_address']
          };
        }
        return order;
      })
    );
  }, [setOrders]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    quotes,
    loading,
    error,
    fetchOrders,
    updateOrderStatus
  };
};

export const useAdminCustomers = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch registered users from profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, name, created_at');

      if (profilesError) throw new Error(profilesError.message);

      // Fetch contacts from orders to identify guest customers
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('contact_details, created_at')
        .not('contact_details', 'is', null);

      if (ordersError) throw new Error(ordersError.message);
      
      const allCustomers = new Map<string, any>();

      // Process registered users
      if (profilesData) {
        profilesData.forEach(p => {
          if (p.email) {
            allCustomers.set(p.email, {
              id: p.id,
              email: p.email,
              name: p.name || (p as any).full_name || 'N/A',
              phone: null, // Initialize phone for registered users
              source: 'Registered',
              created_at: p.created_at,
            });
          }
        });
      }

      // Process guest customers from orders and enrich registered users
      if (ordersData) {
        ordersData.forEach(o => {
          const contact = o.contact_details as any;
          if (contact && contact.email) {
            const existingCustomer = allCustomers.get(contact.email);
            if (existingCustomer) {
              // If user is registered, just update phone if it's missing
              if (!existingCustomer.phone && contact.phone) {
                existingCustomer.phone = contact.phone;
              }
            } else {
              // If user is not registered, add as guest
              allCustomers.set(contact.email, {
                id: `guest:${contact.email}`, // Create a stable unique ID
                email: contact.email,
                name: contact.name || 'N/A',
                phone: contact.phone || null,
                source: 'Guest',
                created_at: o.created_at,
              });
            }
          }
        });
      }

      // Sort customers by most recent activity
      const customerList = Array.from(allCustomers.values()).sort((a,b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      setCustomers(customerList);

    } catch (err: any) {
      setError(err.message || 'Failed to load customers');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return {
    customers,
    loading,
    error,
    fetchCustomers
  };
};
