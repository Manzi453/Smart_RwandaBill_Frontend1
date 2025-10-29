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

  const { data: billsChart, isLoading: billsLoading } = useQuery({
    queryKey: ['superAdminBillsChart'],
    queryFn: getSuperAdminBillsChart,
  });

  const { data: usersChart, isLoading: usersLoading } = useQuery({
    queryKey: ['superAdminUsersChart'],
    queryFn: getSuperAdminUsersChart,
  });

  const { data: adminsChart, isLoading: adminsLoading } = useQuery({
    queryKey: ['superAdminAdminsChart'],
    queryFn: getSuperAdminAdminsChart,
  });

  const { data: systemHealth, isLoading: healthLoading } = useQuery({
    queryKey: ['superAdminSystemHealth'],
    queryFn: getSuperAdminSystemHealth,
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const statCards = [
    {
      label: t("totalUsers"),
      value: stats ? stats.totalUsers.toLocaleString() : t("loading"),
      change: "+8%",
      icon: Users,
      tooltip: t("totalUsersTooltip")
    },
    {
      label: t("totalBills"),
      value: stats ? stats.totalBills.toLocaleString() : t("loading"),
      change: "+15%",
      icon: TrendingUp,
      tooltip: t("totalBillsTooltip")
    },
    {
      label: t("totalAdmins"),
      value: stats ? stats.totalAdmins.toString() : t("loading"),
      change: "+12%",
      icon: Shield,
      tooltip: t("totalAdminsTooltip")
    },
    {
      label: t("systemHealth"),
      value: stats ? `${stats.systemHealth}%` : t("loading"),
      change: "+2.1%",
      icon: Activity,
      tooltip: t("systemHealthTooltip")
    }
  ];

  // Scroll direction state
  const [scrollDirection, setScrollDirection] = useState(null);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      if (scrollY > lastScrollY) {
        setScrollDirection("down");
      } else if (scrollY < lastScrollY) {
        setScrollDirection("up");
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener("scroll", updateScrollDirection);

    return () => {
      window.removeEventListener("scroll", updateScrollDirection);
    };
  }, []);

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <motion.div
            className="bg-card p-6 rounded-xl shadow-soft border"
            initial={{ opacity: 0, x: scrollDirection === "down" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold mb-4">Monthly Bills Growth</h2>
            {billsLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="animate-spin h-8 w-8" />
              </div>
            ) : billsChart ? (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={billsChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}`, 'Bills']} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                    name="Bills Count"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                <span className="text-muted-foreground">No data available</span>
              </div>
            )}
          </motion.div>

          <motion.div
            className="bg-card p-6 rounded-xl shadow-soft border"
            initial={{ opacity: 0, x: scrollDirection === "down" ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4">User Distribution</h2>
            {usersLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="animate-spin h-8 w-8" />
              </div>
            ) : usersChart ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={usersChart}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {usersChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} users`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                <span className="text-muted-foreground">No data available</span>
              </div>
            )}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            className="bg-card p-6 rounded-xl shadow-soft border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-xl font-semibold mb-4">Admin Status Overview</h2>
            {adminsLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="animate-spin h-8 w-8" />
              </div>
            ) : adminsChart ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={adminsChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} admins`, 'Count']} />
                  <Legend />
                  <Bar dataKey="value" fill="#82ca9d" name="Admin Count" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                <span className="text-muted-foreground">No data available</span>
              </div>
            )}
          </motion.div>

          <motion.div
            className="bg-card p-6 rounded-xl shadow-soft border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-xl font-semibold mb-4">System Health Metrics</h2>
            {healthLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="animate-spin h-8 w-8" />
              </div>
            ) : systemHealth ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={systemHealth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip formatter={(value) => [`${value}%`, 'Health']} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#ff7300"
                    strokeWidth={2}
                    dot={{ fill: '#ff7300' }}
                    name="System Health"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                <span className="text-muted-foreground">No data available</span>
              </div>
            )}
          </motion.div>
        </div>

        <motion.div
          className="bg-card p-6 rounded-xl shadow-soft border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-xl font-semibold mb-4">Recent System Activities</h2>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Settings className="h-4 w-4 text-primary" />
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">New bill processed</p>
                    <p className="text-sm text-muted-foreground">User ID: 12345</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">2 hours ago</span>
              </div>
            ))}
          </div>
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
