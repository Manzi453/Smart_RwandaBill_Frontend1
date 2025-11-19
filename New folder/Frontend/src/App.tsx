import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Landing } from "./pages/Landing";
import LoginPage from "./pages/LoginPage";
import { Admin } from "./pages/Admin";
import SignUpPage from "./pages/SignUp";
import { User } from "./pages/User";
import SuperAdmin from "./pages/SuperAdmin";
import { AnimatePresence, motion } from "framer-motion";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const queryClient = new QueryClient();

const RoleProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element; allowedRoles: string[] }) => {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />; // Redirect to member dashboard if unauthorized
    }

    return children;
};

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
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
                        <RoleProtectedRoute allowedRoles={["admin"]}>
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Admin />
                            </motion.div>
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <RoleProtectedRoute allowedRoles={["member"]}>
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -50 }}
                                transition={{ duration: 0.5 }}
                            >
                                <User />
                            </motion.div>
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="/superadmin"
                    element={
                        <RoleProtectedRoute allowedRoles={["superadmin"]}>
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <SuperAdmin />
                            </motion.div>
                        </RoleProtectedRoute>
                    }
                />
            </Routes>
        </AnimatePresence>
    );
}

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Router>
                    <div className="fixed top-4 right-4 z-50">
                        <LanguageSwitcher />
                    </div>
                    <AnimatedRoutes />
                </Router>
            </AuthProvider>
        </QueryClientProvider>
    );
}