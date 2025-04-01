
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
import { useAdminOrders, QuoteItem, Order, OrderStatus } from "@/services/product-service";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

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
    delivered: "bg-green-100 text-green-800"
  };
  
  const color = statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800";
  
  // Format the status text to be more readable
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
  const { orders, loading, fetchOrderDetails, updateOrderStatus } = useAdminOrders();
  const [activeOrder, setActiveOrder] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<QuoteItem[]>([]);
  const [orderItemsLoading, setOrderItemsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();
  
  const handleViewOrder = async (orderId: string) => {
    setActiveOrder(orderId);
    setOrderItemsLoading(true);
    
    try {
      const details = await fetchOrderDetails(orderId);
      setOrderItems(details.items as QuoteItem[]);
    } catch (error) {
      console.error("Failed to load order details", error);
      toast({
        title: "Error",
        description: "Failed to load order details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setOrderItemsLoading(false);
    }
  };
  
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus as OrderStatus);
      toast({
        title: "Status Updated",
        description: "Order status has been updated successfully.",
      });
    } catch (error) {
      console.error(`Error updating status: ${error}`);
      toast({
        title: "Update Failed",
        description: `Invalid status: ${newStatus}`,
        variant: "destructive",
      });
    }
  };

  const handleRefresh = async () => {
    window.location.reload();
  };
  
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Orders</h2>
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
        <h2 className="text-xl font-bold">Orders ({orders.length})</h2>
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
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order: Order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">
                    {order.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {order.contact_details?.name || order.customer || "Unknown"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.contact_details?.email || "No email"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(order.created_at || order.date || new Date()), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="font-medium">
                    ${Number(order.total_amount || order.total).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={order.status}
                      onValueChange={(value) => handleStatusChange(order.id, value)}
                    >
                      <SelectTrigger className="w-36 h-8">
                        <SelectValue>
                          <OrderStatusBadge status={order.status} />
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="quote_requested">Quote Requested</SelectItem>
                        <SelectItem value="quote_sent">Quote Sent</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewOrder(order.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const email = order.contact_details?.email;
                          if (email) {
                            window.location.href = `mailto:${email}?subject=Order #${order.id.slice(0, 8)}`;
                          }
                        }}
                        disabled={!order.contact_details?.email}
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
      
      {/* Order Details Sheet */}
      <Sheet open={!!activeOrder} onOpenChange={(open) => !open && setActiveOrder(null)}>
        <SheetContent className="sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Order Details</SheetTitle>
            <SheetDescription>
              {activeOrder && `Order ID: ${activeOrder}`}
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6">
            {orderItemsLoading ? (
              <div className="space-y-2">
                {Array(3).fill(0).map((_, index) => (
                  <Skeleton key={index} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="font-semibold">Order Items</div>
                  {orderItems.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      No items found for this order.
                    </div>
                  ) : (
                    orderItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <div className="flex gap-3">
                          {item.product?.image_url && (
                            <img 
                              src={item.product.image_url} 
                              alt={item.product?.name} 
                              className="w-10 h-10 object-cover rounded" 
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder.svg';
                              }}
                            />
                          )}
                          <div>
                            <div className="font-medium">{item.product_name || "Unknown Product"}</div>
                            <div className="text-xs text-gray-500">
                              Qty: {item.quantity} × ${Number(item.price_at_purchase || 0).toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <div className="font-medium">
                          ${((Number(item.price_at_purchase || 0)) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Amount</span>
                    <span className="font-medium">
                      ${orderItems.reduce((sum, item) => sum + ((Number(item.price_at_purchase || 0)) * item.quantity), 0).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="font-semibold">Contact Information</div>
                  <div className="bg-gray-50 p-4 rounded-md text-sm space-y-2">
                    {orders.find(o => o.id === activeOrder)?.contact_details ? (
                      <>
                        <div>
                          <span className="font-medium">Name: </span>
                          {orders.find(o => o.id === activeOrder)?.contact_details?.name || "Unknown"}
                        </div>
                        <div>
                          <span className="font-medium">Email: </span>
                          {orders.find(o => o.id === activeOrder)?.contact_details?.email || "No email"}
                        </div>
                        <div>
                          <span className="font-medium">Phone: </span>
                          {orders.find(o => o.id === activeOrder)?.contact_details?.phone || "No phone"}
                        </div>
                        {orders.find(o => o.id === activeOrder)?.contact_details?.company && (
                          <div>
                            <span className="font-medium">Company: </span>
                            {orders.find(o => o.id === activeOrder)?.contact_details?.company}
                          </div>
                        )}
                        {orders.find(o => o.id === activeOrder)?.contact_details?.message && (
                          <div className="mt-3">
                            <div className="font-medium">Message:</div>
                            <div className="mt-1 whitespace-pre-wrap">
                              {orders.find(o => o.id === activeOrder)?.contact_details?.message}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="text-gray-500">No contact details provided.</span>
                    )}
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
