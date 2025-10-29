import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import {
  User,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  CreditCard,
  Bell,
  Receipt,
} from "lucide-react";

interface UserNavbarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

const UserNavbar = ({
  activeSection,
  onSectionChange,
  collapsed = false,
  onCollapsedChange,
}: UserNavbarProps) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { t } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const navItems = [
    { id: "dashboard", label: t('dashboard'), icon: BarChart3 },
    { id: "profile", label: t('profile'), icon: User },
    { id: "settings", label: t('settings'), icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex md:flex-col md:fixed md:inset-y-0 md:z-50 transition-all duration-300 ${
          isCollapsed ? "md:w-20" : "md:w-64"
        }`}
      >
        <div className="flex flex-col flex-grow bg-card border-r border-border shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-base font-semibold text-foreground truncate">
                    {user?.fullName || t('user')}
                  </h1>
                  <p className="text-sm text-muted-foreground">{t('member')}</p>
                </div>
              </div>
            )}
            <button
              onClick={toggleCollapse}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center px-3 py-3 rounded-md text-base font-medium transition-colors ${
                  activeSection === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                } ${isCollapsed ? "justify-center" : ""}`}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon className={`h-6 w-6 ${isCollapsed ? "" : "mr-4"}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-3 border-t border-border">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center px-3 py-3 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ${
                isCollapsed ? "justify-center" : ""
              }`}
              title={isCollapsed ? t('logout') : undefined}
            >
              <Settings className={`h-6 w-6 ${isCollapsed ? "" : "mr-4"}`} />
              {!isCollapsed && <span>{t('logout')}</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-sm font-semibold text-foreground truncate">
                    {user?.fullName || t('user')}
                  </h1>
                  <p className="text-xs text-muted-foreground">{t('member')}</p>
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
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    activeSection === item.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  <span>{item.label}</span>
                </button>
              ))}
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                  navigate("/login");
                }}
                className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <Settings className="w-5 h-5 mr-3" />
                {t('logout')}
              </button>
            </nav>
          </div>
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

export default UserNavbar;
