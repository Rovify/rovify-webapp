
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiSearch, FiFilter, FiMessageSquare, FiUserPlus,
    FiCalendar, FiClock, FiMoreHorizontal, FiX,
    FiChevronDown, FiCheck, FiCamera
} from 'react-icons/fi';
import { IoTicket } from 'react-icons/io5';
import { BsCameraVideoFill, BsThreeDots } from 'react-icons/bs';

// Mock friend data with activity
interface Activity {
    type: 'event' | 'streaming' | 'ticket' | 'moment';
    content: string;
    timeAgo: string;
    emoji?: string;
    eventId?: string;
    ticketId?: string;
    streamId?: string;
    momentId?: string;
}

interface Friend {
    id: string;
    name: string;
    image: string;
    online: boolean;
    lastSeen?: string;
    verified: boolean;
    location?: string;
    mutualFriends: number;
    mutualEvents: number;
    isNew?: boolean;
    activity?: Activity;
}

// Sample data
const FRIENDS_DATA: Friend[] = [
    {
        id: 'f1',
        name: 'Alex Morgan',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=100&q=80',
        online: true,
        verified: true,
        location: 'New York, NY',
        mutualFriends: 15,
        mutualEvents: 3,
        activity: {
            type: 'event',
            content: 'Going to Summer Festival 2025',
            timeAgo: '15m',
            emoji: '🎵',
            eventId: 'evt123'
        }
    },
    {
        id: 'f2',
        name: 'Jamie Chen',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=100&q=80',
        online: true,
        verified: false,
        location: 'San Francisco, CA',
        mutualFriends: 8,
        mutualEvents: 5,
        activity: {
            type: 'streaming',
            content: 'Live from Crypto Meetup',
            timeAgo: '2m',
            streamId: 'str456'
        }
    },
    {
        id: 'f3',
        name: 'Samira Khan',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=100&q=80',
        online: false,
        lastSeen: '3h ago',
        verified: true,
        location: 'Austin, TX',
        mutualFriends: 3,
        mutualEvents: 2,
        activity: {
            type: 'ticket',
            content: 'Purchased NFT ticket for Tech Summit',
            timeAgo: '1h',
            ticketId: 'tkt789'
        }
    },
    {
        id: 'f4',
        name: 'Mike Johnson',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=100&q=80',
        online: false,
        lastSeen: '1d ago',
        verified: false,
        location: 'Miami, FL',
        mutualFriends: 6,
        mutualEvents: 1,
    },
    {
        id: 'f5',
        name: 'Leila Patel',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=100&q=80',
        online: true,
        verified: true,
        location: 'Chicago, IL',
        mutualFriends: 12,
        mutualEvents: 7,
        activity: {
            type: 'moment',
            content: 'Shared a moment from Wellness Retreat',
            timeAgo: '45m',
            emoji: '✨',
            momentId: 'mom101'
        }
    },
    {
        id: 'f6',
        name: 'Carlos Rodriguez',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=100&q=80',
        online: true,
        verified: false,
        location: 'Los Angeles, CA',
        mutualFriends: 4,
        mutualEvents: 2,
        activity: {
            type: 'event',
            content: 'RSVP\'d to VR Gaming Expo',
            timeAgo: '30m',
            emoji: '🎮',
            eventId: 'evt456'
        }
    },
    {
        id: 'f7',
        name: 'Zoe Williams',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=100&q=80',
        online: false,
        lastSeen: '5h ago',
        verified: true,
        location: 'Seattle, WA',
        mutualFriends: 9,
        mutualEvents: 4,
        isNew: true,
    },
    {
        id: 'f8',
        name: 'David Kim',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=100&q=80',
        online: true,
        verified: false,
        location: 'Portland, OR',
        mutualFriends: 7,
        mutualEvents: 3,
        activity: {
            type: 'ticket',
            content: 'Transferred a ticket to you',
            timeAgo: '2h',
            ticketId: 'tkt101',
        }
    },
    {
        id: 'f9',
        name: 'Emma Thompson',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=100&q=80',
        online: false,
        lastSeen: '2d ago',
        verified: true,
        location: 'Denver, CO',
        mutualFriends: 5,
        mutualEvents: 1,
    },
    {
        id: 'f10',
        name: 'Ryan Garcia',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=100&q=80',
        online: true,
        verified: true,
        location: 'Boston, MA',
        mutualFriends: 11,
        mutualEvents: 6,
        activity: {
            type: 'streaming',
            content: 'Starting a stream "NFT art creation live"',
            timeAgo: '5m',
            streamId: 'str789'
        }
    },
];

