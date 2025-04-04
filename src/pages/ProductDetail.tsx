
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, Truck, RotateCcw, Shield, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/ui/navbar';
import Footer from '@/components/ui/footer';
import { Product, getProductById } from '@/services/product-service';
import QuoteRequestForm from '@/components/QuoteRequestForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          throw new Error("Product ID is missing");
        }
        
        // Use the local getProductById function instead of direct Supabase query
        // This handles the numeric IDs from our mock data
        const productData = await getProductById(id);
        
        if (productData) {
          setProduct(productData);
        } else {
          throw new Error("Product not found");
        }
      } catch (err: any) {
        console.error("Error fetching product:", err);
        setError(err.message);
        toast({
          title: "Error loading product",
          description: err.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-particle-navy animate-spin mb-4" />
            <p className="text-lg text-gray-600">Loading product details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-6">{error || "The requested product could not be found."}</p>
            <Button asChild>
              <Link to="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Products
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex flex-col"
      >
        <Navbar />
        <main className="flex-1 py-16">
          <div className="content-container">
            <div className="mb-8">
              <Button variant="outline" asChild>
                <Link to="/products">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Products
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Product image section */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 h-full">
                  <img 
                    src={product?.image_url || product?.imageUrl || 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                    alt={product?.name} 
                    className="w-full h-[400px] object-cover object-center"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                </div>
              </motion.div>
              
              {/* Product info section */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-particle-navy/10 text-particle-navy text-xs rounded-full font-medium">
                      {product?.category || "Uncategorized"}
                    </span>
                    
                    {product?.in_stock ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                        Available
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                        Currently Unavailable
                      </span>
                    )}
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl font-bold text-particle-navy mb-4">{product?.name}</h1>
                  <p className="text-gray-600 mb-6">{product?.description}</p>
                  
                  <div className="text-3xl font-bold text-particle-accent mb-8">
                    MWK {product?.price ? parseFloat(product.price.toString()).toFixed(2) : '0.00'}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="bg-particle-navy hover:bg-particle-accent/90 text-white btn-animation flex-1" size="lg">
                          <FileText className="mr-2 h-5 w-5" />
                          Request Quote
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Request a Quote</DialogTitle>
                          <DialogDescription>
                            Fill out the form below and we'll contact you with pricing and availability for {product?.name}.
                          </DialogDescription>
                        </DialogHeader>
                        {product && (
                          <QuoteRequestForm 
                            productId={product.id} 
                            productName={product.name} 
                            onSuccess={() => setIsQuoteDialogOpen(false)} 
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200">
                    <div className="p-2 bg-particle-navy/10 rounded-full">
                      <Truck className="h-5 w-5 text-particle-navy" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Delivery Options</p>
                      <p className="text-sm text-gray-500">Available upon request</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200">
                    <div className="p-2 bg-particle-navy/10 rounded-full">
                      <RotateCcw className="h-5 w-5 text-particle-navy" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Custom Options</p>
                      <p className="text-sm text-gray-500">Specifications available</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200">
                    <div className="p-2 bg-particle-navy/10 rounded-full">
                      <Shield className="h-5 w-5 text-particle-navy" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Warranty</p>
                      <p className="text-sm text-gray-500">1-year manufacturer warranty</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Product full description section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-16"
            >
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-particle-navy mb-6">Product Details</h2>
                
                {product?.fullDescription || product?.full_description ? (
                  <div 
                    className="prose max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: product.fullDescription || product.full_description || '' }}
                  />
                ) : (
                  <p className="text-gray-600">{product?.description}</p>
                )}
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductDetail;
