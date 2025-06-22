/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiUser, FiCalendar, FiTrendingUp, FiUsers } from 'react-icons/fi';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useBaseAuth } from '@/hooks/useBaseAuth';
import RoviLogo from '@/public/images/contents/rovi-logo.png';
import GoogleIcon from '@/public/images/icons/google-logo.svg';
import BaseIcon from '@/public/images/icons/base-logo.png';
import MetaMaskIcon from '@/public/images/icons/metamask-logo.svg';
import { getOAuthRedirectUri } from '@/utils/env';

// Demo credentials for testing (hidden)
const DEMO_CREDENTIALS = {
    admin: {
        email: 'admin@rovify.io',
        password: 'demo123',
        userData: {
            id: 'adm-demo-001',
            email: 'admin@rovify.io',
            name: 'Marcus Chen',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            authMethod: 'email' as const,
            role: 'admin',
            company: 'Rovify',
        }
    },
    organiser: {
        email: 'organiser@rovify.io',
        password: 'demo123',
        userData: {
            id: 'org-demo-001',
            email: 'organiser@rovify.io',
            name: 'Sarah Johnson',
            image: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
            authMethod: 'email' as const,
            role: 'organiser',
            company: 'EventCorp',
        }
    },
    attendee: {
        email: 'attendee@rovify.io',
        password: 'demo123',
        userData: {
            id: 'att-demo-001',
            email: 'attendee@rovify.io',
            name: 'Alex Rivera',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
            authMethod: 'email' as const,
            role: 'attendee',
            company: 'TechStartup Inc',
        }
    }
};

