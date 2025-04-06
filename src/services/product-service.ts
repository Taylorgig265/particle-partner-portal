import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

export interface Product {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string | null;
  fullDescription: string | null;
  price: number;
  category: string | null;
  image_url: string | null;
  imageUrl?: string; //Legacy support
  additional_images: string[] | null;
  in_stock: boolean | null;
}

export interface GalleryItem {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string | null;
  image_url: string;
  project_id: string | null;
}

export interface QuoteRequest {
  id?: string;
  product_id: string;
  quantity: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  status?: string;
  created_at?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'quote_requested' | 'quote_sent' | 'approved' | 'rejected';

export interface Order {
  id: string;
  user_id: string | null;
  status: OrderStatus;
  total_amount: number;
  shipping_address: any;
  contact_details: any;
  created_at: string;
  updated_at: string;
}

export interface QuoteItem {
  id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  created_at: string;
  product?: Product;
}

export const useAdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map database fields to match our Product interface
      const mappedProducts = data?.map(item => ({
        ...item,
        fullDescription: item.full_description,
      })) || [];
      
      setProducts(mappedProducts);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Transform from our interface format to database format
      const dbFormatData = {
        name: productData.name,
        description: productData.description,
        full_description: productData.fullDescription,
        price: productData.price,
        category: productData.category,
        image_url: productData.image_url,
        additional_images: productData.additional_images,
        in_stock: productData.in_stock,
      };

      const { data, error } = await supabase
        .from('products')
        .insert(dbFormatData)
        .select()
        .single();

      if (error) throw error;
      
      // Map to our interface format
      const newProduct: Product = {
        ...data,
        fullDescription: data.full_description,
      };
      
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (err: any) {
      console.error('Error adding product:', err);
      throw err;
    }
  };

  const updateProduct = async (productData: Product) => {
    try {
      // Transform from our interface format to database format
      const { error } = await supabase
        .from('products')
        .update({
          name: productData.name,
          description: productData.description,
          full_description: productData.fullDescription,
          price: productData.price,
          category: productData.category,
          image_url: productData.image_url,
          additional_images: productData.additional_images,
          in_stock: productData.in_stock,
          updated_at: new Date().toISOString()
        })
        .eq('id', productData.id);

      if (error) throw error;
      
      setProducts(prev => 
        prev.map(p => p.id === productData.id ? {...p, ...productData} : p)
      );
      
      return true;
    } catch (err: any) {
      console.error('Error updating product:', err);
      return false;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProducts(prev => prev.filter(product => product.id !== id));
      return true;
    } catch (err: any) {
      console.error('Error deleting product:', err);
      return false;
    }
  };

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct
  };
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map database fields to match our Product interface
      const mappedProducts = data?.map(item => ({
        ...item,
        fullDescription: item.full_description,
      })) || [];
      
      setProducts(mappedProducts);
      
      // Group products by category
      const categoryMap: Record<string, any> = {};
      
      mappedProducts.forEach(product => {
        if (product.category) {
          if (!categoryMap[product.category]) {
            categoryMap[product.category] = {
              name: product.category,
              products: []
            };
          }
          categoryMap[product.category].products.push(product);
        }
      });
      
      // Convert to array
      setCategories(Object.values(categoryMap));
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    categories,
    loading,
    error
  };
};

export const useProduct = (id: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async (id: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      if (data) {
        // Map database fields to match our Product interface
        const mappedProduct: Product = {
          ...data,
          fullDescription: data.full_description,
        };
        
        setProduct(mappedProduct);
      } else {
        setProduct(null);
      }
    } catch (err: any) {
      console.error('Error fetching product:', err);
      setError(err.message || 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  return {
    product,
    loading,
    error
  };
};

// Helper function for getting a product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    
    if (data) {
      // Map database fields to match our Product interface
      return {
        ...data,
        fullDescription: data.full_description,
      };
    }
    
    return null;
  } catch (err) {
    console.error('Error fetching product by ID:', err);
    return null;
  }
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
      const quoteRequest: QuoteRequest = {
        product_id: productId,
        quantity,
        name: contactInfo.name,
        email: contactInfo.email,
        phone: contactInfo.phone,
        company: contactInfo.company,
        message: contactInfo.message
      };

      // Fix: Use direct fetch for quote_requests since it's not in the Supabase types
      // This is a temporary solution until we add quote_requests to the database
      const { data, error } = await supabase.rpc('submit_quote_request', quoteRequest);

      if (error) throw error;

      return data;
    } catch (err: any) {
      console.error("Error submitting quote request:", err);
      throw new Error(err.message || "Failed to submit quote request");
    }
  };

  return {
    submitQuoteRequest
  };
};

// Add these hooks to handle admin operations for orders and customers
export const useAdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Ensure that the status is a valid OrderStatus
      const typedOrders = data?.map(order => ({
        ...order,
        status: (order.status || 'pending') as OrderStatus,
      })) || [];
      
      setOrders(typedOrders);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  // Implementation for updating order status
  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);
        
      if (error) throw error;
      
      // Update local state to reflect the change
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? { ...order, status } : order
        )
      );
      
      return true;
    } catch (err) {
      console.error(`Error updating order status:`, err);
      return false;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    updateOrderStatus
  };
};

export const useAdminCustomers = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Implementation for fetching customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomers(data || []);
    } catch (err: any) {
      console.error('Error fetching customers:', err);
      setError(err.message || 'Failed to fetch customers');
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

export const useGallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGalleryItems = async (projectId?: string) => {
    try {
      setLoading(true);
      let query = supabase.from('gallery').select('*');
      
      if (projectId) {
        query = query.eq('project_id', projectId);
      }
      
      const { data, error: fetchError } = await query.order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      setItems(data as GalleryItem[] || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching gallery items:', err);
      setError(err.message || 'Failed to fetch gallery items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const addGalleryItem = async (itemData: Omit<GalleryItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // If project_id is "none" or empty, set it to null
      const dataToInsert = {
        ...itemData,
        project_id: itemData.project_id === "none" || !itemData.project_id ? null : itemData.project_id
      };

      const { data, error } = await supabase
        .from('gallery')
        .insert(dataToInsert)
        .select()
        .single();

      if (error) throw error;
      
      setItems(prev => [data as GalleryItem, ...prev]);
      return data as GalleryItem;
    } catch (err: any) {
      console.error('Error adding gallery item:', err);
      throw err;
    }
  };

  const deleteGalleryItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setItems(prev => prev.filter(item => item.id !== id));
      return true;
    } catch (err: any) {
      console.error('Error deleting gallery item:', err);
      return false;
    }
  };

  return {
    items,
    loading,
    error,
    fetchGalleryItems,
    addGalleryItem,
    deleteGalleryItem
  };
};
