import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Users, DollarSign, Clock, TrendingUp, Loader2, Activity, Download, Plus, MoreHorizontal } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { mockApi, Bill, User, mockQueryClientConfig } from "@/mocks/mockData";

// Mock data generation functions
const generateMockStats = (user: any, t: any) => {
  const baseStats = {
    totalUsers: 1245,
    activeUsers: 876,
    totalRevenue: 12500000,
    pendingPayments: 2450000,
    recentActivities: [
      { 
        id: 1, 
        action: t('activityLogs.newUserRegistration'), 
        user: 'John Doe', 
        time: t('activityLogs.timeAgo', { count: 2, unit: 'minute' }),
        _translationKey: 'activityLogs.newUserRegistration'
      },
      { 
        id: 2, 
        action: t('activityLogs.paymentReceived'), 
        user: 'Jane Smith', 
        amount: 50000, 
        time: t('activityLogs.timeAgo', { count: 15, unit: 'minute' }),
        _translationKey: 'activityLogs.paymentReceived'
      },
      { 
        id: 3, 
        action: t('activityLogs.billGenerated'), 
        user: 'Water Department', 
        count: 45, 
        time: t('activityLogs.timeAgo', { count: 1, unit: 'hour' }),
        _translationKey: 'activityLogs.billGenerated'
      },
    ]
  };

  if (user?.service) {
    // Service-specific stats
    return {
      ...baseStats,
      totalUsers: 345,
      activeUsers: 287,
      totalRevenue: 4500000,
      pendingPayments: 780000,
    };
  }

  return baseStats;
};

const generateMockCharts = (user: any, t: any) => {
  const months = [
    t('date.months.jan'), t('date.months.feb'), t('date.months.mar'), t('date.months.apr'),
    t('date.months.may'), t('date.months.jun'), t('date.months.jul'), t('date.months.aug'),
    t('date.months.sep'), t('date.months.oct'), t('date.months.nov'), t('date.months.dec')
  ];
  const currentMonth = new Date().getMonth();
  
  const paymentsData = months.map((month, index) => ({
    name: month,
    amount: Math.floor(Math.random() * 1000000) + 500000,
    count: Math.floor(Math.random() * 50) + 20,
  }));

  const paymentStatusData = [
    { name: t('admin.payments.statuses.paid'), value: 65 },
    { name: t('admin.payments.statuses.pending'), value: 25 },
    { name: t('admin.payments.statuses.overdue'), value: 10 },
  ];

  const userGrowthData = months.slice(0, currentMonth + 1).map((month, index) => ({
    name: month,
    users: Math.floor(Math.random() * 50) + 20 * (index + 1),
  }));

  return {
    paymentsData,
    paymentStatusData,
    userGrowthData,
  };
};

