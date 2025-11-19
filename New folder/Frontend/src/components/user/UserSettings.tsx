import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Shield, Moon, Globe, Save, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const UserSettings = () => {
    const { t } = useTranslation();
    const [settings, setSettings] = useState({
        emailNotifications: true,
        smsNotifications: false,
        paymentReminders: true,
        darkMode: false,
        language: "en",
        twoFactorAuth: false,
    });

    const handleSettingChange = (key: string, value: boolean | string) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSave = () => {
        toast.success(t("settingsSaved"));
    };

    const handlePasswordChange = () => {
        toast.success(t("passwordChanged"));
    };

    return (
        <motion.div
            className="p-6 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-foreground">{t("settings")}</h1>
                <Button onClick={handleSave} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    {t("saveSettings")}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Notifications */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            {t("notifications")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="email-notifications">{t("emailNotifications")}</Label>
                                <p className="text-sm text-muted-foreground">{t("emailNotificationsDesc")}</p>
                            </div>
                            <Switch
                                id="email-notifications"
                                checked={settings.emailNotifications}
                                onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="sms-notifications">{t("smsNotifications")}</Label>
                                <p className="text-sm text-muted-foreground">{t("smsNotificationsDesc")}</p>
                            </div>
                            <Switch
                                id="sms-notifications"
                                checked={settings.smsNotifications}
                                onCheckedChange={(checked) => handleSettingChange("smsNotifications", checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="payment-reminders">{t("paymentReminders")}</Label>
                                <p className="text-sm text-muted-foreground">{t("paymentRemindersDesc")}</p>
                            </div>
                            <Switch
                                id="payment-reminders"
                                checked={settings.paymentReminders}
                                onCheckedChange={(checked) => handleSettingChange("paymentReminders", checked)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Appearance */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Moon className="h-5 w-5" />
                            {t("appearance")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="dark-mode">{t("darkMode")}</Label>
                                <p className="text-sm text-muted-foreground">{t("darkModeDesc")}</p>
                            </div>
                            <Switch
                                id="dark-mode"
                                checked={settings.darkMode}
                                onCheckedChange={(checked) => handleSettingChange("darkMode", checked)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="language">{t("language")}</Label>
                            <Select
                                value={settings.language}
                                onValueChange={(value) => handleSettingChange("language", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t("selectLanguage")} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="rw">Kinyarwanda</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Security */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            {t("security")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="two-factor">{t("twoFactorAuth")}</Label>
                                <p className="text-sm text-muted-foreground">{t("twoFactorAuthDesc")}</p>
                            </div>
                            <Switch
                                id="two-factor"
                                checked={settings.twoFactorAuth}
                                onCheckedChange={(checked) => handleSettingChange("twoFactorAuth", checked)}
                            />
                        </div>

                        <div className="space-y-4">
                            <h4 className="font-medium">{t("changePassword")}</h4>
                            <div className="space-y-3">
                                <Input type="password" placeholder={t("currentPassword")} />
                                <Input type="password" placeholder={t("newPassword")} />
                                <Input type="password" placeholder={t("confirmPassword")} />
                                <Button onClick={handlePasswordChange} variant="outline" className="w-full">
                                    {t("changePassword")}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Account */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            {t("account")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-yellow-800">{t("dangerZone")}</h4>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        {t("dangerZoneDesc")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Button variant="outline" className="w-full text-orange-600 border-orange-200 hover:bg-orange-50">
                                {t("exportData")}
                            </Button>
                            <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                                {t("deleteAccount")}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
};

export default UserSettings;