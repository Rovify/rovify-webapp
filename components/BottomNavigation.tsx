'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiCompass, FiPlus, FiUser } from 'react-icons/fi';

export default function BottomNavigation() {
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState(pathname);
    const [isVisible, setIsVisible] = useState(true);
    const [isScrollingUp, setIsScrollingUp] = useState(true);
    const lastScrollY = useRef(0);
    const visibilityTimeout = useRef<NodeJS.Timeout | null>(null);

    // Track scroll direction to hide/show the navigation
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Determine if scrolling up or down
            setIsScrollingUp(currentScrollY < lastScrollY.current);

            // Auto-hide on scroll down, show on scroll up
            if (currentScrollY > 150) {
                setIsVisible(isScrollingUp);
            } else {
                setIsVisible(true);
            }

            // Store current position for next comparison
            lastScrollY.current = currentScrollY;

            // Reset timeout to show navigation after scrolling stops
            if (visibilityTimeout.current) clearTimeout(visibilityTimeout.current);

            visibilityTimeout.current = setTimeout(() => {
                setIsVisible(true);
            }, 2000);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (visibilityTimeout.current) clearTimeout(visibilityTimeout.current);
        };
    }, [isScrollingUp]);

    // Update active tab when path changes
    useEffect(() => {
        setActiveTab(pathname);
    }, [pathname]);

    // Check if keyboard is open (mostly for mobile)
    useEffect(() => {
        const checkKeyboard = () => {
            const viewportHeight = window.visualViewport?.height || window.innerHeight;
            const windowHeight = window.innerHeight;

            // If the viewport is significantly smaller than window height, keyboard might be open
            if (windowHeight - viewportHeight > 150) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
        };

        window.visualViewport?.addEventListener('resize', checkKeyboard);
        return () => window.visualViewport?.removeEventListener('resize', checkKeyboard);
    }, []);

    // Handle URL paths where we should hide the navigation
    useEffect(() => {
        // Add paths where bottom navigation should be hidden
        const hiddenPaths = ['/checkout', '/payment', '/live-event'];
        const shouldHide = hiddenPaths.some(path => pathname.includes(path));

        if (shouldHide) {
            setIsVisible(false);
        }
    }, [pathname]);

    return (
        <div
            className={`fixed bottom-5 left-0 right-0 z-40 px-3 flex justify-center transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                }`}
        >
            {/* Main Navigation Bar */}
            <div className="w-full max-w-md rounded-2xl overflow-hidden backdrop-blur-md bg-white/95 shadow-lg border border-gray-100 flex justify-around relative">
                {/* Animated indicator */}
                <div
                    className="absolute h-1 w-16 bg-[#FF5722] top-0 rounded-b-md transition-all duration-300"
                    style={{
                        left: activeTab === '/' ? '10%' :
                            activeTab.includes('/discover') ? '30%' :
                                activeTab.includes('/tickets') ? '70%' :
                                    activeTab.includes('/profile') ? '90%' : '50%',
                        transform: 'translateX(-50%)',
                    }}
                />

                {/* Home */}
                <Link
                    href="/"
                    className="flex flex-col items-center justify-center py-3 w-full relative"
                >
                    <div className={`p-2 rounded-full transition-all ${activeTab === '/'
                        ? 'text-[#FF5722] bg-[#FF5722]/10'
                        : 'text-gray-500 hover:text-[#FF5722] hover:bg-[#FF5722]/5'
                        }`}>
                        <FiHome className={`w-5 h-5 ${activeTab === '/home' ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
                    </div>
                    <span className={`text-xs mt-1 ${activeTab === '/home' ? 'font-medium text-[#FF5722]' : 'text-gray-500'}`}>
                        Home
                    </span>
                </Link>

                {/* Discover */}
                <Link
                    href="/discover"
                    className="flex flex-col items-center justify-center py-3 w-full relative"
                >
                    <div className={`p-2 rounded-full transition-all ${activeTab.includes('/discover')
                        ? 'text-[#FF5722] bg-[#FF5722]/10'
                        : 'text-gray-500 hover:text-[#FF5722] hover:bg-[#FF5722]/5'
                        }`}>
                        <FiCompass className={`w-5 h-5 ${activeTab.includes('/discover') ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
                    </div>
                    <span className={`text-xs mt-1 ${activeTab.includes('/discover') ? 'font-medium text-[#FF5722]' : 'text-gray-500'}`}>
                        Explore
                    </span>
                </Link>

                <div className="w-full py-3">
                    <div className="h-14"></div>
                </div>

                {/* Tickets */}
                <Link
                    href="/tickets"
                    className="flex flex-col items-center justify-center py-3 w-full relative"
                >
                    <div className={`p-2 rounded-full transition-all ${activeTab.includes('/tickets')
                        ? 'text-[#FF5722] bg-[#FF5722]/10'
                        : 'text-gray-500 hover:text-[#FF5722] hover:bg-[#FF5722]/5'
                        }`}>
                        <FiCompass className={`w-5 h-5 ${activeTab.includes('/tickets') ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
                    </div>
                    <span className={`text-xs mt-1 ${activeTab.includes('/tickets') ? 'font-medium text-[#FF5722]' : 'text-gray-500'}`}>
                        Tickets
                    </span>
                </Link>

                {/* Profile */}
                <Link
                    href="/profile"
                    className="flex flex-col items-center justify-center py-3 w-full relative"
                >
                    <div className={`p-2 rounded-full transition-all ${activeTab.includes('/profile')
                        ? 'text-[#FF5722] bg-[#FF5722]/10'
                        : 'text-gray-500 hover:text-[#FF5722] hover:bg-[#FF5722]/5'
                        }`}>
                        <FiUser className={`w-5 h-5 ${activeTab.includes('/profile') ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
                    </div>
                    <span className={`text-xs mt-1 ${activeTab.includes('/profile') ? 'font-medium text-[#FF5722]' : 'text-gray-500'}`}>
                        Profile
                    </span>
                </Link>
            </div>

            {/* Elevated Create Button */}
            <Link
                href="/create"
                className={`absolute z-50 top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 group ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                    } transition-all duration-300`}
                aria-label="Create new event"
            >
                {/* Shadow/glow effect */}
                <div className="absolute inset-0 rounded-full bg-[#FF5722]/20 blur-md opacity-80 group-hover:opacity-100 transition-opacity"></div>

                {/* Button bg with gradient */}
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-[#FF5722] to-[#FF7A50] flex items-center justify-center shadow-lg overflow-hidden group-hover:scale-105 transition-transform">
                    {/* Subtle animated background */}
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-white/30 animate-pulse"></div>
                    </div>

                    {/* Icon */}
                    <FiPlus className="w-8 h-8 text-white group-hover:rotate-90 transition-transform duration-300" />
                </div>

                {/* Tap effect */}
                <div className="tap-effect"></div>
            </Link>

            {/* Custom styles */}
            <style jsx global>{`
        /* Animation for the tap effect */
        @keyframes ripple {
          to { transform: scale(4); opacity: 0; }
        }
        
        .tap-effect::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 5px;
          height: 5px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 0;
          border-radius: 100%;
          transform: scale(1) translate(-50%, -50%);
          transform-origin: 50% 50%;
        }
        
        .tap-effect:active::after {
          animation: ripple 0.6s ease-out;
          opacity: 0.3;
        }
        
        /* Ensure bottom content has padding */
        .content-area {
          padding-bottom: calc(5rem + env(safe-area-inset-bottom));
        }
      `}</style>
        </div>
    );
}