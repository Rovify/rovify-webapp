'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Event } from '@/types';
import EventCard from '@/components/EventCard';
import BottomNavigation from '@/components/BottomNavigation';
import Header from '@/components/Header';
import { ThemeProvider, useTheme } from '@/app/provider/ThemeProvider';
import { getUpcomingEvents, getTrendingEvents, getNftEvents } from '@/mocks/data/events';
import { getCurrentUser } from '@/mocks/data/users';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
    FiSearch,
    FiPlus,
    FiCalendar,
    FiTrendingUp,
    FiClock,
    FiChevronRight,
    FiMap,
    FiGlobe,
} from 'react-icons/fi';
import {
    RiNftFill,
    RiFireFill,
    RiVipCrownFill
} from 'react-icons/ri';

// Animated background component with theme awareness
const AnimatedBackground = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            {/* Animated gradient orbs */}
            <div className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full ${isDark ? 'bg-rovify-orange/20' : 'bg-rovify-orange/10'
                } blur-[100px] animate-float`} />
            <div className={`absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full ${isDark ? 'bg-rovify-lavender/20' : 'bg-rovify-lavender/10'
                } blur-[120px] animate-float-reverse`} />
            <div className={`absolute top-3/4 left-1/2 w-[400px] h-[400px] rounded-full ${isDark ? 'bg-rovify-blue/20' : 'bg-rovify-blue/10'
                } blur-[80px] animate-float-slow`} />

            {/* Grid overlay */}
            <div
                className={`absolute inset-0 ${isDark ? 'opacity-20' : 'opacity-10'}`}
                style={{
                    backgroundImage: isDark
                        ? 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)'
                        : 'linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }}
            />
        </div>
    );
};

// Featured Events Carousel with theme support
const FeaturedCarousel = ({ events }: { events: Event[] }) => {
    const [current, setCurrent] = useState(0);
    const autoplayRef = useRef<NodeJS.Timeout | null>(null);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    useEffect(() => {
        autoplayRef.current = setInterval(() => {
            setCurrent(prev => (prev + 1) % events.length);
        }, 5000);

        return () => {
            if (autoplayRef.current) clearInterval(autoplayRef.current);
        };
    }, [events.length]);

    const slideVariants = {
        enter: { opacity: 0, x: 50 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 }
    };

    return (
        <div className="relative h-[40vh] md:h-[50vh] rounded-3xl overflow-hidden shadow-xl">
            <AnimatePresence mode="wait">
                <motion.div
                    key={current}
                    className="absolute inset-0 z-0"
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 z-10 ${isDark
                        ? 'bg-gradient-to-r from-rovify-black/80 via-rovify-black/50 to-transparent'
                        : 'bg-gradient-to-r from-black/60 via-black/40 to-transparent'
                        }`} />
                    <div className={`absolute inset-0 z-10 ${isDark
                        ? 'bg-gradient-to-t from-rovify-black to-transparent'
                        : 'bg-gradient-to-t from-black/70 to-transparent'
                        }`} />

                    {/* Background Image */}
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <Image
                            src={events[current].image}
                            alt={events[current].title}
                            fill
                            className="object-cover scale-105"
                            priority
                        />
                    </div>

                    {/* Hero Content */}
                    <div className="absolute inset-0 z-20 flex flex-col justify-end p-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.4 }}
                            className="mb-6"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 text-white">
                                    {events[current].category === "MUSIC" && <RiFireFill className="text-rovify-orange" />}
                                    {events[current].category === "CONFERENCE" && <FiGlobe className="text-rovify-blue" />}
                                    {events[current].category === "WORKSHOP" && <FiCalendar className="text-rovify-lavender" />}
                                    {events[current].category}
                                </span>
                                {events[current].hasNftTickets && (
                                    <span className="bg-rovify-lavender/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 text-white">
                                        <RiNftFill />
                                        NFT TICKET
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold mb-2 max-w-lg text-white">{events[current].title}</h1>
                            <p className="text-md md:text-lg text-white/80 mb-4 max-w-lg line-clamp-2">
                                {events[current].description}
                            </p>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-2">
                                    <FiCalendar className="text-rovify-orange" />
                                    <span className="text-sm text-white/80">
                                        {new Date(events[current].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiMap className="text-rovify-lavender" />
                                    <span className="text-sm text-white/80">{events[current].location.city}</span>
                                </div>
                            </div>
                            <Link
                                href={`/events/${events[current].id}`}
                                className="group inline-flex items-center bg-gradient-to-r from-rovify-orange to-rovify-lavender hover:opacity-90 transition-all rounded-full px-6 py-2.5 text-white font-medium shadow-lg shadow-rovify-orange/20"
                            >
                                View Event
                                <FiChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Carousel Indicators */}
            <div className="absolute bottom-4 right-4 z-30 flex gap-2">
                {events.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-2 h-2 rounded-full transition-all ${current === index
                            ? 'w-6 bg-gradient-to-r from-rovify-orange to-rovify-lavender'
                            : 'bg-white/30'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

// Inner HomePage component with theme context access
const HomePageContent = () => {
    const [trendingEvents, setTrendingEvents] = useState<Event[]>([]);
    const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
    const [nftEvents, setNftEvents] = useState<Event[]>([]);
    const [currentTab, setCurrentTab] = useState<'all' | 'trending' | 'upcoming' | 'nft'>('all');
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchModalOpen, setSearchModalOpen] = useState(false);

    const [featuredRef, featuredInView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const [eventsRef, eventsInView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const { theme } = useTheme();
    const isDark = theme === 'dark';

    useEffect(() => {
        // Simulate API fetch delay
        const timer = setTimeout(() => {
            setTrendingEvents(getTrendingEvents());
            setUpcomingEvents(getUpcomingEvents());
            setNftEvents(getNftEvents());
            setCurrentUser(getCurrentUser());
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    // Events to display based on selected tab
    const displayEvents =
        currentTab === 'trending' ? trendingEvents :
            currentTab === 'upcoming' ? upcomingEvents :
                currentTab === 'nft' ? nftEvents :
                    [...trendingEvents, ...upcomingEvents.filter(e => !trendingEvents.some(t => t.id === e.id))].slice(0, 10);

    return (
        <div className={`min-h-screen overflow-x-hidden ${isDark ? 'bg-rovify-black text-white' : 'bg-gray-50 text-gray-900'
            }`}>
            {/* Animated Background */}
            <AnimatedBackground />

            {/* Header - Now a separate component */}
            <Header
                currentUser={currentUser}
                isLoading={isLoading}
                onOpenSearch={() => setSearchModalOpen(true)}
            />

            <main className="container mx-auto px-4 py-6 pb-24 mt-16">
                {/* Hero Section */}
                {isLoading ? (
                    <div className={`h-[40vh] md:h-[50vh] rounded-3xl overflow-hidden ${isDark ? 'bg-white/5' : 'bg-gray-200/50'
                        } animate-pulse mb-12`}></div>
                ) : (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-12"
                    >
                        <FeaturedCarousel events={trendingEvents.slice(0, 3)} />
                    </motion.section>
                )}

                {/* Tab Navigation */}
                <motion.section
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                        {[
                            { id: 'all', label: 'All Events', icon: <FiGlobe /> },
                            { id: 'trending', label: 'Trending', icon: <FiTrendingUp /> },
                            { id: 'upcoming', label: 'Upcoming', icon: <FiClock /> },
                            { id: 'nft', label: 'NFT Tickets', icon: <RiNftFill /> }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setCurrentTab(tab.id as any)}
                                className={`px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${currentTab === tab.id
                                    ? 'bg-gradient-to-r from-rovify-orange to-rovify-lavender text-white shadow-lg shadow-rovify-orange/20'
                                    : isDark
                                        ? 'bg-white/10 text-white/80 hover:bg-white/20'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </motion.section>

                {/* Loading State */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className={`h-80 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-gray-200/50'
                                } animate-pulse`}></div>
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Featured Event - Show first trending event */}
                        {currentTab === 'all' && trendingEvents.length > 0 && (
                            <motion.section
                                className="mb-10"
                                ref={featuredRef}
                                initial={{ opacity: 0, y: 20 }}
                                animate={featuredInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.6, delay: 0.3 }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-1 flex items-center">
                                            <RiVipCrownFill className="text-rovify-orange mr-2" />
                                            Featured Event
                                        </h2>
                                        <div className="h-1 w-24 bg-gradient-to-r from-rovify-orange to-rovify-lavender rounded-full"></div>
                                    </div>
                                    <Link
                                        href="/events/featured"
                                        className={`text-sm font-medium ${isDark ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                                            } flex items-center group`}
                                    >
                                        View All
                                        <FiChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                                <EventCard event={trendingEvents[0]} variant="featured" />
                            </motion.section>
                        )}

                        {/* Events Grid */}
                        <motion.section
                            ref={eventsRef}
                            initial={{ opacity: 0, y: 20 }}
                            animate={eventsInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold mb-1 flex items-center">
                                        {currentTab === 'trending' && <FiTrendingUp className="text-rovify-orange mr-2" />}
                                        {currentTab === 'upcoming' && <FiClock className="text-rovify-blue mr-2" />}
                                        {currentTab === 'nft' && <RiNftFill className="text-rovify-lavender mr-2" />}
                                        {currentTab === 'all' && <FiCalendar className="text-rovify-orange mr-2" />}
                                        {currentTab === 'trending' ? 'Trending Now' :
                                            currentTab === 'upcoming' ? 'Upcoming Events' :
                                                currentTab === 'nft' ? 'NFT Tickets' : 'Discover Events'}
                                    </h2>
                                    <div className="h-1 w-24 bg-gradient-to-r from-rovify-orange to-rovify-lavender rounded-full"></div>
                                </div>
                                <Link
                                    href={`/events/${currentTab}`}
                                    className={`text-sm font-medium ${isDark ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                                        } flex items-center group`}
                                >
                                    View All
                                    <FiChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {displayEvents.map((event, index) => (
                                    <motion.div
                                        key={event.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.1 * index }}
                                    >
                                        <EventCard event={event} />
                                    </motion.div>
                                ))}
                            </div>

                            {/* Empty State */}
                            {displayEvents.length === 0 && (
                                <motion.div
                                    className="flex flex-col items-center justify-center py-16 text-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <div className={`mb-4 p-6 rounded-full ${isDark ? 'bg-white/5' : 'bg-gray-100'
                                        } backdrop-blur-md shadow-xl`}>
                                        <FiSearch className={`h-8 w-8 ${isDark ? 'text-rovify-lavender' : 'text-rovify-lavender/70'
                                            }`} />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">No events found</h3>
                                    <p className={`${isDark ? 'text-white/70' : 'text-gray-600'
                                        } mb-6 max-w-md`}>
                                        We couldn&apos;t find any events matching your current selection. Try adjusting your filters or check back later.
                                    </p>
                                    <Link
                                        href="/discover"
                                        className="bg-gradient-to-r from-rovify-orange to-rovify-lavender hover:opacity-90 transition-all rounded-full px-6 py-2.5 text-white font-medium shadow-lg shadow-rovify-orange/20 flex items-center"
                                    >
                                        <FiMap className="mr-2" />
                                        Explore Map
                                    </Link>
                                </motion.div>
                            )}
                        </motion.section>
                    </>
                )}
            </main>

            {/* Create Event Button (Floating) */}
            <div className="fixed bottom-24 right-6 z-40">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
                >
                    <Link
                        href="/create"
                        className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-rovify-orange to-rovify-lavender text-white shadow-lg shadow-rovify-orange/30 hover:shadow-rovify-orange/50 transition-all"
                        aria-label="Create Event"
                    >
                        <FiPlus className="w-6 h-6" />
                    </Link>
                </motion.div>
            </div>

            {/* Enhanced Bottom Navigation - separate component */}
            <BottomNavigation />

            {/* Search Modal */}
            <AnimatePresence>
                {searchModalOpen && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="absolute inset-0 bg-black/70 backdrop-blur-md"
                            onClick={() => setSearchModalOpen(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        ></motion.div>

                        <motion.div
                            className={`${isDark ? 'bg-rovify-black/90 border-white/10' : 'bg-white/90 border-gray-200'
                                } border rounded-2xl w-full max-w-2xl p-4 shadow-2xl relative z-10`}
                            initial={{ scale: 0.9, y: -20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: -20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        >
                            <div className="relative">
                                <FiSearch className={`absolute left-4 top-3.5 ${isDark ? 'text-white/50' : 'text-gray-400'
                                    }`} />
                                <input
                                    type="text"
                                    placeholder="Search events, creators or locations..."
                                    className={`w-full ${isDark
                                        ? 'bg-white/10 border-white/10 text-white placeholder:text-white/50 focus:ring-rovify-lavender/50'
                                        : 'bg-gray-100 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:ring-rovify-lavender/70'
                                        } border rounded-full py-3 pl-11 pr-4 focus:outline-none focus:ring-2`}
                                    autoFocus
                                />
                            </div>

                            <div className="mt-6">
                                <p className={`${isDark ? 'text-white/50' : 'text-gray-500'
                                    } text-sm mb-3`}>Popular Searches</p>
                                <div className="flex flex-wrap gap-2">
                                    {['concerts', 'tech conferences', 'art exhibitions', 'nft events', 'miami', 'this weekend'].map(term => (
                                        <button
                                            key={term}
                                            className={`px-3 py-1.5 rounded-full ${isDark
                                                ? 'bg-white/10 hover:bg-white/20 text-white/90'
                                                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                                                } text-sm transition-colors`}
                                        >
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add custom styles in a style tag for animations */}
            <style jsx global>{`
                @keyframes float {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    50% { transform: translate(-20px, -15px) rotate(5deg); }
                    100% { transform: translate(0, 0) rotate(0deg); }
                }
                
                @keyframes float-reverse {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    50% { transform: translate(20px, 10px) rotate(-5deg); }
                    100% { transform: translate(0, 0) rotate(0deg); }
                }
                
                @keyframes float-slow {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    50% { transform: translate(15px, -10px) rotate(3deg); }
                    100% { transform: translate(0, 0) rotate(0deg); }
                }
                
                .animate-float {
                    animation: float 15s ease-in-out infinite;
                }
                
                .animate-float-reverse {
                    animation: float-reverse 18s ease-in-out infinite;
                }
                
                .animate-float-slow {
                    animation: float-slow 20s ease-in-out infinite;
                }
                
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

// Main component that provides the theme context
export default function HomePage() {
    return (
        <>
            <ThemeProvider>
                <HomePageContent />
            </ThemeProvider>
        </>
    );
}