// Mock suggested friends
const SUGGESTED_FRIENDS: Friend[] = [
    {
        id: 's1',
        name: 'Taylor Swift',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=100&q=80',
        online: true,
        verified: true,
        location: 'Nashville, TN',
        mutualFriends: 23,
        mutualEvents: 5,
    },
    {
        id: 's2',
        name: 'Jordan Lee',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=100&q=80',
        online: false,
        lastSeen: '6h ago',
        verified: false,
        location: 'Atlanta, GA',
        mutualFriends: 8,
        mutualEvents: 2,
    },
    {
        id: 's3',
        name: 'Olivia Martinez',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=100&q=80',
        online: true,
        verified: true,
        location: 'Phoenix, AZ',
        mutualFriends: 15,
        mutualEvents: 3,
        isNew: true,
    },
];

// Filter options
const FILTER_OPTIONS = [
    { id: 'all', label: 'All' },
    { id: 'online', label: 'Online Now' },
    { id: 'attending', label: 'Attending Events' },
    { id: 'streaming', label: 'Live Streaming' },
    { id: 'recent', label: 'Recently Active' },
];

const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
        case 'event':
            return <FiCalendar className="w-4 h-4 text-blue-500" />;
        case 'streaming':
            return <BsCameraVideoFill className="w-4 h-4 text-red-500" />;
        case 'ticket':
            return <IoTicket className="w-4 h-4 text-amber-500" />;
        case 'moment':
            return <FiCamera className="w-4 h-4 text-purple-500" />;
        default:
            return <FiClock className="w-4 h-4 text-gray-500" />;
    }
};

