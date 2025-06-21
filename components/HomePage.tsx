/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
    FiChevronRight, FiTrendingUp, FiClock, FiCalendar, FiTarget, FiHeart, FiMapPin,
    FiDollarSign, FiSearch, FiArrowRight, FiPlus, FiStar, FiUsers, FiTag,
    FiNavigation, FiX, FiLoader, FiCheck, FiAlertCircle, FiCompass, FiZap,
    FiFilter, FiMaximize2, FiMinimize2, FiPlay, FiMusic, FiCoffee, FiWifi, FiMenu
} from "react-icons/fi";
import {
    BsDroplet, BsLightningCharge, BsBuilding, BsTree, BsFlag, BsWater,
    BsDoorOpen, BsUmbrella, BsHouseDoor, BsMusicNote, BsBrush,
    BsCameraVideo, BsGlobe, BsGem, BsStars, BsMagic, BsFire, BsTicket
} from "react-icons/bs";
import { FaMountainSun } from "react-icons/fa6";
import { IoGameControllerOutline, IoTicketOutline } from "react-icons/io5";
import { GiPartyPopper } from "react-icons/gi";
import EchoChatWidget from "./EchoChatWidget";

// Types
interface Event {
    id: string;
    title: string;
    image: string;
    date: Date;
    location: {
        name: string;
        address: string;
        coordinates: { lat: number; lng: number; }
    };
    price: { min: string; max?: string; amount: number };
    attendees: number;
    category: string;
    creator: {
        name: string;
        avatar: string;
        verified: boolean;
    };
    description: string;
    tags: string[];
    isHot?: boolean;
    isFeatured?: boolean;
}

interface Creator {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    verified: boolean;
    followers: number;
    bio: string;
    eventsCount: number;
    rating: number;
}

type CategoryType = "music" | "tech" | "art" | "games" | "food" | "sports" | "wellness" | "outdoor" | "nightlife" | "education";
type FilterType = "all" | "trending" | "upcoming" | "nft" | "free" | "this-week";

// Enhanced categories
const CATEGORIES = [
    { id: "music", label: "Music", icon: BsMusicNote, gradient: "from-purple-500 to-pink-500", count: 245 },
    { id: "tech", label: "Tech", icon: BsLightningCharge, gradient: "from-blue-500 to-cyan-500", count: 189 },
    { id: "food", label: "Food", icon: FiCoffee, gradient: "from-orange-500 to-red-500", count: 356 },
    { id: "art", label: "Art", icon: BsBrush, gradient: "from-pink-500 to-rose-500", count: 167 },
    { id: "sports", label: "Sports", icon: BsFlag, gradient: "from-green-500 to-emerald-500", count: 234 },
    { id: "games", label: "Gaming", icon: IoGameControllerOutline, gradient: "from-indigo-500 to-purple-500", count: 198 },
    { id: "wellness", label: "Wellness", icon: BsTree, gradient: "from-green-400 to-teal-500", count: 145 },
    { id: "outdoor", label: "Outdoor", icon: FaMountainSun, gradient: "from-yellow-500 to-orange-500", count: 287 },
    { id: "nightlife", label: "Nightlife", icon: BsStars, gradient: "from-purple-600 to-indigo-600", count: 156 },
    { id: "education", label: "Learning", icon: BsBuilding, gradient: "from-blue-400 to-indigo-500", count: 123 },
];

const FILTERS = [
    { id: "all", label: "All Events", icon: FiCalendar, count: 2145 },
    { id: "trending", label: "Trending", icon: FiTrendingUp, count: 89 },
    { id: "this-week", label: "This Week", icon: FiClock, count: 156 },
    { id: "free", label: "Free", icon: BsGem, count: 67 },
    { id: "nft", label: "NFT", icon: BsTicket, count: 23 },
];

