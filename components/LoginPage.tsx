/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { useRouter, useSearchParams } from 'next/navigation';
import RoviLogo from '@/public/images/contents/rovi-logo.png';
import GoogleIcon from '@/public/images/icons/google-logo.svg';
import MetaMaskIcon from '@/public/images/icons/metamask-logo.svg';

// Define specific types instead of any
type EncryptedData = string;
type StoredUserData = Record<string, unknown>;

// Crypto helper for secure storage
const encryptData = (data: StoredUserData): EncryptedData => {
    // In a production app, use the Web Crypto API for proper encryption
    // This is a simplified version for demonstration
    const encoded = btoa(JSON.stringify(data));
    console.log('Data encrypted for storage');
    return encoded;
};

const decryptData = (encrypted: EncryptedData): StoredUserData | null => {
    try {
        // In a production app, use the Web Crypto API for proper decryption
        const decoded = JSON.parse(atob(encrypted)) as StoredUserData;
        console.log('Data decrypted successfully');
        return decoded;
    } catch (error) {
        console.error('Failed to decrypt data:', error);
        return null;
    }
};

// Auth types
export type AuthUser = {
    id: string;
    email?: string;
    name?: string;
    profilePicture?: string;
    walletAddress?: string;
    authMethod: 'email' | 'google' | 'metamask';
    expiresAt: number;
};

// Auth context
type AuthContextType = {
    user: AuthUser | null;
    isLoading: boolean;
    login: (user: AuthUser) => void;
    logout: () => void;
};

// Create auth context
const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: false,
    login: () => { },
    logout: () => { },
});

