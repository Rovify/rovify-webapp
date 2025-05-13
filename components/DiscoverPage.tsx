'use client';

import { useState, useEffect } from 'react';
// import Link from 'next/link';
import { mockEvents } from '@/mocks/data/events';
import { EventCategory, Event } from '@/types';
import EventCard from '@/components/EventCard';
import EventCardSkeleton from '@/components/skeletons/EventCardSkeleton';
import BottomNavigation from '@/components/BottomNavigation';
import Header from '@/components/Header';
import { FiSearch, FiMap, FiList } from 'react-icons/fi';

export default function DiscoverPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [activeFilter, setActiveFilter] = useState<EventCategory | 'ALL'>('ALL');
    const [isLoading, setIsLoading] = useState(true);
    const [isMapView, setIsMapView] = useState(true);

    useEffect(() => {
        // Simulate API fetch delay
        const timer = setTimeout(() => {
            setEvents(mockEvents);
            setIsLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    // Filter events based on selected category
    const filteredEvents = activeFilter === 'ALL'
        ? events
        : events.filter(event => event.category === activeFilter);

    // Categories for filter
    const categories = ['ALL', 'MUSIC', 'CONFERENCE', 'ART', 'GAMING', 'FILM', 'TECHNOLOGY'];

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Header />

            <main className="pt-24 pb-28">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Discover Events</h1>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsMapView(true)}
                                className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${isMapView
                                    ? 'bg-[#FF5722] text-white shadow-md'
                                    : 'bg-white text-gray-700 border border-gray-200'
                                    }`}
                            >
                                <FiMap className="w-5 h-5" />
                            </button>

                            <button
                                onClick={() => setIsMapView(false)}
                                className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${!isMapView
                                    ? 'bg-[#FF5722] text-white shadow-md'
                                    : 'bg-white text-gray-700 border border-gray-200'
                                    }`}
                            >
                                <FiList className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative mb-4">
                        <input
                            type="text"
                            placeholder="Search for events, locations, or categories..."
                            className="w-full py-3 pl-12 pr-4 bg-white rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF5722] shadow-sm"
                        />
                        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>

                    {/* Category Filters */}
                    <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveFilter(category as EventCategory | 'ALL')}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeFilter === category
                                    ? 'bg-[#FF5722] text-white shadow-sm'
                                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                                    }`}
                            >
                                {category === 'ALL' ? 'All Events' : category.charAt(0) + category.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Map or List View */}
                <div className="relative h-[calc(100vh-220px)]">
                    {isLoading ? (
                        isMapView ? (
                            // Map View Loading Skeleton
                            <div className="h-full relative bg-gray-100">
                                <div className="absolute inset-0 opacity-30 pointer-events-none">
                                    <div className="w-full h-full bg-gray-200 animate-pulse">
                                        {/* Map Grid Pattern */}
                                        <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                            <defs>
                                                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e5e5e5" strokeWidth="0.5" />
                                                </pattern>
                                            </defs>
                                            <rect width="100" height="100" fill="url(#grid)" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Map Pin Skeletons */}
                                {[...Array(8)].map((_, index) => {
                                    const left = 20 + (index * 10) % 60;
                                    const top = 30 + (index * 15) % 40;
                                    return (
                                        <div
                                            key={index}
                                            className="absolute w-4 h-4 rounded-full bg-gray-300 animate-pulse"
                                            style={{
                                                left: `${left}%`,
                                                top: `${top}%`,
                                                animationDelay: `${index * 0.1}s`
                                            }}
                                        ></div>
                                    );
                                })}

                                {/* Selected Event Card Skeleton */}
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-xs px-4">
                                    <EventCardSkeleton />
                                </div>
                            </div>
                        ) : (
                            // List View Loading Skeleton
                            <div className="container mx-auto px-4 py-6 overflow-y-auto h-full">
                                <div className="grid grid-cols-1 gap-4">
                                    {[...Array(5)].map((_, index) => (
                                        <EventCardSkeleton key={index} variant="compact" />
                                    ))}
                                </div>
                            </div>
                        )
                    ) : (
                        isMapView ? (
                            // Map View Content
                            <div className="h-full relative">
                                {/* Map Placeholder */}
                                <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200">
                                    <div className="absolute inset-0 opacity-30 pointer-events-none">
                                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                            <defs>
                                                <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                                                    <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#e5e5e5" strokeWidth="0.5" />
                                                </pattern>
                                            </defs>
                                            <rect width="100%" height="100%" fill="url(#grid)" />
                                        </svg>
                                    </div>

                                    {/* Event Pins */}
                                    {filteredEvents.map((event) => (
                                        <button
                                            key={event.id}
                                            onClick={() => setSelectedEvent(event)}
                                            className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                                            style={{
                                                left: `${(event.location.coordinates.lng + 180) / 360 * 100}%`,
                                                top: `${(90 - event.location.coordinates.lat) / 180 * 100}%`
                                            }}
                                        >
                                            <div className={`w-4 h-4 rounded-full ${selectedEvent?.id === event.id
                                                ? 'bg-[#FF5722]'
                                                : event.hasNftTickets
                                                    ? 'bg-[#FF5722]/70'
                                                    : 'bg-[#FF5722]/50'
                                                } shadow-lg shadow-black/20 z-10 relative`}>
                                                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 translate-y-full w-0.5 h-3 bg-white/60"></span>
                                            </div>

                                            {/* Pin Animation */}
                                            <div className={`absolute inset-0 rounded-full bg-[#FF5722] opacity-30 scale-0 group-hover:scale-[3] transition-transform duration-700 ${selectedEvent?.id === event.id ? 'animate-ping' : ''
                                                }`}></div>

                                            {/* Hover Tooltip */}
                                            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform origin-bottom pointer-events-none">
                                                <div className="bg-white shadow-md rounded-lg py-1 px-2 whitespace-nowrap text-xs">
                                                    {event.title}
                                                </div>
                                            </div>
                                        </button>
                                    ))}

                                    {/* Selected Event Card */}
                                    {selectedEvent && (
                                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-xs px-4">
                                            <div className="relative">
                                                <button
                                                    onClick={() => setSelectedEvent(null)}
                                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white flex items-center justify-center z-10 shadow-md"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                                <EventCard event={selectedEvent} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            // List View Content
                            <div className="container mx-auto px-4 py-6 overflow-y-auto h-full">
                                <div className="grid grid-cols-1 gap-4">
                                    {filteredEvents.length > 0 ? (
                                        filteredEvents.map((event) => (
                                            <EventCard key={event.id} event={event} variant="compact" />
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-16 text-center">
                                            <div className="h-16 w-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FF5722]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-xl font-semibold mb-2">No events found</h3>
                                            <p className="text-gray-500 mb-6">Try adjusting your filters or check back later</p>
                                            <button
                                                onClick={() => setActiveFilter('ALL')}
                                                className="bg-white hover:bg-gray-50 border border-gray-200 transition-colors rounded-full px-6 py-2 font-medium"
                                            >
                                                Reset Filters
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    )}
                </div>
            </main>

            <BottomNavigation />

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
                
                @keyframes ping {
                    75%, 100% {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
                
                .animate-ping {
                    animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
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
}