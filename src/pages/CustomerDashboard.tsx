
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Settings, 
  FileText, 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  XCircle,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import ProfileSettings from "@/components/ProfileSettings";

interface Quote {
  id: string;
  product_id: string;
  quantity: number;
  status: string;
  created_at: string;
  quoted_price?: number;
  quoted_at?: string;
  expires_at?: string;
  admin_notes?: string;
  message?: string;
  product?: {
    name: string;
    image_url?: string;
  };
}

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  order_items?: {
    id: string;
    quantity: number;
    price_at_purchase: number;
    product?: {
      name: string;
      image_url?: string;
    };
  }[];
}

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      fetchUserData();
    }
  }, [user, authLoading, navigate]);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      // Fetch user quotes
      const { data: quotesData, error: quotesError } = await supabase
        .from('quotes')
        .select(`
          *,
          product:products(name, image_url)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (quotesError) {
        console.error('Error fetching quotes:', quotesError);
      } else {
        setQuotes(quotesData || []);
      }

      // Fetch user orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            id,
            quantity,
            price_at_purchase,
            product:products(name, image_url)
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
      } else {
        setOrders(ordersData || []);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
      case 'completed':
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Package className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
      case 'completed':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'quote_sent':
        return 'bg-purple-100 text-purple-800';
      case 'processing':
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Customer Dashboard</h1>
              <p className="text-gray-600">Welcome, {user.email}</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="quotes" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quotes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Quote Requests
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quotes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Quote Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array(3).fill(0).map((_, index) => (
                      <Skeleton key={index} className="h-24 w-full" />
                    ))}
                  </div>
                ) : quotes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No quote requests found.</p>
                    <Button
                      onClick={() => navigate("/products")}
                      className="mt-4"
                    >
                      Browse Products
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {quotes.map((quote) => (
                      <motion.div
                        key={quote.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4">
                            {quote.product?.image_url && (
                              <img
                                src={quote.product.image_url}
                                alt={quote.product.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <h3 className="font-semibold">
                                {quote.product?.name || "Product"}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Quantity: {quote.quantity}
                              </p>
                              <p className="text-sm text-gray-600">
                                Requested: {format(new Date(quote.created_at), "MMM d, yyyy")}
                              </p>
                              {quote.quoted_price && (
                                <p className="text-sm font-medium text-green-600">
                                  Quoted Price: {formatCurrency(quote.quoted_price)}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge className={getStatusColor(quote.status)}>
                              <span className="flex items-center gap-1">
                                {getStatusIcon(quote.status)}
                                {quote.status.replace('_', ' ').toUpperCase()}
                              </span>
                            </Badge>
                            {quote.expires_at && new Date(quote.expires_at) > new Date() && (
                              <p className="text-xs text-orange-600">
                                Expires: {format(new Date(quote.expires_at), "MMM d, yyyy")}
                              </p>
                            )}
                          </div>
                        </div>
                        {quote.admin_notes && (
                          <div className="mt-3 p-3 bg-blue-50 rounded">
                            <p className="text-sm font-medium text-blue-800">Admin Notes:</p>
                            <p className="text-sm text-blue-700">{quote.admin_notes}</p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array(3).fill(0).map((_, index) => (
                      <Skeleton key={index} className="h-24 w-full" />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No orders found.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold">
                              Order #{order.id.slice(0, 8)}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Placed: {format(new Date(order.created_at), "MMM d, yyyy")}
                            </p>
                            <p className="text-lg font-medium">
                              Total: {formatCurrency(order.total_amount)}
                            </p>
                          </div>
                          <Badge className={getStatusColor(order.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(order.status)}
                              {order.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </Badge>
                        </div>
                        {order.order_items && order.order_items.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Items:</p>
                            {order.order_items.map((item) => (
                              <div key={item.id} className="flex items-center gap-3 text-sm">
                                {item.product?.image_url && (
                                  <img
                                    src={item.product.image_url}
                                    alt={item.product.name}
                                    className="w-8 h-8 object-cover rounded"
                                  />
                                )}
                                <span>{item.product?.name || "Product"}</span>
                                <span className="text-gray-600">
                                  Qty: {item.quantity} × {formatCurrency(item.price_at_purchase)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <ProfileSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerDashboard;
