
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/services/product-service';
import { useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

// Mapping for category colors
const categoryColors: Record<string, string> = {
  'Diagnostic Equipment': 'from-blue-500/20 to-blue-600/20',
  'Laboratory Equipment': 'from-green-500/20 to-green-600/20',
  'Healthcare Equipment': 'from-red-500/20 to-red-600/20',
  'Industrial Equipment': 'from-yellow-500/20 to-yellow-600/20'
};

// Fallback images for categories
const categoryImages: Record<string, string> = {
  'Diagnostic Equipment': 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Laboratory Equipment': 'https://images.unsplash.com/photo-1579165466949-3180a3d056d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Healthcare Equipment': 'https://images.unsplash.com/photo-1576671114140-525049b9291b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'Industrial Equipment': 'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
};

const ProductsPreview = () => {
  const { products, loading, error } = useProducts();
  const { toast } = useToast();
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading products",
        description: error,
        variant: "destructive"
      });
    }
  }, [error, toast]);

  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    if (!product.category) return acc;
    
    if (!acc[product.category]) {
      acc[product.category] = {
        name: product.category,
        products: []
      };
    }
    
    acc[product.category].products.push(product);
    return acc;
  }, {} as Record<string, { name: string, products: any[] }>);
  
  // Convert to array for easier rendering
  const categories = Object.values(productsByCategory);

  // Get a representative image for each category
  const getCategoryImage = (categoryName: string, products: any[] = []) => {
    // Check if products array exists and has items
    if (!products || products.length === 0) {
      return categoryImages[categoryName] || 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    }
    
    // Try to find a product with an image
    const productWithImage = products.find(p => p.image_url);
    if (productWithImage) return productWithImage.image_url;
    
    // Fallback to predefined category images
    return categoryImages[categoryName] || 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
  };

  // Get color gradient for a category
  const getCategoryColor = (categoryName: string) => {
    return categoryColors[categoryName] || 'from-blue-500/20 to-blue-600/20';
  };

  // Display up to 4 categories
  const displayCategories = categories.slice(0, 4);

  return (
    <section className="py-24 bg-particle-light/50 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxMCwgMzUsIDY2LCAwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-70" />
      
      <div className="content-container relative z-10">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-3 py-1 rounded-full bg-particle-navy/5 text-particle-navy border border-particle-navy/10 mb-4"
          >
            <span className="text-sm font-medium">Our Product Range</span>
          </motion.div>
          
          <motion.h2 
            className="text-4xl font-bold text-particle-navy mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Comprehensive Medical Equipment Solutions
          </motion.h2>
          
          <motion.p 
            className="max-w-3xl mx-auto text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover our extensive range of high-quality diagnostic, laboratory, healthcare, and industrial equipment.
            All our products come with certification, warranty, and expert support.
          </motion.p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-12 w-12 text-particle-navy animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500 mb-4">Unable to load product categories</p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        ) : displayCategories.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600">No product categories available</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {displayCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link 
                  to={`/products#${category.name}`}
                  className="block h-full"
                >
                  <div className="h-full rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 card-hover group">
                    <div className="h-48 relative overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(category.name)} opacity-30 group-hover:opacity-20 transition-opacity`}></div>
                      <img 
                        src={getCategoryImage(category.name, category.products)} 
                        alt={category.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <h3 className="absolute bottom-4 left-4 text-xl font-semibold text-white">{category.name}</h3>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-600 mb-4">
                        {category.products && category.products.length > 0
                          ? `${category.products.length} products available`
                          : "Explore our offerings in this category"}
                      </p>
                      <div className="flex items-center text-particle-navy font-medium group-hover:text-particle-accent transition-colors">
                        Explore {category.name}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        <div className="text-center mt-16">
          <Button 
            className="bg-particle-navy hover:bg-particle-secondary text-white btn-animation"
            size="lg"
            asChild
          >
            <Link to="/products">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductsPreview;
