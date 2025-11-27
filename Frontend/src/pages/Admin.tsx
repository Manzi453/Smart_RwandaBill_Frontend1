
import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
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
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { ExportReports } from '../components/admin/ExportReports';
import { AdvancedFilters } from "../components/admin/AdvancedFilters";
import { DashboardWidgets } from "@/components/DashboardWidgets";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import {
    Users,
    DollarSign,
    Activity,
    MoreHorizontal,
    Download,
    Eye,
    Mail,
    Phone,
    BarChart3,
    TrendingUp,
    Settings,
    Search,
    Menu,
    RotateCcw,
    Clock,
    MapPin,
    FileText, UserPlus,
} from 'lucide-react';

// ------------------ TYPES ------------------
interface UserType {
    id: string;
    name: string;
    email: string;
    phone?: string;
    district?: string;
    status: 'active' | 'inactive' | 'pending';
    lastPayment: string;
    role: 'admin' | 'user' | 'superadmin';
    service?: string;
    totalBills?: number;
    paidBills?: number;
}

interface AuthUser {
    id: string;
    fullName: string;
    email: string;
    role: string;
    service?: string;
}

interface ActivityItem {
    id: number;
    action: string;
    user: string;
    time: string;
    amount?: number;
    count?: number;
    type?: 'user' | 'payment' | 'bill';
}

interface Stats {
    totalUsers: number;
    activeUsers: number;
    totalRevenue: number;
    pendingPayments: number;
    collectionRate: number;
    averageBillAmount: number;
    recentActivities: ActivityItem[];
}

interface FilterOption {
    id: string;
    label: string;
    type: "date" | "select" | "text" | "range";
    value: string | number | [number, number];
    options?: Array<{ value: string; label: string }>;
}

// ------------------ API FUNCTIONS ------------------
const getAdminUsersList = async (): Promise<UserType[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return [
        {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
            phone: "+250788123456",
            district: "Kigali City",
            status: "active",
            lastPayment: "2024-10-15",
            role: "admin",
            service: "water",
            totalBills: 12,
            paidBills: 11
        },
        {
            id: "2",
            name: "Jane Smith",
            email: "jane@example.com",
            phone: "+250789234567",
            district: "Kigali City",
            status: "active",
            lastPayment: "2024-10-14",
            role: "user",
            service: "sanitation",
            totalBills: 8,
            paidBills: 7
        },
        {
            id: "3",
            name: "Bob Johnson",
            email: "bob@example.com",
            phone: "+250790345678",
            district: "Northern Province",
            status: "pending",
            lastPayment: "2024-09-28",
            role: "user",
            service: "security",
            totalBills: 5,
            paidBills: 3
        },
        {
            id: "4",
            name: "Alice Brown",
            email: "alice@example.com",
            phone: "+250791456789",
            district: "Southern Province",
            status: "inactive",
            lastPayment: "2024-08-15",
            role: "admin",
            service: "water",
            totalBills: 15,
            paidBills: 12
        },
        {
            id: "5",
            name: "Charlie Wilson",
            email: "charlie@example.com",
            phone: "+250792567890",
            district: "Eastern Province",
            status: "active",
            lastPayment: "2024-10-20",
            role: "superadmin",
            service: "security",
            totalBills: 20,
            paidBills: 18
        },
        {
            id: "6",
            name: "Diana Miller",
            email: "diana@example.com",
            phone: "+250793678901",
            district: "Western Province",
            status: "active",
            lastPayment: "2024-10-18",
            role: "user",
            service: "sanitation",
            totalBills: 6,
            paidBills: 6
        }
    ];
};

