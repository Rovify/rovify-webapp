/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, JSX } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/utils/auth';

// Updated User interface with optional properties
interface User {
    id: string;
    name?: string;          // Made optional
    email?: string;         // Made optional
    image?: string;
    walletAddress?: string;
    baseName?: string;
    ethName?: string;
    authMethod: 'email' | 'password' | 'google' | 'base'; // Required enum
    [key: string]: unknown;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (emailOrUser: string | User, password?: string) => Promise<void>;
    loginWithWallet: (userData: User) => Promise<void>;
    logout: () => void;
    register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper for public paths - keep this in sync with router configuration
function isPublicPath(pathname: string): boolean {
    return pathname === '/' ||
        pathname.startsWith('/auth/') ||
        pathname.startsWith('/forbidden/') ||
        pathname.startsWith('/maintenance/') ||
        pathname.startsWith('/terms') ||
        pathname.startsWith('/privacy') ||
        pathname.startsWith('/help') ||
        pathname.startsWith('/api/');
}

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const router = useRouter();
    const pathname = usePathname();

    // Initialize auth state from localStorage
    useEffect(() => {
        console.log('🔐 AUTH: Initializing auth state');

        try {
            const userData = authService.getUser();

            if (userData) {
                // Ensure userData conforms to User interface
                if (userData.id && userData.authMethod) {
                    setUser(userData);
                    setIsAuthenticated(true);
                    console.log('🔐 AUTH: User authenticated', userData.email || userData.walletAddress || userData.id);
                } else {
                    console.error('🔐 AUTH ERROR: Invalid user data format');
                    authService.logout();
                    setIsAuthenticated(false);
                }
            } else {
                setUser(null);
                setIsAuthenticated(false);
                console.log('🔐 AUTH: No authenticated user');
            }
        } catch (error) {
            console.error('🔐 AUTH ERROR: Authentication check failed');
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
            console.log('🔐 AUTH: Initialization complete');
        }
    }, []);

    // Handle routing based on auth status
    useEffect(() => {
        if (isLoading) return;

        const authPaths = ['/auth/login', '/auth/register', '/auth/forgot-password'];
        const isAuthPath = authPaths.includes(pathname);

        console.log(`🔐 AUTH: Navigation check - Path: ${pathname}, Auth path: ${isAuthPath}, User: ${isAuthenticated ? 'Logged in' : 'Not logged in'}`);

        if (!isAuthenticated && !isAuthPath && !isPublicPath(pathname)) {
            console.log('🔐 AUTH: Redirecting unauthenticated user to login from', pathname);
            router.push('/auth/login');
        } else if (isAuthenticated && isAuthPath) {
            console.log('🔐 AUTH: Redirecting authenticated user');
            router.push('/discover');
        }
    }, [isAuthenticated, isLoading, pathname, router]);

    // Combined login function that handles both credential and wallet logins
    const login = async (emailOrUser: string | User, password?: string): Promise<void> => {
        // Handle wallet-based login (User object provided)
        if (typeof emailOrUser !== 'string') {
            return loginWithWallet(emailOrUser);
        }

        // Traditional email/password login
        const email = emailOrUser;
        if (!password) {
            throw new Error('Password is required for email login');
        }

        console.log('🔐 AUTH: Login attempt for', email);
        setIsLoading(true);

        try {
            // In a real app, this would be an API call
            console.log('🔐 AUTH: Making login API call');
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock user for demo - ensuring all required fields are present
            const mockUser: User = {
                id: '1',
                name: 'Alex Rivera',
                email: email,
                authMethod: 'email',
                image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=987&auto=format&fit=crop'
            };

            // Store user data
            authService.login(mockUser);

            // Update state
            setUser(mockUser);
            setIsAuthenticated(true);
            console.log('🔐 AUTH: Login successful');

            // Navigate to main page
            router.push('/discover');
        } catch (error) {
            console.error('🔐 AUTH ERROR: Login failed');
            throw new Error('Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    // Separate function for wallet-based login
    const loginWithWallet = async (userData: User): Promise<void> => {
        console.log(`🔐 AUTH: Wallet login attempt for ${userData.walletAddress || 'unknown wallet'}`);
        setIsLoading(true);

        try {
            // Make sure we have essential user data
            if (!userData.id || !userData.authMethod) {
                throw new Error('Invalid user data for wallet login');
            }

            // Store the user data
            authService.login(userData);

            // Update state
            setUser(userData);
            setIsAuthenticated(true);
            console.log('🔐 AUTH: Wallet login successful');

            // Navigate to main page (don't redirect here, let the calling code handle it)
            // router.push('/discover');
        } catch (error) {
            console.error('🔐 AUTH ERROR: Wallet login failed', error);
            throw new Error('Wallet authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string): Promise<void> => {
        console.log('🔐 AUTH: Register attempt for', email);
        setIsLoading(true);

        try {
            // In a real app, this would be an API call
            console.log('🔐 AUTH: Making registration API call');
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log('🔐 AUTH: Registration successful');
            // Registration successful, redirect to login
            router.push('/auth/login');
        } catch (error) {
            console.error('🔐 AUTH ERROR: Registration failed');
            throw new Error('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const logout = (): void => {
        console.log('🔐 AUTH: Logging out user', user?.email || user?.walletAddress || user?.id);

        authService.logout();
        setUser(null);
        setIsAuthenticated(false);

        console.log('🔐 AUTH: User logged out, redirecting to login');
        router.push('/auth/login');
    };

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            isAuthenticated,
            login,
            loginWithWallet,
            logout,
            register
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}