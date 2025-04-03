import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string; 
  category: string;
  in_stock?: boolean;
  fullDescription?: string;
  image_url?: string;
  full_description?: string;
  updated_at?: string;
  created_at?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'quote_requested' | 'quote_sent' | 'approved' | 'rejected' | 'completed';

export interface ContactDetails {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  message?: string;
  product_id?: string;
  quantity?: number;
}

export interface Order {
  id: string;
  customer?: string;
  date?: string;
  status: OrderStatus;
  total?: number;
  items?: number;
  created_at?: string;
  total_amount?: number;
  contact_details?: Json | null;
  shipping_address?: Json | null;
  user_id?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  products: Product[];
}

export interface QuoteRequest {
  id: string;
  product_id: string;
  quantity: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  company: string;
  message: string;
  created_at: string;
  status: 'pending' | 'contacted' | 'quoted' | 'completed' | 'canceled';
  contact_details?: any;
  total_amount?: number;
}

export interface QuoteItem {
  id: string;
  product_name: string;
  quantity: number;
  price_quoted?: number;
  product?: any;
  price_at_purchase?: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  orders_count: number;
  total_spent: number;
  last_order_date: string;
  created_at?: string;
  avatar_url?: string;
}

// Helper function to safely extract values from Json type
export const getJsonValue = (json: Json | null, key: string): any => {
  if (!json) return null;
  
  if (typeof json === 'object' && json !== null && key in json) {
    return (json as Record<string, any>)[key];
  }
  
  return null;
};

export const getProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      console.error('Error fetching products from Supabase:', error);
      return []; // Return empty array instead of mock data
    }
    
    return data.map((product: any) => ({
      ...product,
      imageUrl: product.image_url,
      fullDescription: product.full_description
    }));
  } catch (err) {
    console.error('Unexpected error fetching products:', err);
    return []; // Return empty array instead of mock data
  }
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching product from Supabase:', error);
      return undefined;
    }
    
    return {
      ...data,
      imageUrl: data.image_url,
      fullDescription: data.full_description
    };
  } catch (err) {
    console.error('Unexpected error fetching product by ID:', err);
    return undefined;
  }
};

export const getOrders = async (): Promise<Order[]> => {
  try {
    console.log('Fetching orders from Supabase...');
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching orders from Supabase:', error);
      return []; 
    }
    
    if (!data || data.length === 0) {
      console.log('No orders found in Supabase');
      return []; 
    }
    
    console.log('Orders fetched from Supabase:', data.length);
    
    return data.map((order: any) => {
      const contactDetails = order.contact_details;
      const orderStatus = order.status as OrderStatus;
      
      return {
        ...order,
        status: orderStatus,
        customer: contactDetails && typeof contactDetails === 'object' ? getJsonValue(contactDetails, 'name') || "Unknown" : "Unknown",
        date: order.created_at,
        total: order.total_amount
      };
    });
  } catch (err) {
    console.error('Unexpected error fetching orders:', err);
    return []; 
  }
};

export const getOrderById = async (id: string): Promise<Order | undefined> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching order from Supabase:', error);
      return undefined;
    }
    
    // Ensure that status is cast to OrderStatus
    const orderStatus = data.status as OrderStatus;
    const contactDetails = data.contact_details;
    
    return {
      ...data,
      status: orderStatus,
      customer: contactDetails && typeof contactDetails === 'object' ? getJsonValue(contactDetails, 'name') || "Unknown" : "Unknown",
      date: data.created_at,
      total: data.total_amount
    };
  } catch (err) {
    console.error('Unexpected error fetching order by ID:', err);
    return undefined;
  }
};

// Hook for product categories for product display
export const useProducts = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const products = await getProducts();
        
        if (products.length === 0) {
          setError('No products found.');
          setCategories([]);
          return;
        }
        
        // Group products by category
        const categoryMap = products.reduce((acc, product) => {
          const categoryName = product.category || 'Uncategorized';
          
          if (!acc[categoryName]) {
            acc[categoryName] = {
              id: categoryName.toLowerCase().replace(/\s+/g, '-'),
              name: categoryName,
              description: `High-quality ${categoryName} equipment for medical facilities.`,
              products: []
            };
          }
          
          acc[categoryName].products.push(product);
          return acc;
        }, {} as Record<string, Category>);
        
        setCategories(Object.values(categoryMap));
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  return { categories, loading, error };
};

