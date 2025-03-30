
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

export interface Product {
  id: string;
  name: string;
  description: string;
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
