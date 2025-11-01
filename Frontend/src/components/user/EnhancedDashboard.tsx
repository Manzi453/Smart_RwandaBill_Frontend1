import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  BarChart3,
  Settings,
  Shield,
  Search,
  Calendar,
  Zap,
  Bell,
} from "lucide-react";
import { EnhancedProfileManagement } from "./EnhancedProfileManagement";
import { QuickActionsPanel } from "./QuickActionsPanel";
import { PaymentCalendar } from "./PaymentCalendar";
import { SpendingAnalytics } from "./SpendingAnalytics";
import { EnhancedSettings } from "./EnhancedSettings";
import { SearchAndBulkActions } from "./SearchAndBulkActions";
import { SecurityFeatures } from "./SecurityFeatures";
import { DashboardStatCards } from "./DashboardStatCards";
import { NotificationsPanel } from "./NotificationsPanel";
import { QuickPaymentButton } from "./QuickPaymentButton";

export const EnhancedDashboard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome Back, John!
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your bills and payments in one place
            </p>
          </div>
          <QuickPaymentButton pendingAmount={5000} />
        </div>
      </motion.div>

      {/* Dashboard Stat Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <DashboardStatCards
          totalBills={12}
          paidBills={10}
          pendingBills={1}
          overdueBills={1}
          totalDue={5000}
        />
      </motion.div>

      {/* Tabs Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-8 gap-2 h-auto p-2 bg-muted/50">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Calendar</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            <TabsContent value="overview" asChild>
              <motion.div
                key="overview"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <QuickActionsPanel />
                <PaymentCalendar />
              </motion.div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" asChild>
              <motion.div
                key="notifications"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <NotificationsPanel />
              </motion.div>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" asChild>
              <motion.div
                key="profile"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <EnhancedProfileManagement />
              </motion.div>
            </TabsContent>

            {/* Calendar Tab */}
            <TabsContent value="calendar" asChild>
              <motion.div
                key="calendar"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <PaymentCalendar />
              </motion.div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" asChild>
              <motion.div
                key="analytics"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <SpendingAnalytics />
              </motion.div>
            </TabsContent>

            {/* Search Tab */}
            <TabsContent value="search" asChild>
              <motion.div
                key="search"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <SearchAndBulkActions />
              </motion.div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" asChild>
              <motion.div
                key="security"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <SecurityFeatures />
              </motion.div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" asChild>
              <motion.div
                key="settings"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <EnhancedSettings />
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </div>
  );
};
