import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProduct } from '@/services/product-service';
import { useToast } from '@/components/ui/use-toast';
import QuoteRequestDialog from '@/components/QuoteRequestDialog';
import { formatCurrency } from '@/lib/utils'; // Added import for formatCurrency

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error } = useProduct(id);
  const { toast } = useToast();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading product",
        description: error,
        variant: "destructive"
      });
    }
  }, [error, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 text-particle-navy animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h2 className="text-2xl font-bold text-particle-navy mb-4">Product Not Found</h2>
        <p className="text-gray-600">The requested product could not be found.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-24">
      <Button asChild variant="ghost" className="mb-8">
        <Link to="/products">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="w-full rounded-xl shadow-md" 
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-particle-navy mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>
          
          {product.full_description ? (
            <div className="mt-8 prose prose-blue max-w-none" 
                 dangerouslySetInnerHTML={{ __html: product.full_description }} />
          ) : (
            <div className="mt-8">
              <p className="text-gray-700">{product.description}</p>
            </div>
          )}

          <div className="flex items-center justify-between mt-8 mb-4">
            <span className="text-2xl font-semibold text-particle-navy">
              {formatCurrency(product.price)}
            </span>
            <QuoteRequestDialog 
              productId={product.id} 
              productName={product.name}
              trigger={
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Request a Quote
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
