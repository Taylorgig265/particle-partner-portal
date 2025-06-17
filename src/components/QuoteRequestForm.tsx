
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface QuoteRequestFormProps {
  productId: string;
  productName: string;
  onSuccess?: () => void;
}

const QuoteRequestForm: React.FC<QuoteRequestFormProps> = ({ 
  productId, 
  productName, 
  onSuccess 
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    quantity: 1,
    message: ''
  });

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to request a quote.",
        variant: "destructive"
      });
      navigate('/auth');
    }
  }, [user, navigate, toast]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate('/auth');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.rpc('submit_quote_request', {
        product_id: productId,
        quantity: formData.quantity,
        message: formData.message
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Quote request submitted",
        description: "We'll get back to you with a quote soon!",
      });

      // Reset form
      setFormData({
        quantity: 1,
        message: ''
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Quote request error:', error);
      toast({
        title: "Request failed",
        description: "Failed to submit quote request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Quote for {productName}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
              required
            />
          </div>

          <div>
            <Label htmlFor="message">Additional Message (Optional)</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Any specific requirements or questions..."
              rows={4}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                Submitting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Submit Quote Request
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default QuoteRequestForm;
