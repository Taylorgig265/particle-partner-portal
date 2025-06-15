
import React, { useEffect, useState } from "react";
import { useAdminOrders, Order } from "@/services/product-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

const OrderAnalytics = () => {
  const { orders, loading, error } = useAdminOrders();
  const [ordersByStatus, setOrdersByStatus] = useState<Record<string, number>>({});
  const [ordersByMonth, setOrdersByMonth] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);

  const averageOrderValue = orders && orders.length > 0 
    ? (orders.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0) / orders.length).toFixed(2)
    : '0.00';

  useEffect(() => {
    if (orders && orders.length > 0) {
      const revenue = orders.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0);
      setTotalRevenue(revenue);
      setTotalOrders(orders.length);
      
      const statusCounts: Record<string, number> = {};
      orders.forEach(order => {
        const status = order.status || 'unknown';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
      setOrdersByStatus(statusCounts);
      
      const monthlyData: Record<string, { month: string, orders: number, revenue: number }> = {};
      orders.forEach(order => {
        if (order.created_at) {
          const date = new Date(order.created_at);
          const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
          
          if (!monthlyData[monthYear]) {
            monthlyData[monthYear] = {
              month: monthYear,
              orders: 0,
              revenue: 0
            };
          }
          
          monthlyData[monthYear].orders += 1;
          monthlyData[monthYear].revenue += Number(order.total_amount) || 0;
        }
      });
      
      const monthlyArray = Object.values(monthlyData);
      monthlyArray.sort((a, b) => {
        const [aMonth, aYear] = a.month.split(' ');
        const [bMonth, bYear] = b.month.split(' ');
        
        if (aYear !== bYear) {
          return parseInt(aYear) - parseInt(bYear);
        }
        
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.indexOf(aMonth) - months.indexOf(bMonth);
      });
      
      setOrdersByMonth(monthlyArray);
    }
  }, [orders]);

  const pieData = Object.entries(ordersByStatus).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
    value: count
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const formatTooltipValue = (value: string | number, name: string) => {
    if (name === "revenue") return [formatCurrency(Number(value)), "Revenue"];
    return [value, "Orders"];
  };

  if (loading) return <div className="py-8 text-center">Loading statistics...</div>;
  if (error) return <div className="py-8 text-center text-red-500">Error loading statistics: {error}</div>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-gray-500 mt-1">Lifetime revenue</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{totalOrders}</div>
            <p className="text-xs text-gray-500 mt-1">Lifetime orders</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{formatCurrency(averageOrderValue)}</div>
            <p className="text-xs text-gray-500 mt-1">Per order average</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Orders Over Time</TabsTrigger>
          <TabsTrigger value="status">Orders by Status</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Orders & Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {ordersByMonth.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ordersByMonth} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip formatter={formatTooltipValue} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="orders" name="Orders" fill="#8884d8" />
                      <Bar yAxisId="right" dataKey="revenue" name="Revenue" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <div className="flex items-center justify-center h-full"><p className="text-gray-500">No order data available</p></div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Orders by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                        {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Legend />
                      <Tooltip formatter={(value, name, props) => [`${value} orders`, props.payload.name]} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : <div className="flex items-center justify-center h-full"><p className="text-gray-500">No status data available</p></div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
export default OrderAnalytics;
