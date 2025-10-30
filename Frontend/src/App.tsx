import React, { Suspense, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Landing } from "./pages/Landing";
import LoginPage from "./pages/LoginPage";
import { Admin } from "./pages/Admin";
import SignUpPage from "./pages/SignUp";
import { User } from "./pages/User";
import SuperAdmin from "./pages/SuperAdmin";
import { AnimatePresence, motion } from "framer-motion";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { toast, Toaster } from "sonner";

const queryClient = new QueryClient();

// Auth context for the application
export const AuthContext = React.createContext<{
  isAuthenticated: boolean;
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}>({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
});

export const useAuth = () => React.useContext(AuthContext);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userStr = localStorage.getItem('user');
          if (userStr) {
            const userData = JSON.parse(userStr);
            setUser(userData);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Mock login - already handled in LoginPage
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setIsAuthenticated(true);
        toast.success('Login successful!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected route component
const ProtectedRoute = ({ 
  children, 
  requiredRoles = [] 
}: { 
  children: JSX.Element;
  requiredRoles?: string[];
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRoles.length > 0) {
    const userRoles = user?.roles || [];
    const hasRequiredRole = userRoles.some((role: string) => requiredRoles.includes(role));
    if (!hasRequiredRole) {
      toast.error('You do not have permission to access this page');
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Toaster position="top-right" richColors />
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
            >
              <Landing />
            </motion.div>
          }
        />
        <Route
          path="/login"
          element={
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
            >
              <LoginPage />
            </motion.div>
          }
        />
        <Route
          path="/signup"
          element={
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
            >
              <SignUpPage/>
            </motion.div>
          }
        />
        <Route
          path="/admin"
          element={
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Admin />
            </motion.div>
          }
        />
        <Route
          path="/dashboard"
          element={
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
            >
              <User />
            </motion.div>
          }
        />
        <Route
          path="/superadmin"
          element={
            <ProtectedRoute>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <SuperAdmin />
              </motion.div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50 relative">
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            }>
              <AnimatedRoutes />
            </Suspense>
          </div>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}
