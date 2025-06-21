/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    FiMessageCircle, FiSearch, FiX, FiMoreHorizontal, FiMapPin,
    FiPhone, FiVideo, FiInfo, FiSend, FiPaperclip, FiSmile,
    FiUsers, FiStar, FiEdit3, FiSettings, FiPlus, FiCheck,
    FiCalendar, FiClock, FiFilter, FiGrid, FiList, FiTrendingUp
} from 'react-icons/fi';
import { BsStars, BsMusicNote, BsTicket, BsFire, BsSteam, BsPeople } from 'react-icons/bs';

// Types
interface Room {
    id: number;
    name: string;
    avatar: string;
    lastMessage: string;
    timestamp: string;
    memberCount: number;
    online: number;
    category: 'rooms' | 'groups' | 'friends';
    eventPhase: 'before' | 'during' | 'after';
    isActive: boolean;
    eventType?: string;
    verified?: boolean;
}

interface User {
    id: number;
    name: string;
    avatar: string;
    online: boolean;
    location: string;
}

// Mock data
const CURRENT_USER: User = {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
    online: true,
    location: 'Nairobi, Kenya'
};

const ROOMS_DATA: Room[] = [
    {
        id: 1,
        name: 'The Main Exclusive Room',
        avatar: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=400&fit=crop',
        lastMessage: 'So excited to go to this...',
        timestamp: '07:07',
        memberCount: 156,
        online: 89,
        category: 'rooms',
        eventPhase: 'before',
        isActive: true,
        eventType: 'music',
        verified: true
    },
    {
        id: 2,
        name: 'Summer Festival VIP',
        avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
        lastMessage: 'Who\'s bringing the energy tonight?',
        timestamp: '06:45',
        memberCount: 89,
        online: 45,
        category: 'groups',
        eventPhase: 'during',
        isActive: true,
        eventType: 'music'
    },
    {
        id: 3,
        name: 'Tech Summit Networking',
        avatar: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=400&fit=crop',
        lastMessage: 'Great presentations today!',
        timestamp: '05:23',
        memberCount: 234,
        online: 67,
        category: 'groups',
        eventPhase: 'after',
        isActive: false,
        eventType: 'tech'
    },
    {
        id: 4,
        name: 'Art Gallery Opening',
        avatar: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
        lastMessage: 'The installations are incredible',
        timestamp: '04:12',
        memberCount: 78,
        online: 23,
        category: 'rooms',
        eventPhase: 'during',
        isActive: true,
        eventType: 'art'
    },
    {
        id: 5,
        name: 'Foodie Meetup Group',
        avatar: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop',
        lastMessage: 'Next restaurant recommendation?',
        timestamp: '03:56',
        memberCount: 145,
        online: 34,
        category: 'friends',
        eventPhase: 'before',
        isActive: false,
        eventType: 'food'
    }
];

