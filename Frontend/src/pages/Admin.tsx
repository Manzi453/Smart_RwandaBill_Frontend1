import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// ------------------ TYPES ------------------
interface UserType {
    id: string;
    name: string;
    email: string;
    status: string;
    lastPayment: string;
    role: string;
    service?: string;
}

interface AuthUser {
    id: string;
    fullName: string;
    email: string;
    role: string;
    service?: string;
}

interface Activity {
    id: number;
    action: string;
    user: string;
    time: string;
    amount?: number;
    count?: number;
}

interface Stats {
    totalUsers: number;
    activeUsers: number;
    totalRevenue: number;
    pendingPayments: number;
    recentActivities: Activity[];
}

// ------------------ API FUNCTIONS ------------------
const getAdminUsersList = async (): Promise<UserType[]> => {
    return [
        {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
            status: "Active",
            lastPayment: "2023-05-15",
            role: "admin",
            service: "water",
        },
        {
            id: "2",
            name: "Jane Smith",
            email: "jane@example.com",
            status: "Active",
            lastPayment: "2023-05-10",
            role: "user",
            service: "sanitation",
        },
        {
            id: "3",
            name: "Bob Johnson",
            email: "bob@example.com",
            status: "Pending",
            lastPayment: "2023-04-28",
            role: "user",
            service: "security",
        },
    ];
};

// ------------------ STATS GENERATOR ------------------
const generateMockStats = (
    user: AuthUser | null,
    t: (key: string, options?: any) => string
): Stats => {
    const baseStats: Stats = {
        totalUsers: 1245,
        activeUsers: 876,
        totalRevenue: 12500000,
        pendingPayments: 2450000,
        recentActivities: [
            {
                id: 1,
                action: t("activityLogs.newUserRegistration"),
                user: "John Doe",
                time: t("activityLogs.timeAgo", { count: 2, unit: "minute" }),
            },
            {
                id: 2,
                action: t("activityLogs.paymentReceived"),
                user: "Jane Smith",
                amount: 50000,
                time: t("activityLogs.timeAgo", { count: 15, unit: "minute" }),
            },
            {
                id: 3,
                action: t("activityLogs.billGenerated"),
                user: "Water Department",
                count: 45,
                time: t("activityLogs.timeAgo", { count: 1, unit: "hour" }),
            },
        ],
    };

    if (user?.service) {
        return {
            ...baseStats,
            totalUsers: 345,
            activeUsers: 287,
            totalRevenue: 4500000,
            pendingPayments: 780000,
        };
    }

    return baseStats;
};

// ------------------ MAIN COMPONENT ------------------
const Admin: React.FC = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [roleFilter, setRoleFilter] = useState("all");

    // Fetch users list
    const { data: users, isLoading } = useQuery<UserType[]>({
        queryKey: ['adminUsers'],
        queryFn: getAdminUsersList,
    });

    // Generate stats
    const stats = generateMockStats(user as AuthUser, t);

    // Filter users
    const filteredUsers = users?.filter((u) => {
        const matchesSearch =
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "all" || u.status === statusFilter;
        const matchesRole = roleFilter === "all" || u.role === roleFilter;

        return matchesSearch && matchesStatus && matchesRole;
    });

    const handleUserStatusToggle = (userId: string) => {
        toast.success(t("admin.userStatusUpdated"));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">{t("admin.dashboard")}</h1>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-sm text-gray-600">{t("admin.totalUsers")}</h3>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-sm text-gray-600">{t("admin.activeUsers")}</h3>
                    <p className="text-2xl font-bold">{stats.activeUsers}</p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-sm text-gray-600">{t("admin.totalRevenue")}</h3>
                    <p className="text-2xl font-bold">
                        {stats.totalRevenue.toLocaleString()} RWF
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-sm text-gray-600">{t("admin.pendingPayments")}</h3>
                    <p className="text-2xl font-bold">
                        {stats.pendingPayments.toLocaleString()} RWF
                    </p>
                </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    <div>
                        <Label>{t("admin.search")}</Label>
                        <Input
                            placeholder={t("admin.searchPlaceholder")}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div>
                        <Label>{t("admin.filterByStatus")}</Label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t("admin.allStatuses")}</SelectItem>
                                <SelectItem value="Active">{t("admin.active")}</SelectItem>
                                <SelectItem value="Pending">{t("admin.pending")}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label>{t("admin.filterByRole")}</Label>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t("admin.allRoles")}</SelectItem>
                                <SelectItem value="admin">{t("admin.admin")}</SelectItem>
                                <SelectItem value="user">{t("admin.user")}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs">{t("admin.name")}</th>
                        <th className="px-6 py-3 text-left text-xs">{t("admin.email")}</th>
                        <th className="px-6 py-3 text-left text-xs">{t("admin.status")}</th>
                        <th className="px-6 py-3 text-left text-xs">{t("admin.role")}</th>
                        <th className="px-6 py-3 text-left text-xs">{t("admin.lastPayment")}</th>
                        <th className="px-6 py-3 text-left text-xs">{t("admin.actions")}</th>
                    </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers?.map((u) => (
                        <tr key={u.id}>
                            <td className="px-6 py-4">{u.name}</td>
                            <td className="px-6 py-4">{u.email}</td>

                            <td className="px-6 py-4">
                                    <span
                                        className={`px-2 inline-flex text-xs rounded-full ${
                                            u.status === "Active"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-yellow-100 text-yellow-800"
                                        }`}
                                    >
                                        {u.status}
                                    </span>
                            </td>

                            <td className="px-6 py-4">{u.role}</td>
                            <td className="px-6 py-4">{u.lastPayment}</td>

                            <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        checked={u.status === "Active"}
                                        onCheckedChange={() => handleUserStatusToggle(u.id)}
                                    />
                                    <Button variant="outline" size="sm">
                                        {t("admin.view")}
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>

                </table>
            </div>

            {/* Recent Activities */}
            <div className="mt-8 bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">
                    {t("admin.recentActivities")}
                </h2>

                <div className="space-y-4">
                    {stats.recentActivities.map((activity) => (
                        <div
                            key={activity.id}
                            className="flex justify-between items-center border-b pb-2"
                        >
                            <div>
                                <p className="font-medium">{activity.action}</p>
                                <p className="text-sm text-gray-600">
                                    {activity.user}
                                </p>
                            </div>

                            <span className="text-sm text-gray-500">
                                {activity.time}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Admin;
