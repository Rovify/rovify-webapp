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
    FiFilter, FiMaximize2, FiMinimize2, FiPlay, FiMusic, FiCoffee, FiWifi
} from "react-icons/fi";
import {
    BsDroplet, BsLightningCharge, BsBuilding, BsTree, BsFlag, BsWater,
    BsDoorOpen, BsUmbrella, BsHouseDoor, BsMusicNote, BsBrush,
    BsCameraVideo, BsGlobe, BsGem, BsStars, BsMagic, BsFire, BsTicket
} from "react-icons/bs";
import { FaMountainSun } from "react-icons/fa6";
import { IoGameControllerOutline, IoTicketOutline } from "react-icons/io5";
import { GiPartyPopper } from "react-icons/gi";

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

// Modern categories with clean design
const CATEGORIES = [
    { id: "music", label: "Music", icon: BsMusicNote, color: "#8B5CF6", count: 245 },
    { id: "tech", label: "Tech", icon: BsLightningCharge, color: "#3B82F6", count: 189 },
    { id: "food", label: "Food", icon: FiCoffee, color: "#F59E0B", count: 356 },
    { id: "art", label: "Art", icon: BsBrush, color: "#EC4899", count: 167 },
    { id: "sports", label: "Sports", icon: BsFlag, color: "#10B981", count: 234 },
    { id: "games", label: "Gaming", icon: IoGameControllerOutline, color: "#6366F1", count: 198 },
    { id: "wellness", label: "Wellness", icon: BsTree, color: "#059669", count: 145 },
    { id: "outdoor", label: "Outdoor", icon: FaMountainSun, color: "#EA580C", count: 287 },
    { id: "nightlife", label: "Nightlife", icon: BsStars, color: "#7C3AED", count: 156 },
    { id: "education", label: "Learning", icon: BsBuilding, color: "#0EA5E9", count: 123 },
];

const FILTERS = [
    { id: "all", label: "All", count: 2145 },
    { id: "trending", label: "Trending", count: 89 },
    { id: "this-week", label: "This week", count: 156 },
    { id: "free", label: "Free", count: 67 },
    { id: "nft", label: "NFT", count: 23 },
];

// Production events
const PRODUCTION_EVENTS: Event[] = [
    {
        id: "1",
        title: "Summer Music Festival 2025",
        image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop",
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
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
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
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
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
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop",
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
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
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
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop",
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
        image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&h=600&fit=crop",
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
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop",
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
        bio: "Music producer & event organizer",
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
        bio: "Tech conference organizer",
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

// Modern Mapbox Component
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
        const timer = setTimeout(() => setMapLoaded(true), 500);
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
                    {/* Modern Header */}
                    <div className="absolute top-0 left-0 right-0 z-20 bg-black/50 backdrop-blur-2xl">
                        <div className="flex items-center justify-between p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                    <BsGlobe className="w-4 h-4 text-black" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-white">Explore events</h2>
                                    <p className="text-white/70 text-sm">{events.length} events nearby</p>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                            >
                                <FiX className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Map */}
                    <div ref={mapContainer} className="w-full h-full pt-20">
                        <div className="relative w-full h-full bg-gray-100">
                            {!mapLoaded ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                                    <div className="text-center">
                                        <div className="w-8 h-8 mx-auto mb-4 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                                        <p className="text-gray-600 text-sm">Loading map...</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100">
                                    {/* Minimal grid */}
                                    <div
                                        className="absolute inset-0 opacity-30"
                                        style={{
                                            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)',
                                            backgroundSize: '40px 40px'
                                        }}
                                    />

                                    {/* Event markers */}
                                    {events.map((event, index) => {
                                        const x = ((event.location.coordinates.lng + 180) / 360) * 100;
                                        const y = ((90 - event.location.coordinates.lat) / 180) * 100;

                                        return (
                                            <motion.div
                                                key={event.id}
                                                className="absolute cursor-pointer"
                                                style={{
                                                    left: `${x}%`,
                                                    top: `${y}%`,
                                                    transform: 'translate(-50%, -50%)'
                                                }}
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: index * 0.1 }}
                                                whileHover={{ scale: 1.2 }}
                                                onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
                                            >
                                                <div className={`
                                                    w-4 h-4 rounded-full shadow-lg
                                                    ${selectedEvent?.id === event.id
                                                        ? 'bg-black scale-150'
                                                        : event.isHot
                                                            ? 'bg-red-500'
                                                            : 'bg-blue-500'
                                                    }
                                                    transition-all duration-200
                                                `} />
                                            </motion.div>
                                        );
                                    })}

                                    {/* Event panel */}
                                    <AnimatePresence>
                                        {selectedEvent && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 20 }}
                                                className="absolute bottom-8 left-8 right-8 max-w-sm mx-auto"
                                            >
                                                <div className="bg-white rounded-2xl p-6 shadow-xl">
                                                    <div className="flex gap-4">
                                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
                                                            <Image
                                                                src={selectedEvent.image}
                                                                alt={selectedEvent.title}
                                                                width={64}
                                                                height={64}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-semibold text-gray-900 mb-1 truncate">
                                                                {selectedEvent.title}
                                                            </h3>
                                                            <p className="text-sm text-gray-600 mb-2">
                                                                {selectedEvent.location.name}
                                                            </p>
                                                            <div className="flex items-center justify-between">
                                                                <span className="font-semibold text-gray-900">
                                                                    {selectedEvent.price.amount === 0 ? 'Free' : selectedEvent.price.min}
                                                                </span>
                                                                <span className="text-sm text-gray-500">
                                                                    {selectedEvent.attendees} going
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Modern Category Button
type Category = typeof CATEGORIES[number];

