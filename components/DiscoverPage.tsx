/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { mockEvents } from '@/mocks/data/events';
import { EventCategory, Event } from '@/types';
import EventCard from '@/components/EventCard';
import EventCardSkeleton from '@/components/skeletons/EventCardSkeleton';
import { FiSearch, FiMap, FiList, FiFilter, FiX, FiCalendar, FiDollarSign, FiTag, FiCheck, FiHash } from 'react-icons/fi';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set your Mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoicmtuZCIsImEiOiJjbWFwbTEzajAwMDVxMmlxeHY1dDdyY3h6In0.OQrYFVmEq-QL95nnbh1jTQ';

// Define filter types
interface DateFilter {
    label: string;
    value: string;
    selected: boolean;
}

interface PriceFilter {
    label: string;
    value: string;
    selected: boolean;
}

interface FeatureFilter {
    label: string;
    value: string;
    selected: boolean;
    color?: string;
}

// Ensure Event type is extended with features
interface ExtendedEvent extends Event {
    features?: string[];
}

export default function DiscoverPage() {
    const [events, setEvents] = useState<ExtendedEvent[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<ExtendedEvent | null>(null);
    const [activeFilter, setActiveFilter] = useState<EventCategory | 'ALL'>('ALL');
    const [isLoading, setIsLoading] = useState(true);
    const [isMapView, setIsMapView] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Advanced filter states
    const [dateFilters, setDateFilters] = useState<DateFilter[]>([
        { label: 'Today', value: 'today', selected: false },
        { label: 'This Weekend', value: 'weekend', selected: false },
        { label: 'This Week', value: 'week', selected: false },
        { label: 'This Month', value: 'month', selected: false },
    ]);

    const [priceFilters, setPriceFilters] = useState<PriceFilter[]>([
        { label: 'Free', value: 'free', selected: false },
        { label: 'Under $25', value: 'under25', selected: false },
        { label: '$25 - $50', value: '25-50', selected: false },
        { label: '$50 - $100', value: '50-100', selected: false },
        { label: '$100+', value: '100plus', selected: false },
    ]);

    const [featureFilters, setFeatureFilters] = useState<FeatureFilter[]>([
        { label: 'NFT Tickets', value: 'nft', selected: false, color: '#FF5722' },
        { label: 'Free Parking', value: 'parking', selected: false },
        { label: 'Accessible', value: 'accessible', selected: false },
        { label: 'Family Friendly', value: 'family', selected: false },
    ]);

    const [activeFilterCount, setActiveFilterCount] = useState(0);
    const [showFilterCount, setShowFilterCount] = useState(false);

    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const markers = useRef<mapboxgl.Marker[]>([]);
    const mapInitialized = useRef<boolean>(false);
    const filtersPanelRef = useRef<HTMLDivElement | null>(null);

    // Function to update markers - defined outside useEffect to avoid dependency issues
    const updateMapMarkers = useRef(() => {
        if (!map.current || !events.length) return;

        // Remove existing markers
        markers.current.forEach(marker => marker.remove());
        markers.current = [];

        // Filter events based on current filters
        const eventsToShow = filteredEvents;

        // Add new markers
        const bounds = new mapboxgl.LngLatBounds();

        eventsToShow.forEach((event) => {
            // Add location to bounds
            bounds.extend([
                event.location.coordinates.lng,
                event.location.coordinates.lat
            ]);

            // Create marker element
            const el = document.createElement('div');
            el.className = 'event-marker';
            el.innerHTML = `
                <div class="${selectedEvent?.id === event.id
                    ? 'marker-pin selected'
                    : event.hasNftTickets
                        ? 'marker-pin nft'
                        : 'marker-pin'}">
                    <span class="marker-dot"></span>
                </div>
            `;

            el.addEventListener('click', () => {
                setSelectedEvent(event);
            });

            // Create and add marker
            const marker = new mapboxgl.Marker(el)
                .setLngLat([event.location.coordinates.lng, event.location.coordinates.lat])
                .addTo(map.current!);

            markers.current.push(marker);
        });

        // Only fit bounds if we have events
        if (eventsToShow.length > 0) {
            map.current.fitBounds(bounds, { padding: 50 });
        }
    });

    // Fetch events
    useEffect(() => {
        const timer = setTimeout(() => {
            // Mock data - assuming mockEvents is cast as ExtendedEvent[]
            setEvents(mockEvents as ExtendedEvent[]);
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    // Handle clicks outside filter panel
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                filtersPanelRef.current &&
                !filtersPanelRef.current.contains(event.target as Node) &&
                !(event.target as Element).closest('[data-filter-toggle]')
            ) {
                setShowFilters(false);
            }
        }

        if (showFilters) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showFilters]);

    // Update filter count
    useEffect(() => {
        const count =
            dateFilters.filter(filter => filter.selected).length +
            priceFilters.filter(filter => filter.selected).length +
            featureFilters.filter(filter => filter.selected).length;

        setActiveFilterCount(count);
        setShowFilterCount(count > 0);
    }, [dateFilters, priceFilters, featureFilters]);

    // Toggle date filter
    const toggleDateFilter = (index: number) => {
        setDateFilters(prev => {
            const updated = [...prev];
            updated[index].selected = !updated[index].selected;
            return updated;
        });
    };

    // Toggle price filter
    const togglePriceFilter = (index: number) => {
        setPriceFilters(prev => {
            const updated = [...prev];
            updated[index].selected = !updated[index].selected;
            return updated;
        });
    };

    // Toggle feature filter
    const toggleFeatureFilter = (index: number) => {
        setFeatureFilters(prev => {
            const updated = [...prev];
            updated[index].selected = !updated[index].selected;
            return updated;
        });
    };

    // Reset all filters
    const resetAllFilters = () => {
        setActiveFilter('ALL');
        setSearchQuery('');
        setDateFilters(prev => prev.map(filter => ({ ...filter, selected: false })));
        setPriceFilters(prev => prev.map(filter => ({ ...filter, selected: false })));
        setFeatureFilters(prev => prev.map(filter => ({ ...filter, selected: false })));
    };

    // Filtered events using useMemo with advanced filtering
    const filteredEvents = useMemo(() => {
        // Start with category filter
        let filtered = events.filter(event =>
            activeFilter === 'ALL' || event.category === activeFilter
        );

        // Apply search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(event => (
                event.title.toLowerCase().includes(query) ||
                event.location.name.toLowerCase().includes(query) ||
                event.category.toLowerCase().includes(query)
            ));
        }

        // Apply date filters if any are selected
        const activeDateFilters = dateFilters.filter(f => f.selected);
        if (activeDateFilters.length > 0) {
            const today = new Date();
            const weekend = new Date(today);
            weekend.setDate(today.getDate() + (6 - today.getDay()));

            const nextWeek = new Date(today);
            nextWeek.setDate(today.getDate() + 7);

            const nextMonth = new Date(today);
            nextMonth.setMonth(today.getMonth() + 1);

            filtered = filtered.filter(event => {
                const eventDate = new Date(event.date);

                return activeDateFilters.some(filter => {
                    switch (filter.value) {
                        case 'today':
                            return (
                                eventDate.getDate() === today.getDate() &&
                                eventDate.getMonth() === today.getMonth() &&
                                eventDate.getFullYear() === today.getFullYear()
                            );
                        case 'weekend':
                            return eventDate <= weekend && eventDate >= today;
                        case 'week':
                            return eventDate <= nextWeek && eventDate >= today;
                        case 'month':
                            return eventDate <= nextMonth && eventDate >= today;
                        default:
                            return true;
                    }
                });
            });
        }

        // Apply price filters if any are selected
        const activePriceFilters = priceFilters.filter(f => f.selected);
        if (activePriceFilters.length > 0) {
            filtered = filtered.filter(event => {
                // Convert price to number for comparison
                const priceValue = typeof event.price === 'number'
                    ? event.price
                    : Number(event.price); // Handle price as a string or custom type

                return activePriceFilters.some(filter => {
                    switch (filter.value) {
                        case 'free':
                            return priceValue === 0;
                        case 'under25':
                            return priceValue > 0 && priceValue < 25;
                        case '25-50':
                            return priceValue >= 25 && priceValue <= 50;
                        case '50-100':
                            return priceValue > 50 && priceValue <= 100;
                        case '100plus':
                            return priceValue > 100;
                        default:
                            return true;
                    }
                });
            });
        }

        // Apply feature filters if any are selected
        const activeFeatureFilters = featureFilters.filter(f => f.selected);
        if (activeFeatureFilters.length > 0) {
            filtered = filtered.filter(event => {
                return activeFeatureFilters.every(filter => {
                    switch (filter.value) {
                        case 'nft':
                            return !!event.hasNftTickets;
                        case 'parking':
                            return event.features?.includes('parking') || false;
                        case 'accessible':
                            return event.features?.includes('accessible') || false;
                        case 'family':
                            return event.features?.includes('family') || false;
                        default:
                            return true;
                    }
                });
            });
        }

        return filtered;
    }, [events, activeFilter, searchQuery, dateFilters, priceFilters, featureFilters]);

    // Initialize map when map view is activated
    useEffect(() => {
        // Only create map if in map view and container exists
        if (!isMapView || !mapContainer.current) {
            return;
        }

        // Initialize map if it doesn't exist yet
        if (!map.current) {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/light-v11',
                center: [-74.5, 40],
                zoom: 9
            });

            map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
            mapInitialized.current = true;

            map.current.on('load', () => {
                if (!map.current) return;

                // Add markers once map is loaded
                updateMapMarkers.current();
            });
        } else {
            // Map already exists, just update markers
            map.current.resize();
            updateMapMarkers.current();
        }

        return () => {
            // Clean up markers but don't destroy map
            markers.current.forEach(marker => marker.remove());
            markers.current = [];
        };
    }, [isMapView]);

    // Update markers when events or filters change
    useEffect(() => {
        if (map.current && isMapView && mapInitialized.current) {
            updateMapMarkers.current();
        }
    }, [filteredEvents, selectedEvent, isMapView]);

    // Properly destroy map on component unmount
    useEffect(() => {
        return () => {
            if (map.current) {
                markers.current.forEach(marker => marker.remove());
                map.current.remove();
                map.current = null;
                mapInitialized.current = false;
            }
        };
    }, []);

    // Categories for filter - ensure WELLNESS is included in EventCategory
    const categories: Array<EventCategory | 'ALL'> = ['ALL', 'MUSIC', 'CONFERENCE', 'ART', 'GAMING', 'FILM', 'TECHNOLOGY', 'WORKSHOP', 'OUTDOOR', 'WELLNESS'];

    return (
        <div className="relative min-h-screen">
            {/* No header here - just search and filters */}
            <main className="pt-20 pb-20">
                <div className="bg-white pt-4 pb-2">
                    <div className="container mx-auto px-4">
                        {/* Search Bar */}
                        <div className="relative mb-5">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    placeholder="Search events, locations, categories..."
                                    className="w-full py-3.5 pl-12 pr-12 bg-white rounded-full shadow-sm border border-gray-100 focus:ring-2 focus:ring-[#FF5722] focus:border-transparent focus:shadow-md transition-all text-gray-700 placeholder-gray-400"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <div className="absolute left-4 flex items-center justify-center h-8 w-8 text-[#FF5722]">
                                    <FiSearch className="w-5 h-5" />
                                </div>
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-4 flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
                                        aria-label="Clear search"
                                    >
                                        <FiX className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>

                            <div className="mt-3 flex flex-wrap gap-2">
                                <span className="text-sm text-gray-500 mr-1 flex items-center">
                                    <FiHash className="w-3.5 h-3.5 mr-1" /> Popular:
                                </span>
                                <button
                                    onClick={() => setSearchQuery("music festival")}
                                    className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-medium rounded-full transition-colors"
                                >
                                    Music Festival
                                </button>
                                <button
                                    onClick={() => setSearchQuery("tech conference")}
                                    className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-medium rounded-full transition-colors"
                                >
                                    Tech Conference
                                </button>
                                <button
                                    onClick={() => setSearchQuery("workshop")}
                                    className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-medium rounded-full transition-colors"
                                >
                                    Workshop
                                </button>
                                <button
                                    onClick={() => setSearchQuery("free events")}
                                    className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-medium rounded-full transition-colors"
                                >
                                    Free Events
                                </button>
                                <button
                                    onClick={() => setSearchQuery("weekend")}
                                    className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-medium rounded-full transition-colors"
                                >
                                    This Weekend
                                </button>
                            </div>
                        </div>

                        {/* View toggle and filters */}
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex space-x-2">
                                <div className="bg-gray-100 rounded-full p-1 flex">
                                    <button
                                        onClick={() => setIsMapView(false)}
                                        className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${!isMapView
                                            ? 'bg-white text-[#FF5722] shadow-sm'
                                            : 'text-gray-600'
                                            }`}
                                        aria-label="List view"
                                    >
                                        <FiList className="w-4 h-4" />
                                    </button>

                                    <button
                                        onClick={() => setIsMapView(true)}
                                        className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${isMapView
                                            ? 'bg-white text-[#FF5722] shadow-sm'
                                            : 'text-gray-600'
                                            }`}
                                        aria-label="Map view"
                                    >
                                        <FiMap className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <button
                                data-filter-toggle
                                onClick={() => setShowFilters(!showFilters)}
                                className={`h-10 px-4 rounded-full flex items-center justify-center gap-2 transition-all ${showFilters
                                    ? 'bg-gray-100 text-gray-800'
                                    : 'bg-white text-gray-600 border border-gray-200'
                                    }`}
                                aria-label="Filter"
                            >
                                <FiFilter className="w-4 h-4" />
                                <span className="text-sm font-medium">Filters</span>
                                {showFilterCount && (
                                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-[#FF5722] text-white">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Category Filters - Horizontal Scrollable */}
                        <div className="py-2 flex gap-2 overflow-x-auto hide-scrollbar">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveFilter(category)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeFilter === category
                                        ? 'bg-[#FF5722] text-white shadow-sm'
                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    {category === 'ALL' ? 'All Events' : category.charAt(0) + category.slice(1).toLowerCase()}
                                </button>
                            ))}
                        </div>

                        {/* Advanced Filters Panel - Beautiful and Functional */}
                        {showFilters && (
                            <div
                                ref={filtersPanelRef}
                                className="py-4 mt-2 bg-white rounded-xl border border-gray-200 shadow-lg animate-slideDown"
                            >
                                <div className="px-4 pb-4 mb-4 border-b border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Refine your search</h3>
                                    <p className="text-sm text-gray-500">Use filters to find exactly what you&apos;re looking for</p>
                                </div>

                                <div className="px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Date Filter */}
                                    <div className="filter-group">
                                        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                                            <FiCalendar className="mr-2 text-[#FF5722]" /> Date
                                        </h3>
                                        <div className="space-y-2">
                                            {dateFilters.map((filter, index) => (
                                                <button
                                                    key={filter.value}
                                                    onClick={() => toggleDateFilter(index)}
                                                    className={`flex w-full items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${filter.selected
                                                        ? 'bg-orange-50 text-[#FF5722] font-medium'
                                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {filter.label}
                                                    {filter.selected && (
                                                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#FF5722] text-white">
                                                            <FiCheck className="w-3 h-3" />
                                                        </span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Price Filter */}
                                    <div className="filter-group">
                                        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                                            <FiDollarSign className="mr-2 text-[#FF5722]" /> Price
                                        </h3>
                                        <div className="space-y-2">
                                            {priceFilters.map((filter, index) => (
                                                <button
                                                    key={filter.value}
                                                    onClick={() => togglePriceFilter(index)}
                                                    className={`flex w-full items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${filter.selected
                                                        ? 'bg-orange-50 text-[#FF5722] font-medium'
                                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {filter.label}
                                                    {filter.selected && (
                                                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#FF5722] text-white">
                                                            <FiCheck className="w-3 h-3" />
                                                        </span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Features Filter */}
                                    <div className="filter-group">
                                        <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                                            <FiTag className="mr-2 text-[#FF5722]" /> Features
                                        </h3>
                                        <div className="space-y-2">
                                            {featureFilters.map((filter, index) => (
                                                <button
                                                    key={filter.value}
                                                    onClick={() => toggleFeatureFilter(index)}
                                                    className={`flex w-full items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${filter.selected
                                                        ? 'bg-orange-50 text-[#FF5722] font-medium'
                                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    <span className="flex items-center">
                                                        {filter.color && (
                                                            <span
                                                                className="h-3 w-3 rounded-full mr-2"
                                                                style={{ backgroundColor: filter.color }}
                                                            ></span>
                                                        )}
                                                        {filter.label}
                                                    </span>
                                                    {filter.selected && (
                                                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#FF5722] text-white">
                                                            <FiCheck className="w-3 h-3" />
                                                        </span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 px-4 py-3 bg-gray-50 rounded-b-xl border-t border-gray-100 flex justify-end">
                                    <button
                                        onClick={resetAllFilters}
                                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                                    >
                                        Clear All
                                    </button>
                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="ml-3 px-5 py-2 text-sm font-medium bg-[#FF5722] text-white rounded-lg hover:bg-[#e64a14] transition-colors shadow-sm"
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content Area - Dynamic View Switching */}
                <div className="relative flex-1">
                    {/* Loading States */}
                    {isLoading ? (
                        <div className="container mx-auto px-4 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, index) => (
                                    <EventCardSkeleton key={index} />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Map View - Only render when active */}
                            {isMapView && (
                                <div className="absolute inset-0 z-0 h-[calc(100vh-200px)]">
                                    <div
                                        ref={mapContainer}
                                        className="h-full w-full"
                                    />

                                    {/* Selected Event Overlay */}
                                    {selectedEvent && (
                                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-sm px-4 z-10">
                                            <div className="relative">
                                                <button
                                                    onClick={() => setSelectedEvent(null)}
                                                    className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-white flex items-center justify-center z-10 shadow-md"
                                                >
                                                    <FiX className="h-4 w-4" />
                                                </button>
                                                <div className="bg-white rounded-xl shadow-xl overflow-hidden transition-all">
                                                    <EventCard event={selectedEvent} disableLink={true} />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Active filter count badge */}
                                    {showFilterCount && (
                                        <div className="absolute top-4 left-4 px-3 py-1.5 bg-white rounded-full shadow-md text-sm font-medium">
                                            <span className="flex items-center">
                                                <FiFilter className="w-4 h-4 mr-1.5 text-[#FF5722]" />
                                                {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'} applied
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* List View - Clean Card Layout */}
                            {!isMapView && (
                                <div className="container mx-auto px-4 py-4 min-h-[calc(100vh-200px)]">
                                    {/* Active filter badges */}
                                    {showFilterCount && (
                                        <div className="mb-4">
                                            <div className="flex items-center flex-wrap gap-2">
                                                <span className="text-sm font-medium text-gray-700 mr-1">
                                                    Filters:
                                                </span>

                                                {dateFilters.filter(f => f.selected).map(filter => (
                                                    <span key={filter.value} className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-[#FF5722] rounded-full text-xs font-medium">
                                                        <FiCalendar className="w-3 h-3" />
                                                        {filter.label}
                                                        <button
                                                            onClick={() => {
                                                                const index = dateFilters.findIndex(f => f.value === filter.value);
                                                                if (index !== -1) toggleDateFilter(index);
                                                            }}
                                                            className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-[#FF5722] hover:text-white transition-colors ml-1"
                                                        >
                                                            <FiX className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                ))}

                                                {priceFilters.filter(f => f.selected).map(filter => (
                                                    <span key={filter.value} className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-[#FF5722] rounded-full text-xs font-medium">
                                                        <FiDollarSign className="w-3 h-3" />
                                                        {filter.label}
                                                        <button
                                                            onClick={() => {
                                                                const index = priceFilters.findIndex(f => f.value === filter.value);
                                                                if (index !== -1) togglePriceFilter(index);
                                                            }}
                                                            className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-[#FF5722] hover:text-white transition-colors ml-1"
                                                        >
                                                            <FiX className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                ))}

                                                {featureFilters.filter(f => f.selected).map(filter => (
                                                    <span key={filter.value} className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-[#FF5722] rounded-full text-xs font-medium">
                                                        <FiTag className="w-3 h-3" />
                                                        {filter.label}
                                                        <button
                                                            onClick={() => {
                                                                const index = featureFilters.findIndex(f => f.value === filter.value);
                                                                if (index !== -1) toggleFeatureFilter(index);
                                                            }}
                                                            className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-[#FF5722] hover:text-white transition-colors ml-1"
                                                        >
                                                            <FiX className="w-3 h-3" />
                                                        </button>
                                                    </span>
                                                ))}

                                                {activeFilterCount > 0 && (
                                                    <button
                                                        onClick={resetAllFilters}
                                                        className="text-xs text-gray-600 underline hover:text-gray-800 ml-2"
                                                    >
                                                        Clear all
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {filteredEvents.length > 0 ? (
                                        <>
                                            <div className="mb-4 text-sm text-gray-500">
                                                Showing {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {filteredEvents.map((event) => (
                                                    <Link
                                                        href={`/events/${event.id}`}
                                                        key={event.id}
                                                        className="group"
                                                    >
                                                        <div className="h-full bg-white rounded-xl shadow-sm group-hover:shadow-md transition-all overflow-hidden border border-gray-100">
                                                            <EventCard event={event} disableLink={true} />
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-16 text-center">
                                            <div className="h-16 w-16 mb-4 rounded-full bg-gray-50 flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-xl font-semibold mb-2">No events found</h3>
                                            <p className="text-gray-500 mb-6">Try adjusting your filters or check back later</p>
                                            <button
                                                onClick={resetAllFilters}
                                                className="bg-white hover:bg-gray-50 border border-gray-200 transition-colors rounded-full px-6 py-2 font-medium"
                                            >
                                                Reset Filters
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            {/* Global Styles */}
            <style jsx global>{`
                /* Hide scrollbar */
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                
                /* Animation keyframes */
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-slideDown {
                    animation: slideDown 0.2s ease-out forwards;
                }
                
                /* Mapbox custom styles */
                .mapboxgl-ctrl-logo, .mapboxgl-ctrl-attrib {
                    display: none !important;
                }
                
                .mapboxgl-ctrl-top-right {
                    top: 10px;
                    right: 10px;
                }
                
                .mapboxgl-ctrl-top-right .mapboxgl-ctrl {
                    margin: 0;
                }
                
                /* Map markers */
                .event-marker {
                    cursor: pointer;
                }
                
                .marker-pin {
                    width: 30px;
                    height: 30px;
                    position: relative;
                    transform: translateY(-50%);
                }
                
                .marker-dot {
                    width: 16px;
                    height: 16px;
                    background: #FF5722;
                    border: 2px solid white;
                    border-radius: 50%;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                    transition: all 0.2s ease;
                }
                
                .marker-pin.selected .marker-dot {
                    background: #FF5722;
                    width: 20px;
                    height: 20px;
                    box-shadow: 0 0 0 4px rgba(255, 87, 34, 0.2);
                }
                
                .marker-pin.nft .marker-dot {
                    background: linear-gradient(135deg, #FF5722, #FF9800);
                }
                
                /* Filter panel animations */
                .filter-group {
                    transition: all 0.3s ease;
                }
                
                /* Ensure content doesn't overflow screen */
                body {
                    overflow-x: hidden;
                }
            `}</style>
        </div>
    );
}