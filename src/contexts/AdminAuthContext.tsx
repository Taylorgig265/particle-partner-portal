
import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  currentEmail: string | null;
  adminStatus: 'pending' | 'approved' | 'rejected' | null;
  isSuperAdmin: boolean;
  privileges: {
    canManageProducts: boolean;
    canProcessOrders: boolean;
    canAccessClients: boolean;
    canViewStatistics: boolean;
  };
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkPrivilege: (privilege: string) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};

interface AdminAuthProviderProps {
  children: React.ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [adminStatus, setAdminStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [privileges, setPrivileges] = useState({
    canManageProducts: false,
    canProcessOrders: false,
    canAccessClients: false,
    canViewStatistics: false,
  });

  const checkPrivilege = (privilege: string) => {
    switch (privilege) {
      case 'manage_products':
        return privileges.canManageProducts;
      case 'process_orders':
        return privileges.canProcessOrders;
      case 'access_clients':
        return privileges.canAccessClients;
      case 'view_statistics':
        return privileges.canViewStatistics;
      case 'super_admin':
        return isSuperAdmin;
      default:
        return false;
    }
  };

  const fetchAdminDetails = async (userId: string) => {
    try {
      const { data: adminData, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error("Error fetching admin details:", error);
        return null;
      }

      return adminData;
    } catch (error) {
      console.error("Error in fetchAdminDetails:", error);
      return null;
    }
  };

  // Check if the user is authenticated and is an admin
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          const { data: userData } = await supabase.auth.getUser();
          const email = userData.user?.email;
          
          console.log("Logged in user email:", email);
          setCurrentEmail(email || null);
          
          if (email && userData.user) {
            // Get admin details
            const adminDetails = await fetchAdminDetails(userData.user.id);
            
            if (adminDetails) {
              // Type assertion for status to ensure proper typing
              const typedStatus = adminDetails.status as 'pending' | 'approved' | 'rejected';
              setAdminStatus(typedStatus);
              setIsSuperAdmin(adminDetails.is_super_admin || false);
              setPrivileges({
                canManageProducts: adminDetails.can_manage_products || false,
                canProcessOrders: adminDetails.can_process_orders || false,
                canAccessClients: adminDetails.can_access_clients || false,
                canViewStatistics: adminDetails.can_view_statistics || false,
              });

              if (typedStatus === 'approved') {
                console.log("User is approved admin");
                setIsAuthenticated(true);
              } else {
                console.log(`User admin status: ${typedStatus}`);
                setIsAuthenticated(false);
              }
            } else {
              console.log("User is not registered as admin");
              await supabase.auth.signOut();
              setIsAuthenticated(false);
            }
          } else {
            await supabase.auth.signOut();
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
          setAdminStatus(null);
          setIsSuperAdmin(false);
          setPrivileges({
            canManageProducts: false,
            canProcessOrders: false,
            canAccessClients: false,
            canViewStatistics: false,
          });
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Admin auth state change:", event, session?.user?.email);
      
      if (event === 'SIGNED_IN') {
        setTimeout(async () => {
          const { data } = await supabase.auth.getUser();
          const email = data.user?.email;
          
          console.log("Admin user signed in:", email);
          setCurrentEmail(email || null);
          
          if (email && data.user) {
            // Get admin details
            const adminDetails = await fetchAdminDetails(data.user.id);
            
            if (adminDetails) {
              // Type assertion for status to ensure proper typing
              const typedStatus = adminDetails.status as 'pending' | 'approved' | 'rejected';
              setAdminStatus(typedStatus);
              setIsSuperAdmin(adminDetails.is_super_admin || false);
              setPrivileges({
                canManageProducts: adminDetails.can_manage_products || false,
                canProcessOrders: adminDetails.can_process_orders || false,
                canAccessClients: adminDetails.can_access_clients || false,
                canViewStatistics: adminDetails.can_view_statistics || false,
              });

              if (typedStatus === 'approved') {
                console.log("Admin verified successfully");
                setIsAuthenticated(true);
              } else {
                console.log(`Admin status: ${typedStatus}`);
                setIsAuthenticated(false);
              }
            } else {
              console.log("User is not registered as admin");
              await supabase.auth.signOut();
              setIsAuthenticated(false);
            }
          } else {
            await supabase.auth.signOut();
            setIsAuthenticated(false);
          }
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        console.log("Admin user signed out");
        setIsAuthenticated(false);
        setCurrentEmail(null);
        setAdminStatus(null);
        setIsSuperAdmin(false);
        setPrivileges({
          canManageProducts: false,
          canProcessOrders: false,
          canAccessClients: false,
          canViewStatistics: false,
        });
      }
    });
    
    checkAuth();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting admin login with email:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Admin login error:", error.message);
        return { success: false, error: error.message };
      }
      
      if (!data.session || !data.user) {
        return { success: false, error: "No session returned from authentication" };
      }
      
      // Get admin details
      const adminDetails = await fetchAdminDetails(data.user.id);
      
      if (!adminDetails) {
        console.log("User is not registered as admin");
        await supabase.auth.signOut();
        return { success: false, error: "Access denied. You are not registered as an admin." };
      }
      
      // Type assertion for status to ensure proper typing
      const typedStatus = adminDetails.status as 'pending' | 'approved' | 'rejected';
      setAdminStatus(typedStatus);
      setIsSuperAdmin(adminDetails.is_super_admin || false);
      setPrivileges({
        canManageProducts: adminDetails.can_manage_products || false,
        canProcessOrders: adminDetails.can_process_orders || false,
        canAccessClients: adminDetails.can_access_clients || false,
        canViewStatistics: adminDetails.can_view_statistics || false,
      });

      if (typedStatus !== 'approved') {
        await supabase.auth.signOut();
        const statusMessage = typedStatus === 'pending' 
          ? "Your admin account is pending approval. Please wait for a super admin to approve your access."
          : "Your admin account has been rejected. Please contact a super admin.";
        return { success: false, error: statusMessage };
      }
      
      console.log("Admin login successful:", data.user?.email);
      setCurrentEmail(data.user?.email || null);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error("Unexpected admin login error:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "An unknown error occurred" 
      };
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Admin logout error:", error.message);
    }
    setIsAuthenticated(false);
    setCurrentEmail(null);
    setAdminStatus(null);
    setIsSuperAdmin(false);
    setPrivileges({
      canManageProducts: false,
      canProcessOrders: false,
      canAccessClients: false,
      canViewStatistics: false,
    });
  };

  return (
    <AdminAuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading, 
      currentEmail, 
      adminStatus,
      isSuperAdmin,
      privileges,
      login, 
      logout, 
      checkPrivilege 
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
