/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiMessageCircle, FiSearch, FiX, FiMoreHorizontal, FiMapPin,
    FiPhone, FiVideo, FiInfo, FiSend, FiPaperclip, FiSmile,
    FiUsers, FiStar, FiEdit3, FiSettings, FiPlus, FiCheck,
    FiCalendar, FiClock, FiFilter, FiGrid, FiList, FiTrendingUp,
    FiUpload, FiImage, FiFile, FiMic, FiCamera
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
    description?: string;
    location?: string;
    eventDate?: string;
}

interface User {
    id: number;
    name: string;
    avatar: string;
    online: boolean;
    location: string;
}

interface Message {
    id: number;
    userId: number;
    userName: string;
    userAvatar: string;
    content: string;
    timestamp: string;
    type: 'text' | 'image' | 'file';
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
        verified: true,
        description: 'Exclusive music event with top DJs and artists from around the world.',
        location: 'Nairobi Convention Center',
        eventDate: 'June 25, 2025 - 8:00 PM'
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

const EMOJIS = ['😀', '😂', '😍', '🥳', '😎', '🤔', '👍', '❤️', '🔥', '💯', '🎉', '✨', '🙌', '👏', '💪', '🎵', '🎭', '🍕', '☕', '🌟'];

export default function EchoWebInterface() {
    const [activeTab, setActiveTab] = useState<'rooms' | 'groups' | 'friends'>('rooms');
    const [activeFilter, setActiveFilter] = useState<'all' | 'before' | 'during' | 'after'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [showSearchModal, setShowSearchModal] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showUploadMenu, setShowUploadMenu] = useState(false);
    const [showCallModal, setShowCallModal] = useState(false);
    const [showRoomInfo, setShowRoomInfo] = useState(false);
    const [callType, setCallType] = useState<'audio' | 'video' | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const uploadMenuRef = useRef<HTMLDivElement>(null);

