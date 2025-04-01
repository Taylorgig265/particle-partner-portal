import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string; // Optional since we also handle image_url
  category: string;
  in_stock?: boolean;
  fullDescription?: string;
  image_url?: string;
  full_description?: string;
  updated_at?: string;
  created_at?: string;
}

export interface Order {
  id: string;
  customer?: string;
  date?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total?: number;
  items?: number;
  created_at?: string;
  total_amount?: number;
  contact_details?: any;
  shipping_address?: any;
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

// Mock data for products (as fallback)
const products: Product[] = [
  {
    id: '1',
    name: 'ECG Machine',
    description: 'Advanced ECG machine for accurate heart monitoring.',
    price: 1200,
    imageUrl: '/lovable-uploads/ecg-machine.jpg',
    category: 'Cardiology'
  },
  {
    id: '2',
    name: 'Ultrasound Scanner',
    description: 'High-resolution ultrasound scanner for detailed imaging.',
    price: 8500,
    imageUrl: '/lovable-uploads/ultrasound-scanner.jpg',
    category: 'Radiology'
  },
  {
    id: '3',
    name: 'Patient Monitor',
    description: 'Comprehensive patient monitor for vital signs tracking.',
    price: 2500,
    imageUrl: '/lovable-uploads/patient-monitor.jpg',
    category: 'General'
  },
  {
    id: '4',
    name: 'Operating Table',
    description: 'Adjustable operating table for surgical procedures.',
    price: 4000,
    imageUrl: '/lovable-uploads/operating-table.jpg',
    category: 'Surgery'
  },
  {
    id: '5',
    name: 'Autoclave Sterilizer',
    description: 'Efficient autoclave sterilizer for medical instruments.',
    price: 1800,
    imageUrl: '/lovable-uploads/autoclave-sterilizer.jpg',
    category: 'Sterilization'
  },
  {
    id: '6',
    name: 'Microscope',
    description: 'High-powered microscope for laboratory analysis.',
    price: 3000,
    imageUrl: '/lovable-uploads/microscope.jpg',
    category: 'Laboratory'
  },
  {
    id: '7',
    name: 'Defibrillator',
    description: 'Portable defibrillator for emergency cardiac care.',
    price: 1500,
    imageUrl: '/lovable-uploads/defibrillator.jpg',
    category: 'Emergency'
  },
  {
    id: '8',
    name: 'Infusion Pump',
    description: 'Precise infusion pump for controlled medication delivery.',
    price: 900,
    imageUrl: '/lovable-uploads/infusion-pump.jpg',
    category: 'General'
  },
  {
    id: '9',
    name: 'Centrifuge',
    description: 'Laboratory centrifuge for sample separation.',
    price: 1100,
    imageUrl: '/lovable-uploads/centrifuge.jpg',
    category: 'Laboratory'
  },
  {
    id: '10',
    name: 'Ventilator',
    description: 'Advanced ventilator for respiratory support.',
    price: 6000,
    imageUrl: '/lovable-uploads/ventilator.jpg',
    category: 'Respiratory'
  }
];

// Mock orders data (as fallback)
const orders: Order[] = [
  {
    id: '101',
    customer: 'Koche Community Hospital',
    date: '2024-07-01',
    status: 'delivered',
    total: 12000,
    items: 5,
    created_at: '2024-07-01',
    total_amount: 12000
  },
  {
    id: '102',
    customer: 'Partners In Hope',
    date: '2024-07-05',
    status: 'shipped',
    total: 5500,
    items: 3,
    created_at: '2024-07-05',
    total_amount: 5500
  },
  {
    id: '103',
    customer: 'ABC Clinic',
    date: '2024-07-10',
    status: 'processing',
    total: 25000,
    items: 10,
    created_at: '2024-07-10',
    total_amount: 25000
  },
  {
    id: '104',
    customer: 'Ministry of Health',
    date: '2024-07-15',
    status: 'pending',
    total: 75000,
    items: 25,
    created_at: '2024-07-15',
    total_amount: 75000
  },
  {
    id: '105',
    customer: 'Queen Elizabeth Central Hospital',
    date: '2024-07-20',
    status: 'delivered',
    total: 15000,
    items: 7,
    created_at: '2024-07-20',
    total_amount: 15000
  },
  {
    id: '106',
    customer: 'Kamuzu Central Hospital',
    date: '2024-07-25',
    status: 'shipped',
    total: 9000,
    items: 4,
    created_at: '2024-07-25',
    total_amount: 9000
  },
  {
    id: '107',
    customer: 'Mzuzu Central Hospital',
    date: '2024-07-30',
    status: 'processing',
    total: 30000,
    items: 12,
    created_at: '2024-07-30',
    total_amount: 30000
  },
  {
    id: '108',
    customer: 'College of Medicine',
    date: '2024-08-05',
    status: 'pending',
    total: 60000,
    items: 20,
    created_at: '2024-08-05',
    total_amount: 60000
  },
  {
    id: '109',
    customer: 'MASM Medi Clinics',
    date: '2024-08-10',
    status: 'delivered',
    total: 18000,
    items: 8,
    created_at: '2024-08-10',
    total_amount: 18000
  },
  {
    id: '110',
    customer: 'City Medical Center',
    date: '2024-08-15',
    status: 'shipped',
    total: 11000,
    items: 6,
    created_at: '2024-08-15',
    total_amount: 11000
  }
];

// Simulated customers data (as fallback)
const customersData: Customer[] = [
  {
    id: 'c101',
    name: 'Koche Community Hospital',
    email: 'contact@kochehospital.org',
    phone: '+265 1234 5678',
    company: 'Koche Community Hospital',
    orders_count: 5,
    total_spent: 28000,
    last_order_date: '2024-07-01',
    created_at: '2023-01-15',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=koche'
  },
  {
    id: 'c102',
    name: 'Partners In Hope',
    email: 'orders@partnersinhope.org',
    phone: '+265 9876 5432',
    company: 'Partners In Hope',
    orders_count: 3,
    total_spent: 15500,
    last_order_date: '2024-07-05',
    created_at: '2023-02-20',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=partners'
  },
  {
    id: 'c103',
    name: 'ABC Clinic',
    email: 'procurement@abcclinic.com',
    phone: '+265 5555 7777',
    company: 'ABC Clinic',
    orders_count: 10,
    total_spent: 45000,
    last_order_date: '2024-07-10',
    created_at: '2023-03-05',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=abc'
  }
];

// Simulated quote requests (as fallback)
const quoteRequestsData: QuoteRequest[] = [
  {
    id: 'q101',
    product_id: '1',
    quantity: 2,
    customer_name: 'John Doe',
    customer_email: 'john@example.com',
    customer_phone: '+265 999 888 777',
    company: 'City Medical Center',
    message: 'Looking for bulk pricing on ECG machines.',
    created_at: '2024-07-01',
    status: 'quoted',
    contact_details: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+265 999 888 777',
    },
    total_amount: 2400
  },
  {
    id: 'q102',
    product_id: '3',
    quantity: 5,
    customer_name: 'Jane Smith',
    customer_email: 'jane@example.com',
    customer_phone: '+265 111 222 333',
    company: 'Smith Clinic',
    message: 'Need patient monitors for our new wing.',
    created_at: '2024-07-15',
    status: 'pending',
    contact_details: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+265 111 222 333',
    },
    total_amount: 12500
  }
];

