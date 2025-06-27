
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminCustomers from "@/components/admin/AdminCustomers";
import AdminStatistics from "@/components/admin/AdminStatistics";
import AdminGallery from "@/components/admin/AdminGallery";
import AdminManagement from "@/components/admin/AdminManagement";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { getVisitorStats } from '@/services/visitor-service';
import { useAdminAuth } from "@/contexts/AdminAuthContext";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("statistics");
  const [refreshKey, setRefreshKey] = useState(0);
  const [visitorStats, setVisitorStats] = useState<any>(null);
  const { toast } = useToast();
  const { privileges, isSuperAdmin, checkPrivilege } = useAdminAuth();
  
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

  const renderTabContent = () => {
    switch (activeTab) {
      case "statistics":
        if (checkPrivilege('view_statistics')) {
          return <AdminStatistics key={`statistics-${refreshKey}`} visitorStats={visitorStats} />;
        }
        break;
      case "products":
        if (checkPrivilege('manage_products')) {
          return <AdminProducts key={`products-${refreshKey}`} />;
        }
        break;
      case "orders":
        if (checkPrivilege('process_orders')) {
          return <AdminOrders key={`orders-${refreshKey}`} />;
        }
        break;
      case "customers":
        if (checkPrivilege('access_clients')) {
          return <AdminCustomers key={`customers-${refreshKey}`} />;
        }
        break;
      case "gallery":
        return <AdminGallery key={`gallery-${refreshKey}`} />;
      case "management":
        if (isSuperAdmin) {
          return <AdminManagement key={`management-${refreshKey}`} />;
        }
        break;
      default:
        return <div>Select a section from the sidebar</div>;
    }
    return <div>Access denied for this section</div>;
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case "statistics": return "Dashboard Statistics";
      case "products": return "Product Management";
      case "orders": return "Order Management";
      case "customers": return "Customer Management";
      case "gallery": return "Gallery Management";
      case "management": return "Admin Management";
      default: return "Admin Dashboard";
    }
  };
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <SidebarInset className="flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1">
              <h1 className="text-xl font-semibold">{getTabTitle()}</h1>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </header>
          
          <main className="flex-1 p-6">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  {renderTabContent()}
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
