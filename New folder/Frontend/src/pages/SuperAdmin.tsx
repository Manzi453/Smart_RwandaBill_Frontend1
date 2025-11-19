import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from "recharts";
import { Users, Settings, Shield, TrendingUp, Loader2, Activity } from "lucide-react";
import { getSuperAdminStats, getSuperAdminBillsChart, getSuperAdminUsersChart, getSuperAdminAdminsChart, getSuperAdminSystemHealth } from "@/lib/api";
import SuperadminNavbar from "../components/superadmin/SuperadminNavbar";
import SuperadminProfile from "../components/superadmin/SuperadminProfile";
import SuperadminSettings from "../components/superadmin/SuperadminSettings";
import { SuperAdminTabs } from "../components/superadmin/SuperAdminTabs";
import { ServiceComparison } from "../components/superadmin/ServiceComparison";
import { SystemHealthMonitoring } from "../components/superadmin/SystemHealthMonitoring";

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

// Super Admin Dashboard
const SuperAdminDashboard = () => {
  const { t } = useTranslation();

  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['superAdminStats'],
    queryFn: getSuperAdminStats,
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

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
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <SuperAdminDashboard />;
      case "profile":
        return <SuperadminProfile />;
      case "settings":
        return <SuperadminSettings />;
      default:
        return <SuperAdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SuperadminNavbar
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

export default SuperAdmin;
