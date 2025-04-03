
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import QuoteRequestForm from '@/components/QuoteRequestForm';

interface QuoteRequestDialogProps {
  trigger: React.ReactNode;
  productId?: string;
  productName?: string;
}

const QuoteRequestDialog = ({ 
  trigger, 
  productId = "general-inquiry",
  productName = "General Product Inquiry" 
}: QuoteRequestDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Request a Quote</DialogTitle>
          <DialogDescription>
            Fill out the form below and we'll contact you with pricing and availability information.
          </DialogDescription>
        </DialogHeader>
        <QuoteRequestForm 
          productId={productId} 
          productName={productName} 
          onSuccess={() => setIsOpen(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default QuoteRequestDialog;
