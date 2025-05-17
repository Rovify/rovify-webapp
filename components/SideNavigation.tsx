/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiCompass, FiPlus, FiUser } from 'react-icons/fi';
import { IoTicket } from "react-icons/io5";
import { BsCameraVideoFill, BsController } from "react-icons/bs";
import { MdOutlineAddBox, MdOutlineNotifications } from "react-icons/md";
import { AiOutlineShop } from "react-icons/ai";
import { motion, AnimatePresence } from 'framer-motion';

interface SideNavigationProps {
    isOrganizer?: boolean;
}

export default function SideNavigation({ isOrganizer = false }: SideNavigationProps) {
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState(pathname);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isScrollingUp, setIsScrollingUp] = useState(true);
    const lastScrollY = useRef(0);
    const visibilityTimeout = useRef<NodeJS.Timeout | null>(null);
    const expandTimeout = useRef<NodeJS.Timeout | null>(null);

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

            // Collapse the nav on scroll
            setIsExpanded(false);

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
            if (expandTimeout.current) clearTimeout(expandTimeout.current);
        };
    }, [isScrollingUp]);

    // Update active tab when path changes
    useEffect(() => {
        setActiveTab(pathname);
    }, [pathname]);

    // Handle URL paths where we should hide the navigation
    useEffect(() => {
        // Add paths where side navigation should be hidden
        const hiddenPaths = ['/checkout', '/payment', '/live-event'];
        const shouldHide = hiddenPaths.some(path => pathname.includes(path));

        if (shouldHide) {
            setIsVisible(false);
        }
    }, [pathname]);

    // Handle hover interactions
    const handleMouseEnter = () => {
        if (expandTimeout.current) clearTimeout(expandTimeout.current);
        setIsExpanded(true);
    };

    const handleMouseLeave = () => {
        expandTimeout.current = setTimeout(() => {
            setIsExpanded(false);
        }, 300);
    };

    return (
        <div
            className={`fixed left-5 top-1/2 -translate-y-1/2 z-40 transition-all duration-300 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
                }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Main Navigation Dock */}
            <motion.div
                className="rounded-2xl overflow-hidden backdrop-blur-md bg-white/95 shadow-xl border border-gray-100 flex flex-col items-center py-6 relative"
                animate={{
                    width: isExpanded ? '5rem' : '4rem',
                }}
                transition={{ duration: 0.2 }}
            >
                {/* Glass effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-white/30 pointer-events-none"></div>

                {/* Animated active indicator */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute h-14 w-1 bg-[#FF5722] left-0 rounded-r-md transition-all duration-300"
                            style={{
                                top: activeTab === '/home' ? '10%' :
                                    activeTab.includes('/feed') ? '24%' :
                                        activeTab.includes('/stream') ? '38%' :
                                            activeTab.includes('/marketplace') ? '52%' :
                                                activeTab.includes('/profile') ? '66%' :
                                                    activeTab.includes('/create') ? '80%' : '50%',
                            }}
                        />
                    )}
                </AnimatePresence>

                {/* Home */}
                <NavItem
                    href="/home"
                    icon={<FiHome />}
                    label="Home"
                    isActive={activeTab === '/home'}
                    isExpanded={isExpanded}
                />

                { }
                <NavItem
                    href="/feed"
                    icon={<MdOutlineAddBox />}
                    label="Feed"
                    isActive={activeTab.includes('/feed')}
                    isExpanded={isExpanded}
                />

                {/* Streaming */}
                <NavItem
                    href="/stream"
                    icon={<BsCameraVideoFill />}
                    label="Live"
                    isActive={activeTab.includes('/stream')}
                    isExpanded={isExpanded}
                />

                <NavItem
                    href="/gaming"
                    icon={<BsController />}
                    label="Gaming"
                    isActive={activeTab.includes('/gaming')}
                    isExpanded={isExpanded}
                />

                {/* Tickets */}
                <NavItem
                    href="/marketplace"
                    icon={<AiOutlineShop />}
                    label="Marketplace"
                    isActive={activeTab.includes('/marketplace')}
                    isExpanded={isExpanded}
                />

                {/* Profile */}
                <NavItem
                    href="/profile"
                    icon={<FiUser />}
                    label="Profile"
                    isActive={activeTab.includes('/profile')}
                    isExpanded={isExpanded}
                />

                {/* Create Button - only shown for organizers */}
                {isOrganizer && (
                    <motion.div
                        className="mt-4 relative"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link
                            href="/create"
                            className="relative z-50 group"
                            aria-label="Create new event"
                        >
                            {/* Shadow/glow effect */}
                            <div className="absolute inset-0 rounded-full bg-[#FF5722]/20 blur-md opacity-80 group-hover:opacity-100 transition-opacity"></div>

                            {/* Button bg with gradient */}
                            <div className="relative w-12 h-12 rounded-full bg-gradient-to-r from-[#FF5722] to-[#FF7A50] flex items-center justify-center shadow-lg overflow-hidden group-hover:scale-105 transition-transform">
                                {/* Subtle animated background */}
                                <div className="absolute inset-0 opacity-30">
                                    <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-white/30 animate-pulse"></div>
                                </div>

                                {/* Icon */}
                                <FiPlus className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
                            </div>

                            {/* Label that appears when expanded */}
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -5 }}
                                        className="absolute left-full ml-2 whitespace-nowrap text-xs font-medium text-[#FF5722] bg-white/90 px-2 py-1 rounded-md"
                                    >
                                        Create
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    </motion.div>
                )}
            </motion.div>

            {/* Custom styles */}
            <style jsx global>{`
                @keyframes pulse-glow {
                    0% { box-shadow: 0 0 5px 0px rgba(255, 87, 34, 0.6); }
                    50% { box-shadow: 0 0 12px 4px rgba(255, 87, 34, 0.4); }
                    100% { box-shadow: 0 0 5px 0px rgba(255, 87, 34, 0.6); }
                }
                
                .nav-item-active {
                    animation: pulse-glow 3s infinite ease-in-out;
                }
                
                /* Ensure side content has margin */
                .content-area {
                    margin-left: 5rem;
                }
                
                /* Add parallax effect to dock */
                @media (min-width: 768px) {
                    .side-nav-dock {
                        transform: perspective(1000px) rotateY(5deg);
                        transform-origin: left center;
                        transition: transform 0.3s ease;
                    }
                    
                    .side-nav-dock:hover {
                        transform: perspective(1000px) rotateY(0deg);
                    }
                }
            `}</style>
        </div>
    );
}

// NavItem component to reduce repetition
interface NavItemProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    isExpanded: boolean;
}

function NavItem({ href, icon, label, isActive, isExpanded }: NavItemProps) {
    return (
        <motion.div
            className="my-3 first:mt-0 last:mb-0 relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
        >
            <Link
                href={href}
                className="flex items-center justify-center relative"
            >
                <div className={`p-3 rounded-full transition-all ${isActive
                    ? 'text-[#FF5722] bg-[#FF5722]/10 nav-item-active'
                    : 'text-gray-500 hover:text-[#FF5722] hover:bg-[#FF5722]/5'
                    }`}>
                    <div className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.5]'}`}>
                        {icon}
                    </div>
                </div>

                {/* Label that appears when expanded */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.span
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -5 }}
                            className={`absolute left-full ml-2 whitespace-nowrap text-xs ${isActive ? 'font-medium text-[#FF5722]' : 'text-gray-500'
                                } bg-white/90 px-2 py-1 rounded-md`}
                        >
                            {label}
                        </motion.span>
                    )}
                </AnimatePresence>
            </Link>
        </motion.div>
    );
}