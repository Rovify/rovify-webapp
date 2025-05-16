/* eslint-disable @typescript-eslint/no-unused-vars */
// utils/auth.ts
'use client';

// Use the same User interface as in AuthContext
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

const USER_DATA_KEY = 'rovify-user';

export const authService = {
    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        if (typeof window === 'undefined') return false;
        return !!localStorage.getItem(USER_DATA_KEY);
    },

    /**
     * Get the user data
     */
    getUser(): User | null {
        if (typeof window === 'undefined') return null;
        const userData = localStorage.getItem(USER_DATA_KEY);
        if (!userData) return null;

        try {
            const parsedUser = JSON.parse(userData) as User;

            // Validate essential user properties
            if (!parsedUser.id || !parsedUser.authMethod) {
                console.error('🔐 AUTH ERROR: Invalid user data structure');
                this.logout();
                return null;
            }

            return parsedUser;
        } catch (error) {
            console.error('🔐 AUTH ERROR: Failed to parse user data');
            this.logout();
            return null;
        }
    },

    /**
     * Login - store user data
     */
    login(userData: User): void {
        // Ensure required fields are present
        if (!userData.id || !userData.authMethod) {
            console.error('🔐 AUTH ERROR: Missing required user data fields');
            throw new Error('Invalid user data');
        }

        console.log('🔐 AUTH: Storing user data', userData.email || userData.walletAddress || userData.id);
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    },

    /**
     * Logout - remove user data
     */
    logout(): void {
        console.log('🔐 AUTH: Clearing user data');
        localStorage.removeItem(USER_DATA_KEY);
    }
};