/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Check for user in localStorage on initial load
        const checkAuth = () => {
            try {
                const storedUser = localStorage.getItem('rovify-user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error('Failed to parse user from localStorage:', error);
                localStorage.removeItem('rovify-user');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Redirect user based on auth status and current path
    useEffect(() => {
        if (!isLoading) {
            const authPaths = ['/auth/login', '/auth/register', '/auth/forgot-password'];
            const isAuthPath = authPaths.includes(pathname);

            if (!user && !isAuthPath && pathname !== '/') {
                // User not logged in and trying to access protected route
                router.push('/auth/login');
            } else if (user && isAuthPath) {
                // User logged in but on auth page
                router.push('/');
            }
        }
    }, [user, isLoading, pathname, router]);

    const login = async (email: string, password: string) => {
        setIsLoading(true);

        try {
            // In a real app, this would be an API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock user for demo
            const mockUser = {
                id: '1',
                name: 'Alex Rivera',
                email: email,
                image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=987&auto=format&fit=crop'
            };

            setUser(mockUser);
            localStorage.setItem('rovify-user', JSON.stringify(mockUser));
            router.push('/');
        } catch (error) {
            console.error('Login failed:', error);
            throw new Error('Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string) => {
        setIsLoading(true);

        try {
            // In a real app, this would be an API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Registration successful, redirect to login
            router.push('/auth/login');
        } catch (error) {
            console.error('Registration failed:', error);
            throw new Error('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('rovify-user');
        router.push('/auth/login');
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}