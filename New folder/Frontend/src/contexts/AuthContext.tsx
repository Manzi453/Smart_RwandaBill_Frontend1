import React, { createContext, useContext, useState } from 'react';

export interface User {
    phone: string;
    id: string;
    fullName: string;
    email: string;
    telephone: string;
    district: string;
    sector: string;
    role: 'superadmin' | 'admin' | 'member';
    service?: 'security' | 'sanitation' | 'water'; // Optional service field for admins
    group: string;
}

interface AuthContextType {
    user: User | null;
    login: (data: { email: string; password: string }) => Promise<void>;
    logout: () => void;
    signup: (data: { fullName: string; email: string; telephone: string; district: string; sector: string; password: string }) => Promise<void>;
    googleSignup: (data: { fullName: string; email: string }) => Promise<void>;
    isLoading: boolean;
    isAuthenticated: boolean;
    token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
    const [isLoading, setIsLoading] = useState(false);

    const login = async (data: { email: string; password: string }) => {
        setIsLoading(true);
        try {
            // Check for default credentials first
            const defaultUsers = {
                'superadmin@example.com': {
                    password: 'admin123',
                    user: {
                        id: '1',
                        fullName: 'Super Admin',
                        email: 'superadmin@example.com',
                        telephone: '+250 123 456 789',
                        district: 'Kigali',
                        sector: 'Gasabo',
                        role: 'superadmin' as const,
                        group: 'System Administrators'
                    }
                },
                'adminwater@example.com': {
                    password: 'admin123',
                    user: {
                        id: '2',
                        fullName: 'Water Admin',
                        email: 'adminwater@example.com',
                        telephone: '+250 123 456 790',
                        district: 'Kigali',
                        sector: 'Nyarugenge',
                        role: 'admin' as const,
                        service: 'water' as const,
                        group: 'Water Department'
                    }
                },
                'adminsanitation@example.com': {
                    password: 'admin123',
                    user: {
                        id: '4',
                        fullName: 'Sanitation Admin',
                        email: 'adminsanitation@example.com',
                        telephone: '+250 123 456 792',
                        district: 'Kigali',
                        sector: 'Kacyiru',
                        role: 'admin' as const,
                        service: 'sanitation' as const,
                        group: 'Sanitation Department'
                    }
                },
                'adminsecurity@example.com': {
                    password: 'admin123',
                    user: {
                        id: '5',
                        fullName: 'Security Admin',
                        email: 'adminsecurity@example.com',
                        telephone: '+250 123 456 793',
                        district: 'Kigali',
                        sector: 'Kimihurura',
                        role: 'admin' as const,
                        service: 'security' as const,
                        group: 'Security Department'
                    }
                },
                'user@example.com': {
                    password: 'user123',
                    user: {
                        id: '3',
                        fullName: 'Regular User',
                        email: 'user@example.com',
                        telephone: '+250 123 456 791',
                        district: 'Kigali',
                        sector: 'Kicukiro',
                        role: 'member' as const,
                        group: 'General Users'
                    }
                }
            };

            if (defaultUsers[data.email] && defaultUsers[data.email].password === data.password) {
                // Use default user
                setUser(defaultUsers[data.email].user);
                setToken('default-token'); // Fake token for default users
                localStorage.setItem('authToken', 'default-token');
                setIsLoading(false);
                return;
            }

            // If not default credentials, proceed with API call
            const response = await fetch('http://localhost:8083/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Login failed');
            }

            const userData = await response.json();

            // Store the token
            if (userData.token) {
                setToken(userData.token);
                localStorage.setItem('authToken', userData.token);
            }

            // Map backend role to frontend role
            const roleMapping: { [key: string]: 'superadmin' | 'admin' | 'member' } = {
                'SUPER_ADMIN': 'superadmin',
                'ADMIN': 'admin',
                'USER': 'member'
            };

            const mappedUser: User = {
                id: userData.id.toString(),
                fullName: userData.fullName,
                email: userData.email,
                phone: userData.telephone || '', // Use telephone as phone
                telephone: userData.telephone || '',
                district: userData.district,
                sector: userData.sector,
                role: roleMapping[userData.role] || 'member',
                group: 'Default Group', // Could be added to backend later
            };

            setUser(mappedUser);

        } catch (error: any) {
            throw new Error(error.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('authToken');
    };

    const signup = async (data: { fullName: string; email: string; telephone: string; district: string; sector: string; password: string }) => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8083/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Signup failed');
            }

            // Signup successful, but don't auto-login
            // User will need to login manually

        } catch (error: any) {
            throw new Error(error.message || "Signup failed");
        } finally {
            setIsLoading(false);
        }
    };

    const googleSignup = async (data: { fullName: string; email: string }) => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8083/api/auth/oauth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Google signup failed');
            }

            // Signup successful, but don't auto-login
            // User will need to login manually

        } catch (error: any) {
            throw new Error(error.message || "Google signup failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, signup, googleSignup, isLoading, isAuthenticated: !!user, token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};