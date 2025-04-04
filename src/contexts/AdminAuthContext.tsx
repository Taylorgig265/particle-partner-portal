
import React, { createContext, useState, useContext, useEffect } from "react";

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
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
    const checkAuth = () => {
      const adminAuthenticated = localStorage.getItem("adminAuthenticated");
      const adminAuthTime = localStorage.getItem("adminAuthTime");
      
      if (adminAuthenticated === "true" && adminAuthTime) {
        // Authentication expires after 8 hours
        const authTime = parseInt(adminAuthTime, 10);
        const currentTime = Date.now();
        const eightHoursInMs = 8 * 60 * 60 * 1000;
        
        if (currentTime - authTime < eightHoursInMs) {
          setIsAuthenticated(true);
          return;
        }
      }
      
      // Clear authentication if expired
      localStorage.removeItem("adminAuthenticated");
      localStorage.removeItem("adminAuthTime");
      setIsAuthenticated(false);
    };
    
    checkAuth();
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("adminAuthenticated");
    localStorage.removeItem("adminAuthTime");
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
