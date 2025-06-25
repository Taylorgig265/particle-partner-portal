
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
  ImageIcon,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminCustomers from "@/components/admin/AdminCustomers";
import AdminStatistics from "@/components/admin/AdminStatistics";
import AdminGallery from "@/components/admin/AdminGallery";
import AdminManagement from "@/components/admin/AdminManagement";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { getVisitorStats } from '@/services/visitor-service';
import { useAdminAuth } from "@/contexts/AdminAuthContext";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("statistics");
  const [refreshKey, setRefreshKey] = useState(0);
  const [visitorStats, setVisitorStats] = useState<any>(null);
  const { toast } = useToast();
  const { logout, privileges, isSuperAdmin, checkPrivilege } = useAdminAuth();
  const navigate = useNavigate();
  
  // Set default tab based on permissions
  useEffect(() => {
    if (checkPrivilege('view_statistics')) {
      setActiveTab("statistics");
    } else if (checkPrivilege('manage_products')) {
      setActiveTab("products");
    } else if (checkPrivilege('process_orders')) {
      setActiveTab("orders");
    } else if (checkPrivilege('access_clients')) {
      setActiveTab("customers");
    } else {
      setActiveTab("gallery"); // Gallery is always accessible
    }
  }, [privileges, isSuperAdmin]);
  
  // Refresh content when tab changes
  useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, [activeTab]);

  // Load visitor stats when on statistics tab
  useEffect(() => {
    if (activeTab === "statistics" && checkPrivilege('view_statistics')) {
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

  // Get available tabs based on permissions
  const getAvailableTabs = () => {
    const tabs = [];
    
    if (checkPrivilege('view_statistics')) {
      tabs.push({ id: "statistics", label: "Statistics", icon: BarChart });
    }
    
    if (checkPrivilege('manage_products')) {
      tabs.push({ id: "products", label: "Products", icon: Package });
    }
    
    if (checkPrivilege('process_orders')) {
      tabs.push({ id: "orders", label: "Orders", icon: ShoppingCart });
    }
    
    if (checkPrivilege('access_clients')) {
      tabs.push({ id: "customers", label: "Customers", icon: Users });
    }
    
    // Gallery is always accessible to approved admins
    tabs.push({ id: "gallery", label: "Gallery", icon: ImageIcon });
    
    if (isSuperAdmin) {
      tabs.push({ id: "management", label: "Admin Management", icon: Shield });
    }
    
    return tabs;
  };

  const availableTabs = getAvailableTabs();
  
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
            <p className="text-gray-600">
              {isSuperAdmin && "Super Admin - Full Access"}
              {!isSuperAdmin && `Manage ${availableTabs.map(t => t.label.toLowerCase()).join(', ')}`}
            </p>
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
          <TabsList className={`grid w-full h-14 grid-cols-${availableTabs.length}`}>
            {availableTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger key={tab.id} value={tab.id} className="flex items-center space-x-2">
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
          
          {checkPrivilege('view_statistics') && (
            <TabsContent value="statistics" className="bg-white p-6 rounded-lg shadow">
              <AdminStatistics key={`statistics-${refreshKey}`} visitorStats={visitorStats} />
            </TabsContent>
          )}
          
          {checkPrivilege('manage_products') && (
            <TabsContent value="products" className="bg-white p-6 rounded-lg shadow">
              <AdminProducts key={`products-${refreshKey}`} />
            </TabsContent>
          )}
          
          {checkPrivilege('process_orders') && (
            <TabsContent value="orders" className="bg-white p-6 rounded-lg shadow">
              <AdminOrders key={`orders-${refreshKey}`} />
            </TabsContent>
          )}
          
          {checkPrivilege('access_clients') && (
            <TabsContent value="customers" className="bg-white p-6 rounded-lg shadow">
              <AdminCustomers key={`customers-${refreshKey}`} />
            </TabsContent>
          )}
          
          <TabsContent value="gallery" className="bg-white p-6 rounded-lg shadow">
            <AdminGallery key={`gallery-${refreshKey}`} />
          </TabsContent>
          
          {isSuperAdmin && (
            <TabsContent value="management" className="bg-white p-6 rounded-lg shadow">
              <AdminManagement key={`management-${refreshKey}`} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </motion.div>
  );
};

export default Admin;
