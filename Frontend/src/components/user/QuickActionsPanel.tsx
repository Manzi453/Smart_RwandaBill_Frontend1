import { useState } from "react";
import { motion } from "framer-motion";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    CreditCard,
    FileText,
    Bell,
    Download,
    Plus,
    TrendingUp,
    CheckCircle,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

// Types & Utils
import { PaymentProcessor } from "./PaymentProcessor";

type PaymentResult = {
    transactionId: string;
    amount: number;
    service: string;
    paymentMethod: string;
    timestamp: Date;
    status: string;
};

interface QuickAction {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    action: () => void;
    color: string;
}

export const QuickActionsPanel = () => {
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [showStatementsDialog, setShowStatementsDialog] = useState(false);
    const [showRemindersDialog, setShowRemindersDialog] = useState(false);
    const [showScheduleDialog, setShowScheduleDialog] = useState(false);
    const [showAnalyticsDialog, setShowAnalyticsDialog] = useState(false);
    const [reminderFrequency, setReminderFrequency] = useState("weekly");
    const [scheduleFrequency, setScheduleFrequency] = useState("monthly");
    const [downloadStatus, setDownloadStatus] = useState<"idle" | "downloading" | "success">("idle");

    // Mock bill data for payment
    const mockBill = {
        id: "bill-001",
        service: "water" as const,
        amount: 15000,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        billingPeriod: "October 2024",
    };

    // Mock payment history
    const paymentHistory = [
        { id: 1, date: "2024-10-01", amount: 15000, service: "Water", status: "Paid" },
        { id: 2, date: "2024-09-01", amount: 12000, service: "Water", status: "Paid" },
        { id: 3, date: "2024-08-01", amount: 15000, service: "Water", status: "Paid" },
    ];

    // Mock analytics data
    const analyticsData = {
        totalSpent: 42000,
        averageMonthly: 14000,
        trend: "↓ 5% from last month",
        breakdown: [
            { service: "Water", amount: 25000, percentage: 60 },
            { service: "Sanitation", amount: 10000, percentage: 24 },
            { service: "Security", amount: 7000, percentage: 16 },
        ],
    };

    const handlePaymentComplete = (result: PaymentResult) => {
        console.log("Payment completed:", result);
        // You can check result.status if you need to handle different statuses
        if (result.status === 'success') {
            // Show success message or handle successful payment
            setTimeout(() => setShowPaymentDialog(false), 2000);
        }
    };

    const handleDownloadReceipt = () => {
        setDownloadStatus("downloading");
        setTimeout(() => {
            setDownloadStatus("success");
            // Simulate file download
            const element = document.createElement("a");
            element.setAttribute("href", "data:text/plain;charset=utf-8,Payment Receipt\n\nTransaction ID: TXN-123456\nAmount: RWF 15,000\nDate: 2024-10-15\nStatus: Paid");
            element.setAttribute("download", "receipt_2024-10-15.txt");
            element.style.display = "none";
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
            setTimeout(() => setDownloadStatus("idle"), 2000);
        }, 1500);
    };

    const handleSetReminder = () => {
        console.log("Reminder set for:", reminderFrequency);
        alert(`Payment reminder set to ${reminderFrequency}!`);
        setShowRemindersDialog(false);
    };

    const handleSchedulePayment = () => {
        console.log("Payment scheduled for:", scheduleFrequency);
        alert(`Recurring payment scheduled ${scheduleFrequency}!`);
        setShowScheduleDialog(false);
    };

    const actions: QuickAction[] = [
        {
            id: "pay-bill",
            title: "Pay Bill",
            description: "Pay your utility bills",
            icon: <CreditCard className="h-6 w-6" />,
            action: () => setShowPaymentDialog(true),
            color: "from-blue-500 to-blue-600",
        },
        {
            id: "view-statements",
            title: "View Statements",
            description: "Check payment history",
            icon: <FileText className="h-6 w-6" />,
            action: () => setShowStatementsDialog(true),
            color: "from-green-500 to-green-600",
        },
        {
            id: "set-reminders",
            title: "Set Reminders",
            description: "Configure payment alerts",
            icon: <Bell className="h-6 w-6" />,
            action: () => setShowRemindersDialog(true),
            color: "from-orange-500 to-orange-600",
        },
        {
            id: "download-receipt",
            title: "Download Receipt",
            description: "Export payment receipts",
            icon: <Download className="h-6 w-6" />,
            action: handleDownloadReceipt,
            color: "from-purple-500 to-purple-600",
        },
        {
            id: "schedule-payment",
            title: "Schedule Payment",
            description: "Set up recurring payments",
            icon: <Plus className="h-6 w-6" />,
            action: () => setShowScheduleDialog(true),
            color: "from-pink-500 to-pink-600",
        },
        {
            id: "view-analytics",
            title: "View Analytics",
            description: "Check spending trends",
            icon: <TrendingUp className="h-6 w-6" />,
            action: () => setShowAnalyticsDialog(true),
            color: "from-indigo-500 to-indigo-600",
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3 },
        },
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-blue-600" />
                            Quick Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {actions.map((action) => (
                                <motion.div key={action.id} variants={itemVariants}>
                                    <Button
                                        onClick={action.action}
                                        variant="outline"
                                        className={`w-full h-auto p-4 flex flex-col items-start gap-2 hover:shadow-lg transition-all duration-300 group`}
                                    >
                                        <div
                                            className={`bg-gradient-to-br ${action.color} p-3 rounded-lg text-white group-hover:scale-110 transition-transform`}
                                        >
                                            {action.icon}
                                        </div>
                                        <div className="text-left">
                                            <p className="font-semibold text-foreground">
                                                {action.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {action.description}
                                            </p>
                                        </div>
                                    </Button>
                                </motion.div>
                            ))}
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Payment Dialog */}
            <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Pay Your Bill</DialogTitle>
                        <DialogDescription>
                            Complete your payment securely using your preferred payment method
                        </DialogDescription>
                    </DialogHeader>
                    <PaymentProcessor
                        bill={mockBill}
                        onPaymentComplete={handlePaymentComplete}
                    />
                </DialogContent>
            </Dialog>

            {/* View Statements Dialog */}
            <Dialog open={showStatementsDialog} onOpenChange={setShowStatementsDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Payment History</DialogTitle>
                        <DialogDescription>
                            View your past payments and transactions
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        {paymentHistory.map((payment) => (
                            <Card key={payment.id}>
                                <CardContent className="pt-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold">{payment.service}</p>
                                            <p className="text-sm text-muted-foreground">{payment.date}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-green-600">RWF {payment.amount.toLocaleString()}</p>
                                            <p className="text-sm text-green-600">{payment.status}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Set Reminders Dialog */}
            <Dialog open={showRemindersDialog} onOpenChange={setShowRemindersDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Set Payment Reminders</DialogTitle>
                        <DialogDescription>
                            Choose how often you want to be reminded about upcoming bills
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Reminder Frequency</label>
                            <select
                                value={reminderFrequency}
                                onChange={(e) => setReminderFrequency(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="biweekly">Bi-weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                        <Alert className="bg-blue-50 border-blue-200">
                            <Bell className="h-4 w-4 text-blue-600" />
                            <AlertDescription className="text-blue-700">
                                You'll receive notifications {reminderFrequency} about your upcoming bills
                            </AlertDescription>
                        </Alert>
                        <Button onClick={handleSetReminder} className="w-full">
                            Set Reminder
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Schedule Payment Dialog */}
            <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Schedule Recurring Payment</DialogTitle>
                        <DialogDescription>
                            Set up automatic payments for your bills
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Payment Frequency</label>
                            <select
                                value={scheduleFrequency}
                                onChange={(e) => setScheduleFrequency(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="weekly">Weekly</option>
                                <option value="biweekly">Bi-weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                            </select>
                        </div>
                        <Alert className="bg-green-50 border-green-200">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-700">
                                Payments will be automatically deducted {scheduleFrequency}
                            </AlertDescription>
                        </Alert>
                        <Button onClick={handleSchedulePayment} className="w-full">
                            Schedule Payment
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* View Analytics Dialog */}
            <Dialog open={showAnalyticsDialog} onOpenChange={setShowAnalyticsDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Spending Analytics</DialogTitle>
                        <DialogDescription>
                            View your spending trends and breakdown
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <Card>
                                <CardContent className="pt-6">
                                    <p className="text-sm text-muted-foreground">Total Spent</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        RWF {analyticsData.totalSpent.toLocaleString()}
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <p className="text-sm text-muted-foreground">Monthly Average</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        RWF {analyticsData.averageMonthly.toLocaleString()}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Trend */}
                        <Alert className="bg-blue-50 border-blue-200">
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                            <AlertDescription className="text-blue-700">
                                {analyticsData.trend}
                            </AlertDescription>
                        </Alert>

                        {/* Breakdown */}
                        <div>
                            <h3 className="font-semibold mb-3">Spending Breakdown</h3>
                            <div className="space-y-3">
                                {analyticsData.breakdown.map((item, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium">{item.service}</span>
                                            <span className="text-sm font-semibold">
                        {item.percentage}% (RWF {item.amount.toLocaleString()})
                      </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{ width: `${item.percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Download Receipt Status */}
            {downloadStatus !== "idle" && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed bottom-4 right-4 z-50"
                >
                    <Card className="bg-white shadow-lg">
                        <CardContent className="pt-6">
                            {downloadStatus === "downloading" && (
                                <div className="flex items-center gap-2">
                                    <div className="animate-spin">
                                        <Download className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <span>Downloading receipt...</span>
                                </div>
                            )}
                            {downloadStatus === "success" && (
                                <div className="flex items-center gap-2 text-green-600">
                                    <CheckCircle className="h-5 w-5" />
                                    <span>Receipt downloaded successfully!</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </>
    );
};
