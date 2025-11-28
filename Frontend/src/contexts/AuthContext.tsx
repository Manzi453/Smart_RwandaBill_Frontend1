import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Mock users for development
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
    const [token, setToken] = useState<string | null>(() => {
        if (typeof window !== 'undefined') {
            return sessionStorage.getItem("authToken");
        }
        return null;
    });
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = !!user && !!token;

    // Check if email exists in mock users
    const getUserByEmail = (email: string): MockUser | undefined => {
        return MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    };

    // Generate mock token
    const generateMockToken = (): string => {
        return `mock-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    };

    // Convert mock user to User type
    const mockUserToUser = (mockUser: MockUser): User => {
        return {
            id: `mock-${MOCK_USERS.indexOf(mockUser)}`,
            fullName: mockUser.fullName,
            email: mockUser.email,
            telephone: mockUser.telephone,
            district: mockUser.district,
            sector: mockUser.sector,
            role: mockUser.role,
            service: mockUser.service,
            group: mockUser.group,
            approved: mockUser.approved,
            emailVerified: mockUser.emailVerified,
        };
    };

    // Check auth status on mount
    const checkAuth = async () => {
        const storedToken = typeof window !== 'undefined' ? sessionStorage.getItem("authToken") : null;
        
        if (!storedToken) {
            setUser(null);
            setToken(null);
            setIsLoading(false);
            return;
        }

        // For mock, we just restore the user if token exists
        // In a real app, you'd validate the token here
        setToken(storedToken);
        setIsLoading(false);
    };

    // Login with mock users only
    const login = async (data: { email: string; password: string }) => {
        setIsLoading(true);

        try {
            const mockUser = MOCK_USERS.find(
                (m) => m.email.toLowerCase() === data.email.toLowerCase() && m.password === data.password
            );

            if (!mockUser) {
                throw new Error("Invalid email or password");
            }

            const mockToken = generateMockToken();
            const loggedUser = mockUserToUser(mockUser);

            if (typeof window !== 'undefined') {
                sessionStorage.setItem("authToken", mockToken);
            }
            setToken(mockToken);
            setUser(loggedUser);

            return loggedUser;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Logout
    const logout = () => {
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem("authToken");
        }
        setUser(null);
        setToken(null);
    };

    // Signup with mock users only
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
            // Check if email already exists
            if (getUserByEmail(data.email)) {
                throw new Error("User with this email already exists");
            }

            // Add new user to mock users
            const newMockUser: MockUser = {
                fullName: data.fullName,
                email: data.email,
                telephone: data.telephone,
                district: data.district,
                sector: data.sector,
                password: data.password,
                role: data.role || 'member',
                service: data.service,
                group: data.group || (data.role === 'admin' ? 'Administrators' : 'Residents'),
                approved: data.role === 'member', // Members auto-approved, admins need approval
                emailVerified: true,
            };

            MOCK_USERS.push(newMockUser);

            return {
                success: true,
                message: data.role === 'admin' 
                    ? "Admin registration submitted. Pending approval." 
                    : "Registration successful! You can now log in.",
            };
        } catch (err) {
            console.error(err);
            return {
                success: false,
                message: err instanceof Error ? err.message : "Registration failed. Please try again.",
            };
        } finally {
            setIsLoading(false);
        }
    };

    // Google signup (mock only)
    const googleSignup = async (data: { fullName: string; email: string }) => {
        setIsLoading(true);

        try {
            if (getUserByEmail(data.email)) {
                throw new Error("User with this email already exists");
            }

            const newMockUser: MockUser = {
                fullName: data.fullName,
                email: data.email,
                telephone: "+250700000000",
                district: "Kigali",
                sector: "Gikondo",
                password: "", // No password for OAuth users
                role: "member",
                group: "Residents",
                approved: true,
                emailVerified: true,
            };

            MOCK_USERS.push(newMockUser);
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
