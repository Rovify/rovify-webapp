'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiSearch, FiBell, FiMenu, FiX } from 'react-icons/fi';
import { usePathname } from 'next/navigation';
import { getCurrentUser } from '@/mocks/data/users';
import RoviLogo from '@/public/images/contents/rovi-logo.png';

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    interface User {
        id: string;
        name: string;
        image: string;
        verified: boolean;
    }

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);

        // Fetch current user
        const timer = setTimeout(() => {
            setCurrentUser(getCurrentUser());
            setIsLoading(false);
        }, 1000);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            clearTimeout(timer);
        };
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'py-2 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200'
                : 'py-3 bg-white/80 backdrop-blur-sm'
                }`}
        >
            <div className="container mx-auto px-4 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-10 w-10 bg-[#FF5722] rounded-xl flex items-center justify-center shadow-sm overflow-hidden">
                        <Image
                            src={RoviLogo}
                            alt="Rovify Logo"
                            width={32}
                            height={32}
                            className="object-contain"
                        />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gray-900">rovify</span>
                </Link>

                {/* Navigation Actions */}
                <div className="flex items-center gap-3">
                    <button
                        className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-200 shadow-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => {/* Open search modal */ }}
                    >
                        <FiSearch className="w-5 h-5" />
                    </button>

                    {isLoading ? (
                        <div className="w-10 h-10 rounded-full bg-gray-200 animate-shimmer"></div>
                    ) : currentUser ? (
                        <>
                            <div className="relative">
                                <Link href="/notifications">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-200 shadow-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                        <FiBell className="w-5 h-5" />
                                    </div>
                                </Link>
                                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FF5722] text-white text-xs flex items-center justify-center shadow-sm">
                                    2
                                </span>
                            </div>

                            <Link href="/profile">
                                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#FF5722] shadow-sm transform transition-transform hover:scale-105">
                                    <Image
                                        src={currentUser.image}
                                        alt="Profile"
                                        width={40}
                                        height={40}
                                        className="object-cover"
                                    />
                                </div>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                            >
                                Log In
                            </Link>

                            <Link
                                href="/signup"
                                className="bg-[#FF5722] hover:bg-[#E64A19] transition-colors px-4 py-2 rounded-full text-white text-sm font-medium shadow-sm"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-200 shadow-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-md">
                    <div className="container mx-auto py-4 px-4">
                        <nav className="flex flex-col space-y-2">
                            {[
                                { href: '/', label: 'Home' },
                                { href: '/discover', label: 'Discover' },
                                { href: '/tickets', label: 'Tickets' },
                                { href: '/profile', label: 'Profile' },
                                { href: '/create', label: 'Create Event' }
                            ].map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`px-4 py-2 rounded-lg ${pathname === item.href
                                        ? 'bg-[#FF5722]/10 text-[#FF5722] font-medium'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            )}

            {/* Global Styles */}
            <style jsx global>{`
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                
                .animate-shimmer {
                    background: linear-gradient(
                        90deg,
                        #f0f0f0 25%,
                        #e0e0e0 50%,
                        #f0f0f0 75%
                    );
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                }
            `}</style>
        </header>
    );
}