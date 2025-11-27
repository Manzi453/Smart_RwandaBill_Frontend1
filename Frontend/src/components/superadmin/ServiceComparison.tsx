import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Droplets, Trash2, Shield } from "lucide-react";

interface ServiceData {
  service: string;
  users: number;
  revenue: number;
  bills: number;
  collectionRate: number;
}

interface ServiceComparisonProps {
  data?: ServiceData[];
}

export const ServiceComparison = ({
  data = [
    {
      service: "Water",
      users: 2543,
      revenue: 75000000,
      bills: 5200,
      collectionRate: 92,
    },
    {
      service: "Sanitation",
      users: 1856,
      revenue: 45000000,
      bills: 3100,
      collectionRate: 88,
    },
    {
      service: "Security",
      users: 1234,
      revenue: 67500000,
      bills: 4100,
      collectionRate: 95,
    },
  ],
}: ServiceComparisonProps) => {
  const getServiceIcon = (service: string) => {
    switch (service) {
      case "Water":
        return <Droplets className="h-5 w-5 text-blue-600" />;
      case "Sanitation":
        return <Trash2 className="h-5 w-5 text-orange-600" />;
      case "Security":
        return <Shield className="h-5 w-5 text-green-600" />;
      default:
        return null;
    }
  };

  const getServiceColor = (service: string) => {
    switch (service) {
      case "Water":
        return "bg-blue-50";
      case "Sanitation":
        return "bg-orange-50";
      case "Security":
        return "bg-green-50";
      default:
        return "bg-gray-50";
    }
  };

  return (
    <div className="space-y-6">
      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((service, index) => (
          <motion.div
            key={service.service}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className={`${getServiceColor(service.service)}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{service.service}</CardTitle>
                  {getServiceIcon(service.service)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Users</p>
                    <p className="text-2xl font-bold">
                      {(service.users / 1000).toFixed(1)}K
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-bold">
                      {(service.revenue / 1000000).toFixed(0)}M
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Bills</p>
                    <p className="text-2xl font-bold">
                      {(service.bills / 1000).toFixed(1)}K
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Collection</p>
                    <p className="text-2xl font-bold">{service.collectionRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Revenue Comparison Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Revenue Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="service" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => `RWF ${(value / 1000000).toFixed(1)}M`}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#3b82f6" name="Revenue (RWF)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Collection Rate Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Collection Rate Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="service" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="collectionRate"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", r: 5 }}
                  name="Collection Rate (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Detailed Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium">
                      Service
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium">
                      Users
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium">
                      Revenue
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium">
                      Bills
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium">
                      Collection Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.map((service) => (
                    <tr key={service.service} className="hover:bg-muted/30">
                      <td className="px-4 py-3 text-sm font-medium">
                        <div className="flex items-center gap-2">
                          {getServiceIcon(service.service)}
                          {service.service}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {service.users.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold">
                        RWF {(service.revenue / 1000000).toFixed(1)}M
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {service.bills.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {service.collectionRate}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
