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
import { FiSearch, FiChevronRight, FiTrendingUp, FiClock, FiFolderPlus } from 'react-icons/fi';

export default function HomePage() {
    const [trendingEvents, setTrendingEvents] = useState<Event[]>([]);
    const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
    const [nftEvents, setNftEvents] = useState<Event[]>([]);
    type TabType = 'all' | 'trending' | 'upcoming' | 'nft';
    const [currentTab, setCurrentTab] = useState<TabType>('all');
    interface User {
        id: string;
        name: string;
        email: string;
        avatarUrl?: string;
    }

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate API fetch
        const timer = setTimeout(() => {
            setTrendingEvents(getTrendingEvents());
            setUpcomingEvents(getUpcomingEvents());
            setNftEvents(getNftEvents());
            setCurrentUser(getCurrentUser());
            setIsLoading(false);
        }, 1500); // Increased loading time to better show off the skeletons

        return () => clearTimeout(timer);
    }, []);

    // Events to display based on tab
    const displayEvents =
        currentTab === 'trending' ? trendingEvents :
            currentTab === 'upcoming' ? upcomingEvents :
                currentTab === 'nft' ? nftEvents :
                    [...trendingEvents, ...upcomingEvents.filter(e => !trendingEvents.some(t => t.id === e.id))].slice(0, 8);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto px-4 py-6 pt-24 pb-28">
                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search for events, locations, or categories..."
                            className="w-full py-3 pl-12 pr-4 bg-white rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF5722] shadow-sm"
                        />
                        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="mb-8 overflow-x-auto no-scrollbar">
                    <div className="flex gap-3 min-w-max">
                        {[
                            { id: 'all', label: 'All Events', icon: FiFolderPlus },
                            { id: 'trending', label: 'Trending Now', icon: FiTrendingUp },
                            { id: 'upcoming', label: 'Upcoming', icon: FiClock },
                            { id: 'nft', label: 'NFT Tickets', icon: FiFolderPlus }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setCurrentTab(tab.id as TabType)}
                                className={`px-4 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition-all ${currentTab === tab.id
                                    ? 'bg-[#FF5722] text-white shadow-md'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <>
                        {/* Featured Event Skeleton */}
                        <div className="mb-10">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <div className="h-7 w-48 bg-gray-200 rounded-md animate-shimmer"></div>
                                    <div className="h-1 w-20 bg-gray-200 rounded-full mt-1 animate-shimmer" style={{ animationDelay: '0.1s' }}></div>
                                </div>
                            </div>

                            <EventCardSkeleton variant="featured" />
                        </div>

                        {/* Events Grid Skeleton */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <div className="h-7 w-48 bg-gray-200 rounded-md animate-shimmer"></div>
                                    <div className="h-1 w-20 bg-gray-200 rounded-full mt-1 animate-shimmer" style={{ animationDelay: '0.1s' }}></div>
                                </div>

                                <div className="h-6 w-20 bg-gray-200 rounded-md animate-shimmer" style={{ animationDelay: '0.2s' }}></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, index) => (
                                    <EventCardSkeleton key={index} />
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Featured Event */}
                        {currentTab === 'all' && trendingEvents.length > 0 && (
                            <div className="mb-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                            <FiTrendingUp className="text-[#FF5722] mr-2" />
                                            Featured Event
                                        </h2>
                                        <div className="h-1 w-20 bg-[#FF5722] rounded-full mt-1"></div>
                                    </div>
                                </div>

                                <EventCard event={trendingEvents[0]} variant="featured" />
                            </div>
                        )}

                        {/* Events Grid */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                        {currentTab === 'trending' && <FiTrendingUp className="text-[#FF5722] mr-2" />}
                                        {currentTab === 'upcoming' && <FiClock className="text-[#FF5722] mr-2" />}
                                        {currentTab === 'nft' && <FiFolderPlus className="text-[#FF5722] mr-2" />}
                                        {currentTab === 'all' && <FiFolderPlus className="text-[#FF5722] mr-2" />}
                                        {currentTab === 'trending' ? 'Trending Now' :
                                            currentTab === 'upcoming' ? 'Upcoming Events' :
                                                currentTab === 'nft' ? 'NFT Tickets' : 'Discover Events'}
                                    </h2>
                                    <div className="h-1 w-20 bg-[#FF5722] rounded-full mt-1"></div>
                                </div>

                                <Link
                                    href={`/events/${currentTab}`}
                                    className="text-sm font-medium text-[#FF5722] flex items-center group"
                                >
                                    View All
                                    <FiChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {displayEvents.map((event) => (
                                    <EventCard key={event.id} event={event} />
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </main>

            <BottomNavigation />

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
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease forwards;
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
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
      `}</style>
        </div>
    );
}