import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { getUserStats, getUserPayments, getUserPaymentHistory, getUserNotifications } from "@/lib/api";
import UserNavbar from "../components/user/UserNavbar";
import UserProfile from "../components/user/UserProfile";
import UserSettings from "../components/user/UserSettings";
import { EnhancedDashboard } from "../components/user/EnhancedDashboard";

// Animation variants
const pageVariants = {
    initial: { opacity: 0, x: -20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: 20 }
};

const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 1
};

// Animated component wrapper
const AnimatedPage = ({ children }) => (
    <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
    >
        {children}
    </motion.div>
);

// Main User component with navbar and sections
const User = () => {
    const [activeSection, setActiveSection] = useState("dashboard");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const renderSection = () => {
        switch (activeSection) {
            case "dashboard":
                return <EnhancedDashboard />;
            case "profile":
                return <UserProfile />;
            case "settings":
                return <UserSettings />;
            default:
                return <EnhancedDashboard />;
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <UserNavbar
                activeSection={activeSection}
                onSectionChange={setActiveSection}
                collapsed={sidebarCollapsed}
                onCollapsedChange={setSidebarCollapsed}
            />

            {/* Main Content Area */}
            <div className={`transition-all duration-300 ${
                sidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
            }`}>
                <div className="min-h-screen">
                    <AnimatePresence mode="wait">
                        <AnimatedPage key={activeSection}>
                            {renderSection()}
                        </AnimatedPage>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export { User };