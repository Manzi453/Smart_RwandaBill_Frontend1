import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Shield,
  Smartphone,
  Fingerprint,
  LogOut,
  Copy,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
// @ts-ignore
// @ts-ignore
// @ts-ignore
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ActiveSession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

interface BackupCode {
  code: string;
  used: boolean;
}

export const SecurityFeatures = () => {
  const { t } = useTranslation();
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");

  const activeSessions: ActiveSession[] = [
    {
      id: "1",
      device: "Chrome on Windows",
      location: "Kigali, Rwanda",
      lastActive: "Just now",
      isCurrent: true,
    },
    {
      id: "2",
      device: "Safari on iPhone",
      location: "Kigali, Rwanda",
      lastActive: "2 hours ago",
      isCurrent: false,
    },
    {
      id: "3",
      device: "Firefox on Ubuntu",
      location: "Kigali, Rwanda",
      lastActive: "1 day ago",
      isCurrent: false,
    },
  ];

  const backupCodes: BackupCode[] = [
    { code: "RWND-1234-5678", used: false },
    { code: "RWND-9012-3456", used: false },
    { code: "RWND-7890-1234", used: true },
    { code: "RWND-5678-9012", used: false },
    { code: "RWND-3456-7890", used: false },
    { code: "RWND-2345-6789", used: false },
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleLogoutSession = (sessionId: string) => {
    console.log("Logging out session:", sessionId);
  };

  const handleLogoutAllOtherSessions = () => {
    console.log("Logging out all other sessions");
  };

  const handleEnableTwoFA = () => {
    setTwoFAEnabled(true);
  };

  const handleDisableTwoFA = () => {
    setTwoFAEnabled(false);
  };

  const handleEnableBiometric = () => {
    setBiometricEnabled(true);
  };

  const handleDisableBiometric = () => {
    setBiometricEnabled(false);
  };

  return (
    <div className="space-y-6">
      {/* Two-Factor Authentication */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Two-Factor Authentication (2FA)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert
              variant={twoFAEnabled ? "default" : "destructive"}
              className={twoFAEnabled ? "bg-green-50 border-green-200" : ""}
            >
              {twoFAEnabled ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription
                className={twoFAEnabled ? "text-green-700" : ""}
              >
                {twoFAEnabled
                  ? "Two-factor authentication is enabled"
                  : "Two-factor authentication is not enabled"}
              </AlertDescription>
            </Alert>

            {!twoFAEnabled ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account by requiring a
                  verification code in addition to your password.
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">Enable 2FA</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
                      <DialogDescription>
                        Scan this QR code with your authenticator app
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="bg-muted p-4 rounded-lg flex items-center justify-center h-40">
                        <p className="text-muted-foreground">
                          [QR Code would appear here]
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="verification">
                          Enter verification code
                        </Label>
                        <Input
                          id="verification"
                          placeholder="000000"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          maxLength={6}
                        />
                      </div>
                      <Button
                        onClick={handleEnableTwoFA}
                        className="w-full"
                        disabled={verificationCode.length !== 6}
                      >
                        Verify & Enable
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                  ✓ Your account is protected with 2FA
                </p>
                <Button
                  onClick={handleDisableTwoFA}
                  variant="destructive"
                  className="w-full"
                >
                  Disable 2FA
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Backup Codes */}
      {twoFAEnabled && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                Backup Codes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-orange-50 border-orange-200">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-700">
                  Save these codes in a safe place. You can use them to access
                  your account if you lose access to your authenticator.
                </AlertDescription>
              </Alert>

              {!showBackupCodes ? (
                <Button
                  onClick={() => setShowBackupCodes(true)}
                  variant="outline"
                  className="w-full"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Show Backup Codes
                </Button>
              ) : (
                <div className="space-y-2">
                  {backupCodes.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        item.used
                          ? "bg-muted/50 border-muted text-muted-foreground"
                          : "bg-muted/30 border-border"
                      }`}
                    >
                      <span className="font-mono text-sm">
                        {item.code}
                        {item.used && " (Used)"}
                      </span>
                      {!item.used && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopyCode(item.code)}
                          className="h-8 w-8 p-0"
                        >
                          {copiedCode === item.code ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Biometric Authentication */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fingerprint className="h-5 w-5 text-purple-600" />
              Biometric Authentication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert
              variant={biometricEnabled ? "default" : "destructive"}
              className={biometricEnabled ? "bg-green-50 border-green-200" : ""}
            >
              {biometricEnabled ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription
                className={biometricEnabled ? "text-green-700" : ""}
              >
                {biometricEnabled
                  ? "Biometric authentication is enabled"
                  : "Biometric authentication is not enabled"}
              </AlertDescription>
            </Alert>

            {!biometricEnabled ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Use your fingerprint or face recognition for faster and more
                  secure login.
                </p>
                <Button onClick={handleEnableBiometric} className="w-full">
                  <Fingerprint className="mr-2 h-4 w-4" />
                  Enable Biometric Login
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                  ✓ Biometric authentication is active
                </p>
                <Button
                  onClick={handleDisableBiometric}
                  variant="destructive"
                  className="w-full"
                >
                  Disable Biometric
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Active Sessions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-green-600" />
              Active Sessions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeSessions.map((session, idx) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{session.device}</p>
                    {session.isCurrent && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {session.location} • {session.lastActive}
                  </p>
                </div>
                {!session.isCurrent && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleLogoutSession(session.id)}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                )}
              </motion.div>
            ))}

            {activeSessions.length > 1 && (
              <Button
                onClick={handleLogoutAllOtherSessions}
                variant="destructive"
                className="w-full mt-4"
              >
                Logout All Other Sessions
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
