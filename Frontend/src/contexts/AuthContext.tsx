import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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

// ------------------ MOCKED USERS ------------------
const MOCK_USERS = [
    {
        email: "superadmin@example.com",
        password: "admin123",
        role: "superadmin",
        fullName: "Super Administrator",
        service: undefined,
    },
    {
        email: "adminwater@example.com",
        password: "admin123",
        role: "admin",
        service: "water",
        fullName: "Water Admin",
    },
    {
        email: "adminsanitation@example.com",
        password: "admin123",
        role: "admin",
        service: "sanitation",
        fullName: "Sanitation Admin",
    },
    {
        email: "adminsecurity@example.com",
        password: "admin123",
        role: "admin",
        service: "security",
        fullName: "Security Admin",
    },
    {
        email: "user@example.com",
        password: "user123",
        role: "member",
        fullName: "Regular User",
        service: undefined,
    },
];

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("authToken"));
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = !!user && !!token;

    // ---------------- CHECK AUTH (TOKEN VALIDATION) ----------------
    const checkAuth = async () => {
        const currentToken = localStorage.getItem("authToken");
        if (!currentToken) {
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/me", {
                headers: {
                    Authorization: `Bearer ${currentToken}`,
                },
            });

            if (!res.ok) throw new Error("Auth check failed");

            const userData = await res.json();
            setUser({
                ...userData,
                approved: userData.approved ?? true,
                emailVerified: userData.emailVerified ?? true,
            });
        } catch (error) {
            logout();
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    // ---------------- HANDLE LOGIN (MOCK + BACKEND) ----------------
    const login = async (data: { email: string; password: string }) => {
        setIsLoading(true);

        try {
            // 1️⃣ Attempt BACKEND LOGIN
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
                    telephone: result.telephone,
                    district: result.district,
                    sector: result.sector,
                    role: result.role,
                    service: result.service,
                    group: "",
                    approved: result.approved ?? true,
                    emailVerified: result.emailVerified ?? true,
                };

                setUser(loggedUser);
                return loggedUser;
            }

            // 2️⃣ If backend fails → fallback to MOCK USERS
            const mock = MOCK_USERS.find(
                (m) => m.email === data.email && m.password === data.password
            );

            if (mock) {
                const mockUser: User = {
                    id: "mock-" + mock.email,
                    fullName: mock.fullName,
                    email: mock.email,
                    telephone: "N/A",
                    district: "N/A",
                    sector: "N/A",
                    role: mock.role as User["role"],
                    service: mock.service as "security" | "sanitation" | "water" | undefined,
                    group: "",
                    approved: true,
                    emailVerified: true,
                };

                // Create a fake token
                const fakeToken = "mock-token-" + Date.now();
                localStorage.setItem("authToken", fakeToken);
                setToken(fakeToken);
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
        setToken(null);
        setUser(null);
    };

    // ---------------- SIGNUP ----------------
    const signup = async (data: {
        fullName: string;
        email: string;
        telephone: string;
        district: string;
        sector: string;
        password: string;
    }) => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const json = await response.json();

            if (!response.ok) {
                throw new Error(json.message || "Signup failed");
            }

            return { success: true, message: "Signup successful. Await approval." };
        } catch (err) {
            return {
                success: false,
                message: err instanceof Error ? err.message : "Unknown error",
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

            if (!res.ok) throw new Error("Google signup failed");
        } finally {
            setIsLoading(false);
        }
    };

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
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};
