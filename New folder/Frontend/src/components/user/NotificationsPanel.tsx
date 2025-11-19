import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  Clock,
} from "lucide-react";
import { useState } from "react";

interface Notification {
  id: string;
  type: "alert" | "success" | "info" | "warning";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationsPanelProps {
  notifications?: Notification[];
  onDismiss?: (id: string) => void;
}

export const NotificationsPanel = ({
  notifications = [
    {
      id: "1",
      type: "alert",
      title: "Bill Due Soon",
      message: "Your water bill is due on November 15, 2024",
      timestamp: "2 hours ago",
      read: false,
    },
    {
      id: "2",
      type: "warning",
      title: "Overdue Payment",
      message: "You have 1 overdue bill. Please pay immediately.",
      timestamp: "1 day ago",
      read: false,
    },
    {
      id: "3",
      type: "success",
      title: "Payment Received",
      message: "Your payment of RWF 15,000 has been successfully processed.",
      timestamp: "3 days ago",
      read: true,
    },
    {
      id: "4",
      type: "info",
      title: "New Feature",
      message: "Check out our new bill export feature in the dashboard.",
      timestamp: "1 week ago",
      read: true,
    },
  ],
  onDismiss,
}: NotificationsPanelProps) => {
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const handleDismiss = (id: string) => {
    setDismissedIds([...dismissedIds, id]);
    onDismiss?.(id);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case "warning":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "alert":
        return "bg-red-50 border-l-4 border-red-600";
      case "warning":
        return "bg-yellow-50 border-l-4 border-yellow-600";
      case "success":
        return "bg-green-50 border-l-4 border-green-600";
      case "info":
        return "bg-blue-50 border-l-4 border-blue-600";
      default:
        return "bg-gray-50 border-l-4 border-gray-600";
    }
  };

  const visibleNotifications = notifications.filter(
    (n) => !dismissedIds.includes(n.id)
  );

  const unreadCount = visibleNotifications.filter((n) => !n.read).length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <CardTitle>Notifications & Alerts</CardTitle>
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform bg-red-600 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <AnimatePresence mode="popLayout">
          {visibleNotifications.length > 0 ? (
            visibleNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-lg flex items-start gap-3 ${getBgColor(
                  notification.type
                )} ${!notification.read ? "ring-1 ring-offset-1 ring-current" : ""}`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground">
                    {notification.title}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {notification.timestamp}
                  </p>
                </div>
                <button
                  onClick={() => handleDismiss(notification.id)}
                  className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <Bell className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-muted-foreground">No notifications</p>
            </motion.div>
          )}
        </AnimatePresence>

        {visibleNotifications.length > 0 && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setDismissedIds(notifications.map((n) => n.id))}
          >
            Clear All
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
