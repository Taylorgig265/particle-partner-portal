
import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  currentEmail: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
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
            // Check if user is an admin using our new function
            const { data: isAdminData, error } = await supabase
              .rpc('is_admin_user', { user_uuid: userData.user.id });
            
            if (error) {
              console.error("Error checking admin status:", error);
              setIsAuthenticated(false);
            } else if (isAdminData) {
              console.log("User is verified as admin");
              setIsAuthenticated(true);
            } else {
              console.log("User is not an admin, logging out");
              await supabase.auth.signOut();
              setIsAuthenticated(false);
            }
          } else {
            await supabase.auth.signOut();
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
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
            // Verify admin status
            const { data: isAdminData, error } = await supabase
              .rpc('is_admin_user', { user_uuid: data.user.id });
            
            if (error) {
              console.error("Error checking admin status:", error);
              await supabase.auth.signOut();
              setIsAuthenticated(false);
            } else if (isAdminData) {
              console.log("Admin verified successfully");
              setIsAuthenticated(true);
            } else {
              console.log("User is not an admin");
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
      
      // Verify the user is an admin
      const { data: isAdminData, error: adminError } = await supabase
        .rpc('is_admin_user', { user_uuid: data.user.id });
      
      if (adminError) {
        console.error("Error checking admin status:", adminError);
        await supabase.auth.signOut();
        return { success: false, error: "Error verifying admin access" };
      }
      
      if (!isAdminData) {
        console.log("User is not an admin, denying access");
        await supabase.auth.signOut();
        return { success: false, error: "Access denied. You are not authorized to access the admin panel." };
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
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, isLoading, currentEmail, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
