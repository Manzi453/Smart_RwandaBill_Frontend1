import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bell,
  MessageSquare,
  AlertCircle,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
} from "lucide-react";

interface QuickAccessItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
  badge?: number;
}

interface NavbarQuickAccessProps {
  items?: QuickAccessItem[];
  isCollapsed?: boolean;
}

export const NavbarQuickAccess = ({
  items,
  isCollapsed = false,
}: NavbarQuickAccessProps) => {
  // Default quick access items
  const defaultItems: QuickAccessItem[] = [
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="h-5 w-5" />,
      color: "text-blue-600",
      action: () => console.log("Notifications"),
      badge: 3,
    },
    {
      id: "messages",
      label: "Messages",
      icon: <MessageSquare className="h-5 w-5" />,
      color: "text-green-600",
      action: () => console.log("Messages"),
      badge: 1,
    },
    {
      id: "alerts",
      label: "Alerts",
      icon: <AlertCircle className="h-5 w-5" />,
      color: "text-red-600",
      action: () => console.log("Alerts"),
    },
    {
      id: "reports",
      label: "Reports",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-purple-600",
      action: () => console.log("Reports"),
    },
  ];

  const quickItems = items || defaultItems;

  if (isCollapsed) {
    return (
      <div className="px-2 py-3 space-y-2 border-t border-border">
        {quickItems.map((item, index) => (
          <motion.button
            key={item.id}
            onClick={item.action}
            className="w-full p-2 rounded-lg hover:bg-muted transition-colors relative group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            title={item.label}
          >
            <div className={item.color}>{item.icon}</div>
            {item.badge && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                {item.badge}
              </span>
            )}
            {/* Tooltip */}
            <div className="absolute left-full ml-2 px-2 py-1 bg-foreground text-background text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              {item.label}
            </div>
          </motion.button>
        ))}
      </div>
    );
  }

  return (
    <div className="px-2 py-3 space-y-2 border-t border-border">
      <p className="text-xs font-semibold text-muted-foreground px-3 uppercase tracking-wider">
        Quick Access
      </p>
      <div className="space-y-1">
        {quickItems.map((item, index) => (
          <motion.button
            key={item.id}
            onClick={item.action}
            className="w-full flex items-center px-3 py-2 rounded-lg hover:bg-muted transition-colors relative group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className={item.color}>{item.icon}</div>
            <span className="ml-3 text-sm font-medium flex-1 text-left">
              {item.label}
            </span>
            {item.badge && (
              <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                {item.badge}
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
