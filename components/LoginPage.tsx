/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import RoviLogo from '@/public/images/contents/rovi-logo.png';
import GoogleIcon from '@/public/images/icons/google-logo.svg';
import MetaMaskIcon from '@/public/images/icons/metamask-logo.svg';
import AppleIcon from '@/public/images/icons/apple-logo.svg';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // For demo, we'll just redirect to home
            router.push('/');
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-white to-gray-100 flex items-center justify-center p-4">
            {/* Animated background shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-24 w-96 h-96 bg-[#FF5722]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
                <div className="absolute bottom-1/4 -right-24 w-96 h-96 bg-[#FF5722]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-reverse"></div>

                {/* Grid pattern */}
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
                            <button className="neumorph-button flex justify-center items-center py-2.5 px-6 rounded-xl bg-white hover:bg-gray-50 transition-colors">
                                <Image src={GoogleIcon} alt="Google" width={20} height={20} />
                            </button>
                            <button className="neumorph-button flex justify-center items-center py-2.5 px-6 rounded-xl bg-white hover:bg-gray-50 transition-colors">
                                <Image src={MetaMaskIcon} alt="MetaMask" width={20} height={20} />
                            </button>
                            {/* <button className="neumorph-button flex justify-center items-center py-2.5 px-6 rounded-xl bg-white hover:bg-gray-50 transition-colors">
                                <Image src={AppleIcon} alt="Apple" width={20} height={20} />
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

            {/* Custom styles */}
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