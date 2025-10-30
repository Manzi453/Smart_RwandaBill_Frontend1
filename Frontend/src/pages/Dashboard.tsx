import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { mockBills, mockStatistics } from '@/lib/mockData';
import { CreditCard, Clock, CheckCircle, DollarSign, Bell, Receipt, TrendingUp, AlertTriangle, LogOut, CheckCircle as CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
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

  const statCards = [
    {
      label: t("totalPayments") || "Total Payments",
      value: mockStatistics.totalBills.toString(),
      icon: Receipt,
      color: "text-blue-600",
    },
    {
      label: t("pendingPayments") || "Pending Payments",
      value: mockStatistics.pendingBills.toString(),
      icon: Clock,
      color: "text-orange-600",
    },
    {
      label: t("completedPayments") || "Completed Payments",
      value: mockStatistics.paidBills.toString(),
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      label: t("totalAmount") || "Total Amount",
      value: `${(mockStatistics.totalRevenue / 1000000).toFixed(1)}M RWF`,
      icon: DollarSign,
      color: "text-purple-600",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'info': return <Bell className="h-4 w-4 text-blue-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-background p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t("userDashboard") || "Dashboard"}</h1>
            <p className="text-muted-foreground mt-2">{user?.username || 'User'} - {user?.email || 'user@example.com'}</p>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • {currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              {t("logout") || "Logout"}
            </Button>
            <Button asChild>
              <Link to="/">{t("GoBack") || "Go Back"}</Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold mt-2">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">{t("dashboard")}</TabsTrigger>
            <TabsTrigger value="payments">{t("payments")}</TabsTrigger>
            <TabsTrigger value="history">{t("paymentTrends")}</TabsTrigger>
            <TabsTrigger value="notifications">{t("notifications")}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Payments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    {t("currentPayments")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                      {mockBills.slice(0, 5).map(bill => (
                        <div key={bill.id} className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium">{bill.billNumber}</p>
                            <p className="text-sm text-muted-foreground">
                              {bill.status === 'paid' ? t("paid") || "Paid" : t("dueDate") || "Due Date"}: {bill.dueDate}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{bill.amount} RWF</p>
                            <Badge className={getStatusColor(bill.status)}>
                              {bill.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                </CardContent>
              </Card>

              {/* Recent Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    {t("recentActivities")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                      {mockBills.slice(0, 5).map(bill => (
                        <div key={bill.id} className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-lg">
                          {bill.status === 'overdue' ? <AlertTriangle className="h-4 w-4 text-orange-500" /> : <CheckCircle className="h-4 w-4 text-green-500" />}
                          <div className="flex-1">
                            <p className="font-medium text-sm">{bill.billNumber}</p>
                            <p className="text-sm text-muted-foreground">Amount: {bill.amount} RWF</p>
                            <p className="text-xs text-muted-foreground mt-1">{bill.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("currentPayments")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                    {mockBills.map(bill => (
                      <div key={bill.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-muted/50">
                        <div>
                          <p className="font-medium">{bill.billNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            {t("dueDate") || "Due Date"}: {bill.dueDate}
                          </p>
                          {bill.status === 'paid' && (
                            <p className="text-sm text-muted-foreground">
                              {t("paid") || "Paid"}: {bill.date}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-lg">{bill.amount} RWF</p>
                          <Badge className={getStatusColor(bill.status)}>
                            {bill.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("paymentTrends")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                    {mockBills.map(bill => (
                      <div key={bill.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-muted/50">
                        <div>
                          <p className="font-medium">{bill.service}</p>
                          <p className="text-sm text-muted-foreground">{bill.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{bill.amount} RWF</p>
                          <Badge className={getStatusColor(bill.status)}>
                            {bill.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("notifications")}</CardTitle>
              </CardHeader>
              <CardContent>
                {notificationsLoading ? (
                  <div className="space-y-4">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="animate-pulse flex items-start gap-3 p-4 border rounded-lg">
                        <div className="h-4 w-4 bg-muted rounded"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-muted rounded w-32"></div>
                          <div className="h-3 bg-muted rounded w-48"></div>
                          <div className="h-3 bg-muted rounded w-24"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : notifications && notifications.length > 0 ? (
                  <div className="space-y-4">
                    {notifications.map(notification => (
                      <div key={notification.id} className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/50">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">{notification.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">{t("noActivitiesAvailable")}</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export { Dashboard };
