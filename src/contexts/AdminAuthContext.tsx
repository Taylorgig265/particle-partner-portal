
import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AdminAuthContextType {
  isAuthenticated: boolean;
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

  // Check if the user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        // Check if user has admin role
        const { data: userData } = await supabase.auth.getUser();
        const email = userData.user?.email;
        
        // For now we'll consider only the specific admin email as admin
        // In a real implementation, you'd check against a roles table
        if (email === "admin@example.com") {
          setIsAuthenticated(true);
        } else {
          // If not admin, log them out
          await supabase.auth.signOut();
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        // Check if user has admin role when they sign in
        setTimeout(async () => {
          const { data } = await supabase.auth.getUser();
          const email = data.user?.email;
          
          // For now we'll consider only the specific admin email as admin
          if (email === "admin@example.com") {
            setIsAuthenticated(true);
          } else {
            // If not admin, log them out
            await supabase.auth.signOut();
            setIsAuthenticated(false);
          }
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
      }
    });
    
    checkAuth();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // We only want to allow the admin@example.com account
      if (email !== "admin@example.com") {
        return { success: false, error: "Invalid credentials" };
      }
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Login error:", error.message);
        return { success: false, error: error.message };
      }
      
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error("Unexpected login error:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "An unknown error occurred" 
      };
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error.message);
    }
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
