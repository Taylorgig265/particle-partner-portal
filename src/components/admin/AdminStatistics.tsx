
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  PieChart, 
  Pie,
  Sector, 
  Cell, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { useAdminProducts, useAdminOrders, useAdminCustomers } from "@/services/product-service";
import { Package, ShoppingCart, Users, TrendingUp, DollarSign } from "lucide-react";

const AdminStatistics = () => {
  const { products } = useAdminProducts();
  const { orders } = useAdminOrders();
  const { customers } = useAdminCustomers();
  
  const [orderStats, setOrderStats] = useState({
    totalSales: 0,
    avgOrderValue: 0,
    pendingOrders: 0,
    completedOrders: 0
  });
  
  const [productStats, setProductStats] = useState({
    totalProducts: 0,
    outOfStock: 0,
    topCategories: [] as { name: string; value: number }[]
  });
  
  const [customerStats, setCustomerStats] = useState({
    totalCustomers: 0,
    avgSpendPerCustomer: 0
  });
  
  // Process order data
  useEffect(() => {
    if (orders && orders.length > 0) {
      const totalSales = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
      const avgOrderValue = totalSales / orders.length;
      const pendingOrders = orders.filter(order => order.status === 'pending').length;
      const completedOrders = orders.filter(order => order.status === 'completed').length;
      
      setOrderStats({
        totalSales,
        avgOrderValue,
        pendingOrders,
        completedOrders
      });
    }
  }, [orders]);
  
  // Process product data
  useEffect(() => {
    if (products && products.length > 0) {
      const outOfStock = products.filter(product => !product.in_stock).length;
      
      // Process category data
      const categoryCount = products.reduce((acc, product) => {
        if (product.category) {
          acc[product.category] = (acc[product.category] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);
      
      const topCategories = Object.entries(categoryCount)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
      
      setProductStats({
        totalProducts: products.length,
        outOfStock,
        topCategories
      });
    }
  }, [products]);
  
  // Process customer data
  useEffect(() => {
    if (customers && customers.length > 0 && orders && orders.length > 0) {
      const totalSpent = customers.reduce((sum, customer) => sum + (customer.total_spent || 0), 0);
      const avgSpendPerCustomer = customers.length > 0 ? totalSpent / customers.length : 0;
      
      setCustomerStats({
        totalCustomers: customers.length,
        avgSpendPerCustomer
      });
    }
  }, [customers, orders]);
  
  // Monthly sales data
  const monthlySalesData = () => {
    if (!orders || orders.length === 0) return [];
    
    const monthlyData: Record<string, number> = {};
    
    orders.forEach(order => {
      const date = new Date(order.created_at);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      monthlyData[monthYear] = (monthlyData[monthYear] || 0) + Number(order.total_amount);
    });
    
    return Object.entries(monthlyData)
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => {
        const [aMonth, aYear] = a.name.split('/').map(Number);
        const [bMonth, bYear] = b.name.split('/').map(Number);
        return (aYear * 12 + aMonth) - (bYear * 12 + bMonth);
      })
      .slice(-6); // Last 6 months
  };
  
  // Order status distribution
  const orderStatusData = () => {
    if (!orders || orders.length === 0) return [];
    
    const statusCount: Record<string, number> = {};
    
    orders.forEach(order => {
      statusCount[order.status] = (statusCount[order.status] || 0) + 1;
    });
    
    return Object.entries(statusCount).map(([name, value]) => ({ name, value }));
  };
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard Statistics</h2>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">${orderStats.totalSales.toFixed(2)}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Package className="mr-2 h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{productStats.totalProducts}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ShoppingCart className="mr-2 h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{orders ? orders.length : 0}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{customerStats.totalCustomers}</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Sales</CardTitle>
              <CardDescription>
                Overview of sales performance over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlySalesData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#8884d8" name="Sales ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Average Order Value</CardTitle>
                <CardDescription>
                  Average amount spent per order
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-40">
                <div className="text-4xl font-bold">${orderStats.avgOrderValue.toFixed(2)}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Average Customer Spend</CardTitle>
                <CardDescription>
                  Average amount spent per customer
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-40">
                <div className="text-4xl font-bold">${customerStats.avgSpendPerCustomer.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Categories</CardTitle>
              <CardDescription>
                Distribution of products by category
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productStats.topCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {productStats.topCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Products</CardTitle>
                <CardDescription>
                  Number of products in inventory
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-40">
                <div className="text-4xl font-bold">{productStats.totalProducts}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Out of Stock Products</CardTitle>
                <CardDescription>
                  Products currently out of stock
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-40">
                <div className="text-4xl font-bold">{productStats.outOfStock}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
              <CardDescription>
                Distribution of orders by status
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData()}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {orderStatusData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Orders</CardTitle>
                <CardDescription>
                  Orders waiting to be processed
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-40">
                <div className="text-4xl font-bold">{orderStats.pendingOrders}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Completed Orders</CardTitle>
                <CardDescription>
                  Successfully fulfilled orders
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-40">
                <div className="text-4xl font-bold">{orderStats.completedOrders}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminStatistics;
