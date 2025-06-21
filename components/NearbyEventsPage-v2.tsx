/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback, useReducer, createContext, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useAnimation, useInView, PanInfo } from 'framer-motion';
import {
    FiMapPin, FiFilter, FiClock, FiCalendar, FiTag, FiHeart, FiCompass,
    FiChevronDown, FiList, FiGrid, FiChevronLeft, FiChevronRight, FiStar,
    FiX, FiMaximize2, FiNavigation, FiRefreshCw, FiSearch, FiInfo,
    FiSliders, FiUsers, FiCornerUpRight, FiCheck, FiArrowRight, FiTrendingUp,
    FiEye, FiBookmark, FiShare2, FiPhoneCall, FiMail, FiMoreHorizontal,
    FiPhone, FiExternalLink, FiDownload, FiCopy, FiMessageCircle, FiZoomIn,
    FiZoomOut, FiLayers, FiShuffle
} from 'react-icons/fi';
import { IoTicket, IoFitnessOutline, IoSparkles, IoShareOutline, IoBookmarkOutline, IoCalendarOutline } from 'react-icons/io5';
import { BsMusicNote, BsPalette, BsLaptop, BsCupHot, BsApple, BsWhatsapp } from 'react-icons/bs';

// ==================== TYPES ====================
interface NearbyEvent {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    distance: string;
    price: string;
    image: string;
    category: string;
    rating?: number;
    attendees?: number;
    isFeatured?: boolean;
    isLiked?: boolean;
    isBookmarked?: boolean;
    coordinates?: { lat: number; lng: number };
    tags?: string[];
    organiser?: string;
    description?: string;
    slug?: string;
    phone?: string;
    website?: string;
}

interface FilterState {
    categories: string[];
    dateRange: string | null;
    priceRange: [number, number];
    radius: number;
    sortBy: string;
    searchQuery: string;
}

interface MapState {
    isInitialized: boolean;
    isLoaded: boolean;
    selectedEvent: string | null;
    hoveredEvent: string | null;
    userLocation: { lat: number; lng: number } | null;
    zoom: number;
    style: string;
    showHeatmap: boolean;
    show3DBuildings: boolean;
    showRoutes: boolean;
    isFullscreen: boolean;
    center: { lat: number; lng: number };
}

interface UIState {
    viewMode: 'grid' | 'list' | 'map';
    isLoading: boolean;
    showFilters: boolean;
    showMapControls: boolean;
    isTransitioning: boolean;
    showShareSheet: boolean;
    shareEventId: string | null;
}

// ==================== STATE MANAGEMENT ====================
type FilterAction =
    | { type: 'TOGGLE_CATEGORY'; payload: string }
    | { type: 'SET_DATE_RANGE'; payload: string | null }
    | { type: 'SET_PRICE_RANGE'; payload: [number, number] }
    | { type: 'SET_RADIUS'; payload: number }
    | { type: 'SET_SORT'; payload: string }
    | { type: 'SET_SEARCH'; payload: string }
    | { type: 'RESET_FILTERS' };

const initialFilterState: FilterState = {
    categories: [],
    dateRange: null,
    priceRange: [0, 200],
    radius: 5,
    sortBy: 'distance',
    searchQuery: ''
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
    switch (action.type) {
        case 'TOGGLE_CATEGORY':
            return {
                ...state,
                categories: state.categories.includes(action.payload)
                    ? state.categories.filter(c => c !== action.payload)
                    : [...state.categories, action.payload]
            };
        case 'SET_DATE_RANGE':
            return { ...state, dateRange: action.payload };
        case 'SET_PRICE_RANGE':
            return { ...state, priceRange: action.payload };
        case 'SET_RADIUS':
            return { ...state, radius: action.payload };
        case 'SET_SORT':
            return { ...state, sortBy: action.payload };
        case 'SET_SEARCH':
            return { ...state, searchQuery: action.payload };
        case 'RESET_FILTERS':
            return initialFilterState;
        default:
            return state;
    }
}

// ==================== CONSTANTS ====================
const eventThumbnails = [
    'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80',
    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80',
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
];

