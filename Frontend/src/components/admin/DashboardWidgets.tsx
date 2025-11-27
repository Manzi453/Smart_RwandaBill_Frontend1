import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  X,
} from "lucide-react";
import { useState } from "react";

interface Widget {
  id: string;
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  color: string;
  visible: boolean;
}

interface DashboardWidgetsProps {
  widgets?: Widget[];
  onToggleWidget?: (id: string) => void;
}

export const DashboardWidgets = ({
  widgets = [
    {
      id: "revenue",
      title: "Total Revenue",
      value: "RWF 187.5M",
      change: "+12%",
      icon: <DollarSign className="h-6 w-6" />,
      color: "text-green-600",
      visible: true,
    },
    {
      id: "users",
      title: "Active Users",
      value: "2,543",
      change: "+5%",
      icon: <Users className="h-6 w-6" />,
      color: "text-blue-600",
      visible: true,
    },
    {
      id: "pending",
      title: "Pending Bills",
      value: "456",
      change: "-3%",
      icon: <Clock className="h-6 w-6" />,
      color: "text-yellow-600",
      visible: true,
    },
    {
      id: "growth",
      title: "Growth Rate",
      value: "8.5%",
      change: "+2.1%",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "text-purple-600",
      visible: true,
    },
  ],
  onToggleWidget,
}: DashboardWidgetsProps) => {
  const [visibleWidgets, setVisibleWidgets] = useState(
    widgets.reduce((acc, w) => ({ ...acc, [w.id]: w.visible }), {})
  );

  const handleToggle = (id: string) => {
    setVisibleWidgets((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    onToggleWidget?.(id);
  };

  const visibleCount = Object.values(visibleWidgets).filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Widget Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Dashboard Widgets</h3>
        <span className="text-sm text-muted-foreground">
          {visibleCount} of {widgets.length} visible
        </span>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {widgets.map((widget, index) => (
          visibleWidgets[widget.id] && (
            <motion.div
              key={widget.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="relative hover:shadow-lg transition-shadow">
                {/* Hide Button */}
                <button
                  onClick={() => handleToggle(widget.id)}
                  className="absolute top-2 right-2 p-1 hover:bg-muted rounded-md transition-colors opacity-0 hover:opacity-100"
                  title="Hide widget"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm font-medium">
                      {widget.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg bg-muted`}>
                      <div className={widget.color}>{widget.icon}</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-foreground">
                      {widget.value}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-green-600">
                        {widget.change}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        vs last month
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        ))}
      </div>

      {/* Widget Settings */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <p className="text-sm font-medium">Show/Hide Widgets</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {widgets.map((widget) => (
                <Button
                  key={widget.id}
                  variant={visibleWidgets[widget.id] ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleToggle(widget.id)}
                  className="text-xs"
                >
                  {widget.title}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
