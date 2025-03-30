
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Package, 
  ShoppingCart, 
  Users,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminCustomers from "@/components/admin/AdminCustomers";
import { Link } from "react-router-dom";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("products");
  
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
          <Button asChild variant="outline">
            <Link to="/">
              <Home className="mr-2" size={16} />
              Back to Site
            </Link>
          </Button>
        </header>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 h-14">
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
          </TabsList>
          
          <TabsContent value="products" className="bg-white p-6 rounded-lg shadow">
            <AdminProducts />
          </TabsContent>
          
          <TabsContent value="orders" className="bg-white p-6 rounded-lg shadow">
            <AdminOrders />
          </TabsContent>
          
          <TabsContent value="customers" className="bg-white p-6 rounded-lg shadow">
            <AdminCustomers />
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default Admin;
