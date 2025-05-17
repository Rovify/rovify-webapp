/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Event } from '@/types';
import EventCard from '@/components/EventCard';
import EventCardSkeleton from '@/components/skeletons/EventCardSkeleton';
import SideNavigation from '@/components/SideNavigation';
import Header from '@/components/Header';
import { getUpcomingEvents, getTrendingEvents, getNftEvents } from '@/mocks/data/events';
import { getCurrentUser } from '@/mocks/data/users';
import { FiSearch, FiChevronRight, FiTrendingUp, FiClock, FiCalendar, FiTarget, FiMapPin, FiDollarSign, FiHeart, FiMoreHorizontal, FiPlus } from 'react-icons/fi';
import { IoWater } from "react-icons/io5";
import { MdOutlineHotel, MdOutlineHouse, MdOutlineGolfCourse, MdOutlineWaves, MdHomeWork, MdOutlinePhotoCamera, MdCabin } from "react-icons/md";

// Types
interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
}

interface Category {
    id: string;
    name: string;
    icon: React.ElementType;
}

interface NFTDrop {
    id: string;
    title: string;
    image: string;
    price: string;
    creator: string;
    endTime: string;
}

interface Creator {
    id: string;
    name: string;
    image: string;
    verified: boolean;
    followers: number;
}

