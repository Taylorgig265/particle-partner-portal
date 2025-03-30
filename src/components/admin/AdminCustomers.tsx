
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, User } from "lucide-react";
import { useAdminCustomers, Order } from "@/services/product-service";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CustomerAvatar = ({ name, avatar_url }: { name?: string; avatar_url?: string }) => {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : '??';
  
  return (
    <Avatar>
      <AvatarImage src={avatar_url || ''} alt={name || 'Customer'} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
};

const AdminCustomers = () => {
  const { customers, loading, fetchCustomerOrders } = useAdminCustomers();
  const [activeCustomer, setActiveCustomer] = useState<string | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [customerOrdersLoading, setCustomerOrdersLoading] = useState(false);
  
  const handleViewCustomer = async (customerId: string) => {
    setActiveCustomer(customerId);
    setCustomerOrdersLoading(true);
    
    try {
      const orders = await fetchCustomerOrders(customerId);
      setCustomerOrders(orders);
    } catch (error) {
      console.error("Failed to load customer orders", error);
    } finally {
      setCustomerOrdersLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Customers</h2>
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
        <h2 className="text-xl font-bold">Customers ({customers.length})</h2>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Spent</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                  No customers found.
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <CustomerAvatar name={customer.name} avatar_url={customer.avatar_url} />
                      <span className="font-medium">{customer.name || "Anonymous User"}</span>
                    </div>
                  </TableCell>
                  <TableCell>{customer.email || "No email"}</TableCell>
                  <TableCell>
                    {format(new Date(customer.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>{customer.orders_count}</TableCell>
                  <TableCell className="font-medium">
                    ${Number(customer.total_spent).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewCustomer(customer.id)}
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
      
      {/* Customer Details Sheet */}
      <Sheet open={!!activeCustomer} onOpenChange={(open) => !open && setActiveCustomer(null)}>
        <SheetContent className="sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Customer Details</SheetTitle>
            <SheetDescription>
              {activeCustomer && customers.find(c => c.id === activeCustomer)?.name}
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6">
            {customerOrdersLoading ? (
              <div className="space-y-2">
                {Array(3).fill(0).map((_, index) => (
                  <Skeleton key={index} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="h-16 w-16 flex items-center justify-center bg-gray-200 rounded-full">
                    {customers.find(c => c.id === activeCustomer)?.avatar_url ? (
                      <img 
                        src={customers.find(c => c.id === activeCustomer)?.avatar_url} 
                        alt="Avatar" 
                        className="h-16 w-16 rounded-full object-cover" 
                      />
                    ) : (
                      <User className="h-8 w-8 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">
                      {customers.find(c => c.id === activeCustomer)?.name || "Anonymous User"}
                    </h3>
                    <p className="text-gray-500">
                      {customers.find(c => c.id === activeCustomer)?.email || "No email"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Joined {format(new Date(customers.find(c => c.id === activeCustomer)?.created_at || Date.now()), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="font-semibold">Order History</div>
                  
                  {customerOrders.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      This customer hasn't placed any orders yet.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {customerOrders.map((order) => (
                        <div key={order.id} className="p-3 bg-gray-50 rounded-md">
                          <div className="flex justify-between">
                            <div>
                              <div className="font-medium">Order #{order.id.slice(0, 8)}...</div>
                              <div className="text-xs text-gray-500">
                                {format(new Date(order.created_at), "MMM d, yyyy")}
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="font-medium">${Number(order.total_amount).toFixed(2)}</span>
                              <span className="px-2 py-0.5 rounded-full text-xs bg-gray-200 text-gray-800">
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Orders</span>
                    <span className="font-medium">{customerOrders.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Spent</span>
                    <span className="font-medium">
                      ${customers.find(c => c.id === activeCustomer)?.total_spent?.toFixed(2) || "0.00"}
                    </span>
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

export default AdminCustomers;
