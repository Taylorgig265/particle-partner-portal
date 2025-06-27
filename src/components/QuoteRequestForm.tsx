
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
    message: '',
    phone: '',
    company: ''
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

  // Load user profile data when component mounts
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        console.log('Loading user profile for user:', user.id);
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('phone, company')
          .eq('id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error loading user profile:', error);
        } else {
          console.log('User profile loaded:', profile);
          if (profile) {
            setFormData(prev => ({
              ...prev,
              phone: profile.phone || '',
              company: profile.company || ''
            }));
          }
        }
      }
    };

    loadUserProfile();
  }, [user]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Quote request form submitted');
    console.log('Current user:', user);
    console.log('Form data:', formData);
    console.log('Product ID:', productId);
    
    if (!user) {
      console.log('No user found, redirecting to auth');
      navigate('/auth');
      return;
    }

    if (!formData.phone.trim()) {
      console.log('Phone number is missing');
      toast({
        title: "Phone number required",
        description: "Please provide a phone number for the quote request.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Calling submit_quote_request_with_contact RPC function');
      console.log('Parameters:', {
        product_id: productId,
        quantity: formData.quantity,
        message: formData.message,
        phone: formData.phone,
        company: formData.company
      });

      // Use type assertion to call the new function
      const { data, error } = await (supabase as any).rpc('submit_quote_request_with_contact', {
        product_id: productId,
        quantity: formData.quantity,
        message: formData.message,
        phone: formData.phone,
        company: formData.company
      });

      console.log('RPC response:', { data, error });

      if (error) {
        console.error('RPC error details:', error);
        throw error;
      }

      console.log('Quote request submitted successfully');
      toast({
        title: "Quote request submitted",
        description: "We'll get back to you with a quote soon!",
      });

      // Reset form
      setFormData({
        quantity: 1,
        message: '',
        phone: formData.phone, // Keep phone for convenience
        company: formData.company // Keep company for convenience
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Quote request error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      
      toast({
        title: "Request failed",
        description: `Failed to submit quote request: ${error.message || 'Please try again.'}`,
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
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Your phone number"
              required
            />
          </div>

          <div>
            <Label htmlFor="company">Company (Optional)</Label>
            <Input
              id="company"
              type="text"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              placeholder="Your company name"
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
