import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  AlertCircle,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Zap,
  Droplets,
  Shield,
  Trash2,
  CheckCircle,
  XCircle,
  Download,
  Filter,
  Settings,
  BarChart3,
  PieChart as PieChartIcon,
  Loader2,
  FileText,
  Plus,
  Search,
  Eye,
  Edit2,
  Trash,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

interface ServiceAdminDashboardProps {
  onSectionChange?: (section: string) => void;
}

// Service-specific data structure
interface ServiceData {
  service: "water" | "sanitation" | "security";
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  stats: {
    totalBills: number;
    paidBills: number;
    pendingBills: number;
    overdueBills: number;
    totalRevenue: number;
    averageBillAmount: number;
    collectionRate: number;
  };
  recentTransactions: Array<{
    id: string;
    user: string;
    amount: number;
    status: "paid" | "pending" | "overdue";
    date: string;
  }>;
  monthlyTrend: Array<{
    month: string;
    revenue: number;
    bills: number;
  }>;
  districtBreakdown: Array<{
    district: string;
    revenue: number;
    percentage: number;
  }>;
  users: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    district: string;
    status: "active" | "inactive" | "suspended";
    totalBills: number;
    paidBills: number;
    lastPaymentDate: string;
  }>;
  bills: Array<{
    id: string;
    userId: string;
    userName: string;
    amount: number;
    dueDate: string;
    status: "paid" | "pending" | "overdue";
    createdDate: string;
  }>;
}

// Mock data for each service
const getServiceData = (service: "water" | "sanitation" | "security"): ServiceData => {
  const baseData = {
    water: {
      icon: <Droplets className="h-6 w-6" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      stats: {
        totalBills: 12500,
        paidBills: 10200,
        pendingBills: 1800,
        overdueBills: 500,
        totalRevenue: 187500000,
        averageBillAmount: 15000,
        collectionRate: 81.6,
      },
    },
    sanitation: {
      icon: <Trash2 className="h-6 w-6" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      stats: {
        totalBills: 8300,
        paidBills: 6800,
        pendingBills: 1200,
        overdueBills: 300,
        totalRevenue: 83000000,
        averageBillAmount: 10000,
        collectionRate: 81.9,
      },
    },
    security: {
      icon: <Shield className="h-6 w-6" />,
      color: "text-green-600",
      bgColor: "bg-green-50",
      stats: {
        totalBills: 5600,
        paidBills: 4900,
        pendingBills: 500,
        overdueBills: 200,
        totalRevenue: 112000000,
        averageBillAmount: 20000,
        collectionRate: 87.5,
      },
    },
  };

  const data = baseData[service];

  return {
    service,
    ...data,
    recentTransactions: [
      { id: "1", user: "John Doe", amount: 15000, status: "paid", date: "2024-10-15" },
      { id: "2", user: "Jane Smith", amount: 12000, status: "pending", date: "2024-10-14" },
      { id: "3", user: "Bob Johnson", amount: 18000, status: "paid", date: "2024-10-13" },
      { id: "4", user: "Alice Brown", amount: 14000, status: "overdue", date: "2024-10-12" },
      { id: "5", user: "Charlie Wilson", amount: 16000, status: "paid", date: "2024-10-11" },
    ],
    monthlyTrend: [
      { month: "Aug", revenue: 150000000, bills: 10000 },
      { month: "Sep", revenue: 165000000, bills: 11000 },
      { month: "Oct", revenue: 187500000, bills: 12500 },
    ],
    districtBreakdown: [
      { district: "Kigali City", revenue: 75000000, percentage: 40 },
      { district: "Northern", revenue: 37500000, percentage: 20 },
      { district: "Southern", revenue: 37500000, percentage: 20 },
      { district: "Eastern", revenue: 22500000, percentage: 12 },
      { district: "Western", revenue: 15000000, percentage: 8 },
    ],
    users: [
      { id: "u1", name: "John Doe", email: "john@example.com", phone: "+250788123456", district: "Kigali", status: "active", totalBills: 12, paidBills: 11, lastPaymentDate: "2024-10-15" },
      { id: "u2", name: "Jane Smith", email: "jane@example.com", phone: "+250789234567", district: "Kigali", status: "active", totalBills: 10, paidBills: 9, lastPaymentDate: "2024-10-14" },
      { id: "u3", name: "Bob Johnson", email: "bob@example.com", phone: "+250790345678", district: "Gasabo", status: "active", totalBills: 15, paidBills: 14, lastPaymentDate: "2024-10-13" },
      { id: "u4", name: "Alice Brown", email: "alice@example.com", phone: "+250791456789", district: "Nyarugenge", status: "suspended", totalBills: 8, paidBills: 5, lastPaymentDate: "2024-09-20" },
      { id: "u5", name: "Charlie Wilson", email: "charlie@example.com", phone: "+250792567890", district: "Kicukiro", status: "inactive", totalBills: 6, paidBills: 6, lastPaymentDate: "2024-08-15" },
    ],
    bills: [
      { id: "b1", userId: "u1", userName: "John Doe", amount: 15000, dueDate: "2024-11-15", status: "pending", createdDate: "2024-10-15" },
      { id: "b2", userId: "u2", userName: "Jane Smith", amount: 12000, dueDate: "2024-11-14", status: "paid", createdDate: "2024-10-14" },
      { id: "b3", userId: "u3", userName: "Bob Johnson", amount: 18000, dueDate: "2024-11-13", status: "paid", createdDate: "2024-10-13" },
      { id: "b4", userId: "u4", userName: "Alice Brown", amount: 14000, dueDate: "2024-10-12", status: "overdue", createdDate: "2024-09-12" },
      { id: "b5", userId: "u5", userName: "Charlie Wilson", amount: 16000, dueDate: "2024-11-11", status: "pending", createdDate: "2024-10-11" },
    ],
  };
};

