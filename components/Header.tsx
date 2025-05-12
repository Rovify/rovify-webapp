'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiBell, FiSun, FiMoon } from 'react-icons/fi';
import { RiTicket2Line } from 'react-icons/ri';
import { User } from '@/types';
import { useTheme } from '@/app/provider/ThemeProvider';

type HeaderProps = {
    currentUser: User | null;
    isLoading: boolean;
    onOpenSearch: () => void;
};

const Header = ({ currentUser, isLoading, onOpenSearch }: HeaderProps) => {
    const { theme, toggleTheme } = useTheme();
    const [scrollY, setScrollY] = useState(0);
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
    const lastScrollY = useRef(0);
    const scrollThreshold = 5; // More sensitive for smoother transitions
    const themeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Enhanced scroll detection logic
            if (currentScrollY > lastScrollY.current + scrollThreshold) {
                setScrollDirection('down');
            } else if (currentScrollY < lastScrollY.current - scrollThreshold) {
                setScrollDirection('up');
            }

            setScrollY(currentScrollY);
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrollThreshold]);

    const headerBgColor = theme === 'dark'
        ? `rgba(15, 15, 15, ${Math.min(0.4 + (scrollY / 500), 0.85)})`
        : `rgba(255, 255, 255, ${Math.min(0.4 + (scrollY / 500), 0.9)})`;

    const headerBorderColor = theme === 'dark'
        ? `rgba(255, 255, 255, ${Math.min(scrollY / 500, 0.12)})`
        : `rgba(0, 0, 0, ${Math.min(scrollY / 500, 0.08)})`;

    // Box shadow that appears on scroll
    const headerBoxShadow = scrollY > 10
        ? theme === 'dark'
            ? `0 4px 20px rgba(0, 0, 0, ${Math.min(scrollY / 200, 0.3)})`
            : `0 4px 20px rgba(0, 0, 0, ${Math.min(scrollY / 200, 0.1)})`
        : 'none';

    // Compact header state (when significantly scrolled down)
    const isCompact = scrollY > 300;

    // Theme toggle animation
    const handleThemeToggle = () => {
        // Add button press animation
        if (themeButtonRef.current) {
            themeButtonRef.current.classList.add('scale-90');
            setTimeout(() => {
                themeButtonRef.current?.classList.remove('scale-90');
            }, 150);
        }
        toggleTheme();
    };

    return (
        <motion.header
            className="fixed top-0 left-0 right-0 z-50 border-b w-full"
            style={{
                backgroundColor: headerBgColor,
                backdropFilter: `blur(${Math.min(8 + (scrollY / 10), 30)}px)`,
                borderColor: headerBorderColor,
                boxShadow: headerBoxShadow,
                transform: `translateY(${scrollDirection === 'down' && scrollY > 80 ? '-100%' : '0'})`,
                transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s, backdrop-filter 0.3s, border-color 0.3s, box-shadow 0.3s, padding 0.3s'
            }}
        >
            <div className={`container mx-auto px-4 transition-all duration-300 flex justify-between items-center ${isCompact ? 'py-2' : 'py-3'}`}>
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <motion.div
                        className="relative overflow-hidden h-10 w-10 rounded-full bg-gradient-to-br from-rovify-orange to-rovify-lavender flex items-center justify-center shadow-lg shadow-rovify-orange/20 group-hover:shadow-rovify-orange/40 transition-all duration-300"
                        whileHover={{
                            scale: 1.05,
                            rotate: 5,
                            transition: { duration: 0.3, type: "spring", stiffness: 300 }
                        }}
                    >
                        <span className="text-white font-bold text-xl relative z-10">R</span>
                        {/* Animated gradient orbs inside logo */}
                        <div className="absolute top-1/3 left-1/4 w-full h-full rounded-full bg-white/20 blur-sm animate-float opacity-50"></div>
                    </motion.div>
                    <motion.span
                        className={`text-xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                        initial={false}
                        animate={{
                            opacity: isCompact ? 0 : 1,
                            x: isCompact ? -10 : 0,
                            display: isCompact ? 'none' : 'block',
                            transition: { duration: 0.3 }
                        }}
                    >
                        rovify
                    </motion.span>
                </Link>

                {/* Right side of header */}
                <div className="flex items-center gap-4">
                    {/* Theme Toggle Button with improved animation */}
                    <motion.button
                        ref={themeButtonRef}
                        onClick={handleThemeToggle}
                        className={`p-2.5 rounded-full transition-all ${theme === 'dark'
                            ? 'bg-white/10 hover:bg-white/20 text-white'
                            : 'bg-black/5 hover:bg-black/10 text-gray-800'
                            }`}
                        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={theme}
                                initial={{ rotate: -30, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 30, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {theme === 'dark' ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
                            </motion.div>
                        </AnimatePresence>
                    </motion.button>

                    {/* User Menu */}
                    {renderUserMenu(isLoading, currentUser, onOpenSearch, theme, isCompact)}
                </div>
            </div>

            {/* Progress indicator */}
            {scrollY > 100 && (
                <motion.div
                    className="h-0.5 bg-gradient-to-r from-rovify-orange via-rovify-lavender to-rovify-orange bg-size-200 absolute bottom-0 left-0"
                    initial={{ width: '0%' }}
                    animate={{
                        width: `${Math.min((scrollY / (document.body.scrollHeight - window.innerHeight)) * 100, 100)}%`
                    }}
                    transition={{ type: 'spring', bounce: 0 }}
                />
            )}
        </motion.header>
    );
};

// Enhanced helper function to render different user menu states
const renderUserMenu = (
    isLoading: boolean,
    currentUser: User | null,
    onOpenSearch: () => void,
    theme: 'dark' | 'light',
    isCompact: boolean
) => {
    if (isLoading) {
        return (
            <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-full ${theme === 'dark' ? 'bg-white/10' : 'bg-black/5'} animate-pulse`}></div>
                <div className={`h-10 w-10 rounded-full ${theme === 'dark' ? 'bg-white/10' : 'bg-black/5'} animate-pulse`}></div>
            </div>
        );
    }

    if (currentUser) {
        return (
            <>
                <motion.button
                    onClick={onOpenSearch}
                    className={`transition-all rounded-full p-2.5 ${theme === 'dark'
                        ? 'bg-white/10 hover:bg-white/20 text-white'
                        : 'bg-black/5 hover:bg-black/10 text-gray-800'
                        }`}
                    aria-label="Search"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <FiSearch className="h-5 w-5" />
                </motion.button>

                <Link href="/notifications" className="relative">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        className="h-5 w-5 bg-rovify-orange rounded-full absolute -top-1 -right-1 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-rovify-orange/30"
                    >
                        2
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <FiBell className={theme === 'dark' ? 'text-white h-6 w-6' : 'text-gray-800 h-6 w-6'} />
                    </motion.div>
                </Link>

                <Link href="/tickets" className="relative">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
                        className="h-5 w-5 bg-rovify-lavender rounded-full absolute -top-1 -right-1 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-rovify-lavender/30"
                    >
                        3
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <RiTicket2Line className={theme === 'dark' ? 'text-white h-6 w-6' : 'text-gray-800 h-6 w-6'} />
                    </motion.div>
                </Link>

                <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                    <Link
                        href="/profile"
                        className={`overflow-hidden transition-all ${isCompact ? 'h-9 w-9' : 'h-10 w-10'} rounded-full relative`}
                    >
                        {/* Glowing ring effect */}
                        <span
                            className="absolute inset-0 rounded-full bg-gradient-to-r from-rovify-orange via-rovify-lavender to-rovify-orange animate-spin-slow opacity-70"
                            style={{ animationDuration: "8s" }}
                        />

                        <div className={`absolute inset-[2px] rounded-full overflow-hidden z-10`}>
                            <Image
                                src={currentUser.image}
                                alt={currentUser.name}
                                width={40}
                                height={40}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </Link>
                </motion.div>
            </>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                    href="/login"
                    className={`px-4 py-2 text-sm font-medium transition-colors ${theme === 'dark' ? 'text-white hover:text-white/80' : 'text-gray-800 hover:text-gray-600'
                        }`}
                >
                    Log In
                </Link>
            </motion.div>

            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative overflow-hidden rounded-full"
            >
                <span className="absolute inset-0 bg-gradient-to-r from-rovify-orange via-rovify-lavender to-rovify-orange animate-gradient-shift opacity-90" />
                <Link
                    href="/signup"
                    className="relative block bg-gradient-to-r from-rovify-orange to-rovify-lavender hover:opacity-90 transition-colors px-4 py-2 rounded-full text-white text-sm font-medium shadow-lg shadow-rovify-orange/20 hover:shadow-rovify-orange/40"
                >
                    Sign Up
                </Link>
            </motion.div>
        </div>
    );
};

export default Header;