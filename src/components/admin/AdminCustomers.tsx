
import { useState, useEffect, useCallback } from 'react';
import { useAdminCustomers } from '@/services/product-service';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { supabase } from '@/integrations/supabase/client';

const AdminCustomers = () => {
  const { customers, loading, error, fetchCustomers } = useAdminCustomers();
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  // Improved implementation for fetchCustomerOrders using supabase
  const fetchCustomerOrders = useCallback(async (customerId: string) => {
    try {
      console.log(`Fetching orders for customer: ${customerId}`);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', customerId)
        .order('created_at', { ascending: false });
        
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
    const orders = await fetchCustomerOrders(customer.id);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Table>
              <TableCaption>A list of your customers.</TableCaption>
              <TableHead>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHead>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id} className="cursor-pointer hover:bg-accent" onClick={() => handleCustomerClick(customer)}>
                    <TableCell>{customer.full_name || customer.name || 'N/A'}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div>
            {selectedCustomer ? (
              <div>
                <h3 className="text-xl font-semibold mb-2">Customer Details</h3>
                <p>Name: {selectedCustomer.full_name || selectedCustomer.name || 'N/A'}</p>
                <p>Email: {selectedCustomer.email}</p>
                <h3 className="text-xl font-semibold mt-4 mb-2">Orders</h3>
                {customerOrders.length > 0 ? (
                  <ul>
                    {customerOrders.map((order) => (
                      <li key={order.id} className="p-2 mb-2 border rounded">
                        <div className="font-medium">Order ID: {order.id.slice(0, 8)}...</div>
                        <div>Status: {order.status}</div>
                        <div>Amount: MWK {Number(order.total_amount).toFixed(2)}</div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No orders found for this customer.</p>
                )}
              </div>
            ) : (
              <p>Select a customer to view details.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
