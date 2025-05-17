/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import {
    FiMapPin, FiFilter, FiClock, FiCalendar, FiTag,
    FiHeart, FiCompass, FiChevronDown, FiList, FiGrid,
    FiChevronLeft, FiChevronRight, FiStar, FiX, FiMaximize2,
    FiNavigation, FiRefreshCw, FiSearch, FiInfo, FiSliders
} from 'react-icons/fi';
import { IoTicket } from 'react-icons/io5';
import {
    FiMusic, FiBriefcase, FiCoffee, FiUsers,
    FiBook, FiSun, FiMoon, FiCornerUpRight
} from 'react-icons/fi';
import { IoFitnessOutline } from 'react-icons/io5';
import { BsMusicNote, BsPalette, BsLaptop, BsCupHot } from 'react-icons/bs';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { mapStyles, MarkerComponents, mapEffects } from '@/components/MapStyles';

// Sample thumbnail images (in a real app these would come from your backend)
const eventThumbnails = [
    'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80',
    'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80',
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
    'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80',
    'https://images.unsplash.com/photo-1560439513-74b037a25d84?w=800&q=80',
    'https://images.unsplash.com/photo-1504680177321-2e6a879aac86?w=800&q=80',
];

// Types
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
    coordinates?: {
        lat: number;
        lng: number;
    };
}

interface MapMarker {
    id: string;
    lat: number;
    lng: number;
    eventId: string;
}

interface NearbyEventsProps {
    initialEvents?: NearbyEvent[];
    apiKey?: string;
    mapStyle?: string;
    animationLevel?: 'minimal' | 'moderate' | 'maximum';
}

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoicmtuZCIsImEiOiJjbWFwbTEzajAwMDVxMmlxeHY1dDdyY3h6In0.OQrYFVmEq-QL95nnbh1jTQ';

const eventCategories = [
    { id: 'music', name: 'Music', icon: <BsMusicNote />, color: 'bg-purple-100 text-purple-600' },
    { id: 'art', name: 'Art', icon: <BsPalette />, color: 'bg-pink-100 text-pink-600' },
    { id: 'tech', name: 'Tech', icon: <BsLaptop />, color: 'bg-blue-100 text-blue-600' },
    { id: 'food', name: 'Food', icon: <BsCupHot />, color: 'bg-amber-100 text-amber-600' },
    { id: 'sports', name: 'Sports', icon: <IoFitnessOutline />, color: 'bg-green-100 text-green-600' },
    { id: 'education', name: 'Education', icon: <FiBook />, color: 'bg-indigo-100 text-indigo-600' },
    { id: 'outdoors', name: 'Outdoors', icon: <FiSun />, color: 'bg-emerald-100 text-emerald-600' },
    { id: 'nightlife', name: 'Nightlife', icon: <FiMoon />, color: 'bg-violet-100 text-violet-600' },
];

// Get event category color class
const getCategoryColorClass = (categoryId: string) => {
    const category = eventCategories.find(cat => cat.id === categoryId);
    return category?.color || 'bg-gray-100 text-gray-600';
};

// Get event category icon
const getCategoryIcon = (categoryId: string) => {
    const category = eventCategories.find(cat => cat.id === categoryId);
    return category?.icon || <FiTag />;
};

