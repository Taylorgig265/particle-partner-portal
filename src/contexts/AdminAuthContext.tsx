
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

  // Check if the user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          // User is logged in, now check if they're an admin
          const { data: userData } = await supabase.auth.getUser();
          const email = userData.user?.email;
          
          console.log("Logged in user email:", email);
          setCurrentEmail(email || null);
          
          if (email) {
            // Here we could check against a table of admin users or emails
            // For now we'll just authenticate the user
            setIsAuthenticated(true);
          } else {
            // Not an admin, log them out
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
      console.log("Auth state change:", event, session?.user?.email);
      
      if (event === 'SIGNED_IN') {
        // Use setTimeout to avoid potential deadlocks with Supabase auth
        setTimeout(async () => {
          const { data } = await supabase.auth.getUser();
          const email = data.user?.email;
          
          console.log("User signed in:", email);
          setCurrentEmail(email || null);
          
          if (email) {
            setIsAuthenticated(true);
          } else {
            await supabase.auth.signOut();
            setIsAuthenticated(false);
          }
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
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
      console.log("Attempting login with email:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Login error:", error.message);
        return { success: false, error: error.message };
      }
      
      if (!data.session) {
        return { success: false, error: "No session returned from authentication" };
      }
      
      console.log("Login successful:", data.user?.email);
      setCurrentEmail(data.user?.email || null);
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
    setCurrentEmail(null);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, isLoading, currentEmail, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
