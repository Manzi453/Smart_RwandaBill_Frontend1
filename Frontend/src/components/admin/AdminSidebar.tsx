import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Home, 
  Users, 
  Settings, 
  LogOut,
  Menu, 
  ChevronLeft,
  Building2,
  BarChart3,
  UserCog,
  FileBarChart2,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  roles?: string[];
}

interface AdminSidebarProps {
  className?: string;
  isOpen?: boolean;
  toggleSidebar?: () => void;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: <Home className="h-5 w-5" />,
    roles: ['admin', 'superadmin']
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: <Users className="h-5 w-5" />,
    roles: ['admin', 'superadmin']
  },
  {
    title: 'Reports',
    href: '/admin/reports',
    icon: <FileBarChart2 className="h-5 w-5" />,
    roles: ['admin', 'superadmin']
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: <BarChart3 className="h-5 w-5" />,
    roles: ['superadmin']
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: <Settings className="h-5 w-5" />,
    roles: ['admin', 'superadmin']
  },
  {
    title: 'Support',
    href: '/admin/support',
    icon: <HelpCircle className="h-5 w-5" />
  },
  {
    title: 'Messages',
    href: '/admin/messages',
    icon: <MessageSquare className="h-5 w-5" />,
    roles: ['admin', 'superadmin']
  }
];

export function AdminSidebar({ className, isOpen = true, toggleSidebar }: AdminSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredNavItems = navItems.filter(item => 
    !item.roles || (user?.role && item.roles.includes(user.role))
  );

  return (
    <div 
      className={cn(
        "h-screen fixed top-0 left-0 z-40 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out flex flex-col",
        isOpen 
          ? 'w-72 md:w-80 lg:w-64 xl:w-72 2xl:w-80' // Expanded state with responsive widths
          : 'w-20', // Collapsed state
        !isOpen && '-translate-x-full lg:translate-x-0', // Hide on mobile when closed, show as collapsed on desktop
        className
      )}
    >
      {/* Logo and Toggle */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
        {isOpen ? (
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              RwandaBill
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isOpen ? (
            <ChevronLeft className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="space-y-1 px-2">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary dark:bg-primary/20"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
                  isOpen ? "justify-start" : "justify-center"
                )}
              >
                <span className={cn("flex-shrink-0", isOpen ? "mr-3" : "")}>
                  {React.cloneElement(item.icon as React.ReactElement, {
                    className: cn("h-5 w-5", isActive ? "text-primary" : "text-gray-500")
                  })}
                </span>
                {isOpen && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      
      {/* User Profile & Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className={cn("flex items-center", isOpen ? "justify-between" : "justify-center")}>
          {isOpen && (
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                <UserCog className="h-5 w-5 text-primary" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{user?.fullName || 'Admin'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.role || 'Administrator'}
                </p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="h-9 w-9 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 group relative"
            title="Logout"
          >
            {!isOpen && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                Logout
              </div>
            )}
            <LogOut className="h-5 w-5 text-red-500" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AdminSidebar;