// Generate a secure random string
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
    const { login } = useAuth();
    const { authenticateWithBase, isLoading: isBaseLoading, error: baseError } = useBaseAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
    const [walletAvailable, setWalletAvailable] = useState(false);

    // Easter egg state
    const [logoClickCount, setLogoClickCount] = useState(0);
    const [showSecretPanel, setShowSecretPanel] = useState(false);
    const [secretSequence, setSecretSequence] = useState<string[]>([]);

    // Store auth challenge state
    const [metaMaskChallenge, setMetaMaskChallenge] = useState('');
    const [oauthState, setOauthState] = useState('');
    const [pkceVerifier, setPkceVerifier] = useState('');

    // OAuth callback handler
    const handleOAuthCallback = useCallback(async (code: string, stateParam: string) => {
        console.log('Processing OAuth callback...');
        setIsLoading(true);
        try {
            const savedState = localStorage.getItem('oauth_state');
            console.log('Verifying OAuth state parameter...');

            if (stateParam !== savedState) {
                console.error('OAuth state mismatch', { received: stateParam, saved: savedState });
                throw new Error('Invalid authentication state');
            }

            console.log('OAuth state verified successfully');
            const verifier = localStorage.getItem('pkce_verifier');
            console.log('Retrieved PKCE verifier');

            if (!verifier) {
                console.error('PKCE verifier missing');
                throw new Error('PKCE verifier missing');
            }

            console.log('Exchanging authorization code for tokens...');
            const redirectUri = getOAuthRedirectUri('google');

            const response = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code,
                    codeVerifier: verifier,
                    redirectUri: redirectUri
                })
            });

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

            login(userData);
            console.log('Google authentication successful, redirecting to home');

            window.history.replaceState({}, document.title, window.location.pathname);
            router.push('/home');
        } catch (error) {
            console.error('OAuth callback error:', error);
            setError(error instanceof Error ? error.message : 'Authentication failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [login, router]);

    // Initialize auth and easter egg detection
    useEffect(() => {
        const initAuth = () => {
            console.log('Initializing login page...');

            if (typeof window !== 'undefined') {
                const hasWallet = !!window.ethereum;
                setWalletAvailable(hasWallet);
                console.log('Wallet available:', hasWallet);

                const hasMetaMask = !!window.ethereum?.isMetaMask;
                setIsMetaMaskInstalled(hasMetaMask);
                console.log('MetaMask available:', hasMetaMask);

                const challenge = generateRandomString();
                setMetaMaskChallenge(challenge);
                console.log('Generated MetaMask challenge');

                const oauthStateValue = generateRandomString();
                setOauthState(oauthStateValue);
                console.log('Generated OAuth state parameter');

                const verifier = generateRandomString(64);
                setPkceVerifier(verifier);
                console.log('Generated PKCE verifier');

                const code = searchParams?.get('code');
                const stateParam = searchParams?.get('state');

                if (code && stateParam) {
                    console.log('OAuth callback parameters detected');
                    handleOAuthCallback(code, stateParam);
                }
            }
        };

        initAuth();

        // Easter egg: Listen for konami code sequence
        const handleKeyPress = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            const newSequence = [...secretSequence, key];

            // Keep only last 10 keys
            if (newSequence.length > 10) newSequence.shift();

            setSecretSequence(newSequence);

            // Check for "demo" sequence
            if (newSequence.join('').includes('demo')) {
                setShowSecretPanel(true);
                setSecretSequence([]);
                // Auto-hide after 10 seconds
                setTimeout(() => setShowSecretPanel(false), 10000);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [searchParams, handleOAuthCallback, secretSequence]);

    // Handle logo click easter egg
    const handleLogoClick = () => {
        const newCount = logoClickCount + 1;
        setLogoClickCount(newCount);

        if (newCount === 7) {
            setShowSecretPanel(true);
            setLogoClickCount(0);
            // Auto-hide after 10 seconds
            setTimeout(() => setShowSecretPanel(false), 10000);
        }

        // Reset count after 3 seconds of no clicking
        setTimeout(() => setLogoClickCount(0), 3000);
    };

    // Handle demo credential login
    const handleDemoLogin = (credType: 'admin' | 'organiser' | 'attendee') => {
        const cred = DEMO_CREDENTIALS[credType];
        setEmail(cred.email);
        setPassword(cred.password);
        setShowSecretPanel(false);
    };

    // Handle email/password login
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Processing email/password login...');
        setIsLoading(true);
        setError('');

        try {
            console.log('Authenticating:', email);

            // Check for demo credentials
            const isAdminDemo = email === DEMO_CREDENTIALS.admin.email && password === DEMO_CREDENTIALS.admin.password;
            const isOrganiserDemo = email === DEMO_CREDENTIALS.organiser.email && password === DEMO_CREDENTIALS.organiser.password;
            const isAttendeeDemo = email === DEMO_CREDENTIALS.attendee.email && password === DEMO_CREDENTIALS.attendee.password;

            if (isAdminDemo || isOrganiserDemo || isAttendeeDemo) {
                const userData = isAdminDemo ? DEMO_CREDENTIALS.admin.userData :
                    isOrganiserDemo ? DEMO_CREDENTIALS.organiser.userData :
                        DEMO_CREDENTIALS.attendee.userData;

                console.log('Demo authentication successful for role:', userData.role);

                // Use AuthContext login with user object for demo accounts
                await login(userData);

                // Role-based routing
                const redirectPath = userData.role === 'admin' ? '/admin-dashboard' :
                    userData.role === 'organiser' ? '/organiser-dashboard' :
                        '/home';

                console.log('Demo login successful, redirecting to:', redirectPath);
                router.push(redirectPath);
            } else {
                // Regular authentication - use email/password login
                console.log('Regular email/password authentication');

                // Use AuthContext login with email and password
                await login(email, password);

                console.log('Regular login successful');
                // AuthContext will handle the redirect automatically to /discover
            }
        } catch (error) {
            console.error('Email login error:', error);
            setError(error instanceof Error ? error.message : 'Invalid email or password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Google login
    const handleGoogleLogin = async () => {
        try {
            console.log('Starting Google authentication...');
            setIsLoading(true);

            localStorage.setItem('pkce_verifier', pkceVerifier);
            console.log('PKCE verifier stored in localStorage');

            const codeChallengeBuffer = await sha256(pkceVerifier);
            const codeChallenge = base64UrlEncode(codeChallengeBuffer);
            console.log('Code challenge generated:', codeChallenge.substring(0, 10) + '...');

            localStorage.setItem('oauth_state', oauthState);
            console.log('OAuth state stored for CSRF protection');

            const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
            if (!clientId) {
                console.error('Google OAuth client ID not found');
                throw new Error('Authentication configuration error');
            }

            const redirectUri = getOAuthRedirectUri('google');
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

            window.location.href = googleOAuthUrl;
        } catch (error) {
            console.error('Google auth error:', error);
            setError(error instanceof Error ? error.message : 'Google authentication failed. Please try again.');
            setIsLoading(false);
        }
    };

    // Handle Base login
    const handleBaseLogin = async () => {
        try {
            const result = await authenticateWithBase('/home');
            if (!result.success && baseError) {
                setError(baseError);
            }
        } catch (error) {
            console.error('Base authentication error:', error);
            setError(error instanceof Error ? error.message : 'Failed to authenticate with Base');
        }
    };

    return (
        <div className="min-h-screen w-full flex relative overflow-hidden">
            {/* Left Column - Branding & Imagery */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#FF5722] via-[#FF7043] to-[#FF8A65] overflow-hidden rounded-tr-3xl rounded-bl-3xl">
                {/* Background decorative elements */}
                <div className="absolute inset-0">
                    {/* Animated gradient orbs */}
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-white/15 rounded-full blur-2xl animate-float-reverse"></div>
                    <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-white/20 rounded-full blur-xl animate-pulse-slow"></div>

                    {/* Geometric patterns */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;0.05&quot;%3E%3Ccircle cx=&quot;30&quot; cy=&quot;30&quot; r=&quot;2&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

                    {/* Hero image overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center items-start p-12 text-white">
                    {/* Logo section */}
                    <div
                        className="flex items-center gap-3 mb-16 cursor-pointer transform transition-all duration-300 hover:scale-105"
                        onClick={handleLogoClick}
                    >
                        <div className="h-10 w-10 bg-white/20 backdrop-blur-lg rounded-tr-xl rounded-bl-xl flex items-center justify-center shadow-2xl overflow-hidden">
                            <Image
                                // src={RoviLogo}
                                src="/images/contents/rovi-logo.png"
                                alt="Rovify Logo"
                                width={28}
                                height={28}
                                className="object-contain"
                            />
                        </div>
                        <span className="text-2xl font-bold">rovify</span>
                    </div>

                    {/* Hero content */}
                    <div className="space-y-10 max-w-lg">
                        <div className="space-y-3">
                            <h1 className="text-2xl font-medium leading-relaxed text-white/95">
                                Streamline event management with
                                <span className="block text-white font-semibold">
                                    modern tools and insights
                                </span>
                            </h1>
                        </div>

                        {/* Features showcase */}
                        <div className="space-y-3">
                            <div className="p-3 bg-white/10 backdrop-blur-lg rounded-tr-xl rounded-bl-xl border border-white/20">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-white/20 rounded-tr-lg rounded-bl-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <FiCalendar className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-white mb-1">For Organisers</h3>
                                        <p className="text-xs text-white/80 leading-relaxed">
                                            Create and manage events with powerful analytics and attendee insights
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 bg-white/10 backdrop-blur-lg rounded-tr-xl rounded-bl-xl border border-white/20">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-white/20 rounded-tr-lg rounded-bl-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <FiUsers className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-white mb-1">For Attendees</h3>
                                        <p className="text-xs text-white/80 leading-relaxed">
                                            Discover events, connect with peers, and enhance your experience
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 bg-white/10 backdrop-blur-lg rounded-tr-xl rounded-bl-xl border border-white/20">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-white/20 rounded-tr-lg rounded-bl-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <FiTrendingUp className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-white mb-1">For Administrators</h3>
                                        <p className="text-xs text-white/80 leading-relaxed">
                                            Monitor platform activity with comprehensive management tools
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Simple tagline */}
                        <div className="pt-4">
                            <p className="text-xs text-white/70 italic">
                                &quot;Trusted by event professionals worldwide&quot;
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 relative overflow-hidden">
                {/* Background elements for mobile/right side */}
                <div className="absolute inset-0 lg:hidden">
                    <div className="absolute top-1/4 -left-24 w-96 h-96 bg-[#FF5722]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
                    <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-[#FF5722]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-reverse"></div>
                </div>

                {/* Mobile logo for small screens */}
                <div className="lg:hidden absolute top-8 left-1/2 transform -translate-x-1/2">
                    <div
                        className="flex items-center gap-3 cursor-pointer transform transition-all duration-300 hover:scale-105"
                        onClick={handleLogoClick}
                    >
                        <div className="h-10 w-10 bg-gradient-to-br from-[#FF5722] to-[#FF8A65] rounded-tr-xl rounded-bl-xl flex items-center justify-center shadow-lg overflow-hidden">
                            <Image
                                // src={RoviLogo}
                                src="/images/contents/rovi-logo.png"
                                alt="Rovify Logo"
                                width={28}
                                height={28}
                                className="object-contain"
                            />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-[#FF5722] to-[#FF8A65] bg-clip-text text-transparent">
                            rovify
                        </span>
                    </div>
                </div>

                {/* Login Form Container */}
                <div className="w-full max-w-md px-6 py-8 lg:px-8 relative z-10 mt-16 lg:mt-0">
                    {/* Form Card */}
                    <div className="bg-white/95 backdrop-blur-xl rounded-tr-3xl rounded-bl-3xl shadow-2xl border border-white/60 p-8 relative overflow-hidden">
                        {/* Card decorations */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-[#FF5722]/8 to-[#FF8A65]/8 rounded-full animate-spin-slow"></div>
                        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-tr from-[#FF7043]/8 to-[#FFAB91]/8 rounded-full animate-spin-reverse"></div>

                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>

                        <div className="relative z-10">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <h1 className="text-2xl font-semibold text-gray-800 mb-2">Welcome to Rovify</h1>
                                <p className="text-gray-500 text-sm">Sign in to access your account</p>
                            </div>

                            {/* Secret Panel (Easter Egg) */}
                            {showSecretPanel && (
                                <div className="mb-6 p-4 bg-gradient-to-r from-slate-50 to-gray-50 border border-gray-200 rounded-tr-2xl rounded-bl-2xl animate-fade-in">
                                    <div className="text-center mb-3">
                                        <div className="text-xs text-gray-600 font-medium">🎭 Demo Access</div>
                                    </div>
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => handleDemoLogin('admin')}
                                            className="w-full flex items-center gap-3 p-3 rounded-tr-xl rounded-bl-xl bg-white hover:bg-purple-50 border border-gray-200 hover:border-purple-200 transition-all duration-200 group"
                                        >
                                            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-tr-lg rounded-bl-lg flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                            </div>
                                            <div className="text-left">
                                                <div className="text-sm font-medium text-gray-800">Admin</div>
                                                <div className="text-xs text-gray-500">admin@rovify.io</div>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => handleDemoLogin('organiser')}
                                            className="w-full flex items-center gap-3 p-3 rounded-tr-xl rounded-bl-xl bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-200 transition-all duration-200 group"
                                        >
                                            <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-tr-lg rounded-bl-lg flex items-center justify-center">
                                                <FiCalendar className="w-3 h-3 text-white" />
                                            </div>
                                            <div className="text-left">
                                                <div className="text-sm font-medium text-gray-800">Organiser</div>
                                                <div className="text-xs text-gray-500">organiser@rovify.io</div>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => handleDemoLogin('attendee')}
                                            className="w-full flex items-center gap-3 p-3 rounded-tr-xl rounded-bl-xl bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-200 transition-all duration-200 group"
                                        >
                                            <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-tr-lg rounded-bl-lg flex items-center justify-center">
                                                <FiUser className="w-3 h-3 text-white" />
                                            </div>
                                            <div className="text-left">
                                                <div className="text-sm font-medium text-gray-800">Attendee</div>
                                                <div className="text-xs text-gray-500">attendee@rovify.io</div>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 text-red-600 rounded-xl border border-red-200 flex items-center animate-shake">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm">{error}</span>
                                </div>
                            )}

                            {/* Login Form */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Email Field */}
                                <div className="group">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 group-focus-within:text-[#FF5722]">
                                            <FiMail className="h-4 w-4 text-gray-400 group-focus-within:text-[#FF5722]" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="premium-input pl-11 pr-4 py-3 w-full rounded-tr-2xl rounded-bl-2xl bg-white/80 backdrop-blur-sm border border-gray-200/80 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-400"
                                            placeholder="Enter email address"
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="group">
                                    <div className="flex justify-between items-center mb-2">
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                            Password
                                        </label>
                                        <Link
                                            href="/auth/forgot-password"
                                            className="text-sm text-[#FF5722] hover:text-[#E64A19] transition-colors duration-300 hover:underline"
                                        >
                                            Forgot Password?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 group-focus-within:text-[#FF5722]">
                                            <FiLock className="h-4 w-4 text-gray-400 group-focus-within:text-[#FF5722]" />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="premium-input pl-11 pr-12 py-3 w-full rounded-tr-2xl rounded-bl-2xl bg-white/80 backdrop-blur-sm border border-gray-200/80 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-400"
                                            placeholder="Enter password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#FF5722] transition-colors duration-300"
                                        >
                                            {showPassword ? (
                                                <FiEyeOff className="h-4 w-4" />
                                            ) : (
                                                <FiEye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Remember Me */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 text-[#FF5722] focus:ring-[#FF5722] border-gray-300 rounded-md transition-colors duration-300"
                                        />
                                        <label htmlFor="remember-me" className="ml-3 text-sm text-gray-600">
                                            Keep me signed in
                                        </label>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading || isBaseLoading}
                                    className="w-full premium-button flex justify-center items-center gap-3 py-3.5 px-6 rounded-tr-2xl rounded-bl-2xl bg-gradient-to-r from-[#FF5722] to-[#FF8A65] text-white font-medium shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-[#FF5722]/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#FF8A65] to-[#FF5722] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative z-10 flex items-center gap-2">
                                        {isLoading || isBaseLoading ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Signing in...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Login</span>
                                                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                                            </>
                                        )}
                                    </div>
                                </button>
                            </form>

                            {/* Social Login */}
                            <div className="mt-6">
                                <div className="relative flex items-center justify-center mb-5">
                                    <div className="border-t border-gray-200 absolute w-full"></div>
                                    <div className="bg-white px-4 relative text-xs text-gray-500 font-medium">
                                        Or continue with
                                    </div>
                                </div>

                                <div className="flex justify-center gap-3">
                                    {/* Google */}
                                    <button
                                        onClick={handleGoogleLogin}
                                        disabled={isLoading || isBaseLoading}
                                        className="premium-social-button flex justify-center items-center w-12 h-12 rounded-tr-2xl rounded-bl-2xl bg-white/90 backdrop-blur-sm border border-gray-200/80 hover:bg-white hover:border-gray-300 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 hover:shadow-md group"
                                    >
                                        <Image
                                            src={GoogleIcon}
                                            alt="Google"
                                            width={20}
                                            height={20}
                                            className="transition-transform duration-300 group-hover:scale-110"
                                        />
                                    </button>

                                    {/* Base */}
                                    {walletAvailable && (
                                        <button
                                            onClick={handleBaseLogin}
                                            disabled={isLoading || isBaseLoading}
                                            className="premium-social-button flex justify-center items-center w-12 h-12 rounded-tr-2xl rounded-bl-2xl bg-white/90 backdrop-blur-sm border border-gray-200/80 hover:bg-white hover:border-gray-300 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 hover:shadow-md group"
                                        >
                                            <Image
                                                src={BaseIcon}
                                                alt="Base"
                                                width={20}
                                                height={20}
                                                className="transition-transform duration-300 group-hover:scale-110"
                                            />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Sign Up Link */}
                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-600">
                                    Don&apos;t have an account?{' '}
                                    <Link
                                        href="/auth/register"
                                        className="font-medium text-[#FF5722] hover:text-[#E64A19] transition-all duration-300 hover:underline"
                                    >
                                        Create an account
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer - Mobile Only */}
                    <div className="lg:hidden mt-8 text-center text-gray-500 text-sm">
                        <div className="flex justify-center space-x-6 mb-3">
                            <Link href="/terms" className="hover:text-gray-700 transition-colors duration-300">Terms</Link>
                            <Link href="/privacy" className="hover:text-gray-700 transition-colors duration-300">Privacy</Link>
                            <Link href="/help" className="hover:text-gray-700 transition-colors duration-300">Help</Link>
                        </div>
                        <div className="opacity-75">
                            © {new Date().getFullYear()} Rovify. All rights reserved.
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Styles */}
            <style jsx global>{`
                .premium-input {
                    box-shadow: 
                        inset 2px 2px 4px rgba(0, 0, 0, 0.05),
                        inset -2px -2px 4px rgba(255, 255, 255, 0.8),
                        0 4px 12px rgba(0, 0, 0, 0.05);
                }
                
                .premium-input:focus {
                    box-shadow: 
                        inset 1px 1px 2px rgba(255, 87, 34, 0.1),
                        inset -1px -1px 2px rgba(255, 255, 255, 0.9),
                        0 0 0 3px rgba(255, 87, 34, 0.1),
                        0 8px 25px rgba(255, 87, 34, 0.15);
                }
                
                .premium-button {
                    box-shadow: 
                        0 8px 32px rgba(255, 87, 34, 0.3),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2);
                }
                
                .premium-button:hover {
                    box-shadow: 
                        0 12px 40px rgba(255, 87, 34, 0.4),
                        inset 0 1px 0 rgba(255, 255, 255, 0.3);
                }
                
                .premium-social-button {
                    box-shadow: 
                        0 4px 12px rgba(0, 0, 0, 0.08),
                        inset 0 1px 0 rgba(255, 255, 255, 0.5);
                }
                
                .premium-social-button:hover {
                    box-shadow: 
                        0 8px 25px rgba(0, 0, 0, 0.12),
                        inset 0 1px 0 rgba(255, 255, 255, 0.7);
                }

                @keyframes float {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(-15px, 15px) rotate(3deg); }
                    66% { transform: translate(8px, -12px) rotate(-2deg); }
                }

                @keyframes float-reverse {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(15px, 12px) rotate(-3deg); }
                    66% { transform: translate(-8px, -15px) rotate(2deg); }
                }

                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.05); }
                }

                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }

                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }

                .animate-float { animation: float 20s ease-in-out infinite; }
                .animate-float-reverse { animation: float-reverse 18s ease-in-out infinite; }
                .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
                .animate-spin-slow { animation: spin-slow 30s linear infinite; }
                .animate-spin-reverse { animation: spin-slow 25s linear infinite reverse; }
                .animate-shimmer { animation: shimmer 3s ease-in-out infinite; }
                .animate-fade-in { animation: fade-in 0.6s ease-out; }
                .animate-shake { animation: shake 0.5s ease-in-out; }
            `}</style>
        </div >
    );
}