const ONLINE_USERS = [
    { id: 1, name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face' },
    { id: 2, name: 'Maya Patel', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face' },
    { id: 3, name: 'Jordan Kim', avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=400&fit=crop&crop=face' },
    { id: 4, name: 'Emma Wilson', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face' },
    { id: 5, name: 'Michael Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face' }
];

export default function EchoCenter() {
    const [activeTab, setActiveTab] = useState<'rooms' | 'groups' | 'friends'>('rooms');
    const [activeFilter, setActiveFilter] = useState<'all' | 'before' | 'during' | 'after'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

    // Filter rooms based on active tab and filter
    const filteredRooms = ROOMS_DATA.filter(room => {
        if (activeTab !== 'rooms' && room.category !== activeTab) return false;
        if (activeFilter !== 'all' && room.eventPhase !== activeFilter) return false;
        if (searchQuery && !room.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="h-screen bg-gray-50 text-gray-900 flex overflow-hidden">
            {/* Left Sidebar - Compact Material Design */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm">
                {/* Header - Compact */}
                <div className="p-4 border-b border-gray-200">
                    {/* User Profile */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200">
                                    <Image
                                        src={CURRENT_USER.avatar}
                                        alt={CURRENT_USER.name}
                                        width={36}
                                        height={36}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                            </div>
                            <div>
                                <h2 className="font-medium text-gray-900 text-sm">{CURRENT_USER.name}</h2>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <FiMapPin className="w-3 h-3" />
                                    <span>{CURRENT_USER.location}</span>
                                </div>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <FiSearch className="w-4 h-4 text-gray-600" />
                        </motion.button>
                    </div>

                    {/* Navigation Tabs - Material Design */}
                    <div className="flex bg-gray-100 rounded-lg p-0.5 mb-3">
                        {(['rooms', 'groups', 'friends'] as const).map((tab) => (
                            <motion.button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex-1 py-1.5 px-3 rounded-md text-sm font-medium transition-all duration-200 capitalize ${activeTab === tab
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {tab}
                            </motion.button>
                        ))}
                    </div>

                    {/* Search Bar - Compact */}
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>
                </div>

                {/* Online Users - Compact */}
                <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900 text-sm">Online Now</h3>
                        <span className="text-xs text-gray-500">{ONLINE_USERS.length}</span>
                    </div>
                    <div className="flex -space-x-1.5">
                        {ONLINE_USERS.slice(0, 8).map((user, index) => (
                            <motion.div
                                key={user.id}
                                className="relative"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.1, zIndex: 10 }}
                            >
                                <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                    <Image
                                        src={user.avatar}
                                        alt={user.name}
                                        width={28}
                                        height={28}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 border border-white rounded-full" />
                            </motion.div>
                        ))}
                        {ONLINE_USERS.length > 8 && (
                            <div className="w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                                +{ONLINE_USERS.length - 8}
                            </div>
                        )}
                    </div>
                </div>

                {/* Filters - Compact */}
                <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                            {(['all', 'before', 'during', 'after'] as const).map((filter) => (
                                <motion.button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200 capitalize ${activeFilter === filter
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {filter}
                                </motion.button>
                            ))}
                        </div>
                        <div className="flex items-center gap-0.5">
                            <motion.button
                                onClick={() => setViewMode('list')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`p-1 rounded transition-colors ${viewMode === 'list' ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                <FiList className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                                onClick={() => setViewMode('grid')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`p-1 rounded transition-colors ${viewMode === 'grid' ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                <FiGrid className="w-4 h-4" />
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Rooms List - Compact Material Cards */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-2">
                        <AnimatePresence>
                            {filteredRooms.map((room, index) => (
                                <motion.div
                                    key={room.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ delay: index * 0.03 }}
                                    onClick={() => setSelectedRoom(room)}
                                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 mb-1 ${selectedRoom?.id === room.id
                                        ? 'bg-orange-50 shadow-sm border border-orange-200'
                                        : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200">
                                            <Image
                                                src={room.avatar}
                                                alt={room.name}
                                                width={40}
                                                height={40}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {room.isActive && (
                                            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                                        )}
                                        {room.eventType && (
                                            <motion.div
                                                className="absolute -top-0.5 -left-0.5 w-4 h-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center"
                                                animate={{ rotate: [0, 360] }}
                                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                            >
                                                {room.eventType === 'music' ? (
                                                    <BsMusicNote className="w-2 h-2 text-white" />
                                                ) : room.eventType === 'tech' ? (
                                                    <BsStars className="w-2 h-2 text-white" />
                                                ) : (
                                                    <BsTicket className="w-2 h-2 text-white" />
                                                )}
                                            </motion.div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <h3 className="font-medium text-gray-900 truncate text-sm">
                                                {room.name}
                                                {room.verified && (
                                                    <FiStar className="w-3 h-3 text-blue-500 inline ml-1" />
                                                )}
                                            </h3>
                                            <span className="text-xs text-gray-500">{room.timestamp}</span>
                                        </div>
                                        <p className="text-xs text-gray-600 truncate mb-1">{room.lastMessage}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-xs">
                                                <div className="flex items-center gap-1 bg-orange-100 rounded-full px-1.5 py-0.5">
                                                    <FiUsers className="w-2.5 h-2.5 text-orange-600" />
                                                    <span className="text-orange-700 font-medium">{room.memberCount}</span>
                                                </div>
                                                <div className="flex items-center gap-1 bg-green-100 rounded-full px-1.5 py-0.5">
                                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                                    <span className="text-green-700 font-medium">{room.online}</span>
                                                </div>
                                            </div>
                                            <div className={`px-1.5 py-0.5 rounded text-xs font-medium ${room.eventPhase === 'during' ? 'bg-red-100 text-red-700' :
                                                room.eventPhase === 'before' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                {room.eventPhase}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Bottom Actions - Compact */}
                <div className="p-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium shadow-sm hover:shadow transition-all duration-200"
                        >
                            <FiPlus className="w-4 h-4" />
                            Create
                        </motion.button>
                        <div className="flex items-center gap-1">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <BsSteam className="w-4 h-4 text-gray-600" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <FiSettings className="w-4 h-4 text-gray-600" />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedRoom ? (
                    <>
                        {/* Room Header - Compact */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200">
                                        <Image
                                            src={selectedRoom.avatar}
                                            alt={selectedRoom.name}
                                            width={40}
                                            height={40}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {selectedRoom.isActive && (
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-lg font-semibold text-gray-900">{selectedRoom.name}</h2>
                                        {selectedRoom.verified && (
                                            <FiStar className="w-4 h-4 text-blue-500" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <FiUsers className="w-3 h-3" />
                                            <span>{selectedRoom.memberCount}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                                            <span>{selectedRoom.online} online</span>
                                        </div>
                                        <div className={`px-2 py-0.5 rounded text-xs font-medium ${selectedRoom.eventPhase === 'during' ? 'bg-red-100 text-red-700' :
                                            selectedRoom.eventPhase === 'before' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                            {selectedRoom.eventPhase}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-1">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <FiPhone className="w-4 h-4 text-gray-600" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <FiVideo className="w-4 h-4 text-gray-600" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <FiInfo className="w-4 h-4 text-gray-600" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Chat Messages Area */}
                        <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
                            <div className="text-center py-12">
                                <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                                    <FiMessageCircle className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to {selectedRoom.name}</h3>
                                <p className="text-gray-600">Start chatting with {selectedRoom.online} online members</p>
                            </div>
                        </div>

                        {/* Message Input - Compact */}
                        <div className="px-6 py-4 border-t border-gray-200 bg-white">
                            <div className="flex items-center gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <FiPlus className="w-4 h-4 text-gray-600" />
                                </motion.button>
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        placeholder="Type a message..."
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-14"
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                                        >
                                            <FiSmile className="w-4 h-4 text-gray-600" />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="p-1.5 bg-orange-500 text-white rounded-full"
                                        >
                                            <FiSend className="w-3 h-3" />
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    // No Room Selected - Compact
                    <div className="flex-1 flex items-center justify-center bg-gray-50">
                        <div className="text-center max-w-sm">
                            <motion.div
                                className="w-20 h-20 mx-auto mb-6 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg"
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <FiMessageCircle className="w-10 h-10 text-white" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Welcome to Echo</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Join event rooms, connect with groups, and chat with friends.
                                Select a room to start conversations.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Custom Scrollbar */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0,0,0,0.1);
                    border-radius: 2px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0,0,0,0.2);
                    border-radius: 2px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0,0,0,0.3);
                }
            `}</style>
        </div>
    );
}