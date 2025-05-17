/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiSearch, FiBell, FiMenu, FiX, FiCalendar, FiMapPin,
    FiClock, FiArrowRight, FiHash, FiBookmark, FiChevronRight,
    FiHome, FiCompass, FiUser, FiHeart, FiMessageSquare,
    FiGlobe, FiWifi, FiZap, FiShield, FiAlertCircle
} from 'react-icons/fi';
import { BsCameraVideoFill, BsMusicNote, BsLightningCharge } from "react-icons/bs";
import { IoTicket } from "react-icons/io5";
import { MdCelebration } from "react-icons/md";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { usePathname } from 'next/navigation';
import { getCurrentUser } from '@/mocks/data/users';
import RoviLogo from '@/public/images/contents/rovi-logo.png';

interface LiveNotification {
    id: string;
    type: 'event' | 'friend' | 'message' | 'like' | 'ticket' | 'reminder' | 'nearby' | 'trending' | 'exclusive';
    content: string;
    timestamp: number;
    actionUrl?: string;
    actionLabel?: string;
}

interface User {
    id: string;
    name: string;
    image: string;
    verified: boolean;
}

interface GeoLocation {
    city: string;
    region: string;
    country: string;
    loading: boolean;
    error: string | null;
}

interface HeaderProps {
    isSidebarExpanded?: boolean;
    onLocationUpdate?: (location: string) => void;
}