export const ServiceAdminDashboard = ({ onSectionChange }: ServiceAdminDashboardProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showNewBillForm, setShowNewBillForm] = useState(false);

  // Get service data based on user's assigned service
  const service = (user?.service || "water") as "water" | "sanitation" | "security";
  const serviceData = getServiceData(service);

  const getServiceLabel = () => {
    const labels = {
      water: "Water Service",
      sanitation: "Sanitation Service",
      security: "Security Service",
    };
    return labels[service];
  };

  const renderOverviewTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Service Header Alert */}
      <Alert className={`${serviceData.bgColor} border-2 border-current`}>
        <AlertCircle className={`h-4 w-4 ${serviceData.color}`} />
        <AlertDescription>
          You are viewing data for <strong>{getServiceLabel()}</strong> only. All metrics below are specific to this service.
        </AlertDescription>
      </Alert>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Bills",
            value: serviceData.stats.totalBills.toLocaleString(),
            icon: BarChart3,
            color: "text-blue-600",
          },
          {
            label: "Paid Bills",
            value: serviceData.stats.paidBills.toLocaleString(),
            icon: CheckCircle,
            color: "text-green-600",
          },
          {
            label: "Pending Bills",
            value: serviceData.stats.pendingBills.toLocaleString(),
            icon: Clock,
            color: "text-yellow-600",
          },
          {
            label: "Overdue Bills",
            value: serviceData.stats.overdueBills.toLocaleString(),
            icon: XCircle,
            color: "text-red-600",
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold mt-2">{stat.value}</p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Revenue and Collection Rate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              RWF {(serviceData.stats.totalRevenue / 1000000).toFixed(1)}M
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Average Bill: RWF {serviceData.stats.averageBillAmount.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Collection Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {serviceData.stats.collectionRate.toFixed(1)}%
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${serviceData.stats.collectionRate}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={serviceData.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => `RWF ${(value / 1000000).toFixed(1)}M`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke={serviceData.color === "text-blue-600" ? "#0088FE" : serviceData.color === "text-orange-600" ? "#FF8C42" : "#00C49F"}
                  strokeWidth={2}
                  name="Revenue"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* District Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by District</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceData.districtBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ district, percentage }) => `${district} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {serviceData.districtBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"][index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `RWF ${(value / 1000000).toFixed(1)}M`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );

  const renderTransactionsTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {serviceData.recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 text-sm font-medium">{transaction.user}</td>
                    <td className="px-4 py-3 text-sm">RWF {transaction.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          transaction.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{transaction.date}</td>
                    <td className="px-4 py-3 text-sm">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderReportsTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Generate Report</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Report Type</label>
              <select className="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Revenue Report</option>
                <option>Collection Report</option>
                <option>User Report</option>
                <option>Overdue Report</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Date Range</label>
              <select className="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
                <option>Custom Range</option>
              </select>
            </div>
            <Button className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Generate & Download
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium">Paid Rate</span>
              <span className="text-lg font-bold text-green-600">
                {((serviceData.stats.paidBills / serviceData.stats.totalBills) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm font-medium">Pending Rate</span>
              <span className="text-lg font-bold text-yellow-600">
                {((serviceData.stats.pendingBills / serviceData.stats.totalBills) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-sm font-medium">Overdue Rate</span>
              <span className="text-lg font-bold text-red-600">
                {((serviceData.stats.overdueBills / serviceData.stats.totalBills) * 100).toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );

  const renderSettingsTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Service Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium">Service Name</label>
            <input
              type="text"
              value={getServiceLabel()}
              disabled
              className="w-full mt-2 px-3 py-2 border rounded-lg bg-muted/30"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Default Bill Amount</label>
            <input
              type="number"
              defaultValue={serviceData.stats.averageBillAmount}
              className="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Payment Deadline (Days)</label>
            <input
              type="number"
              defaultValue="30"
              className="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button>Save Settings</Button>
        </CardContent>
      </Card>
    </motion.div>
  );

  const filteredUsers = serviceData.users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const renderUsersTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Service Users
            </span>
            <span className="text-sm font-normal text-muted-foreground">
              {filteredUsers.length} users
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">District</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Bills</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 text-sm font-medium">{user.name}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {user.district}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="text-xs">
                        <div className="font-semibold">{user.paidBills}/{user.totalBills}</div>
                        <div className="text-muted-foreground">paid</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.status === "active"
                            ? "bg-green-100 text-green-800"
                            : user.status === "inactive"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const filteredBills = serviceData.bills.filter((bill) => {
    const matchesSearch = bill.userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || bill.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const renderBillsTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Bill Management
        </h2>
        <Button onClick={() => setShowNewBillForm(!showNewBillForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Bill
        </Button>
      </div>

      {showNewBillForm && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle>Create New Bill</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Select User</label>
                <select className="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Choose a user...</option>
                  {serviceData.users.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Amount (RWF)</label>
                <input
                  type="number"
                  placeholder={serviceData.stats.averageBillAmount.toString()}
                  className="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Due Date</label>
                <input
                  type="date"
                  className="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <input
                  type="text"
                  placeholder="Bill description"
                  className="w-full mt-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1">Create Bill</Button>
              <Button variant="outline" className="flex-1" onClick={() => setShowNewBillForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>All Bills</span>
            <span className="text-sm font-normal text-muted-foreground">
              {filteredBills.length} bills
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by user name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          {/* Bills Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Due Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Created</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 text-sm font-medium">{bill.userName}</td>
                    <td className="px-4 py-3 text-sm font-semibold">RWF {bill.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm">{bill.dueDate}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          bill.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : bill.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{bill.createdDate}</td>
                    <td className="px-4 py-3 text-sm flex gap-2">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${serviceData.bgColor}`}>
            {serviceData.icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{getServiceLabel()} Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome, {user?.fullName}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border overflow-x-auto">
        {[
          { id: "overview", label: "Overview", icon: BarChart3 },
          { id: "transactions", label: "Transactions", icon: DollarSign },
          { id: "users", label: "Users", icon: Users },
          { id: "bills", label: "Bills", icon: FileText },
          { id: "reports", label: "Reports", icon: Download },
          { id: "settings", label: "Settings", icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" && renderOverviewTab()}
        {activeTab === "transactions" && renderTransactionsTab()}
        {activeTab === "users" && renderUsersTab()}
        {activeTab === "bills" && renderBillsTab()}
        {activeTab === "reports" && renderReportsTab()}
        {activeTab === "settings" && renderSettingsTab()}
      </AnimatePresence>
    </div>
  );
};
