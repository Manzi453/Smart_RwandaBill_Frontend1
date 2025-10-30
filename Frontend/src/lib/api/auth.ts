// Mock Auth Service - No backend integration

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  telephone: string;
  district: string;
  sector: string;
  roles: string[];
}

export interface AuthResponse {
  token: string;
  type: string;
  id: string;
  username: string;
  email: string;
  fullName: string;
  telephone: string;
  district: string;
  sector: string;
  roles: string[];
}

export interface SignupData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  telephone: string;
  district: string;
  sector: string;
  roles?: string[];
}

export const authService = {
  // Sign up a new user (mock)
  signup: async (userData: SignupData): Promise<AuthResponse> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockResponse: AuthResponse = {
        token: 'mock-token-' + Date.now(),
        type: 'Bearer',
        id: Date.now().toString(),
        username: userData.username,
        email: userData.email,
        fullName: userData.fullName,
        telephone: userData.telephone,
        district: userData.district,
        sector: userData.sector,
        roles: userData.roles || ['user']
      };
      
      return mockResponse;
    } catch (error: any) {
      throw new Error(error.message || 'Signup failed');
    }
  },

  // Login with email/phone and password (mock)
  login: async (credentials: { email?: string; phoneNumber?: string; password: string }): Promise<AuthResponse> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockResponse: AuthResponse = {
        token: 'mock-token-' + Date.now(),
        type: 'Bearer',
        id: '1',
        username: 'Test User',
        email: credentials.email || 'user@example.com',
        fullName: 'Test User',
        telephone: '+250788123456',
        district: 'Kigali',
        sector: 'Nyarugenge',
        roles: ['ROLE_USER']
      };
      
      // Store the token and user data in local storage
      if (mockResponse.token) {
        localStorage.setItem('token', mockResponse.token);
        localStorage.setItem('user', JSON.stringify({
          id: mockResponse.id,
          username: mockResponse.username,
          email: mockResponse.email,
          fullName: mockResponse.fullName,
          telephone: mockResponse.telephone,
          district: mockResponse.district,
          sector: mockResponse.sector,
          roles: mockResponse.roles
        }));
      }
      
      return mockResponse;
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  },

  // Get current user from local storage
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get auth token
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  // Check if user has required role
  hasRole: (role: string): boolean => {
    const user = authService.getCurrentUser();
    return user ? user.roles.includes(role) : false;
  },

  // Logout
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};
