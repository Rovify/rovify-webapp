/**
 * Environment configuration utility for Rovify
 * Handles environment-specific values and ensures consistent URLs
 */

// Define application environments
type Environment = 'development' | 'staging' | 'production';

// Get current environment
export const getEnvironment = (): Environment => {
    // Check for specific environment variables that Next.js sets
    if (process.env.NODE_ENV === 'production') {
        return 'production';
    } else if (process.env.NODE_ENV === 'test') {
        return 'staging';
    }
    return 'development';
};

// Get the correct base URL for the current environment
export const getBaseUrl = (): string => {
    const env = getEnvironment();

    if (typeof window !== 'undefined') {
        // When running in browser, use the current origin
        // This handles preview deployments and custom domains automatically
        return window.location.origin;
    }

    // Server-side or during build time
    switch (env) {
        case 'production':
            return 'https://app.rovify.io';
        case 'staging':
            return 'https://staging.rovify.io';
        default:
            return 'http://localhost:3000';
    }
};

// Get platform-specific OAuth redirect URIs
export const getOAuthRedirectUri = (provider: 'google' | 'base' | 'metamask'): string => {
    const baseUrl = getBaseUrl();

    switch (provider) {
        case 'google':
            return `${baseUrl}/api/auth/callback/google`;
        case 'base':
            return `${baseUrl}/api/auth/callback/base`;
        case 'metamask':
            return `${baseUrl}/api/auth/callback/metamask`;
        default:
            return `${baseUrl}/api/auth/callback/${provider}`;
    }
};

// Get client-side callback page URI
export const getClientCallbackUri = (): string => {
    return `${getBaseUrl()}/auth/callback`;
};