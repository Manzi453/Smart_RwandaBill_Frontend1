import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Select,
} from "@/components/ui/select";
import {
    Bell,
    Lock,
    Download,
    Palette,
    Eye,
    EyeOff,
    CheckCircle,
    AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface NotificationSettings {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    paymentReminders: boolean;
    overdueAlerts: boolean;
    promotionalEmails: boolean;
}

interface PrivacySettings {
    profileVisibility: "public" | "private" | "friends";
    showPaymentHistory: boolean;
    allowDataSharing: boolean;
    allowAnalytics: boolean;
}

export const EnhancedSettings = () => {
    const { t } = useTranslation();
    const [notifications, setNotifications] = useState<NotificationSettings>({
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: false,
        paymentReminders: true,
        overdueAlerts: true,
        promotionalEmails: false,
    });

    const [privacy, setPrivacy] = useState<PrivacySettings>({
        profileVisibility: "private",
        showPaymentHistory: false,
        allowDataSharing: false,
        allowAnalytics: true,
    });

    const [theme, setTheme] = useState("light");
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleNotificationChange = (
        key: keyof NotificationSettings,
        value: boolean
    ) => {
        setNotifications((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handlePrivacyChange = (
        key: keyof PrivacySettings,
        value: string | boolean
    ) => {
        setPrivacy((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSaveSettings = async () => {
        try {
            // API call to save settings
            console.log("Saving settings:", { notifications, privacy, theme });
            setSuccessMessage(t("settingsSaved"));
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            console.error("Failed to save settings:", error);
        }
    };

    const handleExportData = async () => {
        try {
            // Simulate data export
            const data = {
                profile: { name: "John Doe", email: "john@example.com" },
                payments: [],
                settings: { notifications, privacy },
            };
            const jsonString = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonString], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `user-data-${new Date().toISOString().split("T")[0]}.json`;
            link.click();
            setSuccessMessage(t("dataExported"));
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            console.error("Failed to export data:", error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Success Message */}
            {successMessage && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                >
                    <Alert className="bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-700">
                            {successMessage}
                        </AlertDescription>
                    </Alert>
                </motion.div>
            )}

            {/* Notification Preferences */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-blue-600" />
                            {t("notificationPreferences")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Email Notifications */}
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                                <p className="font-medium">{t("emailNotifications")}</p>
                                <p className="text-sm text-muted-foreground">
                                    {t("receiveUpdatesViaEmail")}
                                </p>
                            </div>
                            <Switch
                                checked={notifications.emailNotifications}
                                onCheckedChange={(value) =>
                                    handleNotificationChange("emailNotifications", value)
                                }
                            />
                        </div>

                        {/* SMS Notifications */}
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                                <p className="font-medium">{t("smsNotifications")}</p>
                                <p className="text-sm text-muted-foreground">
                                    {t("receiveUpdatesViaSMS")}
                                </p>
                            </div>
                            <Switch
                                checked={notifications.smsNotifications}
                                onCheckedChange={(value) =>
                                    handleNotificationChange("smsNotifications", value)
                                }
                            />
                        </div>

                        {/* Push Notifications */}
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                                <p className="font-medium">{t("pushNotifications")}</p>
                                <p className="text-sm text-muted-foreground">
                                    {t("receiveBrowserNotifications")}
                                </p>
                            </div>
                            <Switch
                                checked={notifications.pushNotifications}
                                onCheckedChange={(value) =>
                                    handleNotificationChange("pushNotifications", value)
                                }
                            />
                        </div>

                        {/* Payment Reminders */}
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                                <p className="font-medium">{t("paymentReminders")}</p>
                                <p className="text-sm text-muted-foreground">
                                    {t("getRemindedBeforePayments")}
                                </p>
                            </div>
                            <Switch
                                checked={notifications.paymentReminders}
                                onCheckedChange={(value) =>
                                    handleNotificationChange("paymentReminders", value)
                                }
                            />
                        </div>

                        {/* Overdue Alerts */}
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                                <p className="font-medium">{t("overdueAlerts")}</p>
                                <p className="text-sm text-muted-foreground">
                                    {t("getAlertedForOverduePayments")}
                                </p>
                            </div>
                            <Switch
                                checked={notifications.overdueAlerts}
                                onCheckedChange={(value) =>
                                    handleNotificationChange("overdueAlerts", value)
                                }
                            />
                        </div>

                        {/* Promotional Emails */}
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                                <p className="font-medium">{t("promotionalEmails")}</p>
                                <p className="text-sm text-muted-foreground">
                                    {t("receiveOffersAndPromotions")}
                                </p>
                            </div>
                            <Switch
                                checked={notifications.promotionalEmails}
                                onCheckedChange={(value) =>
                                    handleNotificationChange("promotionalEmails", value)
                                }
                            />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Privacy Settings */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5 text-green-600" />
                            {t("privacySettings")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Profile Visibility */}
                        <div className="space-y-2">
                            <Label>{t("profileVisibility")}</Label>
                            <Select
                                value={privacy.profileVisibility}
                                onValueChange={(value) =>
                                    handlePrivacyChange(
                                        "profileVisibility",
                                        value as "public" | "private" | "friends"
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="public">{t("public")}</SelectItem>
                                    <SelectItem value="private">{t("private")}</SelectItem>
                                    <SelectItem value="friends">{t("friendsOnly")}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Show Payment History */}
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                                <p className="font-medium">{t("showPaymentHistory")}</p>
                                <p className="text-sm text-muted-foreground">
                                    {t("allowAdminsToViewPaymentHistory")}
                                </p>
                            </div>
                            <Switch
                                checked={privacy.showPaymentHistory}
                                onCheckedChange={(value) =>
                                    handlePrivacyChange("showPaymentHistory", value)
                                }
                            />
                        </div>

                        {/* Allow Data Sharing */}
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                                <p className="font-medium">{t("allowDataSharing")}</p>
                                <p className="text-sm text-muted-foreground">
                                    {t("shareDataWithPartnerServices")}
                                </p>
                            </div>
                            <Switch
                                checked={privacy.allowDataSharing}
                                onCheckedChange={(value) =>
                                    handlePrivacyChange("allowDataSharing", value)
                                }
                            />
                        </div>

                        {/* Allow Analytics */}
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                                <p className="font-medium">{t("allowAnalytics")}</p>
                                <p className="text-sm text-muted-foreground">
                                    {t("helpUsImproveBySharingData")}
                                </p>
                            </div>
                            <Switch
                                checked={privacy.allowAnalytics}
                                onCheckedChange={(value) =>
                                    handlePrivacyChange("allowAnalytics", value)
                                }
                            />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Theme Settings */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Palette className="h-5 w-5 text-purple-600" />
                            {t("themeCustomization")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>{t("colorScheme")}</Label>
                            <Select value={theme} onValueChange={setTheme}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light">{t("light")}</SelectItem>
                                    <SelectItem value="dark">{t("dark")}</SelectItem>
                                    <SelectItem value="auto">{t("autoSystem")}</SelectItem>
                                    <SelectItem value="blue">{t("blue")}</SelectItem>
                                    <SelectItem value="green">{t("green")}</SelectItem>
                                    <SelectItem value="purple">{t("purple")}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Data Management */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Download className="h-5 w-5 text-orange-600" />
                            {t("dataManagement")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-900 mb-3">
                                {t("exportDataDescription")}
                            </p>
                            <Button onClick={handleExportData} variant="outline" className="w-full">
                                <Download className="mr-2 h-4 w-4" />
                                {t("exportMyData")}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Save Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex gap-2"
            >
                <Button onClick={handleSaveSettings} className="flex-1">
                    {t("saveAllSettings")}
                </Button>
                <Button variant="outline" className="flex-1">
                    {t("resetToDefaults")}
                </Button>
            </motion.div>
        </div>
    );
};