// Animation variants
const pageVariants = {
  initial: { opacity: 0, x: -20 },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: 20 }
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
  const { user } = useAuth();

  const queryClient = useQueryClient();

  // Mock data queries
  const { data: stats } = useQuery({
    queryKey: ['adminStats', user?.role, user?.service],
    queryFn: () => Promise.resolve(generateMockStats(user, t)),
    ...mockQueryClientConfig.defaultOptions.queries,
  });

  const { data: chartsData, isLoading: chartsLoading } = useQuery({
    queryKey: ['adminCharts', user?.role, user?.service],
    queryFn: () => Promise.resolve(generateMockCharts(user, t)),
    ...mockQueryClientConfig.defaultOptions.queries,
  });

  // Using users and bills from earlier queries
  const recentActivities = stats?.recentActivities || [];

  // Mock mutation for updating user status
  const { mutate: updateUserStatus } = useMutation({
    mutationFn: async ({ userId, approved }: { userId: string; approved: boolean }) => {
      return mockApi.updateUser(userId, { approved });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast.success('User status updated');
    },
  });

  // Mock mutation for marking bill as paid
  const { mutate: markBillAsPaid } = useMutation({
    mutationFn: async (billId: string) => {
      return mockApi.updateBill(billId, { 
        status: 'paid',
        paymentDate: new Date().toISOString(),
        paymentMethod: 'manual',
        referenceNumber: `PAY-${Date.now()}`
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminBills'] });
      toast.success('Bill marked as paid');
    },
  });

  // Using chartsData from the earlier query
  const { paymentsData, paymentStatusData, userGrowthData } = chartsData || {};

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const statCards = [
    {
      label: "Total Users",
      value: stats ? stats.totalUsers.toLocaleString() : "Loading...",
      change: "+5%",
      icon: Users,
      tooltip: "Total number of registered users"
    },
    {
      label: "Pending Payments",
      value: stats ? `${stats.pendingPayments.toLocaleString()} RWF` : "Loading...",
      change: "-2%",
      icon: Clock,
      tooltip: "Total amount of pending payments"
    },
    {
      label: "Active Users",
      value: stats ? stats.activeUsers.toLocaleString() : "Loading...",
      change: "+12%",
      icon: TrendingUp,
      tooltip: "Number of active users this month"
    },
    {
      label: "Total Revenue",
      value: stats ? `${stats.totalRevenue.toLocaleString()} RWF` : "Loading...",
      change: "+8%",
      icon: DollarSign,
      tooltip: "Total revenue collected"
    }
  ];

  // Scroll direction state
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      if (scrollY > lastScrollY) {
        setScrollDirection("down");
      } else if (scrollY < lastScrollY) {
        setScrollDirection("up");
      } else {
        setScrollDirection(null);
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
          {t("errorLoadingAdminData")}: {statsError.message}
        </div>
      </div>
    );
  }

  return (
    <AnimatedPage>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-foreground">{t("adminDashboard")}</h1>

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
            <h2 className="text-xl font-semibold mb-4">Payment Trends</h2>
            {paymentsLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="animate-spin h-8 w-8" />
              </div>
            ) : paymentsChart ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={paymentsChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [`${value}`, name === 'water' ? t('water') : name === 'security' ? t('security') : name === 'sanitation' ? t('sanitation') : name]} />
                  <Legend />
                  <Bar dataKey="water" fill="#8884d8" name={t('water')} />
                  <Bar dataKey="security" fill="#82ca9d" name={t('security')} />
                  <Bar dataKey="sanitation" fill="#ffc658" name={t('sanitation')} />
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
            initial={{ opacity: 0, x: scrollDirection === "down" ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-semibold mb-4">Payment Status</h2>
            {statusLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="animate-spin h-8 w-8" />
              </div>
            ) : paymentStatusChart ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={paymentStatusChart}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentStatusChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} payments`, 'Count']} />
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
            <h2 className="text-xl font-semibold mb-4">User Growth</h2>
            {growthLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="animate-spin h-8 w-8" />
              </div>
            ) : userGrowthChart ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={userGrowthChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}`, 'Users']} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#ff7300"
                    strokeWidth={2}
                    dot={{ fill: '#ff7300' }}
                    name="Users"
                  />
                </LineChart>
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
            <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
            {activitiesLoading ? (
              <div className="space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="animate-pulse flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-muted rounded-full">
                        <Activity className="h-4 w-4" />
                      </div>
                      <div className="ml-4 space-y-2">
                        <div className="h-4 bg-muted rounded w-32"></div>
                        <div className="h-3 bg-muted rounded w-24"></div>
                      </div>
                    </div>
                    <div className="h-3 bg-muted rounded w-16"></div>
                  </div>
                ))}
              </div>
            ) : recentActivities ? (
              <div className="space-y-4">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg">
                    <div className="flex items-center">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Activity className="h-4 w-4 text-primary" />
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.user}</p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">{activity.timestamp}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                <span className="text-muted-foreground">No activities available</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
};

