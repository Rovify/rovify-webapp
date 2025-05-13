// ⚠️ SECURITY NOTICE: 
// This localStorage implementation is NOT secure for production:
// - Vulnerable to XSS attacks (any JS on the page can access tokens)
// - No automatic expiration without manual checks
// - No httpOnly flag support (which would prevent JS access)
// See commented secure implementation below for future reference

const TOKEN_KEY = 'rovify-auth-token';

export const authService = {
    // Check if user is authenticated
    isAuthenticated(): boolean {
        if (typeof window === 'undefined') return false;
        return !!localStorage.getItem(TOKEN_KEY);
    },

    // Get the auth token
    getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(TOKEN_KEY);
    },

    // Set the auth token
    login(token: string): void {
        localStorage.setItem(TOKEN_KEY, token);
    },

    // Remove the auth token
    logout(): void {
        localStorage.removeItem(TOKEN_KEY);
    }
};