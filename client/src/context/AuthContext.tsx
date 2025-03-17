import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// const BASE_URL = 'http://localhost:5000'


const BASE_URL = import.meta.env.VITE_APP_SERVER_URI;



type User = {
  id: string;
  name: string;
  mobile: string;
  isAdmin: boolean;
  isPendingApproval?: boolean;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isPendingApproval: boolean;
  login: (mobile: string, password: string) => Promise<boolean>;
  register: (name: string, mobile: string, password: string, isAdmin: boolean) => Promise<boolean>;
  logout: () => void;
  authLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem("ecommerceUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user", error);
        localStorage.removeItem("ecommerceUser");
      }
    }
    setAuthLoading(false);
  }, []);

  const login = async (mobile: string, password: string): Promise<boolean> => {
    setAuthLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile, password }),
      });
      console.log(response);

      if (!response.ok) throw new Error("Invalid credentials");

      const userData = await response.json();
      if (userData.isPendingApproval) {
        toast({
          title: "Admin access pending",
          description: "Your admin account is pending approval by the head admin.",
          variant: "destructive",
        });
        setAuthLoading(false);
        return false;
      }

      setUser(userData);
      localStorage.setItem("ecommerceUser", JSON.stringify(userData));
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.name}!`,
      });

      return true;
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (name: string, mobile: string, password: string, isAdmin: boolean): Promise<boolean> => {
    setAuthLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, mobile, password, isAdmin }),
      });

      if (!response.ok) throw new Error("Registration failed");

      toast({
        title: "Registration successful",
        description: "Your account has been created.",
      });

      return true;
    } catch (error) {
      console.log(error);
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ecommerceUser");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    isPendingApproval: user?.isPendingApproval || false,
    login,
    register,
    logout,
    authLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
