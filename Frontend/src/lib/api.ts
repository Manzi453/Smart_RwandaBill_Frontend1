// Placeholder API functions for SuperAdmin data
// TODO: Implement actual API calls

export const getSuperAdminStats = async () => {
  // Enhanced stats for platform oversight with Rwandan context
  return {
    totalUsers: 50000,
    totalBills: 150000,
    totalAdmins: 15,
    systemHealth: 99.9,
    securityIncidents: 2,
    totalRevenue: 250000000, // in RWF
    districtsCovered: 5, // Kigali, Northern, Southern, Eastern, Western
    activeServices: 3, // Water, Sanitation, Security
    monthlyGrowth: 8.5,
    collectionRate: 94.2,
    overdueAmount: 12500000, // in RWF
  };
};

export const getSuperAdminBillsChart = async () => {
  // Placeholder: Return mock data for bills growth chart by service
  return [
    { name: 'Jan', water: 12000, sanitation: 8000, security: 6000 },
    { name: 'Feb', water: 15000, sanitation: 9500, security: 7000 },
    { name: 'Mar', water: 18000, sanitation: 11000, security: 8000 },
    { name: 'Apr', water: 22000, sanitation: 13000, security: 9000 },
    { name: 'May', water: 25000, sanitation: 15000, security: 10000 },
    { name: 'Jun', water: 28000, sanitation: 17000, security: 11000 },
  ];
};

export const getSuperAdminUsersChart = async () => {
  // Placeholder: Return mock data for user distribution by Rwandan districts
  return [
    { name: 'Kigali City', value: 15000 },
    { name: 'Northern Province', value: 12000 },
    { name: 'Southern Province', value: 10000 },
    { name: 'Eastern Province', value: 8000 },
    { name: 'Western Province', value: 5000 },
  ];
};

export const getSuperAdminAdminsChart = async () => {
  // Placeholder: Return mock data for admin status by service
  return [
    { name: 'Water Service', value: 5 },
    { name: 'Sanitation Service', value: 5 },
    { name: 'Security Service', value: 5 },
  ];
};

export const getSuperAdminSystemHealth = async () => {
  // Placeholder: Return mock data for system health over time
  return [
    { name: 'Mon', value: 98 },
    { name: 'Tue', value: 99 },
    { name: 'Wed', value: 100 },
    { name: 'Thu', value: 99.5 },
    { name: 'Fri', value: 99.8 },
    { name: 'Sat', value: 99.9 },
    { name: 'Sun', value: 99.7 },
  ];
};

// Placeholder API functions for Admin data
export const getAdminStats = async (user?: { role: string; service?: string }) => {
  // Placeholder: Return mock stats for admin dashboard
  const allStats = {
    totalUsers: 2500,
    pendingPayments: 150,
    processedPayments: 2200,
    revenue: 1250000, // in RWF or equivalent
  };

  // Filter stats based on user role and service
  if (user?.role === 'admin' && user.service) {
    // For service-specific admins, return only stats for their service
    // In a real app, this would filter from database based on service
    const serviceMultiplier = user.service === 'security' ? 0.4 : user.service === 'water' ? 0.4 : 0.2; // sanitation
    return {
      totalUsers: Math.round(allStats.totalUsers * serviceMultiplier),
      pendingPayments: Math.round(allStats.pendingPayments * serviceMultiplier),
      processedPayments: Math.round(allStats.processedPayments * serviceMultiplier),
      revenue: Math.round(allStats.revenue * serviceMultiplier),
    };
  }

  // Superadmin or no filter: return all stats
  return allStats;
};

export const getAdminPaymentsChart = async (user?: { role: string; service?: string }) => {
  // Placeholder: Return mock data for payments growth chart (water vs security vs sanitation)
  const allData = [
    { name: 'Jan', water: 8000, security: 6000, sanitation: 4000 },
    { name: 'Feb', water: 9000, security: 7000, sanitation: 4500 },
    { name: 'Mar', water: 10000, security: 8000, sanitation: 5000 },
    { name: 'Apr', water: 11000, security: 9000, sanitation: 5500 },
    { name: 'May', water: 12000, security: 10000, sanitation: 6000 },
    { name: 'Jun', water: 13000, security: 11000, sanitation: 6500 },
  ];

  // Filter data based on user role and service
  if (user?.role === 'admin' && user.service) {
    // For service-specific admins, return only data for their service
    return allData.map(item => ({
      name: item.name,
      [user.service!]: item[user.service as keyof typeof item]
    }));
  }

  // Superadmin or no filter: return all data
  return allData;
};

export const getAdminPaymentStatusChart = async (user?: { role: string; service?: string }) => {
  // Placeholder: Return mock data for payment status distribution
  const allData = [
    { name: 'Paid', value: 1800 },
    { name: 'Pending', value: 400 },
    { name: 'Overdue', value: 100 },
  ];

  // Filter data based on user role and service
  if (user?.role === 'admin' && user.service) {
    // For service-specific admins, scale down the values
    const serviceMultiplier = user.service === 'security' ? 0.4 : user.service === 'water' ? 0.4 : 0.2;
    return allData.map(item => ({
      name: item.name,
      value: Math.round(item.value * serviceMultiplier)
    }));
  }

  return allData;
};

