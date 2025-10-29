import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getUserStats, getUserPayments, getUserPaymentHistory, getUserNotifications } from '@/lib/api';
import { CreditCard, Clock, CheckCircle, DollarSign, Bell, Receipt, TrendingUp, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['userStats', user?.id],
    queryFn: () => getUserStats(user?.id || ''),
    enabled: !!user?.id,
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['userPayments', user?.id],
    queryFn: () => getUserPayments(user?.id || ''),
    enabled: !!user?.id,
  });

  const { data: paymentHistory, isLoading: historyLoading } = useQuery({
    queryKey: ['userPaymentHistory', user?.id],
    queryFn: () => getUserPaymentHistory(user?.id || ''),
    enabled: !!user?.id,
  });

  const { data: notifications, isLoading: notificationsLoading } = useQuery({
    queryKey: ['userNotifications', user?.id],
    queryFn: () => getUserNotifications(user?.id || ''),
    enabled: !!user?.id,
  });

  const statCards = [
    {
      label: t("totalPayments"),
      value: stats ? stats.totalPayments.toString() : t("loading"),
      icon: Receipt,
      color: "text-blue-600",
    },
    {
      label: t("pendingPayments"),
      value: stats ? stats.pendingPayments.toString() : t("loading"),
      icon: Clock,
      color: "text-orange-600",
    },
    {
      label: t("completedPayments"),
      value: stats ? stats.completedPayments.toString() : t("loading"),
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      label: t("totalAmount"),
      value: stats ? `${stats.totalAmount.toLocaleString()} RWF` : t("loading"),
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
            <h1 className="text-3xl font-bold text-foreground">{t("userDashboard")}</h1>
            <p className="text-muted-foreground mt-2">{t("dashboardDesc")}</p>
          </div>
          <div className="flex gap-4">
            <Button asChild variant="outline">
              <Link to="/admin">{t("adminPanel")}</Link>
            </Button>
            <Button asChild>
              <Link to="/">{t("GoBack")}</Link>
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
                  {paymentsLoading ? (
                    <div className="space-y-4">
                      {[1,2,3].map(i => (
                        <div key={i} className="animate-pulse flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                          <div className="space-y-2">
                            <div className="h-4 bg-muted rounded w-24"></div>
                            <div className="h-3 bg-muted rounded w-16"></div>
                          </div>
                          <div className="h-6 bg-muted rounded w-16"></div>
                        </div>
                      ))}
                    </div>
                  ) : payments && payments.length > 0 ? (
                    <div className="space-y-4">
                      {payments.slice(0, 5).map(payment => (
                        <div key={payment.id} className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium">{payment.service}</p>
                            <p className="text-sm text-muted-foreground">
                              {payment.status === 'Paid' ? t("paid") : t("dueDate")}: {payment.dueDate}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{payment.amount} RWF</p>
                            <Badge className={getStatusColor(payment.status)}>
                              {payment.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">{t("noPaymentsFound")}</p>
                  )}
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
                  {notificationsLoading ? (
                    <div className="space-y-4">
                      {[1,2,3].map(i => (
                        <div key={i} className="animate-pulse flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                          <div className="h-4 w-4 bg-muted rounded"></div>
                          <div className="space-y-2 flex-1">
                            <div className="h-4 bg-muted rounded w-32"></div>
                            <div className="h-3 bg-muted rounded w-48"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : notifications && notifications.length > 0 ? (
                    <div className="space-y-4">
                      {notifications.slice(0, 5).map(notification => (
                        <div key={notification.id} className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-lg">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1">
                            <p className="font-medium text-sm">{notification.title}</p>
                            <p className="text-sm text-muted-foreground">{notification.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notification.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">{t("noActivitiesAvailable")}</p>
                  )}
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
                {paymentsLoading ? (
                  <div className="space-y-4">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="animate-pulse flex justify-between items-center p-4 border rounded-lg">
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded w-24"></div>
                          <div className="h-3 bg-muted rounded w-32"></div>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="h-4 bg-muted rounded w-16"></div>
                          <div className="h-6 bg-muted rounded w-16"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : payments && payments.length > 0 ? (
                  <div className="space-y-4">
                    {payments.map(payment => (
                      <div key={payment.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-muted/50">
                        <div>
                          <p className="font-medium">{payment.service}</p>
                          <p className="text-sm text-muted-foreground">
                            {t("dueDate")}: {payment.dueDate}
                          </p>
                          {payment.date && (
                            <p className="text-sm text-muted-foreground">
                              {t("paid")}: {payment.date}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-lg">{payment.amount} RWF</p>
                          <Badge className={getStatusColor(payment.status)}>
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">{t("noPaymentsFound")}</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("paymentTrends")}</CardTitle>
              </CardHeader>
              <CardContent>
                {historyLoading ? (
                  <div className="space-y-4">
                    {[1,2,3,4,5,6].map(i => (
                      <div key={i} className="animate-pulse flex justify-between items-center p-4 border rounded-lg">
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded w-24"></div>
                          <div className="h-3 bg-muted rounded w-20"></div>
                        </div>
                        <div className="text-right space-y-2">
                          <div className="h-4 bg-muted rounded w-16"></div>
                          <div className="h-6 bg-muted rounded w-16"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : paymentHistory && paymentHistory.length > 0 ? (
                  <div className="space-y-4">
                    {paymentHistory.map(payment => (
                      <div key={payment.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-muted/50">
                        <div>
                          <p className="font-medium">{payment.service}</p>
                          <p className="text-sm text-muted-foreground">{payment.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{payment.amount} RWF</p>
                          <Badge className={getStatusColor(payment.status)}>
                            {payment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">{t("noDataAvailable")}</p>
                )}
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
