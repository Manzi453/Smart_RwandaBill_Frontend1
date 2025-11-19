import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X } from "lucide-react";
import { toast } from "sonner";

const UserProfile = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: user?.fullName || "",
        email: user?.email || "",
        telephone: user?.telephone || "",
        district: user?.district || "",
        sector: user?.sector || "",
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        // Mock save functionality
        toast.success(t("profileUpdated"));
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({
            fullName: user?.fullName || "",
            email: user?.email || "",
            telephone: user?.telephone || "",
            district: user?.district || "",
            sector: user?.sector || "",
        });
        setIsEditing(false);
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    return (
        <motion.div
            className="p-6 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-foreground">{t("profile")}</h1>
                {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        {t("editProfile")}
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button onClick={handleSave} className="flex items-center gap-2">
                            <Save className="h-4 w-4" />
                            {t("save")}
                        </Button>
                        <Button onClick={handleCancel} variant="outline" className="flex items-center gap-2">
                            <X className="h-4 w-4" />
                            {t("cancel")}
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Overview */}
                <Card className="lg:col-span-1">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <Avatar className="w-24 h-24">
                                <AvatarImage src="" alt={user?.fullName} />
                                <AvatarFallback className="text-2xl">
                                    {user?.fullName ? getInitials(user.fullName) : "U"}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <CardTitle className="text-xl">{user?.fullName}</CardTitle>
                        <Badge variant="secondary" className="mt-2">
                            {t("member")}
                        </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span>{user?.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{user?.telephone}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{user?.district}, {user?.sector}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{t("memberSince")}: 2024</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Profile Details */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>{t("personalInformation")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">{t("fullName")}</Label>
                                {isEditing ? (
                                    <Input
                                        id="fullName"
                                        value={formData.fullName}
                                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                                    />
                                ) : (
                                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-md">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span>{user?.fullName}</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">{t("email")}</Label>
                                {isEditing ? (
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                    />
                                ) : (
                                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-md">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span>{user?.email}</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="telephone">{t("phoneNumber")}</Label>
                                {isEditing ? (
                                    <Input
                                        id="telephone"
                                        value={formData.telephone}
                                        onChange={(e) => handleInputChange("telephone", e.target.value)}
                                    />
                                ) : (
                                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-md">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span>{user?.telephone}</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="district">{t("district")}</Label>
                                {isEditing ? (
                                    <Input
                                        id="district"
                                        value={formData.district}
                                        onChange={(e) => handleInputChange("district", e.target.value)}
                                    />
                                ) : (
                                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-md">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span>{user?.district}</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="sector">{t("sector")}</Label>
                                {isEditing ? (
                                    <Input
                                        id="sector"
                                        value={formData.sector}
                                        onChange={(e) => handleInputChange("sector", e.target.value)}
                                    />
                                ) : (
                                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-md">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span>{user?.sector}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Account Statistics */}
            <Card>
                <CardHeader>
                    <CardTitle>{t("accountStatistics")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-muted/30 rounded-lg">
                            <div className="text-2xl font-bold text-primary">24</div>
                            <div className="text-sm text-muted-foreground">{t("totalPayments")}</div>
                        </div>
                        <div className="text-center p-4 bg-muted/30 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">22</div>
                            <div className="text-sm text-muted-foreground">{t("completedPayments")}</div>
                        </div>
                        <div className="text-center p-4 bg-muted/30 rounded-lg">
                            <div className="text-2xl font-bold text-orange-600">2</div>
                            <div className="text-sm text-muted-foreground">{t("pendingPayments")}</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default UserProfile;