export default function NearbyEvents({
    initialEvents = [],
    apiKey = MAPBOX_ACCESS_TOKEN,
    mapStyle = 'vibrant',
    animationLevel = 'moderate'
}: NearbyEventsProps) {
    // State
    const [events, setEvents] = useState<NearbyEvent[]>(initialEvents);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('list');
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [sortOption, setSortOption] = useState('distance');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [currentLocation, setCurrentLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);
    const [activeRadius, setActiveRadius] = useState<number>(5); // km
    const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [mapInitialized, setMapInitialized] = useState(false);
    const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
    const [showFullscreenMap, setShowFullscreenMap] = useState(false);
    const [isLocationLoading, setIsLocationLoading] = useState(false);
    const [viewTransitioning, setViewTransitioning] = useState(false);
    const [mapZoom, setMapZoom] = useState(13); // Initial map zoom level
    const [showCategoryLegend, setShowCategoryLegend] = useState(false);
    const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [show3DBuildings, setShow3DBuildings] = useState(false);
    const [activeMapStyle, setActiveMapStyle] = useState(mapStyle);
    const [isMapStyleMenuOpen, setIsMapStyleMenuOpen] = useState(false);
    const [mapEffectsVisible, setMapEffectsVisible] = useState(true);
    const [showRouteToSelected, setShowRouteToSelected] = useState(false);

    const mapRef = useRef<HTMLDivElement>(null);
    const filterRef = useRef<HTMLDivElement>(null);
    const mapControls = useAnimation();

    // Skeleton items for loading state
    const skeletonItems = useMemo(() => Array(8).fill(0), []);

    // Categories for filtering
    const categories = [
        { id: 'music', name: 'Music', icon: '🎵' },
        { id: 'art', name: 'Art', icon: '🎨' },
        { id: 'tech', name: 'Tech', icon: '💻' },
        { id: 'food', name: 'Food', icon: '🍽️' },
        { id: 'sports', name: 'Sports', icon: '⚽' },
        { id: 'education', name: 'Education', icon: '📚' },
        { id: 'outdoors', name: 'Outdoors', icon: '🏞️' },
        { id: 'nightlife', name: 'Nightlife', icon: '🌃' },
    ];

    // Date options for filtering
    const dateOptions = [
        { id: 'today', name: 'Today' },
        { id: 'tomorrow', name: 'Tomorrow' },
        { id: 'this-weekend', name: 'This Weekend' },
        { id: 'this-week', name: 'This Week' },
        { id: 'this-month', name: 'This Month' },
    ];

    // Distance radius options (in km)
    const radiusOptions = [1, 5, 10, 25, 50, 100];

    // Map style options
    const mapStyleOptions = [
        { id: 'vibrant', name: 'Vibrant Night', description: 'Dark mode with vivid highlights' },
        { id: 'rovify', name: 'Rovify', description: 'Custom Rovify-branded style' },
        { id: 'social', name: 'Social', description: 'Clean style for event discovery' },
        { id: 'web3', name: 'Web3', description: 'NFT-inspired satellite view' }
    ];

    // Mock data for nearby events with real coordinates around Nairobi
    const mockEvents: NearbyEvent[] = [
        {
            id: 'e1',
            title: 'Summer Festival 2025',
            date: 'Sat, 3rd May',
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
            coordinates: { lat: -1.286389, lng: 36.817223 } // Nairobi city center
        },
        {
            id: 'e2',
            title: 'Tech Startup Conference',
            date: 'Mon, 5th May',
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
            coordinates: { lat: -1.28395, lng: 36.823654 } // Slightly east
        },
        {
            id: 'e3',
            title: 'Culinary Masterclass',
            date: 'Tue, 6th May',
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
            coordinates: { lat: -1.291634, lng: 36.812202 } // Slightly south
        },
        {
            id: 'e4',
            title: 'Art Exhibition: Future Visions',
            date: 'Wed, 7th May',
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
            coordinates: { lat: -1.279824, lng: 36.824726 } // Slightly northeast
        },
        {
            id: 'e5',
            title: 'Blockchain & NFT Summit',
            date: 'Thu, 8th May',
            time: '11:00 AM - 7:00 PM',
            location: 'Digital Conference Center',
            distance: '2.4 km',
            price: '$90',
            image: eventThumbnails[4],
            category: 'tech',
            rating: 4.7,
            attendees: 520,
            isFeatured: true,
            isLiked: false,
            coordinates: { lat: -1.28023, lng: 36.809914 } // Slightly northwest
        },
        {
            id: 'e6',
            title: 'Weekend Yoga Retreat',
            date: 'Sat, 10th May',
            time: '8:00 AM - 2:00 PM',
            location: 'Harmony Gardens',
            distance: '3.0 km',
            price: '$35',
            image: eventThumbnails[5],
            category: 'outdoors',
            rating: 4.6,
            attendees: 85,
            isFeatured: false,
            isLiked: true,
            coordinates: { lat: -1.263987, lng: 36.80102 } // North
        },
        {
            id: 'e7',
            title: 'Craft Beer Festival',
            date: 'Sun, 11th May',
            time: '2:00 PM - 10:00 PM',
            location: 'Riverside Brewery',
            distance: '3.2 km',
            price: '$45',
            image: eventThumbnails[6],
            category: 'food',
            rating: 4.4,
            attendees: 780,
            isFeatured: false,
            isLiked: false,
            coordinates: { lat: -1.301756, lng: 36.792509 } // Southwest
        },
        {
            id: 'e8',
            title: 'Classic Film Night',
            date: 'Mon, 12th May',
            time: '8:00 PM - 11:00 PM',
            location: 'Heritage Cinema',
            distance: '3.5 km',
            price: '$12',
            image: eventThumbnails[7],
            category: 'nightlife',
            rating: 4.2,
            attendees: 120,
            isFeatured: false,
            isLiked: false,
            coordinates: { lat: -1.307025, lng: 36.826644 } // Southeast
        }
    ];

    // Initialize map
    const initializeMap = useCallback(() => {
        if (!mapRef.current || mapInitialized) return;

        try {
            mapboxgl.accessToken = apiKey;

            const center = currentLocation || { lat: -1.286389, lng: 36.817223 }; // Default to Nairobi

            // Get the selected map style
            const selectedStyle = typeof mapStyles[activeMapStyle] === 'string'
                ? mapStyles[activeMapStyle]
                : mapStyles.vibrant;

            const mapOptions: mapboxgl.MapboxOptions = {
                container: mapRef.current,
                style: selectedStyle,
                center: [center.lng, center.lat],
                zoom: mapZoom,
                attributionControl: false,
                pitchWithRotate: true,
                dragRotate: true,
                pitch: animationLevel === 'maximum' ? 40 : 0, // Add some tilt for maximum animation level
                bearing: animationLevel === 'maximum' ? 15 : 0, // Add slight rotation for maximum animation
            };

            const map = new mapboxgl.Map(mapOptions);

            // Store user location for reference
            if (currentLocation) {
                (map as any)._userLocation = currentLocation;
            }

            map.on('load', () => {
                setMapLoaded(true);

                // Add user location marker
                if (currentLocation) {
                    // Use custom function from mapEffects
                    const userMarker = document.createElement('div');
                    userMarker.className = 'user-location-marker';

                    new mapboxgl.Marker(userMarker)
                        .setLngLat([currentLocation.lng, currentLocation.lat])
                        .addTo(map);

                    // Add enhanced radius visualization
                    if (animationLevel !== 'minimal') {
                        mapEffects.enhancedRadius(map, currentLocation, activeRadius);
                    } else {
                        // Simple radius circle for minimal animation setting
                        updateRadiusCircle(map, currentLocation, activeRadius);
                    }
                }

                // Add event markers
                events.forEach(event => {
                    if (event.coordinates) {
                        addEventMarker(map, event);
                    }
                });

                // Add location control
                map.addControl(new mapboxgl.GeolocateControl({
                    positionOptions: {
                        enableHighAccuracy: true
                    },
                    trackUserLocation: true,
                    showUserHeading: true
                }), 'bottom-right');

                // Add navigation control
                map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

                // Add scale control for context
                map.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

                // Custom map interactions
                map.on('click', (e) => {
                    // Close any open popups when clicking on the map
                    setSelectedEvent(null);
                });

                // Animate camera for maximum animation setting
                if (animationLevel === 'maximum') {
                    setTimeout(() => {
                        map.flyTo({
                            center: [center.lng, center.lat],
                            zoom: mapZoom,
                            pitch: 50,
                            bearing: Math.random() * 40 - 20,
                            duration: 3000,
                            essential: true
                        });

                        // Add 3D buildings if selected
                        if (show3DBuildings) {
                            mapEffects.add3DBuildings(map);
                        }

                        // Add heatmap for maximum animation setting
                        if (showHeatmap) {
                            mapEffects.addEventHeatmap(map, events);
                        }

                        // Fit map to show all events with animation
                        setTimeout(() => {
                            mapEffects.fitMapToEvents(map, events);
                        }, 3500);
                    }, 1000);
                } else {
                    // Add 3D buildings if selected
                    if (show3DBuildings) {
                        mapEffects.add3DBuildings(map);
                    }

                    // Add heatmap if selected
                    if (showHeatmap) {
                        mapEffects.addEventHeatmap(map, events);
                    }

                    // Fit map to show all events (simpler animation)
                    mapEffects.fitMapToEvents(map, events);
                }

                // Add zoom change handler
                map.on('zoom', () => {
                    setMapZoom(map.getZoom());

                    // Update radius circle on zoom
                    if (currentLocation) {
                        if (animationLevel !== 'minimal') {
                            mapEffects.enhancedRadius(map, currentLocation, activeRadius);
                        } else {
                            updateRadiusCircle(map, currentLocation, activeRadius);
                        }
                    }
                });
            });

            setMapInstance(map);
            setMapInitialized(true);

        } catch (error) {
            console.error('Error initializing map:', error);
        }
    }, [apiKey, currentLocation, mapInitialized, mapZoom, events, activeRadius, activeMapStyle, animationLevel, show3DBuildings, showHeatmap]);

    // Add radius circle around user location (simple version)
    const updateRadiusCircle = (map: mapboxgl.Map, location: { lat: number, lng: number } | null, radiusKm: number) => {
        if (!location) return;

        // Remove existing radius layer and source
        if (map.getSource('radius-source')) {
            map.removeLayer('radius-fill');
            map.removeLayer('radius-border');
            map.removeSource('radius-source');
        }

        // Calculate the radius in degrees (rough approximation)
        // 1 degree at the equator is approximately 111 km
        const radiusDegrees = radiusKm / 111;

        // Create a circle centered at the location
        const center = [location.lng, location.lat];
        const options = {
            steps: 64,
            units: 'kilometers' as const
        };

        // Add source and layers
        map.addSource('radius-source', {
            type: 'geojson',
            data: {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: center
                },
                properties: {
                    radius: radiusKm
                }
            }
        });

        // Add circle fill
        map.addLayer({
            id: 'radius-fill',
            type: 'circle',
            source: 'radius-source',
            paint: {
                'circle-radius': radiusKm * 1000 / (111320 * Math.cos(location.lat * Math.PI / 180)) * map.getZoom() * 5,
                'circle-color': '#FF5722',
                'circle-opacity': 0.1
            }
        });

        // Add circle border
        map.addLayer({
            id: 'radius-border',
            type: 'circle',
            source: 'radius-source',
            paint: {
                'circle-radius': radiusKm * 1000 / (111320 * Math.cos(location.lat * Math.PI / 180)) * map.getZoom() * 5,
                'circle-color': '#FF5722',
                'circle-opacity': 0,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#FF5722',
                'circle-stroke-opacity': 0.5
            }
        });
    };

    // Add event marker to map
    const addEventMarker = (map: mapboxgl.Map, event: NearbyEvent) => {
        if (!event.coordinates) return;

        // Create custom marker element
        const markerEl = document.createElement('div');
        markerEl.className = `event-marker event-marker-${event.category} ${event.isFeatured ? 'event-marker-featured' : ''} ${selectedEvent === event.id ? 'event-marker-selected' : ''}`;
        markerEl.id = `marker-${event.id}`;

        // Set inner HTML using the mapEffects helper if using enhanced markers
        if (animationLevel !== 'minimal') {
            markerEl.innerHTML = mapEffects.getCategoryMarkerHTML(event);
        } else {
            // Simple marker for minimal animation
            markerEl.innerHTML = `
                <div class="event-marker-inner">
                    <span class="event-marker-price">${event.price.replace('$', '')}</span>
                </div>
            `;
        }

        // Create and add marker
        const marker = new mapboxgl.Marker(markerEl)
            .setLngLat([event.coordinates.lng, event.coordinates.lat])
            .addTo(map);

        // Event listeners
        markerEl.addEventListener('click', () => {
            setSelectedEvent(prev => prev === event.id ? null : event.id);

            // If selecting an event, add special animation focus
            if (selectedEvent !== event.id) {
                if (animationLevel === 'maximum') {
                    // Add null check for event.coordinates
                    if (event.coordinates) {
                        mapEffects.focusOnEvent(map, event.coordinates, event.id);

                        // Show route to selected event if that option is enabled
                        if (showRouteToSelected && currentLocation) {
                            mapEffects.showRoute(map, currentLocation, event.coordinates);
                        }
                    }
                } else {
                    // Simpler animation for moderate level
                    if (event.coordinates) {
                        map.easeTo({
                            center: [event.coordinates.lng, event.coordinates.lat],
                            zoom: mapZoom,
                            duration: 1000
                        });
                    }
                }
            } else {
                // Remove route when deselecting
                if (map.getLayer('route')) {
                    map.removeLayer('route');
                    map.removeLayer('route-bg');
                    map.removeSource('route');
                }
            }
        });

        // Add hover effect
        markerEl.addEventListener('mouseenter', () => {
            markerEl.classList.add('event-marker-hover');
            setHoveredEvent(event.id);
        });

        markerEl.addEventListener('mouseleave', () => {
            markerEl.classList.remove('event-marker-hover');
            setHoveredEvent(null);
        });
    };

    // Update marker styles when selected event changes
    const updateMarkerStyles = () => {
        if (!mapInstance) return;

        document.querySelectorAll('.event-marker').forEach(el => {
            const markerId = el.id.replace('marker-', '');

            if (markerId === selectedEvent) {
                el.classList.add('event-marker-selected');
            } else {
                el.classList.remove('event-marker-selected');
            }
        });
    };

    // Fly to selected event
    const flyToEvent = (eventId: string) => {
        const event = events.find(e => e.id === eventId);

        if (!mapInstance || !event?.coordinates) return;

        // Use enhanced animation for maximum setting
        if (animationLevel === 'maximum' && event.coordinates) {
            mapEffects.focusOnEvent(mapInstance, event.coordinates, event.id);

            // Show route to selected event if that option is enabled
            if (showRouteToSelected && currentLocation) {
                mapEffects.showRoute(mapInstance, currentLocation, event.coordinates);
            }
        } else {
            // Simpler animation for moderate and minimal
            mapInstance.flyTo({
                center: [event.coordinates.lng, event.coordinates.lat],
                zoom: mapZoom + 1,
                duration: 1500,
                essential: true
            });
        }

        setSelectedEvent(eventId);
    };

    // Fly to user location
    const flyToUserLocation = () => {
        if (!mapInstance || !currentLocation) return;

        setIsLocationLoading(true);

        // Use enhanced animation for maximum setting
        if (animationLevel === 'maximum') {
            mapInstance.flyTo({
                center: [currentLocation.lng, currentLocation.lat],
                zoom: mapZoom,
                pitch: 50,
                bearing: Math.random() * 40 - 20,
                duration: 2000,
                essential: true
            });
        } else {
            // Simpler animation for moderate and minimal
            mapInstance.flyTo({
                center: [currentLocation.lng, currentLocation.lat],
                zoom: mapZoom,
                duration: 1500,
                essential: true
            });
        }

        // Reset selected event
        setSelectedEvent(null);

        // Remove any existing routes
        if (mapInstance.getLayer('route')) {
            mapInstance.removeLayer('route');
            mapInstance.removeLayer('route-bg');
            mapInstance.removeSource('route');
        }

        setTimeout(() => {
            setIsLocationLoading(false);
        }, 1500);
    };

    // Change map style
    const changeMapStyle = (styleId: string) => {
        setActiveMapStyle(styleId);

        if (mapInstance) {
            // Get the selected map style
            const selectedStyle = typeof mapStyles[styleId] === 'string'
                ? mapStyles[styleId]
                : mapStyles.vibrant;

            mapInstance.setStyle(selectedStyle);

            // Re-add custom layers after style change
            mapInstance.once('style.load', () => {
                // Reset user location marker and radius
                if (currentLocation) {
                    const userMarker = document.createElement('div');
                    userMarker.className = 'user-location-marker';

                    new mapboxgl.Marker(userMarker)
                        .setLngLat([currentLocation.lng, currentLocation.lat])
                        .addTo(mapInstance);

                    // Add enhanced radius visualization
                    if (animationLevel !== 'minimal') {
                        mapEffects.enhancedRadius(mapInstance, currentLocation, activeRadius);
                    } else {
                        updateRadiusCircle(mapInstance, currentLocation, activeRadius);
                    }
                }

                // Re-add event markers
                events.forEach(event => {
                    if (event.coordinates) {
                        addEventMarker(mapInstance, event);
                    }
                });

                // Re-add 3D buildings if selected
                if (show3DBuildings) {
                    mapEffects.add3DBuildings(mapInstance);
                }

                // Re-add heatmap if selected
                if (showHeatmap) {
                    mapEffects.addEventHeatmap(mapInstance, events);
                }

                // Re-add route to selected event if applicable
                if (selectedEvent && showRouteToSelected && currentLocation) {
                    const selectedEventData = events.find(e => e.id === selectedEvent);
                    if (selectedEventData?.coordinates) {
                        mapEffects.showRoute(mapInstance, currentLocation, selectedEventData.coordinates);
                    }
                }
            });
        }

        // Close the style menu
        setIsMapStyleMenuOpen(false);
    };

    // Handle view mode changes with animation
    const handleViewModeChange = (mode: 'grid' | 'list' | 'map') => {
        setViewTransitioning(true);

        setTimeout(() => {
            setViewMode(mode);

            // If switching to map view, make sure the map is initialized
            if (mode === 'map' && !mapInitialized) {
                initializeMap();
            }

            setViewTransitioning(false);
        }, 300);
    };

    // Toggle map effect options
    const toggleMapEffect = (effect: 'heatmap' | '3d' | 'route') => {
        if (effect === 'heatmap') {
            setShowHeatmap(!showHeatmap);

            if (mapInstance && mapLoaded) {
                if (!showHeatmap) {
                    // Add heatmap
                    mapEffects.addEventHeatmap(mapInstance, events);
                } else {
                    // Remove heatmap
                    if (mapInstance.getLayer('events-heat')) {
                        mapInstance.removeLayer('events-heat');
                        mapInstance.removeSource('events-heat');
                    }
                }
            }
        } else if (effect === '3d') {
            setShow3DBuildings(!show3DBuildings);

            if (mapInstance && mapLoaded) {
                if (!show3DBuildings) {
                    // Add 3D buildings
                    mapEffects.add3DBuildings(mapInstance);
                } else {
                    // Remove 3D buildings
                    if (mapInstance.getLayer('3d-buildings')) {
                        mapInstance.removeLayer('3d-buildings');
                    }
                }
            }
        } else if (effect === 'route') {
            setShowRouteToSelected(!showRouteToSelected);

            if (mapInstance && mapLoaded) {
                if (!showRouteToSelected) {
                    // Show route to selected event if applicable
                    if (selectedEvent && currentLocation) {
                        const selectedEventData = events.find(e => e.id === selectedEvent);
                        if (selectedEventData?.coordinates) {
                            mapEffects.showRoute(mapInstance, currentLocation, selectedEventData.coordinates);
                        }
                    }
                } else {
                    // Remove route
                    if (mapInstance.getLayer('route')) {
                        mapInstance.removeLayer('route');
                        mapInstance.removeLayer('route-bg');
                        mapInstance.removeSource('route');
                    }
                }
            }
        }
    };

    // Generate map markers from events
    useEffect(() => {
        if (!events.length) return;

        const markers: MapMarker[] = events
            .filter(event => event.coordinates)
            .map((event, index) => ({
                id: `marker-${event.id}`,
                lat: event.coordinates!.lat,
                lng: event.coordinates!.lng,
                eventId: event.id
            }));

        setMapMarkers(markers);

        // Initialize current location (Nairobi)
        if (!currentLocation) {
            setCurrentLocation({
                lat: -1.286389,
                lng: 36.817223
            });
        }
    }, [events, currentLocation]);

    // Initialize map when view mode changes to map
    useEffect(() => {
        if (viewMode === 'map' && !mapInitialized && mapRef.current) {
            initializeMap();
        }
    }, [viewMode, mapInitialized, initializeMap]);

    // Update markers when selected event changes
    useEffect(() => {
        updateMarkerStyles();

        // Show route to selected event if applicable
        if (mapInstance && mapLoaded && selectedEvent && showRouteToSelected && currentLocation) {
            const selectedEventData = events.find(e => e.id === selectedEvent);
            if (selectedEventData?.coordinates) {
                mapEffects.showRoute(mapInstance, currentLocation, selectedEventData.coordinates);
            }
        }
    }, [selectedEvent, mapInstance, mapLoaded, currentLocation, showRouteToSelected, events]);

    // Update radius circle when radius changes
    useEffect(() => {
        if (mapInstance && mapLoaded && currentLocation) {
            if (animationLevel !== 'minimal') {
                mapEffects.enhancedRadius(mapInstance, currentLocation, activeRadius);
            } else {
                updateRadiusCircle(mapInstance, currentLocation, activeRadius);
            }
        }
    }, [activeRadius, mapInstance, mapLoaded, currentLocation, animationLevel]);

    // Simulate data loading
    useEffect(() => {
        setLoading(true);

        const timer = setTimeout(() => {
            setEvents(mockEvents);
            setLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    // Handle filter changes
    useEffect(() => {
        // Fetch filtered events based on activeFilters, sortOption, selectedDate
        setLoading(true);

        // Simulate API delay
        const timer = setTimeout(() => {
            let filteredEvents = [...mockEvents];

            // Apply category filters
            if (activeFilters.length > 0) {
                filteredEvents = filteredEvents.filter(event =>
                    activeFilters.includes(event.category)
                );
            }

            // Apply date filter
            if (selectedDate) {
                // Simple date filtering for demo purposes
                switch (selectedDate) {
                    case 'today':
                        filteredEvents = filteredEvents.filter(event =>
                            event.date.includes('3rd May')
                        );
                        break;
                    case 'tomorrow':
                        filteredEvents = filteredEvents.filter(event =>
                            event.date.includes('4th May')
                        );
                        break;
                    case 'this-weekend':
                        filteredEvents = filteredEvents.filter(event =>
                            event.date.includes('Sat') || event.date.includes('Sun')
                        );
                        break;
                    default:
                        // Keep all events for other date filters in this demo
                        break;
                }
            }

            // Apply sorting
            filteredEvents.sort((a, b) => {
                switch (sortOption) {
                    case 'distance':
                        return parseFloat(a.distance) - parseFloat(b.distance);
                    case 'price':
                        return parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', ''));
                    case 'rating':
                        return (b.rating || 0) - (a.rating || 0);
                    case 'popularity':
                        return (b.attendees || 0) - (a.attendees || 0);
                    default:
                        return 0;
                }
            });

            setEvents(filteredEvents);
            setLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, [activeFilters, sortOption, selectedDate]);

    // Handle click outside filters
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setShowFilters(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Toggle category filter
    const toggleCategoryFilter = (categoryId: string) => {
        setActiveFilters(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    // Toggle like status
    const toggleLike = (eventId: string) => {
        setEvents(prev =>
            prev.map(event =>
                event.id === eventId
                    ? { ...event, isLiked: !event.isLiked }
                    : event
            )
        );
    };

    return (
        <div className="pb-20">
            {/* Map Header */}
            <div className="bg-gray-50 border-b border-gray-200 mb-4">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Nearby Events</h1>
                            <p className="text-gray-500 text-sm mt-1 flex items-center">
                                <FiMapPin className="mr-1" />
                                Showing events within {activeRadius} km of your location
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* View Mode Switcher */}
                            <div className="bg-white border border-gray-200 rounded-lg flex overflow-hidden shadow-sm">
                                <motion.button
                                    whileHover={{ backgroundColor: viewMode !== 'list' ? 'rgba(255, 242, 238, 0.5)' : undefined }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleViewModeChange('list')}
                                    className={`p-2 transition-colors duration-300 ${viewMode === 'list' ? 'bg-[#FF5722]/10 text-[#FF5722]' : 'text-gray-500 hover:bg-gray-50'}`}
                                    aria-label="List view"
                                >
                                    <FiList size={20} />
                                </motion.button>
                                <motion.button
                                    whileHover={{ backgroundColor: viewMode !== 'grid' ? 'rgba(255, 242, 238, 0.5)' : undefined }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleViewModeChange('grid')}
                                    className={`p-2 transition-colors duration-300 ${viewMode === 'grid' ? 'bg-[#FF5722]/10 text-[#FF5722]' : 'text-gray-500 hover:bg-gray-50'}`}
                                    aria-label="Grid view"
                                >
                                    <FiGrid size={20} />
                                </motion.button>
                                <motion.button
                                    whileHover={{ backgroundColor: viewMode !== 'map' ? 'rgba(255, 242, 238, 0.5)' : undefined }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleViewModeChange('map')}
                                    className={`p-2 transition-colors duration-300 ${viewMode === 'map' ? 'bg-[#FF5722]/10 text-[#FF5722]' : 'text-gray-500 hover:bg-gray-50'}`}
                                    aria-label="Map view"
                                >
                                    <FiMapPin size={20} />
                                </motion.button>
                            </div>

                            {/* Sort Options */}
                            <div className="relative">
                                <select
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                    className="bg-white border border-gray-200 rounded-lg text-sm px-3 py-2 pr-8 appearance-none shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent"
                                >
                                    <option value="distance">Nearest First</option>
                                    <option value="price">Price: Low to High</option>
                                    <option value="rating">Highest Rated</option>
                                    <option value="popularity">Most Popular</option>
                                </select>
                                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Filters Button */}
                            <div className="relative" ref={filterRef}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`px-3 py-2 rounded-lg border flex items-center gap-2 text-sm font-medium ${activeFilters.length > 0 || selectedDate
                                        ? 'bg-[#FF5722]/10 text-[#FF5722] border-[#FF5722]/20'
                                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                        } shadow-sm transition-colors duration-200`}
                                >
                                    <FiFilter size={16} />
                                    Filters
                                    {(activeFilters.length > 0 || selectedDate) && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="w-5 h-5 rounded-full bg-[#FF5722] text-white text-xs flex items-center justify-center"
                                        >
                                            {activeFilters.length + (selectedDate ? 1 : 0)}
                                        </motion.span>
                                    )}
                                </motion.button>

                                {/* Filters Dropdown */}
                                <AnimatePresence>
                                    {showFilters && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 top-12 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-30"
                                        >
                                            <div className="p-4">
                                                <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
                                                <div className="grid grid-cols-2 gap-2 mb-4">
                                                    {eventCategories.map(category => (
                                                        <motion.button
                                                            key={category.id}
                                                            onClick={() => toggleCategoryFilter(category.id)}
                                                            whileHover={{ scale: 1.03 }}
                                                            whileTap={{ scale: 0.97 }}
                                                            className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm ${activeFilters.includes(category.id)
                                                                ? `${category.color.split(' ')[0]} ${category.color.split(' ')[1]} font-medium`
                                                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                                } transition-colors duration-200`}
                                                        >
                                                            <span className="w-4 h-4 flex items-center justify-center">
                                                                {category.icon}
                                                            </span>
                                                            {category.name}
                                                        </motion.button>
                                                    ))}
                                                </div>

                                                <h3 className="font-medium text-gray-900 mb-3">When</h3>
                                                <div className="grid grid-cols-2 gap-2 mb-4">
                                                    {dateOptions.map(option => (
                                                        <motion.button
                                                            key={option.id}
                                                            onClick={() => setSelectedDate(prev => prev === option.id ? null : option.id)}
                                                            whileHover={{ scale: 1.03 }}
                                                            whileTap={{ scale: 0.97 }}
                                                            className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm ${selectedDate === option.id
                                                                ? 'bg-[#FF5722]/10 text-[#FF5722] font-medium'
                                                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                                } transition-colors duration-200`}
                                                        >
                                                            {option.id === 'today' && <FiClock size={14} />}
                                                            {option.id === 'tomorrow' && <FiClock size={14} />}
                                                            {option.id === 'this-weekend' && <FiCalendar size={14} />}
                                                            {option.id === 'this-week' && <FiCalendar size={14} />}
                                                            {option.id === 'this-month' && <FiCalendar size={14} />}
                                                            {option.name}
                                                        </motion.button>
                                                    ))}
                                                </div>

                                                <h3 className="font-medium text-gray-900 mb-3">Distance</h3>
                                                <div className="px-2">
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="5"
                                                        step="1"
                                                        value={radiusOptions.indexOf(activeRadius)}
                                                        onChange={(e) => setActiveRadius(radiusOptions[parseInt(e.target.value)])}
                                                        className="w-full accent-[#FF5722]"
                                                    />
                                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                        {radiusOptions.map((radius, index) => (
                                                            <span key={index} className={activeRadius === radius ? 'text-[#FF5722] font-medium' : ''}>
                                                                {radius} km
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                                    <button
                                                        onClick={() => {
                                                            setActiveFilters([]);
                                                            setSelectedDate(null);
                                                            setActiveRadius(5);
                                                        }}
                                                        className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                                                    >
                                                        Clear all
                                                    </button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => setShowFilters(false)}
                                                        className="px-4 py-2 bg-[#FF5722] text-white rounded-lg text-sm font-medium shadow-sm hover:bg-[#E64A19] transition-colors duration-200"
                                                    >
                                                        Apply Filters
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4">
                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-16 h-16 border-4 border-gray-200 border-t-[#FF5722] rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500">Finding events near you...</p>
                    </div>
                )}

                {/* View Transition Animation */}
                <AnimatePresence mode="wait">
                    {viewTransitioning && (
                        <motion.div
                            key="transition"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center"
                        >
                            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#FF5722] rounded-full animate-spin"></div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* No Events Found */}
                {!loading && events.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                            <FiMapPin size={32} />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">No events found nearby</h2>
                        <p className="text-gray-500 max-w-md mb-6">
                            We couldn&apos;t find any events matching your criteria. Try adjusting your filters or expanding your search radius.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setActiveFilters([]);
                                setSelectedDate(null);
                                setActiveRadius(10);
                            }}
                            className="px-4 py-2 bg-[#FF5722] text-white rounded-lg text-sm font-medium shadow-sm hover:bg-[#E64A19] transition-colors duration-200"
                        >
                            Reset Filters
                        </motion.button>
                    </div>
                )}

                {/* Map View */}
                {!loading && events.length > 0 && viewMode === 'map' && (
                    <div className="relative">
                        {/* Map Container */}
                        <div
                            ref={mapRef}
                            className={`${showFullscreenMap ? 'fixed inset-0 z-50' : 'h-[70vh]'} w-full rounded-xl overflow-hidden shadow-lg border border-gray-200`}
                        >
                            {/* Map Style Menu */}
                            <AnimatePresence>
                                {isMapStyleMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="absolute top-16 right-4 z-20 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                                    >
                                        <div className="p-2">
                                            <div className="text-sm font-medium text-gray-900 px-2 py-1.5 border-b border-gray-100">
                                                Map Style
                                            </div>
                                            <div className="mt-1 space-y-1">
                                                {mapStyleOptions.map(style => (
                                                    <button
                                                        key={style.id}
                                                        onClick={() => changeMapStyle(style.id)}
                                                        className={`w-full px-3 py-1.5 text-left text-sm rounded-lg flex items-center justify-between ${activeMapStyle === style.id
                                                            ? 'bg-[#FF5722]/10 text-[#FF5722] font-medium'
                                                            : 'hover:bg-gray-50 text-gray-700'
                                                            }`}
                                                    >
                                                        <span>{style.name}</span>
                                                        {activeMapStyle === style.id && (
                                                            <span className="w-2 h-2 bg-[#FF5722] rounded-full"></span>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Map Controls Overlay */}
                            <motion.div
                                className="absolute top-4 left-4 z-10 flex flex-col gap-2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                {/* Location Button */}
                                <motion.button
                                    whileHover={{ scale: 1.1, backgroundColor: '#fff' }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={flyToUserLocation}
                                    className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center text-[#FF5722] hover:text-[#E64A19] transition-colors"
                                    disabled={isLocationLoading}
                                >
                                    {isLocationLoading ? (
                                        <div className="w-5 h-5 border-2 border-[#FF5722]/30 border-t-[#FF5722] rounded-full animate-spin"></div>
                                    ) : (
                                        <FiNavigation size={18} />
                                    )}
                                </motion.button>

                                {/* Category Legend Toggle */}
                                <motion.button
                                    whileHover={{ scale: 1.1, backgroundColor: '#fff' }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setShowCategoryLegend(!showCategoryLegend)}
                                    className={`w-10 h-10 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center transition-colors ${showCategoryLegend
                                        ? 'bg-[#FF5722] text-white'
                                        : 'bg-white/90 text-[#FF5722] hover:text-[#E64A19]'
                                        }`}
                                >
                                    <FiInfo size={18} />
                                </motion.button>

                                {/* Map Effects Toggle */}
                                <motion.button
                                    whileHover={{ scale: 1.1, backgroundColor: '#fff' }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setMapEffectsVisible(!mapEffectsVisible)}
                                    className={`w-10 h-10 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center transition-colors ${mapEffectsVisible
                                        ? 'bg-[#FF5722] text-white'
                                        : 'bg-white/90 text-[#FF5722] hover:text-[#E64A19]'
                                        }`}
                                >
                                    <FiSliders size={18} />
                                </motion.button>
                            </motion.div>

                            {/* Map Effects Menu */}
                            <AnimatePresence>
                                {mapEffectsVisible && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="absolute bottom-16 left-4 z-10 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                                    >
                                        <div className="p-2">
                                            <div className="text-sm font-medium text-gray-900 px-2 py-1.5 border-b border-gray-100">
                                                Map Effects
                                            </div>
                                            <div className="mt-1 space-y-1">
                                                <button
                                                    onClick={() => toggleMapEffect('heatmap')}
                                                    className={`w-full px-3 py-1.5 text-left text-sm rounded-lg flex items-center justify-between ${showHeatmap
                                                        ? 'bg-[#FF5722]/10 text-[#FF5722] font-medium'
                                                        : 'hover:bg-gray-50 text-gray-700'
                                                        }`}
                                                >
                                                    <span>Event Heatmap</span>
                                                    <div className={`w-4 h-4 rounded flex items-center justify-center ${showHeatmap ? 'bg-[#FF5722]' : 'border border-gray-300'
                                                        }`}>
                                                        {showHeatmap && <FiCheck size={10} className="text-white" />}
                                                    </div>
                                                </button>
                                                <button
                                                    onClick={() => toggleMapEffect('3d')}
                                                    className={`w-full px-3 py-1.5 text-left text-sm rounded-lg flex items-center justify-between ${show3DBuildings
                                                        ? 'bg-[#FF5722]/10 text-[#FF5722] font-medium'
                                                        : 'hover:bg-gray-50 text-gray-700'
                                                        }`}
                                                >
                                                    <span>3D Buildings</span>
                                                    <div className={`w-4 h-4 rounded flex items-center justify-center ${show3DBuildings ? 'bg-[#FF5722]' : 'border border-gray-300'
                                                        }`}>
                                                        {show3DBuildings && <FiCheck size={10} className="text-white" />}
                                                    </div>
                                                </button>
                                                <button
                                                    onClick={() => toggleMapEffect('route')}
                                                    className={`w-full px-3 py-1.5 text-left text-sm rounded-lg flex items-center justify-between ${showRouteToSelected
                                                        ? 'bg-[#FF5722]/10 text-[#FF5722] font-medium'
                                                        : 'hover:bg-gray-50 text-gray-700'
                                                        }`}
                                                >
                                                    <span>Show Routes</span>
                                                    <div className={`w-4 h-4 rounded flex items-center justify-center ${showRouteToSelected ? 'bg-[#FF5722]' : 'border border-gray-300'
                                                        }`}>
                                                        {showRouteToSelected && <FiCheck size={10} className="text-white" />}
                                                    </div>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Category Legend */}
                            <AnimatePresence>
                                {showCategoryLegend && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-gray-200 max-w-xs"
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="text-sm font-medium text-gray-900">Event Categories</h3>
                                            <button
                                                onClick={() => setShowCategoryLegend(false)}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                <FiX size={16} />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-1">
                                            {eventCategories.map(category => (
                                                <div key={category.id} className="flex items-center gap-1 py-1">
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${category.color}`}>
                                                        {category.icon}
                                                    </div>
                                                    <span className="text-xs text-gray-700">{category.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Map Style Button */}
                            <motion.button
                                whileHover={{ scale: 1.1, backgroundColor: '#fff' }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsMapStyleMenuOpen(!isMapStyleMenuOpen)}
                                className={`absolute top-4 right-16 z-10 w-10 h-10 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center transition-colors ${isMapStyleMenuOpen
                                    ? 'bg-[#FF5722] text-white'
                                    : 'bg-white/90 text-[#FF5722] hover:text-[#E64A19]'
                                    }`}
                            >
                                <FiCompass size={18} />
                            </motion.button>

                            {/* Fullscreen toggle */}
                            <motion.button
                                whileHover={{ scale: 1.1, backgroundColor: '#fff' }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setShowFullscreenMap(!showFullscreenMap)}
                                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center text-[#FF5722] hover:text-[#E64A19] transition-colors"
                            >
                                <FiMaximize2 size={18} />
                            </motion.button>

                            {/* Search overlay */}
                            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-sm px-4">
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="relative w-full"
                                >
                                    <input
                                        type="text"
                                        placeholder="Search for events, locations..."
                                        className="w-full py-2.5 pl-10 pr-4 bg-white/95 backdrop-blur-sm rounded-full border border-gray-200 shadow-md text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
                                    />
                                    <FiSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                </motion.div>
                            </div>

                            {/* Close fullscreen button */}
                            {showFullscreenMap && (
                                <div className="absolute bottom-4 right-4 z-10">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowFullscreenMap(false)}
                                        className="px-4 py-2 bg-[#FF5722] text-white rounded-lg text-sm font-medium shadow-md hover:bg-[#E64A19] transition-colors"
                                    >
                                        Close Map
                                    </motion.button>
                                </div>
                            )}

                            {/* Map Placeholder (This will be replaced by the Mapbox map) */}
                            {!mapInitialized && (
                                <div className="h-full w-full bg-[#f0f0f0] flex items-center justify-center">
                                    <div className="w-12 h-12 border-4 border-gray-200 border-t-[#FF5722] rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>

                        {/* Event List Below Map */}
                        {!showFullscreenMap && (
                            <div className="mt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold text-gray-900">Events Near You</h2>

                                    {/* View on map button */}
                                    {selectedEvent && (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => flyToEvent(selectedEvent)}
                                            className="flex items-center gap-1 text-sm font-medium text-[#FF5722]"
                                        >
                                            <FiCornerUpRight size={14} />
                                            View on map
                                        </motion.button>
                                    )}
                                </div>

                                {/* Horizontal scrolling cards */}
                                <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide -mx-4 px-4">
                                    {events.map(event => (
                                        <motion.div
                                            key={event.id}
                                            whileHover={{ y: -5 }}
                                            onClick={() => {
                                                setSelectedEvent(event.id);
                                                if (event.coordinates && mapInstance) {
                                                    flyToEvent(event.id);
                                                }
                                            }}
                                            className={`flex-shrink-0 w-72 ${selectedEvent === event.id
                                                ? 'ring-2 ring-[#FF5722]'
                                                : 'hover:shadow-md'
                                                } transition-all duration-200 rounded-xl overflow-hidden bg-white shadow border border-gray-100 cursor-pointer`}
                                        >
                                            <div className="relative h-40 bg-gray-200 overflow-hidden">
                                                <Image
                                                    src={event.image}
                                                    alt={event.title}
                                                    width={300}
                                                    height={160}
                                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                                />

                                                {/* Distance Badge */}
                                                <div className="absolute top-2 left-2 bg-black/20 backdrop-blur-sm text-white text-xs rounded-full px-2 py-1 flex items-center">
                                                    <FiMapPin size={10} className="mr-1" />
                                                    {event.distance}
                                                </div>

                                                {/* Category Badge */}
                                                <div className={`absolute top-2 right-2 ${getCategoryColorClass(event.category)} backdrop-blur-sm text-xs rounded-full px-2 py-1 flex items-center`}>
                                                    <span className="w-3 h-3 mr-1 flex items-center justify-center">
                                                        {getCategoryIcon(event.category)}
                                                    </span>
                                                    {eventCategories.find(cat => cat.id === event.category)?.name}
                                                </div>

                                                {/* Like Button */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleLike(event.id);
                                                    }}
                                                    className={`absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center ${event.isLiked
                                                        ? 'bg-red-50 text-red-500'
                                                        : 'bg-black/20 text-white hover:bg-black/30'
                                                        }`}
                                                >
                                                    <FiHeart fill={event.isLiked ? 'currentColor' : 'none'} />
                                                </button>
                                            </div>

                                            <div className="p-3">
                                                {event.isFeatured && (
                                                    <div className="flex items-center gap-1 mb-1">
                                                        <span className="text-amber-500">
                                                            <FiStar fill="currentColor" size={12} />
                                                        </span>
                                                        <span className="text-xs font-medium text-amber-500">Featured Event</span>
                                                    </div>
                                                )}

                                                <h3 className="font-medium text-gray-900 line-clamp-2">{event.title}</h3>
                                                <p className="text-xs text-gray-500 mt-1">{event.date} • {event.time}</p>
                                                <p className="text-xs flex items-center text-gray-700 mt-2">
                                                    <FiMapPin size={12} className="mr-1" />
                                                    {event.location}
                                                </p>

                                                {/* Event Stats */}
                                                {(event.rating || event.attendees) && (
                                                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                                        {event.rating && (
                                                            <span className="flex items-center">
                                                                <FiStar size={12} className="text-amber-500 mr-1" fill="currentColor" />
                                                                {event.rating}
                                                            </span>
                                                        )}
                                                        {event.attendees && (
                                                            <span>
                                                                {event.attendees} attending
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                                                    <span className="text-[#FF5722] font-medium">{event.price}</span>
                                                    <div className="w-8 h-8 rounded-full bg-[#FF5722]/10 flex items-center justify-center text-[#FF5722]">
                                                        <IoTicket />
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* "View all" button */}
                                <div className="mt-4 text-center">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleViewModeChange('list')}
                                        className="text-[#FF5722] font-medium text-sm hover:underline flex items-center gap-1 mx-auto"
                                    >
                                        View all {events.length} events
                                        <FiChevronRight size={14} />
                                    </motion.button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* List View */}
                {!loading && events.length > 0 && viewMode === 'list' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                    >
                        {events.map(event => (
                            <EventCard
                                key={event.id}
                                event={event}
                                isCompact={false}
                                onLikeToggle={() => toggleLike(event.id)}
                                onHover={setHoveredEvent}
                                isHovered={hoveredEvent === event.id}
                            />
                        ))}
                    </motion.div>
                )}

                {/* Grid View */}
                {!loading && events.length > 0 && viewMode === 'grid' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    >
                        {events.map(event => (
                            <EventCard
                                key={event.id}
                                event={event}
                                isCompact={true}
                                onLikeToggle={() => toggleLike(event.id)}
                                onHover={setHoveredEvent}
                                isHovered={hoveredEvent === event.id}
                            />
                        ))}
                    </motion.div>
                )}

                {/* Loading Skeletons */}
                {loading && (
                    <div className={viewMode === 'grid'
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                        : "space-y-4"}>
                        {skeletonItems.map((_, index) => (
                            <SkeletonCard key={index} isCompact={viewMode === 'grid'} />
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {!loading && events.length > 0 && (viewMode === 'list' || viewMode === 'grid') && (
                <div className="flex justify-center mt-8">
                    <div className="flex items-center gap-2">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            disabled
                        >
                            <FiChevronLeft />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 rounded-lg bg-[#FF5722] text-white flex items-center justify-center font-medium transition-colors"
                        >
                            1
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            2
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            3
                        </motion.button>

                        <span className="text-gray-500 px-1">...</span>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            8
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <FiChevronRight />
                        </motion.button>
                    </div>
                </div>
            )}

            {/* Custom CSS for map markers */}
            <style jsx global>{`
                /* All the CSS from MarkerComponents */
                ${MarkerComponents.userLocationMarker}
                ${MarkerComponents.eventMarker}
                ${MarkerComponents.featuredMarker}
                ${MarkerComponents.marker3D}
                
                .scrollbar-hide {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }
                
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;  /* Chrome, Safari, Opera */
                }
                
                .mapboxgl-ctrl-bottom-left,
                .mapboxgl-ctrl-bottom-right {
                    bottom: 12px !important;
                }
                
                .mapboxgl-ctrl-attrib {
                    display: none !important;
                }
                
                /* Checkbox custom styling */
                .FiCheck {
                    display: none;
                }
                
                /* Map loading animation */
                @keyframes map-fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                .mapboxgl-canvas {
                    animation: map-fade-in 1s ease-out;
                }
                
                /* Premium card hover effect */
                .event-card-premium {
                    position: relative;
                    overflow: hidden;
                }
                
                .event-card-premium::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: linear-gradient(
                        to bottom right,
                        rgba(255, 255, 255, 0) 0%,
                        rgba(255, 255, 255, 0.1) 100%
                    );
                    transform: rotate(30deg);
                    pointer-events: none;
                    z-index: 10;
                    opacity: 0;
                    transition: opacity 0.5s ease;
                }
                
                .event-card-premium:hover::before {
                    opacity: 1;
                }
            `}</style>
        </div>
    );
}

// Event Card Component
interface EventCardProps {
    event: NearbyEvent;
    isCompact: boolean;
    onLikeToggle: () => void;
    onHover?: (id: string | null) => void;
    isHovered?: boolean;
}

function EventCard({ event, isCompact, onLikeToggle, onHover, isHovered }: EventCardProps) {
    if (isCompact) {
        return (
            <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                animate={isHovered ? { y: -5, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)' } : {}}
                transition={{ duration: 0.2 }}
                className={`bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow event-card-premium ${event.isFeatured ? 'border-amber-200' : ''}`}
                onMouseEnter={() => onHover && onHover(event.id)}
                onMouseLeave={() => onHover && onHover(null)}
            >
                <Link href={`/events/${event.id}`} className="block">
                    <div className="relative aspect-[4/3] bg-gray-200 overflow-hidden">
                        <Image
                            src={event.image}
                            alt={event.title}
                            width={400}
                            height={300}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                        />

                        {/* Distance Badge */}
                        <div className="absolute top-2 left-2 bg-black/20 backdrop-blur-sm text-white text-xs rounded-full px-2 py-1 flex items-center">
                            <FiMapPin size={10} className="mr-1" />
                            {event.distance}
                        </div>

                        {/* Category Badge */}
                        <div className={`absolute bottom-2 left-2 ${getCategoryColorClass(event.category)} bg-opacity-70 backdrop-blur-sm text-xs rounded-full px-2 py-1 flex items-center`}>
                            <span className="w-3 h-3 mr-1 flex items-center justify-center">
                                {getCategoryIcon(event.category)}
                            </span>
                            {eventCategories.find(cat => cat.id === event.category)?.name}
                        </div>

                        {/* Like Button */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onLikeToggle();
                            }}
                            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center ${event.isLiked
                                ? 'bg-red-50 text-red-500'
                                : 'bg-black/20 text-white hover:bg-black/30'
                                }`}
                        >
                            <FiHeart fill={event.isLiked ? 'currentColor' : 'none'} />
                        </button>
                    </div>

                    <div className="p-3">
                        {event.isFeatured && (
                            <div className="flex items-center gap-1 mb-1">
                                <span className="text-amber-500">
                                    <FiStar fill="currentColor" size={12} />
                                </span>
                                <span className="text-xs font-medium text-amber-500">Featured Event</span>
                            </div>
                        )}

                        <h3 className="font-medium text-gray-900 line-clamp-2">{event.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">{event.date} • {event.time}</p>
                        <p className="text-xs flex items-center text-gray-700 mt-2">
                            <FiMapPin size={12} className="mr-1" />
                            {event.location}
                        </p>

                        {/* Event Stats */}
                        {(event.rating || event.attendees) && (
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                {event.rating && (
                                    <span className="flex items-center">
                                        <FiStar size={12} className="text-amber-500 mr-1" fill="currentColor" />
                                        {event.rating}
                                    </span>
                                )}
                                {event.attendees && (
                                    <span>
                                        {event.attendees} attending
                                    </span>
                                )}
                            </div>
                        )}

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                            <span className="text-[#FF5722] font-medium">{event.price}</span>
                            <div className="w-8 h-8 rounded-full bg-[#FF5722]/10 flex items-center justify-center text-[#FF5722]">
                                <IoTicket />
                            </div>
                        </div>
                    </div>
                </Link>
            </motion.div>
        );
    }

    // List view (horizontal card)
    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            animate={isHovered ? { boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)' } : {}}
            transition={{ duration: 0.2 }}
            className={`bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow event-card-premium ${event.isFeatured ? 'border-amber-200' : ''}`}
            onMouseEnter={() => onHover && onHover(event.id)}
            onMouseLeave={() => onHover && onHover(null)}
        >
            <Link href={`/events/${event.id}`} className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-56 h-48 sm:h-full bg-gray-200 flex-shrink-0 overflow-hidden">
                    <Image
                        src={event.image}
                        alt={event.title}
                        width={224}
                        height={192}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />

                    {/* Distance Badge */}
                    <div className="absolute top-2 left-2 bg-black/20 backdrop-blur-sm text-white text-xs rounded-full px-2 py-1 flex items-center">
                        <FiMapPin size={10} className="mr-1" />
                        {event.distance}
                    </div>

                    {/* Like Button */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onLikeToggle();
                        }}
                        className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center ${event.isLiked
                            ? 'bg-red-50 text-red-500'
                            : 'bg-black/20 text-white hover:bg-black/30'
                            }`}
                    >
                        <FiHeart fill={event.isLiked ? 'currentColor' : 'none'} />
                    </button>

                    {/* Category Badge */}
                    <div className={`absolute bottom-2 left-2 ${getCategoryColorClass(event.category)} backdrop-blur-sm text-xs rounded-full px-2 py-1 flex items-center`}>
                        <span className="w-3 h-3 mr-1 flex items-center justify-center">
                            {getCategoryIcon(event.category)}
                        </span>
                        {eventCategories.find(cat => cat.id === event.category)?.name}
                    </div>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                    <div className="flex-1">
                        {event.isFeatured && (
                            <div className="flex items-center gap-1 mb-1">
                                <span className="text-amber-500">
                                    <FiStar fill="currentColor" size={12} />
                                </span>
                                <span className="text-xs font-medium text-amber-500">Featured Event</span>
                            </div>
                        )}

                        <h3 className="font-medium text-gray-900 text-lg">{event.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{event.date} • {event.time}</p>

                        <p className="text-sm flex items-center text-gray-700 mt-3">
                            <FiMapPin size={14} className="mr-1" />
                            {event.location}
                        </p>

                        {/* Event Stats */}
                        {(event.rating || event.attendees) && (
                            <div className="flex items-center gap-3 mt-3 text-sm text-gray-500">
                                {event.rating && (
                                    <span className="flex items-center">
                                        <FiStar size={14} className="text-amber-500 mr-1" fill="currentColor" />
                                        {event.rating}
                                    </span>
                                )}
                                {event.attendees && (
                                    <span className="flex items-center">
                                        <FiUsers size={14} className="text-gray-400 mr-1" />
                                        {event.attendees} attending
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                            <span className="text-[#FF5722] font-medium">{event.price}</span>

                            {/* View on map button - for list view only */}
                            {event.coordinates && (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        // This would trigger a map view focus in a real implementation
                                    }}
                                    className="text-xs flex items-center gap-1 text-gray-500 hover:text-gray-700"
                                >
                                    <FiMapPin size={12} />
                                    View on map
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[#FF5722]">View Details</span>
                            <div className="w-8 h-8 rounded-full bg-[#FF5722]/10 flex items-center justify-center text-[#FF5722]">
                                <IoTicket />
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// Skeleton loaders for events
function SkeletonCard({ isCompact }: { isCompact: boolean }) {
    if (isCompact) {
        return (
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                <div className="aspect-[4/3] bg-gray-200"></div>
                <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6 mb-4"></div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                    </div>
                </div>
            </div>
        );
    }

    // List view skeleton
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
            <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-56 h-48 bg-gray-200 flex-shrink-0"></div>
                <div className="p-4 flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-4">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="flex items-center gap-2">
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper component for map control icons
function FiCheck(props: { size: number, className: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={props.size}
            height={props.size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={props.className}
        >
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    );
}