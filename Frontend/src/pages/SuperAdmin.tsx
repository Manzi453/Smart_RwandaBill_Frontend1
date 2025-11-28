import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Users, Shield, TrendingUp, Activity } from "lucide-react";
import { getSuperAdminStats } from "@/lib/api";
import SuperadminNavbar from "../components/superadmin/SuperadminNavbar";
import { SuperAdminTabs } from "../components/superadmin/SuperAdminTabs";
import { ServiceComparison } from "../components/superadmin/ServiceComparison";
import { SystemHealthMonitoring } from "../components/superadmin/SystemHealthMonitoring";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

// Navigation types will be handled by the SuperadminNavbar component

// Animation variants
const pageVariants = {
  initial: { opacity: 0, x: -20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: 20 }
};

// Animated component wrapper
const AnimatedPage = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
  >
    {children}
  </motion.div>
);

// Super Admin Dashboard
const SuperAdminDashboard = () => {
  const { t } = useTranslation();

  const { data: stats, error: statsError } = useQuery({
    queryKey: ['superAdminStats'],
    queryFn: getSuperAdminStats,
  });

  const statCards = [
    {
      label: t("totalUsers"),
      value: stats ? stats.totalUsers.toLocaleString() : t("loading"),
      change: `+${stats?.monthlyGrowth || 8}%`,
      icon: Users,
      tooltip: t("totalUsersTooltip")
    },
    {
      label: "Total Revenue",
      value: stats ? `${(stats.totalRevenue / 1000000).toFixed(1)}M RWF` : t("loading"),
      change: "+12%",
      icon: TrendingUp,
      tooltip: "Total revenue across all services"
    },
    {
      label: t("totalAdmins"),
      value: stats ? stats.totalAdmins.toString() : t("loading"),
      change: "+5%",
      icon: Shield,
      tooltip: t("totalAdminsTooltip")
    },
    {
      label: "Collection Rate",
      value: stats ? `${stats.collectionRate}%` : t("loading"),
      change: "+1.2%",
      icon: Activity,
      tooltip: "Payment collection rate"
    }
  ];

  if (statsError) {
    return (
      <div className="p-6">
        <div className="text-center text-red-600">
          {t("errorLoadingSuperAdminData")}: {statsError.message}
        </div>
      </div>
    );
  }

  return (
    <AnimatedPage>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-foreground">{t("systemOverview")}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-card rounded-xl p-6 shadow-soft border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              title={stat.tooltip}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* New Tab Navigation with Enhanced Components */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <SuperAdminTabs>
            {/* Overview content is handled by SuperAdminTabs */}
          </SuperAdminTabs>
        </motion.div>

        {/* Service Comparison Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <ServiceComparison />
        </motion.div>

        {/* System Health Monitoring Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <SystemHealthMonitoring />
        </motion.div>
      </div>
    </AnimatedPage>
  );
};

// Main Superadmin component with navbar and sections
const SuperAdmin = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const navigate = useNavigate();

  // Update active section when URL changes
  useEffect(() => {
    const path = window.location.pathname;
    setActiveSection(path.includes('approvals') ? 'approvals' : 'dashboard');
  }, []);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    if (section === 'approvals') {
      navigate('/approvals');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SuperadminNavbar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />
      
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
        <div className={`transition-all duration-300 ${
          sidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
        }`}>
          <div className="min-h-screen p-6">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<SuperAdminDashboard />} />
                <Route path="/approvals" element={
                  <div className="container mx-auto p-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Admin Approvals</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>Admin approval requests will be listed here.</p>
                        {/* Add your admin approval logic and UI components here */}
                      </CardContent>
                    </Card>
                  </div>
                } />
              </Routes>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuperAdmin;