// Hook for quote requests
export const useQuoteRequest = () => {
  const submitQuoteRequest = async (
    productId: string, 
    quantity: number,
    customerInfo: {
      name: string;
      email: string;
      phone: string;
      company: string;
      message: string;
    }
  ) => {
    try {
      console.log('Submitting quote request with values:', {
        productId,
        quantity,
        customerInfo
      });
      
      // Get the product to calculate estimated total
      const product = await getProductById(productId);
      const estimatedTotal = product ? product.price * quantity : 0;
      
      // Create a new order with the quote request information
      // Setting user_id explicitly to null since it's now nullable
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          status: 'quote_requested',
          total_amount: estimatedTotal,
          user_id: null,
          contact_details: {
            name: customerInfo.name,
            email: customerInfo.email,
            phone: customerInfo.phone,
            company: customerInfo.company,
            message: customerInfo.message,
            product_id: productId,
            quantity: quantity
          }
        }])
        .select();

      if (error) {
        console.error('Error submitting quote request to Supabase:', error);
        throw new Error(`Failed to submit quote request: ${error.message}`);
      }
      
      console.log('Quote request submitted successfully:', data);
      return data;
    } catch (err) {
      console.error('Unexpected error submitting quote request:', err);
      throw err; // Rethrow to handle in the component
    }
  };

  return { submitQuoteRequest };
};

// Admin hooks
export const useAdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        setError(data.length === 0 ? 'No products found in the database.' : null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const updateProduct = async (product: Product) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: product.name,
          description: product.description,
          full_description: product.fullDescription,
          price: product.price,
          category: product.category,
          image_url: product.image_url || product.imageUrl,
          in_stock: product.in_stock
        })
        .eq('id', product.id)
        .select();

      if (error) {
        console.error('Error updating product in Supabase:', error);
        return false;
      }
      
      // Update local state
      setProducts(prevProducts => 
        prevProducts.map(p => p.id === product.id ? { ...product, updated_at: new Date().toISOString() } : p)
      );
      return true;
    } catch (err) {
      console.error('Unexpected error updating product:', err);
      return false;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting product from Supabase:', error);
        return false;
      }
      
      // Update local state
      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
      return true;
    } catch (err) {
      console.error('Unexpected error deleting product:', err);
      return false;
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: product.name,
          description: product.description,
          full_description: product.fullDescription,
          price: product.price,
          category: product.category,
          image_url: product.image_url || product.imageUrl,
          in_stock: product.in_stock || true
        }])
        .select();

      if (error) {
        console.error('Error adding product to Supabase:', error);
        return null;
      }
      
      const newProduct = {
        ...product,
        id: data[0].id,
        created_at: data[0].created_at,
        updated_at: data[0].updated_at
      };
      
      // Update local state
      setProducts(prevProducts => [...prevProducts, newProduct]);
      return newProduct;
    } catch (err) {
      console.error('Unexpected error adding product:', err);
      return null;
    }
  };

  return {
    products,
    loading,
    error,
    updateProduct,
    deleteProduct,
    addProduct
  };
};

