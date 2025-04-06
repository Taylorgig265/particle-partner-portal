import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useProducts } from '@/services/product-service';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import { motion } from 'framer-motion';

const placeholderImage = 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

const Products = () => {
  const { products, categories, loading, error } = useProducts();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (window.location.hash) {
      const categoryId = window.location.hash.substring(1);
      setActiveCategory(categoryId);
    }
  }, []);

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      <main className="w-full">
        <section className="py-12 md:py-24 bg-particle-light/50 relative overflow-hidden">
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
                <span className="text-sm font-medium">Our Products</span>
              </motion.div>

              <motion.h2
                className="text-4xl font-bold text-particle-navy mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Explore Our Comprehensive Range
              </motion.h2>

              <motion.p
                className="max-w-3xl mx-auto text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Browse our extensive selection of medical, laboratory, healthcare, and industrial equipment.
                Each product is designed for reliability, precision, and performance.
              </motion.p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-12 w-12 text-particle-navy animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-red-500 mb-4">Unable to load products</p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  Try Again
                </Button>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600">No products available</p>
              </div>
            ) : (
              categories.map((category) => (
                <div key={category.name} id={category.name} className="pt-16 -mt-16">
                  <div className="mb-8 mt-8">
                    <h2 className="text-2xl font-bold text-particle-navy">{category.name}</h2>
                    <div className="h-1 w-24 bg-particle-accent/50 mt-2"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {category.products && category.products.map((product) => (
                      <Link
                        key={product.id}
                        to={`/products/${product.id}`}
                        className="group"
                      >
                        <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={product.image_url || placeholderImage}
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = placeholderImage;
                              }}
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                              <h3 className="text-white font-semibold text-lg">{product.name}</h3>
                            </div>
                          </div>
                          <div className="p-4 flex-grow flex flex-col">
                            <p className="text-gray-600 line-clamp-2 flex-grow">{product.description}</p>
                            <div className="flex items-center mt-4 justify-between">
                              <p className="font-semibold text-particle-navy">
                                ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                              </p>
                              <div className="flex items-center text-particle-accent font-medium">
                                View Details
                                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
      <Footer />
    </motion.div>
  );
};

export default Products;
