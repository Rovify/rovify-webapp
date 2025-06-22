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
    },
    {
        id: 4,
        userId: 4,
        userName: 'Jordan Kim',
        userAvatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=400&fit=crop&crop=face',
        content: 'The venue looks amazing! Can\'t wait to see everyone there 🚀',
        timestamp: '14:38',
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
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [messageInput, setMessageInput] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [messages, setMessages] = useState<Message[]>(SAMPLE_MESSAGES);
    const [isTyping, setIsTyping] = useState(false);
    const [showSearchModal, setShowSearchModal] = useState(false);

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

    // Filter rooms based on active tab and search
    const filteredRooms = ROOMS_DATA.filter(room => {
        if (activeTab !== 'rooms' && room.category !== activeTab) return false;
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
        <div className="h-screen bg-white text-gray-900 flex overflow-hidden relative">
            {/* Mobile Sidebar Overlay */}
            {isMobile && isSidebarOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                />
            )}

            {/* Search Modal */}
            <AnimatePresence>
                {showSearchModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowSearchModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-gray-900">Search Echo</h2>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowSearchModal(false)}
                                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                    >
                                        <FiX className="w-5 h-5 text-gray-600" />
                                    </motion.button>
                                </div>
                                <div className="relative">
                                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Search rooms, groups, friends..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF5900] focus:border-[#FF5900] transition-all duration-200"
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div className="max-h-96 overflow-y-auto p-4">
                                {filteredRooms.length > 0 ? (
                                    <div className="space-y-2">
                                        {filteredRooms.map((room) => (
                                            <motion.div
                                                key={room.id}
                                                whileHover={{ scale: 1.02 }}
                                                onClick={() => {
                                                    handleRoomSelect(room);
                                                    setShowSearchModal(false);
                                                }}
                                                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                                            >
                                                <Image
                                                    src={room.avatar}
                                                    alt={room.name}
                                                    width={48}
                                                    height={48}
                                                    className="w-12 h-12 rounded-xl object-cover"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900">{room.name}</h3>
                                                    <p className="text-sm text-gray-600">{room.memberCount} members • {room.online} online</p>
                                                </div>
                                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${room.eventPhase === 'during' ? 'bg-red-100 text-red-700' :
                                                    room.eventPhase === 'before' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {room.eventPhase}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <FiSearch className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500">No results found</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Left Sidebar */}
            <motion.div
                initial={false}
                animate={{
                    x: isMobile ? (isSidebarOpen ? 0 : -400) : 0,
                    width: isMobile ? '85vw' : '320px'
                }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className={`bg-white border-r border-gray-100 flex flex-col shadow-lg z-50 h-full ${isMobile ? 'fixed max-w-sm' : 'relative w-80'
                    }`}
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-100">
                    {/* Mobile Close Button */}
                    {isMobile && (
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="font-bold text-lg text-[#FF5900]">Echo Center</h1>
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
                                <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-[#FF5900] p-0.5">
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
                                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-[#18E299] border-2 border-white rounded-full" />
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
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowSearchModal(true)}
                            className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            <FiSearch className="w-4 h-4 text-gray-600" />
                        </motion.button>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex bg-gray-50 rounded-xl p-1 mb-4">
                        {(['rooms', 'groups', 'friends'] as const).map((tab) => (
                            <motion.button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${activeTab === tab
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {tab}
                            </motion.button>
                        ))}
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
                                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 mb-2 group ${selectedRoom?.id === room.id
                                        ? 'bg-[#FF5900]/5 border border-[#FF5900]/20'
                                        : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                            <Image
                                                src={room.avatar}
                                                alt={room.name}
                                                width={48}
                                                height={48}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {room.isActive && (
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#18E299] border-2 border-white rounded-full" />
                                        )}
                                        {room.eventType && (
                                            <div className="absolute -top-1 -left-1 w-5 h-5 bg-[#FF5900] rounded-full flex items-center justify-center">
                                                {room.eventType === 'music' ? (
                                                    <BsMusicNote className="w-2.5 h-2.5 text-white" />
                                                ) : room.eventType === 'tech' ? (
                                                    <BsStars className="w-2.5 h-2.5 text-white" />
                                                ) : (
                                                    <BsTicket className="w-2.5 h-2.5 text-white" />
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-semibold text-gray-900 truncate text-sm">
                                                {room.name}
                                                {room.verified && (
                                                    <FiStar className="w-3 h-3 text-[#FF5900] inline ml-1" />
                                                )}
                                            </h3>
                                            <span className="text-xs text-gray-500">{room.timestamp}</span>
                                        </div>
                                        <p className="text-xs text-gray-600 truncate mb-2">{room.lastMessage}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-xs">
                                                <div className="flex items-center gap-1 bg-[#FF5900]/10 rounded-full px-2 py-1">
                                                    <FiUsers className="w-3 h-3 text-[#FF5900]" />
                                                    <span className="text-[#FF5900] font-medium">{room.memberCount}</span>
                                                </div>
                                                <div className="flex items-center gap-1 bg-[#18E299]/10 rounded-full px-2 py-1">
                                                    <div className="w-2 h-2 bg-[#18E299] rounded-full" />
                                                    <span className="text-[#18E299] font-medium">{room.online}</span>
                                                </div>
                                            </div>
                                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${room.eventPhase === 'during' ? 'bg-red-100 text-red-700' :
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

                {/* Bottom Actions */}
                <div className="p-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-4 py-3 bg-[#FF5900] text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            <FiPlus className="w-4 h-4" />
                            Create Room
                        </motion.button>
                        <div className="flex items-center gap-1">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                <BsSteam className="w-4 h-4 text-gray-600" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                <FiSettings className="w-4 h-4 text-gray-600" />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
                {/* Mobile Header */}
                {isMobile && (
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                        <motion.button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FiMenu className="w-5 h-5 text-gray-600" />
                        </motion.button>

                        {selectedRoom ? (
                            <div className="flex items-center gap-2 flex-1 justify-center">
                                <Image
                                    src={selectedRoom.avatar}
                                    alt={selectedRoom.name}
                                    width={32}
                                    height={32}
                                    className="w-8 h-8 rounded-xl object-cover"
                                />
                                <div className="text-center">
                                    <h1 className="font-semibold text-gray-900 truncate max-w-[120px] text-sm">
                                        {selectedRoom.name}
                                    </h1>
                                    <p className="text-xs text-gray-500">{selectedRoom.online} online</p>
                                </div>
                            </div>
                        ) : (
                            <h1 className="font-bold text-lg text-[#FF5900] flex-1 text-center">Echo</h1>
                        )}

                        {/* Mobile Action Buttons - Only show when room is selected */}
                        {selectedRoom ? (
                            <div className="flex items-center gap-1">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    <FiPhone className="w-4 h-4 text-gray-600" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    <FiVideo className="w-4 h-4 text-gray-600" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    <FiInfo className="w-4 h-4 text-gray-600" />
                                </motion.button>
                            </div>
                        ) : (
                            <div className="w-14" /> /* Spacer for layout balance */
                        )}
                    </div>
                )}

                {selectedRoom ? (
                    <>
                        {/* Room Header - Desktop Only */}
                        {!isMobile && (
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                            <Image
                                                src={selectedRoom.avatar}
                                                alt={selectedRoom.name}
                                                width={48}
                                                height={48}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {selectedRoom.isActive && (
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#18E299] border-2 border-white rounded-full" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-xl font-bold text-gray-900">{selectedRoom.name}</h2>
                                            {selectedRoom.verified && (
                                                <FiStar className="w-5 h-5 text-[#FF5900]" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <FiUsers className="w-4 h-4" />
                                                <span>{selectedRoom.memberCount} members</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className="w-2 h-2 bg-[#18E299] rounded-full" />
                                                <span>{selectedRoom.online} online</span>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${selectedRoom.eventPhase === 'during' ? 'bg-red-100 text-red-700' :
                                                selectedRoom.eventPhase === 'before' ? 'bg-blue-100 text-blue-700' :
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
                                        className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                                    >
                                        <FiPhone className="w-5 h-5 text-gray-600" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                                    >
                                        <FiVideo className="w-5 h-5 text-gray-600" />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                                    >
                                        <FiInfo className="w-5 h-5 text-gray-600" />
                                    </motion.button>
                                </div>
                            </div>
                        )}

                        {/* Chat Messages Area - Clean White Background */}
                        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 bg-white">
                            <AnimatePresence>
                                {messages.map((message, index) => (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`flex gap-3 group ${message.userId === CURRENT_USER.id ? 'flex-row-reverse' : ''}`}
                                    >
                                        {/* Fixed Avatar Container */}
                                        <div className="w-9 h-9 rounded-2xl overflow-hidden flex-shrink-0">
                                            <Image
                                                src={message.userAvatar}
                                                alt={message.userName}
                                                width={36}
                                                height={36}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className={`flex-1 max-w-sm lg:max-w-md ${message.userId === CURRENT_USER.id ? 'text-right' : ''}`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-semibold text-gray-900">{message.userName}</span>
                                                <span className="text-xs text-gray-500">{message.timestamp}</span>
                                            </div>
                                            <div className={`p-4 rounded-2xl shadow-sm ${message.userId === CURRENT_USER.id
                                                ? 'bg-[#FF5900] text-white ml-auto'
                                                : 'bg-gray-50 border border-gray-200'
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
                                                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
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
                                        <div className="w-2 h-2 bg-[#FF5900] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-[#FF5900] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                    <span>Someone is typing...</span>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="p-4 lg:p-6 border-t border-gray-200 bg-white relative">
                            {/* File Upload Progress */}
                            {isUploading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl"
                                >
                                    <div className="flex items-center gap-3">
                                        <FiFile className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm text-blue-700 font-medium">Uploading file...</span>
                                        <div className="ml-auto w-20 h-2 bg-blue-200 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-[#FF5900]"
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
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-3 hover:bg-gray-100 rounded-xl transition-colors flex-shrink-0"
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
                                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF5900] focus:border-[#FF5900] pr-20 resize-none transition-all duration-200 max-h-32"
                                    />

                                    {/* Input Actions */}
                                    <div className="absolute right-3 bottom-3 flex items-center gap-1">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                        >
                                            <FiSmile className="w-4 h-4 text-gray-600" />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={handleSendMessage}
                                            disabled={!messageInput.trim()}
                                            className={`p-2.5 rounded-full transition-all duration-200 ${messageInput.trim()
                                                ? 'bg-[#FF5900] text-white shadow-lg hover:shadow-xl'
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
                                            className="absolute bottom-full right-6 mb-2 p-4 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 w-72"
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
                    <div className="flex-1 flex items-center justify-center p-8 bg-white">
                        <div className="text-center max-w-md">
                            <motion.div
                                className="w-28 h-28 mx-auto mb-8 bg-[#FF5900] rounded-3xl flex items-center justify-center shadow-2xl"
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
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">
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
                                    className="px-8 py-4 bg-[#FF5900] text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
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

            {/* Custom Scrollbar & Styles */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0,0,0,0.05);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #FF5900;
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #e04d00;
                }
                
                /* Custom textarea auto-resize */
                textarea {
                    resize: none;
                    overflow-y: auto;
                }
                
                /* Smooth transitions */
                * {
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }
            `}</style>
        </div>
    );
}