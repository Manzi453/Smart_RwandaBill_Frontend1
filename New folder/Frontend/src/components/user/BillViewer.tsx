import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Download,
    ChevronDown,
    AlertCircle,
    CheckCircle,
    Clock,
    Droplet,
    Trash2,
    Shield,
} from "lucide-react";

interface MeterReading {
    current: number;
    previous: number;
    consumption: number;
    unit: "m³" | "units";
    readingDate: Date;
}

interface BillBreakdown {
    baseCharge: number;
    consumptionCharge?: number;
    tax: number;
    penalties?: number;
    discount?: number;
}

interface Bill {
    id: string;
    service: "water" | "sanitation" | "security";
    billingPeriod: string;
    issueDate: Date;
    dueDate: Date;
    amount: number;
    status: "issued" | "paid" | "overdue" | "disputed";
    meterReading?: MeterReading;
    breakdown: BillBreakdown;
    pdfUrl?: string;
    description?: string;
}

export const BillViewer = ({ bill }: { bill: Bill }) => {
    const { t } = useTranslation();
    const [showBreakdown, setShowBreakdown] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    const getDaysUntilDue = () => {
        const today = new Date();
        const due = new Date(bill.dueDate);
        const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diff;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "paid":
                return "bg-green-100 text-green-800 border-green-300";
            case "overdue":
                return "bg-red-100 text-red-800 border-red-300";
            case "disputed":
                return "bg-orange-100 text-orange-800 border-orange-300";
            default:
                return "bg-yellow-100 text-yellow-800 border-yellow-300";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "paid":
                return <CheckCircle className="h-4 w-4" />;
            case "overdue":
                return <AlertCircle className="h-4 w-4" />;
            case "disputed":
                return <AlertCircle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const getServiceIcon = (service: string) => {
        switch (service) {
            case "water":
                return <Droplet className="h-5 w-5 text-blue-600" />;
            case "sanitation":
                return <Trash2 className="h-5 w-5 text-orange-600" />;
            case "security":
                return <Shield className="h-5 w-5 text-green-600" />;
            default:
                return null;
        }
    };

    const handleDownloadPDF = () => {
        if (bill.pdfUrl) {
            const link = document.createElement("a");
            link.href = bill.pdfUrl;
            link.download = `bill-${bill.id}.pdf`;
            link.click();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
        >
            {/* Header Card */}
            <Card className="border-2">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {getServiceIcon(bill.service)}
                            <div>
                                <CardTitle className="capitalize">{t(bill.service)} {t("bill")}</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {bill.billingPeriod}
                                </p>
                            </div>
                        </div>
                        <Badge className={`${getStatusColor(bill.status)} flex items-center gap-1`}>
                            {getStatusIcon(bill.status)}
                            {t(bill.status)}
                        </Badge>
                    </div>
                </CardHeader>
            </Card>

            {/* Amount Due Section */}
            <Card>
                <CardContent className="pt-6">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                        <p className="text-sm text-muted-foreground mb-2">{t("amountDue")}</p>
                        <p className="text-4xl font-bold text-blue-600">
                            RWF {bill.amount.toLocaleString()}
                        </p>

                        {/* Due Date Status */}
                        {bill.status !== "paid" && (
                            <div className="mt-4">
                                {getDaysUntilDue() > 0 ? (
                                    <p className="text-sm font-semibold text-orange-600">
                                        ⏰ {t("dueInDays", { days: getDaysUntilDue() })}
                                    </p>
                                ) : (
                                    <Alert variant="destructive" className="mt-2">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            ⚠️ {t("billOverdue")}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        )}

                        {bill.status === "paid" && (
                            <p className="text-sm font-semibold text-green-600 mt-4">
                                ✓ {t("paymentReceivedOn", { date: new Date().toLocaleDateString() })}
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Dates Section */}
            <Card>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">
                                {t("issueDate")}
                            </p>
                            <p className="text-lg font-semibold mt-1">
                                {new Date(bill.issueDate).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wide">
                                {t("dueDate")}
                            </p>
                            <p className="text-lg font-semibold mt-1">
                                {new Date(bill.dueDate).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Meter Reading (for Water/Sanitation) */}
            {bill.meterReading && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">{t("meterReading")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center p-3 bg-muted/50 rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">{t("previous")}</p>
                                <p className="text-2xl font-bold">
                                    {bill.meterReading.previous}
                                </p>
                            </div>
                            <div className="text-center p-3 bg-muted/50 rounded-lg">
                                <p className="text-xs text-muted-foreground mb-1">{t("current")}</p>
                                <p className="text-2xl font-bold">{bill.meterReading.current}</p>
                            </div>
                            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-xs text-muted-foreground mb-1">{t("consumption")}</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {bill.meterReading.consumption}
                                </p>
                                <p className="text-xs text-blue-600">{bill.meterReading.unit}</p>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-3">
                            {t("readingDate")}: {new Date(bill.meterReading.readingDate).toLocaleDateString()}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Bill Description */}
            {bill.description && (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{bill.description}</AlertDescription>
                </Alert>
            )}

            {/* Bill Breakdown */}
            <Card>
                <CardHeader>
                    <button
                        onClick={() => setShowBreakdown(!showBreakdown)}
                        className="flex items-center justify-between w-full"
                    >
                        <CardTitle className="text-base">{t("billBreakdown")}</CardTitle>
                        <ChevronDown
                            className={`h-5 w-5 transition-transform ${
                                showBreakdown ? "rotate-180" : ""
                            }`}
                        />
                    </button>
                </CardHeader>

                {showBreakdown && (
                    <CardContent className="space-y-3 border-t pt-4">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">{t("baseCharge")}</span>
                            <span className="font-semibold">
                RWF {bill.breakdown.baseCharge.toLocaleString()}
              </span>
                        </div>

                        {bill.breakdown.consumptionCharge && (
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">{t("consumptionCharge")}</span>
                                <span className="font-semibold">
                  RWF {bill.breakdown.consumptionCharge.toLocaleString()}
                </span>
                            </div>
                        )}

                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">{t("tax")} (18%)</span>
                            <span className="font-semibold">
                RWF {bill.breakdown.tax.toLocaleString()}
              </span>
                        </div>

                        {bill.breakdown.penalties && (
                            <div className="flex justify-between items-center text-red-600">
                                <span>{t("latePaymentPenalties")}</span>
                                <span className="font-semibold">
                  RWF {bill.breakdown.penalties.toLocaleString()}
                </span>
                            </div>
                        )}

                        {bill.breakdown.discount && (
                            <div className="flex justify-between items-center text-green-600">
                                <span>{t("discountApplied")}</span>
                                <span className="font-semibold">
                  -RWF {bill.breakdown.discount.toLocaleString()}
                </span>
                            </div>
                        )}

                        <div className="border-t pt-3 flex justify-between items-center font-bold text-lg">
                            <span>{t("totalAmountDue")}</span>
                            <span className="text-blue-600">
                RWF {bill.amount.toLocaleString()}
              </span>
                        </div>
                    </CardContent>
                )}
            </Card>

            {/* Additional Details */}
            <Card>
                <CardHeader>
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="flex items-center justify-between w-full"
                    >
                        <CardTitle className="text-base">{t("additionalDetails")}</CardTitle>
                        <ChevronDown
                            className={`h-5 w-5 transition-transform ${
                                showDetails ? "rotate-180" : ""
                            }`}
                        />
                    </button>
                </CardHeader>

                {showDetails && (
                    <CardContent className="space-y-2 border-t pt-4 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">{t("billId")}:</span>
                            <span className="font-mono">{bill.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">{t("serviceType")}:</span>
                            <span className="capitalize font-semibold">{t(bill.service)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">{t("billingPeriod")}:</span>
                            <span className="font-semibold">{bill.billingPeriod}</span>
                        </div>
                    </CardContent>
                )}
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-2">
                {bill.status !== "paid" && (
                    <Button className="flex-1">
                        {t("payNow")}
                    </Button>
                )}
                {bill.pdfUrl && (
                    <Button
                        onClick={handleDownloadPDF}
                        variant="outline"
                        className="flex-1"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        {t("downloadPDF")}
                    </Button>
                )}
            </div>
        </motion.div>
    );
};