// ------------------ STATS GENERATOR ------------------
const generateMockStats = (
    user: AuthUser | null,
    t: (key: string, options?: Record<string, unknown>) => string
): Stats => {
    const baseStats: Stats = {
        totalUsers: 1245,
        activeUsers: 876,
        totalRevenue: 18750000,
        pendingPayments: 2450000,
        collectionRate: 81.6,
        averageBillAmount: 15000,
        recentActivities: [
            {
                id: 1,
                action: t('admin.activities.newUserRegistration'),
                user: "John Doe",
                time: t('common.timeAgo', { count: 2, unit: 'minute' }),
                type: 'user'
            },
            {
                id: 2,
                action: t('admin.activities.paymentReceived'),
                user: "Jane Smith",
                amount: 50000,
                time: t('common.timeAgo', { count: 15, unit: 'minute' }),
                type: 'payment'
            },
            {
                id: 3,
                action: t('admin.activities.billGenerated'),
                user: t('services.water'),
                count: 45,
                time: t('common.timeAgo', { count: 1, unit: 'hour' }),
                type: 'bill'
            },
            {
                id: 4,
                action: t('admin.activities.paymentReceived'),
                user: "Bob Johnson",
                amount: 75000,
                time: t('common.timeAgo', { count: 30, unit: 'minute' }),
                type: 'payment'
            },
            {
                id: 5,
                action: t('admin.activities.newUserRegistration'),
                user: "Alice Brown",
                time: t('common.timeAgo', { count: 2, unit: 'hour' }),
                type: 'user'
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
            collectionRate: 83.2,
            averageBillAmount: 12000,
        };
    }

    return baseStats;
};

// ------------------ MAIN COMPONENT ------------------
const Admin: React.FC = () => {
    const { t } = useTranslation();
    const { user: authUser } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [roleFilter, setRoleFilter] = useState("all");
    const [activeTab, setActiveTab] = useState("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(prev => !prev);

    // Fetch users list
    const { data: users, isLoading, isError, refetch } = useQuery<UserType[]>({
        queryKey: ['adminUsers'],
        queryFn: getAdminUsersList,
    });

    // Generate stats
    const stats = generateMockStats(authUser as AuthUser, t);

    // Filter users
    const filteredUsers = useMemo(() => {
        if (!users) return [];

        const s = searchTerm.toLowerCase();
        return users.filter((u) => {
            const matchesSearch =
                u.name.toLowerCase().includes(s) ||
                u.email.toLowerCase().includes(s) ||
                u.phone?.toLowerCase().includes(s) ||
                u.district?.toLowerCase().includes(s);

            const matchesStatus = statusFilter === "all" || u.status === statusFilter;
            const matchesRole = roleFilter === "all" || u.role === roleFilter;

            return matchesSearch && matchesStatus && matchesRole;
        });
    }, [users, searchTerm, statusFilter, roleFilter]);

    const handleUserStatusToggle = (userId: string, currentStatus: UserType['status']) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        // In a real app, you would update the user status via an API call here
        toast.success(t('admin.users.actions.statusUpdated', { status: t(`common.status.${newStatus}`) }));
    };

    const handleExport = (format: string, type: string) => {
        toast.success(`Exporting ${type} as ${format.toUpperCase()}`);
        // Handle export logic here
    };

    const handleFilterChange = (filters: FilterOption[]) => {
        toast.success(`Applied ${filters.length} filters`);
        // Handle filter logic here
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-RW', {
            style: 'currency',
            currency: 'RWF',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getUserStatusBadge = (status: UserType['status']) => {
        const statusMap = {
            active: 'bg-green-100 text-green-800 border-green-200',
            inactive: 'bg-red-100 text-red-800 border-red-200',
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        };

        return (
            <Badge variant="outline" className={statusMap[status]}>
                {t(`common.status.${status}`)}
            </Badge>
        );
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'user':
                return <UserPlus className="h-4 w-4 text-blue-600" />;
            case 'payment':
                return <DollarSign className="h-4 w-4 text-green-600" />;
            case 'bill':
                return <FileText className="h-4 w-4 text-purple-600" />;
            default:
                return <Activity className="h-4 w-4 text-gray-600" />;
        }
    };

    const renderDashboardTab = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Dashboard Widgets */}
            <DashboardWidgets
                widgets={[
                    {
                        id: "revenue",
                        title: "Total Revenue",
                        value: formatCurrency(stats.totalRevenue),
                        change: "+12%",
                        icon: <DollarSign className="h-6 w-6" />,
                        color: "text-green-600",
                        visible: true,
                    },
                    {
                        id: "users",
                        title: "Active Users",
                        value: stats.activeUsers.toLocaleString(),
                        change: "+5%",
                        icon: <Users className="h-6 w-6" />,
                        color: "text-blue-600",
                        visible: true,
                    },
                    {
                        id: "pending",
                        title: "Pending Payments",
                        value: formatCurrency(stats.pendingPayments),
                        change: "-3%",
                        icon: <Clock className="h-6 w-6" />,
                        color: "text-yellow-600",
                        visible: true,
                    },
                    {
                        id: "growth",
                        title: "Collection Rate",
                        value: `${stats.collectionRate}%`,
                        change: "+2.1%",
                        icon: <TrendingUp className="h-6 w-6" />,
                        color: "text-purple-600",
                        visible: true,
                    },
                ]}
            />

            {/* Recent Activities */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{t('admin.recentActivities')}</CardTitle>
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {stats.recentActivities.map((activity) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="p-2 rounded-full bg-primary/10">
                                        {getActivityIcon(activity.type!)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{activity.action}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {activity.user}
                                            {activity.amount && (
                                                <span className="ml-2 text-green-600 font-semibold">
                                                    {formatCurrency(activity.amount)}
                                                </span>
                                            )}
                                            {activity.count && (
                                                <span className="ml-2 text-blue-600 font-semibold">
                                                    {activity.count} {t('common.items')}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {activity.time}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );

    const renderUsersTab = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header with Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold">{t('admin.users.title')}</h2>
                    <p className="text-muted-foreground">
                        {filteredUsers.length} {t('admin.users.title').toLowerCase()} found
                    </p>
                </div>
                <div className="flex gap-2">
                    <ExportReports onExport={handleExport} />
                </div>
            </div>

            {/* Advanced Filters */}
            <AdvancedFilters onFilterChange={handleFilterChange} />

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="space-y-2">
                            <Label htmlFor="search">{t('common.search')}</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="search"
                                    placeholder={t('admin.users.searchPlaceholder')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>{t('common.status')}</Label>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('common.selectStatus')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t('common.all')}</SelectItem>
                                    <SelectItem value="active">{t('common.status.active')}</SelectItem>
                                    <SelectItem value="inactive">{t('common.status.inactive')}</SelectItem>
                                    <SelectItem value="pending">{t('common.status.pending')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>{t('common.role')}</Label>
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('common.selectRole')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t('common.all')}</SelectItem>
                                    <SelectItem value="admin">{t('common.roles.admin')}</SelectItem>
                                    <SelectItem value="user">{t('common.roles.user')}</SelectItem>
                                    <SelectItem value="superadmin">{t('common.roles.superadmin')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Actions</Label>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    setSearchTerm("");
                                    setStatusFilter("all");
                                    setRoleFilter("all");
                                }}
                            >
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Reset
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <div className="relative overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('common.name')}</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>District</TableHead>
                                <TableHead>Bills</TableHead>
                                <TableHead>{t('common.status')}</TableHead>
                                <TableHead>{t('common.role')}</TableHead>
                                <TableHead>{t('common.service')}</TableHead>
                                <TableHead className="text-right">{t('common.actions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length ? (
                                filteredUsers.map((user) => (
                                    <TableRow key={user.id} className="hover:bg-muted/30">
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Mail className="h-3 w-3" />
                                                    {user.email}
                                                </div>
                                                {user.phone && (
                                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                        <Phone className="h-3 w-3" />
                                                        {user.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {user.district && (
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                                    {user.district}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {user.totalBills !== undefined && (
                                                <div className="text-sm">
                                                    <div className="font-semibold">
                                                        {user.paidBills}/{user.totalBills}
                                                    </div>
                                                    <div className="text-muted-foreground text-xs">paid</div>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>{getUserStatusBadge(user.status)}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {t(`common.roles.${user.role}`)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {user.service ? (
                                                <Badge variant="secondary">
                                                    {t(`services.${user.service}`)}
                                                </Badge>
                                            ) : (
                                                '-'
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-2">
                                                <Switch
                                                    checked={user.status === 'active'}
                                                    onCheckedChange={() => handleUserStatusToggle(user.id, user.status)}
                                                    className="data-[state=checked]:bg-green-500"
                                                />
                                                <Button variant="outline" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-24 text-center">
                                        {t('admin.users.noUsersFound')}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </motion.div>
    );

    const renderSettingsTab = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <Card>
                <CardHeader>
                    <CardTitle>{t('admin.settings.title')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>System Name</Label>
                            <Input defaultValue="RwandaBills Admin" />
                        </div>
                        <div className="space-y-2">
                            <Label>Default Language</Label>
                            <Select defaultValue="en">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="fr">Français</SelectItem>
                                    <SelectItem value="rw">Kinyarwanda</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Auto-refresh Interval</Label>
                            <Select defaultValue="5min">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1min">1 Minute</SelectItem>
                                    <SelectItem value="5min">5 Minutes</SelectItem>
                                    <SelectItem value="15min">15 Minutes</SelectItem>
                                    <SelectItem value="30min">30 Minutes</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Default Export Format</Label>
                            <Select defaultValue="pdf">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pdf">PDF</SelectItem>
                                    <SelectItem value="excel">Excel</SelectItem>
                                    <SelectItem value="csv">CSV</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button>{t('admin.settings.save')}</Button>
                        <Button variant="outline">{t('admin.settings.reset')}</Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-lg">{t('common.loading')}</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-red-500">{t('common.errorLoadingData')}</div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out`}>
                <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            </div>
            
            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden" 
                    onClick={toggleSidebar}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 md:pl-64 transition-all duration-200">
                <div className="p-4 md:p-6 space-y-6">
                    {/* Header */}
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <Button 
                                variant="outline" 
                                size="icon" 
                                className="md:hidden"
                                onClick={toggleSidebar}
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold">{t('admin.dashboard.title')}</h1>
                                <p className="text-sm text-muted-foreground">
                                    {t('common.lastUpdated')}: {new Date().toLocaleDateString()} •
                                    Welcome, {authUser?.fullName}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={() => refetch()}>
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Refresh
                            </Button>
                        </div>
                    </header>

                    {/* Tabs */}
                    <div className="flex gap-2 border-b border-border overflow-x-auto">
                        {[
                            { id: "dashboard", label: "Dashboard", icon: BarChart3 },
                            { id: "users", label: t('admin.users.title'), icon: Users },
                            { id: "settings", label: t('admin.settings.title'), icon: Settings },
                        ].map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                                        activeTab === tab.id
                                            ? "border-blue-600 text-blue-600"
                                            : "border-transparent text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Tab Content */}
                    <AnimatePresence mode="wait">
                        {activeTab === "dashboard" && renderDashboardTab()}
                        {activeTab === "users" && renderUsersTab()}
                        {activeTab === "settings" && renderSettingsTab()}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default Admin;
