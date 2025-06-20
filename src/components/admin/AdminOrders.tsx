
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
import { useAdminOrders, QuoteItem, Order, OrderStatus, getOrderItems, OrderItem } from "@/services/product-service";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/utils";

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
  const { orders, loading, error, fetchOrders, updateOrderStatus } = useAdminOrders();
  const [activeOrder, setActiveOrder] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderItemsLoading, setOrderItemsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();
  
  const handleViewOrder = async (orderId: string) => {
    console.log('Viewing order:', orderId);
    setActiveOrder(orderId);
    setOrderItemsLoading(true);
    
    try {
      const items = await getOrderItems(orderId);
      console.log('Loaded order items:', items);
      setOrderItems(items);
    } catch (error) {
      console.error('Error loading order items:', error);
      toast({
        title: "Error loading order items",
        description: "Could not load order items. Please try again.",
        variant: "destructive",
      });
      setOrderItems([]);
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
      await fetchOrders();
      toast({
        title: "Data Refreshed",
        description: "Orders have been refreshed from the database.",
      });
    } catch (error) {
      console.error('Error refreshing orders:', error);
      toast({
        title: "Refresh Failed",
        description: "Could not refresh orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };
  
  // Helper function to safely extract contact details properties
  const getContactDetail = (details: any, key: string): string => {
    if (!details) return "Unknown";
    
    // Handle if details is an object with properties
    if (typeof details === 'object' && details !== null && key in details) {
      return details[key] || "Unknown";
    }
    
    return "Unknown";
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
              orders.map((order) => {
                const contactDetails = order.contact_details && typeof order.contact_details === 'object' ? order.contact_details : {};
                
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">
                      {order.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {getContactDetail(contactDetails, 'name') || "Unknown"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getContactDetail(contactDetails, 'email') || "No email"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(order.total_amount)}
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
                          onClick={() => handleViewOrder(order.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const email = getContactDetail(contactDetails, 'email');
                            if (email && email !== "Unknown") {
                              window.location.href = `mailto:${email}?subject=Order #${order.id.slice(0, 8)}`;
                            }
                          }}
                          disabled={getContactDetail(contactDetails, 'email') === "Unknown"}
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
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
                            <div className="font-medium">{item.product?.name || "Unknown Product"}</div>
                            <div className="text-xs text-gray-500">
                              Qty: {item.quantity} × {formatCurrency(item.price_at_purchase || 0)}
                            </div>
                          </div>
                        </div>
                        <div className="font-medium">
                          {formatCurrency((Number(item.price_at_purchase || 0)) * item.quantity)}
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
                      {formatCurrency(orderItems.reduce((sum, item) => sum + ((Number(item.price_at_purchase || 0)) * item.quantity), 0))}
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
                          {getContactDetail(orders.find(o => o.id === activeOrder)?.contact_details, 'name')}
                        </div>
                        <div>
                          <span className="font-medium">Email: </span>
                          {getContactDetail(orders.find(o => o.id === activeOrder)?.contact_details, 'email')}
                        </div>
                        <div>
                          <span className="font-medium">Phone: </span>
                          {getContactDetail(orders.find(o => o.id === activeOrder)?.contact_details, 'phone')}
                        </div>
                        {getContactDetail(orders.find(o => o.id === activeOrder)?.contact_details, 'company') !== "Unknown" && (
                          <div>
                            <span className="font-medium">Company: </span>
                            {getContactDetail(orders.find(o => o.id === activeOrder)?.contact_details, 'company')}
                          </div>
                        )}
                        {getContactDetail(orders.find(o => o.id === activeOrder)?.contact_details, 'message') !== "Unknown" && (
                          <div className="mt-3">
                            <div className="font-medium">Message:</div>
                            <div className="mt-1 whitespace-pre-wrap">
                              {getContactDetail(orders.find(o => o.id === activeOrder)?.contact_details, 'message')}
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