export const getAdminUserGrowthChart = async (user?: { role: string; service?: string }) => {
  // Placeholder: Return mock data for user growth over time
  const allData = [
    { name: 'Jan', value: 1800 },
    { name: 'Feb', value: 1900 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2100 },
    { name: 'May', value: 2200 },
    { name: 'Jun', value: 2300 },
  ];

  // Filter data based on user role and service
  if (user?.role === 'admin' && user.service) {
    const serviceMultiplier = user.service === 'security' ? 0.4 : user.service === 'water' ? 0.4 : 0.2;
    return allData.map(item => ({
      name: item.name,
      value: Math.round(item.value * serviceMultiplier)
    }));
  }

  return allData;
};

export const getAdminUsersList = async (): Promise<{ id: number; name: string; email: string; lastPayment: string; status: string; }[]> => {
  // Placeholder: Return mock list of users
  return [
    { id: 1, name: 'Jean Baptiste', email: 'jean@example.com', lastPayment: '2024-06-15', status: 'Active' },
    { id: 2, name: 'Marie Claire', email: 'marie@example.com', lastPayment: '2024-06-10', status: 'Active' },
    { id: 3, name: 'Paul Kagame', email: 'paul@example.com', lastPayment: '2024-05-20', status: 'Inactive' },
    { id: 4, name: 'Alice Uwimana', email: 'alice@example.com', lastPayment: '2024-06-12', status: 'Active' },
    { id: 5, name: 'David Nkurunziza', email: 'david@example.com', lastPayment: '2024-06-01', status: 'Pending' },
  ];
};

export const getAdminPaymentsList = async (user?: { role: string; service?: string }) => {
  // Placeholder: Return mock list of payments
  const allPayments = [
    { id: 1, user: 'Jean Baptiste', service: 'Water', amount: 5000, status: 'Paid', date: '2024-06-15' },
    { id: 2, user: 'Marie Claire', service: 'Security', amount: 8000, status: 'Pending', date: '2024-06-10' },
    { id: 3, user: 'Paul Kagame', service: 'Water', amount: 5000, status: 'Overdue', date: '2024-05-20' },
    { id: 4, user: 'Alice Uwimana', service: 'Security', amount: 8000, status: 'Paid', date: '2024-06-12' },
    { id: 5, user: 'David Nkurunziza', service: 'Water', amount: 5000, status: 'Paid', date: '2024-06-01' },
    { id: 6, user: 'Joseph Niyonzima', service: 'Sanitation', amount: 3000, status: 'Paid', date: '2024-06-14' },
    { id: 7, user: 'Grace Mukamana', service: 'Sanitation', amount: 3000, status: 'Pending', date: '2024-06-08' },
  ];

  // Filter payments based on user role and service
  if (user?.role === 'admin' && user.service) {
    // For service-specific admins, return only payments for their service
    return allPayments.filter(payment => payment.service.toLowerCase() === user.service);
  }

  // Superadmin or no filter: return all payments
  return allPayments;
};

export const getAdminRecentActivities = async () => {
  // Placeholder: Return mock recent activities
  return [
    { id: 1, action: 'Payment processed', user: 'Jean Baptiste', timestamp: '2024-06-15 10:30' },
    { id: 2, action: 'User registered', user: 'Marie Claire', timestamp: '2024-06-14 14:20' },
    { id: 3, action: 'Payment overdue', user: 'Paul Kagame', timestamp: '2024-06-13 09:15' },
    { id: 4, action: 'Profile updated', user: 'Alice Uwimana', timestamp: '2024-06-12 16:45' },
  ];
};

// Placeholder API functions for User dashboard
export const getUserStats = async (userId: string) => {
  // Enhanced stats for user dashboard with bill management context
  return {
    totalPayments: 12,
    pendingPayments: 2,
    completedPayments: 10,
    totalAmount: 85000, // in RWF
    overdueBills: 1,
    upcomingBills: 3,
    averagePaymentTime: 2, // days
    serviceUsage: {
      water: 85,
      sanitation: 92,
      security: 78
    }
  };
};

export const getUserPayments = async (userId: string) => {
  // Placeholder: Return mock payments for user
  return [
    { id: 1, service: 'Water', amount: 5000, status: 'Paid', date: '2024-06-15', dueDate: '2024-06-15' },
    { id: 2, service: 'Security', amount: 8000, status: 'Paid', date: '2024-06-10', dueDate: '2024-06-10' },
    { id: 3, service: 'Water', amount: 5000, status: 'Pending', date: null, dueDate: '2024-07-15' },
    { id: 4, service: 'Sanitation', amount: 3000, status: 'Paid', date: '2024-06-14', dueDate: '2024-06-14' },
    { id: 5, service: 'Security', amount: 8000, status: 'Pending', date: null, dueDate: '2024-07-10' },
  ];
};

