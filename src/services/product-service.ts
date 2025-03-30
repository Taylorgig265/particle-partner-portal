
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

export interface Product {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  price: number;
  image_url: string;
  category: string;
  in_stock: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  products: Product[];
}

export interface Order {
  id: string;
  user_id: string;
  status: string;
  total_amount: number;
  shipping_address: any;
  created_at: string;
  updated_at: string;
  user?: {
    name: string;
    email: string;
  };
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  created_at: string;
  product?: Product;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
  orders_count?: number;
  total_spent?: number;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('category');
      
      if (error) throw new Error(error.message);
      
      if (data) {
        setProducts(data as Product[]);
        
        // Group products by category
        const categoryMap = new Map<string, Product[]>();
        
        data.forEach((product: Product) => {
          if (product.category) {
            if (!categoryMap.has(product.category)) {
              categoryMap.set(product.category, []);
            }
            categoryMap.get(product.category)!.push(product);
          }
        });
        
        // Convert map to category array
        const categoryArray: Category[] = Array.from(categoryMap.entries()).map(([categoryName, products]) => {
          const categoryId = categoryName.toLowerCase().replace(/\s+/g, '-');
          return {
            id: categoryId,
            name: categoryName,
            description: getCategoryDescription(categoryName),
            products: products
          };
        });
        
        setCategories(categoryArray);
      }
    } catch (err: any) {
      console.error("Error fetching products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Return category description based on category name
  const getCategoryDescription = (category: string): string => {
    switch (category) {
      case 'Diagnostic Equipment':
        return 'Advanced diagnostic equipment for accurate clinical assessments and patient monitoring.';
      case 'Laboratory Equipment':
        return 'Precision laboratory equipment for research, testing, and analytical applications.';
      case 'Healthcare Equipment':
        return 'Essential medical supplies and equipment for healthcare facilities and patient care.';
      case 'Industrial Equipment':
        return 'Reliable industrial equipment for manufacturing, production, and quality control.';
      default:
        return `High-quality ${category} for medical and industrial applications.`;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, categories, loading, error, fetchProducts };
};

// Admin functions
export const useAdminProducts = () => {
  const { products, categories, loading, error, fetchProducts } = useProducts();
  
  const addProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select();
      
      if (error) throw new Error(error.message);
      
      toast({
        title: "Product added",
        description: `${product.name} has been added successfully.`,
      });
      
      fetchProducts();
      return data;
    } catch (err: any) {
      toast({
        title: "Error adding product",
        description: err.message,
        variant: "destructive",
      });
      console.error("Error adding product:", err);
      throw err;
    }
  };
  
  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) throw new Error(error.message);
      
      toast({
        title: "Product updated",
        description: `Product has been updated successfully.`,
      });
      
      fetchProducts();
      return data;
    } catch (err: any) {
      toast({
        title: "Error updating product",
        description: err.message,
        variant: "destructive",
      });
      console.error("Error updating product:", err);
      throw err;
    }
  };
  
  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw new Error(error.message);
      
      toast({
        title: "Product deleted",
        description: "Product has been deleted successfully.",
      });
      
      fetchProducts();
    } catch (err: any) {
      toast({
        title: "Error deleting product",
        description: err.message,
        variant: "destructive",
      });
      console.error("Error deleting product:", err);
      throw err;
    }
  };
  
  return {
    products,
    categories,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct
  };
};

export const useAdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Get orders with joined profile information
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles:user_id (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw new Error(error.message);
      
      if (data) {
        // Format the orders with nested profile data
        const formattedOrders = data.map((order: any) => ({
          ...order,
          user: order.profiles,
        }));
        
        setOrders(formattedOrders);
      }
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchOrderDetails = async (orderId: string) => {
    try {
      // Get order items with product details
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          *,
          products:product_id (*)
        `)
        .eq('order_id', orderId);
      
      if (error) throw new Error(error.message);
      
      if (data) {
        // Format order items with nested product data
        return data.map((item: any) => ({
          ...item,
          product: item.products,
        }));
      }
      
      return [];
    } catch (err: any) {
      console.error("Error fetching order details:", err);
      throw err;
    }
  };
  
  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select();
      
      if (error) throw new Error(error.message);
      
      toast({
        title: "Order updated",
        description: `Order status has been updated to ${status}.`,
      });
      
      fetchOrders();
      return data;
    } catch (err: any) {
      toast({
        title: "Error updating order",
        description: err.message,
        variant: "destructive",
      });
      console.error("Error updating order:", err);
      throw err;
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
    fetchOrderDetails,
    updateOrderStatus,
  };
};

export const useAdminCustomers = () => {
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      
      // Get profiles with order statistics
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw new Error(error.message);
      
      if (data) {
        // Fetch order counts and total spent for each customer
        const customersWithStats = await Promise.all(
          data.map(async (customer) => {
            const { count: ordersCount } = await supabase
              .from('orders')
              .select('id', { count: 'exact', head: false })
              .eq('user_id', customer.id);
            
            const { data: ordersData } = await supabase
              .from('orders')
              .select('total_amount')
              .eq('user_id', customer.id);
              
            const totalSpent = ordersData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
            
            return {
              ...customer,
              orders_count: ordersCount || 0,
              total_spent: totalSpent,
            };
          })
        );
        
        setCustomers(customersWithStats);
      }
    } catch (err: any) {
      console.error("Error fetching customers:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCustomerOrders = async (customerId: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', customerId)
        .order('created_at', { ascending: false });
      
      if (error) throw new Error(error.message);
      
      return data || [];
    } catch (err: any) {
      console.error("Error fetching customer orders:", err);
      throw err;
    }
  };
  
  useEffect(() => {
    fetchCustomers();
  }, []);
  
  return {
    customers,
    loading,
    error,
    fetchCustomers,
    fetchCustomerOrders,
  };
};
