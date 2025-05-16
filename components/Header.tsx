/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiSearch, FiBell, FiMenu, FiX, FiCalendar, FiMapPin, FiClock, FiArrowRight, FiHash, FiBookmark, FiChevronRight } from 'react-icons/fi';
import { usePathname } from 'next/navigation';
import { getCurrentUser } from '@/mocks/data/users';
import RoviLogo from '@/public/images/contents/rovi-logo.png';

interface Notification {
    id: string;
    type: 'event' | 'reminder' | 'message' | 'system';
    title: string;
    content: string;
    image?: string;
    time: string;
    read: boolean;
    link: string;
}

interface User {
    id: string;
    name: string;
    image: string;
    verified: boolean;
}

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();

    const notificationsRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    // Mock notifications data
    const notifications: Notification[] = [
        {
            id: '1',
            type: 'event',
            title: 'New Event Reminder',
            content: 'Tech Summit 2025 starts in 3 days',
            image: '/images/events/tech-summit.jpg',
            time: '2 hours ago',
            read: false,
            link: '/events/tech-summit-2025'
        },
        {
            id: '2',
            type: 'message',
            title: 'New Message',
            content: 'Sarah sent you a message about the Culinary Masterclass',
            time: '1 day ago',
            read: true,
            link: '/messages/sarah'
        },
        {
            id: '3',
            type: 'system',
            title: 'Tickets Confirmed',
            content: 'Your NFT tickets for Neon Nights have been confirmed',
            time: '2 days ago',
            read: false,
            link: '/tickets/neon-nights'
        },
        {
            id: '4',
            type: 'reminder',
            title: 'Event Starting Soon',
            content: 'Mindfulness Retreat starts in 48 hours',
            time: '3 days ago',
            read: true,
            link: '/events/mindfulness-retreat'
        }
    ];

    const recentSearches = [
        'Tech conferences',
        'Music festivals near me',
        'Cooking workshops',
        'Weekend events'
    ];

    const popularCategories = [
        { name: 'Music', icon: <FiHash /> },
        { name: 'Tech', icon: <FiHash /> },
        { name: 'Art', icon: <FiHash /> },
        { name: 'Wellness', icon: <FiHash /> },
        { name: 'Free Events', icon: <FiHash /> },
        { name: 'This Weekend', icon: <FiCalendar /> }
    ];

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

        // Handle clicks outside of notification and search widgets
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }

            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearch(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
            clearTimeout(timer);
        };
    }, []);

    const toggleNotifications = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowNotifications(!showNotifications);
        // Close search when opening notifications
        if (!showNotifications) {
            setShowSearch(false);
        }
    };

    const toggleSearch = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowSearch(!showSearch);
        // Close notifications when opening search
        if (!showSearch) {
            setShowNotifications(false);
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Implement search here
            console.log('Searching for:', searchQuery);
            // For demo, we'll just close the search widget
            setShowSearch(false);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

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
                    {/* Search Button & Widget */}
                    <div className="relative" ref={searchRef}>
                        <button
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-200 shadow-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={toggleSearch}
                        >
                            <FiSearch className="w-5 h-5" />
                        </button>

                        {/* Search Widget */}
                        {showSearch && (
                            <div className="absolute right-0 top-12 w-screen max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-fade-in">
                                <div className="p-4">
                                    <form onSubmit={handleSearchSubmit}>
                                        <div className="relative mb-4">
                                            <input
                                                type="text"
                                                placeholder="Search events, venues, categories..."
                                                className="w-full py-3.5 pl-12 pr-4 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF5722] focus:border-transparent transition-all text-gray-700"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                autoFocus
                                            />
                                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                <FiSearch className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </form>

                                    {/* Recent Searches */}
                                    {recentSearches.length > 0 && (
                                        <div className="mb-4">
                                            <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Searches</h3>
                                            <div className="space-y-2">
                                                {recentSearches.map((search, index) => (
                                                    <button
                                                        key={index}
                                                        className="flex items-center w-full px-3 py-2 rounded-lg hover:bg-gray-50 text-left text-sm text-gray-700 transition-colors"
                                                        onClick={() => {
                                                            setSearchQuery(search);
                                                        }}
                                                    >
                                                        <FiClock className="w-4 h-4 mr-2 text-gray-400" />
                                                        <span>{search}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Popular Categories */}
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">Popular Categories</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            {popularCategories.map((category, index) => (
                                                <Link
                                                    href={`/discover?category=${category.name.toLowerCase()}`}
                                                    key={index}
                                                    className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700 transition-colors"
                                                    onClick={() => setShowSearch(false)}
                                                >
                                                    <span className="w-6 h-6 flex items-center justify-center text-[#FF5722] mr-2">
                                                        {category.icon}
                                                    </span>
                                                    {category.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Advanced Search Link */}
                                    <div className="mt-4 pt-3 border-t border-gray-100">
                                        <Link
                                            href="/search"
                                            className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium text-[#FF5722] transition-colors"
                                            onClick={() => setShowSearch(false)}
                                        >
                                            Advanced Search
                                            <FiArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="w-10 h-10 rounded-full bg-gray-200 animate-shimmer"></div>
                    ) : currentUser ? (
                        <>
                            {/* Notifications */}
                            <div className="relative" ref={notificationsRef}>
                                <button
                                    onClick={toggleNotifications}
                                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-200 shadow-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <FiBell className="w-5 h-5" />
                                </button>

                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FF5722] text-white text-xs flex items-center justify-center shadow-sm">
                                        {unreadCount}
                                    </span>
                                )}

                                {/* Notifications Widget */}
                                {showNotifications && (
                                    <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-fade-in">
                                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                            <h3 className="font-semibold text-gray-800">Notifications</h3>
                                            <Link href="/notifications" className="text-xs text-[#FF5722] font-medium hover:underline">
                                                View All
                                            </Link>
                                        </div>

                                        {/* Notifications List */}
                                        <div className="max-h-[400px] overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="p-6 text-center">
                                                    <p className="text-gray-500 text-sm">No notifications yet</p>
                                                </div>
                                            ) : (
                                                <div>
                                                    {notifications.map((notification) => (
                                                        <Link
                                                            href={notification.link}
                                                            key={notification.id}
                                                            className={`block px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-orange-50' : ''}`}
                                                            onClick={() => setShowNotifications(false)}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <div className={`w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 ${!notification.read ? 'bg-[#FF5722]/10' : ''}`}>
                                                                    {notification.type === 'event' && <FiCalendar className="w-5 h-5 text-[#FF5722]" />}
                                                                    {notification.type === 'message' && <FiMapPin className="w-5 h-5 text-[#FF5722]" />}
                                                                    {notification.type === 'system' && <FiBookmark className="w-5 h-5 text-[#FF5722]" />}
                                                                    {notification.type === 'reminder' && <FiClock className="w-5 h-5 text-[#FF5722]" />}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-medium text-gray-900 truncate">{notification.title}</p>
                                                                    <p className="text-sm text-gray-600 line-clamp-2">{notification.content}</p>
                                                                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                                                </div>
                                                                {!notification.read && (
                                                                    <span className="w-2 h-2 rounded-full bg-[#FF5722] flex-shrink-0 mt-2"></span>
                                                                )}
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="p-3 bg-gray-50 border-t border-gray-100">
                                            <button className="w-full py-2 px-4 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors text-center">
                                                Mark All as Read
                                            </button>
                                        </div>
                                    </div>
                                )}
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
                                { href: '/home', label: 'Home' },
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
                
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out forwards;
                }
                
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </header>
    );
}