export const getUserPaymentHistory = async (userId: string) => {
  // Placeholder: Return mock payment history for user
  return [
    { id: 1, service: 'Water', amount: 5000, date: '2024-05-15', status: 'Paid' },
    { id: 2, service: 'Security', amount: 8000, date: '2024-05-10', status: 'Paid' },
    { id: 3, service: 'Water', amount: 5000, date: '2024-04-15', status: 'Paid' },
    { id: 4, service: 'Sanitation', amount: 3000, date: '2024-04-14', status: 'Paid' },
    { id: 5, service: 'Security', amount: 8000, date: '2024-04-10', status: 'Paid' },
    { id: 6, service: 'Water', amount: 5000, date: '2024-03-15', status: 'Paid' },
  ];
};

export const getUserNotifications = async (userId: string) => {
  // Enhanced notifications for user with bill management context
  return [
    { id: 1, title: 'Payment Due Soon', message: 'Your water bill payment is due in 3 days', type: 'warning', date: '2024-06-12', service: 'water' },
    { id: 2, title: 'Payment Successful', message: 'Your security bill has been paid successfully', type: 'success', date: '2024-06-10', service: 'security' },
    { id: 3, title: 'New Bill Available', message: 'Your sanitation bill for June is now available', type: 'info', date: '2024-06-01', service: 'sanitation' },
    { id: 4, title: 'Overdue Payment', message: 'Your water bill from May is overdue. Please pay immediately to avoid penalties.', type: 'error', date: '2024-06-08', service: 'water' },
    { id: 5, title: 'Auto-Payment Setup', message: 'Your auto-payment for security services has been activated', type: 'success', date: '2024-06-05', service: 'security' },
  ];
};

// New API functions for enhanced features

// Bill Generation and Management
export const generateBills = async (service: string, district?: string) => {
  // Mock bill generation for a service
  return {
    generated: 1250,
    service: service,
    district: district || 'All Districts',
    totalAmount: 6250000, // RWF
    dueDate: '2024-07-15'
  };
};

export const getBillDetails = async (billId: string) => {
  // Mock bill details
  return {
    id: billId,
    service: 'Water',
    amount: 5000,
    dueDate: '2024-07-15',
    status: 'Pending',
    usage: 25, // cubic meters
    period: 'June 2024',
    district: 'Kigali City',
    sector: 'Gasabo'
  };
};

// Payment Processing
export const processPayment = async (paymentData: {
  billId: string;
  amount: number;
  method: 'mobile_money' | 'bank_transfer' | 'card';
  phoneNumber?: string;
}) => {
  // Mock payment processing
  return {
    success: true,
    transactionId: 'TXN_' + Date.now(),
    amount: paymentData.amount,
    method: paymentData.method,
    timestamp: new Date().toISOString(),
    receiptUrl: '/receipts/' + paymentData.billId
  };
};

// Admin Management
export const createAdmin = async (adminData: {
  fullName: string;
  email: string;
  service: 'water' | 'sanitation' | 'security';
  district: string;
}) => {
  // Mock admin creation
  return {
    id: Date.now().toString(),
    ...adminData,
    role: 'admin',
    status: 'active',
    createdAt: new Date().toISOString()
  };
};

export const getAdminList = async () => {
  // Mock admin list
  return [
    { id: '1', fullName: 'Jean Baptiste Nkurunziza', email: 'jean.admin@example.com', service: 'water', district: 'Kigali City', status: 'active' },
    { id: '2', fullName: 'Marie Claire Uwimana', email: 'marie.admin@example.com', service: 'sanitation', district: 'Northern Province', status: 'active' },
    { id: '3', fullName: 'Paul Kagame', email: 'paul.admin@example.com', service: 'security', district: 'Southern Province', status: 'active' },
  ];
};

// User Management for Admins
export const updateUserStatus = async (userId: string, status: 'active' | 'inactive' | 'suspended') => {
  // Mock user status update
  return {
    userId,
    status,
    updatedAt: new Date().toISOString()
  };
};

export const sendUserNotification = async (userId: string, message: string, type: 'info' | 'warning' | 'error') => {
  // Mock notification sending
  return {
    notificationId: Date.now().toString(),
    userId,
    message,
    type,
    sentAt: new Date().toISOString()
  };
};

// Reports and Analytics
export const getRevenueReport = async (startDate: string, endDate: string, service?: string) => {
  // Mock revenue report
  return {
    period: { startDate, endDate },
    service: service || 'All Services',
    totalRevenue: 15000000, // RWF
    totalTransactions: 2500,
    averageTransaction: 6000,
    breakdown: {
      water: 8000000,
      sanitation: 4000000,
      security: 3000000
    }
  };
};

export const getOverduePaymentsReport = async (service?: string) => {
  // Mock overdue payments report
  return {
    service: service || 'All Services',
    totalOverdue: 12500000, // RWF
    overdueCount: 250,
    criticalCount: 45, // >30 days overdue
    breakdown: [
      { daysOverdue: '1-7', amount: 2000000, count: 80 },
      { daysOverdue: '8-30', amount: 5000000, count: 125 },
      { daysOverdue: '31+', amount: 5500000, count: 45 }
    ]
  };
};
