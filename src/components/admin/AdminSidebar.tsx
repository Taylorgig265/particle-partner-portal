
import { useState } from "react";
import { 
  Package, 
  ShoppingCart, 
  Users,
  Home,
  BarChart,
  ImageIcon,
  Shield,
  LogOut
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
  const { logout, privileges, isSuperAdmin, checkPrivilege, currentEmail } = useAdminAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="font-semibold text-sm">Admin Panel</h2>
            <p className="text-xs text-muted-foreground">{currentEmail}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {availableTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <SidebarMenuItem key={tab.id}>
                    <SidebarMenuButton
                      onClick={() => onTabChange(tab.id)}
                      isActive={activeTab === tab.id}
                      className="w-full justify-start"
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {tab.label}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-2">
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Site
          </Link>
        </Button>
        <Button variant="destructive" size="sm" onClick={handleLogout} className="w-full">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
