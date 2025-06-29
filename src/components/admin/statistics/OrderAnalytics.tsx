
import React, { useEffect, useState } from "react";
import { useAdminOrders } from "@/services/product-service";
import { useAdminQuotes } from "@/services/quote-service";
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
import { Skeleton } from "@/components/ui/skeleton";

const OrderAnalytics = () => {
  const { orders, loading: ordersLoading, error: ordersError } = useAdminOrders();
  const { quotes, loading: quotesLoading, error: quotesError } = useAdminQuotes();
  
  const [ordersByStatus, setOrdersByStatus] = useState<Record<string, number>>({});
  const [ordersByMonth, setOrdersByMonth] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [averageOrderValue, setAverageOrderValue] = useState<string>('0.00');

  const loading = ordersLoading || quotesLoading;
  const error = ordersError || quotesError;

  console.log('OrderAnalytics - Orders:', orders);
  console.log('OrderAnalytics - Quotes:', quotes);
  console.log('OrderAnalytics - Loading:', loading);
  console.log('OrderAnalytics - Error:', error);

  useEffect(() => {
    if (loading) return;
    
    // Combine orders and quotes for analytics
    const allItems = [
      ...(orders || []).map(order => ({
        ...order,
        type: 'order' as const,
        amount: Number(order.total_amount) || 0,
        date: order.created_at
      })),
      ...(quotes || []).map(quote => ({
        ...quote,
        type: 'quote' as const,
        amount: Number(quote.quoted_price) || 0,
        date: quote.created_at
      }))
    ];

    console.log('Combined items for analytics:', allItems);

    if (allItems.length > 0) {
      // Calculate totals 
      const revenue = allItems.reduce((sum, item) => sum + item.amount, 0);
      const totalCount = allItems.length;
      const avgValue = totalCount > 0 ? (revenue / totalCount).toFixed(2) : '0.00';
      
      setTotalRevenue(revenue);
      setTotalOrders(totalCount);
      setAverageOrderValue(avgValue);
      
      console.log('Calculated totals:', { revenue, totalCount, avgValue });
      
      // Calculate status distribution
      const statusCounts: Record<string, number> = {};
      allItems.forEach(item => {
        const status = item.status || 'unknown';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
      setOrdersByStatus(statusCounts);
      
      console.log('Status counts:', statusCounts);
      
      // Calculate monthly data
      const monthlyData: Record<string, { month: string, orders: number, revenue: number }> = {};
      allItems.forEach(item => {
        if (item.date) {
          const date = new Date(item.date);
          const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
          
          if (!monthlyData[monthYear]) {
            monthlyData[monthYear] = {
              month: monthYear,
              orders: 0,
              revenue: 0
            };
          }
          
          monthlyData[monthYear].orders += 1;
          monthlyData[monthYear].revenue += item.amount;
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
      console.log('Monthly data:', monthlyArray);
    } else {
      console.log('No items found for analytics');
      setTotalRevenue(0);
      setTotalOrders(0);
      setAverageOrderValue('0.00');
      setOrdersByStatus({});
      setOrdersByMonth([]);
    }
  }, [orders, quotes, loading]);

  const pieData = Object.entries(ordersByStatus).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' '),
    value: count
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const formatTooltipValue = (value: string | number, name: string) => {
    if (name === "revenue") return [formatCurrency(Number(value)), "Revenue"];
    return [value, "Orders"];
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Array(3).fill(0).map((_, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32 mb-1" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="py-8 text-center">
        <div className="text-red-500 mb-2">Error loading statistics</div>
        <div className="text-sm text-gray-600">{error}</div>
        <div className="text-xs text-gray-500 mt-2">
          Please check the console for more details and try refreshing the page.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-gray-500 mt-1">From orders & quotes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{totalOrders}</div>
            <p className="text-xs text-gray-500 mt-1">Orders & quotes combined</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Average Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{formatCurrency(averageOrderValue)}</div>
            <p className="text-xs text-gray-500 mt-1">Per item average</p>
          </CardContent>
        </Card>
      </div>
      
      {totalOrders === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-500">
              <div className="text-lg font-medium mb-2">No Data Available</div>
              <div className="text-sm">No orders or quotes have been created yet.</div>
              <div className="text-xs mt-2">Data will appear here once customers start placing orders or requesting quotes.</div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Items Over Time</TabsTrigger>
            <TabsTrigger value="status">Items by Status</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Orders & Quotes</CardTitle>
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
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">No monthly data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="status">
            <Card>
              <CardHeader>
                <CardTitle>Items by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {pieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={pieData} 
                          cx="50%" 
                          cy="50%" 
                          labelLine={false} 
                          outerRadius={80} 
                          fill="#8884d8" 
                          dataKey="value" 
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip formatter={(value, name, props) => [`${value} items`, props.payload.name]} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">No status data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default OrderAnalytics;