// Extensive event data
const PRODUCTION_EVENTS: Event[] = [
    {
        id: "1",
        title: "Summer Music Festival 2025",
        image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop",
        date: new Date("2025-07-15"),
        location: {
            name: "Central Park",
            address: "New York, NY",
            coordinates: { lat: 40.7829, lng: -73.9654 }
        },
        price: { min: "$45", amount: 45 },
        attendees: 1250,
        category: "music",
        creator: {
            name: "EventPro",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
            verified: true
        },
        description: "Join thousands for the ultimate summer music experience",
        tags: ["outdoor", "festival", "live-music"],
        isHot: true,
        isFeatured: true
    },
    {
        id: "2",
        title: "Tech Innovation Summit 2025",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
        date: new Date("2025-08-20"),
        location: {
            name: "Convention Center",
            address: "San Francisco, CA",
            coordinates: { lat: 37.7749, lng: -122.4194 }
        },
        price: { min: "Free", amount: 0 },
        attendees: 890,
        category: "tech",
        creator: {
            name: "TechEvents",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
            verified: true
        },
        description: "Connect with innovators and builders shaping the future",
        tags: ["networking", "innovation", "startup"],
        isHot: true
    },
    {
        id: "3",
        title: "Digital Art Exhibition: Future Visions",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
        date: new Date("2025-09-10"),
        location: {
            name: "Modern Gallery",
            address: "Los Angeles, CA",
            coordinates: { lat: 34.0522, lng: -118.2437 }
        },
        price: { min: "$25", amount: 25 },
        attendees: 456,
        category: "art",
        creator: {
            name: "ArtCollective",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face",
            verified: false
        },
        description: "Explore cutting-edge digital art from renowned artists",
        tags: ["exhibition", "digital-art", "gallery"],
        isFeatured: true
    },
    {
        id: "4",
        title: "Gaming Championship Finals",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
        date: new Date("2025-10-05"),
        location: {
            name: "Esports Arena",
            address: "Austin, TX",
            coordinates: { lat: 30.2672, lng: -97.7431 }
        },
        price: { min: "$30", amount: 30 },
        attendees: 2100,
        category: "games",
        creator: {
            name: "GameMasters",
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face",
            verified: true
        },
        description: "Watch the best players compete for the ultimate prize",
        tags: ["esports", "competition", "gaming"],
        isHot: true
    },
    {
        id: "5",
        title: "Street Food Festival",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
        date: new Date("2025-08-12"),
        location: {
            name: "Santa Monica Pier",
            address: "Santa Monica, CA",
            coordinates: { lat: 34.0195, lng: -118.4912 }
        },
        price: { min: "$20", amount: 20 },
        attendees: 3200,
        category: "food",
        creator: {
            name: "FoodieEvents",
            avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=40&h=40&fit=crop&crop=face",
            verified: true
        },
        description: "Taste amazing cuisine from around the world",
        tags: ["food", "festival", "outdoor"],
        isHot: true
    },
    {
        id: "6",
        title: "Yoga & Wellness Retreat",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop",
        date: new Date("2025-06-30"),
        location: {
            name: "Lake Tahoe Resort",
            address: "South Lake Tahoe, CA",
            coordinates: { lat: 38.9399, lng: -119.9772 }
        },
        price: { min: "$85", amount: 85 },
        attendees: 150,
        category: "wellness",
        creator: {
            name: "ZenMasters",
            avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=40&h=40&fit=crop&crop=face",
            verified: true
        },
        description: "Find inner peace in nature's most beautiful setting",
        tags: ["wellness", "yoga", "retreat"],
        isFeatured: true
    },
    {
        id: "7",
        title: "Rooftop Jazz Night",
        image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=600&h=400&fit=crop",
        date: new Date("2025-07-22"),
        location: {
            name: "Sky Lounge",
            address: "Chicago, IL",
            coordinates: { lat: 41.8781, lng: -87.6298 }
        },
        price: { min: "$35", amount: 35 },
        attendees: 180,
        category: "nightlife",
        creator: {
            name: "JazzCollective",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
            verified: true
        },
        description: "Smooth jazz under the stars with city views",
        tags: ["jazz", "rooftop", "nightlife"]
    },
    {
        id: "8",
        title: "AI & Machine Learning Workshop",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop",
        date: new Date("2025-08-15"),
        location: {
            name: "Tech Hub",
            address: "Seattle, WA",
            coordinates: { lat: 47.6062, lng: -122.3321 }
        },
        price: { min: "Free", amount: 0 },
        attendees: 320,
        category: "education",
        creator: {
            name: "CodeAcademy",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
            verified: true
        },
        description: "Learn the latest in AI and ML from industry experts",
        tags: ["ai", "workshop", "learning"]
    }
];

const FEATURED_CREATORS: Creator[] = [
    {
        id: "1",
        name: "Olivia Martinez",
        email: "olivia@example.com",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
        verified: true,
        followers: 42500,
        bio: "Music producer & event organiser",
        eventsCount: 23,
        rating: 4.9
    },
    {
        id: "2",
        name: "Marcus Chen",
        email: "marcus@example.com",
        avatarUrl: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop&crop=face",
        verified: true,
        followers: 31200,
        bio: "NFT artist & festival creator",
        eventsCount: 18,
        rating: 4.8
    },
    {
        id: "3",
        name: "Sarah Johnson",
        email: "sarah@example.com",
        avatarUrl: "https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?w=100&h=100&fit=crop&crop=face",
        verified: true,
        followers: 27800,
        bio: "Tech conference organiser",
        eventsCount: 31,
        rating: 4.9
    },
    {
        id: "4",
        name: "Alex Rivera",
        email: "alex@example.com",
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        verified: true,
        followers: 19400,
        bio: "Food festival curator",
        eventsCount: 15,
        rating: 4.7
    }
];