export const useAdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log('Admin: Fetching orders from Supabase...');
      const data = await getOrders();
      console.log('Admin: Orders fetched:', data.length);
      setOrders(data);
      setError(data.length === 0 ? 'No orders found in the database.' : null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrderStatus = async (id: string, status: OrderStatus) => {
    try {
      console.log(`Updating order ${id} status to ${status}`);
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Error updating order status in Supabase:', error);
        return false;
      }
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => order.id === id ? { ...order, status } : order)
      );
      console.log('Order status updated successfully');
      return true;
    } catch (err) {
      console.error('Unexpected error updating order status:', err);
      return false;
    }
  };
  
  const fetchOrderDetails = async (id: string) => {
    try {
      console.log(`Fetching details for order ${id}`);
      // Get the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (orderError) {
        console.error('Error fetching order details from Supabase:', orderError);
        return { 
          order: undefined, 
          items: [] 
        };
      }

      console.log('Order details fetched:', order);
      const contactDetails = order.contact_details;
      
      // For the demo, generate order items based on contact_details
      const items: QuoteItem[] = [];
      
      if (contactDetails && typeof contactDetails === 'object') {
        const productId = getJsonValue(contactDetails, 'product_id');
        const quantity = getJsonValue(contactDetails, 'quantity');
        
        if (productId && quantity) {
          // Try to get the product details
          const product = await getProductById(productId);
          
          items.push({
            id: '1',
            product_name: product?.name || 'Product from contact details',
            quantity: Number(quantity),
            price_at_purchase: product?.price || (order.total_amount / Number(quantity)),
            product: {
              name: product?.name || 'Product from contact details',
              image_url: product?.image_url || '/placeholder.svg'
            }
          });
        }
      } else {
        // Fallback item if no details found
        items.push({
          id: '1',
          product_name: 'Unknown product',
          quantity: 1,
          price_at_purchase: order.total_amount,
          product: {
            name: 'Unknown product',
            image_url: '/placeholder.svg'
          }
        });
      }

      return {
        order,
        items
      };
    } catch (err) {
      console.error('Unexpected error fetching order details:', err);
      return { 
        order: undefined, 
        items: [] 
      };
    }
  };

  return {
    orders,
    loading,
    error,
    updateOrderStatus,
    fetchOrderDetails,
    fetchOrders // Export the fetchOrders function
  };
};

export const useAdminCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*');
          
        if (ordersError) {
          throw ordersError;
        }
        
        if (!ordersData || ordersData.length === 0) {
          setError('No customer data available.');
          setCustomers([]);
          setLoading(false);
          return;
        }
        
        // Extract unique customers from orders
        const customersMap = new Map<string, Customer>();
        
        ordersData.forEach((order: any) => {
          if (order.contact_details?.email) {
            const email = order.contact_details.email;
            
            if (!customersMap.has(email)) {
              const avatar_url = `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`;
              
              customersMap.set(email, {
                id: email, // Using email as ID for now
                name: order.contact_details.name || "Unknown",
                email: email,
                phone: order.contact_details.phone || "Unknown",
                company: order.contact_details.company || "Unknown",
                orders_count: 1,
                total_spent: Number(order.total_amount) || 0,
                last_order_date: order.created_at,
                created_at: order.created_at,
                avatar_url
              });
            } else {
              // Update existing customer
              const customer = customersMap.get(email)!;
              customer.orders_count += 1;
              customer.total_spent += Number(order.total_amount) || 0;
              
              // Update last order date if newer
              if (new Date(order.created_at) > new Date(customer.last_order_date)) {
                customer.last_order_date = order.created_at;
              }
            }
          }
        });
        
        setCustomers(Array.from(customersMap.values()));
        setError(customersMap.size === 0 ? 'No customer data available.' : null);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError('Failed to load customers. Please try again.');
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomers();
  }, []);
  
  const fetchCustomerOrders = async (customerId: string) => {
    try {
      // Since we're using email as customer ID
      const customer = customers.find(c => c.id === customerId);
      
      if (customer?.email) {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .filter('contact_details->email', 'eq', customer.email);
          
        if (error) {
          console.error('Error fetching customer orders from Supabase:', error);
          return [];
        }
        
        return data.map((order: any) => ({
          ...order,
          customer: order.contact_details?.name || "Unknown",
          date: order.created_at,
          total: order.total_amount
        }));
      }
      
      return [];
    } catch (err) {
      console.error('Unexpected error fetching customer orders:', err);
      return [];
    }
  };

  return {
    customers,
    loading,
    error,
    fetchCustomerOrders
  };
};
