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
      setProducts(data || []);
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
      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();

      if (error) throw error;
      
      setProducts(prev => [...prev, data]);
      return data;
    } catch (err: any) {
      console.error('Error adding product:', err);
      throw err;
    }
  };

  const updateProduct = async (productData: Product) => {
    try {
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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
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
      setProduct(data || null);
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
      setItems(data || []);
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

  const addGalleryItem = async (itemData: Omit<GalleryItem, 'id' | 'created_at' | 'updated_at' | 'project_id'> & { project_id?: string }) => {
    try {
      const { data, error } = await supabase
        .from('gallery')
        .insert(itemData)
        .select()
        .single();

      if (error) throw error;
      
      setItems(prev => [data, ...prev]);
      return data;
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
