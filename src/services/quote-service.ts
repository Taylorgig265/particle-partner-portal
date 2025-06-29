
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect, useCallback } from 'react';
import { Product } from './product-service';

export interface QuoteRequest {
  id: string;
  created_at?: string;
  product_id: string;
  quantity: number;
  name: string;
  email: string;
  phone: string;
  company?: string;
  message?: string;
  status: string;
  quoted_price?: number;
  quoted_at?: string;
  expires_at?: string;
  admin_notes?: string;
  user_id?: string;
  product?: Product;
}

export const useAdminQuotes = () => {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: quotesData, error: quotesError } = await supabase
        .from('quotes')
        .select(`
          *,
          product:products(*)
        `)
        .order('created_at', { ascending: false });
      
      if (quotesError) throw new Error(quotesError.message);
      
      setQuotes(quotesData || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load quotes');
      setQuotes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateQuoteStatus = useCallback(async (quoteId: string, status: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ 
          status: status,
          quoted_at: status === 'quote_sent' ? new Date().toISOString() : undefined
        })
        .eq('id', quoteId);

      if (error) {
        console.error('Error updating quote status:', error);
        throw new Error(error.message);
      }

      await fetchQuotes();
    } catch (error) {
      console.error('Error in updateQuoteStatus:', error);
      throw error;
    }
  }, [fetchQuotes]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  return {
    quotes,
    loading,
    error,
    fetchQuotes,
    updateQuoteStatus
  };
};