// Auth provider component - export for use in _app.tsx or layout.tsx
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Handle login and secure storage of auth data
    const login = useCallback((userData: AuthUser) => {
        // Set in-memory state
        setUser(userData);

        // Log user authentication
        console.log('User authenticated:', {
            id: userData.id,
            authMethod: userData.authMethod,
            email: userData.email || 'N/A',
            walletAddress: userData.walletAddress || 'N/A'
        });

        // Encrypt and store in localStorage
        const encrypted = encryptData(userData);
        localStorage.setItem('rovify_session', encrypted);
        console.log('Auth data saved to localStorage');
    }, []);

    // Handle secure logout
    const logout = useCallback(() => {
        console.log('Logging out user');
        // Clear in-memory state
        setUser(null);

        // Clear storage
        localStorage.removeItem('rovify_session');
        console.log('Session data cleared from localStorage');
    }, []);

    // Initialize auth state from secure storage
    useEffect(() => {
        const initAuth = () => {
            try {
                console.log('Initializing auth state...');
                // Check for encrypted session data in localStorage
                const encryptedSession = localStorage.getItem('rovify_session');
                if (encryptedSession) {
                    console.log('Found existing session, decrypting...');
                    const userData = decryptData(encryptedSession);

                    // Validate session hasn't expired
                    if (userData && typeof userData.expiresAt === 'number') {
                        if (userData.expiresAt > Date.now()) {
                            console.log('Valid session restored:', {
                                authMethod: userData.authMethod,
                                expiresIn: Math.round((userData.expiresAt - Date.now()) / 60000) + ' minutes'
                            });
                            setUser(userData as AuthUser);
                        } else {
                            console.log('Session expired, clearing localStorage');
                            localStorage.removeItem('rovify_session');
                        }
                    }
                } else {
                    console.log('No existing session found');
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                // Clear potentially corrupted session
                localStorage.removeItem('rovify_session');
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();

        // Session timeout handler
        const checkSessionValidity = () => {
            if (user && user.expiresAt < Date.now()) {
                console.log('Session expired during active use, logging out');
                logout();
            }
        };

        // Check session validity every minute
        const interval = setInterval(checkSessionValidity, 60000);
        return () => clearInterval(interval);
    }, [user, logout]); // Added logout to dependencies

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);

// Generate a secure random string (for PKCE and nonce)
const generateRandomString = (length = 32): string => {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Hash string (for PKCE code challenge)
const sha256 = async (plain: string): Promise<ArrayBuffer> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return await window.crypto.subtle.digest('SHA-256', data);
};

// Base64 URL encode from ArrayBuffer
const base64UrlEncode = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    const binString = Array.from(bytes).map(byte => String.fromCharCode(byte)).join('');
    return btoa(binString)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
};

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Use the auth context
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

    // Store auth challenge state
    const [metaMaskChallenge, setMetaMaskChallenge] = useState('');
    const [oauthState, setOauthState] = useState('');
    const [pkceVerifier, setPkceVerifier] = useState('');

    // Define handleOAuthCallback as a useCallback function
    const handleOAuthCallback = useCallback(async (code: string, stateParam: string) => {
        console.log('Processing OAuth callback...');
        setIsLoading(true);
        try {
            // Verify state matches to prevent CSRF
            const savedState = localStorage.getItem('oauth_state');
            console.log('Verifying OAuth state parameter...');

            if (stateParam !== savedState) {
                console.error('OAuth state mismatch', { received: stateParam, saved: savedState });
                throw new Error('Invalid authentication state');
            }

            console.log('OAuth state verified successfully');

            // Get stored PKCE verifier
            const verifier = localStorage.getItem('pkce_verifier');
            console.log('Retrieved PKCE verifier');

            if (!verifier) {
                console.error('PKCE verifier missing');
                throw new Error('PKCE verifier missing');
            }

            // Exchange code for tokens using the backend
            console.log('Exchanging authorization code for tokens...');
            const response = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code,
                    codeVerifier: verifier,
                    redirectUri: window.location.origin + '/auth/callback'
                })
            });

            // Clear oauth session data after exchange
            localStorage.removeItem('oauth_state');
            localStorage.removeItem('pkce_verifier');
            console.log('Cleared OAuth session data from localStorage');

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Token exchange failed:', errorData);
                throw new Error(errorData.message || 'Failed to authenticate with Google');
            }

            const userData = await response.json();
            console.log('User profile retrieved:', {
                id: userData.id,
                email: userData.email,
                name: userData.name
            });

            // Set user data in context
            login(userData);
            console.log('Google authentication successful, redirecting to home');

            // Clean URL and redirect
            window.history.replaceState({}, document.title, window.location.pathname);
            router.push('/');
        } catch (error) {
            console.error('OAuth callback error:', error);
            setError(error instanceof Error ? error.message : 'Authentication failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [login, router]);

    // Check for OAuth callback parameters and handle MetaMask
    useEffect(() => {
        const initAuth = () => {
            console.log('Initializing login page...');

            if (typeof window !== 'undefined') {
                // Check for MetaMask
                const hasMetaMask = !!window.ethereum;
                setIsMetaMaskInstalled(hasMetaMask);
                console.log('MetaMask available:', hasMetaMask);

                // Generate random values for auth security
                const challenge = generateRandomString();
                setMetaMaskChallenge(challenge);
                console.log('Generated MetaMask challenge');

                const oauthStateValue = generateRandomString();
                setOauthState(oauthStateValue);
                console.log('Generated OAuth state parameter');

                // Generate PKCE verifier for Google OAuth
                const verifier = generateRandomString(64);
                setPkceVerifier(verifier);
                console.log('Generated PKCE verifier');

                // Handle OAuth callbacks
                const code = searchParams?.get('code');
                const stateParam = searchParams?.get('state');

                if (code && stateParam) {
                    console.log('OAuth callback parameters detected');
                    handleOAuthCallback(code, stateParam);
                }
            }
        };

        initAuth();
    }, [searchParams, handleOAuthCallback]);

    // Handle email/password login
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Processing email/password login...');
        setIsLoading(true);
        setError('');

        try {
            console.log('Authenticating:', email);

            // In a real app, this would call your authentication API
            // For demo purposes, we'll create a secure user object

            // Simulate API call with artificial delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('Email/password authentication successful');

            // Create secure user object
            const user: AuthUser = {
                id: 'user-' + Math.random().toString(36).substring(2),
                email,
                authMethod: 'email',
                expiresAt: Date.now() + 3600000, // 1 hour from now
            };

            console.log('Email user created:', {
                id: user.id,
                email: user.email
            });

            // Use the context login function
            login(user);
            console.log('Email login successful, redirecting to home');

            // Redirect to home
            router.push('/');
        } catch (error) {
            console.error('Email login error:', error);
            setError('Invalid email or password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Google login (PKCE flow)
    const handleGoogleLogin = async () => {
        try {
            console.log('Starting Google authentication...');
            setIsLoading(true);

            // Generate and store PKCE code verifier
            localStorage.setItem('pkce_verifier', pkceVerifier);
            console.log('PKCE verifier stored in localStorage');

            // Generate code challenge from verifier (SHA-256 hash + base64url encode)
            const codeChallengeBuffer = await sha256(pkceVerifier);
            const codeChallenge = base64UrlEncode(codeChallengeBuffer);
            console.log('Code challenge generated:', codeChallenge.substring(0, 10) + '...');

            // Store OAuth state to prevent CSRF
            localStorage.setItem('oauth_state', oauthState);
            console.log('OAuth state stored for CSRF protection');

            // Get the proper client ID from environment variables
            const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
            if (!clientId) {
                console.error('Google OAuth client ID not found');
                throw new Error('Authentication configuration error');
            }

            // Use consistent redirect URI - this is the key fix
            const redirectUri = `${window.location.origin}/api/auth/callback/google`;
            console.log('Using redirect URI:', redirectUri);

            const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
                `client_id=${clientId}` +
                `&redirect_uri=${encodeURIComponent(redirectUri)}` +
                `&response_type=code` +
                `&scope=openid email profile` +
                `&state=${oauthState}` +
                `&code_challenge=${codeChallenge}` +
                `&code_challenge_method=S256`;

            console.log('Google OAuth URL generated (partial):',
                googleOAuthUrl.substring(0, 100) + '...');

            // Redirect to Google OAuth
            window.location.href = googleOAuthUrl;
        } catch (error) {
            console.error('Google auth error:', error);
            setError(error instanceof Error ? error.message : 'Google authentication failed. Please try again.');
            setIsLoading(false);
        }
    };

    // Handle MetaMask login with challenge-response pattern
    const handleMetaMaskLogin = async () => {
        if (!isMetaMaskInstalled) {
            console.error('MetaMask not installed');
            setError('MetaMask is not installed. Please install MetaMask extension first.');
            return;
        }

        console.log('Starting MetaMask authentication...');
        setIsLoading(true);
        setError('');

        try {
            // Request account access
            console.log('Requesting MetaMask accounts...');
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            if (accounts && accounts.length > 0) {
                const walletAddress = accounts[0];
                console.log('MetaMask wallet connected:', walletAddress);

                // Create a unique challenge message including a nonce
                const message = `Sign this message to authenticate with Rovify: ${metaMaskChallenge}`;
                console.log('Generated challenge message with nonce');

                // Request signature to verify wallet ownership
                console.log('Requesting signature to verify wallet ownership...');
                const signature = await window.ethereum.request({
                    method: 'personal_sign',
                    params: [message, walletAddress]
                });

                // Log signature (partial for security)
                console.log('Signature received:',
                    signature ? signature.toString().substring(0, 10) + '...' : 'null');

                // In a real app, send the address, signature, and challenge to your backend for verification
                if (!signature) {
                    throw new Error('Signature required');
                }

                // Send to backend for verification
                console.log('Verifying signature with backend...');
                const response = await fetch('/api/auth/metamask', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        walletAddress,
                        signature,
                        message
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Signature verification failed');
                }

                // Get user data from response
                const userData = await response.json();
                console.log('MetaMask user created:', {
                    id: userData.id,
                    walletAddress: userData.walletAddress
                });

                // Store in auth context
                login(userData);
                console.log('MetaMask authentication successful, redirecting to home');

                router.push('/');
            } else {
                console.error('No MetaMask accounts found');
                throw new Error('No accounts found');
            }
        } catch (error) {
            console.error('MetaMask login error:', error);
            setError(error instanceof Error ? error.message : 'Failed to connect to MetaMask. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-white to-gray-100 flex items-center justify-center p-4">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-24 w-96 h-96 bg-[#FF5722]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
                <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-[#FF5722]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-reverse"></div>
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
            </div>

            <div className="w-full max-w-md z-10">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-2">
                        <div className="h-10 w-10 bg-[#FF5722] rounded-xl flex items-center justify-center shadow-sm overflow-hidden">
                            <Image
                                src={RoviLogo}
                                alt="Rovify Logo"
                                width={32}
                                height={32}
                                className="object-contain"
                            />
                        </div>
                        <span className="text-2xl font-bold text-[#FF5722]">rovify</span>
                    </div>
                </div>

                {/* Auth card */}
                <div className="glass-card rounded-2xl shadow-xl p-8 border border-white/50 relative overflow-hidden">
                    {/* Card background decoration */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#FF5722]/10 rounded-full"></div>
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#FF5722]/10 rounded-full"></div>

                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h1>
                    <p className="text-gray-500 mb-6">Sign in to your Rovify account</p>

                    {error && (
                        <div className="w-full bg-red-50 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {/* Email field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiMail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="neumorph-input pl-10 pr-4 py-3 w-full rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            {/* Password field */}
                            <div>
                                <div className="flex justify-between mb-1">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                    <Link href="/auth/forgot-password" className="text-sm text-[#FF5722] hover:text-[#E64A19] transition-colors">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiLock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="neumorph-input pl-10 pr-12 py-3 w-full rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                                        placeholder="••••••••"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                        >
                                            {showPassword ? (
                                                <FiEyeOff className="h-5 w-5" />
                                            ) : (
                                                <FiEye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Remember me */}
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-[#FF5722] focus:ring-[#FF5722] rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </label>
                            </div>

                            {/* Submit button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF5722] to-[#FF7A50] text-white font-medium shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign in
                                        <FiArrowRight className="ml-1" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Social logins */}
                    <div className="mt-8">
                        <div className="relative flex items-center justify-center">
                            <div className="border-t border-gray-200 absolute w-full"></div>
                            <div className="bg-white px-4 relative z-10 text-sm text-gray-500">Or continue with</div>
                        </div>

                        <div className="mt-4 flex justify-center gap-3">
                            <button
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                                className="neumorph-button flex justify-center items-center py-2.5 px-6 rounded-xl bg-white hover:bg-gray-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <Image src={GoogleIcon} alt="Google" width={20} height={20} />
                            </button>
                            {/* <button
                                onClick={handleMetaMaskLogin}
                                disabled={isLoading || !isMetaMaskInstalled}
                                className="neumorph-button flex justify-center items-center py-2.5 px-6 rounded-xl bg-white hover:bg-gray-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                title={!isMetaMaskInstalled ? "MetaMask not installed" : "Login with MetaMask"}
                            >
                                <Image src={MetaMaskIcon} alt="MetaMask" width={20} height={20} />
                            </button> */}
                        </div>
                    </div>

                    {/* Sign up link */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            Don&apos;t have an account?{' '}
                            <span className="inline-block ml-2">
                                <Link href="/auth/register" className="font-medium hover:text-[#E64A19]" style={{ color: '#FF5722' }}>
                                    Create an account
                                </Link>
                            </span>
                        </p>
                    </div>
                </div>

                {/* Footer links */}
                <div className="mt-8 text-center text-gray-500 text-sm">
                    <div className="flex justify-center space-x-4">
                        <Link href="/terms" className="hover:text-gray-700">Terms</Link>
                        <Link href="/privacy" className="hover:text-gray-700">Privacy</Link>
                        <Link href="/help" className="hover:text-gray-700">Help</Link>
                    </div>
                    <div className="mt-2">
                        © {new Date().getFullYear()} Rovify. All rights reserved.
                    </div>
                </div>
            </div>

            {/* Custom styles - unchanged */}
            <style jsx global>{`
        .bg-grid-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E");
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .neumorph-input {
          box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.05),
                     inset -2px -2px 5px rgba(255, 255, 255, 0.5);
          transition: all 0.3s ease;
        }

        .neumorph-input:focus {
          box-shadow: inset 1px 1px 2px rgba(0, 0, 0, 0.05),
                     inset -1px -1px 2px rgba(255, 255, 255, 0.5);
        }

        .neumorph-button {
          box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.05),
                     -4px -4px 8px rgba(255, 255, 255, 0.5);
          transition: all 0.3s ease;
        }

        .neumorph-button:active {
          box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.05),
                     inset -2px -2px 4px rgba(255, 255, 255, 0.5);
        }

        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(-20px, 20px) rotate(5deg);
          }
        }

        .animate-float {
          animation: float 15s ease-in-out infinite;
        }

        @keyframes float-reverse {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(20px, 10px) rotate(-5deg);
          }
        }

        .animate-float-reverse {
          animation: float-reverse 15s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
}