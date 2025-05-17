/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import type { Event } from "@/types";
import EventCard from "@/components/EventCard";
import EventCardSkeleton from "@/components/skeletons/EventCardSkeleton";
import Header from "@/components/Header";
import SideNavigation from "@/components/SideNavigation";
import { getUpcomingEvents, getTrendingEvents, getNftEvents } from "@/mocks/data/events";
import { getCurrentUser } from "@/mocks/data/users";
import {
    FiChevronRight, FiTrendingUp, FiClock, FiCalendar, FiTarget, FiHeart, FiMapPin,
    FiDollarSign, FiSearch, FiArrowRight, FiPlus, FiStar, FiUsers, FiTag,
    FiNavigation, FiX, FiLoader, FiCheck, FiAlertCircle
} from "react-icons/fi";
import {
    BsDroplet, BsLightningCharge, BsBuilding, BsTree, BsFlag, BsWater,
    BsDoorOpen, BsUmbrella, BsHouseDoor, BsMusicNote, BsBrush,
    BsCameraVideo, BsGlobe, BsGem
} from "react-icons/bs";
import { FaMountainSun } from "react-icons/fa6";
import { IoGameControllerOutline, IoTicketOutline } from "react-icons/io5";
import { GiPartyPopper } from "react-icons/gi";
import MapView from "./MapViewPage";

// Types
interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    verified?: boolean;
    followers?: number;
    bio?: string;
}

interface Creator extends User {
    verified: boolean;
    followers: number;
    bio: string;
}

interface Coordinates {
    latitude: number;
    longitude: number;
}

type LocationStatus = 'idle' | 'loading' | 'success' | 'error' | 'denied';

type CategoryType =
    | "amazing-pools"
    | "icons"
    | "bed-breakfast"
    | "countryside"
    | "golfing"
    | "lakefront"
    | "rooms"
    | "amazing-views"
    | "beachfront"
    | "cabins"
    | "music"
    | "art"
    | "games"
    | "health"
    | "tech";
type FilterType = "all" | "trending" | "upcoming" | "nft";

// Category configuration with proper icons
const CATEGORIES = [
    { id: "amazing-pools", label: "Amazing pools", icon: BsDroplet },
    { id: "music", label: "Music", icon: BsMusicNote },
    { id: "bed-breakfast", label: "Bed & breakfasts", icon: BsHouseDoor },
    { id: "countryside", label: "Countryside", icon: BsTree },
    { id: "golfing", label: "Golfing", icon: BsFlag },
    { id: "lakefront", label: "Lakefront", icon: BsWater },
    { id: "rooms", label: "Rooms", icon: BsDoorOpen },
    { id: "amazing-views", label: "Amazing views", icon: FaMountainSun },
    { id: "beachfront", label: "Beachfront", icon: BsUmbrella },
    { id: "cabins", label: "Cabins", icon: BsBuilding },
    { id: "art", label: "Art", icon: BsBrush },
    { id: "tech", label: "Tech", icon: BsLightningCharge },
    { id: "games", label: "Gaming", icon: IoGameControllerOutline },
    { id: "streaming", label: "Streaming", icon: BsCameraVideo },
];

// Filter configuration
const FILTERS = [
    { id: "all", label: "All Events", icon: FiCalendar },
    { id: "trending", label: "Trending Now", icon: FiTrendingUp },
    { id: "upcoming", label: "Upcoming", icon: FiClock },
    { id: "nft", label: "NFT Tickets", icon: FiTarget },
];

// Mock featured creators
const FEATURED_CREATORS: Creator[] = [
    {
        id: "1",
        name: "Olivia Martinez",
        email: "olivia@example.com",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=100&q=80",
        verified: true,
        followers: 42500,
        bio: "Music producer & event organizer"
    },
    {
        id: "2",
        name: "Marcus Chen",
        email: "marcus@example.com",
        avatarUrl: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=100&q=80",
        verified: true,
        followers: 31200,
        bio: "NFT artist & festival creator"
    },
    {
        id: "3",
        name: "Sarah Johnson",
        email: "sarah@example.com",
        avatarUrl: "https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=100&q=80",
        verified: true,
        followers: 27800,
        bio: "Tech conference organizer"
    }
];