// Bill Generation Section
const BillGenerationSection = () => {
  const [selectedService, setSelectedService] = useState<"water" | "sanitation" | "security">("water");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const queryClient = useQueryClient();

  const handleGenerateBills = async () => {
    if (!selectedService) {
      toast.error("Please select a service");
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock bills
      const districts = selectedDistrict 
        ? [selectedDistrict] 
        : ["Kigali", "Gasabo", "Kicukiro", "Nyarugenge", "Rubavu", "Musanze"];
      
      const mockBills = districts.flatMap(district => {
        const count = Math.floor(Math.random() * 10) + 5; // 5-15 bills per district
        return Array.from({ length: count }, (_, i) => ({
          id: `bill-${Date.now()}-${i}`,
          customerName: `Customer ${Math.floor(Math.random() * 1000)}`,
          amount: Math.floor(Math.random() * 50000) + 10000, // 10,000 - 60,000 RWF
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
          status: 'pending',
          service: selectedService,
          customerId: `cust-${Math.floor(Math.random() * 1000)}`,
          district,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));
      });

      // In a real app, you would send these to your API
      console.log(`Generated ${mockBills.length} mock bills for ${selectedService}`, mockBills);
      
      // Update the UI by invalidating the bills query
      queryClient.invalidateQueries({ queryKey: ['adminBills'] });
      
      toast.success(`Successfully generated ${mockBills.length} bills for ${selectedService}`);
    } catch (error) {
      console.error("Error generating bills:", error);
      toast.error("Failed to generate bills. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const { t } = useTranslation();

  return (
    <AnimatedPage>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-foreground">{t('admin.billGeneration.title')}</h1>

        <div className="bg-card rounded-xl shadow-soft border p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="service">{t('admin.billGeneration.serviceType')}</Label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
                  <SelectValue placeholder={t('admin.billGeneration.selectService')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="water">{t('services.water')}</SelectItem>
                  <SelectItem value="sanitation">{t('services.sanitation')}</SelectItem>
                  <SelectItem value="security">{t('services.security')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="district">{t('admin.billGeneration.district')} ({t('common.optional')})</Label>
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger>
                  <SelectValue placeholder={t('admin.billGeneration.allDistricts')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('admin.billGeneration.allDistricts')}</SelectItem>
                  <SelectItem value="Kigali City">{t('districts.kigali')}</SelectItem>
                  <SelectItem value="Northern Province">{t('districts.north')}</SelectItem>
                  <SelectItem value="Southern Province">{t('districts.south')}</SelectItem>
                  <SelectItem value="Eastern Province">{t('districts.east')}</SelectItem>
                  <SelectItem value="Western Province">{t('districts.west')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleGenerateBills} 
            className="w-full md:w-auto"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('common.generating')}
              </>
            ) : (
              t('admin.billGeneration.generateBills')
            )}
          </Button>
        </div>
      </div>
    </AnimatedPage>
  );
};

// Users Section
const UsersSection = () => {
  const { t } = useTranslation();
  const { data: users, isLoading } = useQuery({
    queryKey: ['adminUsersList'],
    queryFn: getAdminUsersList,
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredUsers = users?.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

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
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><div className="animate-pulse h-4 bg-muted rounded w-24"></div></td>
                      <td className="px-6 py-4"><div className="animate-pulse h-4 bg-muted rounded w-32"></div></td>
                      <td className="px-6 py-4"><div className="animate-pulse h-4 bg-muted rounded w-20"></div></td>
                      <td className="px-6 py-4"><div className="animate-pulse h-4 bg-muted rounded w-16"></div></td>
                      <td className="px-6 py-4"><div className="animate-pulse h-8 bg-muted rounded w-16"></div></td>
                    </tr>
                  ))
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{user.lastPayment}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.status === 'Active' ? 'bg-green-100 text-green-800' :
                          user.status === 'Inactive' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Button variant="outline" size="sm">{t("view")}</Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-muted-foreground">{t("noUsersFound")}</td>
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
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  // Use mock data for payments
  const { data: payments = [], isLoading } = useQuery<Bill[]>({
    queryKey: ['adminBills'],
    queryFn: mockApi.getBills,
    select: (bills) => 
      bills.map(bill => ({
        ...bill,
        referenceNumber: `PAY-${Math.floor(100000 + Math.random() * 900000)}`,
        paymentDate: bill.status === 'paid' ? bill.paymentDate : undefined,
        paymentMethod: bill.status === 'paid' ? (['mobile_money', 'card', 'bank_transfer'] as const)[Math.floor(Math.random() * 3)] : undefined,
      })),
    ...mockQueryClientConfig.defaultOptions.queries,
  });

  // Mock function to process payment
  const processPayment = async (billId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the payment status
      await mockApi.updateBill(billId, { 
        status: 'paid',
        paymentDate: new Date().toISOString(),
        paymentMethod: 'manual',
        referenceNumber: `PAY-${Math.floor(100000 + Math.random() * 900000)}`
      });
      
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['adminBills'] });
      toast.success('Payment processed successfully');
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Failed to process payment');
    }
  };

  const handleExport = () => {
    // Create CSV content
    const headers = ['ID', 'Customer', 'Service', 'Amount', 'Status', 'Due Date'];
    const csvContent = [
      headers.join(','),
      ...payments.map(payment => [
        payment.id,
        payment.customerName,
        payment.service,
        payment.amount,
        payment.status,
        payment.dueDate
      ].map(field => `"${field}"`).join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `payments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Export started. Download should begin shortly.');
  };

  const { t } = useTranslation();
  
  return (
    <AnimatedPage>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground">{t('admin.payments.title')}</h1>
          <Button onClick={handleExport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            {t('common.export')}
          </Button>
        </div>

        <div className="bg-card rounded-xl shadow-soft border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t('admin.payments.customer')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t('common.service')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t('admin.payments.amount')} (RWF)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t('common.status')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t('admin.payments.dueDate')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t('common.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><div className="animate-pulse h-4 bg-muted rounded w-24"></div></td>
                      <td className="px-6 py-4"><div className="animate-pulse h-4 bg-muted rounded w-16"></div></td>
                      <td className="px-6 py-4"><div className="animate-pulse h-4 bg-muted rounded w-20"></div></td>
                      <td className="px-6 py-4"><div className="animate-pulse h-4 bg-muted rounded w-16"></div></td>
                      <td className="px-6 py-4"><div className="animate-pulse h-4 bg-muted rounded w-24"></div></td>
                      <td className="px-6 py-4"><div className="animate-pulse h-8 bg-muted rounded w-16"></div></td>
                    </tr>
                  ))
                ) : payments.length > 0 ? (
                  payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                        {payment.customerName || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground capitalize">
                        {payment.service}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {payment.amount?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            payment.status === 'paid' 
                              ? 'bg-green-100 text-green-800' 
                              : payment.status === 'overdue' 
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {new Date(payment.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {payment.status === 'pending' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => processPayment(payment.id)}
                            className="mr-2"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            ) : t('admin.payments.markAsPaid')}
                          </Button>
                          <Button variant="ghost" size="sm">
                            {t('common.view')}
                          </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-muted-foreground">
                      {t('noPaymentsFound')}
                      No payments found
                    </td>
                  </tr>
                )}
              </tbody>
                      <td className="px-6 py-4"><div className="animate-pulse h-4 bg-muted rounded w-12"></div></td>
                      <td className="px-6 py-4"><div className="animate-pulse h-4 bg-muted rounded w-16"></div></td>
                      <td className="px-6 py-4"><div className="animate-pulse h-4 bg-muted rounded w-20"></div></td>
                      <td className="px-6 py-4"><div className="animate-pulse h-8 bg-muted rounded w-16"></div></td>
                    </tr>
                  ))
                ) : payments && payments.length > 0 ? (
                  payments.map(payment => (
                    <tr key={payment.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{payment.user}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{payment.service}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{payment.amount} RWF</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          payment.status === 'Paid' ? 'bg-green-100 text-green-800' :
                          payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{payment.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Button variant="outline" size="sm">{t("view")}</Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-muted-foreground">{t("noPaymentsFound")}</td>
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
  const { user } = useAuth();

  const renderSection = () => {
    // Use new ServiceAdminDashboard for service admins
    if (user?.role === "admin" && activeSection === "dashboard") {
      return (
        <AnimatedPage>
          <div className="p-6">
            <ServiceAdminDashboard onSectionChange={setActiveSection} />
          </div>
        </AnimatedPage>
      );
    }
    
    switch (activeSection) {
      case "dashboard":
        return <AdminDashboard />;
      case "bill-generation":
        return <BillGenerationSection />;
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
    <div className="min-h-screen bg-background">
      <AdminNavbar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
      }`}>
        <div className="min-h-screen pt-16">
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

export { Admin };
