
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
import { Eye } from "lucide-react";
import { useAdminOrders, OrderItem } from "@/services/product-service";
import { format } from "date-fns";

const OrderStatusBadge = ({ status }: { status: string }) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  
  const color = statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800";
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs ${color}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const AdminOrders = () => {
  const { orders, loading, fetchOrderDetails, updateOrderStatus } = useAdminOrders();
  const [activeOrder, setActiveOrder] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderItemsLoading, setOrderItemsLoading] = useState(false);
  
  const handleViewOrder = async (orderId: string) => {
    setActiveOrder(orderId);
    setOrderItemsLoading(true);
    
    try {
      const items = await fetchOrderDetails(orderId);
      setOrderItems(items);
    } catch (error) {
      console.error("Failed to load order details", error);
    } finally {
      setOrderItemsLoading(false);
    }
  };
  
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    await updateOrderStatus(orderId, newStatus);
  };
  
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Orders</h2>
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
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
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
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">
                    {order.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{order.user?.name || "Unknown"}</div>
                    <div className="text-xs text-gray-500">{order.user?.email}</div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(order.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="font-medium">
                    ${Number(order.total_amount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={order.status}
                      onValueChange={(value) => handleStatusChange(order.id, value)}
                    >
                      <SelectTrigger className="w-32 h-8">
                        <SelectValue>
                          <OrderStatusBadge status={order.status} />
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewOrder(order.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
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
                  <div className="font-semibold">Items</div>
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
                            />
                          )}
                          <div>
                            <div className="font-medium">{item.product?.name || "Unknown Product"}</div>
                            <div className="text-xs text-gray-500">
                              Qty: {item.quantity} × ${Number(item.price_at_purchase).toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <div className="font-medium">
                          ${(Number(item.price_at_purchase) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium">
                      ${orderItems.reduce((sum, item) => sum + (Number(item.price_at_purchase) * item.quantity), 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-medium">Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold mt-2">
                    <span>Total</span>
                    <span>
                      ${orderItems.reduce((sum, item) => sum + (Number(item.price_at_purchase) * item.quantity), 0).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="font-semibold">Shipping Address</div>
                  <div className="text-gray-600 text-sm">
                    {orders.find(o => o.id === activeOrder)?.shipping_address ? (
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(orders.find(o => o.id === activeOrder)?.shipping_address, null, 2)}
                      </pre>
                    ) : (
                      <span className="text-gray-500">No shipping address provided.</span>
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