    // Filter rooms based on active tab and filter
    const filteredRooms = ROOMS_DATA.filter(room => {
        if (activeTab !== 'rooms' && room.category !== activeTab) return false;
        if (activeFilter !== 'all' && room.eventPhase !== activeFilter) return false;
        if (searchQuery && !room.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    // Handle message sending
    const handleSendMessage = useCallback(() => {
        if (!newMessage.trim() || !selectedRoom) return;

        const message: Message = {
            id: Date.now(),
            userId: CURRENT_USER.id,
            userName: CURRENT_USER.name,
            userAvatar: CURRENT_USER.avatar,
            content: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'text'
        };

        setMessages(prev => [...prev, message]);
        setNewMessage('');
    }, [newMessage, selectedRoom]);

    // Handle emoji selection
    const handleEmojiSelect = (emoji: string) => {
        setNewMessage(prev => prev + emoji);
        setShowEmojiPicker(false);
    };

    // Handle file upload
    const handleFileUpload = (type: string) => {
        if (fileInputRef.current) {
            fileInputRef.current.accept = type === 'image' ? 'image/*' : '*/*';
            fileInputRef.current.click();
        }
        setShowUploadMenu(false);
    };

    // Handle call initiation
    const handleCall = (type: 'audio' | 'video') => {
        setCallType(type);
        setShowCallModal(true);
    };

    // Close modals when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
            if (uploadMenuRef.current && !uploadMenuRef.current.contains(event.target as Node)) {
                setShowUploadMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
            if (e.key === 'Escape') {
                setShowSearchModal(false);
                setShowEmojiPicker(false);
                setShowUploadMenu(false);
                setShowCallModal(false);
                setShowRoomInfo(false);
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [handleSendMessage]);

    return (
        <>
            <div className="h-screen bg-gray-50 text-gray-900 flex overflow-hidden">
                {/* Left Sidebar - Compact Material Design */}
                <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm">
                    {/* Header - Compact */}
                    <div className="p-4 border-b border-gray-200">
                        {/* User Profile */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="relative">
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
                            onClick={() => setShowSearchModal(true)}
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
                </div>

                {/* Filters - Compact */}
                <div className="px-4 py-3 border-b border-gray-200">
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
                                    onClick={() => handleCall('audio')}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <FiPhone className="w-4 h-4 text-gray-600" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleCall('video')}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <FiVideo className="w-4 h-4 text-gray-600" />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowRoomInfo(true)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <FiInfo className="w-4 h-4 text-gray-600" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Chat Messages Area */}
                        <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
                            {messages.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                                        <FiMessageCircle className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to {selectedRoom.name}</h3>
                                    <p className="text-gray-600">Start chatting with {selectedRoom.online} online members</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {messages.map((message) => (
                                        <div key={message.id} className="flex gap-3">
                                            <div className="w-8 h-8 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                                <Image
                                                    src={message.userAvatar}
                                                    alt={message.userName}
                                                    width={32}
                                                    height={32}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-medium text-gray-900 text-sm">{message.userName}</span>
                                                    <span className="text-xs text-gray-500">{message.timestamp}</span>
                                                </div>
                                                <div className="bg-white rounded-2xl px-4 py-2 shadow-sm border border-gray-200">
                                                    <p className="text-sm text-gray-900">{message.content}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Message Input - Compact */}
                        <div className="px-6 py-4 border-t border-gray-200 bg-white">
                            <div className="flex items-center gap-3">
                                <div className="relative" ref={uploadMenuRef}>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowUploadMenu(!showUploadMenu)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <FiPlus className="w-4 h-4 text-gray-600" />
                                    </motion.button>

                                    <AnimatePresence>
                                        {showUploadMenu && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="absolute bottom-full left-0 mb-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-2 min-w-[150px]"
                                            >
                                                <button
                                                    onClick={() => handleFileUpload('image')}
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                                                >
                                                    <FiImage className="w-4 h-4" />
                                                    Photo
                                                </button>
                                                <button
                                                    onClick={() => handleFileUpload('file')}
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                                                >
                                                    <FiFile className="w-4 h-4" />
                                                    File
                                                </button>
                                                <button
                                                    onClick={() => handleFileUpload('camera')}
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                                                >
                                                    <FiCamera className="w-4 h-4" />
                                                    Camera
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        placeholder="Type a message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pr-14"
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                                        <div className="relative" ref={emojiPickerRef}>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                                            >
                                                <FiSmile className="w-4 h-4 text-gray-600" />
                                            </motion.button>

                                            <AnimatePresence>
                                                {showEmojiPicker && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 10 }}
                                                        className="absolute bottom-full right-0 mb-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-3 grid grid-cols-5 gap-2"
                                                    >
                                                        {EMOJIS.map((emoji, index) => (
                                                            <button
                                                                key={index}
                                                                onClick={() => handleEmojiSelect(emoji)}
                                                                className="w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center text-lg"
                                                            >
                                                                {emoji}
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={handleSendMessage}
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

            {/* Search Modal */}
            <AnimatePresence>
                {showSearchModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        onClick={() => setShowSearchModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl p-6 w-full max-w-md mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <FiSearch className="w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search rooms, groups, friends..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 text-lg outline-none"
                                    autoFocus
                                />
                                <button
                                    onClick={() => setShowSearchModal(false)}
                                    className="p-1 hover:bg-gray-100 rounded-lg"
                                >
                                    <FiX className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {filteredRooms.map((room) => (
                                    <button
                                        key={room.id}
                                        onClick={() => {
                                            setSelectedRoom(room);
                                            setShowSearchModal(false);
                                        }}
                                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-2xl transition-colors"
                                    >
                                        <Image
                                            src={room.avatar}
                                            alt={room.name}
                                            width={40}
                                            height={40}
                                            className="w-10 h-10 rounded-lg object-cover"
                                        />
                                        <div className="text-left">
                                            <h3 className="font-medium text-gray-900">{room.name}</h3>
                                            <p className="text-sm text-gray-600">{room.memberCount} members</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Call Modal */}
            <AnimatePresence>
                {showCallModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl p-8 w-full max-w-sm mx-4 text-center"
                        >
                            <div className="w-20 h-20 rounded-full bg-orange-500 mx-auto mb-4 flex items-center justify-center">
                                {callType === 'video' ? (
                                    <FiVideo className="w-10 h-10 text-white" />
                                ) : (
                                    <FiPhone className="w-10 h-10 text-white" />
                                )}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {callType === 'video' ? 'Video Call' : 'Voice Call'}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Starting {callType} call with {selectedRoom?.name}...
                            </p>
                            <div className="flex gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowCallModal(false)}
                                    className="flex-1 py-3 bg-red-500 text-white rounded-2xl font-medium"
                                >
                                    End Call
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex-1 py-3 bg-green-500 text-white rounded-2xl font-medium"
                                >
                                    Join Call
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Room Info Modal */}
            <AnimatePresence>
                {showRoomInfo && selectedRoom && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        onClick={() => setShowRoomInfo(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl p-6 w-full max-w-md mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-gray-900">Room Info</h3>
                                <button
                                    onClick={() => setShowRoomInfo(false)}
                                    className="p-1 hover:bg-gray-100 rounded-lg"
                                >
                                    <FiX className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <div className="text-center mb-6">
                                <Image
                                    src={selectedRoom.avatar}
                                    alt={selectedRoom.name}
                                    width={80}
                                    height={80}
                                    className="w-20 h-20 rounded-lg mx-auto mb-3 object-cover"
                                />
                                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                                    {selectedRoom.name}
                                    {selectedRoom.verified && (
                                        <FiStar className="w-4 h-4 text-blue-500 inline ml-1" />
                                    )}
                                </h4>
                                <p className="text-sm text-gray-600">{selectedRoom.description}</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <FiUsers className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="font-medium text-gray-900">{selectedRoom.memberCount} Members</p>
                                        <p className="text-sm text-gray-600">{selectedRoom.online} online now</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <FiMapPin className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="font-medium text-gray-900">Location</p>
                                        <p className="text-sm text-gray-600">{selectedRoom.location}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <FiCalendar className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="font-medium text-gray-900">Event Date</p>
                                        <p className="text-sm text-gray-600">{selectedRoom.eventDate}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <FiClock className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="font-medium text-gray-900">Status</p>
                                        <div className={`inline-flex px-2 py-1 rounded text-xs font-medium ${selectedRoom.eventPhase === 'during' ? 'bg-red-100 text-red-700' :
                                            selectedRoom.eventPhase === 'before' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                            {selectedRoom.eventPhase}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                    console.log('File selected:', e.target.files?.[0]);
                }}
            />

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
        </>
    );
}