const CategoryButton = ({ category, isActive, onClick }: {
    category: Category;
    isActive: boolean;
    onClick: () => void;
}) => (
    <motion.button
        onClick={onClick}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        className="flex flex-col items-center p-4 min-w-[90px] group"
    >
        <div
            className={`
                w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-all duration-200
                ${isActive
                    ? 'shadow-lg text-white'
                    : 'bg-gray-50 text-gray-600 group-hover:bg-gray-100'
                }
            `}
            style={isActive ? { backgroundColor: category.color } : {}}
        >
            <category.icon className="w-5 h-5" />
        </div>

        <span className={`text-sm font-medium mb-1 ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
            {category.label}
        </span>
        <span className="text-xs text-gray-400">{category.count}</span>
    </motion.button>
);

// Modern Event Card
const EventCard = ({ event, variant = "default" }: {
    event: Event;
    variant?: "default" | "compact" | "featured"
}) => {
    const isCompact = variant === "compact";

    return (
        <Link href={`/events/${event.id}`}>
            <motion.div
                whileHover={{ y: -4 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
                {/* Image */}
                <div className={`relative overflow-hidden ${isCompact ? 'h-32' : 'h-56'}`}>
                    <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Simple overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                    {/* Clean badges */}
                    <div className="absolute top-3 left-3">
                        <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-medium px-2.5 py-1 rounded-full">
                            {event.price.amount === 0 ? 'Free' : event.price.min}
                        </span>
                    </div>

                    {/* Heart button */}
                    <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                        <FiHeart className="w-4 h-4 text-gray-600" />
                    </button>
                </div>

                {/* Content */}
                <div className={`p-5 ${isCompact ? 'p-4' : ''}`}>
                    <h3 className={`font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors ${isCompact ? 'text-sm' : 'text-base'
                        }`}>
                        {event.title}
                    </h3>

                    <p className={`text-gray-500 mb-3 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                        {event.date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: event.date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                        })} • {event.location.name}
                    </p>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Image
                                src={event.creator.avatar}
                                alt={event.creator.name}
                                width={20}
                                height={20}
                                className="rounded-full"
                            />
                            <span className={`text-gray-600 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                                {event.creator.name}
                            </span>
                        </div>

                        <span className={`text-gray-400 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                            {event.attendees} going
                        </span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

// Modern Creator Card
const CreatorCard = ({ creator }: { creator: Creator }) => (
    <Link href={`/creator/${creator.id}`}>
        <motion.div
            whileHover={{ y: -1 }}
            className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-sm transition-all duration-200"
        >
            <div className="relative">
                <Image
                    src={creator.avatarUrl}
                    alt={creator.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                />
                {creator.verified && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <FiCheck className="w-2.5 h-2.5 text-white" />
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{creator.name}</p>
                <p className="text-sm text-gray-500 truncate">{creator.bio}</p>
                <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-400">
                        {creator.followers >= 1000 ? `${(creator.followers / 1000).toFixed(1)}k` : creator.followers} followers
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-400">{creator.rating} ★</span>
                </div>
            </div>
        </motion.div>
    </Link>
);

// Main Component
export default function HomePage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [currentFilter, setCurrentFilter] = useState<FilterType>("all");
    const [currentCategory, setCurrentCategory] = useState<CategoryType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isMapOpen, setIsMapOpen] = useState(false);

    const categoryRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    const bannerY = useTransform(scrollY, [0, 500], [0, -150]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setEvents(PRODUCTION_EVENTS);
            setIsLoading(false);
        }, 600);
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
        <div className="min-h-screen bg-white">
            {/* Clean layout */}
            <div className="flex">
                {/* Main Content */}
                <div
                    className="flex-1 overflow-y-auto h-screen"
                    style={{ paddingRight: '380px' }}
                >
                    <div className="max-w-4xl mx-auto px-6 pt-6 pb-24">
                        {/* Hero Banner */}
                        <motion.div
                            className="mb-12 relative overflow-hidden rounded-3xl h-[420px]"
                            style={{ y: bannerY }}
                            whileHover={{ scale: 1.005 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {/* Clean gradient background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />

                            {/* Subtle pattern overlay */}
                            <div
                                className="absolute inset-0 opacity-10"
                                style={{
                                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                                    backgroundSize: '60px 60px'
                                }}
                            />

                            <div className="relative h-full flex flex-col justify-center p-12 text-white z-10">
                                <motion.div
                                    className="mb-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                        Live now
                                    </span>
                                </motion.div>

                                <motion.h1
                                    className="text-6xl font-bold mb-6 leading-tight"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    Discover amazing
                                    <br />events near you
                                </motion.h1>

                                <motion.p
                                    className="text-xl text-white/80 mb-8 max-w-lg leading-relaxed"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    From concerts to conferences, find experiences that inspire and connect you with your community.
                                </motion.p>

                                <motion.button
                                    className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-50 transition-colors w-fit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    Explore events
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Categories */}
                        <motion.div
                            className="mb-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900">Browse by category</h2>
                            </div>

                            <div className="relative">
                                <div className="overflow-x-auto scrollbar-hide" ref={categoryRef}>
                                    <div className="flex gap-2 pb-4">
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

                                {/* Modern scroll buttons */}
                                <button
                                    onClick={() => scrollCategories('left')}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center hover:shadow-lg transition-shadow"
                                >
                                    <FiChevronRight className="w-4 h-4 rotate-180" />
                                </button>
                                <button
                                    onClick={() => scrollCategories('right')}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white shadow-md rounded-full flex items-center justify-center hover:shadow-lg transition-shadow"
                                >
                                    <FiChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>

                        {/* Filters */}
                        <motion.div
                            className="flex gap-3 mb-10"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            {FILTERS.map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setCurrentFilter(filter.id as FilterType)}
                                    className={`
                                        px-6 py-3 rounded-full text-sm font-medium transition-all duration-200
                                        ${currentFilter === filter.id
                                            ? "bg-gray-900 text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }
                                    `}
                                >
                                    {filter.label}
                                    <span className="ml-2 text-xs opacity-60">
                                        {filter.count}
                                    </span>
                                </button>
                            ))}
                        </motion.div>

                        {/* Featured Events */}
                        {featuredEvents.length > 0 && !currentCategory && currentFilter === "all" && (
                            <motion.div
                                className="mb-12"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <h2 className="text-2xl font-semibold text-gray-900 mb-8">Featured events</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {featuredEvents.slice(0, 4).map((event, index) => (
                                        <motion.div
                                            key={event.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 * index }}
                                        >
                                            <EventCard event={event} variant="featured" />
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* All Events */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-semibold text-gray-900">
                                    {searchQuery ? `Results for "${searchQuery}"` :
                                        currentCategory ? `${CATEGORIES.find(c => c.id === currentCategory)?.label} events` :
                                            currentFilter !== "all" ? `${FILTERS.find(f => f.id === currentFilter)?.label} events` :
                                                "All events"}
                                </h2>
                                <span className="text-gray-500 text-sm">{filteredEvents.length} events</span>
                            </div>

                            {isLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[...Array(6)].map((_, index) => (
                                        <div key={index} className="bg-gray-50 rounded-2xl overflow-hidden animate-pulse">
                                            <div className="h-56 bg-gray-200" />
                                            <div className="p-5 space-y-3">
                                                <div className="h-4 bg-gray-200 rounded w-3/4" />
                                                <div className="h-3 bg-gray-200 rounded w-1/2" />
                                                <div className="h-3 bg-gray-200 rounded w-2/3" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : filteredEvents.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredEvents.map((event, index) => (
                                        <motion.div
                                            key={event.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.05 * index }}
                                        >
                                            <EventCard event={event} />
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20">
                                    <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                                        <FiSearch className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                                    <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
                                    <button
                                        onClick={() => {
                                            setCurrentFilter("all");
                                            setCurrentCategory(null);
                                            setSearchQuery("");
                                        }}
                                        className="px-6 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>

                {/* Clean Fixed Sidebar */}
                <div className="fixed top-0 right-0 w-[380px] h-screen bg-gray-50 overflow-y-auto">
                    <div className="p-6 space-y-8">
                        {/* Search */}
                        <div className="relative">
                            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search events..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all"
                            />
                        </div>

                        {/* Trending Events */}
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-2 h-2 bg-red-500 rounded-full" />
                                <h3 className="font-semibold text-gray-900">Trending now</h3>
                                <span className="text-sm text-gray-500">({trendingEvents.length})</span>
                            </div>

                            <div className="space-y-4">
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

                        {/* Top Creators */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-6">Top creators</h3>
                            <div className="space-y-1">
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
                        </div>
                    </div>
                </div>
            </div>

            {/* Clean Map Button */}
            <motion.button
                onClick={() => setIsMapOpen(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-8 py-4 rounded-full font-medium shadow-lg hover:bg-gray-800 transition-colors flex items-center gap-3"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
            >
                <BsGlobe className="w-4 h-4" />
                Show map
                <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                    {filteredEvents.length}
                </span>
            </motion.button>

            {/* Mapbox */}
            <MapboxFullScreen
                isOpen={isMapOpen}
                onClose={() => setIsMapOpen(false)}
                events={filteredEvents}
            />

            <style jsx global>{`
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
}