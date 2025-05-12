'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockEvents } from '@/mocks/data/events';
import { EventCategory, Event } from '@/types';
import EventCard from '@/components/EventCard';

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
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    // Filter events based on selected category
    const filteredEvents = activeFilter === 'ALL'
        ? events
        : events.filter(event => event.category === activeFilter);

    return (
        <div className="min-h-screen bg-gradient-to-br from-rovify-black to-black text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-rovify-black/70 border-b border-white/10">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex justify-between items-center mb-3">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-rovify-orange to-rovify-lavender flex items-center justify-center">
                                <span className="text-white font-bold">R</span>
                            </div>
                            <span className="text-xl font-bold tracking-tight">Rovify</span>
                        </Link>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsMapView(true)}
                                className={`h-10 w-10 rounded-full flex items-center justify-center ${isMapView ? 'bg-rovify-orange' : 'bg-white/10'
                                    }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                            </button>

                            <button
                                onClick={() => setIsMapView(false)}
                                className={`h-10 w-10 rounded-full flex items-center justify-center ${!isMapView ? 'bg-rovify-orange' : 'bg-white/10'
                                    }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative mb-3">
                        <input
                            type="text"
                            placeholder="Search for events, locations, or categories..."
                            className="w-full bg-white/10 text-white rounded-full px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-rovify-lavender"
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/60 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {/* Category Filters */}
                    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
                        {['ALL', 'MUSIC', 'CONFERENCE', 'ART', 'GAMING', 'FILM', 'TECHNOLOGY'].map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveFilter(category as EventCategory | 'ALL')}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${activeFilter === category
                                    ? 'bg-gradient-to-r from-rovify-orange to-rovify-lavender text-white'
                                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                                    }`}
                            >
                                {category === 'ALL' ? 'All Events' : category.charAt(0) + category.slice(1).toLowerCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <main className="relative h-[calc(100vh-140px)]">
                {isLoading ? (
                    <div className="h-full flex items-center justify-center">
                        <div className="animate-spin h-10 w-10 border-4 border-rovify-lavender rounded-full border-t-transparent"></div>
                    </div>
                ) : (
                    <>
                        {isMapView ? (
                            <div className="h-full relative">
                                {/* Map Placeholder - Would be replaced with actual Mapbox integration */}
                                <div className="h-full w-full bg-gradient-to-br from-gray-900 to-rovify-black">
                                    <div className="absolute inset-0 opacity-30 pointer-events-none">
                                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                            <defs>
                                                <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                                                    <path d="M 80 0 L 0 0 0 80" fill="none" stroke="white" strokeWidth="0.5" />
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
                                                ? 'bg-rovify-orange'
                                                : event.hasNftTickets
                                                    ? 'bg-rovify-lavender'
                                                    : 'bg-rovify-blue'
                                                } shadow-lg shadow-black/50 z-10 relative`}>
                                                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 translate-y-full w-0.5 h-3 bg-white/30"></span>
                                            </div>

                                            {/* Pin Animation */}
                                            <div className={`absolute inset-0 rounded-full bg-rovify-orange opacity-30 scale-0 group-hover:scale-200 transition-transform duration-700 ${selectedEvent?.id === event.id ? 'animate-ping' : ''
                                                }`}></div>

                                            {/* Hover Tooltip */}
                                            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform origin-bottom pointer-events-none">
                                                <div className="bg-rovify-black/90 backdrop-blur-md rounded-lg py-1 px-2 whitespace-nowrap text-xs">
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
                                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-rovify-black flex items-center justify-center z-10"
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
                            <div className="container mx-auto px-4 py-6 overflow-y-auto h-full">
                                <div className="grid grid-cols-1 gap-4">
                                    {filteredEvents.length > 0 ? (
                                        filteredEvents.map((event) => (
                                            <EventCard key={event.id} event={event} variant="compact" />
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-16 text-center">
                                            <div className="h-16 w-16 mb-4 rounded-full bg-white/10 flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rovify-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-xl font-semibold mb-2">No events found</h3>
                                            <p className="text-white/70 mb-6">Try adjusting your filters or check back later</p>
                                            <button
                                                onClick={() => setActiveFilter('ALL')}
                                                className="bg-white/10 hover:bg-white/20 transition-colors rounded-full px-6 py-2 text-white font-medium"
                                            >
                                                Reset Filters
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-rovify-black/90 backdrop-blur-md border-t border-white/10 py-2 z-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-around items-center">
                        <Link href="/" className="flex flex-col items-center p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span className="text-xs">Home</span>
                        </Link>

                        <Link href="/discover" className="flex flex-col items-center p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rovify-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            <span className="text-xs">Map</span>
                        </Link>

                        <Link href="/create" className="relative">
                            <div className="absolute inset-0 rounded-full bg-white/10 blur-md opacity-80"></div>
                            <div className="relative h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                        </Link>

                        <Link href="/tickets" className="flex flex-col items-center p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                            <span className="text-xs">Tickets</span>
                        </Link>

                        <Link href="/profile" className="flex flex-col items-center p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="text-xs">Profile</span>
                        </Link>
                    </div>
                </div>
            </nav>
        </div>
    );
}