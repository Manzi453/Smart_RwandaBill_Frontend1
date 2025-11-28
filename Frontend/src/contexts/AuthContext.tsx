import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi } from "@/lib/apiClient";
import { setAuthToken, clearAuthToken, getAuthToken } from "@/lib/auth";

// Mock users for development and fallback purposes
// Define a type for mock users that includes all necessary fields
interface MockUser {
    fullName: string;
    email: string;
    telephone: string;
    district: string;
    sector: string;
    role: 'superadmin' | 'admin' | 'member';
    service?: 'security' | 'sanitation' | 'water';
    group: string;
    approved: boolean;
    emailVerified: boolean;
    password: string;
}

const MOCK_USERS: MockUser[] = [
    // Super Admin
    {
        fullName: "Super Admin",
        email: "superadmin@example.com",
        telephone: "+250700000001",
        district: "Kigali",
        sector: "Nyarugenge",
        role: "superadmin" as const,
        service: undefined,
        group: "Administrators",
        approved: true,
        emailVerified: true,
        password: "admin123"
    },
    // Water Service Admin
    {
        fullName: "Water Service Admin",
        email: "adminwater@example.com",
        telephone: "+250700000002",
        district: "Kigali",
        sector: "Kicukiro",
        role: "admin" as const,
        service: "water" as const,
        group: "Water Service",
        approved: true,
        emailVerified: true,
        password: "admin123"
    },
    // Security Service Admin
    {
        fullName: "Security Service Admin",
        email: "adminsecurity@example.com",
        telephone: "+250700000003",
        district: "Kigali",
        sector: "Gasabo",
        role: "admin" as const,
        service: "security" as const,
        group: "Security Service",
        approved: true,
        emailVerified: true,
        password: "admin123"
    },
    // Sanitation Service Admin
    {
        fullName: "Sanitation Service Admin",
        email: "adminsanitation@example.com",
        telephone: "+250700000004",
        district: "Kigali",
        sector: "Nyarugenge",
        role: "admin" as const,
        service: "sanitation" as const,
        group: "Sanitation Service",
        approved: true,
        emailVerified: true,
        password: "admin123"
    },
    // Regular User
    {
        fullName: "Regular User",
        email: "user@example.com",
        telephone: "+250700000005",
        district: "Kigali",
        sector: "Gikondo",
        role: "member" as const,
        service: undefined,
        group: "Residents",
        approved: true,
        emailVerified: true,
        password: "user123"
    }
];

export interface User {
    id: string;
    fullName: string;
    email: string;
    telephone: string;
    district: string;
    sector: string;
    role: "superadmin" | "admin" | "member";
    service?: "security" | "sanitation" | "water";
    group: string;
    approved: boolean;
    approvedAt?: string;
    approvedBy?: string;
    rejectionReason?: string;
    emailVerified: boolean;
}

interface AuthContextType {
    user: User | null;
    login: (data: { email: string; password: string }) => Promise<User>;
    logout: () => void;
    signup: (data: {
        fullName: string;
        email: string;
        telephone: string;
        district: string;
        sector: string;
        password: string;
        role?: 'admin' | 'member';
        service?: 'water' | 'sanitation' | 'security';
        group?: string;
    }) => Promise<{ success: boolean; message: string }>;
    googleSignup: (data: { fullName: string; email: string }) => Promise<void>;
    isLoading: boolean;
    isAuthenticated: boolean;
    token: string | null;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(getAuthToken());
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = !!user && !!token;