// Custom hook for location detection
const useGeolocation = () => {
    const [location, setLocation] = useState<string>("");
    const [status, setStatus] = useState<LocationStatus>('idle');
    const [coordinates, setCoordinates] = useState<Coordinates | null>(null);

    const requestGeolocation = useCallback(() => {
        if (!navigator.geolocation) {
            setStatus('error');
            setLocation("Unknown location");
            return;
        }

        setStatus('loading');

        navigator.geolocation.getCurrentPosition(
            async position => {
                try {
                    setCoordinates({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });

                    // Reverse geocoding using free Nominatim API (OpenStreetMap)
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
                    );

                    if (!response.ok) throw new Error('Geocoding failed');

                    const data = await response.json();

                    // Extract the city/town, or locality
                    const locationName = data.address.city ||
                        data.address.town ||
                        data.address.village ||
                        data.address.suburb ||
                        data.address.county ||
                        "Your area";

                    setLocation(locationName);
                    setStatus('success');
                } catch (error) {
                    console.error('Error getting location name:', error);
                    setLocation("Your area");
                    setStatus('success'); // Still mark as success since we have coordinates
                }
            },
            error => {
                console.error('Geolocation error:', error);
                if (error.code === error.PERMISSION_DENIED) {
                    setStatus('denied');
                } else {
                    setStatus('error');
                }
                setLocation("Unknown location");
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    }, []);

    useEffect(() => {
        requestGeolocation();
    }, [requestGeolocation]);

    return { location, coordinates, status, requestGeolocation };
};

// Filter button component with enhanced animation
const FilterButton = ({
    icon: Icon,
    label,
    isActive,
    onClick,
    isLoading = false,
    hasError = false,
}: {
    icon: React.ElementType;
    label: string;
    isActive: boolean;
    onClick: () => void;
    isLoading?: boolean;
    hasError?: boolean;
}) => (
    <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
            px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 
            transition-all duration-200 whitespace-nowrap shadow-sm
            ${isActive
                ? "bg-[#FF5722] text-white"
                : hasError
                    ? "bg-red-50 text-red-600 border border-red-200"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }
        `}
    >
        {isLoading ? (
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
                <FiLoader className="w-4 h-4" />
            </motion.div>
        ) : hasError ? (
            <FiAlertCircle className="w-4 h-4" />
        ) : (
            <Icon className="w-4 h-4" />
        )}
        {label}

        {isActive && !isLoading && !hasError && (
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-1 w-1.5 h-1.5 bg-white rounded-full"
            />
        )}
    </motion.button>
);

// Category button component with enhanced animation
const CategoryButton = ({
    icon: Icon,
    label,
    isActive,
    onClick,
}: {
    icon: React.ElementType;
    label: string;
    isActive: boolean;
    onClick: () => void;
}) => (
    <motion.button
        onClick={onClick}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.95 }}
        className={`
            flex flex-col items-center gap-1 px-4 py-2 transition-all duration-200
            ${isActive ? "opacity-100" : "opacity-70 hover:opacity-100"}
        `}
    >
        <motion.div
            className={`p-3 rounded-lg ${isActive ? "bg-[#FF5722]/10 text-[#FF5722]" : "bg-gray-100 text-gray-600"}`}
            animate={isActive ? {
                boxShadow: ["0px 0px 0px rgba(255, 87, 34, 0)", "0px 0px 8px rgba(255, 87, 34, 0.3)", "0px 0px 0px rgba(255, 87, 34, 0)"],
            } : {}}
            transition={isActive ? {
                repeat: Infinity,
                duration: 2,
                repeatType: "reverse"
            } : {}}
        >
            <Icon className="w-5 h-5" />
        </motion.div>
        <span className="text-xs font-medium whitespace-nowrap">{label}</span>
        {isActive && (
            <motion.div
                layoutId="categoryIndicator"
                className="h-0.5 w-8 bg-[#FF5722] rounded-full mt-1"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
        )}
    </motion.button>
);

// Section header component with animation
const SectionHeader = ({
    title,
    viewAllLink,
}: {
    title: string;
    viewAllLink?: string;
}) => (
    <div className="flex items-center justify-between mb-6">
        <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold"
        >
            {title}
        </motion.h2>

        {viewAllLink && (
            <Link href={viewAllLink} className="group">
                <motion.div
                    whileHover={{ x: 3 }}
                    className="text-sm font-medium text-[#FF5722] flex items-center"
                >
                    See all
                    <motion.div
                        className="ml-1"
                        animate={{ x: [0, 3, 0] }}
                        transition={{
                            repeat: Infinity,
                            repeatType: "mirror",
                            duration: 1.5,
                            ease: "easeInOut",
                            repeatDelay: 0.5
                        }}
                    >
                        <FiChevronRight />
                    </motion.div>
                </motion.div>
            </Link>
        )}
    </div>
);

// Creator card component with enhanced animation
const CreatorCard = ({ creator }: { creator: Creator }) => (
    <Link href={`/creator/${creator.id}`}>
        <motion.div
            whileHover={{ y: -4, backgroundColor: "#FAFAFA" }}
            className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white transition-colors shadow-sm mb-2"
        >
            <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image
                        src={creator.avatarUrl || ""}
                        alt={creator.name}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                    />
                </div>
                {creator.verified && (
                    <motion.div
                        className="absolute -right-1 -bottom-1 bg-blue-500 text-white rounded-full p-0.5 border-2 border-white"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: [0.8, 1.1, 0.9, 1], rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 0.5 }}
                    >
                        <FiStar className="w-3 h-3" />
                    </motion.div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{creator.name}</p>
                <p className="text-xs text-gray-500 truncate">{creator.bio}</p>
                <div className="flex items-center mt-1">
                    <FiUsers className="w-3 h-3 text-gray-400 mr-1" />
                    <p className="text-xs text-gray-500">
                        {creator.followers >= 1000
                            ? `${(creator.followers / 1000).toFixed(1)}k`
                            : creator.followers} followers
                    </p>
                </div>
            </div>
        </motion.div>
    </Link>
);

export default function HomePage() {
    // Event data state
    const [trendingEvents, setTrendingEvents] = useState<Event[]>([]);
    const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
    const [nftEvents, setNftEvents] = useState<Event[]>([]);
    const [currentFilter, setCurrentFilter] = useState<FilterType>("all");
    const [currentCategory, setCurrentCategory] = useState<CategoryType | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isOrganizer, setIsOrganizer] = useState(false);
    const [showLocationPrompt, setShowLocationPrompt] = useState(false);
    const [isMapOpen, setIsMapOpen] = useState(false);

    const coordinates = {
        latitude: -1.9441,
        longitude: 30.0619,
    };

    // Get user's location using our custom hook
    const { location, status: locationStatus, requestGeolocation } = useGeolocation();

    // Refs
    const categoryRef = useRef<HTMLDivElement>(null);
    const mainRef = useRef<HTMLDivElement>(null);

    // Parallax effects
    const { scrollY } = useScroll();
    const bannerParallax = useTransform(scrollY, [0, 300], [0, -50]);
    const categoryParallax = useTransform(scrollY, [0, 300], [0, -20]);

    // Banner data with enhanced image paths and gradients
    const banners = [
        {
            id: "summer-fest",
            title: "Summer Festival 2025",
            subtitle: "Experience the ultimate music weekend",
            image: "/images/banners/summer-fest.jpg",
            gradient: "from-purple-600 to-indigo-800",
            cta: "Get Tickets"
        },
        {
            id: "tech-summit",
            title: "Web3 Tech Summit",
            subtitle: "Connect with innovators and builders",
            image: "/images/banners/tech-summit.jpg",
            gradient: "from-blue-600 to-cyan-600",
            cta: "Register Now"
        },
        {
            id: "art-exhibition",
            title: "Digital Art Exhibition",
            subtitle: "NFT showcase by top artists",
            image: "/images/banners/art-exhibition.jpg",
            gradient: "from-orange-500 to-red-600",
            cta: "View Collection"
        }
    ];

    const [currentBanner, setCurrentBanner] = useState(0);

    // Current banner data
    const activeBanner = banners[currentBanner];

    // Handle scroll for categories
    const scrollCategories = (direction: 'left' | 'right') => {
        if (categoryRef.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            categoryRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Simulate API fetch
                const timer = setTimeout(() => {
                    setTrendingEvents(getTrendingEvents());
                    setUpcomingEvents(getUpcomingEvents());
                    setNftEvents(getNftEvents());
                    setCurrentUser(getCurrentUser());
                    setIsLoading(false);
                }, 1500);

                return () => clearTimeout(timer);
            } catch (error) {
                console.error("Error fetching data:", error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Banner rotation with enhanced timing
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBanner(prev => (prev + 1) % banners.length);
        }, 8000); // Slightly longer for better user experience

        return () => clearInterval(interval);
    }, [banners.length]);

    // Events to display based on selected filter
    const getEventsForFilter = () => {
        switch (currentFilter) {
            case "trending":
                return trendingEvents;
            case "upcoming":
                return upcomingEvents;
            case "nft":
                return nftEvents;
            default:
                return [...trendingEvents, ...upcomingEvents.filter((e) => !trendingEvents.some((t) => t.id === e.id))].slice(
                    0,
                    8,
                );
        }
    };

    // Handle search
    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const openMapView = () => {
        setIsMapOpen(true);
    };

    // Events to display
    const displayEvents = getEventsForFilter();

    // Location button text based on status
    const locationButtonText = (() => {
        switch (locationStatus) {
            case 'loading':
                return 'Finding location...';
            case 'success':
                return location;
            case 'denied':
                return 'Location access denied';
            case 'error':
                return 'Location unavailable';
            case 'idle':
            default:
                return 'Set location';
        }
    })();

    return (
        <div className="min-h-screen bg-gray-50 overflow-x-hidden" ref={mainRef}>
            {/* Background ambient elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-b from-purple-200/20 to-blue-200/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/4 -left-40 w-80 h-80 bg-gradient-to-t from-orange-100/20 to-red-100/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-green-100/10 to-teal-100/20 rounded-full blur-3xl"></div>
            </div>

            {/* Header & Navigation */}
            <Header />
            <SideNavigation isOrganizer={isOrganizer} />

            <main className="pt-2 pb-24 md:ml-20 relative">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Main Content Area - 3/4 width on desktop */}
                        <div className="lg:col-span-3">
                            {/* Main Heading */}
                            <motion.div
                                className="mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <h1 className="text-3xl font-bold">Discover Events</h1>
                            </motion.div>

                            {/* Featured Banner */}
                            <motion.div
                                className="mb-10 relative overflow-hidden rounded-xl shadow-lg h-64 sm:h-72 md:h-80"
                                style={{ y: bannerParallax }}
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.3 }}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentBanner}
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }}
                                        className="absolute inset-0"
                                    >
                                        {/* Banner Image/Gradient */}
                                        <div className={`absolute inset-0 bg-gradient-to-r ${activeBanner.gradient} opacity-90`}></div>

                                        {/* Animated decorative elements */}
                                        <motion.div
                                            className="absolute inset-0 opacity-30"
                                            animate={{
                                                background: [
                                                    "radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
                                                    "radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)",
                                                    "radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)"
                                                ]
                                            }}
                                            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
                                        />

                                        {/* Banner Content */}
                                        <div className="relative h-full flex flex-col justify-center p-8 sm:p-10 text-white z-10">
                                            <motion.h2
                                                className="text-3xl sm:text-4xl font-bold mb-2"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2, duration: 0.6 }}
                                            >
                                                {activeBanner.title}
                                            </motion.h2>
                                            <motion.p
                                                className="mb-6 text-white/90 max-w-md"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3, duration: 0.6 }}
                                            >
                                                {activeBanner.subtitle}
                                            </motion.p>
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.4, duration: 0.6 }}
                                            >
                                                <motion.button
                                                    className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium shadow-md hover:bg-gray-100 transition-colors"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    {activeBanner.cta}
                                                </motion.button>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>

                                {/* Banner Navigation Dots */}
                                <div className="absolute bottom-4 right-4 flex space-x-2 z-20">
                                    {banners.map((_, index) => (
                                        <motion.button
                                            key={index}
                                            onClick={() => setCurrentBanner(index)}
                                            className={`w-2.5 h-2.5 rounded-full ${currentBanner === index ? 'bg-white' : 'bg-white/40'
                                                }`}
                                            whileHover={{ scale: 1.2 }}
                                            whileTap={{ scale: 0.9 }}
                                            animate={currentBanner === index ? { scale: [1, 1.2, 1] } : {}}
                                            transition={currentBanner === index ? {
                                                duration: 1.5,
                                                repeat: Infinity,
                                                repeatType: "reverse"
                                            } : {}}
                                            aria-label={`Go to banner ${index + 1}`}
                                        />
                                    ))}
                                </div>
                            </motion.div>

                            {/* Categories Scrollable */}
                            <motion.div
                                className="mb-10 relative"
                                style={{ y: categoryParallax }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                            >
                                <div className="overflow-x-auto no-scrollbar" ref={categoryRef}>
                                    <div className="flex gap-3 min-w-max pb-2 px-1">
                                        {CATEGORIES.map((category) => (
                                            <CategoryButton
                                                key={category.id}
                                                icon={category.icon}
                                                label={category.label}
                                                isActive={currentCategory === category.id}
                                                onClick={() => setCurrentCategory(category.id as CategoryType)}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Shadow indicators & scroll buttons */}
                                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none"></div>
                                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
                                <motion.button
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center"
                                    onClick={() => scrollCategories('left')}
                                    whileHover={{ scale: 1.1, x: -2 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label="Scroll categories left"
                                >
                                    <FiChevronRight className="w-5 h-5 transform rotate-180" />
                                </motion.button>
                                <motion.button
                                    className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center"
                                    onClick={() => scrollCategories('right')}
                                    whileHover={{ scale: 1.1, x: 2 }}
                                    whileTap={{ scale: 0.9 }}
                                    aria-label="Scroll categories right"
                                >
                                    <FiChevronRight className="w-5 h-5" />
                                </motion.button>
                            </motion.div>

                            {/* Filters */}
                            <motion.div
                                className="flex flex-wrap gap-2 mb-10"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                            >
                                <FilterButton
                                    icon={locationStatus === 'loading' ? FiLoader : locationStatus === 'denied' || locationStatus === 'error' ? FiAlertCircle : FiMapPin}
                                    label={locationButtonText}
                                    isActive={locationStatus === 'success'}
                                    isLoading={locationStatus === 'loading'}
                                    hasError={locationStatus === 'denied' || locationStatus === 'error'}
                                    onClick={() => {
                                        if (locationStatus === 'denied' || locationStatus === 'error') {
                                            setShowLocationPrompt(true);
                                        } else if (locationStatus === 'idle') {
                                            requestGeolocation();
                                        }
                                    }}
                                />

                                <FilterButton
                                    icon={FiCalendar}
                                    label="Date"
                                    isActive={false}
                                    onClick={() => { }}
                                />

                                <FilterButton
                                    icon={FiDollarSign}
                                    label="Price"
                                    isActive={false}
                                    onClick={() => { }}
                                />

                                {/* Gap for visual separation */}
                                <div className="w-2"></div>

                                {FILTERS.map((filter) => (
                                    <FilterButton
                                        key={filter.id}
                                        icon={filter.icon}
                                        label={filter.label}
                                        isActive={currentFilter === filter.id}
                                        onClick={() => setCurrentFilter(filter.id as FilterType)}
                                    />
                                ))}
                            </motion.div>

                            {/* Popular Events Section */}
                            <motion.div
                                className="mb-12"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                            >
                                <SectionHeader
                                    title={`Popular Events ${locationStatus === 'success' ? `in ${location}` : 'Near You'}`}
                                    viewAllLink="/discover"
                                />

                                {/* Loading State */}
                                {isLoading ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {[...Array(6)].map((_, index) => (
                                            <EventCardSkeleton key={index} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {displayEvents.slice(0, 6).map((event, index) => (
                                            <motion.div
                                                key={event.id}
                                                className="relative group"
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 * (index % 3), duration: 0.5 }}
                                                whileHover={{ y: -5 }}
                                            >
                                                <EventCard event={event} />
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-[#FF5722] transition-colors shadow-sm"
                                                    aria-label="Like event"
                                                >
                                                    <FiHeart className="w-4 h-4" />
                                                </motion.button>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>

                            {/* Show Map Button */}
                            <motion.div
                                className="mb-12 flex justify-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                            >
                                <motion.button
                                    whileHover={{ y: -3, boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)" }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={openMapView}
                                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white shadow-lg hover:bg-black transition-colors"
                                >
                                    <motion.div
                                        animate={{ rotate: [0, 15, -15, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                    >
                                        <BsGlobe className="w-5 h-5" />
                                    </motion.div>
                                    <span className="font-medium">Show Map</span>
                                </motion.button>
                            </motion.div>

                            {/* No Events State */}
                            {!isLoading && displayEvents.length === 0 && (
                                <motion.div
                                    className="flex flex-col items-center justify-center py-10 text-center bg-white rounded-xl shadow-sm"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <motion.div
                                        className="bg-gray-100 p-6 rounded-full mb-4"
                                        animate={{
                                            boxShadow: ["0px 0px 0px rgba(0,0,0,0)", "0px 0px 20px rgba(0,0,0,0.1)", "0px 0px 0px rgba(0,0,0,0)"]
                                        }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                    >
                                        <FiCalendar className="w-12 h-12 text-gray-500" />
                                    </motion.div>
                                    <h3 className="text-xl font-medium text-gray-800 mb-2">No events found</h3>
                                    <p className="text-gray-600 max-w-md">
                                        We couldn&apos;t find any events for this category. Please check back later or try another category.
                                    </p>
                                </motion.div>
                            )}
                        </div>

                        {/* Right Sidebar - 1/4 width on desktop */}
                        <div className="lg:col-span-1 space-y-8">
                            {/* Trending Section */}
                            <motion.div
                                className="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                whileHover={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)" }}
                            >
                                <SectionHeader title="Trending" viewAllLink="/trending" />

                                {isLoading ? (
                                    <div className="space-y-4">
                                        {[...Array(3)].map((_, index) => (
                                            <div key={index} className="animate-pulse">
                                                <div className="h-32 bg-gray-200 rounded-lg mb-2"></div>
                                                <div className="h-4 bg-gray-200 rounded w-2/3 mb-1"></div>
                                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {trendingEvents.slice(0, 3).map((event, index) => (
                                            <Link key={event.id} href={`/events/${event.id}`}>
                                                <motion.div
                                                    whileHover={{ y: -3 }}
                                                    initial={{ opacity: 0, y: 15 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.1 * index, duration: 0.4 }}
                                                    className="group cursor-pointer"
                                                >
                                                    <div className="relative h-32 rounded-lg overflow-hidden mb-2">
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                                                        <Image
                                                            src={event.image || '/images/placeholder-event.jpg'}
                                                            alt={event.title}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                        <div className="absolute bottom-2 left-2 z-20 flex items-center">
                                                            <motion.span
                                                                className="text-xs font-medium text-white bg-[#FF5722]/80 backdrop-blur-sm px-2 py-1 rounded-full"
                                                                whileHover={{ scale: 1.05 }}
                                                            >
                                                                {event.price?.amount === 0 ? 'Free' : `${event.price?.min}`}
                                                            </motion.span>
                                                        </div>
                                                    </div>
                                                    <h3 className="font-medium text-gray-900 group-hover:text-[#FF5722] transition-colors">
                                                        {event.title}
                                                    </h3>
                                                    <p className="text-xs text-gray-500">
                                                        {event.date instanceof Date ? event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Date TBA'} • {event.location?.name || 'Location TBA'}
                                                    </p>
                                                </motion.div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </motion.div>

                            {/* NFT Drops Section */}
                            <motion.div
                                className="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                whileHover={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)" }}
                            >
                                <SectionHeader title="NFT Drops" viewAllLink="/nft-drops" />

                                {isLoading ? (
                                    <div className="space-y-4">
                                        {[...Array(3)].map((_, index) => (
                                            <div key={index} className="animate-pulse">
                                                <div className="h-32 bg-gray-200 rounded-lg mb-2"></div>
                                                <div className="h-4 bg-gray-200 rounded w-2/3 mb-1"></div>
                                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {nftEvents.slice(0, 3).map((event, index) => (
                                            <Link key={event.id} href={`/events/${event.id}`}>
                                                <motion.div
                                                    whileHover={{ y: -3 }}
                                                    initial={{ opacity: 0, y: 15 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.1 * index, duration: 0.4 }}
                                                    className="group cursor-pointer"
                                                >
                                                    <div className="relative h-32 rounded-lg overflow-hidden mb-2">
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                                                        <Image
                                                            src={event.image || '/images/placeholder-event.jpg'}
                                                            alt={event.title}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                        <motion.div
                                                            className="absolute top-2 right-2 z-20"
                                                            whileHover={{ scale: 1.1 }}
                                                        >
                                                            <div className="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center">
                                                                <BsGem className="w-3 h-3 mr-1" />
                                                                <span>NFT</span>
                                                            </div>
                                                        </motion.div>
                                                    </div>
                                                    <h3 className="font-medium text-gray-900 group-hover:text-[#FF5722] transition-colors">
                                                        {event.title}
                                                    </h3>
                                                    <p className="text-xs text-gray-500">
                                                        {event.date instanceof Date ? event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Date TBA'} • {event.location?.name || 'Location TBA'}
                                                    </p>
                                                </motion.div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </motion.div>

                            {/* Suggested Creators Section */}
                            <motion.div
                                className="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                whileHover={{ boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)" }}
                            >
                                <SectionHeader title="Suggested Creators" viewAllLink="/creators" />

                                {isLoading ? (
                                    <div className="space-y-4">
                                        {[...Array(3)].map((_, index) => (
                                            <div key={index} className="animate-pulse flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                                <div className="flex-1">
                                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div>
                                        {FEATURED_CREATORS.map((creator, index) => (
                                            <motion.div
                                                key={creator.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 * index, duration: 0.4 }}
                                            >
                                                <CreatorCard creator={creator} />
                                            </motion.div>
                                        ))}

                                        <Link href="/creators">
                                            <motion.button
                                                whileHover={{ y: -2, borderColor: "#FF5722" }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full mt-4 py-2.5 px-4 rounded-xl border border-dashed border-gray-300 flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-50 hover:text-[#FF5722] transition-colors text-sm"
                                            >
                                                <FiPlus className="w-4 h-4" />
                                                <span>Discover More Creators</span>
                                            </motion.button>
                                        </Link>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Location permission dialog */}
            <AnimatePresence>
                {showLocationPrompt && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl"
                        >
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                                    <FiMapPin className="w-8 h-8 text-blue-500" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Location Access</h3>
                                <p className="text-gray-600">
                                    {locationStatus === 'denied'
                                        ? "You've denied location access. Allow location in your browser settings to find events near you."
                                        : "We need your location to show relevant events near you. Please enable location services."}
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="py-2.5 px-5 rounded-lg border border-gray-300 font-medium text-gray-700 hover:bg-gray-50"
                                    onClick={() => setShowLocationPrompt(false)}
                                >
                                    Not Now
                                </motion.button>

                                {locationStatus === 'denied' ? (
                                    <motion.a
                                        href="https://support.google.com/chrome/answer/142065?hl=en"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="py-2.5 px-5 rounded-lg bg-[#FF5722] font-medium text-white hover:bg-[#E64A19] text-center"
                                    >
                                        How to Enable
                                    </motion.a>
                                ) : (
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        className="py-2.5 px-5 rounded-lg bg-[#FF5722] font-medium text-white hover:bg-[#E64A19]"
                                        onClick={() => {
                                            requestGeolocation();
                                            setShowLocationPrompt(false);
                                        }}
                                    >
                                        Allow Location
                                    </motion.button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <MapView
                isOpen={isMapOpen}
                onClose={() => setIsMapOpen(false)}
                events={displayEvents}
                userLocation={coordinates}
                currentFilter={currentFilter}
            />

            {/* Global Styles */}
            <style jsx global>{`
                body {
                    background-color: #f9fafb;
                    color: #333333;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                }
                
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                
                @keyframes fadeIn {
                    0% { opacity: 0; transform: translateY(10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                
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

                /* Premium glassmorphism effect */
                .glass-card {
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                }
                
                /* Smooth scrolling for the whole page */
                html {
                    scroll-behavior: smooth;
                }
                
                /* Ambient gradient background pulse */
                @keyframes gradientPulse {
                    0% { opacity: 0.5; }
                    50% { opacity: 0.8; }
                    100% { opacity: 0.5; }
                }
                
                .ambient-gradient {
                    animation: gradientPulse 8s infinite;
                }
            `}</style>
        </div>
    );
}