export default function FriendsView() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [expandedFriend, setExpandedFriend] = useState<string | null>(null);
    const [filteredFriends, setFilteredFriends] = useState<Friend[]>(FRIENDS_DATA);
    const [showSuggested, setShowSuggested] = useState(true);
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [animateNewActivity, setAnimateNewActivity] = useState<boolean[]>(
        Array(FRIENDS_DATA.length).fill(false)
    );

    const filterMenuRef = useRef<HTMLDivElement>(null);

    // Simulate random friend activity
    useEffect(() => {
        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * FRIENDS_DATA.length);
            const newAnimate = [...animateNewActivity];
            newAnimate[randomIndex] = true;
            setAnimateNewActivity(newAnimate);

            setTimeout(() => {
                const resetAnimate = [...newAnimate];
                resetAnimate[randomIndex] = false;
                setAnimateNewActivity(resetAnimate);
            }, 3000);
        }, 10000); // Every 10 seconds

        return () => clearInterval(interval);
    }, [animateNewActivity]);

    // Filter friends based on selected filter and search query
    useEffect(() => {
        let results = [...FRIENDS_DATA];

        // Apply filter
        switch (activeFilter) {
            case 'online':
                results = results.filter(friend => friend.online);
                break;
            case 'attending':
                results = results.filter(friend => friend.activity?.type === 'event');
                break;
            case 'streaming':
                results = results.filter(friend => friend.activity?.type === 'streaming');
                break;
            case 'recent':
                results = results.filter(friend =>
                    friend.online || (friend.lastSeen && friend.lastSeen.includes('h'))
                );
                break;
        }

        // Apply search
        if (searchQuery) {
            results = results.filter(friend =>
                friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (friend.location && friend.location.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        setFilteredFriends(results);
    }, [activeFilter, searchQuery]);

    // Close filter menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterMenuRef.current && !filterMenuRef.current.contains(event.target as Node)) {
                setShowFilterMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex flex-col">
                {/* Header with search and filter */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-gray-900">Friends</h1>
                        <div className="flex items-center gap-2">
                            <Link href="/friends/requests">
                                <span className="text-sm font-medium text-[#FF5722] hover:underline">Friend Requests</span>
                            </Link>
                            <div className="h-4 w-px bg-gray-300"></div>
                            <Link href="/friends/find">
                                <span className="text-sm font-medium text-[#FF5722] hover:underline">Find Friends</span>
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search input */}
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder="Search friends..."
                                className="w-full py-3 pl-10 pr-4 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF5722] focus:border-transparent transition-all text-gray-700"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <FiSearch className="w-5 h-5" />
                            </div>
                            {searchQuery && (
                                <button
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    onClick={() => setSearchQuery('')}
                                >
                                    <FiX className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Filter dropdown */}
                        <div className="relative" ref={filterMenuRef}>
                            <button
                                className="w-full sm:w-auto py-3 px-4 flex items-center justify-between gap-2 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors text-gray-700"
                                onClick={() => setShowFilterMenu(!showFilterMenu)}
                            >
                                <div className="flex items-center gap-2">
                                    <FiFilter className="w-5 h-5 text-gray-500" />
                                    <span className="font-medium">
                                        {FILTER_OPTIONS.find(opt => opt.id === activeFilter)?.label || 'Filter'}
                                    </span>
                                </div>
                                <FiChevronDown className={`w-5 h-5 transition-transform ${showFilterMenu ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {showFilterMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute z-20 top-full mt-2 right-0 sm:left-0 bg-white rounded-xl shadow-lg border border-gray-200 w-56 overflow-hidden"
                                    >
                                        <div className="py-1">
                                            {FILTER_OPTIONS.map((option) => (
                                                <button
                                                    key={option.id}
                                                    className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 ${activeFilter === option.id ? 'bg-gray-50 text-[#FF5722] font-medium' : 'text-gray-700'
                                                        }`}
                                                    onClick={() => {
                                                        setActiveFilter(option.id);
                                                        setShowFilterMenu(false);
                                                    }}
                                                >
                                                    {option.label}
                                                    {activeFilter === option.id && (
                                                        <FiCheck className="w-4 h-4" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Suggested Friends Section */}
                {showSuggested && (
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-lg font-semibold text-gray-800">Suggested Friends</h2>
                            <button onClick={() => setShowSuggested(false)} className="text-gray-500 hover:text-gray-700">
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {SUGGESTED_FRIENDS.map((friend) => (
                                <SuggestedFriendCard key={friend.id} friend={friend} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Friends list */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-semibold text-gray-800">
                            {filteredFriends.length} {activeFilter !== 'all' ? FILTER_OPTIONS.find(opt => opt.id === activeFilter)?.label : ''} Friends
                        </h2>
                        <button className="text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center gap-1">
                            <BsThreeDots className="w-5 h-5" />
                        </button>
                    </div>

                    {filteredFriends.length === 0 ? (
                        <div className="text-center py-16 bg-gray-50 rounded-2xl">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                                <FiUserPlus className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-700 mb-2">No friends found</h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                {searchQuery
                                    ? `No friends match "${searchQuery}". Try a different search.`
                                    : `No friends with the selected filter. Try a different filter.`
                                }
                            </p>
                            <button
                                className="mt-4 px-5 py-2 bg-[#FF5722] text-white rounded-lg font-medium hover:bg-[#E64A19] transition-colors"
                                onClick={() => {
                                    setSearchQuery('');
                                    setActiveFilter('all');
                                }}
                            >
                                Reset Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {filteredFriends.map((friend, index) => (
                                <FriendCard
                                    key={friend.id}
                                    friend={friend}
                                    isExpanded={expandedFriend === friend.id}
                                    toggleExpand={() => setExpandedFriend(expandedFriend === friend.id ? null : friend.id)}
                                    animate={animateNewActivity[index]}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Friend Card Component
interface FriendCardProps {
    friend: Friend;
    isExpanded: boolean;
    toggleExpand: () => void;
    animate: boolean;
}

function FriendCard({ friend, isExpanded, toggleExpand, animate }: FriendCardProps) {

    return (
        <motion.div
            className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 transition-all ${isExpanded ? 'ring-2 ring-[#FF5722]' : 'hover:shadow-md'
                }`}
            animate={animate ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 0.5 }}
        >
            <div className="p-4">
                <div className="flex items-start gap-3">
                    {/* Profile Image & Status */}
                    <div className="relative">
                        <div className="w-14 h-14 rounded-full overflow-hidden">
                            <Image
                                src={friend.image}
                                alt={friend.name}
                                width={56}
                                height={56}
                                className="object-cover"
                            />
                        </div>
                        {friend.online ? (
                            <div className="absolute -right-0.5 -bottom-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        ) : friend.lastSeen ? (
                            <div className="absolute -right-1 -bottom-1 w-5 h-5 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center">
                                <FiClock className="w-3 h-3 text-gray-500" />
                            </div>
                        ) : null}
                    </div>

                    {/* Friend Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                            <h3 className="font-semibold text-gray-900 truncate">{friend.name}</h3>
                            {friend.verified && (
                                <span className="flex-shrink-0 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                    <FiCheck className="w-3 h-3 text-white" />
                                </span>
                            )}
                            {friend.isNew && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">
                                    NEW
                                </span>
                            )}
                        </div>
                        {friend.location && (
                            <p className="text-sm text-gray-500 truncate">{friend.location}</p>
                        )}

                        {/* Mutual stats */}
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <span>{friend.mutualFriends} mutual friends</span>
                            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                            <span>{friend.mutualEvents} mutual events</span>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-1">
                        <Link
                            href={`/messages/${friend.id}`}
                            className="p-2 text-gray-500 hover:text-[#FF5722] hover:bg-[#FF5722]/5 rounded-full transition-colors"
                            aria-label="Message"
                        >
                            <FiMessageSquare className="w-5 h-5" />
                        </Link>
                        <button
                            onClick={toggleExpand}
                            className={`p-2 rounded-full transition-colors ${isExpanded
                                ? 'text-[#FF5722] bg-[#FF5722]/10'
                                : 'text-gray-500 hover:text-[#FF5722] hover:bg-[#FF5722]/5'
                                }`}
                            aria-label="More options"
                        >
                            <FiMoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Activity */}
                {friend.activity && (
                    <motion.div
                        className="mt-3 pt-3 border-t border-gray-100"
                        animate={animate ? { backgroundColor: ['rgba(255,87,34,0.05)', 'rgba(255,87,34,0)', 'rgba(255,87,34,0)'] } : {}}
                        transition={{ duration: 2 }}
                    >
                        <div className="flex items-center gap-2 text-sm">
                            <div className="w-5 h-5 flex-shrink-0">
                                {getActivityIcon(friend.activity.type)}
                            </div>
                            <span className="flex-1 text-gray-700">{friend.activity.content}</span>
                            <span className="text-xs text-gray-500 flex-shrink-0">{friend.activity.timeAgo}</span>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Expanded actions */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gray-50 border-t border-gray-100 overflow-hidden"
                    >
                        <div className="grid grid-cols-2 gap-1 p-2">
                            <ExpandedAction
                                label="View Profile"
                                href={`/profile/${friend.id}`}
                            />
                            <ExpandedAction
                                label="Invite to Event"
                                href={`/events/invite?friend=${friend.id}`}
                            />
                            <ExpandedAction
                                label="Share Tickets"
                                href={`/tickets/share?friend=${friend.id}`}
                            />
                            <ExpandedAction
                                label="Hide Activity"
                                onClick={() => console.log('Hide activity for', friend.id)}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// Suggested Friend Card
function SuggestedFriendCard({ friend }: { friend: Friend }) {
    return (
        <motion.div
            className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-all"
            whileHover={{ y: -2 }}
        >
            <div className="p-4">
                <div className="flex items-center gap-3">
                    {/* Profile Image & Status */}
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                            <Image
                                src={friend.image}
                                alt={friend.name}
                                width={48}
                                height={48}
                                className="object-cover"
                            />
                        </div>
                        {friend.online && (
                            <div className="absolute -right-0.5 -bottom-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                    </div>

                    {/* Friend Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                            <h3 className="font-semibold text-gray-900 truncate">{friend.name}</h3>
                            {friend.verified && (
                                <span className="flex-shrink-0 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                    <FiCheck className="w-3 h-3 text-white" />
                                </span>
                            )}
                        </div>

                        {/* Mutual stats */}
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                            <span>{friend.mutualFriends} mutual friends</span>
                            {friend.isNew && (
                                <>
                                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                    <span className="text-blue-600 font-medium">New on Rovify</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                    <button className="py-1.5 px-2 bg-[#FF5722] text-white text-sm font-medium rounded-lg hover:bg-[#E64A19] transition-colors">
                        Add Friend
                    </button>
                    <button className="py-1.5 px-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                        Remove
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

// Expanded action button or link
function ExpandedAction({
    label,
    onClick,
    href
}: {
    label: string;
    onClick?: () => void;
    href?: string;
}) {
    const content = (
        <div className="py-2 px-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-center">
            {label}
        </div>
    );

    if (href) {
        return <Link href={href}>{content}</Link>;
    }

    return <button onClick={onClick}>{content}</button>;
}