    // ---------------- CHECK AUTH STATUS ----------------
    const checkAuth = async () => {
        const currentToken = getAuthToken();
        
        if (!currentToken) {
            setUser(null);
            setToken(null);
            setIsLoading(false);
            return;
        }

        try {
            // Try to fetch current user from the backend
            const response = await authApi.getCurrentUser();
            const userData = response.data;
            
            if (userData) {
                const userRole = (userData.role || '').toLowerCase() as 'superadmin' | 'admin' | 'member';
                
                const currentUser: User = {
                    id: userData.id.toString(),
                    fullName: userData.fullName,
                    email: userData.email,
                    telephone: userData.telephone || "+250700000000",
                    district: userData.district || "Kigali",
                    sector: userData.sector || "Gikondo",
                    role: userRole,
                    service: userData.service,
                    group: userData.group || "Group A",
                    approved: userData.approved ?? true,
                    emailVerified: userData.emailVerified ?? true,
                };
                
                setUser(currentUser);
                setToken(currentToken);
            } else {
                throw new Error('Invalid user data');
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            // Fallback to mock user in development
            if (process.env.NODE_ENV === 'development' && currentToken === 'mock-token') {
                const mockUser: User = {
                    id: "1",
                    fullName: "Test User",
                    email: "user@example.com",
                    telephone: "+250700000000",
                    district: "Kicukiro",
                    sector: "Gikondo",
                    role: "member",
                    service: undefined,
                    group: "Group A",
                    approved: true,
                    emailVerified: true
                };
                setUser(mockUser);
                setToken(currentToken);
            } else {
                // Clear invalid token
                clearAuthToken();
                setUser(null);
                setToken(null);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // ---------------- LOGIN (WITH FALLBACK TO MOCK) ----------------
    const login = async (data: { email: string; password: string }) => {
        setIsLoading(true);

        try {
            // 1️⃣ Attempt BACKEND LOGIN
            try {
                console.log('Attempting login with:', data);
                const response = await authApi.login({
                    email: data.email.trim().toLowerCase(),
                    password: data.password
                });
                
                console.log('Login response:', response);

                if (response.data && response.data.token) {
                    const { token, user: result } = response.data;
                    console.log('Login successful, user data:', result);
                    
                    // Store the token
                    setAuthToken(token);
                    setToken(token);

                    // Ensure role is in lowercase for consistency
                    const userRole = (result.role || '').toLowerCase() as 'superadmin' | 'admin' | 'member';
                    
                    const loggedUser: User = {
                        id: result.id.toString(),
                        fullName: result.fullName,
                        email: result.email,
                        telephone: result.telephone || "+250700000000",
                        district: result.district || "Kigali",
                        sector: result.sector || "Gikondo",
                        role: userRole,
                        service: result.service,
                        group: result.group || "Group A",
                        approved: result.approved ?? true,
                        emailVerified: result.emailVerified ?? true,
                    };

                    setUser(loggedUser);
                    return loggedUser;
                } else {
                    throw new Error('Invalid response from server');
                }
            } catch (error) {
                console.error("Backend login failed:", error);
                // Only fall back to mock users in development
                if (process.env.NODE_ENV === 'development') {
                    console.warn("Falling back to mock users");
                } else {
                    const errorMessage = (error as any)?.response?.data?.message || 'Login failed. Please check your credentials and try again.';
                    throw new Error(errorMessage);
                }
            }

            // 2️⃣ Fallback to MOCK USERS
            const mock = MOCK_USERS.find(
                (m) => m.email === data.email && m.password === data.password
            );

            if (mock) {
                const mockUser: User = {
                    id: `mock-${Date.now()}`,
                    fullName: mock.fullName,
                    email: mock.email,
                    telephone: "+250700000000",
                    district: "Kigali",
                    sector: "Gikondo",
                    role: mock.role,
                    service: mock.service,
                    group: "Group A",
                    approved: true,
                    emailVerified: true,
                };

                const mockToken = `mock-jwt-token-${Date.now()}`;
                localStorage.setItem("authToken", mockToken);
                setToken(mockToken);
                setUser(mockUser);
                return mockUser;
            }

            throw new Error("Invalid email or password");
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // ---------------- LOGOUT ----------------
    const logout = async () => {
        try {
            // Try to call the backend logout endpoint
            await authApi.logout();
        } catch (error) {
            console.error("Logout error:", error);
            // Continue with client-side cleanup even if backend logout fails
        } finally {
            // Clear client-side auth state
            clearAuthToken();
            setUser(null);
            setToken(null);
        }
    };

    // ---------------- SIGNUP (WITH FALLBACK TO MOCK) ----------------
    const signup = async (data: {
        fullName: string;
        email: string;
        telephone: string;
        district: string;
        sector: string;
        password: string;
        role?: 'admin' | 'member';
        service?: 'water' | 'sanitation' | 'security';
        group?: string;
    }) => {
        setIsLoading(true);
        try {
            // 1️⃣ Attempt BACKEND SIGNUP
            try {
                // Set default role to 'member' if not provided
                const role = data.role || 'member';
                
                // Prepare the payload with role and service (if admin)
                // Format the service value to match the backend enum (UPPERCASE)
                const formatService = (service: string) => {
                    if (!service) return undefined;
                    return service.toUpperCase(); // Convert to uppercase for backend
                };

                // Map frontend roles to backend roles
                const roleMapping = {
                    'member': 'USER',
                    'admin': 'ADMIN',
                    'superadmin': 'SUPER_ADMIN'
                };
                
                const backendRole = roleMapping[role as keyof typeof roleMapping] || 'USER';
                
                const payload = {
                    fullName: data.fullName.trim(),
                    email: data.email.trim().toLowerCase(),
                    telephone: data.telephone.trim(),
                    district: data.district.trim(),
                    sector: data.sector.trim(),
                    password: data.password,
                    role: backendRole,
                    ...(role === 'admin' && data.service ? { 
                        service: formatService(data.service)
                    } : {})
                };
                
                console.log('Sending signup payload:', JSON.stringify(payload, null, 2));

                const response = await fetch("http://localhost:8080/api/auth/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                    credentials: 'include',
                    mode: 'cors',
                    body: JSON.stringify(payload),
                });
                
                const responseData = await response.json();
                
                if (!response.ok) {
                    console.error('Backend error:', responseData);
                    throw new Error(responseData.message || 'Signup failed');
                }

                return { 
                    success: true, 
                    message: role === 'admin' 
                        ? "Admin registration request submitted. Please wait for approval." 
                        : "Registration successful! You can now log in.",
                    user: responseData
                };
            } catch (error) {
                console.warn("Backend signup failed, falling back to mock");
            }

            // 2️⃣ Fallback to MOCK SIGNUP
            if (MOCK_USERS.some(user => user.email === data.email)) {
                throw new Error("User with this email already exists");
            }

            // Add to mock users (in memory only)
            const newUser: MockUser = {
                ...data,
                role: data.role || "member" as const,
                approved: false,
                emailVerified: false,
                group: data.group || (data.role === 'admin' ? 'Administrators' : 'Residents')
            };
            MOCK_USERS.push(newUser);

            return {
                success: true,
                message: "Registration successful! Please wait for admin approval."
            };
        } catch (err) {
            console.error(err);
            return {
                success: false,
                message: err instanceof Error ? err.message : "Registration failed. Please try again."
            };
        } finally {
            setIsLoading(false);
        }
    };

    // ---------------- GOOGLE SIGNUP ----------------
    const googleSignup = async (data: { fullName: string; email: string }) => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/oauth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                throw new Error("Google signup failed");
            }
        } catch (error) {
            console.error("Google signup error:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Initialize auth state on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const value: AuthContextType = {
        user,
        login,
        logout,
        signup,
        googleSignup,
        isLoading,
        isAuthenticated,
        token,
        checkAuth,
    };

    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
