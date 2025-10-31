import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Users, DollarSign, Clock, TrendingUp, LogOut, Activity, Search, Download } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { mockStatistics, mockBills, mockUsers } from "@/lib/mockData";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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

// Admin Dashboard
const AdminDashboard = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const statCards = [
    {
      label: t("totalUsers") || "Total Users",
      value: mockStatistics.activeUsers.toLocaleString(),
      change: "+5%",
      icon: Users,
      tooltip: t("totalUsers") || "Total Users",
    },
    {
      label: t("pendingPayments") || "Pending Payments",
      value: mockStatistics.pendingBills.toString(),
      change: "-2%",
      icon: Clock,
      tooltip: t("pendingPayments") || "Pending Payments",
    },
    {
      label: t("processedPayments") || "Processed Payments",
      value: mockStatistics.paidBills.toString(),
      change: "+12%",
      icon: TrendingUp,
      tooltip: t("processedPayments") || "Processed Payments",
    },
    {
      label: t("revenue") || "Revenue",
      value: `${(mockStatistics.totalRevenue / 1000000).toFixed(1)}M RWF`,
      change: "+8%",
      icon: DollarSign,
      tooltip: t("revenue") || "Revenue",
    }
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <AnimatedPage>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t("adminDashboard")}</h1>
            <p className="text-muted-foreground mt-2">{user?.username || 'Admin'} - {user?.email || 'admin@example.com'}</p>
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
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xl font-semibold mb-4">Bills Overview</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[
                { name: 'Paid', value: mockStatistics.paidBills },
                { name: 'Pending', value: mockStatistics.pendingBills },
                { name: 'Overdue', value: mockStatistics.overdueBills }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="bg-card p-6 rounded-xl shadow-soft border"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4">Collection Rate</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Collected', value: mockStatistics.collectionRate },
                    { name: 'Pending', value: 100 - mockStatistics.collectionRate }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${Number(value).toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill="#82ca9d" />
                  <Cell fill="#ffc658" />
                </Pie>
                <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <motion.div
            className="bg-card p-6 rounded-xl shadow-soft border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-xl font-semibold mb-4">Recent Bills</h2>
            <div className="space-y-4">
              {mockBills.slice(0, 3).map(bill => (
                <div key={bill.id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{bill.billNumber}</p>
                    <p className="text-sm text-muted-foreground">{bill.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{bill.amount} RWF</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      bill.status === 'paid' ? 'bg-green-100 text-green-800' :
                      bill.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {bill.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="bg-card p-6 rounded-xl shadow-soft border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Settings</h2>
              <Button onClick={handleLogout} variant="destructive" size="sm" className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
            <div className="space-y-3 text-sm">
              <p><strong>User:</strong> {user?.username || 'Admin'}</p>
              <p><strong>Email:</strong> {user?.email || 'admin@example.com'}</p>
              <p><strong>Role:</strong> {user?.roles?.[0] || 'ROLE_ADMIN'}</p>
              <p><strong>Total Bills:</strong> {mockStatistics.totalBills}</p>
              <p><strong>Collection Rate:</strong> {mockStatistics.collectionRate}%</p>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
};

// Users Section
const UsersSection = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AnimatedPage>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-foreground">{t("usersManagement")}</h1>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder={t("searchUsers")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder={t("filterByStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allStatuses")}</SelectItem>
              <SelectItem value="active">{t("active")}</SelectItem>
              <SelectItem value="inactive">{t("inactive")}</SelectItem>
              <SelectItem value="pending">{t("pending")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-card rounded-xl shadow-soft border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("name")}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("email")}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("lastPayment")}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("status")}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{user.firstName} {user.lastName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{user.phoneNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Button variant="outline" size="sm">{t("view") || "View"}</Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-muted-foreground">{t("noUsersFound") || "No users found"}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

// Payments Section
const PaymentsSection = () => {
  const { t } = useTranslation();

  const handleExport = () => {
    toast.success(t("exportStarted") || "Export started");
  };

  return (
    <AnimatedPage>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">{t("paymentsManagement")}</h1>
          <Button onClick={handleExport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            {t("export")}
          </Button>
        </div>

        <div className="bg-card rounded-xl shadow-soft border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("user")}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("service")}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("amount")}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("status")}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("date")}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockBills.length > 0 ? (
                  mockBills.map(bill => (
                    <tr key={bill.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{bill.customerName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{bill.service}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{bill.amount} RWF</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          bill.status === 'paid' ? 'bg-green-100 text-green-800' :
                          bill.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {bill.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{bill.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Button variant="outline" size="sm">{t("view") || "View"}</Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-muted-foreground">{t("noPaymentsFound") || "No payments found"}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

// Settings Section
const SettingsSection = () => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(false);

  const handleSave = () => {
    toast.success(t("settingsSaved"));
  };

  return (
    <AnimatedPage>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-foreground">{t("adminSettings")}</h1>

        <div className="bg-card rounded-xl shadow-soft border p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">{t("emailNotifications")}</Label>
              <p className="text-sm text-muted-foreground">{t("emailNotificationsDesc")}</p>
            </div>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="backup">{t("autoBackup")}</Label>
              <p className="text-sm text-muted-foreground">{t("autoBackupDesc")}</p>
            </div>
            <Switch
              id="backup"
              checked={autoBackup}
              onCheckedChange={setAutoBackup}
            />
          </div>

          <div className="pt-4">
            <Button onClick={handleSave}>{t("saveSettings")}</Button>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

// Main Admin component
const Admin = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <AdminDashboard />;
      case "users":
        return <UsersSection />;
      case "payments":
        return <PaymentsSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <AdminNavbar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "md:ml-20" : "md:ml-64"}`}>
        <AnimatePresence mode="wait">
          {renderActiveSection()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export { Admin };
