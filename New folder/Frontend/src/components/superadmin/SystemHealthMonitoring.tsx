import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  AlertTriangle,
  Zap,
  Database,
  Server,
  Wifi,
  Clock,
} from "lucide-react";

interface HealthMetric {
  name: string;
  status: "healthy" | "warning" | "critical";
  value: string;
  icon: React.ReactNode;
}

interface SystemHealthMonitoringProps {
  metrics?: HealthMetric[];
}

export const SystemHealthMonitoring = ({
  metrics = [
    {
      name: "API Server",
      status: "healthy",
      value: "99.9% uptime",
      icon: <Server className="h-6 w-6" />,
    },
    {
      name: "Database",
      status: "healthy",
      value: "2.3ms avg response",
      icon: <Database className="h-6 w-6" />,
    },
    {
      name: "Network",
      status: "healthy",
      value: "Stable connection",
      icon: <Wifi className="h-6 w-6" />,
    },
    {
      name: "CPU Usage",
      status: "warning",
      value: "72% utilization",
      icon: <Zap className="h-6 w-6" />,
    },
    {
      name: "Memory",
      status: "healthy",
      value: "45% utilization",
      icon: <Clock className="h-6 w-6" />,
    },
    {
      name: "Disk Space",
      status: "healthy",
      value: "62% used",
      icon: <Database className="h-6 w-6" />,
    },
  ],
}: SystemHealthMonitoringProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "critical":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-green-50 border-green-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "critical":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  const healthyCount = metrics.filter((m) => m.status === "healthy").length;
  const warningCount = metrics.filter((m) => m.status === "warning").length;
  const criticalCount = metrics.filter((m) => m.status === "critical").length;

  return (
    <div className="space-y-6">
      {/* Health Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>System Health Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-3xl font-bold text-green-600">
                  {healthyCount}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Healthy</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-3xl font-bold text-yellow-600">
                  {warningCount}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Warning</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-3xl font-bold text-red-600">
                  {criticalCount}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Critical</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Alerts */}
      {(warningCount > 0 || criticalCount > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              {warningCount + criticalCount} system issue(s) detected. Please
              review and take action if necessary.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Health Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className={`border-2 ${getStatusBg(metric.status)}`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={getStatusColor(metric.status)}>
                        {metric.icon}
                      </div>
                      <p className="font-semibold text-sm">{metric.name}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {metric.value}
                    </p>
                  </div>
                  <div>{getStatusIcon(metric.status)}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Detailed Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Detailed Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.map((metric) => (
                <div
                  key={metric.name}
                  className={`p-3 rounded-lg border ${getStatusBg(
                    metric.status
                  )}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={getStatusColor(metric.status)}>
                        {metric.icon}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{metric.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {metric.value}
                        </p>
                      </div>
                    </div>
                    <div>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          metric.status === "healthy"
                            ? "bg-green-100 text-green-800"
                            : metric.status === "warning"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {metric.status.charAt(0).toUpperCase() +
                          metric.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Last Updated */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-xs text-muted-foreground"
      >
        Last updated: {new Date().toLocaleTimeString()}
      </motion.div>
    </div>
  );
};
