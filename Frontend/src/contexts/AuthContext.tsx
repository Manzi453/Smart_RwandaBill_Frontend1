import React, { createContext, useContext, useState } from 'react';

export interface User {
  id: string;
  username?: string;
  fullName?: string;
  email: string;
  telephone: string;
  district: string;
  sector: string;
  roles: string[];
  group?: string;
}

interface AuthContextType {
  user: User | null;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  signup: (data: { fullName: string; email: string; telephone: string; district: string; sector: string; password: string }) => Promise<void>;
  googleSignup: (data: { fullName: string; email: string }) => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      // Mock login - get user from localStorage (set by LoginPage)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        setUser(userData);
      }
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const signup = async (data: { fullName: string; email: string; telephone: string; district: string; sector: string; password: string }) => {
    setIsLoading(true);
    try {
      // Mock signup - data already stored by SignUp page
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error: any) {
      throw new Error(error.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const googleSignup = async (data: { fullName: string; email: string }) => {
    setIsLoading(true);
    try {
      // Mock Google signup
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error: any) {
      throw new Error(error.message || "Google signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, googleSignup, isLoading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
