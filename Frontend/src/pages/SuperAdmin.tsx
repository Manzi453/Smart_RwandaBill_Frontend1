import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Users, Settings, Shield, TrendingUp, LogOut, Activity, Cog, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { mockStatistics, mockUsers, mockBills } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import SuperadminNavbar from "../components/superadmin/SuperadminNavbar";
import SuperadminProfile from "../components/superadmin/SuperadminProfile";
import SuperadminSettings from "../components/superadmin/SuperadminSettings";
import { toast } from "sonner";

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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const statCards = [
    {
      label: t("totalUsers") || "Total Users",
      value: mockStatistics.activeUsers.toLocaleString(),
      change: "+8%",
      icon: Users,
    },
    {
      label: t("totalBills") || "Total Bills",
      value: mockStatistics.totalBills.toLocaleString(),
      change: "+15%",
      icon: TrendingUp,
    },
    {
      label: t("totalAdmins") || "Total Admins",
      value: mockUsers.filter(u => u.role === 'admin').length.toString(),
      change: "+12%",
      icon: Shield,
    },
    {
      label: t("systemHealth") || "System Health",
      value: "98%",
      change: "+2.1%",
      icon: Activity,
    }
  ];

  return (
    <AnimatedPage>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t("systemOverview") || "System Overview"}</h1>
            <p className="text-muted-foreground mt-2">{user?.username || 'SuperAdmin'} - {user?.email || 'admin@example.com'} - ID: {user?.id || 'N/A'}</p>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • {currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          </div>
          <Button onClick={handleLogout} variant="destructive" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-card rounded-xl p-6 shadow-soft border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              title={stat.label}
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
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold mb-4">Monthly Bills Growth</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={[
                { name: 'Week 1', value: 400 },
                { name: 'Week 2', value: 500 },
                { name: 'Week 3', value: 600 },
                { name: 'Week 4', value: 700 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" name="Bills" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="bg-card p-6 rounded-xl shadow-soft border"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4">User Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Active Users', value: mockStatistics.activeUsers },
                    { name: 'Inactive Users', value: 500 }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#82ca9d" />
                  <Cell fill="#ffc658" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
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
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[
                { name: 'Active', value: 5 },
                { name: 'Inactive', value: 2 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" name="Admin Count" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="bg-card p-6 rounded-xl shadow-soft border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className="text-xl font-semibold mb-4">System Health Metrics</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={[
                { name: 'Mon', value: 95 },
                { name: 'Tue', value: 98 },
                { name: 'Wed', value: 96 },
                { name: 'Thu', value: 99 }
              ]}>
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
                  name="System Health"
                />
              </LineChart>
            </ResponsiveContainer>
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
                    <Cog className="h-4 w-4 text-primary" />
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
  return (
    <AnimatePresence mode="wait">
      <SuperAdminDashboard />
    </AnimatePresence>
  );
};

export default SuperAdmin;