const eventCategories = [
    { id: 'music', name: 'Music', icon: <BsMusicNote />, color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-50', textColor: 'text-purple-600', activeBg: 'bg-purple-500' },
    { id: 'art', name: 'Art', icon: <BsPalette />, color: 'from-pink-500 to-rose-500', bgColor: 'bg-pink-50', textColor: 'text-pink-600', activeBg: 'bg-pink-500' },
    { id: 'tech', name: 'Tech', icon: <BsLaptop />, color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50', textColor: 'text-blue-600', activeBg: 'bg-blue-500' },
    { id: 'food', name: 'Food', icon: <BsCupHot />, color: 'from-amber-500 to-orange-500', bgColor: 'bg-amber-50', textColor: 'text-amber-600', activeBg: 'bg-amber-500' },
    { id: 'sports', name: 'Sports', icon: <IoFitnessOutline />, color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50', textColor: 'text-green-600', activeBg: 'bg-green-500' },
    { id: 'nightlife', name: 'Nightlife', icon: <IoSparkles />, color: 'from-violet-500 to-purple-500', bgColor: 'bg-violet-50', textColor: 'text-violet-600', activeBg: 'bg-violet-500' },
];

const mockEvents: NearbyEvent[] = [
    {
        id: 'e1',
        title: 'Summer Music Festival 2025',
        date: 'Sat, Jun 21',
        time: '12:00 PM - 10:00 PM',
        location: 'Central Park Main Stage',
        distance: '0.8 km',
        price: '$50',
        image: eventThumbnails[0],
        category: 'music',
        rating: 4.8,
        attendees: 1240,
        isFeatured: true,
        isLiked: false,
        isBookmarked: false,
        coordinates: { lat: -1.286389, lng: 36.817223 },
        tags: ['outdoor', 'live music', 'festival'],
        organiser: 'MusicEvents Inc.',
        description: 'An amazing outdoor music festival featuring top artists',
        slug: 'summer-music-festival-2025',
        phone: '+1-555-0123',
        website: 'https://musicfestival.com'
    },
    {
        id: 'e2',
        title: 'Tech Innovation Summit',
        date: 'Mon, Jun 23',
        time: '9:00 AM - 6:00 PM',
        location: 'Innovation Hub',
        distance: '1.2 km',
        price: '$75',
        image: eventThumbnails[1],
        category: 'tech',
        rating: 4.5,
        attendees: 650,
        isFeatured: false,
        isLiked: true,
        isBookmarked: true,
        coordinates: { lat: -1.28395, lng: 36.823654 },
        tags: ['networking', 'startups', 'innovation'],
        organiser: 'TechEvents Ltd.',
        description: 'Connect with innovative minds in the tech industry',
        slug: 'tech-innovation-summit',
        phone: '+1-555-0456',
        website: 'https://techinnovation.com'
    },
    {
        id: 'e3',
        title: 'Culinary Masterclass',
        date: 'Tue, Jun 24',
        time: '7:00 PM - 9:30 PM',
        location: 'Gourmet Kitchen',
        distance: '1.5 km',
        price: '$120',
        image: eventThumbnails[2],
        category: 'food',
        rating: 4.9,
        attendees: 48,
        isFeatured: false,
        isLiked: false,
        isBookmarked: false,
        coordinates: { lat: -1.291634, lng: 36.812202 },
        tags: ['cooking', 'chef', 'gourmet'],
        organiser: 'Culinary Arts Academy',
        description: 'Learn from renowned chefs in an intimate setting',
        slug: 'culinary-masterclass',
        phone: '+1-555-0789',
        website: 'https://culinaryarts.com'
    },
    {
        id: 'e4',
        title: 'Digital Art Exhibition',
        date: 'Wed, Jun 25',
        time: '10:00 AM - 8:00 PM',
        location: 'Metropolitan Gallery',
        distance: '2.1 km',
        price: '$15',
        image: eventThumbnails[3],
        category: 'art',
        rating: 4.3,
        attendees: 320,
        isFeatured: false,
        isLiked: false,
        isBookmarked: false,
        coordinates: { lat: -1.279824, lng: 36.824726 },
        tags: ['digital art', 'exhibition', 'contemporary'],
        organiser: 'Modern Art Collective',
        description: 'Explore the future of digital creativity',
        slug: 'digital-art-exhibition',
        phone: '+1-555-0101',
        website: 'https://digitalart.com'
    },
    {
        id: 'e5',
        title: 'Fitness Bootcamp',
        date: 'Thu, Jun 26',
        time: '6:00 AM - 7:30 AM',
        location: 'Riverside Park',
        distance: '2.4 km',
        price: '$25',
        image: eventThumbnails[4],
        category: 'sports',
        rating: 4.7,
        attendees: 85,
        isFeatured: true,
        isLiked: false,
        isBookmarked: false,
        coordinates: { lat: -1.28023, lng: 36.809914 },
        tags: ['fitness', 'outdoor', 'health'],
        organiser: 'FitLife Community',
        description: 'Start your day with an energizing workout',
        slug: 'fitness-bootcamp',
        phone: '+1-555-0112',
        website: 'https://fitlife.com'
    },
    {
        id: 'e6',
        title: 'Rooftop Night Market',
        date: 'Fri, Jun 27',
        time: '6:00 PM - 12:00 AM',
        location: 'Sky Lounge',
        distance: '3.0 km',
        price: '$35',
        image: eventThumbnails[5],
        category: 'nightlife',
        rating: 4.6,
        attendees: 180,
        isFeatured: false,
        isLiked: true,
        isBookmarked: false,
        coordinates: { lat: -1.263987, lng: 36.80102 },
        tags: ['nightlife', 'rooftop', 'drinks'],
        organiser: 'Night Events Co.',
        description: 'Experience the city from above with great food and drinks',
        slug: 'rooftop-night-market',
        phone: '+1-555-0131',
        website: 'https://rooftopmarket.com'
    }
];

// ==================== CUSTOM HOOKS ====================
const useEvents = () => {
    const [events, setEvents] = useState<NearbyEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const toggleLike = useCallback((eventId: string) => {
        setEvents(prev => prev.map(event =>
            event.id === eventId ? { ...event, isLiked: !event.isLiked } : event
        ));
    }, []);

    const toggleBookmark = useCallback((eventId: string) => {
        setEvents(prev => prev.map(event =>
            event.id === eventId ? { ...event, isBookmarked: !event.isBookmarked } : event
        ));
    }, []);

    const filteredEvents = useMemo(() => {
        // This would apply actual filtering logic
        return events;
    }, [events]);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setEvents(mockEvents);
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    return { events: filteredEvents, isLoading, toggleLike, toggleBookmark };
};

const useMapState = () => {
    const [mapState, setMapState] = useState<MapState>({
        isInitialized: false,
        isLoaded: false,
        selectedEvent: null,
        hoveredEvent: null,
        userLocation: { lat: -1.286389, lng: 36.817223 },
        zoom: 13,
        style: 'streets',
        showHeatmap: false,
        show3DBuildings: false,
        showRoutes: false,
        isFullscreen: false,
        center: { lat: -1.286389, lng: 36.817223 }
    });

    const updateMapState = useCallback((updates: Partial<MapState>) => {
        setMapState(prev => ({ ...prev, ...updates }));
    }, []);

    return { mapState, updateMapState };
};

const useUIState = () => {
    const [uiState, setUIState] = useState<UIState>({
        viewMode: 'grid',
        isLoading: false,
        showFilters: false,
        showMapControls: false,
        isTransitioning: false,
        showShareSheet: false,
        shareEventId: null
    });

    const updateUIState = useCallback((updates: Partial<UIState>) => {
        setUIState(prev => ({ ...prev, ...updates }));
    }, []);

    return { uiState, updateUIState };
};

// ==================== NATIVE SHARE FUNCTIONS ====================
const shareEvent = async (event: NearbyEvent, type: 'native' | 'copy' | 'whatsapp' | 'sms') => {
    const shareText = `Check out "${event.title}" on ${event.date} at ${event.location}. ${event.description}`;
    const shareUrl = `${window.location.origin}/events/${event.slug}`;

    switch (type) {
        case 'native':
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: event.title,
                        text: shareText,
                        url: shareUrl,
                    });
                } catch (error) {
                    console.log('Error sharing:', error);
                }
            } else {
                // Fallback to clipboard
                await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
                alert('Event link copied to clipboard!');
            }
            break;
        case 'copy':
            await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
            break;
        case 'whatsapp':
            window.open(`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`);
            break;
        case 'sms':
            window.open(`sms:?body=${encodeURIComponent(`${shareText} ${shareUrl}`)}`);
            break;
    }
};

