'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/utils/auth';

// User type
interface User {
    id: string;
    name?: string;
    email?: string;
    role?: string;
    [key: string]: unknown;
}

interface UseAuthOptions {
    redirectIfAuthenticated?: string;
    redirectIfUnauthenticated?: string;
}

export function useAuth(options: UseAuthOptions = {}) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [user, setUser] = useState<User | null>(null);

    // Check auth status
    const checkAuth = useCallback(() => {
        const authenticated = authService.isAuthenticated();
        setIsAuthenticated(authenticated);

        try {
            const userDataString = localStorage.getItem('rovify-user-data');
            if (userDataString) {
                setUser(JSON.parse(userDataString) as User);
            }
        } catch (e) {
            console.error('Error parsing user data', e);
        }

        setIsLoading(false);
    }, []);

    // login
    const login = useCallback(async (token: string, userData?: User) => {
        authService.login(token);

        // store user data
        if (userData) {
            localStorage.setItem('rovify-user-data', JSON.stringify(userData));
            setUser(userData);
        }

        setIsAuthenticated(true);

        if (options.redirectIfAuthenticated) {
            router.push(options.redirectIfAuthenticated);
        }
    }, [router, options.redirectIfAuthenticated]);

    // logout
    const logout = useCallback(() => {
        authService.logout();
        localStorage.removeItem('rovify-user-data');
        setIsAuthenticated(false);
        setUser(null);

        // Redirect if option is provided
        if (options.redirectIfUnauthenticated) {
            router.push(options.redirectIfUnauthenticated);
        }
    }, [router, options.redirectIfUnauthenticated]);

    // redirect based on auth state
    useEffect(() => {
        if (isLoading) return;

        if (isAuthenticated && options.redirectIfAuthenticated) {
            router.push(options.redirectIfAuthenticated);
        } else if (!isAuthenticated && options.redirectIfUnauthenticated) {
            router.push(options.redirectIfUnauthenticated);
        }
    }, [isAuthenticated, isLoading, router, options]);

    // Init auth check
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return {
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
        checkAuth
    };
}