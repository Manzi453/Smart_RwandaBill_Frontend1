// Placeholder API functions for SuperAdmin data
// TODO: Implement actual API calls

export const getSuperAdminStats = async () => {
  // Placeholder: Return mock stats for security and water payment
  return {
    totalUsers: 50000,
    totalBills: 150000,
    totalAdmins: 15,
    systemHealth: 99.9,
    securityIncidents: 2,
  };
};

export const getSuperAdminBillsChart = async () => {
  // Placeholder: Return mock data for bills growth chart
  return [
    { name: 'Jan', value: 12000 },
    { name: 'Feb', value: 15000 },
    { name: 'Mar', value: 18000 },
    { name: 'Apr', value: 22000 },
    { name: 'May', value: 25000 },
    { name: 'Jun', value: 28000 },
  ];
};

export const getSuperAdminUsersChart = async () => {
  // Placeholder: Return mock data for user distribution
  return [
    { name: 'Active', value: 30000 },
    { name: 'Inactive', value: 15000 },
    { name: 'Suspended', value: 5000 },
  ];
};

export const getSuperAdminAdminsChart = async () => {
  // Placeholder: Return mock data for admin status
  return [
    { name: 'Active', value: 12 },
    { name: 'Inactive', value: 3 },
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

export const getAdminPaymentStatusChart = async () => {
  // Placeholder: Return mock data for payment status distribution
  return [
    { name: 'Paid', value: 1800 },
    { name: 'Pending', value: 400 },
    { name: 'Overdue', value: 100 },
  ];
};

export const getAdminUserGrowthChart = async () => {
  // Placeholder: Return mock data for user growth over time
  return [
    { name: 'Jan', value: 1800 },
    { name: 'Feb', value: 1900 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2100 },
    { name: 'May', value: 2200 },
    { name: 'Jun', value: 2300 },
  ];
};

export const getAdminUsersList = async () => {
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
  // Placeholder: Return mock stats for user dashboard
  return {
    totalPayments: 12,
    pendingPayments: 2,
    completedPayments: 10,
    totalAmount: 85000, // in RWF
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
  // Placeholder: Return mock notifications for user
  return [
    { id: 1, title: 'Payment Due Soon', message: 'Your water bill payment is due in 3 days', type: 'warning', date: '2024-06-12' },
    { id: 2, title: 'Payment Successful', message: 'Your security bill has been paid successfully', type: 'success', date: '2024-06-10' },
    { id: 3, title: 'New Bill Available', message: 'Your sanitation bill for June is now available', type: 'info', date: '2024-06-01' },
  ];
};