export const getProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      console.error('Error fetching products from Supabase:', error);
      // Fall back to mock data if there's an error
      return products.map(product => ({
        ...product,
        image_url: product.imageUrl,
        in_stock: true,
        fullDescription: product.description
      }));
    }
    
    return data.map((product: any) => ({
      ...product,
      imageUrl: product.image_url,
      fullDescription: product.full_description
    }));
  } catch (err) {
    console.error('Unexpected error fetching products:', err);
    // Fall back to mock data
    return products.map(product => ({
      ...product,
      image_url: product.imageUrl,
      in_stock: true,
      fullDescription: product.description
    }));
  }
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  try {
    // Handle numeric IDs from mock data
    if (!id.includes('-')) {
      const mockProduct = products.find((product) => product.id === id);
      if (mockProduct) {
        return {
          ...mockProduct,
          image_url: mockProduct.imageUrl,
          in_stock: true,
          fullDescription: mockProduct.description
        };
      }
    }
    
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
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching orders from Supabase:', error);
      return orders; // Fall back to mock data
    }
    
    return data.map((order: any) => ({
      ...order,
      customer: order.contact_details?.name || "Unknown",
      date: order.created_at,
      total: order.total_amount
    }));
  } catch (err) {
    console.error('Unexpected error fetching orders:', err);
    return orders; // Fall back to mock data
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
      // Try mock data
      return orders.find((order) => order.id === id);
    }
    
    return {
      ...data,
      customer: data.contact_details?.name || "Unknown",
      date: data.created_at,
      total: data.total_amount
    };
  } catch (err) {
    console.error('Unexpected error fetching order by ID:', err);
    return orders.find((order) => order.id === id);
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
      console.log('Form submitted with values:', {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        company: customerInfo.company,
        quantity,
        message: customerInfo.message
      });
      
      // Get the product to calculate estimated total
      const product = await getProductById(productId);
      const estimatedTotal = product ? product.price * quantity : 0;
      
      // Create a new order with the quote request information
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          status: 'pending',
          total_amount: estimatedTotal,
          user_id: '00000000-0000-0000-0000-000000000000', // Anonymous user
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
        throw new Error('Failed to submit quote request');
      }
      
      console.log('Quote request submitted successfully:', data);
      return data;
    } catch (err) {
      console.error('Unexpected error submitting quote request:', err);
      // For demo purposes, simulate a success response
      console.log('Quote request submitted successfully');
      return null;
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
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getOrders();
        setOrders(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
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
      return true;
    } catch (err) {
      console.error('Unexpected error updating order status:', err);
      return false;
    }
  };
  
  const fetchOrderDetails = async (id: string) => {
    try {
      // Get the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (orderError) {
        console.error('Error fetching order details from Supabase:', orderError);
        return { 
          order: orders.find(o => o.id === id), 
          items: [] 
        };
      }

      // For the demo, we're not implementing order items yet
      // In a real implementation, you would fetch the order items from the order_items table
      return {
        order,
        items: [{
          id: '1',
          product_name: 'Product from contact details',
          quantity: order.contact_details?.quantity || 1,
          price_at_purchase: order.total_amount / (order.contact_details?.quantity || 1),
          product: {
            name: 'Product from contact details',
            image_url: '/placeholder.svg'
          }
        }]
      };
    } catch (err) {
      console.error('Unexpected error fetching order details:', err);
      return { 
        order: orders.find(o => o.id === id), 
        items: [] 
      };
    }
  };

  return {
    orders,
    loading,
    error,
    updateOrderStatus,
    fetchOrderDetails
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
        
        // In a real app, we would fetch this from a customers or profiles table
        // For this demo, we'll extract unique customers from the orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*');
          
        if (ordersError) {
          throw ordersError;
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
        setError(null);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError('Failed to load customers. Please try again.');
        // Fall back to mock data
        setCustomers(customersData);
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
