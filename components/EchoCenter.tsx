/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    FiMessageCircle, FiSearch, FiX, FiMoreHorizontal, FiMapPin,
    FiPhone, FiVideo, FiInfo, FiSend, FiPaperclip, FiSmile,
    FiUsers, FiStar, FiEdit3, FiSettings, FiPlus, FiCheck,
    FiCalendar, FiClock, FiFilter, FiGrid, FiList, FiTrendingUp,
    FiMenu, FiImage, FiFile, FiMic, FiHeart, FiThumbsUp
} from 'react-icons/fi';
import { BsStars, BsMusicNote, BsTicket, BsFire, BsSteam, BsPeople, BsEmojiSmile } from 'react-icons/bs';

// Types
interface Message {
    id: number;
    userId: number;
    userName: string;
    userAvatar: string;
    content: string;
    timestamp: string;
    type: 'text' | 'image' | 'file' | 'emoji';
    reactions?: { emoji: string; count: number; users: number[] }[];
}

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
    messages?: Message[];
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

const SAMPLE_MESSAGES: Message[] = [
    {
        id: 1,
        userId: 2,
        userName: 'Alex Rivera',
        userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        content: 'Hey everyone! So excited for tonight\'s event! 🎉',
        timestamp: '14:30',
        type: 'text',
        reactions: [{ emoji: '🎉', count: 3, users: [1, 3, 4] }, { emoji: '❤️', count: 2, users: [1, 5] }]
    },
    {
        id: 2,
        userId: 1,
        userName: 'Sarah Johnson',
        userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
        content: 'Same here! The lineup looks incredible',
        timestamp: '14:32',
        type: 'text'
    },
    {
        id: 3,
        userId: 3,
        userName: 'Maya Patel',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
        content: 'Just shared the event poster in our group! 📸',
        timestamp: '14:35',
        type: 'text'
    }
];

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
        verified: true,
        messages: SAMPLE_MESSAGES
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
    }
];

