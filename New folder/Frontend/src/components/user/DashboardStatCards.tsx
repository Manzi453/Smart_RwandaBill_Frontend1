import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, CheckCircle, Clock, AlertCircle, DollarSign } from "lucide-react";

interface StatCard {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    trend?: string;
}

interface DashboardStatCardsProps {
    totalBills?: number;
    paidBills?: number;
    pendingBills?: number;
    overdueBills?: number;
    totalDue?: number;
}

export const DashboardStatCards = ({
                                       totalBills = 12,
                                       paidBills = 10,
                                       pendingBills = 1,
                                       overdueBills = 1,
                                       totalDue = 5000,
                                   }: DashboardStatCardsProps) => {
    const { t } = useTranslation();
    const stats: StatCard[] = [
        {
            label: t("totalBills"),
            value: totalBills,
            icon: <FileText className="h-6 w-6" />,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            trend: t("thisMonth", { count: 2 }),
        },
        {
            label: t("paidBills"),
            value: paidBills,
            icon: <CheckCircle className="h-6 w-6" />,
            color: "text-green-600",
            bgColor: "bg-green-50",
            trend: t("percentPaid", { percent: Math.round((paidBills / totalBills) * 100) }),
        },
        {
            label: t("pendingBills"),
            value: pendingBills,
            icon: <Clock className="h-6 w-6" />,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
            trend: t("dueSoon"),
        },
        {
            label: t("overdueBills"),
            value: overdueBills,
            icon: <AlertCircle className="h-6 w-6" />,
            color: "text-red-600",
            bgColor: "bg-red-50",
            trend: t("actionNeeded"),
        },
        {
            label: t("totalDue"),
            value: `RWF ${totalDue.toLocaleString()}`,
            icon: <DollarSign className="h-6 w-6" />,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            trend: t("thisPeriod"),
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {stats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                >
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-sm text-muted-foreground font-medium">
                                        {stat.label}
                                    </p>
                                    <h3 className="text-2xl font-bold mt-2 text-foreground">
                                        {stat.value}
                                    </h3>
                                    {stat.trend && (
                                        <p className="text-xs text-muted-foreground mt-2">
                                            {stat.trend}
                                        </p>
                                    )}
                                </div>
                                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                                    <div className={stat.color}>{stat.icon}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
};