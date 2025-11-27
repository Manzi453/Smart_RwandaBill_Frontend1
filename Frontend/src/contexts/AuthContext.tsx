import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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
        role: 'admin' | 'member';
        service?: 'water' | 'sanitation' | 'security';
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
    const [token, setToken] = useState<string | null>(localStorage.getItem("authToken"));
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = !!user && !!token;

    // ---------------- CHECK AUTH (MOCKED) ----------------
    const checkAuth = async () => {
        const currentToken = localStorage.getItem("authToken");
        if (!currentToken) {
            setIsLoading(false);
            return;
        }

        try {
            // Mock user data based on token
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
        } catch (error) {
            console.error("Auth check failed:", error);
            localStorage.removeItem("authToken");
            setUser(null);
            setToken(null);
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
                const response = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    const result = await response.json();
                    localStorage.setItem("authToken", result.token);
                    setToken(result.token);

                    const loggedUser: User = {
                        id: result.id.toString(),
                        fullName: result.fullName,
                        email: result.email,
                        telephone: result.telephone || "+250700000000",
                        district: result.district || "Kigali",
                        sector: result.sector || "Gikondo",
                        role: result.role,
                        service: result.service,
                        group: result.group || "Group A",
                        approved: result.approved ?? true,
                        emailVerified: result.emailVerified ?? true,
                    };

                    setUser(loggedUser);
                    return loggedUser;
                }
            } catch (error) {
                console.warn("Backend login failed, falling back to mock users");
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
    const logout = () => {
        localStorage.removeItem("authToken");
        setUser(null);
        setToken(null);
    };

    // ---------------- SIGNUP (WITH FALLBACK TO MOCK) ----------------
    const signup = async (data: {
        fullName: string;
        email: string;
        telephone: string;
        district: string;
        sector: string;
        password: string;
        role: 'admin' | 'member';
        service?: 'water' | 'sanitation' | 'security';
    }) => {
        setIsLoading(true);
        try {
            // 1️⃣ Attempt BACKEND SIGNUP
            try {
                // Ensure service is only included for admin roles
                const payload = {
                    ...data,
                    service: data.role === 'admin' ? data.service : undefined
                };

                const response = await fetch("/api/auth/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    const error = await response.json().catch(() => ({}));
                    throw new Error(error.message || "Signup failed");
                }

                return { 
                    success: true, 
                    message: "Registration successful! Please wait for admin approval." 
                };
            } catch (error) {
                console.warn("Backend signup failed, falling back to mock");
            }

            // 2️⃣ Fallback to MOCK SIGNUP
            if (MOCK_USERS.some(user => user.email === data.email)) {
                throw new Error("User with this email already exists");
            }

            // Add to mock users (in memory only)
            MOCK_USERS.push({
                ...data,
                role: data.role || "member" as const,
                approved: false,
                emailVerified: false,
                group: data.group || "Group A"
            });

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
