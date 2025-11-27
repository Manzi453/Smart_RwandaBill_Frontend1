import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

export const SpendingAnalytics = () => {
  // Monthly spending data
  const monthlyData = [
    { month: "Jan", water: 15000, security: 25000, sanitation: 8000 },
    { month: "Feb", water: 16000, security: 25000, sanitation: 8500 },
    { month: "Mar", water: 14000, security: 25000, sanitation: 7800 },
    { month: "Apr", water: 18000, security: 25000, sanitation: 9000 },
    { month: "May", water: 17000, security: 25000, sanitation: 8200 },
    { month: "Jun", water: 19000, security: 25000, sanitation: 9500 },
  ];

  // Service breakdown
  const serviceData = [
    { name: "Water", value: 99000, color: "#3b82f6" },
    { name: "Security", value: 150000, color: "#10b981" },
    { name: "Sanitation", value: 51000, color: "#f59e0b" },
  ];

  // Spending trends
  const trendData = [
    { week: "Week 1", amount: 12000 },
    { week: "Week 2", amount: 15000 },
    { week: "Week 3", amount: 11000 },
    { week: "Week 4", amount: 18000 },
  ];

  // Category comparison
  const categoryComparison = [
    { category: "Water", current: 19000, average: 16500, trend: "up" },
    { category: "Security", current: 25000, average: 25000, trend: "stable" },
    { category: "Sanitation", current: 9500, average: 8500, trend: "up" },
  ];


  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {categoryComparison.map((item, idx) => (
          <Card key={idx}>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{item.category}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold">
                    RWF {item.current.toLocaleString()}
                  </p>
                  <div
                    className={`flex items-center gap-1 text-sm font-semibold ${
                      item.trend === "up"
                        ? "text-red-600"
                        : item.trend === "down"
                          ? "text-green-600"
                          : "text-gray-600"
                    }`}
                  >
                    {item.trend === "up" ? (
                      <>
                        <TrendingUp className="h-4 w-4" />
                        +{Math.round(((item.current - item.average) / item.average) * 100)}%
                      </>
                    ) : item.trend === "down" ? (
                      <>
                        <TrendingDown className="h-4 w-4" />
                        -{Math.round(((item.average - item.current) / item.average) * 100)}%
                      </>
                    ) : (
                      "Stable"
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Avg: RWF {item.average.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Monthly Spending Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Monthly Spending by Service</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `RWF ${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="water" fill="#3b82f6" name="Water" />
                <Bar dataKey="security" fill="#10b981" name="Security" />
                <Bar dataKey="sanitation" fill="#f59e0b" name="Sanitation" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Service Breakdown Pie Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Service Breakdown (6 months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `RWF ${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Spending Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip formatter={(value) => `RWF ${value.toLocaleString()}`} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Spending Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">💡 Tip:</span> Your water usage
                has increased by 12% this month. Consider checking for leaks.
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-900">
                <span className="font-semibold">✓ Good:</span> Your security
                payments are consistent and on-time.
              </p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-900">
                <span className="font-semibold">⚠️ Alert:</span> Sanitation
                fees increased by 8%. Review the latest rate changes.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