// Mapbox Full-Screen Map Component
const MapboxFullScreen = ({ isOpen, onClose, events }: {
    isOpen: boolean;
    onClose: () => void;
    events: Event[];
}) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        if (!isOpen || !mapContainer.current) return;

        // Simulating Mapbox integration
        const timer = setTimeout(() => {
            setMapLoaded(true);
        }, 500);

        return () => clearTimeout(timer);
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black z-50"
                >
                    {/* Map Header */}
                    <div className="absolute top-0 left-0 right-0 z-20 bg-black/80 backdrop-blur-lg border-b border-white/10">
                        <div className="flex items-center justify-between p-4 md:p-6">
                            <div className="flex items-center gap-4">
                                <motion.div
                                    className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                >
                                    <BsGlobe className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                </motion.div>
                                <div>
                                    <h2 className="text-lg md:text-xl font-bold text-white">Event Explorer</h2>
                                    <p className="text-gray-300 text-xs md:text-sm">{events.length} events • Live locations</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-3 py-2 md:px-4 md:py-2 rounded-lg bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 transition-all duration-300 text-sm"
                                >
                                    <FiFilter className="w-4 h-4 mr-1 md:mr-2 inline" />
                                    <span className="hidden sm:inline">Filter</span>
                                </motion.button>
                                <motion.button
                                    onClick={onClose}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 flex items-center justify-center text-white"
                                >
                                    <FiX className="w-4 h-4 md:w-5 md:h-5" />
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Map Container */}
                    <div ref={mapContainer} className="w-full h-full pt-16 md:pt-20">
                        {/* Beautiful Map Placeholder with Interactive Elements */}
                        <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
                            {/* Animated Grid Background */}
                            <div
                                className="absolute inset-0 opacity-20"
                                style={{
                                    backgroundImage: `
                                        radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)
                                    `,
                                    backgroundSize: '50px 50px'
                                }}
                            />

                            {/* Loading State */}
                            {!mapLoaded && (
                                <motion.div
                                    className="absolute inset-0 flex items-center justify-center"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <div className="text-center">
                                        <motion.div
                                            className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 border-4 border-white/20 border-t-white rounded-full"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        />
                                        <p className="text-white/80 text-sm md:text-base">Loading Mapbox...</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Event Markers */}
                            {mapLoaded && events.map((event, index) => {
                                const x = ((event.location.coordinates.lng + 180) / 360) * 100;
                                const y = ((90 - event.location.coordinates.lat) / 180) * 100;

                                return (
                                    <motion.div
                                        key={event.id}
                                        className="absolute z-10 cursor-pointer"
                                        style={{
                                            left: `${x}%`,
                                            top: `${y}%`,
                                            transform: 'translate(-50%, -50%)'
                                        }}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: index * 0.1, duration: 0.5, type: "spring" }}
                                        whileHover={{ scale: 1.5, zIndex: 20 }}
                                        onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
                                    >
                                        <div className={`
                                            relative w-4 h-4 md:w-6 md:h-6 rounded-full border-2 md:border-3 border-white shadow-2xl
                                            ${selectedEvent?.id === event.id
                                                ? 'bg-orange-500 scale-150'
                                                : event.isHot
                                                    ? 'bg-red-500'
                                                    : 'bg-blue-500'
                                            }
                                            transition-all duration-300
                                        `}>
                                            {/* Pulse Animation */}
                                            <motion.div
                                                className="absolute inset-0 rounded-full bg-white/30"
                                                animate={{
                                                    scale: [1, 2.5, 1],
                                                    opacity: [0.8, 0, 0.8]
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    delay: index * 0.2
                                                }}
                                            />

                                            {/* Hot Badge */}
                                            {event.isHot && (
                                                <motion.div
                                                    className="absolute -top-1 -right-1 w-2 h-2 md:w-3 md:h-3 bg-yellow-400 rounded-full flex items-center justify-center"
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 1, repeat: Infinity }}
                                                >
                                                    <BsFire className="w-1 h-1 md:w-2 md:h-2 text-orange-600" />
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {/* Event Info Panel */}
                            <AnimatePresence>
                                {selectedEvent && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                                        className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 max-w-md mx-auto"
                                    >
                                        <div className="bg-black/90 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/20 shadow-2xl">
                                            <div className="flex items-start gap-3 md:gap-4">
                                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden flex-shrink-0">
                                                    <Image
                                                        src={selectedEvent.image}
                                                        alt={selectedEvent.title}
                                                        width={80}
                                                        height={80}
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="font-bold text-white text-base md:text-lg leading-tight line-clamp-2">
                                                            {selectedEvent.title}
                                                        </h3>
                                                        {selectedEvent.isHot && (
                                                            <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-medium flex-shrink-0">
                                                                HOT
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="space-y-1 md:space-y-2">
                                                        <p className="text-gray-300 text-xs md:text-sm flex items-center gap-2">
                                                            <FiMapPin className="w-3 h-3 md:w-4 md:h-4 text-orange-400 flex-shrink-0" />
                                                            <span className="truncate">{selectedEvent.location.name}</span>
                                                        </p>
                                                        <p className="text-gray-300 text-xs md:text-sm flex items-center gap-2">
                                                            <FiCalendar className="w-3 h-3 md:w-4 md:h-4 text-blue-400 flex-shrink-0" />
                                                            {selectedEvent.date.toLocaleDateString()}
                                                        </p>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-base md:text-lg font-bold text-orange-400">
                                                                {selectedEvent.price.amount === 0 ? 'Free' : selectedEvent.price.min}
                                                            </span>
                                                            <span className="text-xs md:text-sm text-gray-400 flex items-center gap-1">
                                                                <FiUsers className="w-3 h-3 md:w-4 md:h-4" />
                                                                {selectedEvent.attendees} attending
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="w-full mt-3 md:mt-4 py-2 md:py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 text-sm md:text-base"
                                                    >
                                                        View Details
                                                    </motion.button>
                                                </div>

                                                <button
                                                    onClick={() => setSelectedEvent(null)}
                                                    className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors flex-shrink-0"
                                                >
                                                    <FiX className="w-4 h-4 md:w-5 md:h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Legend */}
                            <div className="absolute top-20 md:top-24 right-4 md:right-6 bg-black/80 backdrop-blur-lg rounded-xl p-3 md:p-4 border border-white/20">
                                <h4 className="text-white font-semibold mb-2 md:mb-3 text-sm md:text-base">Legend</h4>
                                <div className="space-y-1 md:space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 md:w-4 md:h-4 bg-blue-500 rounded-full"></div>
                                        <span className="text-gray-300 text-xs md:text-sm">Regular Events</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded-full"></div>
                                        <span className="text-gray-300 text-xs md:text-sm">Hot Events</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 md:w-4 md:h-4 bg-orange-500 rounded-full"></div>
                                        <span className="text-gray-300 text-xs md:text-sm">Selected</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

type Category = typeof CATEGORIES[number];

const CategoryButton = ({ category, isActive, onClick }: {
    category: Category;
    isActive: boolean;
    onClick: () => void;
}) => (
    <motion.button
        onClick={onClick}
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex flex-col items-center gap-2 px-3 py-3 md:px-4 md:py-3 transition-all duration-300 min-w-[90px] md:min-w-[110px] group"
    >
        <motion.div
            className={`
                relative p-2.5 md:p-3 rounded-2xl transition-all duration-300 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center
                ${isActive
                    ? `bg-gradient-to-br ${category.gradient} text-white shadow-xl shadow-black/25 backdrop-blur-xl border border-white/20`
                    : "bg-white/40 backdrop-blur-xl text-gray-600 hover:bg-white/60 border border-white/30 group-hover:scale-105 shadow-[inset_8px_8px_16px_rgba(255,255,255,0.1),inset_-8px_-8px_16px_rgba(0,0,0,0.1)] hover:shadow-[inset_4px_4px_8px_rgba(255,255,255,0.2),inset_-4px_-4px_8px_rgba(0,0,0,0.2)]"
                }
            `}
        >
            <category.icon className="w-4 h-4 md:w-5 md:h-5" />

            {isActive && (
                <>
                    <motion.div
                        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${category.gradient} blur-lg opacity-30`}
                        animate={{ scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
                </>
            )}
        </motion.div>

        <div className="text-center">
            <span className={`text-xs font-medium whitespace-nowrap transition-colors block ${isActive ? "text-gray-900" : "text-gray-600"
                }`}>
                {category.label}
            </span>
            <span className="text-xs text-gray-400">{category.count}</span>
        </div>

        {isActive && (
            <motion.div
                layoutId="categoryIndicator"
                className={`h-1 w-6 md:w-8 bg-gradient-to-r ${category.gradient} rounded-full`}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
        )}
    </motion.button>
);

// Enhanced Event Card with Neumorphic Design
const EventCard = ({ event, variant = "default" }: {
    event: Event;
    variant?: "default" | "compact" | "featured"
}) => {
    const isCompact = variant === "compact";
    const isFeatured = variant === "featured";

    return (
        <Link href={`/events/${event.id}`}>
            <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className={`
                    group relative backdrop-blur-xl overflow-hidden 
                    transition-all duration-500 cursor-pointer
                    ${isFeatured
                        ? 'bg-gradient-to-br from-white/60 via-white/50 to-white/40 shadow-[20px_20px_60px_rgba(0,0,0,0.1),-20px_-20px_60px_rgba(255,255,255,0.7)] border border-white/40 rounded-3xl'
                        : 'bg-gradient-to-br from-white/50 via-white/40 to-white/30 shadow-[16px_16px_40px_rgba(0,0,0,0.08),-16px_-16px_40px_rgba(255,255,255,0.6)] border border-white/30 rounded-2xl'
                    }
                    hover:shadow-[24px_24px_80px_rgba(0,0,0,0.15),-24px_-24px_80px_rgba(255,255,255,0.8)]
                    hover:border-white/50
                `}
            >
                {/* Glassmorphic overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

                {/* Image */}
                <div className={`relative overflow-hidden ${isCompact ? 'h-32' : 'h-48'} ${isFeatured ? 'rounded-t-3xl' : 'rounded-t-2xl'}`}>
                    <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                        <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold px-2.5 py-1.5 rounded-full shadow-lg">
                            {event.price.amount === 0 ? 'Free' : event.price.min}
                        </span>
                        {event.isHot && (
                            <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-semibold px-2.5 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                                <BsFire className="w-3 h-3" />
                                HOT
                            </span>
                        )}
                    </div>

                    {/* Creator Badge */}
                    {event.creator.verified && (
                        <div className="absolute top-3 right-3">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-1.5 rounded-full shadow-lg backdrop-blur-sm">
                                <FiStar className="w-3 h-3" />
                            </div>
                        </div>
                    )}

                    {/* Like Button */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute bottom-3 right-3 p-2.5 rounded-full bg-white/80 backdrop-blur-xl hover:bg-white/90 text-gray-700 hover:text-red-500 transition-colors shadow-lg border border-white/30 hover:shadow-xl"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >
                        <FiHeart className="w-4 h-4" />
                    </motion.button>
                </div>

                {/* Content */}
                <div className={`p-4 md:p-5 ${isCompact ? 'pb-3' : ''} relative z-10`}>
                    <h3 className={`font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2 ${isCompact ? 'text-sm' : 'text-base md:text-lg'
                        }`}>
                        {event.title}
                    </h3>

                    <div className={`flex items-center gap-2 text-gray-600 mb-2 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                        <FiCalendar className="w-3 h-3 text-blue-500" />
                        <span>{event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>

                    <div className={`flex items-center gap-2 text-gray-600 mb-3 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                        <FiMapPin className="w-3 h-3 text-orange-500" />
                        <span className="truncate">{event.location.name}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Image
                                    src={event.creator.avatar}
                                    alt={event.creator.name}
                                    width={20}
                                    height={20}
                                    className="rounded-full border border-white/50"
                                />
                                {event.creator.verified && (
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                                        <FiStar className="w-1.5 h-1.5 text-white" />
                                    </div>
                                )}
                            </div>
                            <span className="text-xs text-gray-600 truncate">{event.creator.name}</span>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100/50 backdrop-blur-sm rounded-full px-2 py-1">
                            <FiUsers className="w-3 h-3" />
                            <span>{event.attendees}</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

// Enhanced Creator Card with Neumorphic Design
const CreatorCard = ({ creator }: { creator: Creator }) => (
    <Link href={`/creator/${creator.id}`}>
        <motion.div
            whileHover={{ y: -2, scale: 1.01 }}
            className="flex items-center gap-3 p-3 md:p-4 rounded-xl backdrop-blur-xl transition-all duration-300 mb-3 cursor-pointer
                bg-gradient-to-br from-white/50 via-white/40 to-white/30 
                shadow-[12px_12px_24px_rgba(0,0,0,0.06),-12px_-12px_24px_rgba(255,255,255,0.6)] 
                border border-white/30
                hover:shadow-[16px_16px_32px_rgba(0,0,0,0.1),-16px_-16px_32px_rgba(255,255,255,0.7)]
                hover:border-white/50"
        >
            <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg border-2 border-white/50">
                    <Image
                        src={creator.avatarUrl}
                        alt={creator.name}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                    />
                </div>
                {creator.verified && (
                    <motion.div
                        className="absolute -right-1 -bottom-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full p-0.5 border-2 border-white shadow-lg"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: [0.8, 1.1, 0.9, 1], rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 0.5 }}
                    >
                        <FiStar className="w-3 h-3" />
                    </motion.div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate text-sm md:text-base">{creator.name}</p>
                <p className="text-xs text-gray-500 truncate mb-1">{creator.bio}</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1 bg-gray-100/50 backdrop-blur-sm rounded-full px-2 py-0.5">
                            <FiUsers className="w-3 h-3" />
                            {creator.followers >= 1000 ? `${(creator.followers / 1000).toFixed(1)}k` : creator.followers}
                        </span>
                        <span className="flex items-center gap-1 bg-gray-100/50 backdrop-blur-sm rounded-full px-2 py-0.5">
                            <FiCalendar className="w-3 h-3" />
                            {creator.eventsCount}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-100/70 backdrop-blur-sm rounded-full px-2 py-0.5">
                        <FiStar className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-medium text-yellow-700">{creator.rating}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    </Link>
);

// Mobile Sidebar Component
const MobileSidebar = ({
    isOpen,
    onClose,
    searchQuery,
    setSearchQuery,
    trendingEvents,
    featuredCreators
}: {
    isOpen: boolean;
    onClose: () => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    trendingEvents: Event[];
    featuredCreators: Creator[];
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
                        onClick={onClose}
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 w-80 h-screen bg-white/95 backdrop-blur-xl border-l border-gray-200/50 overflow-y-auto z-50 lg:hidden"
                    >
                        <div className="p-6 space-y-6">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-gray-900">Discovery</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full bg-gray-100/80 hover:bg-gray-200/80 transition-colors"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Search */}
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search events..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-300 transition-all duration-300"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <FiX className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Hot Events */}
                            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100">
                                <div className="flex items-center gap-2 mb-4">
                                    <BsFire className="w-5 h-5 text-red-500" />
                                    <h3 className="text-lg font-bold text-gray-900">Hot Events</h3>
                                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                        {trendingEvents.length}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {trendingEvents.slice(0, 3).map((event, index) => (
                                        <motion.div
                                            key={event.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 * index }}
                                        >
                                            <EventCard event={event} variant="compact" />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Creators */}
                            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <FiUsers className="w-5 h-5 text-purple-500" />
                                        Top Creators
                                    </h3>
                                    <Link href="/creators" className="text-purple-500 hover:text-purple-600 text-sm font-medium">
                                        See all
                                    </Link>
                                </div>

                                <div>
                                    {featuredCreators.map((creator, index) => (
                                        <motion.div
                                            key={creator.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 * index }}
                                        >
                                            <CreatorCard creator={creator} />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// Main Component
export default function HomePage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [currentFilter, setCurrentFilter] = useState<FilterType>("all");
    const [currentCategory, setCurrentCategory] = useState<CategoryType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const categoryRef = useRef<HTMLDivElement>(null);
    const mainContentRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    const bannerParallax = useTransform(scrollY, [0, 400], [0, -100]);

    // Load events
    useEffect(() => {
        const timer = setTimeout(() => {
            setEvents(PRODUCTION_EVENTS);
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const scrollCategories = (direction: 'left' | 'right') => {
        if (categoryRef.current) {
            const scrollAmount = direction === 'left' ? -200 : 200;
            categoryRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const filteredEvents = events.filter(event => {
        if (currentCategory && event.category !== currentCategory) return false;
        if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;

        if (currentFilter === "trending") return event.isHot;
        if (currentFilter === "this-week") return event.date > new Date() && event.date < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        if (currentFilter === "free") return event.price.amount === 0;
        if (currentFilter === "nft") return event.tags.includes("nft") || event.category === "art";

        return true;
    });

    const trendingEvents = events.filter(e => e.isHot);
    const featuredEvents = events.filter(e => e.isFeatured);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
            {/* Enhanced background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-b from-purple-200/20 via-blue-200/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/4 -left-40 w-80 h-80 bg-gradient-to-t from-orange-100/20 via-pink-100/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-green-100/10 via-teal-100/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="flex">
                {/* Main Content Area - Responsive */}
                <div
                    ref={mainContentRef}
                    className="flex-1 overflow-y-auto h-screen"
                    style={{ paddingRight: window.innerWidth >= 1024 ? '400px' : '0' }}
                >
                    <div className="max-w-4xl mx-auto px-4 md:px-6 pt-4 md:pt-6 pb-32">
                        {/* Mobile Menu Button */}
                        <div className="lg:hidden flex justify-end mb-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsMobileSidebarOpen(true)}
                                className="p-3 rounded-xl bg-white/80 backdrop-blur-xl shadow-lg border border-white/30"
                            >
                                <FiMenu className="w-5 h-5" />
                            </motion.button>
                        </div>

                        {/* Enhanced Epic Banner - Fully Responsive */}
                        <motion.div
                            className="mb-6 md:mb-8 relative overflow-hidden rounded-2xl md:rounded-3xl h-64 sm:h-80 md:h-96 lg:h-80 shadow-2xl"
                            style={{ y: bannerParallax }}
                            whileHover={{ scale: 1.01 }}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500">
                                <motion.div
                                    className="absolute inset-0"
                                    animate={{
                                        background: [
                                            "radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
                                            "radial-gradient(circle at 80% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)",
                                            "radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)"
                                        ]
                                    }}
                                    transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
                                />
                                {/* Glassmorphic overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 backdrop-blur-[0.5px]" />
                            </div>

                            <div className="relative h-full flex flex-col justify-center p-6 md:p-8 lg:p-10 text-white z-10">
                                <motion.div
                                    className="flex flex-wrap items-center gap-2 md:gap-3 mb-3 md:mb-4"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <span className="bg-white/20 backdrop-blur-sm px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                                        🔥 Trending Now
                                    </span>
                                    <span className="bg-green-500/80 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                                        Early Bird 50% OFF
                                    </span>
                                </motion.div>

                                <motion.h2
                                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 leading-tight"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    Summer Festival 2025
                                </motion.h2>
                                <motion.p
                                    className="mb-4 md:mb-6 text-white/90 max-w-lg text-sm md:text-lg leading-relaxed"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    Experience the ultimate music weekend with world-class artists, food trucks, and unforgettable memories
                                </motion.p>

                                <motion.div
                                    className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <motion.button
                                        className="bg-white text-gray-900 px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm md:text-lg shadow-xl hover:shadow-2xl transition-all duration-300 w-full sm:w-auto"
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Get Tickets
                                    </motion.button>
                                    <motion.button
                                        className="bg-white/20 backdrop-blur-sm text-white px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-medium border border-white/30 hover:bg-white/30 transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto"
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FiPlay className="w-4 h-4 md:w-5 md:h-5" />
                                        Watch Trailer
                                    </motion.button>
                                </motion.div>
                            </div>

                            {/* Floating price element - responsive */}
                            <motion.div
                                className="absolute top-4 md:top-8 right-4 md:right-8 bg-white/10 backdrop-blur-lg rounded-xl md:rounded-2xl p-3 md:p-4 border border-white/20"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                <div className="text-center">
                                    <p className="text-white/80 text-xs md:text-sm">Starting from</p>
                                    <p className="text-white font-bold text-lg md:text-2xl">$45</p>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Categories - Responsive */}
                        <motion.div
                            className="mb-8 md:mb-10 relative"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="flex items-center justify-between mb-4 md:mb-6">
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Browse Categories</h2>
                                <Link href="/categories" className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1 text-sm">
                                    View all
                                    <FiChevronRight className="w-4 h-4" />
                                </Link>
                            </div>

                            <div className="overflow-x-auto no-scrollbar" ref={categoryRef}>
                                <div className="flex gap-3 md:gap-4 min-w-max pb-4 px-2">
                                    {CATEGORIES.map((category) => (
                                        <CategoryButton
                                            key={category.id}
                                            category={category}
                                            isActive={currentCategory === category.id}
                                            onClick={() => setCurrentCategory(
                                                currentCategory === category.id ? null : category.id as CategoryType
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Scroll buttons - hidden on mobile */}
                            <motion.button
                                className="hidden md:flex absolute left-0 top-16 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200/50 items-center justify-center hover:bg-white hover:shadow-xl transition-all duration-300"
                                onClick={() => scrollCategories('left')}
                                whileHover={{ scale: 1.1, x: -2 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FiChevronRight className="w-5 h-5 transform rotate-180 text-gray-700" />
                            </motion.button>
                            <motion.button
                                className="hidden md:flex absolute right-0 top-16 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200/50 items-center justify-center hover:bg-white hover:shadow-xl transition-all duration-300"
                                onClick={() => scrollCategories('right')}
                                whileHover={{ scale: 1.1, x: 2 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <FiChevronRight className="w-5 h-5 text-gray-700" />
                            </motion.button>
                        </motion.div>

                        {/* Filter Pills - Responsive */}
                        <motion.div
                            className="flex flex-wrap gap-2 md:gap-3 mb-8 md:mb-10"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            {FILTERS.map((filter) => (
                                <motion.button
                                    key={filter.id}
                                    onClick={() => setCurrentFilter(filter.id as FilterType)}
                                    whileHover={{ scale: 1.02, y: -1 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`
                                        px-3 md:px-4 py-2 md:py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 
                                        transition-all duration-300 backdrop-blur-xl
                                        ${currentFilter === filter.id
                                            ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl border border-orange-300"
                                            : "bg-white/50 text-gray-700 border border-white/30 hover:bg-white/70 hover:shadow-lg shadow-[8px_8px_16px_rgba(0,0,0,0.04),-8px_-8px_16px_rgba(255,255,255,0.5)]"
                                        }
                                    `}
                                >
                                    <filter.icon className="w-4 h-4" />
                                    <span className="hidden sm:inline">{filter.label}</span>
                                    <span className={`text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded-full ${currentFilter === filter.id ? 'bg-white/20' : 'bg-gray-100/70'
                                        }`}>
                                        {filter.count}
                                    </span>
                                </motion.button>
                            ))}
                        </motion.div>

                        {/* Featured Events - Responsive Grid */}
                        {featuredEvents.length > 0 && (
                            <motion.div
                                className="mb-10 md:mb-12"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <div className="flex items-center justify-between mb-4 md:mb-6">
                                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                                        <BsStars className="w-5 h-5 md:w-6 md:h-6 text-yellow-500" />
                                        Featured Events
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    {featuredEvents.slice(0, 4).map((event, index) => (
                                        <motion.div
                                            key={event.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 * index, duration: 0.5 }}
                                        >
                                            <EventCard event={event} variant="featured" />
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* All Events - Responsive Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <div className="flex items-center justify-between mb-4 md:mb-6">
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                                    {searchQuery ? `Results for "${searchQuery}"` :
                                        currentCategory ? `${CATEGORIES.find(c => c.id === currentCategory)?.label} Events` :
                                            currentFilter !== "all" ? `${FILTERS.find(f => f.id === currentFilter)?.label}` :
                                                "All Events"}
                                </h2>
                                <span className="text-gray-500 text-sm">{filteredEvents.length} events</span>
                            </div>

                            {isLoading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                    {[...Array(6)].map((_, index) => (
                                        <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 overflow-hidden animate-pulse">
                                            <div className="h-40 md:h-48 bg-gray-200" />
                                            <div className="p-4 space-y-3">
                                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                                                <div className="h-3 bg-gray-200 rounded w-1/2" />
                                                <div className="h-3 bg-gray-200 rounded w-2/3" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : filteredEvents.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                    {filteredEvents.map((event, index) => (
                                        <motion.div
                                            key={event.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 * (index % 3), duration: 0.5 }}
                                        >
                                            <EventCard event={event} />
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                                        <FiSearch className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">No events found</h3>
                                    <p className="text-gray-600 mb-6 text-sm md:text-base">Try adjusting your filters or search criteria</p>
                                    <button
                                        onClick={() => {
                                            setCurrentFilter("all");
                                            setCurrentCategory(null);
                                            setSearchQuery("");
                                        }}
                                        className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>

                {/* Fixed Right Sidebar - Hidden on Mobile/Tablet */}
                <div className="hidden lg:block fixed top-0 right-0 w-96 h-screen bg-white/40 backdrop-blur-xl border-l border-gray-200/50 overflow-y-auto">
                    <div className="p-6 space-y-6">
                        {/* Search */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search events..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-300 transition-all duration-300"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <FiX className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </motion.div>

                        {/* Hot Events */}
                        <motion.div
                            className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <BsFire className="w-5 h-5 text-red-500" />
                                <h3 className="text-lg font-bold text-gray-900">Hot Events</h3>
                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                                    {trendingEvents.length}
                                </span>
                            </div>

                            <div className="space-y-3">
                                {trendingEvents.slice(0, 3).map((event, index) => (
                                    <motion.div
                                        key={event.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                    >
                                        <EventCard event={event} variant="compact" />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Creators */}
                        <motion.div
                            className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <FiUsers className="w-5 h-5 text-purple-500" />
                                    Top Creators
                                </h3>
                                <Link href="/creators" className="text-purple-500 hover:text-purple-600 text-sm font-medium">
                                    See all
                                </Link>
                            </div>

                            <div>
                                {FEATURED_CREATORS.map((creator, index) => (
                                    <motion.div
                                        key={creator.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                    >
                                        <CreatorCard creator={creator} />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar */}
            <MobileSidebar
                isOpen={isMobileSidebarOpen}
                onClose={() => setIsMobileSidebarOpen(false)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                trendingEvents={trendingEvents}
                featuredCreators={FEATURED_CREATORS}
            />

            {/* Floating Map Button - Responsive */}
            <motion.div
                className="fixed bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 z-40"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.6 }}
            >
                <motion.button
                    onClick={() => setIsMapOpen(true)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white font-semibold rounded-full shadow-2xl backdrop-blur-lg border border-white/10 flex items-center gap-3"
                >
                    <motion.div
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                        <BsGlobe className="w-4 h-4 md:w-5 md:h-5" />
                    </motion.div>
                    <span className="text-sm md:text-base">Explore Map</span>
                    <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                        {filteredEvents.length}
                    </span>
                </motion.button>
            </motion.div>

            {/* Mapbox Full-Screen */}
            <MapboxFullScreen
                isOpen={isMapOpen}
                onClose={() => setIsMapOpen(false)}
                events={filteredEvents}
            />

            <EchoChatWidget />

            {/* Global Styles */}
            <style jsx global>{`
                body {
                    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                    color: #333;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                }
                
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                /* Smooth scrolling */
                * {
                    scroll-behavior: smooth;
                }

                /* Responsive text selection */
                @media (max-width: 640px) {
                    .container {
                        padding-left: 1rem;
                        padding-right: 1rem;
                    }
                }
            `}</style>
        </div>
    );
}