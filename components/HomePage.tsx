/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Event } from '@/types';
import EventCard from '@/components/EventCard';
import EventCardSkeleton from '@/components/skeletons/EventCardSkeleton';
import BottomNavigation from '@/components/BottomNavigation';
import Header from '@/components/Header';
import { getUpcomingEvents, getTrendingEvents, getNftEvents } from '@/mocks/data/events';
import { getCurrentUser } from '@/mocks/data/users';
import { FiSearch, FiChevronRight, FiTrendingUp, FiClock, FiFolderPlus, FiCalendar, FiTarget } from 'react-icons/fi';

// Types
interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
}

type TabType = 'all' | 'trending' | 'upcoming' | 'nft';

// Tab configuration
const TABS = [
    { id: 'all', label: 'All Events', icon: FiCalendar },
    { id: 'trending', label: 'Trending Now', icon: FiTrendingUp },
    { id: 'upcoming', label: 'Upcoming', icon: FiClock },
    { id: 'nft', label: 'NFT Tickets', icon: FiTarget }
];

// Component for section headers
const SectionHeader = ({
    title,
    icon: Icon,
    viewAllLink
}: {
    title: string;
    icon: React.ElementType;
    viewAllLink?: string;
}) => (
    <div className="flex items-center justify-between mb-6">
        <div className="group">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Icon className="text-[#FF5722] mr-2 group-hover:scale-110 transition-transform" />
                {title}
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-[#FF5722] to-[#FF8A65] rounded-full mt-1 transform origin-left group-hover:scale-x-110 transition-transform"></div>
        </div>

        {viewAllLink && (
            <Link
                href={viewAllLink}
                className="text-sm font-medium text-[#FF5722] flex items-center group px-3 py-1.5 rounded-full hover:bg-orange-50 transition-colors"
            >
                View All
                <FiChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
        )}
    </div>
);

// Tab component
const TabButton = ({
    id,
    label,
    icon: Icon,
    isActive,
    onClick
}: {
    id: string;
    label: string;
    icon: React.ElementType;
    isActive: boolean;
    onClick: () => void;
}) => (
    <button
        onClick={onClick}
        className={`
      px-4 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 
      transition-all duration-300 transform hover:scale-105
      ${isActive
                ? 'bg-gradient-to-r from-[#FF5722] to-[#FF8A65] text-white shadow-lg shadow-orange-200'
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-[#FF5722] border border-gray-200'
            }
    `}
    >
        <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
        {label}
    </button>
);

// Search bar component
const SearchBar = ({ searchQuery, setSearchQuery, onSearch }: {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onSearch: (query: string) => void;
}) => {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchQuery(value);
        onSearch(value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSearch(searchQuery);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        onSearch('');
    };

    return (
        <div className="mb-8 transform hover:scale-[1.01] transition-transform">
            <div className="relative">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    onKeyDown={handleKeyDown}
                    placeholder="Search for events, locations, or categories..."
                    className="w-full py-3.5 pl-12 pr-10 bg-white rounded-full border border-gray-200 
                   focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent 
                   shadow-sm hover:shadow-md transition-shadow text-gray-700"
                />
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />

                {searchQuery && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full
                       text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                        aria-label="Clear search"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

export default function HomePage() {
    const [trendingEvents, setTrendingEvents] = useState<Event[]>([]);
    const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
    const [nftEvents, setNftEvents] = useState<Event[]>([]);
    const [currentTab, setCurrentTab] = useState<TabType>('all');
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

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
                console.error('Error fetching data:', error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Events to display based on selected tab and search
    const getEventsForTab = () => {
        switch (currentTab) {
            case 'trending':
                return trendingEvents;
            case 'upcoming':
                return upcomingEvents;
            case 'nft':
                return nftEvents;
            default:
                return [...trendingEvents, ...upcomingEvents.filter(e => !trendingEvents.some(t => t.id === e.id))].slice(0, 6);
        }
    };

    // Filter events based on search query
    const handleSearch = (query: string) => {
        setSearchQuery(query);

        if (!query.trim()) {
            setFilteredEvents([]);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const eventsToSearch = getEventsForTab();

        const filtered = eventsToSearch.filter(event =>
            event.title.toLowerCase().includes(lowerQuery) ||
            String(event.location).toLowerCase().includes(lowerQuery) ||
            event.category.toLowerCase().includes(lowerQuery) ||
            (event.description && event.description.toLowerCase().includes(lowerQuery))
        );

        setFilteredEvents(filtered);
    };

    // Events to display based on search and tab
    const displayEvents = searchQuery.trim()
        ? filteredEvents
        : getEventsForTab();

    // Get section title based on current tab
    const getSectionTitle = () => {
        if (searchQuery.trim()) {
            return `Search Results for "${searchQuery}"`;
        }

        switch (currentTab) {
            case 'trending': return 'Trending Now';
            case 'upcoming': return 'Upcoming Events';
            case 'nft': return 'NFT Tickets';
            default: return 'Discover Events';
        }
    };

    // Get section icon based on current tab
    const getSectionIcon = () => {
        if (searchQuery.trim()) {
            return FiSearch;
        }

        switch (currentTab) {
            case 'trending': return FiTrendingUp;
            case 'upcoming': return FiClock;
            case 'nft': return FiTarget;
            default: return FiCalendar;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Header />

            <main className="container mx-auto px-4 py-6 pt-24 pb-28 max-w-6xl">
                {/* Welcome Message */}
                {!isLoading && currentUser && (
                    <div className="mb-6 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Hello, <span className="text-[#FF5722]">{currentUser.name}</span>
                        </h1>
                        <p className="text-gray-600">Discover exciting events happening around you</p>
                    </div>
                )}

                {/* Search Bar */}
                <SearchBar searchQuery={''} setSearchQuery={function (query: string): void {
                    throw new Error('Function not implemented.');
                }} onSearch={function (query: string): void {
                    throw new Error('Function not implemented.');
                }} />

                {/* Tab Navigation */}
                <div className="mb-10 overflow-x-auto no-scrollbar opacity-0 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                    <div className="flex gap-3 min-w-max pb-2">
                        {TABS.map((tab) => (
                            <TabButton
                                key={tab.id}
                                id={tab.id}
                                label={tab.label}
                                icon={tab.icon}
                                isActive={currentTab === tab.id}
                                onClick={() => setCurrentTab(tab.id as TabType)}
                            />
                        ))}
                    </div>
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="space-y-12">
                        {/* Featured Event Skeleton */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <div className="h-7 w-48 bg-gray-200 rounded-md animate-shimmer"></div>
                                    <div className="h-1 w-20 bg-gray-200 rounded-full mt-1 animate-shimmer" style={{ animationDelay: '0.1s' }}></div>
                                </div>
                            </div>

                            <EventCardSkeleton variant="featured" />
                        </div>

                        {/* Events Grid Skeleton */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <div className="h-7 w-48 bg-gray-200 rounded-md animate-shimmer"></div>
                                    <div className="h-1 w-20 bg-gray-200 rounded-full mt-1 animate-shimmer" style={{ animationDelay: '0.1s' }}></div>
                                </div>

                                <div className="h-6 w-24 bg-gray-200 rounded-full animate-shimmer" style={{ animationDelay: '0.2s' }}></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[...Array(6)].map((_, index) => (
                                    <div key={index} className="opacity-0 animate-fade-in" style={{ animationDelay: `${0.1 * index}s`, animationFillMode: 'forwards' }}>
                                        <EventCardSkeleton />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* Featured Event */}
                        {currentTab === 'all' && trendingEvents.length > 0 && (
                            <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
                                <SectionHeader
                                    title="Featured Event"
                                    icon={FiTrendingUp}
                                />

                                <div className="transform hover:scale-[1.02] transition-transform duration-300">
                                    <EventCard event={trendingEvents[0]} variant="featured" />
                                </div>
                            </div>
                        )}

                        {/* Events Grid */}
                        <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
                            <SectionHeader
                                title={getSectionTitle()}
                                icon={getSectionIcon()}
                                // viewAllLink={`/discover/${currentTab}`}
                                viewAllLink={`/discover`}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {displayEvents.map((event, index) => (
                                    <div
                                        key={event.id}
                                        className="opacity-0 animate-fade-in transform hover:translate-y-[-5px] transition-all duration-300"
                                        style={{ animationDelay: `${0.9 + (0.1 * index)}s`, animationFillMode: 'forwards' }}
                                    >
                                        <EventCard key={event.id} event={event} />
                                    </div>
                                ))}
                            </div>

                            {displayEvents.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-10 text-center">
                                    <div className="bg-orange-50 p-6 rounded-full mb-4">
                                        <FiCalendar className="w-12 h-12 text-[#FF5722]" />
                                    </div>
                                    <h3 className="text-xl font-medium text-gray-800 mb-2">No events found</h3>
                                    <p className="text-gray-600 max-w-md">
                                        We couldn&apos;t find any events for this category. Please check back later or try another category.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* Global Styles */}
            <style jsx global>{`
        body {
          background-color: #FAFAFA;
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