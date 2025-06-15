
import { useState, useEffect, useCallback } from 'react';
import { useAdminCustomers } from '@/services/product-service';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

const AdminCustomers = () => {
  const { customers, loading, error, fetchCustomers } = useAdminCustomers();
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  // Fetch orders based on customer type (Registered or Guest)
  const fetchCustomerOrders = useCallback(async (customer: any) => {
    if (!customer) return [];
    try {
      let query;
      if (customer.source === 'Registered') {
        console.log(`Fetching orders for registered customer: ${customer.id}`);
        query = supabase
          .from('orders')
          .select('*')
          .eq('user_id', customer.id);
      } else { // Guest customer
        console.log(`Fetching orders for guest customer: ${customer.email}`);
        query = supabase
          .from('orders')
          .select('*')
          .eq('contact_details->>email', customer.email);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching customer orders:', error);
        return [];
      }
      
      return data || [];
    } catch (err) {
      console.error('Exception fetching customer orders:', err);
      return [];
    }
  }, []);

  const handleCustomerClick = async (customer: any) => {
    setSelectedCustomer(customer);
    const orders = await fetchCustomerOrders(customer);
    setCustomerOrders(orders);
  };

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Customers</h2>
      {loading ? (
        <p>Loading customers...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Table>
              <TableCaption>A list of your customers (registered and guests).</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id} className="cursor-pointer hover:bg-accent" onClick={() => handleCustomerClick(customer)}>
                    <TableCell>{customer.name || 'N/A'}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={customer.source === 'Registered' ? 'default' : 'secondary'}>
                        {customer.source}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div>
            {selectedCustomer ? (
              <div className="p-4 border rounded-lg bg-card">
                <h3 className="text-xl font-semibold mb-2">Customer Details</h3>
                <p><span className="font-semibold">Name:</span> {selectedCustomer.name || 'N/A'}</p>
                <p><span className="font-semibold">Email:</span> {selectedCustomer.email}</p>
                <p><span className="font-semibold">Phone:</span> {selectedCustomer.phone || 'N/A'}</p>
                
                <h3 className="text-xl font-semibold mt-4 mb-2">Orders</h3>
                {customerOrders.length > 0 ? (
                  <ul className="space-y-2 max-h-96 overflow-y-auto">
                    {customerOrders.map((order) => (
                      <li key={order.id} className="p-2 border rounded text-sm">
                        <div className="font-medium">Order ID: {order.id.slice(0, 8)}...</div>
                        <div>Status: <Badge variant="outline">{order.status}</Badge></div>
                        <div>Amount: MWK {Number(order.total_amount).toFixed(2)}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No orders found for this customer.</p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full p-4 border rounded-lg bg-muted/40">
                <p className="text-muted-foreground">Select a customer to view details.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
