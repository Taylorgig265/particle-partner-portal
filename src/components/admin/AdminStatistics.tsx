
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderAnalytics from "./statistics/OrderAnalytics";
import VisitorAnalytics from "./statistics/VisitorAnalytics";

interface AdminStatisticsProps {
  visitorStats?: any; // Optional prop for visitor statistics
}

const AdminStatistics: React.FC<AdminStatisticsProps> = ({ visitorStats }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      
      <Tabs defaultValue="orders">
        <TabsList className="mb-4 grid w-full grid-cols-2">
          <TabsTrigger value="orders">Order Analytics</TabsTrigger>
          <TabsTrigger value="visitors">Visitor Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders">
          <OrderAnalytics />
        </TabsContent>
        
        <TabsContent value="visitors">
          <VisitorAnalytics visitorStats={visitorStats} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminStatistics;