const addToCalendar = (event: NearbyEvent) => {
    const startDate = new Date(`${event.date} ${event.time.split(' - ')[0]}`).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = new Date(`${event.date} ${event.time.split(' - ')[1] || event.time.split(' - ')[0]}`).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const calendarUrl = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;

    const element = document.createElement('a');
    element.href = calendarUrl;
    element.download = `${event.slug}.ics`;
    element.click();
};

// ==================== COMPONENTS ====================

// iOS-Style Share Sheet
const ShareSheet = ({
    event,
    isOpen,
    onClose
}: {
    event: NearbyEvent | null;
    isOpen: boolean;
    onClose: () => void;
}) => {
    const shareOptions = [
        { id: 'native', icon: <IoShareOutline />, label: 'Share', action: () => event && shareEvent(event, 'native') },
        { id: 'copy', icon: <FiCopy />, label: 'Copy Link', action: () => event && shareEvent(event, 'copy') },
        { id: 'whatsapp', icon: <BsWhatsapp />, label: 'WhatsApp', action: () => event && shareEvent(event, 'whatsapp') },
        { id: 'sms', icon: <FiMessageCircle />, label: 'Messages', action: () => event && shareEvent(event, 'sms') },
        { id: 'calendar', icon: <IoCalendarOutline />, label: 'Add to Calendar', action: () => event && addToCalendar(event) },
    ];

    if (!event) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, y: '100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '100%' }}
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={0.1}
                        onDragEnd={(e, info: PanInfo) => {
                            if (info.offset.y > 100) onClose();
                        }}
                        className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl"
                    >
                        {/* Handle */}
                        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 mb-6" />

                        {/* Event Preview */}
                        <div className="px-6 pb-4 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="relative w-16 h-16 rounded-xl overflow-hidden">
                                    <Image
                                        src={event.image}
                                        alt={event.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{event.title}</h3>
                                    <p className="text-gray-600 text-sm">{event.date} • {event.location}</p>
                                </div>
                            </div>
                        </div>

                        {/* Share Options */}
                        <div className="px-6 py-6">
                            <div className="grid grid-cols-5 gap-4">
                                {shareOptions.map(option => (
                                    <motion.button
                                        key={option.id}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            option.action();
                                            onClose();
                                        }}
                                        className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-700">
                                            {option.icon}
                                        </div>
                                        <span className="text-xs text-gray-600 text-center">{option.label}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Cancel Button */}
                        <div className="px-6 pb-8">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onClose}
                                className="w-full py-4 bg-gray-100 text-gray-900 font-semibold rounded-2xl hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </motion.button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// Enhanced Interactive Map Component
const InteractiveMap = ({
    events,
    mapState,
    updateMapState
}: {
    events: NearbyEvent[];
    mapState: MapState;
    updateMapState: (updates: Partial<MapState>) => void;
}) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [markers, setMarkers] = useState<unknown[]>([]);

    // Map styles
    const mapStyles = [
        { id: 'streets', name: 'Streets', color: 'bg-blue-500' },
        { id: 'satellite', name: 'Satellite', color: 'bg-green-500' },
        { id: 'hybrid', name: 'Hybrid', color: 'bg-purple-500' },
        { id: 'terrain', name: 'Terrain', color: 'bg-orange-500' },
    ];

    const handleZoomIn = () => {
        updateMapState({ zoom: Math.min(mapState.zoom + 1, 18) });
    };

    const handleZoomOut = () => {
        updateMapState({ zoom: Math.max(mapState.zoom - 1, 1) });
    };

    const handleRecenter = () => {
        if (mapState.userLocation) {
            updateMapState({ center: mapState.userLocation });
        }
    };

    const selectedEvent = events.find(e => e.id === mapState.selectedEvent);

    return (
        <div className="relative h-[70vh] w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-gray-100">
            {/* Map Container */}
            <div
                ref={mapRef}
                className="w-full h-full relative bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            >
                {/* Simulated Event Markers */}
                {events.map((event, index) => (
                    <motion.div
                        key={event.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => updateMapState({ selectedEvent: event.id })}
                        className={`absolute w-8 h-8 rounded-full border-2 border-white shadow-lg cursor-pointer transition-all duration-200 ${mapState.selectedEvent === event.id ? 'z-20 scale-125' : 'z-10'
                            }`}
                        style={{
                            left: `${20 + (index % 3) * 25 + Math.random() * 10}%`,
                            top: `${30 + Math.floor(index / 3) * 20 + Math.random() * 10}%`,
                            backgroundColor: eventCategories.find(cat => cat.id === event.category)?.activeBg.replace('bg-', '') || '#f97316'
                        }}
                    >
                        <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                            {event.price.replace('$', '')}
                        </div>

                        {/* Pulse animation for selected event */}
                        {mapState.selectedEvent === event.id && (
                            <motion.div
                                initial={{ scale: 1, opacity: 0.6 }}
                                animate={{ scale: 2, opacity: 0 }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 rounded-full border-2 border-orange-500"
                            />
                        )}
                    </motion.div>
                ))}

                {/* Map Center Placeholder */}
                <div className="text-center text-gray-500">
                    <div className="w-20 h-20 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto border border-gray-200">
                        <FiMapPin size={32} className="text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Interactive Event Map</h3>
                    <p className="text-sm text-gray-600 max-w-xs">Click on markers to view event details. Zoom: {mapState.zoom}x</p>
                </div>
            </div>

            {/* Map Controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
                {/* Zoom Controls */}
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <motion.button
                        whileHover={{ backgroundColor: 'rgba(249, 115, 22, 0.1)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleZoomIn}
                        className="w-10 h-10 flex items-center justify-center border-b border-gray-200 text-gray-600 hover:text-orange-600"
                    >
                        <FiZoomIn size={16} />
                    </motion.button>
                    <motion.button
                        whileHover={{ backgroundColor: 'rgba(249, 115, 22, 0.1)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleZoomOut}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-orange-600"
                    >
                        <FiZoomOut size={16} />
                    </motion.button>
                </div>

                {/* Style Selector */}
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-2">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-green-500 border border-gray-300"
                        title="Change map style"
                    />
                </div>

                {/* Recenter Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRecenter}
                    className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-orange-600"
                    title="Recenter map"
                >
                    <FiNavigation size={16} />
                </motion.button>
            </div>

            {/* Fullscreen Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => updateMapState({ isFullscreen: !mapState.isFullscreen })}
                className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-orange-600"
            >
                <FiMaximize2 size={16} />
            </motion.button>

            {/* Selected Event Card */}
            <AnimatePresence>
                {selectedEvent && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 p-4"
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                                <Image
                                    src={selectedEvent.image}
                                    alt={selectedEvent.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 text-lg truncate">{selectedEvent.title}</h3>
                                <p className="text-gray-600 text-sm">{selectedEvent.date} • {selectedEvent.distance}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-orange-600 font-bold">{selectedEvent.price}</span>
                                    {selectedEvent.rating && (
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <FiStar size={12} className="text-yellow-500" fill="currentColor" />
                                            <span>{selectedEvent.rating}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Link href={`/events/${selectedEvent.slug}`}>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-xl hover:bg-orange-600 transition-colors"
                                    >
                                        View Details
                                    </motion.button>
                                </Link>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => updateMapState({ selectedEvent: null })}
                                    className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                                >
                                    <FiX size={16} />
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// Enhanced Event Card with iOS-style interactions
const EventCard = React.memo(({
    event,
    isCompact,
    onLike,
    onBookmark,
    onShare,
    onSelect,
    isSelected = false
}: {
    event: NearbyEvent;
    isCompact: boolean;
    onLike: () => void;
    onBookmark: () => void;
    onShare: () => void;
    onSelect: () => void;
    isSelected?: boolean;
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "50px" });
    const controls = useAnimation();

    const category = eventCategories.find(cat => cat.id === event.category);

    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        }
    }, [isInView, controls]);

    const variants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    const cardClass = `
        group relative bg-white rounded-2xl overflow-hidden
        border border-gray-100 hover:border-gray-200
        shadow-sm hover:shadow-xl
        transition-all duration-500 ease-out
        cursor-pointer
        ${isSelected ? 'ring-2 ring-orange-500 ring-offset-2' : ''}
        ${event.isFeatured ? 'bg-gradient-to-br from-white via-white to-orange-50' : ''}
    `;

    const eventUrl = `/events/${event.slug || event.id}`;

    if (isCompact) {
        return (
            <motion.div
                ref={ref}
                initial="hidden"
                animate={controls}
                variants={variants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                whileTap={{ scale: 0.98 }}
                className={cardClass}
                onClick={onSelect}
            >
                <Link href={eventUrl} className="block">
                    {/* Featured Badge */}
                    {event.isFeatured && (
                        <div className="absolute top-3 left-3 z-10">
                            <div className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                                <FiStar size={10} fill="currentColor" />
                                Featured
                            </div>
                        </div>
                    )}

                    {/* Image Container */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            priority={event.isFeatured}
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Distance Badge */}
                        <div className="absolute bottom-3 left-3">
                            <div className="flex items-center gap-1 bg-black/20 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full">
                                <FiMapPin size={10} />
                                {event.distance}
                            </div>
                        </div>

                        {/* Category Badge */}
                        {category && (
                            <div className="absolute top-3 right-3">
                                <div className={`${category.bgColor} ${category.textColor} backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1`}>
                                    <span className="w-3 h-3">{category.icon}</span>
                                    {category.name}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="absolute bottom-3 right-3 flex gap-2">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onBookmark();
                                }}
                                className={`w-8 h-8 rounded-full backdrop-blur-sm border flex items-center justify-center transition-all duration-200 ${event.isBookmarked
                                    ? 'bg-blue-500 border-blue-500 text-white'
                                    : 'bg-white/80 border-white/20 text-gray-600 hover:bg-white hover:text-blue-500'
                                    }`}
                            >
                                <FiBookmark fill={event.isBookmarked ? 'currentColor' : 'none'} size={14} />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onLike();
                                }}
                                className={`w-8 h-8 rounded-full backdrop-blur-sm border flex items-center justify-center transition-all duration-200 ${event.isLiked
                                    ? 'bg-red-500 border-red-500 text-white'
                                    : 'bg-white/80 border-white/20 text-gray-600 hover:bg-white hover:text-red-500'
                                    }`}
                            >
                                <FiHeart fill={event.isLiked ? 'currentColor' : 'none'} size={14} />
                            </motion.button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-orange-600 transition-colors">
                            {event.title}
                        </h3>

                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                            <FiClock size={10} />
                            <span>{event.date} • {event.time}</span>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-gray-600 mb-3">
                            <FiMapPin size={10} />
                            <span className="truncate">{event.location}</span>
                        </div>

                        {/* Stats */}
                        {(event.rating || event.attendees) && (
                            <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
                                {event.rating && (
                                    <div className="flex items-center gap-1">
                                        <FiStar size={10} className="text-yellow-500" fill="currentColor" />
                                        <span>{event.rating}</span>
                                    </div>
                                )}
                                {event.attendees && (
                                    <div className="flex items-center gap-1">
                                        <FiUsers size={10} />
                                        <span>{event.attendees}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Price & Share */}
                        <div className="flex items-center justify-between">
                            <span className="text-orange-600 font-bold text-sm">{event.price}</span>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onShare();
                                }}
                                className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-all duration-200"
                            >
                                <IoShareOutline size={14} />
                            </motion.button>
                        </div>
                    </div>
                </Link>
            </motion.div>
        );
    }

    // List view (similar structure with layout adjustments)
    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={variants}
            whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
            className={cardClass}
            onClick={onSelect}
        >
            <Link href={eventUrl} className="flex flex-col sm:flex-row">
                {/* Image */}
                <div className="relative w-full sm:w-64 h-48 sm:h-auto flex-shrink-0 overflow-hidden">
                    <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 256px"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        priority={event.isFeatured}
                    />

                    {/* Similar overlay and badge structure as compact version */}
                    {/* ... (rest of the list view implementation) */}
                </div>

                {/* Content - similar to compact but with more detail */}
                {/* ... (rest of the list view content) */}
            </Link>
        </motion.div>
    );
});

EventCard.displayName = 'EventCard';

// Enhanced Filter Panel with better UX
const FilterPanel = ({
    filterState,
    dispatch,
    isOpen,
    onClose
}: {
    filterState: FilterState;
    dispatch: React.Dispatch<FilterAction>;
    isOpen: boolean;
    onClose: () => void;
}) => {
    const radiusOptions = [1, 5, 10, 25, 50, 100];
    const dateOptions = [
        { id: 'today', name: 'Today', icon: <FiClock />, gradient: 'from-blue-500 to-cyan-500' },
        { id: 'tomorrow', name: 'Tomorrow', icon: <FiClock />, gradient: 'from-purple-500 to-pink-500' },
        { id: 'this-weekend', name: 'This Weekend', icon: <FiCalendar />, gradient: 'from-green-500 to-emerald-500' },
        { id: 'this-week', name: 'This Week', icon: <FiCalendar />, gradient: 'from-orange-500 to-red-500' },
        { id: 'this-month', name: 'This Month', icon: <FiCalendar />, gradient: 'from-violet-500 to-purple-500' },
    ];

    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (filterState.categories.length > 0) count += filterState.categories.length;
        if (filterState.dateRange) count++;
        if (filterState.searchQuery) count++;
        if (filterState.priceRange[0] > 0 || filterState.priceRange[1] < 200) count++;
        if (filterState.radius !== 5) count++;
        return count;
    }, [filterState]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 320 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 320 }}
                        className="fixed right-0 top-0 bottom-0 w-96 bg-white shadow-2xl z-50 overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-xl">Filters</h3>
                                    {activeFiltersCount > 0 && (
                                        <p className="text-sm text-orange-600 font-medium">
                                            {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
                                        </p>
                                    )}
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={onClose}
                                    className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                >
                                    <FiX size={18} />
                                </motion.button>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => dispatch({ type: 'RESET_FILTERS' })}
                                    className="flex-1 py-2 text-gray-600 text-sm font-medium hover:text-gray-800 transition-colors"
                                >
                                    Reset All
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onClose}
                                    className="flex-1 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-medium rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200"
                                >
                                    Apply
                                </motion.button>
                            </div>
                        </div>

                        <div className="p-6 space-y-8">
                            {/* Search */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-3">Search Events</label>
                                <div className="relative">
                                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search by name, location..."
                                        value={filterState.searchQuery}
                                        onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-gray-50 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>

                            {/* Categories */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-4">Categories</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {eventCategories.map(category => (
                                        <motion.button
                                            key={category.id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => dispatch({ type: 'TOGGLE_CATEGORY', payload: category.id })}
                                            className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-medium transition-all duration-200 ${filterState.categories.includes(category.id)
                                                ? `${category.activeBg} text-white shadow-lg`
                                                : `${category.bgColor} ${category.textColor} hover:scale-105`
                                                }`}
                                        >
                                            <span className="w-5 h-5">{category.icon}</span>
                                            <span>{category.name}</span>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Date Range */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-4">When</label>
                                <div className="space-y-3">
                                    {dateOptions.map(option => (
                                        <motion.button
                                            key={option.id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => dispatch({
                                                type: 'SET_DATE_RANGE',
                                                payload: filterState.dateRange === option.id ? null : option.id
                                            })}
                                            className={`w-full p-4 rounded-2xl flex items-center gap-4 text-sm font-medium transition-all duration-200 ${filterState.dateRange === option.id
                                                ? `bg-gradient-to-r ${option.gradient} text-white shadow-lg`
                                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            <span className="w-5 h-5">{option.icon}</span>
                                            <span>{option.name}</span>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Distance */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-4">
                                    Distance: <span className="text-orange-600 font-bold">{filterState.radius} km</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="range"
                                        min="0"
                                        max={radiusOptions.length - 1}
                                        step="1"
                                        value={radiusOptions.indexOf(filterState.radius)}
                                        onChange={(e) => dispatch({
                                            type: 'SET_RADIUS',
                                            payload: radiusOptions[parseInt(e.target.value)]
                                        })}
                                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                                        {radiusOptions.map((radius, index) => (
                                            <span key={index} className={filterState.radius === radius ? 'text-orange-600 font-semibold' : ''}>
                                                {radius}km
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-4">
                                    Price Range: <span className="text-orange-600 font-bold">${filterState.priceRange[0]} - ${filterState.priceRange[1]}</span>
                                </label>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-gray-500 mb-1 block">Minimum: ${filterState.priceRange[0]}</label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="200"
                                            step="5"
                                            value={filterState.priceRange[0]}
                                            onChange={(e) => dispatch({
                                                type: 'SET_PRICE_RANGE',
                                                payload: [parseInt(e.target.value), filterState.priceRange[1]]
                                            })}
                                            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 mb-1 block">Maximum: ${filterState.priceRange[1]}</label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="200"
                                            step="5"
                                            value={filterState.priceRange[1]}
                                            onChange={(e) => dispatch({
                                                type: 'SET_PRICE_RANGE',
                                                payload: [filterState.priceRange[0], parseInt(e.target.value)]
                                            })}
                                            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

FilterPanel.displayName = 'FilterPanel';

// View Mode Switcher
const ViewModeSwitcher = ({
    viewMode,
    onViewChange
}: {
    viewMode: string;
    onViewChange: (mode: 'grid' | 'list' | 'map') => void;
}) => {
    const modes = [
        { id: 'grid', icon: FiGrid, label: 'Grid' },
        { id: 'list', icon: FiList, label: 'List' },
        { id: 'map', icon: FiMapPin, label: 'Map' }
    ];

    return (
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl flex overflow-hidden shadow-sm">
            {modes.map(mode => {
                const Icon = mode.icon;
                return (
                    <motion.button
                        key={mode.id}
                        whileHover={{ backgroundColor: viewMode !== mode.id ? 'rgba(255, 87, 34, 0.1)' : undefined }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onViewChange(mode.id as 'grid' | 'list' | 'map')}
                        className={`p-3 transition-all duration-200 relative ${viewMode === mode.id
                            ? 'bg-orange-500 text-white shadow-sm'
                            : 'text-gray-600 hover:text-orange-600'
                            }`}
                        aria-label={`${mode.label} view`}
                    >
                        <Icon size={18} />
                        {viewMode === mode.id && (
                            <motion.div
                                layoutId="activeView"
                                className="absolute inset-0 bg-orange-500 rounded-lg -z-10"
                            />
                        )}
                    </motion.button>
                );
            })}
        </div>
    );
};

ViewModeSwitcher.displayName = 'ViewModeSwitcher';

// Loading Skeleton
const LoadingSkeleton = ({ isCompact }: { isCompact: boolean }) => {
    const skeletonItems = Array(8).fill(0);

    return (
        <div className={isCompact
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-6"
        }>
            {skeletonItems.map((_, index) => (
                <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                    {isCompact ? (
                        <>
                            <div className="aspect-[4/3] bg-gray-200" />
                            <div className="p-4">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                                <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
                                <div className="h-3 bg-gray-200 rounded w-full mb-4" />
                                <div className="flex justify-between items-center">
                                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                                    <div className="w-8 h-8 rounded-full bg-gray-200" />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col sm:flex-row">
                            <div className="w-full sm:w-64 h-48 bg-gray-200 flex-shrink-0" />
                            <div className="p-6 flex-1">
                                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                                <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
                                <div className="h-3 bg-gray-200 rounded w-full mb-4" />
                                <div className="h-3 bg-gray-200 rounded w-2/3" />
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

LoadingSkeleton.displayName = 'LoadingSkeleton';

// Main Component
export default function EnhancedNearbyEvents() {
    const { events, isLoading, toggleLike, toggleBookmark } = useEvents();
    const { mapState, updateMapState } = useMapState();
    const { uiState, updateUIState } = useUIState();
    const [filterState, dispatch] = useReducer(filterReducer, initialFilterState);

    const filterRef = useRef<HTMLDivElement>(null);

    // Active filter count
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filterState.categories.length > 0) count++;
        if (filterState.dateRange) count++;
        if (filterState.searchQuery) count++;
        if (filterState.priceRange[0] > 0 || filterState.priceRange[1] < 200) count++;
        if (filterState.radius !== 5) count++;
        return count;
    }, [filterState]);

    // Handle view mode change
    const handleViewModeChange = useCallback((mode: 'grid' | 'list' | 'map') => {
        updateUIState({ isTransitioning: true });

        setTimeout(() => {
            updateUIState({ viewMode: mode, isTransitioning: false });
        }, 300);
    }, [updateUIState]);

    // Handle share
    const handleShare = useCallback((eventId: string) => {
        updateUIState({ showShareSheet: true, shareEventId: eventId });
    }, [updateUIState]);

    // Handle click outside filters
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                updateUIState({ showFilters: false });
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [updateUIState]);

    const shareEvent = events.find(e => e.id === uiState.shareEventId);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
            {/* Enhanced Header */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-30">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        {/* Title Section */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex-1"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                    <FiMapPin size={24} />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">Discover Events</h1>
                                    <p className="text-gray-600 flex items-center gap-1">
                                        <FiTrendingUp size={14} />
                                        {events.length} events within {filterState.radius} km
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Controls */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-4 flex-wrap"
                        >
                            {/* Sort Dropdown */}
                            <div className="relative">
                                <select
                                    value={filterState.sortBy}
                                    onChange={(e) => dispatch({ type: 'SET_SORT', payload: e.target.value })}
                                    className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-sm px-4 py-3 pr-10 appearance-none shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent min-w-[140px]"
                                >
                                    <option value="distance">Nearest First</option>
                                    <option value="price">Price: Low to High</option>
                                    <option value="rating">Highest Rated</option>
                                    <option value="popularity">Most Popular</option>
                                </select>
                                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>

                            {/* View Mode Switcher */}
                            <ViewModeSwitcher
                                viewMode={uiState.viewMode}
                                onViewChange={handleViewModeChange}
                            />

                            {/* Filters Button */}
                            <div className="relative" ref={filterRef}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => updateUIState({ showFilters: !uiState.showFilters })}
                                    className={`px-4 py-3 rounded-xl border flex items-center gap-2 text-sm font-medium transition-all duration-200 ${activeFilterCount > 0
                                        ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/25'
                                        : 'bg-white/80 backdrop-blur-sm text-gray-700 border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                                        }`}
                                >
                                    <FiFilter size={16} />
                                    <span>Filters</span>
                                    {activeFilterCount > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="w-5 h-5 rounded-full bg-white text-orange-500 text-xs flex items-center justify-center font-bold"
                                        >
                                            {activeFilterCount}
                                        </motion.span>
                                    )}
                                </motion.button>

                                <FilterPanel
                                    filterState={filterState}
                                    dispatch={dispatch}
                                    isOpen={uiState.showFilters}
                                    onClose={() => updateUIState({ showFilters: false })}
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {/* Loading State */}
                {isLoading && <LoadingSkeleton isCompact={uiState.viewMode === 'grid'} />}

                {/* View Transition */}
                <AnimatePresence mode="wait">
                    {uiState.isTransitioning && (
                        <motion.div
                            key="transition"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-white/80 backdrop-blur-sm z-20 flex items-center justify-center"
                        >
                            <div className="w-16 h-16 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* No Events Found */}
                {!isLoading && events.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
                            <FiMapPin size={48} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">No events found nearby</h2>
                        <p className="text-gray-600 max-w-md mb-8">
                            We couldn&apos;t find any events matching your criteria. Try adjusting your filters or expanding your search radius.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => dispatch({ type: 'RESET_FILTERS' })}
                            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            Reset Filters
                        </motion.button>
                    </motion.div>
                )}

                {/* Map View */}
                {!isLoading && events.length > 0 && uiState.viewMode === 'map' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative"
                    >
                        <InteractiveMap
                            events={events}
                            mapState={mapState}
                            updateMapState={updateMapState}
                        />
                    </motion.div>
                )}

                {/* List View */}
                {!isLoading && events.length > 0 && uiState.viewMode === 'list' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        {events.map((event, index) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                isCompact={false}
                                onLike={() => toggleLike(event.id)}
                                onBookmark={() => toggleBookmark(event.id)}
                                onShare={() => handleShare(event.id)}
                                onSelect={() => updateMapState({ selectedEvent: event.id })}
                                isSelected={mapState.selectedEvent === event.id}
                            />
                        ))}
                    </motion.div>
                )}

                {/* Grid View */}
                {!isLoading && events.length > 0 && uiState.viewMode === 'grid' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {events.map((event, index) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                isCompact={true}
                                onLike={() => toggleLike(event.id)}
                                onBookmark={() => toggleBookmark(event.id)}
                                onShare={() => handleShare(event.id)}
                                onSelect={() => updateMapState({ selectedEvent: event.id })}
                                isSelected={mapState.selectedEvent === event.id}
                            />
                        ))}
                    </motion.div>
                )}

                {/* Enhanced Pagination */}
                {!isLoading && events.length > 0 && uiState.viewMode !== 'map' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center mt-12"
                    >
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-gray-200">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 disabled:opacity-50 transition-colors"
                                disabled
                            >
                                <FiChevronLeft />
                            </motion.button>

                            {[1, 2, 3].map(page => (
                                <motion.button
                                    key={page}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-medium transition-all duration-200 ${page === 1
                                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                                        : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {page}
                                </motion.button>
                            ))}

                            <span className="text-gray-400 px-2">...</span>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-10 h-10 rounded-xl text-gray-700 hover:bg-gray-100 flex items-center justify-center font-medium transition-colors"
                            >
                                8
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors"
                            >
                                <FiChevronRight />
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Share Sheet */}
            <ShareSheet
                event={shareEvent ?? null}
                isOpen={uiState.showShareSheet}
                onClose={() => updateUIState({ showShareSheet: false, shareEventId: null })}
            />

            {/* Custom Styles */}
            <style jsx global>{`
                .slider::-webkit-slider-thumb {
                    appearance: none;
                    height: 24px;
                    width: 24px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #ff5722, #e91e63);
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(255, 87, 34, 0.4);
                    border: 2px solid white;
                }

                .slider::-moz-range-thumb {
                    height: 24px;
                    width: 24px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #ff5722, #e91e63);
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 4px 12px rgba(255, 87, 34, 0.4);
                }

                .line-clamp-1 {
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
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