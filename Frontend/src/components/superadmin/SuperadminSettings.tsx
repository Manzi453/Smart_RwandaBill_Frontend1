import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  Bell,
  Shield,
  Users,
  DollarSign,
  Globe,
  Database,
  AlertTriangle,
} from "lucide-react";

const SuperadminSettings = () => {
  const { t } = useTranslation();

  // System Configuration
  const [systemEmail, setSystemEmail] = useState("admin@security-water.com");
  const [systemName, setSystemName] = useState(
    "Security and Water Payment System"
  );
  const [defaultLanguage, setDefaultLanguage] = useState("en");
  const [timezone, setTimezone] = useState("Africa/Kigali");

  // Group Management
  const [maxMembersPerGroup, setMaxMembersPerGroup] = useState("50");
  const [minMembersPerGroup, setMinMembersPerGroup] = useState("5");
  const [autoApproveGroups, setAutoApproveGroups] = useState(false);
  const [requireGroupApproval, setRequireGroupApproval] = useState(true);

  // Financial Settings
  const [defaultCurrency, setDefaultCurrency] = useState("RWF");
  const [minContribution, setMinContribution] = useState("1000");
  const [maxContribution, setMaxContribution] = useState("50000");
  const [contributionFrequency, setContributionFrequency] = useState("monthly");

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [notificationFrequency, setNotificationFrequency] = useState("daily");

  // Security Settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [passwordExpiry, setPasswordExpiry] = useState("90");
  const [loginAttempts, setLoginAttempts] = useState("5");

  // User Management
  const [autoApproveUsers, setAutoApproveUsers] = useState(false);
  const [requireEmailVerification, setRequireEmailVerification] =
    useState(true);
  const [allowGuestAccess, setAllowGuestAccess] = useState(false);

  // System Maintenance
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [backupFrequency, setBackupFrequency] = useState("daily");
  const [logRetention, setLogRetention] = useState("90");

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Replace with actual API call to backend
      // const response = await updateSystemSettings({
      //   systemEmail,
      //   systemName,
      //   defaultLanguage,
      //   timezone,
      //   maxMembersPerGroup: parseInt(maxMembersPerGroup),
      //   minMembersPerGroup: parseInt(minMembersPerGroup),
      //   autoApproveGroups,
      //   requireGroupApproval,
      //   defaultCurrency,
      //   minContribution: parseInt(minContribution),
      //   maxContribution: parseInt(maxContribution),
      //   contributionFrequency,
      //   emailNotifications,
      //   smsNotifications,
      //   pushNotifications,
      //   notificationFrequency,
      //   twoFactorAuth,
      //   sessionTimeout: parseInt(sessionTimeout),
      //   passwordExpiry: parseInt(passwordExpiry),
      //   loginAttempts: parseInt(loginAttempts),
      //   autoApproveUsers,
      //   requireEmailVerification,
      //   allowGuestAccess,
      //   maintenanceMode,
      //   backupFrequency,
      //   logRetention: parseInt(logRetention)
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success message (placeholder for toast notification)
      // console.log("Settings updated successfully");
      // alert("Settings updated successfully!");
      toast.success(t("settingsUpdatedSuccessfully") || "Settings updated successfully");
    } catch (error) {
      // console.error("Failed to update settings:", error);
      // alert("Failed to update settings. Please try again.");
      toast.error(t("failedToUpdateSettings") || "Failed to update settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    // Reset to default values
    setSystemEmail("admin@security-water.com");
    setSystemName("Security and Water Payment System");
    setDefaultLanguage("en");
    setTimezone("Africa/Kigali");
    setMaxMembersPerGroup("50");
    setMinMembersPerGroup("5");
    setAutoApproveGroups(false);
    setRequireGroupApproval(true);
    setDefaultCurrency("RWF");
    setMinContribution("1000");
    setMaxContribution("50000");
    setContributionFrequency("monthly");
    setEmailNotifications(true);
    setSmsNotifications(false);
    setPushNotifications(true);
    setNotificationFrequency("daily");
    setTwoFactorAuth(false);
    setSessionTimeout("30");
    setPasswordExpiry("90");
    setLoginAttempts("5");
    setAutoApproveUsers(false);
    setRequireEmailVerification(true);
    setAllowGuestAccess(false);
    setMaintenanceMode(false);
    setBackupFrequency("daily");
    setLogRetention("90");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Settings className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">
            System Settings
          </h2>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="space-y-6"
      >
        {/* System Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              System Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="systemName">{t("systemName")}</Label>
                <Input
                  id="systemName"
                  value={systemName}
                  onChange={(e) => setSystemName(e.target.value)}
                  placeholder={t("enterSystemName")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="systemEmail">{t("systemEmail")}</Label>
                <Input
                  id="systemEmail"
                  type="email"
                  value={systemEmail}
                  onChange={(e) => setSystemEmail(e.target.value)}
                  placeholder={t("adminEmailPlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="defaultLanguage">{t("defaultLanguage")}</Label>
                <Select
                  value={defaultLanguage}
                  onValueChange={setDefaultLanguage}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">{t("english")}</SelectItem>
                    <SelectItem value="fr">{t("french")}</SelectItem>
                    <SelectItem value="rw">{t("kinyarwanda")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">{t("timezone")}</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Africa/Kigali">
                      {t("eastAfricaTime")}
                    </SelectItem>
                    <SelectItem value="UTC">{t("utc")}</SelectItem>
                    <SelectItem value="Africa/Nairobi">
                      {t("eastAfricaTime")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Group Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Group Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minMembersPerGroup">
                  Minimum Members per Group
                </Label>
                <Input
                  id="minMembersPerGroup"
                  type="number"
                  value={minMembersPerGroup}
                  onChange={(e) => setMinMembersPerGroup(e.target.value)}
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxMembersPerGroup">
                  Maximum Members per Group
                </Label>
                <Input
                  id="maxMembersPerGroup"
                  type="number"
                  value={maxMembersPerGroup}
                  onChange={(e) => setMaxMembersPerGroup(e.target.value)}
                  min="1"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto-approve New Groups</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically approve group creation requests
                  </p>
                </div>
                <Switch
                  checked={autoApproveGroups}
                  onCheckedChange={setAutoApproveGroups}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Require Group Approval</Label>
                  <p className="text-sm text-muted-foreground">
                    Require admin approval for new groups
                  </p>
                </div>
                <Switch
                  checked={requireGroupApproval}
                  onCheckedChange={setRequireGroupApproval}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Financial Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="defaultCurrency">Default Currency</Label>
                <Select
                  value={defaultCurrency}
                  onValueChange={setDefaultCurrency}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RWF">Rwandan Franc (RWF)</SelectItem>
                    <SelectItem value="USD">US Dollar (USD)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contributionFrequency">
                  Contribution Frequency
                </Label>
                <Select
                  value={contributionFrequency}
                  onValueChange={setContributionFrequency}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="minContribution">
                  Minimum Contribution ({defaultCurrency})
                </Label>
                <Input
                  id="minContribution"
                  type="number"
                  value={minContribution}
                  onChange={(e) => setMinContribution(e.target.value)}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxContribution">
                  Maximum Contribution ({defaultCurrency})
                </Label>
                <Input
                  id="maxContribution"
                  type="number"
                  value={maxContribution}
                  onChange={(e) => setMaxContribution(e.target.value)}
                  min="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send notifications via email
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send notifications via SMS
                  </p>
                </div>
                <Switch
                  checked={smsNotifications}
                  onCheckedChange={setSmsNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send push notifications to mobile devices
                  </p>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notificationFrequency">
                Notification Frequency
              </Label>
              <Select
                value={notificationFrequency}
                onValueChange={setNotificationFrequency}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="daily">Daily Summary</SelectItem>
                  <SelectItem value="weekly">Weekly Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">
                  Session Timeout (minutes)
                </Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  min="5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                <Input
                  id="passwordExpiry"
                  type="number"
                  value={passwordExpiry}
                  onChange={(e) => setPasswordExpiry(e.target.value)}
                  min="30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                <Input
                  id="loginAttempts"
                  type="number"
                  value={loginAttempts}
                  onChange={(e) => setLoginAttempts(e.target.value)}
                  min="1"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for all admin accounts
                  </p>
                </div>
                <Switch
                  checked={twoFactorAuth}
                  onCheckedChange={setTwoFactorAuth}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto-approve New Users</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically approve user registration requests
                  </p>
                </div>
                <Switch
                  checked={autoApproveUsers}
                  onCheckedChange={setAutoApproveUsers}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Require Email Verification</Label>
                  <p className="text-sm text-muted-foreground">
                    Require email verification for new accounts
                  </p>
                </div>
                <Switch
                  checked={requireEmailVerification}
                  onCheckedChange={setRequireEmailVerification}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Allow Guest Access</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow unauthenticated users to view public content
                  </p>
                </div>
                <Switch
                  checked={allowGuestAccess}
                  onCheckedChange={setAllowGuestAccess}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Maintenance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              System Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="backupFrequency">Backup Frequency</Label>
                <Select
                  value={backupFrequency}
                  onValueChange={setBackupFrequency}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="logRetention">Log Retention (days)</Label>
                <Input
                  id="logRetention"
                  type="number"
                  value={logRetention}
                  onChange={(e) => setLogRetention(e.target.value)}
                  min="7"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2 text-orange-500" />
                    Maintenance Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Put the system in maintenance mode (users cannot access)
                  </p>
                </div>
                <Switch
                  checked={maintenanceMode}
                  onCheckedChange={setMaintenanceMode}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save All Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SuperadminSettings;