export default function HomePage() {
    const [trendingEvents, setTrendingEvents] = useState<Event[]>([]);
    const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
    const [nftEvents, setNftEvents] = useState<Event[]>([]);
    const [popularEvents, setPopularEvents] = useState<Event[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('amazing-pools');
    const [currentLocation, setCurrentLocation] = useState('Nairobi');
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const categoryScrollRef = useRef<HTMLDivElement>(null);

    // Categories similar to the image
    const categories: Category[] = [
        { id: 'amazing-pools', name: 'Amazing pools', icon: IoWater },
        { id: 'icons', name: 'Icons', icon: MdOutlineHouse },
        { id: 'bed-breakfast', name: 'Bed & breakfasts', icon: MdOutlineHotel },
        { id: 'countryside', name: 'Countryside', icon: MdOutlineHouse },
        { id: 'golfing', name: 'Golfing', icon: MdOutlineGolfCourse },
        { id: 'lakefront', name: 'Lakefront', icon: MdOutlineWaves },
        { id: 'rooms', name: 'Rooms', icon: MdHomeWork },
        { id: 'amazing-views', name: 'Amazing views', icon: MdOutlinePhotoCamera },
        { id: 'beachfront', name: 'Beachfront', icon: MdOutlineWaves },
        { id: 'cabins', name: 'Cabins', icon: MdCabin }
    ];

    // Mock NFT drops data
    const nftDrops: NFTDrop[] = [
        {
            id: '1',
            title: 'Techno Night 2025',
            image: '/images/events/techno-night.jpg',
            price: '0.25 ETH',
            creator: 'Beats Collective',
            endTime: '2d 5h'
        },
        {
            id: '2',
            title: 'Summer Art Festival',
            image: '/images/events/art-festival.jpg',
            price: '0.18 ETH',
            creator: 'Urban Gallery',
            endTime: '5d 12h'
        },
        {
            id: '3',
            title: 'Digital Innovation Summit',
            image: '/images/events/tech-summit.jpg',
            price: '0.4 ETH',
            creator: 'Future Tech',
            endTime: '1d 8h'
        }
    ];

    // Mock creators data
    const creators: Creator[] = [
        {
            id: '1',
            name: 'Alex Rivera',
            image: '/images/users/alex.jpg',
            verified: true,
            followers: 12500
        },
        {
            id: '2',
            name: 'Sarah Johnson',
            image: '/images/users/sarah.jpg',
            verified: true,
            followers: 8900
        },
        {
            id: '3',
            name: 'Tech Events Global',
            image: '/images/users/techevents.jpg',
            verified: true,
            followers: 45200
        }
    ];

    // Scroll categories horizontally
    const scrollCategories = (direction: 'left' | 'right') => {
        if (categoryScrollRef.current) {
            const scrollAmount = 200;
            if (direction === 'left') {
                categoryScrollRef.current.scrollLeft -= scrollAmount;
            } else {
                categoryScrollRef.current.scrollLeft += scrollAmount;
            }
        }
    };

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Simulate API fetch
                const timer = setTimeout(() => {
                    const trending = getTrendingEvents();
                    const upcoming = getUpcomingEvents();
                    const nft = getNftEvents();

                    setTrendingEvents(trending);
                    setUpcomingEvents(upcoming);
                    setNftEvents(nft);
                    // Combine some events to create popular events
                    setPopularEvents([...trending.slice(0, 2), ...upcoming.slice(0, 2)]);
                    setCurrentUser(getCurrentUser());
                    setIsLoading(false);
                }, 1500);

                return () => clearTimeout(timer);
            } catch (error) {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle sidebar expansion state change
    const handleSidebarExpand = (expanded: boolean) => {
        setSidebarExpanded(expanded);
    };

    // Filter events based on search query
    const handleSearch = (query: string) => {
        setSearchQuery(query);

        if (!query.trim()) {
            setFilteredEvents([]);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const eventsToSearch = [...popularEvents, ...trendingEvents, ...upcomingEvents];

        const filtered = eventsToSearch.filter(event =>
            event.title.toLowerCase().includes(lowerQuery) ||
            String(event.location).toLowerCase().includes(lowerQuery) ||
            event.category.toLowerCase().includes(lowerQuery) ||
            (event.description && event.description.toLowerCase().includes(lowerQuery))
        );

        setFilteredEvents(filtered);
    };

    // Render category item
    const renderCategoryItem = (category: Category) => (
        <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex flex-col items-center justify-center px-5 py-3 min-w-[100px] transition-all ${selectedCategory === category.id
                ? 'text-[#FF5722] border-b-2 border-[#FF5722]'
                : 'text-gray-500 hover:text-gray-700'
                }`}
        >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedCategory === category.id
                ? 'bg-[#FF5722]/10'
                : 'bg-gray-100'
                }`}>
                <category.icon className={`w-5 h-5 ${selectedCategory === category.id
                    ? 'text-[#FF5722]'
                    : 'text-gray-500'
                    }`} />
            </div>
            <span className="text-xs mt-2 whitespace-nowrap">{category.name}</span>
        </button>
    );

    // Filter button component
    const FilterButton = ({ icon: Icon, label }: { icon: React.ElementType, label: string }) => (
        <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{label}</span>
        </button>
    );

    // Section header component
    const SectionHeader = ({ title, viewAllLink }: { title: string, viewAllLink?: string }) => (
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>

            {viewAllLink && (
                <Link
                    href={viewAllLink}
                    className="text-[#FF5722] text-sm font-medium hover:underline"
                >
                    See all
                </Link>
            )}
        </div>
    );

    // Sidebar item component for trending/NFT drops
    const SidebarItem = ({ title, image }: { title: string, image: string }) => (
        <div className="mb-4 group">
            <div className="bg-gray-200 h-24 rounded-lg w-full overflow-hidden relative mb-2 group-hover:shadow-md transition-shadow">
                {/* Placeholder for actual images */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
            </div>
        </div>
    );

    // Creator item component
    const CreatorItem = ({ creator }: { creator: Creator }) => (
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden relative">
                {/* Placeholder for actual creator images */}
                {creator.verified && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#FF5722] rounded-full border-2 border-white flex items-center justify-center">
                        <svg className="w-2 h-2 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                )}
            </div>

            <div className="flex-1">
                <h4 className="font-medium text-gray-900 group-hover:text-[#FF5722] transition-colors">{creator.name}</h4>
                <p className="text-xs text-gray-500">{creator.followers.toLocaleString()} followers</p>
            </div>

            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#FF5722] hover:text-white transition-colors">
                <FiPlus className="w-4 h-4" />
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            {/* Side Navigation */}
            <SideNavigation isOrganizer={true} />

            {/* Header */}
            <Header isSidebarExpanded={sidebarExpanded} />

            <main className={`transition-all duration-300 ${!sidebarExpanded ? 'ml-20' : 'ml-56'
                } pt-20`}>
                <div className="flex">
                    {/* Main Content Area */}
                    <div className="flex-1 px-6 py-4">
                        {/* Page Header */}
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Events</h1>
                        </div>

                        {/* Banner/Featured Area */}
                        <div className="w-full h-48 md:h-64 bg-gray-200 rounded-2xl mb-8 overflow-hidden relative group">
                            {isLoading ? (
                                <div className="w-full h-full animate-shimmer"></div>
                            ) : (
                                <>
                                    {/* This would be replaced with an actual image in production */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <h3 className="text-white text-xl md:text-2xl font-bold mb-2">Featured Events</h3>
                                        <p className="text-white/80 text-sm md:text-base">
                                            Discover unique experiences and unforgettable moments
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Categories Scroll */}
                        <div className="relative mb-8">
                            <div
                                ref={categoryScrollRef}
                                className="flex overflow-x-auto no-scrollbar pb-2"
                            >
                                {categories.map(renderCategoryItem)}
                            </div>

                            {/* Scroll Buttons */}
                            <button
                                onClick={() => scrollCategories('left')}
                                className="absolute left-0 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-100 z-10"
                            >
                                <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 1L2 6L7 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>

                            <button
                                onClick={() => scrollCategories('right')}
                                className="absolute right-0 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-100 z-10"
                            >
                                <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex gap-3 mb-8">
                            <FilterButton icon={FiMapPin} label={currentLocation} />
                            <FilterButton icon={FiCalendar} label="Date" />
                            <FilterButton icon={FiDollarSign} label="Price" />
                        </div>

                        {/* Popular Events Section */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold mb-6">
                                Popular Events <span className="text-gray-500 font-normal">in {currentLocation}</span>
                            </h2>

                            {isLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                                    {[...Array(4)].map((_, index) => (
                                        <div key={index} className="animate-shimmer rounded-lg h-72"></div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                                    {popularEvents.map((event) => (
                                        <div key={event.id} className="group relative">
                                            <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-gray-200">
                                                {/* Event Image (would use real image in production) */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                                                {/* Favorite button */}
                                                <button
                                                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white hover:text-[#FF5722] transition-colors z-10"
                                                    aria-label="Add to favorites"
                                                >
                                                    <FiHeart className="w-4 h-4" />
                                                </button>

                                                {/* Event info */}
                                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                                    <div className="text-white text-xs mb-1">Sat, 3rd May</div>
                                                    <h3 className="text-white font-semibold mb-1">{event.title}</h3>
                                                    <div className="text-white/80 text-xs">Central Park Main stage</div>
                                                    <div className="text-white text-sm mt-2 font-medium">$50</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Show Map Button */}
                        <div className="flex justify-center mb-12">
                            <button className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
                                <span className="font-medium">Show Map</span>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 4V14L5.5 12L10.5 14L15 12V2L10.5 4L5.5 2L1 4Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M5.5 2V12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M10.5 4V14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="hidden xl:block w-80 py-4 px-4 border-l border-gray-100">
                        {/* Trending Section */}
                        <div className="mb-10">
                            <SectionHeader title="Trending" viewAllLink="/trending" />

                            {isLoading ? (
                                <>
                                    {[...Array(3)].map((_, index) => (
                                        <div key={index} className="h-24 bg-gray-200 rounded-lg mb-4 animate-shimmer"></div>
                                    ))}
                                </>
                            ) : (
                                <>
                                    {trendingEvents.slice(0, 3).map(event => (
                                        <SidebarItem key={event.id} title={event.title} image="" />
                                    ))}
                                </>
                            )}
                        </div>

                        {/* NFT Drops Section */}
                        <div className="mb-10">
                            <SectionHeader title="NFT Drops" viewAllLink="/nft-drops" />

                            {isLoading ? (
                                <>
                                    {[...Array(3)].map((_, index) => (
                                        <div key={index} className="h-24 bg-gray-200 rounded-lg mb-4 animate-shimmer"></div>
                                    ))}
                                </>
                            ) : (
                                <>
                                    {nftDrops.map(drop => (
                                        <SidebarItem key={drop.id} title={drop.title} image={drop.image} />
                                    ))}
                                </>
                            )}
                        </div>

                        {/* Suggested Creators */}
                        <div>
                            <SectionHeader title="Suggested Creators" />

                            {isLoading ? (
                                <>
                                    {[...Array(3)].map((_, index) => (
                                        <div key={index} className="h-16 bg-gray-200 rounded-lg mb-4 animate-shimmer"></div>
                                    ))}
                                </>
                            ) : (
                                <div className="space-y-2">
                                    {creators.map(creator => (
                                        <CreatorItem key={creator.id} creator={creator} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Global Styles */}
            <style jsx global>{`
                body {
                    background-color: #FFFFFF;
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
                    0% { opacity: 0; transform: translateY(15px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                
                .animate-fade-in {
                    animation: fadeIn 0.5s ease forwards;
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
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                
                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
            `}</style>
        </div>
    );
}