export default function Header({ isSidebarExpanded = false, onLocationUpdate }: HeaderProps) {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [activeTab, setActiveTab] = useState('for-you');

    // Geolocation state
    const [userLocation, setUserLocation] = useState<GeoLocation>({
        city: 'Nairobi',
        region: 'Nairobi',
        country: 'KE',
        loading: true,
        error: null
    });

    // Live notification center state
    const [liveNotifications, setLiveNotifications] = useState<LiveNotification[]>([
        {
            id: '1',
            type: 'friend',
            content: 'Chloe just arrived to the party',
            timestamp: Date.now()
        }
    ]);
    const [currentNotificationIndex, setCurrentNotificationIndex] = useState(0);
    const [notificationHovered, setNotificationHovered] = useState(false);
    const notificationIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();

    const notificationsRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLElement>(null);
    const mobileNavRef = useRef<HTMLDivElement>(null);

    // Sample incoming notifications for simulation
    const possibleNotifications: Omit<LiveNotification, 'id' | 'timestamp'>[] = [
        {
            type: 'friend',
            content: 'Chloe just arrived to the party'
        },
        {
            type: 'friend',
            content: 'Alex is now attending Tech Summit 2025'
        },
        {
            type: 'event',
            content: 'Summer Festival 2025 starts in 3 hours',
            actionUrl: '/events/summer-festival-2025',
            actionLabel: 'View Details'
        },
        {
            type: 'message',
            content: 'New message from Sarah about the event',
            actionUrl: '/messages/sarah',
            actionLabel: 'Reply'
        },
        {
            type: 'like',
            content: 'Jamie liked your RSVP to Crypto Meetup'
        },
        {
            type: 'ticket',
            content: 'Your NFT tickets for Neon Nights are ready',
            actionUrl: '/tickets/neon-nights',
            actionLabel: 'View Tickets'
        },
        {
            type: 'event',
            content: 'Startup pitch competition is trending now',
            actionUrl: '/events/startup-pitch',
            actionLabel: 'Get Tickets'
        },
        {
            type: 'reminder',
            content: 'Mindfulness Retreat starts tomorrow',
            actionUrl: '/events/mindfulness-retreat',
            actionLabel: 'Set Reminder'
        },
        {
            type: 'friend',
            content: 'Miguel and 3 others joined Web3 Hackathon'
        },
        {
            type: 'message',
            content: 'Event organizer sent you important details',
            actionUrl: '/messages/organizer',
            actionLabel: 'Read Message'
        },
        {
            type: 'nearby',
            content: 'New jazz event happening near you tonight',
            actionUrl: '/events/jazz-night',
            actionLabel: 'View Event'
        },
        {
            type: 'trending',
            content: 'Crypto Workshop is trending in your area',
            actionUrl: '/events/crypto-workshop',
            actionLabel: 'Learn More'
        },
        {
            type: 'exclusive',
            content: 'Exclusive NFT drop for premium members',
            actionUrl: '/nft/premium-drop',
            actionLabel: 'Claim Now'
        }
    ];

    // Mock notifications data for the dropdown
    const notifications = [
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

    const navigationTabs = [
        { id: 'for-you', label: 'For you', href: '/home' },
        { id: 'nearby', label: 'Nearby', href: '/discover?filter=nearby' },
        { id: 'friends', label: 'Friends', href: '/discover?filter=friends' }
    ];

    // Get browser location
    useEffect(() => {
        const getUserLocation = async () => {
            // First try to get user location via browser geolocation
            if (navigator.geolocation) {
                try {
                    navigator.geolocation.getCurrentPosition(
                        async (position) => {
                            try {
                                // Reverse geocode the coordinates to get city/region
                                const { latitude, longitude } = position.coords;
                                const response = await fetch(
                                    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                                );

                                if (response.ok) {
                                    const data = await response.json();
                                    setUserLocation({
                                        city: data.city || data.locality || 'Unknown',
                                        region: data.principalSubdivision || '',
                                        country: data.countryCode || 'Unknown',
                                        loading: false,
                                        error: null
                                    });

                                    // Pass location up to parent component if needed
                                    if (onLocationUpdate) {
                                        onLocationUpdate(data.city || data.locality || 'Unknown');
                                    }

                                    // Add a location-based notification
                                    const locationNotification = {
                                        id: `location-${Date.now()}`,
                                        type: 'nearby' as const,
                                        content: `Discovered events near ${data.city || data.locality || 'your location'}`,
                                        timestamp: Date.now(),
                                        actionUrl: '/discover?filter=nearby',
                                        actionLabel: 'Explore Nearby'
                                    };

                                    setLiveNotifications(prev => [locationNotification, ...prev]);
                                } else {
                                    fallbackToIPLocation();
                                }
                            } catch (error) {
                                fallbackToIPLocation();
                            }
                        },
                        (error) => {
                            console.log("Geolocation error:", error);
                            fallbackToIPLocation();
                        }
                    );
                } catch (error) {
                    fallbackToIPLocation();
                }
            } else {
                fallbackToIPLocation();
            }
        };

        // Fallback to IP-based geolocation
        const fallbackToIPLocation = async () => {
            try {
                const response = await fetch('https://ipapi.co/json/');
                if (response.ok) {
                    const data = await response.json();
                    setUserLocation({
                        city: data.city || 'Unknown',
                        region: data.region || '',
                        country: data.country_code || 'Unknown',
                        loading: false,
                        error: null
                    });

                    // Pass location up to parent component if needed
                    if (onLocationUpdate) {
                        onLocationUpdate(data.city || 'Unknown');
                    }
                } else {
                    setUserLocation(prev => ({
                        ...prev,
                        loading: false,
                        error: 'Could not determine location'
                    }));
                }
            } catch (error) {
                setUserLocation(prev => ({
                    ...prev,
                    loading: false,
                    error: 'Could not determine location'
                }));
            }
        };

        getUserLocation();
    }, [onLocationUpdate]);

    // Add a simulated notification at random intervals
    useEffect(() => {
        const addRandomNotification = () => {
            const randomIndex = Math.floor(Math.random() * possibleNotifications.length);
            const newNotification = {
                ...possibleNotifications[randomIndex],
                id: `notification-${Date.now()}`,
                timestamp: Date.now()
            };

            // Add to front of the array and limit to 10 notifications
            setLiveNotifications(prev => [newNotification, ...prev].slice(0, 10));

            // Reset to show the newest notification
            setCurrentNotificationIndex(0);
        };

        // Set up timer to add notifications periodically (between 8-20 seconds)
        const setupNextNotification = () => {
            const randomDelay = Math.floor(Math.random() * 12000) + 8000; // 8-20 seconds
            return setTimeout(addRandomNotification, randomDelay);
        };

        const timeout = setupNextNotification();

        return () => clearTimeout(timeout);
    }, [liveNotifications]);

    // Rotate through notifications every few seconds, but pause on hover
    useEffect(() => {
        // Only rotate if we have multiple notifications and not being hovered
        if (liveNotifications.length > 1 && !notificationHovered) {
            notificationIntervalRef.current = setInterval(() => {
                setCurrentNotificationIndex(prev =>
                    prev === liveNotifications.length - 1 ? 0 : prev + 1
                );
            }, 6000); // Show each notification for 6 seconds
        }

        return () => {
            if (notificationIntervalRef.current) {
                clearInterval(notificationIntervalRef.current);
            }
        };
    }, [liveNotifications.length, notificationHovered]);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

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

            if (mobileNavRef.current && !mobileNavRef.current.contains(event.target as Node) &&
                event.target !== document.querySelector('.mobile-menu-button')) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', checkMobile);
            document.removeEventListener('mousedown', handleClickOutside);
            clearTimeout(timer);
            if (notificationIntervalRef.current) {
                clearInterval(notificationIntervalRef.current);
            }
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

    // Get notification icon based on type
    const getNotificationIcon = (type: LiveNotification['type']) => {
        switch (type) {
            case 'event':
                return <FiCalendar className="w-4 h-4 text-blue-500" />;
            case 'friend':
                return <FiUser className="w-4 h-4 text-green-500" />;
            case 'message':
                return <FiMessageSquare className="w-4 h-4 text-purple-500" />;
            case 'like':
                return <FiHeart className="w-4 h-4 text-red-500" />;
            case 'ticket':
                return <IoTicket className="w-4 h-4 text-amber-500" />;
            case 'reminder':
                return <FiClock className="w-4 h-4 text-indigo-500" />;
            case 'nearby':
                return <FiMapPin className="w-4 h-4 text-emerald-500" />;
            case 'trending':
                return <BsLightningCharge className="w-4 h-4 text-orange-500" />;
            case 'exclusive':
                return <MdCelebration className="w-4 h-4 text-violet-500" />;
            default:
                return <FiBell className="w-4 h-4 text-gray-500" />;
        }
    };

    // Get notification background color based on type
    const getNotificationBgColor = (type: LiveNotification['type']) => {
        switch (type) {
            case 'event':
                return 'bg-blue-50 border-blue-100';
            case 'friend':
                return 'bg-green-50 border-green-100';
            case 'message':
                return 'bg-purple-50 border-purple-100';
            case 'like':
                return 'bg-red-50 border-red-100';
            case 'ticket':
                return 'bg-amber-50 border-amber-100';
            case 'reminder':
                return 'bg-indigo-50 border-indigo-100';
            case 'nearby':
                return 'bg-emerald-50 border-emerald-100';
            case 'trending':
                return 'bg-orange-50 border-orange-100';
            case 'exclusive':
                return 'bg-violet-50 border-violet-100';
            default:
                return 'bg-gray-50 border-gray-100';
        }
    };

    // Get notification text color based on type
    const getNotificationTextColor = (type: LiveNotification['type']) => {
        switch (type) {
            case 'event':
                return 'text-blue-700';
            case 'friend':
                return 'text-green-700';
            case 'message':
                return 'text-purple-700';
            case 'like':
                return 'text-red-700';
            case 'ticket':
                return 'text-amber-700';
            case 'reminder':
                return 'text-indigo-700';
            case 'nearby':
                return 'text-emerald-700';
            case 'trending':
                return 'text-orange-700';
            case 'exclusive':
                return 'text-violet-700';
            default:
                return 'text-gray-700';
        }
    };

    // Get notification gradient based on type (for visual flourish)
    const getNotificationGradient = (type: LiveNotification['type']) => {
        switch (type) {
            case 'event':
                return 'from-blue-500/10 to-blue-500/5';
            case 'friend':
                return 'from-green-500/10 to-green-500/5';
            case 'message':
                return 'from-purple-500/10 to-purple-500/5';
            case 'like':
                return 'from-red-500/10 to-red-500/5';
            case 'ticket':
                return 'from-amber-500/10 to-amber-500/5';
            case 'reminder':
                return 'from-indigo-500/10 to-indigo-500/5';
            case 'nearby':
                return 'from-emerald-500/10 to-emerald-500/5';
            case 'trending':
                return 'from-orange-500/10 to-orange-500/5';
            case 'exclusive':
                return 'from-violet-500/10 to-violet-500/5';
            default:
                return 'from-gray-500/10 to-gray-500/5';
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const tabIndicatorPosition = () => {
        if (activeTab === 'for-you') return '16.67%';
        if (activeTab === 'nearby') return '50%';
        return '83.33%';
    };

    // Get the current notification to display
    const currentNotification = liveNotifications[currentNotificationIndex];

    // Format location for display
    const formattedLocation = userLocation.loading
        ? 'Locating...'
        : userLocation.error
            ? 'Location'
            : userLocation.city;

    return (
        <header
            ref={headerRef}
            className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled
                ? 'py-2 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200'
                : 'py-3 bg-white/80 backdrop-blur-sm'
                }`}
        >
            <div className="px-4 sm:px-6 mx-auto flex justify-between items-center">
                {/* Logo and Navigation */}
                <div className="flex items-center gap-6">
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
                        <span className="text-xl font-bold tracking-tight text-gray-900 hidden sm:block">rovify</span>
                    </Link>

                    {/* Desktop Navigation Tabs */}
                    <div className="hidden md:block">
                        <div className="relative flex items-center">
                            {navigationTabs.map((tab) => (
                                <Link
                                    key={tab.id}
                                    href={tab.href}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-5 py-2 text-sm font-medium transition-colors relative ${activeTab === tab.id
                                        ? 'text-gray-900'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {tab.label}
                                </Link>
                            ))}

                            {/* Animated Indicator */}
                            <motion.div
                                className="absolute bottom-0 h-0.5 w-12 bg-[#FF5722] rounded-t-sm"
                                animate={{
                                    left: tabIndicatorPosition(),
                                    translateX: '-50%'
                                }}
                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            />
                        </div>
                    </div>
                </div>

                {/* Advanced Notification Center - Desktop Only */}
                <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-[240px] z-10">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentNotification.id}
                            initial={{ y: -20, opacity: 0, scale: 0.9 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 20, opacity: 0, scale: 0.9 }}
                            transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                                duration: 0.4
                            }}
                            onHoverStart={() => setNotificationHovered(true)}
                            onHoverEnd={() => setNotificationHovered(false)}
                            className={`px-4 py-2 ${getNotificationBgColor(currentNotification.type)} border rounded-xl flex items-center shadow-sm overflow-hidden relative group`}
                        >
                            {/* Subtle background gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-r ${getNotificationGradient(currentNotification.type)} group-hover:opacity-75 transition-opacity`}></div>

                            {/* Icon with glow effect */}
                            <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 relative z-10">
                                <div className="absolute inset-0 rounded-full blur-sm opacity-30 group-hover:opacity-60 transition-opacity" style={{ backgroundColor: getNotificationTextColor(currentNotification.type).replace('text-', 'bg-').replace('-700', '-400') }}></div>
                                <div className="relative">
                                    {getNotificationIcon(currentNotification.type)}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 relative z-10">
                                <span className={`text-sm font-medium ${getNotificationTextColor(currentNotification.type)}`}>
                                    {currentNotification.content}
                                </span>

                                {/* Action button that appears on hover if available */}
                                <AnimatePresence>
                                    {notificationHovered && currentNotification.actionUrl && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 5 }}
                                            transition={{ duration: 0.2 }}
                                            className="mt-1"
                                        >
                                            <Link
                                                href={currentNotification.actionUrl}
                                                className={`text-xs font-medium inline-flex items-center ${getNotificationTextColor(currentNotification.type)}`}
                                            >
                                                {currentNotification.actionLabel || 'View'}
                                                <FiChevronRight className="w-3 h-3 ml-1" />
                                            </Link>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Animated progress bar (only visible when not hovered) */}
                            {!notificationHovered && (
                                <div className="ml-2 w-10 h-1 bg-gray-200 rounded-full overflow-hidden relative z-10">
                                    <motion.div
                                        className="h-full"
                                        style={{ backgroundColor: getNotificationTextColor(currentNotification.type).replace('text-', 'bg-').replace('-700', '-500') }}
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 6, ease: "linear" }}
                                    />
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Notification indicators */}
                    {liveNotifications.length > 1 && (
                        <div className="flex justify-center mt-1 gap-1">
                            {liveNotifications.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-1 h-1 rounded-full ${index === currentNotificationIndex
                                        ? 'bg-gray-600'
                                        : 'bg-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Search Button & Widget */}
                    <div className="relative" ref={searchRef}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/90 border border-gray-200 shadow-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={toggleSearch}
                        >
                            <FiSearch className="w-5 h-5" />
                        </motion.button>

                        {/* Search Widget */}
                        <AnimatePresence>
                            {showSearch && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 top-12 w-screen max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50"
                                >
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

                                        {/* Location-based searches */}
                                        {!userLocation.loading && !userLocation.error && (
                                            <div className="mt-4 pt-3 border-t border-gray-100">
                                                <h3 className="text-sm font-medium text-gray-700 mb-2">Near {userLocation.city}</h3>
                                                <div className="space-y-2">
                                                    <Link
                                                        href={`/discover?location=${userLocation.city}&category=music`}
                                                        className="flex items-center w-full px-3 py-2 rounded-lg hover:bg-gray-50 text-left text-sm text-gray-700 transition-colors"
                                                        onClick={() => setShowSearch(false)}
                                                    >
                                                        <BsMusicNote className="w-4 h-4 mr-2 text-[#FF5722]" />
                                                        <span>Music events in {userLocation.city}</span>
                                                    </Link>
                                                    <Link
                                                        href={`/discover?location=${userLocation.city}&free=true`}
                                                        className="flex items-center w-full px-3 py-2 rounded-lg hover:bg-gray-50 text-left text-sm text-gray-700 transition-colors"
                                                        onClick={() => setShowSearch(false)}
                                                    >
                                                        <RiMoneyDollarCircleLine className="w-4 h-4 mr-2 text-[#FF5722]" />
                                                        <span>Free events near me</span>
                                                    </Link>
                                                    <Link
                                                        href={`/discover?location=${userLocation.city}&filter=this-weekend`}
                                                        className="flex items-center w-full px-3 py-2 rounded-lg hover:bg-gray-50 text-left text-sm text-gray-700 transition-colors"
                                                        onClick={() => setShowSearch(false)}
                                                    >
                                                        <FiCalendar className="w-4 h-4 mr-2 text-[#FF5722]" />
                                                        <span>Events this weekend</span>
                                                    </Link>
                                                </div>
                                            </div>
                                        )}

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
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Location Indicator */}
                    <div className="relative">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`h-10 hidden sm:flex items-center gap-2 px-3 rounded-lg border transition-all duration-200 ${userLocation.loading
                                ? 'bg-gray-50 border-gray-200 text-gray-400'
                                : userLocation.error
                                    ? 'bg-red-50 border-red-100 text-red-600'
                                    : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                                }`}
                        >
                            {userLocation.loading ? (
                                <>
                                    <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
                                    <span className="text-sm font-medium">Locating...</span>
                                </>
                            ) : userLocation.error ? (
                                <>
                                    <FiAlertCircle className="w-4 h-4" />
                                    <span className="text-sm font-medium">Location</span>
                                </>
                            ) : (
                                <>
                                    <FiMapPin className="w-4 h-4" />
                                    <span className="text-sm font-medium">{userLocation.city}</span>
                                </>
                            )}
                        </motion.button>
                    </div>

                    {isLoading ? (
                        <div className="w-10 h-10 rounded-full bg-gray-200 animate-shimmer"></div>
                    ) : currentUser ? (
                        <>
                            {/* Notifications */}
                            <div className="relative" ref={notificationsRef}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={toggleNotifications}
                                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white/90 border border-gray-200 shadow-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <FiBell className="w-5 h-5" />
                                </motion.button>

                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FF5722] text-white text-xs flex items-center justify-center shadow-sm">
                                        {unreadCount}
                                    </span>
                                )}

                                {/* Notifications Widget */}
                                <AnimatePresence>
                                    {showNotifications && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50"
                                        >
                                            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                                <h3 className="font-semibold text-gray-800">Notifications</h3>
                                                <Link href="/notifications" className="text-xs text-[#FF5722] font-medium hover:underline">
                                                    View All
                                                </Link>
                                            </div>

                                            {/* Live Notifications Stream */}
                                            <div className="bg-gray-50 border-b border-gray-100 p-3">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Live Updates</h4>
                                                    <span className="flex items-center text-xs text-green-600">
                                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                                                        Active
                                                    </span>
                                                </div>

                                                <div className="h-16 overflow-hidden relative">
                                                    <AnimatePresence>
                                                        {liveNotifications.slice(0, 3).map((notification, index) => (
                                                            <motion.div
                                                                key={notification.id}
                                                                initial={{ opacity: 0, y: 20 }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    y: index * 22,
                                                                    scale: 1 - (index * 0.05)
                                                                }}
                                                                exit={{ opacity: 0, y: -20 }}
                                                                className={`absolute left-0 right-0 ${index > 0 ? 'pointer-events-none' : ''}`}
                                                                style={{ zIndex: 10 - index }}
                                                            >
                                                                <div className={`flex items-center text-xs py-1 px-2 rounded ${index === 0
                                                                    ? getNotificationBgColor(notification.type)
                                                                    : 'bg-white/80 border border-gray-100'
                                                                    }`}>
                                                                    <span className="w-4 h-4 flex-shrink-0 mr-1.5">
                                                                        {getNotificationIcon(notification.type)}
                                                                    </span>
                                                                    <span className={`truncate ${index === 0
                                                                        ? getNotificationTextColor(notification.type)
                                                                        : 'text-gray-500'
                                                                        }`}>
                                                                        {notification.content}
                                                                    </span>
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </AnimatePresence>
                                                </div>
                                            </div>

                                            {/* Notifications List */}
                                            <div className="max-h-[350px] overflow-y-auto">
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
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* DAO Button */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="hidden sm:block"
                            >
                                <Link href="/dao">
                                    <button className="h-10 px-4 items-center justify-center bg-white/90 border border-gray-200 rounded-lg shadow-sm text-gray-900 hover:bg-gray-50 transition-colors flex">
                                        <span className="font-medium text-sm">DAO</span>
                                    </button>
                                </Link>
                            </motion.div>

                            {/* Connect Wallet Button */}
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="hidden sm:block"
                            >
                                <Link href="/wallet">
                                    <button className="h-10 px-4 items-center justify-center bg-[#FF5722] rounded-lg shadow-sm text-white hover:bg-[#E64A19] transition-colors flex gap-1">
                                        <span className="font-medium text-sm whitespace-nowrap">Connect Wallet</span>
                                    </button>
                                </Link>
                            </motion.div>

                            {/* Mobile Menu Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="mobile-menu-button md:hidden w-10 h-10 rounded-full flex items-center justify-center bg-white/90 border border-gray-200 shadow-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                {isMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
                            </motion.button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors hidden sm:block"
                            >
                                Log In
                            </Link>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href="/signup"
                                    className="bg-[#FF5722] hover:bg-[#E64A19] transition-colors px-4 py-2 rounded-full text-white text-sm font-medium shadow-sm inline-block"
                                >
                                    Sign Up
                                </Link>
                            </motion.div>

                            {/* Mobile Menu Button */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="mobile-menu-button md:hidden w-10 h-10 rounded-full flex items-center justify-center bg-white/90 border border-gray-200 shadow-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                {isMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
                            </motion.button>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Navigation Menu - Enhanced */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        ref={mobileNavRef}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed top-[60px] left-0 right-0 bg-white border-t border-gray-200 shadow-lg rounded-b-xl z-30 overflow-hidden"
                    >
                        {/* Navigation Tabs for Mobile */}
                        <div className="flex justify-between border-b border-gray-100 p-2">
                            {navigationTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        setIsMenuOpen(false);
                                    }}
                                    className={`flex-1 py-2 text-sm font-medium transition-colors ${activeTab === tab.id
                                        ? 'text-[#FF5722] bg-[#FF5722]/5 rounded-lg'
                                        : 'text-gray-600'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="py-3 px-3">
                            {/* Mobile Notification Center */}
                            <div className="mb-4 overflow-hidden">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentNotification.id}
                                        initial={{ x: 50, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -50, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`px-3 py-2 ${getNotificationBgColor(currentNotification.type)} rounded-lg flex items-center mb-2`}
                                    >
                                        <div className="w-6 h-6 rounded-full flex items-center justify-center mr-2">
                                            {getNotificationIcon(currentNotification.type)}
                                        </div>
                                        <span className={`text-sm font-medium ${getNotificationTextColor(currentNotification.type)}`}>
                                            {currentNotification.content}
                                        </span>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* User Location (Mobile Only) */}
                            {!userLocation.loading && !userLocation.error && (
                                <div className="mb-4 bg-emerald-50 border border-emerald-100 rounded-lg p-3 flex items-center">
                                    <FiMapPin className="w-5 h-5 text-emerald-600 mr-2" />
                                    <div>
                                        <div className="text-sm font-medium text-emerald-700">
                                            Events near {userLocation.city}
                                        </div>
                                        <div className="text-xs text-emerald-600">
                                            {userLocation.region}, {userLocation.country}
                                        </div>
                                    </div>
                                    <Link
                                        href={`/discover?location=${userLocation.city}`}
                                        className="ml-auto bg-white rounded-lg px-2 py-1 text-xs font-medium text-emerald-700 border border-emerald-200"
                                    >
                                        Explore
                                    </Link>
                                </div>
                            )}

                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {/* Main Navigation Icons */}
                                <NavButton icon={<FiHome />} label="Home" href="/home" />
                                <NavButton icon={<FiCompass />} label="Explore" href="/discover" />
                                <NavButton icon={<BsCameraVideoFill />} label="Live" href="/streaming" />
                                <NavButton icon={<IoTicket />} label="Tickets" href="/tickets" />
                                <NavButton icon={<FiUser />} label="Profile" href="/profile" />
                                <NavButton icon={<FiBookmark />} label="Saved" href="/saved" />
                            </div>

                            {/* Actions */}
                            <div className="space-y-2 mt-4">
                                <Link href="/dao" onClick={() => setIsMenuOpen(false)}>
                                    <div className="bg-gray-50 hover:bg-gray-100 w-full py-3 px-4 rounded-xl text-gray-900 font-medium text-sm transition-colors flex items-center justify-between">
                                        <span>DAO</span>
                                        <FiChevronRight className="w-4 h-4 text-gray-400" />
                                    </div>
                                </Link>

                                <Link href="/wallet" onClick={() => setIsMenuOpen(false)}>
                                    <div className="bg-[#FF5722]/10 hover:bg-[#FF5722]/15 w-full py-3 px-4 rounded-xl text-[#FF5722] font-medium text-sm transition-colors flex items-center justify-between">
                                        <span>Connect Wallet</span>
                                        <FiChevronRight className="w-4 h-4" />
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.6; }
                }
                
                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                
                /* Content spacing for side navigation */
                @media (min-width: 768px) {
                    .main-content {
                        margin-left: 5rem;
                        padding-top: 4rem;
                    }
                }
                
                /* Mobile content spacing */
                @media (max-width: 767px) {
                    .main-content {
                        padding-top: 4rem;
                        padding-bottom: 5rem; /* Space for mobile bottom nav */
                    }
                }
                
                /* Glassmorphism effects */
                .glass-effect {
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.18);
                }
            `}</style>
        </header>
    );
}

// Helper component for mobile navigation buttons
function NavButton({ icon, label, href }: { icon: React.ReactNode, label: string, href: string }) {
    const pathname = usePathname();
    const isActive = pathname === href || pathname.includes(href);

    return (
        <Link href={href} className="flex flex-col items-center justify-center">
            <div className={`p-3 rounded-xl mb-1 ${isActive
                ? 'bg-[#FF5722]/10 text-[#FF5722]'
                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                } transition-colors`}>
                <div className="w-5 h-5">{icon}</div>
            </div>
            <span className={`text-xs ${isActive ? 'font-medium text-[#FF5722]' : 'text-gray-600'}`}>
                {label}
            </span>
        </Link>
    );
}