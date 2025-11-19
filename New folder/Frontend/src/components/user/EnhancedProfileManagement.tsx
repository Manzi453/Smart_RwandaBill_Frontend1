import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Upload,
    Camera,
    CheckCircle,
    AlertCircle,
    Mail,
    Phone,
    Globe,
    Loader2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProfileData {
    fullName: string;
    email: string;
    phone: string;
    avatar?: string;
    bio?: string;
    socialLinks?: {
        twitter?: string;
        linkedin?: string;
        facebook?: string;
        instagram?: string;
    };
}

interface VerificationStatus {
    email: boolean;
    phone: boolean;
    identity: boolean;
}

export const EnhancedProfileManagement = () => {
    const { t } = useTranslation();
    const [profile, setProfile] = useState<ProfileData>({
        fullName: "John Doe",
        email: "john@example.com",
        phone: "+250 788 123 456",
        bio: "Community member from Kigali",
        socialLinks: {
            twitter: "johndoe",
            linkedin: "johndoe",
            facebook: "johndoe",
            instagram: "johndoe",
        },
    });

    const [verification, setVerification] = useState<VerificationStatus>({
        email: true,
        phone: false,
        identity: false,
    });

    const [profileCompletion, setProfileCompletion] = useState(65);
    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setUploadMessage({
                type: "error",
                message: t("fileSizeError"),
            });
            return;
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setUploadMessage({
                type: "error",
                message: t("imageFileError"),
            });
            return;
        }

        setIsUploading(true);
        try {
            // Simulate file upload
            const reader = new FileReader();
            reader.onload = (event) => {
                setProfile((prev) => ({
                    ...prev,
                    avatar: event.target?.result as string,
                }));
                setUploadMessage({
                    type: "success",
                    message: t("avatarUploadSuccess"),
                });
                setIsUploading(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            setUploadMessage({
                type: "error",
                message: t("avatarUploadError"),
            });
            setIsUploading(false);
        }
    };

    const handleProfileChange = (
        field: keyof ProfileData,
        value: string | object
    ) => {
        setProfile((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSocialLinkChange = (platform: string, value: string) => {
        setProfile((prev) => ({
            ...prev,
            socialLinks: {
                ...prev.socialLinks,
                [platform]: value,
            },
        }));
    };

    const handleSaveProfile = async () => {
        try {
            // API call to save profile
            console.log("Saving profile:", profile);
            setUploadMessage({
                type: "success",
                message: t("profileUpdateSuccess"),
            });
            setIsEditing(false);
        } catch (error) {
            setUploadMessage({
                type: "error",
                message: t("profileUpdateError"),
            });
        }
    };

    const handleVerifyEmail = async () => {
        try {
            // API call to send verification email
            setUploadMessage({
                type: "success",
                message: t("verificationEmailSent"),
            });
        } catch (error) {
            setUploadMessage({
                type: "error",
                message: t("verificationEmailError"),
            });
        }
    };

    const handleVerifyPhone = async () => {
        try {
            // API call to send verification SMS
            setUploadMessage({
                type: "success",
                message: t("verificationCodeSent"),
            });
        } catch (error) {
            setUploadMessage({
                type: "error",
                message: t("verificationCodeError"),
            });
        }
    };

    return (
        <div className="space-y-6">
            {/* Profile Header with Avatar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* Avatar Section */}
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                                    {profile.avatar ? (
                                        <img
                                            src={profile.avatar}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-3xl font-bold text-white">
                      {profile.fullName.charAt(0)}
                    </span>
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 rounded-full p-2 cursor-pointer shadow-lg transition-colors">
                                    <Camera className="h-4 w-4 text-white" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarUpload}
                                        disabled={isUploading}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {/* Profile Info */}
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-2xl font-bold text-foreground">
                                    {profile.fullName}
                                </h2>
                                <p className="text-muted-foreground">{profile.bio}</p>

                                {/* Profile Completion Indicator */}
                                <div className="mt-4">
                                    <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">
                      {t("profileCompletion")}
                    </span>
                                        <span className="text-sm font-bold text-blue-600">
                      {profileCompletion}%
                    </span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <motion.div
                                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${profileCompletion}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                        />
                                    </div>
                                </div>

                                <Button
                                    onClick={() => setIsEditing(!isEditing)}
                                    variant={isEditing ? "destructive" : "default"}
                                    className="mt-4"
                                >
                                    {isEditing ? t("cancel") : t("editProfile")}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Upload Message */}
            {uploadMessage && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                >
                    <Alert
                        variant={uploadMessage.type === "error" ? "destructive" : "default"}
                    >
                        {uploadMessage.type === "error" ? (
                            <AlertCircle className="h-4 w-4" />
                        ) : (
                            <CheckCircle className="h-4 w-4" />
                        )}
                        <AlertDescription>{uploadMessage.message}</AlertDescription>
                    </Alert>
                </motion.div>
            )}

            {/* Verification Status */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                            {t("verificationStatus")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Email Verification */}
                        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">{t("emailAddress")}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {profile.email}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {verification.email ? (
                                    <span className="flex items-center gap-1 text-green-600 font-medium">
                    <CheckCircle className="h-4 w-4" />
                                        {t("verified")}
                  </span>
                                ) : (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleVerifyEmail}
                                    >
                                        {t("verify")}
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Phone Verification */}
                        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">{t("phoneNumber")}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {profile.phone}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {verification.phone ? (
                                    <span className="flex items-center gap-1 text-green-600 font-medium">
                    <CheckCircle className="h-4 w-4" />
                                        {t("verified")}
                  </span>
                                ) : (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleVerifyPhone}
                                    >
                                        {t("verify")}
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Identity Verification */}
                        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Globe className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="font-medium">{t("identityVerification")}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {t("governmentIdVerification")}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {verification.identity ? (
                                    <span className="flex items-center gap-1 text-green-600 font-medium">
                    <CheckCircle className="h-4 w-4" />
                                        {t("verified")}
                  </span>
                                ) : (
                                    <Button size="sm" variant="outline">
                                        {t("verify")}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Edit Profile Form */}
            {isEditing && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>{t("editProfileInformation")}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <Label htmlFor="fullName">{t("fullName")}</Label>
                                <Input
                                    id="fullName"
                                    value={profile.fullName}
                                    onChange={(e) =>
                                        handleProfileChange("fullName", e.target.value)
                                    }
                                    placeholder={t("enterYourFullName")}
                                />
                            </div>

                            {/* Bio */}
                            <div className="space-y-2">
                                <Label htmlFor="bio">{t("bio")}</Label>
                                <Input
                                    id="bio"
                                    value={profile.bio}
                                    onChange={(e) => handleProfileChange("bio", e.target.value)}
                                    placeholder={t("tellUsAboutYourself")}
                                />
                            </div>

                            {/* Social Links */}
                            <div className="border-t pt-4">
                                <h3 className="font-semibold mb-4">{t("socialMediaLinks")}</h3>
                                <div className="space-y-3">
                                    {Object.entries(profile.socialLinks || {}).map(
                                        ([platform, value]) => (
                                            <div key={platform} className="space-y-2">
                                                <Label htmlFor={platform} className="capitalize">
                                                    {platform}
                                                </Label>
                                                <Input
                                                    id={platform}
                                                    value={value || ""}
                                                    onChange={(e) =>
                                                        handleSocialLinkChange(platform, e.target.value)
                                                    }
                                                    placeholder={`@${platform}`}
                                                />
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="flex gap-2 pt-4">
                                <Button
                                    onClick={handleSaveProfile}
                                    className="flex-1"
                                    disabled={isUploading}
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {t("saving")}
                                        </>
                                    ) : (
                                        t("saveChanges")
                                    )}
                                </Button>
                                <Button
                                    onClick={() => setIsEditing(false)}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    {t("cancel")}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </div>
    );
};