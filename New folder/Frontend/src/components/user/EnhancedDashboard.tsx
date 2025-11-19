import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    User,
    BarChart3,
    Settings,
    Shield,
    Search,
    Calendar,
    Zap,
    Bell,
    Loader2,
    AlertCircle,
} from "lucide-react";
import { EnhancedProfileManagement } from "./EnhancedProfileManagement";
import { QuickActionsPanel } from "./QuickActionsPanel";
import { PaymentCalendar } from "./PaymentCalendar";
import { SpendingAnalytics } from "./SpendingAnalytics";
import { EnhancedSettings } from "./EnhancedSettings";
import { SearchAndBulkActions } from "./SearchAndBulkActions";
import { SecurityFeatures } from "./SecurityFeatures";
import { DashboardStatCards } from "./DashboardStatCards";
import { NotificationsPanel } from "./NotificationsPanel";
import { QuickPaymentButton } from "./QuickPaymentButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";

export const EnhancedDashboard = () => {
    const { t } = useTranslation();
    const { user, token } = useAuth();
    const [activeTab, setActiveTab] = useState("overview");

    // ✅ Backend-driven state
    const [userData, setUserData] = useState<{
        fullName: string;
        pendingAmount: number;
        totalBills: number;
        paidBills: number;
        pendingBills: number;
        overdueBills: number;
        totalDue: number;
    } | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const headers: HeadersInit = {"Content-Type": "application/json"};
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }
            const response = await fetch("http://localhost:8083/api/users/me", {
                credentials: "include",
                headers,
            });

            if (!response.ok) throw new Error("Failed to fetch user data");

            const data = await response.json();

            // Map AuthResponse to expected userData structure
            setUserData({
                fullName: data.fullName || "",
                pendingAmount: 0, // TODO: Implement bill data fetching
                totalBills: 0,
                paidBills: 0,
                pendingBills: 0,
                overdueBills: 0,
                totalDue: 0,
            });
            setError(null);
        } catch (err: unknown) {
            console.error("Error fetching user data:", err);
            const message = err instanceof Error ? err.message : "Failed to load data";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Fetch user data from backend API
    useEffect(() => {
        if (token && token !== 'default-token') {
            fetchUserData();
        } else {
            setLoading(false);
        }
    }, [token]);

    const tabVariants = {
        hidden: {opacity: 0, y: 10},
        visible: {opacity: 1, y: 0},
        exit: {opacity: 0, y: -10},
    };
    return (
        <div className="space-y-6">
            {/* Header Section */}
            <motion.div
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.1}}
            >
                {loading ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin"/>
                        <span>{t("loadingYourDashboard")}</span>
                    </div>
                ) : error ? (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4"/>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                ) : (
                    user && (
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pr-20 md:pr-24">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">
                                    {t("welcomeBack")}, {user.fullName.split(" ")[0]}!
                                </h1>
                                {/*<p className="text-muted-foreground mt-1">*/}
                                {/*    {t("manageYourBills")}*/}
                                {/*</p>*/}
                            </div>
                            <QuickPaymentButton pendingAmount={userData?.pendingAmount || 0}/>
                        </div>
                    )
                )}
            </motion.div>

            {/* Dashboard Stat Cards */}
            {!loading && user && userData && (
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.15}}
                >
                    <DashboardStatCards
                        totalBills={userData.totalBills}
                        paidBills={userData.paidBills}
                        pendingBills={userData.pendingBills}
                        overdueBills={userData.overdueBills}
                        totalDue={userData.totalDue}
                    />
                </motion.div>
            )}

            {/* Tabs Navigation */}
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.2}}
            >
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 lg:grid-cols-8 gap-2 h-auto p-2 bg-muted/50">
                        <TabsTrigger value="overview" className="flex items-center gap-2">
                            <Zap className="h-4 w-4"/>
                            <span className="hidden sm:inline">{t("overview")}</span>
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="flex items-center gap-2">
                            <Bell className="h-4 w-4"/>
                            <span className="hidden sm:inline">{t("alerts")}</span>
                        </TabsTrigger>

                        <TabsTrigger value="calendar" className="flex items-center gap-2">
                            <Calendar className="h-4 w-4"/>
                            <span className="hidden sm:inline">{t("calendar")}</span>
                        </TabsTrigger>
                        <TabsTrigger value="analytics" className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4"/>
                            <span className="hidden sm:inline">{t("analytics")}</span>
                        </TabsTrigger>
                        <TabsTrigger value="search" className="flex items-center gap-2">
                            <Search className="h-4 w-4"/>
                            <span className="hidden sm:inline">{t("search")}</span>
                        </TabsTrigger>
                        <TabsTrigger value="security" className="flex items-center gap-2">
                            <Shield className="h-4 w-4"/>
                            <span className="hidden sm:inline">{t("security")}</span>
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="flex items-center gap-2">
                            <Settings className="h-4 w-4"/>
                            <span className="hidden sm:inline">{t("settings")}</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Tab Contents */}
                    <AnimatePresence mode="wait">
                        {activeTab === "overview" && (
                            <motion.div
                                key="overview"
                                variants={tabVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{duration: 0.3}}
                                className="space-y-6"
                            >
                                <QuickActionsPanel/>
                                <PaymentCalendar/>
                            </motion.div>
                        )}

                        {activeTab === "notifications" && (
                            <motion.div
                                key="notifications"
                                variants={tabVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{duration: 0.3}}
                            >
                                <NotificationsPanel/>
                            </motion.div>
                        )}

                        {activeTab === "profile" && (
                            <motion.div
                                key="profile"
                                variants={tabVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{duration: 0.3}}
                            >
                                <EnhancedProfileManagement/>
                            </motion.div>
                        )}

                        {activeTab === "calendar" && (
                            <motion.div
                                key="calendar"
                                variants={tabVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{duration: 0.3}}
                            >
                                <PaymentCalendar/>
                            </motion.div>
                        )}

                        {activeTab === "analytics" && (
                            <motion.div
                                key="analytics"
                                variants={tabVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{duration: 0.3}}
                            >
                                <SpendingAnalytics/>
                            </motion.div>
                        )}

                        {activeTab === "search" && (
                            <motion.div
                                key="search"
                                variants={tabVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{duration: 0.3}}
                            >
                                <SearchAndBulkActions/>
                            </motion.div>
                        )}

                        {activeTab === "security" && (
                            <motion.div
                                key="security"
                                variants={tabVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{duration: 0.3}}
                            >
                                <SecurityFeatures/>
                            </motion.div>
                        )}

                        {activeTab === "settings" && (
                            <motion.div
                                key="settings"
                                variants={tabVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{duration: 0.3}}
                            >
                                <EnhancedSettings/>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Tabs>
            </motion.div>
        </div>
    );
}