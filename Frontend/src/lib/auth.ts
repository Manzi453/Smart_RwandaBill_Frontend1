// Token storage keys
const AUTH_TOKEN_KEY = 'water_payment_auth_token';
const REFRESH_TOKEN_KEY = 'water_payment_refresh_token';

// Get authentication token from localStorage
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

// Set authentication token in localStorage
export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }
};

// Get refresh token from httpOnly cookie
// Note: This is handled automatically by the browser with httpOnly cookies
// This is just a placeholder for any client-side token needs
export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

// Clear authentication data
export const clearAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    // Note: For httpOnly cookies, the server should handle invalidation
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Store user data in localStorage
export const storeUserData = (user: any): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

// Get user data from localStorage
export const getUserData = (): any => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Clear all user data
export const clearUserData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
    clearAuthToken();
  }
};

// Check if user has a specific role
export const hasRole = (role: string): boolean => {
  const user = getUserData();
  if (!user || !user.roles) return false;
  return user.roles.includes(role);
};

// Check if user has any of the specified roles
export const hasAnyRole = (roles: string[]): boolean => {
  const user = getUserData();
  if (!user || !user.roles) return false;
  return user.roles.some((role: string) => roles.includes(role));
};

// Get user's full name
export const getUserFullName = (): string => {
  const user = getUserData();
  if (!user) return '';
  return `${user.firstName || ''} ${user.lastName || ''}`.trim();
};

// Handle successful login
export const handleLoginSuccess = (response: any): void => {
  const { accessToken, refreshToken, ...userData } = response.data;
  setAuthToken(accessToken);
  storeUserData(userData);
  // Note: refreshToken should be httpOnly and handled by the browser
};

// Handle logout
export const handleLogout = (): void => {
  clearUserData();
  // Redirect to login page
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};
