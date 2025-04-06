
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Package, 
  ShoppingCart, 
  Users,
  Home,
  BarChart,
  RefreshCw,
  LogOut,
  ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminCustomers from "@/components/admin/AdminCustomers";
import AdminStatistics from "@/components/admin/AdminStatistics";
import AdminGallery from "@/components/admin/AdminGallery";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { getVisitorStats } from '@/services/visitor-service';
import { useAdminAuth } from "@/contexts/AdminAuthContext";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("statistics");  // Default to statistics tab
  const [refreshKey, setRefreshKey] = useState(0);
  const [visitorStats, setVisitorStats] = useState<any>(null);
  const { toast } = useToast();
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  
  // Refresh content when tab changes
  useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, [activeTab]);

  // Load visitor stats when on statistics tab
  useEffect(() => {
    if (activeTab === "statistics") {
      fetchVisitorStats();
    }
  }, [activeTab, refreshKey]);
  
  const fetchVisitorStats = async () => {
    try {
      console.log('Fetching visitor statistics...');
      const stats = await getVisitorStats();
      console.log('Visitor stats received:', stats);
      setVisitorStats(stats);
    } catch (error) {
      console.error('Error fetching visitor stats:', error);
      toast({
        title: "Error loading statistics",
        description: "Could not load visitor statistics. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleRefresh = async () => {
    // Invalidate Supabase cache
    await supabase.auth.refreshSession();
    
    setRefreshKey(prev => prev + 1);
    toast({
      title: "Refreshing Data",
      description: "Fetching latest data from the database...",
    });
  };
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/admin/login");
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage products, orders, and customers</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} className="mr-2">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
            <Button asChild variant="outline">
              <Link to="/">
                <Home className="mr-2" size={16} />
                Back to Site
              </Link>
            </Button>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 h-14">
            <TabsTrigger value="products" className="flex items-center space-x-2">
              <Package size={18} />
              <span>Products</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <ShoppingCart size={18} />
              <span>Orders</span>
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center space-x-2">
              <Users size={18} />
              <span>Customers</span>
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center space-x-2">
              <ImageIcon size={18} />
              <span>Gallery</span>
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center space-x-2">
              <BarChart size={18} />
              <span>Statistics</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="bg-white p-6 rounded-lg shadow">
            <AdminProducts key={`products-${refreshKey}`} />
          </TabsContent>
          
          <TabsContent value="orders" className="bg-white p-6 rounded-lg shadow">
            <AdminOrders key={`orders-${refreshKey}`} />
          </TabsContent>
          
          <TabsContent value="customers" className="bg-white p-6 rounded-lg shadow">
            <AdminCustomers key={`customers-${refreshKey}`} />
          </TabsContent>
          
          <TabsContent value="gallery" className="bg-white p-6 rounded-lg shadow">
            <AdminGallery key={`gallery-${refreshKey}`} />
          </TabsContent>
          
          <TabsContent value="statistics" className="bg-white p-6 rounded-lg shadow">
            <AdminStatistics key={`statistics-${refreshKey}`} visitorStats={visitorStats} />
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default Admin;
