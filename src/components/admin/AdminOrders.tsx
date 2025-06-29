
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, Mail, RefreshCw } from "lucide-react";
import { useAdminOrders, Order, OrderStatus } from "@/services/product-service";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/utils";
import { useAdminQuotes } from "@/services/quote-service";

const OrderStatusBadge = ({ status }: { status: string }) => {
  const statusColors = {
    quote_requested: "bg-blue-100 text-blue-800",
    quote_sent: "bg-purple-100 text-purple-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    completed: "bg-teal-100 text-teal-800",
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-indigo-100 text-indigo-800",
    shipped: "bg-orange-100 text-orange-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800"
  };
  
  const color = statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800";
  
  const formatStatus = (status: string) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs ${color}`}>
      {formatStatus(status)}
    </span>
  );
};

const AdminOrders = () => {
  const { orders, loading: ordersLoading, error: ordersError, fetchOrders, updateOrderStatus } = useAdminOrders();
  const { quotes, loading: quotesLoading, error: quotesError, fetchQuotes, updateQuoteStatus } = useAdminQuotes();
  const [activeItem, setActiveItem] = useState<{ id: string; type: 'order' | 'quote' } | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();
  
  const loading = ordersLoading || quotesLoading;
  const error = ordersError || quotesError;
  
  // Combine orders and quotes into a single list
  const combinedItems = [
    ...orders.map(order => ({
      ...order,
      type: 'order' as const,
      display_name: order.contact_details?.name || "Unknown",
      display_email: order.contact_details?.email || "No email",
      display_phone: order.contact_details?.phone || "No phone",
      display_company: order.contact_details?.company || "",
      display_message: order.contact_details?.message || "",
      sort_date: new Date(order.created_at || 0)
    })),
    ...quotes.map(quote => ({
      ...quote,
      type: 'quote' as const,
      display_name: quote.name || "Unknown",
      display_email: quote.email || "No email", 
      display_phone: quote.phone || "No phone",
      display_company: quote.company || "",
      display_message: quote.message || "",
      total_amount: quote.quoted_price || 0,
      sort_date: new Date(quote.created_at || 0)
    }))
  ].sort((a, b) => b.sort_date.getTime() - a.sort_date.getTime());
  
  const handleViewItem = async (itemId: string, itemType: 'order' | 'quote') => {
    console.log('Viewing item:', itemId, itemType);
    setActiveItem({ id: itemId, type: itemType });
  };
  
  const handleStatusChange = async (itemId: string, itemType: 'order' | 'quote', newStatus: string) => {
    try {
      if (itemType === 'order') {
        await updateOrderStatus(itemId, newStatus as OrderStatus);
      } else {
        await updateQuoteStatus(itemId, newStatus);
      }
      toast({
        title: "Status Updated",
        description: `${itemType === 'order' ? 'Order' : 'Quote'} status has been updated successfully.`,
      });
    } catch (error) {
      console.error(`Error updating status:`, error);
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred while updating status.",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchOrders(), fetchQuotes()]);
      toast({
        title: "Data Refreshed",
        description: "Orders and quotes have been refreshed from the database.",
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast({
        title: "Refresh Failed",
        description: "Could not refresh data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };
  
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Orders & Quotes</h2>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        <div className="space-y-2">
          {Array(5).fill(0).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Orders & Quotes ({combinedItems.length})</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {combinedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                  No orders or quotes found.
                </TableCell>
              </TableRow>
            ) : (
              combinedItems.map((item) => (
                <TableRow key={`${item.type}-${item.id}`}>
                  <TableCell className="font-mono text-sm">
                    {item.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.type === 'order' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {item.type === 'order' ? 'Order' : 'Quote'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{item.display_name}</div>
                    <div className="text-xs text-gray-500">{item.display_email}</div>
                  </TableCell>
                  <TableCell>
                    {format(item.sort_date, "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(item.total_amount)}
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={item.status}
                      onValueChange={(value) => handleStatusChange(item.id, item.type, value)}
                    >
                      <SelectTrigger className="w-36 h-8">
                        <SelectValue>
                          <OrderStatusBadge status={item.status} />
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="quote_requested">Quote Requested</SelectItem>
                        <SelectItem value="quote_sent">Quote Sent</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewItem(item.id, item.type)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (item.display_email && item.display_email !== "No email") {
                            window.location.href = `mailto:${item.display_email}?subject=${item.type === 'order' ? 'Order' : 'Quote'} #${item.id.slice(0, 8)}`;
                          }
                        }}
                        disabled={item.display_email === "No email"}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Item Details Sheet */}
      <Sheet open={!!activeItem} onOpenChange={(open) => !open && setActiveItem(null)}>
        <SheetContent className="sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>
              {activeItem?.type === 'order' ? 'Order' : 'Quote'} Details
            </SheetTitle>
            <SheetDescription>
              {activeItem && `${activeItem.type === 'order' ? 'Order' : 'Quote'} ID: ${activeItem.id}`}
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6">
            {activeItem && (
              <>
                <div className="space-y-2">
                  <div className="font-semibold">
                    {activeItem.type === 'order' ? 'Order Items' : 'Quote Details'}
                  </div>
                  
                  {activeItem.type === 'quote' ? (
                    <div className="bg-gray-50 p-4 rounded-md">
                      {(() => {
                        const quote = quotes.find(q => q.id === activeItem.id);
                        return quote ? (
                          <div className="space-y-2">
                            <div><strong>Product:</strong> {quote.product?.name || "Unknown Product"}</div>
                            <div><strong>Quantity:</strong> {quote.quantity}</div>
                            {quote.quoted_price && (
                              <div><strong>Quoted Price:</strong> {formatCurrency(quote.quoted_price)}</div>
                            )}
                          </div>
                        ) : (
                          <div>Quote details not found</div>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      Order items functionality would be loaded here
                    </div>
                  )}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="font-semibold">Contact Information</div>
                  <div className="bg-gray-50 p-4 rounded-md text-sm space-y-2">
                    {(() => {
                      const item = combinedItems.find(i => i.id === activeItem.id && i.type === activeItem.type);
                      return item ? (
                        <>
                          <div><span className="font-medium">Name: </span>{item.display_name}</div>
                          <div><span className="font-medium">Email: </span>{item.display_email}</div>
                          <div><span className="font-medium">Phone: </span>{item.display_phone}</div>
                          {item.display_company && (
                            <div><span className="font-medium">Company: </span>{item.display_company}</div>
                          )}
                          {item.display_message && (
                            <div className="mt-3">
                              <div className="font-medium">Message:</div>
                              <div className="mt-1 whitespace-pre-wrap">{item.display_message}</div>
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-gray-500">Contact details not found.</span>
                      );
                    })()}
                  </div>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default AdminOrders;
