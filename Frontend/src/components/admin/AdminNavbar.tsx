import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  User,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Users,
  DollarSign,
  FileText,
  LogOut,
  Droplets,
  Shield,
  Trash2,
  Bell,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { NavbarQuickAccess } from "../NavbarQuickAccess";

interface AdminNavbarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

const AdminNavbar = ({
  activeSection,
  onSectionChange,
  collapsed = false,
  onCollapsedChange,
}: AdminNavbarProps) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  React.useEffect(() => {
    setIsCollapsed(collapsed);
  }, [collapsed]);

  const toggleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    if (onCollapsedChange) {
      onCollapsedChange(newCollapsed);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Get service icon and color based on user's service
  const getServiceInfo = () => {
    const serviceMap = {
      water: { icon: Droplets, color: "text-blue-600", bg: "bg-blue-50" },
      sanitation: { icon: Trash2, color: "text-orange-600", bg: "bg-orange-50" },
      security: { icon: Shield, color: "text-green-600", bg: "bg-green-50" },
    };
    return serviceMap[user?.service as keyof typeof serviceMap] || serviceMap.water;
  };

  const serviceInfo = getServiceInfo();
  const ServiceIcon = serviceInfo.icon;

  const navItems = [
    { id: "dashboard", label: t('dashboard'), icon: BarChart3 },
    { id: "bill-generation", label: "Bill Generation", icon: FileText },
    { id: "users", label: t('users'), icon: Users },
    { id: "payments", label: t('payments'), icon: DollarSign },
  ];

  const quickAccessItems = [
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="h-5 w-5" />,
      color: "text-blue-600",
      action: () => console.log("View notifications"),
      badge: 5,
    },
    {
      id: "alerts",
      label: "Alerts",
      icon: <AlertCircle className="h-5 w-5" />,
      color: "text-red-600",
      action: () => console.log("View alerts"),
      badge: 2,
    },
    {
      id: "reports",
      label: "Reports",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-purple-600",
      action: () => console.log("View reports"),
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex md:flex-col md:fixed md:inset-y-0 md:z-50 transition-all duration-300 ${
          isCollapsed ? "md:w-20" : "md:w-64"
        }`}
      >
        <div className="flex flex-col flex-grow bg-gradient-to-b from-card to-card/95 border-r border-border shadow-lg">
          {/* Header */}
          <motion.div 
            className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-blue-50/30 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {!isCollapsed && (
              <div className="flex items-center space-x-3 flex-1">
                <motion.div 
                  className={`w-10 h-10 rounded-full ${serviceInfo.bg} flex items-center justify-center`}
                  whileHover={{ scale: 1.1 }}
                >
                  <ServiceIcon className={`w-6 h-6 ${serviceInfo.color}`} />
                </motion.div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-base font-semibold text-foreground truncate">
                    {user?.fullName || t('admin')}
                  </h1>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user?.service ? `${user.service} Admin` : t('administrator')}
                  </p>
                </div>
              </div>
            )}
            <motion.button
              onClick={toggleCollapse}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </motion.button>
          </motion.div>

          {/* Navigation Items */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center px-3 py-3 rounded-md text-base font-medium transition-all ${
                  activeSection === item.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                } ${isCollapsed ? "justify-center" : ""}`}
                title={isCollapsed ? item.label : undefined}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <item.icon className={`h-6 w-6 ${isCollapsed ? "" : "mr-4"}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </motion.button>
            ))}
          </nav>

          {/* Quick Access Section */}
          <NavbarQuickAccess items={quickAccessItems} isCollapsed={isCollapsed} />

          {/* Logout Button */}
          <motion.div 
            className="p-3 border-t border-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={handleLogout}
              className={`w-full flex items-center px-3 py-3 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors ${
                isCollapsed ? "justify-center" : ""
              }`}
              title={isCollapsed ? t('logout') : undefined}
            >
              <LogOut className={`h-6 w-6 ${isCollapsed ? "" : "mr-4"}`} />
              {!isCollapsed && <span>{t('logout')}</span>}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <motion.div
            className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-card to-card/95 border-r border-border shadow-lg"
            onClick={(e) => e.stopPropagation()}
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center space-x-3 flex-1">
                <div className={`w-8 h-8 rounded-full ${serviceInfo.bg} flex items-center justify-center`}>
                  <ServiceIcon className={`w-5 h-5 ${serviceInfo.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-sm font-semibold text-foreground truncate">
                    {user?.fullName || t('admin')}
                  </h1>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user?.service ? `${user.service} Admin` : t('administrator')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="px-2 py-4 space-y-1">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-2 rounded-md text-base font-medium transition-all ${
                    activeSection === item.id
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.label}</span>
                </motion.button>
              ))}
              <motion.button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                  navigate("/login");
                }}
                className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut className="w-5 h-5 mr-3" />
                {t('logout')}
              </motion.button>
            </nav>
          </motion.div>
        </div>
      )}

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-card border border-border rounded-md shadow-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </>
  );
};

export default AdminNavbar;