const ONLINE_USERS = [
    { id: 1, name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face' },
    { id: 2, name: 'Maya Patel', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face' },
    { id: 3, name: 'Jordan Kim', avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=400&fit=crop&crop=face' },
    { id: 4, name: 'Emma Wilson', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face' },
    { id: 5, name: 'Michael Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face' }
];

const EMOJI_LIST = ['😀', '😂', '😍', '🤔', '😢', '😮', '😡', '👍', '👎', '❤️', '🎉', '🔥', '💯', '👏', '🙌', '💪', '🚀', '⭐', '💡', '🎯'];

export default function EchoCenter() {
    const [activeTab, setActiveTab] = useState<'rooms' | 'groups' | 'friends'>('rooms');
    const [activeFilter, setActiveFilter] = useState<'all' | 'before' | 'during' | 'after'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [messageInput, setMessageInput] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [messages, setMessages] = useState<Message[]>(SAMPLE_MESSAGES);
    const [isTyping, setIsTyping] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Detect screen size
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Filter rooms based on active tab and filter
    const filteredRooms = ROOMS_DATA.filter(room => {
        if (activeTab !== 'rooms' && room.category !== activeTab) return false;
        if (activeFilter !== 'all' && room.eventPhase !== activeFilter) return false;
        if (searchQuery && !room.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Handle message sending
    const handleSendMessage = () => {
        if (!messageInput.trim() || !selectedRoom) return;

        const newMessage: Message = {
            id: Date.now(),
            userId: CURRENT_USER.id,
            userName: CURRENT_USER.name,
            userAvatar: CURRENT_USER.avatar,
            content: messageInput,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'text'
        };

        setMessages(prev => [...prev, newMessage]);
        setMessageInput('');
        setShowEmojiPicker(false);

        // Simulate typing indicator
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000);
    };

    // Handle emoji selection
    const handleEmojiSelect = (emoji: string) => {
        setMessageInput(prev => prev + emoji);
        setShowEmojiPicker(false);
    };

    // Handle file upload
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);

        // Simulate upload
        setTimeout(() => {
            const newMessage: Message = {
                id: Date.now(),
                userId: CURRENT_USER.id,
                userName: CURRENT_USER.name,
                userAvatar: CURRENT_USER.avatar,
                content: `Shared ${file.name}`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: 'file'
            };

            setMessages(prev => [...prev, newMessage]);
            setIsUploading(false);
        }, 1500);
    };

    // Handle keyboard shortcuts
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Add reaction to message
    const addReaction = (messageId: number, emoji: string) => {
        setMessages(prev => prev.map(msg => {
            if (msg.id === messageId) {
                const existingReaction = msg.reactions?.find(r => r.emoji === emoji);
                if (existingReaction) {
                    // Toggle reaction
                    if (existingReaction.users.includes(CURRENT_USER.id)) {
                        existingReaction.users = existingReaction.users.filter(id => id !== CURRENT_USER.id);
                        existingReaction.count--;
                    } else {
                        existingReaction.users.push(CURRENT_USER.id);
                        existingReaction.count++;
                    }
                } else {
                    // Add new reaction
                    if (!msg.reactions) msg.reactions = [];
                    msg.reactions.push({ emoji, count: 1, users: [CURRENT_USER.id] });
                }
            }
            return msg;
        }));
    };

    // Handle room selection
    const handleRoomSelect = (room: Room) => {
        setSelectedRoom(room);
        setMessages(room.messages || []);
        // Only close sidebar on mobile
        if (isMobile) {
            setIsSidebarOpen(false);
        }
    };

    return (
        <div className="h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 flex overflow-hidden relative">
            {/* Mobile Sidebar Overlay */}
            {isMobile && isSidebarOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                />
            )}

            {/* Left Sidebar - Fixed Responsive Issues */}
            <motion.div
                initial={false}
                animate={{
                    x: isMobile ? (isSidebarOpen ? 0 : -400) : 0,
                    width: isMobile ? '85vw' : '320px'
                }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className={`bg-white/90 backdrop-blur-xl border-r border-gray-200/60 flex flex-col shadow-2xl z-50 h-full ${isMobile ? 'fixed max-w-sm' : 'relative w-80'
                    }`}
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-200/60 bg-white/70 backdrop-blur-md">
                    {/* Mobile Close Button */}
                    {isMobile && (
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="font-bold text-lg bg-gradient-to-r from-[#FF5900] to-[#C281FF] bg-clip-text text-transparent">
                                Echo Center
                            </h1>
                            <motion.button
                                onClick={() => setIsSidebarOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiX className="w-5 h-5 text-gray-600" />
                            </motion.button>
                        </div>
                    )}

                    {/* User Profile */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-transparent bg-gradient-to-r from-[#FF5900] to-[#C281FF] p-0.5">
                                    <div className="w-full h-full rounded-2xl overflow-hidden bg-white">
                                        <Image
                                            src={CURRENT_USER.avatar}
                                            alt={CURRENT_USER.name}
                                            width={44}
                                            height={44}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#18E299] border-2 border-white rounded-full animate-pulse shadow-lg" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-gray-900 text-sm">{CURRENT_USER.name}</h2>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <FiMapPin className="w-3 h-3" />
                                    <span>{CURRENT_USER.location}</span>
                                </div>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2.5 hover:bg-gradient-to-r hover:from-[#FF5900]/10 hover:to-[#C281FF]/10 rounded-xl transition-all duration-300"
                        >
                            <FiSearch className="w-4 h-4 text-gray-600" />
                        </motion.button>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex bg-gray-100/80 backdrop-blur-sm rounded-2xl p-1 mb-4 border border-gray-200/40">
                        {(['rooms', 'groups', 'friends'] as const).map((tab) => (
                            <motion.button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-300 capitalize ${activeTab === tab
                                    ? 'bg-white text-gray-900 shadow-lg shadow-gray-200/60 border border-gray-200/50'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                                    }`}
                            >
                                {tab}
                            </motion.button>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-3 bg-gray-50/90 backdrop-blur-sm border border-gray-200/60 rounded-xl text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF5900]/30 focus:border-[#FF5900]/50 transition-all duration-300"
                        />
                    </div>
                </div>

                {/* Online Users */}
                <div className="px-4 py-3 border-b border-gray-200/60">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 text-sm">Online Now</h3>
                        <span className="text-xs text-white bg-[#18E299] px-2 py-1 rounded-full font-medium">{ONLINE_USERS.length}</span>
                    </div>
                    <div className="flex -space-x-2">
                        {ONLINE_USERS.slice(0, 8).map((user, index) => (
                            <motion.div
                                key={user.id}
                                className="relative group"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.15, zIndex: 10 }}
                            >
                                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-lg">
                                    <Image
                                        src={user.avatar}
                                        alt={user.name}
                                        width={32}
                                        height={32}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#18E299] border-2 border-white rounded-full" />

                                {/* Tooltip */}
                                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
                                    {user.name}
                                </div>
                            </motion.div>
                        ))}
                        {ONLINE_USERS.length > 8 && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF5900] to-[#C281FF] border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-lg">
                                +{ONLINE_USERS.length - 8}
                            </div>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className="px-4 py-3 border-b border-gray-200/60">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-1.5 flex-wrap">
                            {(['all', 'before', 'during', 'after'] as const).map((filter) => (
                                <motion.button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-300 capitalize ${activeFilter === filter
                                        ? 'bg-gradient-to-r from-[#FF5900] to-[#C281FF] text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {filter}
                                </motion.button>
                            ))}
                        </div>
                        <div className="flex items-center gap-1">
                            <motion.button
                                onClick={() => setViewMode('list')}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`p-2 rounded-xl transition-all duration-300 ${viewMode === 'list' ? 'bg-[#FF5900]/10 text-[#FF5900]' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <FiList className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                                onClick={() => setViewMode('grid')}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className={`p-2 rounded-xl transition-all duration-300 ${viewMode === 'grid' ? 'bg-[#FF5900]/10 text-[#FF5900]' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <FiGrid className="w-4 h-4" />
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Rooms List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-2">
                        <AnimatePresence>
                            {filteredRooms.map((room, index) => (
                                <motion.div
                                    key={room.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => handleRoomSelect(room)}
                                    className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all duration-300 mb-2 group ${selectedRoom?.id === room.id
                                        ? 'bg-gradient-to-r from-[#FF5900]/5 to-[#C281FF]/5 shadow-lg border border-[#FF5900]/20 scale-[1.02]'
                                        : 'hover:bg-gray-50/80 hover:scale-[1.01] hover:shadow-md'
                                        }`}
                                >
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-2xl overflow-hidden border border-gray-200/60 shadow-sm">
                                            <Image
                                                src={room.avatar}
                                                alt={room.name}
                                                width={48}
                                                height={48}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        </div>
                                        {room.isActive && (
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#18E299] border-2 border-white rounded-full animate-pulse shadow-sm" />
                                        )}
                                        {room.eventType && (
                                            <motion.div
                                                className="absolute -top-1 -left-1 w-5 h-5 bg-gradient-to-r from-[#FF5900] to-[#C281FF] rounded-full flex items-center justify-center shadow-lg"
                                                animate={{ rotate: [0, 360] }}
                                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                            >
                                                {room.eventType === 'music' ? (
                                                    <BsMusicNote className="w-2.5 h-2.5 text-white" />
                                                ) : room.eventType === 'tech' ? (
                                                    <BsStars className="w-2.5 h-2.5 text-white" />
                                                ) : (
                                                    <BsTicket className="w-2.5 h-2.5 text-white" />
                                                )}
                                            </motion.div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-semibold text-gray-900 truncate text-sm">
                                                {room.name}
                                                {room.verified && (
                                                    <FiStar className="w-3 h-3 text-[#3329CF] inline ml-1" />
                                                )}
                                            </h3>
                                            <span className="text-xs text-gray-500">{room.timestamp}</span>
                                        </div>
                                        <p className="text-xs text-gray-600 truncate mb-2">{room.lastMessage}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-xs">
                                                <div className="flex items-center gap-1 bg-gradient-to-r from-[#FF5900]/10 to-[#C281FF]/10 rounded-full px-2 py-1">
                                                    <FiUsers className="w-3 h-3 text-[#FF5900]" />
                                                    <span className="text-[#FF5900] font-medium">{room.memberCount}</span>
                                                </div>
                                                <div className="flex items-center gap-1 bg-[#18E299]/10 rounded-full px-2 py-1">
                                                    <div className="w-2 h-2 bg-[#18E299] rounded-full animate-pulse" />
                                                    <span className="text-[#18E299] font-medium">{room.online}</span>
                                                </div>
                                            </div>
                                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${room.eventPhase === 'during' ? 'bg-red-100 text-red-700' :
                                                room.eventPhase === 'before' ? 'bg-[#3329CF]/10 text-[#3329CF]' :
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

                {/* Bottom Actions */}
                <div className="p-3 border-t border-gray-200/60 bg-white/70 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#FF5900] to-[#C281FF] text-white rounded-2xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <FiPlus className="w-4 h-4" />
                            Create Room
                        </motion.button>
                        <div className="flex items-center gap-1">
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-3 hover:bg-gray-100 rounded-2xl transition-all duration-300"
                            >
                                <BsSteam className="w-4 h-4 text-gray-600" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: -5 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-3 hover:bg-gray-100 rounded-2xl transition-all duration-300"
                            >
                                <FiSettings className="w-4 h-4 text-gray-600" />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Chat Area - Fixed Layout */}
            <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-white via-gray-50/30 to-gray-100/30">
                {/* Mobile Header */}
                {isMobile && (
                    <div className="flex items-center justify-between p-4 border-b border-gray-200/60 bg-white/90 backdrop-blur-md">
                        <motion.button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FiMenu className="w-5 h-5 text-gray-600" />
                        </motion.button>
                        {selectedRoom ? (
                            <div className="flex items-center gap-2">
                                <Image
                                    src={selectedRoom.avatar}
                                    alt={selectedRoom.name}
                                    width={32}
                                    height={32}
                                    className="w-8 h-8 rounded-xl object-cover"
                                />
                                <h1 className="font-semibold text-gray-900 truncate max-w-[150px]">
                                    {selectedRoom.name}
                                </h1>
                            </div>
                        ) : (
                            <h1 className="font-bold text-lg bg-gradient-to-r from-[#FF5900] to-[#C281FF] bg-clip-text text-transparent">
                                Echo
                            </h1>
                        )}
                        <div className="w-10" /> {/* Spacer */}
                    </div>
                )}

                {selectedRoom ? (
                    <>
                        {/* Room Header - Desktop Only */}
                        {!isMobile && (
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/60 bg-white/90 backdrop-blur-md">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-2xl overflow-hidden border border-gray-200/60 shadow-lg">
                                            <Image
                                                src={selectedRoom.avatar}
                                                alt={selectedRoom.name}
                                                width={48}
                                                height={48}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {selectedRoom.isActive && (
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#18E299] border-2 border-white rounded-full animate-pulse shadow-sm" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-xl font-bold text-gray-900">{selectedRoom.name}</h2>
                                            {selectedRoom.verified && (
                                                <FiStar className="w-5 h-5 text-[#3329CF]" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <FiUsers className="w-4 h-4" />
                                                <span>{selectedRoom.memberCount} members</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className="w-2 h-2 bg-[#18E299] rounded-full animate-pulse" />
                                                <span>{selectedRoom.online} online</span>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${selectedRoom.eventPhase === 'during' ? 'bg-red-100 text-red-700' :
                                                selectedRoom.eventPhase === 'before' ? 'bg-[#3329CF]/10 text-[#3329CF]' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                {selectedRoom.eventPhase}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-3 hover:bg-gray-100 rounded-2xl transition-all duration-300"
                                    >
                                        <FiPhone className="w-5 h-5 text-gray-600" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-3 hover:bg-gray-100 rounded-2xl transition-all duration-300"
                                    >
                                        <FiVideo className="w-5 h-5 text-gray-600" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-3 hover:bg-gray-100 rounded-2xl transition-all duration-300"
                                    >
                                        <FiInfo className="w-5 h-5 text-gray-600" />
                                    </motion.button>
                                </div>
                            </div>
                        )}

                        {/* Chat Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 custom-scrollbar">
                            <AnimatePresence>
                                {messages.map((message, index) => (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`flex gap-3 group ${message.userId === CURRENT_USER.id ? 'flex-row-reverse' : ''}`}
                                    >
                                        <Image
                                            src={message.userAvatar}
                                            alt={message.userName}
                                            width={36}
                                            height={36}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className={`flex-1 max-w-sm lg:max-w-md ${message.userId === CURRENT_USER.id ? 'text-right' : ''}`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-semibold text-gray-900">{message.userName}</span>
                                                <span className="text-xs text-gray-500">{message.timestamp}</span>
                                            </div>
                                            <div className={`p-4 rounded-2xl shadow-sm ${message.userId === CURRENT_USER.id
                                                ? 'bg-gradient-to-r from-[#FF5900] to-[#C281FF] text-white ml-auto'
                                                : 'bg-white border border-gray-200/60'
                                                }`}>
                                                <p className="text-sm leading-relaxed">{message.content}</p>
                                            </div>

                                            {/* Reactions */}
                                            {message.reactions && message.reactions.length > 0 && (
                                                <div className="flex gap-1 mt-2 flex-wrap">
                                                    {message.reactions.map((reaction, idx) => (
                                                        <motion.button
                                                            key={idx}
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => addReaction(message.id, reaction.emoji)}
                                                            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border transition-all duration-200 ${reaction.users.includes(CURRENT_USER.id)
                                                                ? 'bg-[#FF5900]/10 border-[#FF5900]/30 text-[#FF5900]'
                                                                : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                                                                }`}
                                                        >
                                                            <span>{reaction.emoji}</span>
                                                            <span className="font-medium">{reaction.count}</span>
                                                        </motion.button>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Quick Reactions */}
                                            <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                {['❤️', '👍', '😂', '🎉'].map((emoji) => (
                                                    <motion.button
                                                        key={emoji}
                                                        whileHover={{ scale: 1.3 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => addReaction(message.id, emoji)}
                                                        className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors duration-200"
                                                    >
                                                        {emoji}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Typing Indicator */}
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-3 text-sm text-gray-500"
                                >
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-[#FF5900] rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-[#C281FF] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-[#3329CF] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                    <span>Someone is typing...</span>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="p-4 lg:p-6 border-t border-gray-200/60 bg-white/90 backdrop-blur-md relative">
                            {/* File Upload Progress */}
                            {isUploading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-4 p-3 bg-[#3329CF]/5 border border-[#3329CF]/20 rounded-2xl"
                                >
                                    <div className="flex items-center gap-3">
                                        <FiFile className="w-4 h-4 text-[#3329CF]" />
                                        <span className="text-sm text-[#3329CF] font-medium">Uploading file...</span>
                                        <div className="ml-auto w-20 h-2 bg-[#3329CF]/20 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-[#3329CF] to-[#C281FF]"
                                                animate={{ width: '100%' }}
                                                transition={{ duration: 1.5 }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div className="flex items-end gap-3">
                                {/* Attachment Button */}
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-3 hover:bg-gray-100 rounded-2xl transition-all duration-300 flex-shrink-0"
                                >
                                    <FiPaperclip className="w-5 h-5 text-gray-600" />
                                </motion.button>

                                {/* Message Input Container */}
                                <div className="flex-1 relative">
                                    <textarea
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Type your message..."
                                        rows={1}
                                        className="w-full px-4 py-4 bg-gray-50/90 backdrop-blur-sm border border-gray-200/60 rounded-2xl text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF5900]/30 focus:border-[#FF5900]/50 pr-20 resize-none transition-all duration-300 max-h-32"
                                    />

                                    {/* Input Actions */}
                                    <div className="absolute right-3 bottom-3 flex items-center gap-1">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                            className="p-2 hover:bg-gray-200 rounded-full transition-all duration-200"
                                        >
                                            <FiSmile className="w-4 h-4 text-gray-600" />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={handleSendMessage}
                                            disabled={!messageInput.trim()}
                                            className={`p-2.5 rounded-full transition-all duration-300 ${messageInput.trim()
                                                ? 'bg-gradient-to-r from-[#FF5900] to-[#C281FF] text-white shadow-lg hover:shadow-xl'
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                }`}
                                        >
                                            <FiSend className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Emoji Picker */}
                                <AnimatePresence>
                                    {showEmojiPicker && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.8, y: 10 }}
                                            className="absolute bottom-full right-6 mb-2 p-4 bg-white border border-gray-200/60 rounded-2xl shadow-2xl z-50 w-72"
                                        >
                                            <div className="grid grid-cols-8 gap-2">
                                                {EMOJI_LIST.map((emoji, index) => (
                                                    <motion.button
                                                        key={index}
                                                        whileHover={{ scale: 1.2 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => handleEmojiSelect(emoji)}
                                                        className="p-2 text-lg hover:bg-gray-100 rounded-xl transition-colors duration-200"
                                                    >
                                                        {emoji}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </>
                ) : (
                    // No Room Selected
                    <div className="flex-1 flex items-center justify-center p-8">
                        <div className="text-center max-w-md">
                            <motion.div
                                className="w-28 h-28 mx-auto mb-8 bg-gradient-to-br from-[#FF5900] via-[#C281FF] to-[#3329CF] rounded-3xl flex items-center justify-center shadow-2xl"
                                animate={{
                                    rotate: [0, 5, -5, 0],
                                    scale: [1, 1.05, 1]
                                }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <FiMessageCircle className="w-14 h-14 text-white" />
                            </motion.div>
                            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#FF5900] via-[#C281FF] to-[#3329CF] bg-clip-text text-transparent mb-4">
                                Welcome to Echo
                            </h2>
                            <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                                Connect with event rooms, join amazing groups, and chat with friends from around the world.
                            </p>
                            {isMobile && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsSidebarOpen(true)}
                                    className="px-8 py-4 bg-gradient-to-r from-[#FF5900] to-[#C281FF] text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    Browse Rooms
                                </motion.button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,video/*,.pdf,.doc,.docx,.txt"
            />

            {/* Enhanced Custom Scrollbar & Styles */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0,0,0,0.05);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, #FF5900, #C281FF);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(135deg, #e04d00, #a365d9);
                }
                
                /* Custom textarea auto-resize */
                textarea {
                    resize: none;
                    overflow-y: auto;
                }
                
                /* Hide scrollbar for webkit browsers */
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                
                /* Smooth transitions */
                * {
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }
            `}</style>
        </div >
    );
}