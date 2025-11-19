import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Zap,
  Shield,
  Users,
  Settings,
  Activity,
} from "lucide-react";

interface SuperAdminTabsProps {
  children?: React.ReactNode;
}

export const SuperAdminTabs = ({ children }: SuperAdminTabsProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Zap },
    { id: "services", label: "Services", icon: BarChart3 },
    { id: "admins", label: "Admins", icon: Shield },
    { id: "users", label: "Users", icon: Users },
    { id: "health", label: "System Health", icon: Activity },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 gap-2 h-auto p-2 bg-muted/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </motion.div>

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
            {children}
          </motion.div>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" asChild>
          <motion.div
            key="services"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-lg p-6 border">
              <h2 className="text-2xl font-bold mb-4">Services Management</h2>
              <p className="text-muted-foreground">
                Manage all services (Water, Sanitation, Security) and their configurations.
              </p>
              {/* Service comparison will go here */}
            </div>
          </motion.div>
        </TabsContent>

        {/* Admins Tab */}
        <TabsContent value="admins" asChild>
          <motion.div
            key="admins"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-lg p-6 border">
              <h2 className="text-2xl font-bold mb-4">Admin Management</h2>
              <p className="text-muted-foreground">
                Create, edit, and manage admin accounts and their service assignments.
              </p>
              {/* Admin management will go here */}
            </div>
          </motion.div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" asChild>
          <motion.div
            key="users"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-lg p-6 border">
              <h2 className="text-2xl font-bold mb-4">User Analytics</h2>
              <p className="text-muted-foreground">
                View detailed user analytics by service, district, and other metrics.
              </p>
              {/* User analytics will go here */}
            </div>
          </motion.div>
        </TabsContent>

        {/* System Health Tab */}
        <TabsContent value="health" asChild>
          <motion.div
            key="health"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-lg p-6 border">
              <h2 className="text-2xl font-bold mb-4">System Health Monitoring</h2>
              <p className="text-muted-foreground">
                Monitor system status, uptime, performance metrics, and alerts.
              </p>
              {/* System health monitoring will go here */}
            </div>
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
            className="space-y-6"
          >
            <div className="bg-card rounded-lg p-6 border">
              <h2 className="text-2xl font-bold mb-4">System Settings</h2>
              <p className="text-muted-foreground">
                Configure system-wide settings and preferences.
              </p>
              {/* Settings will go here */}
            </div>
          </motion.div>
        </TabsContent>
      </AnimatePresence>
    </Tabs>
  );
};
