import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentEvent {
  date: number;
  type: "due" | "paid" | "overdue";
  service: string;
  amount: number;
}

export const PaymentCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Mock payment events
  const events: PaymentEvent[] = [
    { date: 5, type: "paid", service: "Water Bill", amount: 15000 },
    { date: 10, type: "due", service: "Security", amount: 25000 },
    { date: 15, type: "paid", service: "Sanitation", amount: 8000 },
    { date: 20, type: "overdue", service: "Water Bill", amount: 15000 },
    { date: 25, type: "due", service: "Electricity", amount: 35000 },
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventForDate = (day: number): PaymentEvent | undefined => {
    return events.find((e) => e.date === day);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const monthName = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const getEventColor = (type: string) => {
    switch (type) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "due":
        return "bg-blue-100 text-blue-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "paid":
        return <CheckCircle className="h-3 w-3" />;
      case "overdue":
        return <AlertCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Payment Calendar</CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handlePrevMonth}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleNextMonth}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">{monthName}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Calendar Grid */}
          <div className="space-y-2">
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-2">
              {emptyDays.map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              {days.map((day) => {
                const event = getEventForDate(day);
                return (
                  <motion.div
                    key={day}
                    whileHover={{ scale: 1.05 }}
                    className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer transition-all ${
                      event
                        ? `${getEventColor(event.type)} border-current`
                        : "border-border hover:border-primary"
                    }`}
                  >
                    <span className="text-sm font-semibold">{day}</span>
                    {event && (
                      <div className="flex items-center gap-0.5 mt-1">
                        {getEventIcon(event.type)}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="border-t pt-4 space-y-2">
            <p className="text-sm font-semibold">Legend</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-100 border border-green-800" />
                <span className="text-sm text-muted-foreground">Paid</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-blue-100 border border-blue-800" />
                <span className="text-sm text-muted-foreground">Due</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-100 border border-red-800" />
                <span className="text-sm text-muted-foreground">Overdue</span>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          {events.length > 0 && (
            <div className="border-t pt-4 space-y-2">
              <p className="text-sm font-semibold">Upcoming Payments</p>
              <div className="space-y-2">
                {events
                  .filter((e) => e.type !== "paid")
                  .map((event, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium">{event.service}</p>
                        <p className="text-xs text-muted-foreground">
                          {currentMonth.toLocaleString("default", {
                            month: "short",
                          })}{" "}
                          {event.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">
                          RWF {event.amount.toLocaleString()}
                        </p>
                        <Badge
                          variant={
                            event.type === "overdue" ? "destructive" : "default"
                          }
                          className="text-xs mt-1"
                        >
                          {event.type === "overdue" ? "Overdue" : "Due"}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
