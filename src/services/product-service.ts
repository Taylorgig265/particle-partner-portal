
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  in_stock?: boolean;
  fullDescription?: string;
  image_url?: string; // Adding for backward compatibility
}

export interface Order {
  id: string;
  customer: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total: number;
  items: number;
  created_at?: string;
  total_amount?: number;
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
}

export interface QuoteItem {
  id: string;
  product_name: string;
  quantity: number;
  price_quoted?: number;
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
}

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

// Simulated customers data
const customers: Customer[] = [
  {
    id: 'c101',
    name: 'Koche Community Hospital',
    email: 'contact@kochehospital.org',
    phone: '+265 1234 5678',
    company: 'Koche Community Hospital',
    orders_count: 5,
    total_spent: 28000,
    last_order_date: '2024-07-01'
  },
  {
    id: 'c102',
    name: 'Partners In Hope',
    email: 'orders@partnersinhope.org',
    phone: '+265 9876 5432',
    company: 'Partners In Hope',
    orders_count: 3,
    total_spent: 15500,
    last_order_date: '2024-07-05'
  },
  {
    id: 'c103',
    name: 'ABC Clinic',
    email: 'procurement@abcclinic.com',
    phone: '+265 5555 7777',
    company: 'ABC Clinic',
    orders_count: 10,
    total_spent: 45000,
    last_order_date: '2024-07-10'
  }
];

// Simulated quote requests
const quoteRequests: QuoteRequest[] = [
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
    status: 'quoted'
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
    status: 'pending'
  }
];

export const getProducts = async (): Promise<Product[]> => {
  // For backward compatibility, ensure each product has image_url property
  return products.map(product => ({
    ...product,
    image_url: product.imageUrl,
    in_stock: true,
    fullDescription: product.description
  }));
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  const product = products.find((product) => product.id === id);
  if (product) {
    return {
      ...product,
      image_url: product.imageUrl,
      in_stock: true,
      fullDescription: product.description
    };
  }
  return undefined;
};

export const getOrders = async (): Promise<Order[]> => {
  return orders;
};

export const getOrderById = async (id: string): Promise<Order | undefined> => {
  return orders.find((order) => order.id === id);
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
    // In a real app, this would submit to Supabase or another backend
    console.log('Submitting quote request for:', { productId, quantity, customerInfo });
    
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log('Quote request submitted successfully');
        resolve();
      }, 1000);
    });
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
    console.log('Updating product:', product);
    return true;
  };

  const deleteProduct = async (id: string) => {
    console.log('Deleting product:', id);
    return true;
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    console.log('Adding product:', product);
    return {
      ...product,
      id: `new-${Date.now()}`,
    };
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
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>(quoteRequests);
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
    console.log('Updating order status:', { id, status });
    return true;
  };

  const updateQuoteStatus = async (id: string, status: QuoteRequest['status']) => {
    console.log('Updating quote request status:', { id, status });
    return true;
  };

  return {
    orders,
    quoteRequests,
    loading,
    error,
    updateOrderStatus,
    updateQuoteStatus
  };
};

export const useAdminCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>(customers);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        // In a real app, this would be a call to Supabase or another backend
        // For now, we're using the mock data
        setCustomers(customers);
        setError(null);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError('Failed to load customers. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    error
  };
};
