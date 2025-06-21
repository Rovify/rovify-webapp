/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiUser, FiCreditCard, FiSettings, FiSliders, FiUsers, FiArchive,
    FiBarChart, FiAward, FiBookmark, FiShield, FiEdit2, FiLogOut,
    FiCheck, FiX, FiCalendar, FiMessageSquare, FiClock, FiAlertCircle,
    FiRefreshCcw, FiExternalLink, FiCopy, FiArrowRight, FiBell,
    FiHeart, FiLink, FiUpload, FiCamera, FiZap, FiTrendingUp,
    FiStar, FiEye, FiUserPlus, FiUserCheck, FiUserX, FiDownload,
    FiGrid, FiList, FiFilter, FiSearch, FiMoreHorizontal, FiHome,
    FiChevronRight, FiChevronLeft, FiMenu
} from 'react-icons/fi';
import { FaBell, FaEthereum, FaCamera } from "react-icons/fa";
import { IoTicket, IoSparkles } from "react-icons/io5";

// Clean Design System - Rovify inspired
const theme = {
    colors: {
        primary: '#FF5722',
        primaryDark: '#E64A19',
        primaryLight: '#FF8A65',
        background: '#FAFAFA',
        surface: '#FFFFFF',
        text: {
            primary: '#1A1A1A',
            secondary: '#666666',
            muted: '#999999'
        },
        border: '#E5E5E5',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        ethereum: '#627EEA'
    },
    shadows: {
        sm: '0 1px 3px rgba(0, 0, 0, 0.08)',
        md: '0 4px 12px rgba(0, 0, 0, 0.08)',
        lg: '0 10px 25px rgba(0, 0, 0, 0.1)'
    },
    radius: {
        sm: '6px',
        md: '12px',
        lg: '16px',
        xl: '20px'
    }
};

// Mock Data
const mockUser = {
    id: 'user1',
    name: 'Alex Johnson',
    username: 'alexj',
    email: 'alex@rovify.com',
    bio: 'Event enthusiast and community builder. Always seeking memorable experiences to share with friends.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=300&fit=crop',
    verified: true,
    level: 'Gold',
    points: 2840,
    followers: 1234,
    following: 456,
    eventsAttended: 28,
    totalSpent: 4250,
    interests: ['Music', 'Tech', 'Art', 'Food', 'Travel'],
    joinedDate: '2023-01-15'
};

const mockFriends = [
    { id: '1', name: 'Sarah Chen', username: 'sarahc', image: 'https://images.unsplash.com/photo-1494790108755-2616b88e1f9d?w=50&h=50&fit=crop&crop=face', status: 'online', mutualEvents: 5 },
    { id: '2', name: 'Marcus Reid', username: 'marcus', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face', status: 'offline', mutualEvents: 3 },
    { id: '3', name: 'Emma Wilson', username: 'emmaw', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face', status: 'online', mutualEvents: 8 }
];

const mockFriendRequests = [
    { id: '1', name: 'David Park', username: 'davidp', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face', mutualFriends: 3 },
    { id: '2', name: 'Lisa Thompson', username: 'lisat', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=50&h=50&fit=crop&crop=face', mutualFriends: 1 }
];

const mockEventHistory = [
    {
        id: '1',
        title: 'Tech Summit 2024',
        date: '2024-11-15',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
        status: 'attended',
        rating: 5,
        spent: 299
    },
    {
        id: '2',
        title: 'Jazz Night Downtown',
        date: '2024-10-28',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
        status: 'attended',
        rating: 4,
        spent: 85
    }
];

const mockAchievements = [
    { id: '1', title: 'Early Bird', description: 'Booked 10 events in advance', icon: '🐦', unlocked: true },
    { id: '2', title: 'Social Butterfly', description: 'Attended events with 50+ friends', icon: '🦋', unlocked: true },
    { id: '3', title: 'Culture Vulture', description: 'Attended 5 different event categories', icon: '🎭', unlocked: false }
];

interface SidebarItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    section: 'main' | 'secondary';
}

type ActiveSection = 'dashboard' | 'profile' | 'wallet' | 'friends' | 'history' | 'analytics' | 'collections' | 'preferences' | 'settings';

export default function UserDashboard() {
    const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [currentUser, setCurrentUser] = useState(mockUser);
    const [friends, setFriends] = useState(mockFriends);
    const [friendRequests, setFriendRequests] = useState(mockFriendRequests);
    const [eventHistory, setEventHistory] = useState(mockEventHistory);

    // Wallet states
    const [isWalletConnected, setIsWalletConnected] = useState(true);
    const [walletAddress] = useState('0x742d35Cc6565C42cAA5b8e8a8b02b9eF3D5d2D8B');
    const [walletBalance] = useState('2.4567');

    const sidebarItems: SidebarItem[] = [
        { id: 'dashboard', label: 'Dashboard', icon: <FiHome className="w-5 h-5" />, section: 'main' },
        { id: 'profile', label: 'Profile', icon: <FiUser className="w-5 h-5" />, section: 'main' },
        { id: 'wallet', label: 'Wallet', icon: <FiCreditCard className="w-5 h-5" />, section: 'main' },
        { id: 'friends', label: 'Friends', icon: <FiUsers className="w-5 h-5" />, badge: friendRequests.length, section: 'main' },
        { id: 'history', label: 'History', icon: <FiArchive className="w-5 h-5" />, section: 'main' },
        { id: 'analytics', label: 'Analytics', icon: <FiBarChart className="w-5 h-5" />, section: 'secondary' },
        { id: 'collections', label: 'Collections', icon: <FiBookmark className="w-5 h-5" />, section: 'secondary' },
        { id: 'preferences', label: 'Preferences', icon: <FiSliders className="w-5 h-5" />, section: 'secondary' },
        { id: 'settings', label: 'Settings', icon: <FiSettings className="w-5 h-5" />, section: 'secondary' }
    ];

    const StatCard = ({ title, value, subtitle, icon, trend }: {
        title: string;
        value: string | number;
        subtitle?: string;
        icon: React.ReactNode;
        trend?: 'up' | 'down' | 'neutral';
    }) => (
        <motion.div
            className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all duration-200"
            whileHover={{ y: -2 }}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center">
                    {icon}
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                        {trend === 'up' && <FiTrendingUp className="w-4 h-4" />}
                        {trend === 'down' && <FiTrendingUp className="w-4 h-4 rotate-180" />}
                    </div>
                )}
            </div>
            <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
                <p className="text-sm text-gray-600">{title}</p>
                {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
            </div>
        </motion.div>
    );

    const renderDashboard = () => (
        <div className="space-y-8">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-8 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Welcome back, {currentUser.name.split(' ')[0]}!</h1>
                        <p className="text-orange-100">You have 3 upcoming events this week</p>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                            <IoSparkles className="w-5 h-5" />
                            <span className="font-semibold">{currentUser.level} Member</span>
                        </div>
                        <p className="text-orange-100">{currentUser.points} points</p>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Events Attended"
                    value={currentUser.eventsAttended}
                    subtitle="This year"
                    icon={<FiCalendar className="w-6 h-6 text-orange-500" />}
                    trend="up"
                />
                <StatCard
                    title="Friends"
                    value={currentUser.followers}
                    subtitle={`${friends.filter(f => f.status === 'online').length} online`}
                    icon={<FiUsers className="w-6 h-6 text-blue-500" />}
                    trend="up"
                />
                <StatCard
                    title="Total Spent"
                    value={`$${currentUser.totalSpent}`}
                    subtitle="All time"
                    icon={<FiCreditCard className="w-6 h-6 text-green-500" />}
                    trend="neutral"
                />
                <StatCard
                    title="Wallet Balance"
                    value={`${walletBalance} ETH`}
                    subtitle="≈ $4,250"
                    icon={<FaEthereum className="w-6 h-6 text-indigo-500" />}
                    trend="up"
                />
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Events */}
                <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Events</h2>
                        <button className="text-orange-500 hover:text-orange-600 text-sm font-medium">View all</button>
                    </div>
                    <div className="space-y-4">
                        {eventHistory.slice(0, 3).map((event) => (
                            <div key={event.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <Image src={event.image} alt={event.title} width={48} height={48} className="rounded-lg object-cover" />
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                                    <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 mb-1">
                                        {[...Array(5)].map((_, i) => (
                                            <FiStar key={i} className={`w-3 h-3 ${i < event.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                        ))}
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">${event.spent}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
                    <div className="space-y-3">
                        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg p-3 font-medium transition-colors">
                            Find Events
                        </button>
                        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg p-3 font-medium transition-colors">
                            Invite Friends
                        </button>
                        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg p-3 font-medium transition-colors">
                            View Tickets
                        </button>
                    </div>

                    {/* Friend Requests */}
                    {friendRequests.length > 0 && (
                        <div className="mt-8">
                            <h3 className="font-medium text-gray-900 mb-4">Friend Requests</h3>
                            <div className="space-y-3">
                                {friendRequests.slice(0, 2).map((request) => (
                                    <div key={request.id} className="flex items-center gap-3">
                                        <Image src={request.image} alt={request.name} width={32} height={32} className="rounded-full object-cover" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">{request.name}</p>
                                            <p className="text-xs text-gray-600">{request.mutualFriends} mutual friends</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="w-8 h-8 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center justify-center transition-colors">
                                                <FiCheck className="w-4 h-4" />
                                            </button>
                                            <button className="w-8 h-8 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-lg flex items-center justify-center transition-colors">
                                                <FiX className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const renderProfile = () => (
        <div className="space-y-8">
            {/* Profile Header */}
            <div className="bg-white rounded-xl overflow-hidden border border-gray-100">
                <div className="relative h-48 bg-gradient-to-r from-orange-500 to-orange-600">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <button className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 rounded-lg p-2 transition-colors">
                        <FiCamera className="w-4 h-4" />
                    </button>
                </div>
                <div className="relative px-8 pb-8">
                    <div className="relative w-24 h-24 -mt-12 mb-6">
                        <Image src={currentUser.image} alt={currentUser.name} fill className="rounded-xl object-cover border-4 border-white" />
                        <button className="absolute -bottom-2 -right-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg p-2 transition-colors">
                            <FiCamera className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-2xl font-bold text-gray-900">{currentUser.name}</h1>
                                {currentUser.verified && (
                                    <div className="bg-orange-500 text-white rounded-full p-1">
                                        <FiCheck className="w-3 h-3" />
                                    </div>
                                )}
                            </div>
                            <p className="text-gray-600 mb-1">@{currentUser.username}</p>
                            <p className="text-gray-700 mb-4">{currentUser.bio}</p>
                            <div className="flex flex-wrap gap-2">
                                {currentUser.interests.map((interest) => (
                                    <span key={interest} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                        {interest}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-6 py-2 font-medium transition-colors">
                            <FiEdit2 className="w-4 h-4 mr-2 inline" />
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            {/* Profile Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Followers"
                    value={currentUser.followers}
                    icon={<FiUsers className="w-6 h-6 text-blue-500" />}
                />
                <StatCard
                    title="Following"
                    value={currentUser.following}
                    icon={<FiUserPlus className="w-6 h-6 text-green-500" />}
                />
                <StatCard
                    title="Events Attended"
                    value={currentUser.eventsAttended}
                    icon={<FiCalendar className="w-6 h-6 text-orange-500" />}
                />
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Achievements</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mockAchievements.map((achievement) => (
                        <div key={achievement.id} className={`p-4 rounded-lg border-2 transition-all ${achievement.unlocked
                            ? 'border-orange-200 bg-orange-50'
                            : 'border-gray-200 bg-gray-50 opacity-60'
                            }`}>
                            <div className="text-3xl mb-2">{achievement.icon}</div>
                            <h3 className="font-medium text-gray-900 mb-1">{achievement.title}</h3>
                            <p className="text-sm text-gray-600">{achievement.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderFriends = () => (
        <div className="space-y-8">
            {/* Friend Requests */}
            {friendRequests.length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Friend Requests</h2>
                        <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                            {friendRequests.length} pending
                        </span>
                    </div>
                    <div className="space-y-4">
                        {friendRequests.map((request) => (
                            <div key={request.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <Image src={request.image} alt={request.name} width={48} height={48} className="rounded-full object-cover" />
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900">{request.name}</h3>
                                    <p className="text-sm text-gray-600">@{request.username} • {request.mutualFriends} mutual friends</p>
                                </div>
                                <div className="flex gap-3">
                                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                        Accept
                                    </button>
                                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                                        Decline
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Friends List */}
            <div className="bg-white rounded-xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Friends</h2>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search friends..."
                                className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                            />
                        </div>
                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                            <FiUserPlus className="w-4 h-4 mr-2 inline" />
                            Add Friend
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {friends.map((friend) => (
                        <div key={friend.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="relative">
                                    <Image src={friend.image} alt={friend.name} width={40} height={40} className="rounded-full object-cover" />
                                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${friend.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                                        }`}></div>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">{friend.name}</h3>
                                    <p className="text-sm text-gray-600">@{friend.username}</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{friend.mutualEvents} events together</p>
                            <div className="flex gap-2">
                                <button className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors">
                                    Message
                                </button>
                                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                                    <FiCalendar className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderWallet = () => (
        <div className="space-y-8">
            {/* Wallet Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Wallet Balance</h2>
                            <p className="text-indigo-100">Your crypto & fiat funds</p>
                        </div>
                        <FaEthereum className="w-12 h-12 text-indigo-200" />
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="text-3xl font-bold">{walletBalance} ETH</p>
                            <p className="text-indigo-100">≈ $4,250.30 USD</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-indigo-100">Connected to Ethereum Mainnet</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg p-3 font-medium transition-colors">
                            Add Funds
                        </button>
                        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg p-3 font-medium transition-colors">
                            Send Crypto
                        </button>
                        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg p-3 font-medium transition-colors">
                            View History
                        </button>
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                    <button className="text-orange-500 hover:text-orange-600 text-sm font-medium">View all</button>
                </div>
                <div className="space-y-4">
                    {[
                        { type: 'ticket', event: 'Tech Summit 2024', amount: '0.15 ETH', date: '2024-11-15', status: 'completed' },
                        { type: 'deposit', event: 'Added funds', amount: '+1.0 ETH', date: '2024-11-10', status: 'completed' },
                        { type: 'ticket', event: 'Jazz Night', amount: '0.04 ETH', date: '2024-10-28', status: 'completed' }
                    ].map((tx, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tx.type === 'ticket' ? 'bg-orange-100' : 'bg-green-100'
                                }`}>
                                {tx.type === 'ticket' ?
                                    <IoTicket className="w-5 h-5 text-orange-500" /> :
                                    <FiCreditCard className="w-5 h-5 text-green-500" />
                                }
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium text-gray-900">{tx.event}</h3>
                                <p className="text-sm text-gray-600">{new Date(tx.date).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <p className={`font-medium ${tx.amount.startsWith('+') ? 'text-green-600' : 'text-gray-900'}`}>
                                    {tx.amount}
                                </p>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {tx.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return renderDashboard();
            case 'profile':
                return renderProfile();
            case 'friends':
                return renderFriends();
            case 'wallet':
                return renderWallet();
            case 'history':
                return (
                    <div className="bg-white rounded-xl p-8 border border-gray-100 text-center">
                        <FiArchive className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Event History</h2>
                        <p className="text-gray-600">Your complete event attendance history will appear here.</p>
                    </div>
                );
            case 'analytics':
                return (
                    <div className="bg-white rounded-xl p-8 border border-gray-100 text-center">
                        <FiBarChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Analytics</h2>
                        <p className="text-gray-600">Insights about your event preferences and spending patterns.</p>
                    </div>
                );
            case 'collections':
                return (
                    <div className="bg-white rounded-xl p-8 border border-gray-100 text-center">
                        <FiBookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Collections</h2>
                        <p className="text-gray-600">Saved events, wishlists, and custom collections.</p>
                    </div>
                );
            case 'preferences':
                return (
                    <div className="bg-white rounded-xl p-8 border border-gray-100 text-center">
                        <FiSliders className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Preferences</h2>
                        <p className="text-gray-600">Customize your notifications, interests, and privacy settings.</p>
                    </div>
                );
            case 'settings':
                return (
                    <div className="bg-white rounded-xl p-8 border border-gray-100 text-center">
                        <FiSettings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Settings</h2>
                        <p className="text-gray-600">Account settings, security, and data management options.</p>
                    </div>
                );
            default:
                return renderDashboard();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <motion.div
                className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'
                    }`}
                initial={false}
                animate={{ width: sidebarCollapsed ? 64 : 256 }}
            >
                {/* Logo & Collapse Button */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        {!sidebarCollapsed && (
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">R</span>
                                </div>
                                <span className="font-bold text-gray-900">Rovify</span>
                            </div>
                        )}
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {sidebarCollapsed ? <FiChevronRight className="w-4 h-4" /> : <FiChevronLeft className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                    <div className="space-y-8">
                        {/* Main Section */}
                        <div>
                            {!sidebarCollapsed && (
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Main</p>
                            )}
                            <div className="space-y-1">
                                {sidebarItems.filter(item => item.section === 'main').map((item) => (
                                    <motion.button
                                        key={item.id}
                                        onClick={() => setActiveSection(item.id as ActiveSection)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all relative ${activeSection === item.id
                                            ? 'bg-orange-50 text-orange-600 font-medium'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        whileHover={{ x: 2 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {item.icon}
                                        {!sidebarCollapsed && (
                                            <>
                                                <span className="flex-1">{item.label}</span>
                                                {item.badge && (
                                                    <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Secondary Section */}
                        <div>
                            {!sidebarCollapsed && (
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">More</p>
                            )}
                            <div className="space-y-1">
                                {sidebarItems.filter(item => item.section === 'secondary').map((item) => (
                                    <motion.button
                                        key={item.id}
                                        onClick={() => setActiveSection(item.id as ActiveSection)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${activeSection === item.id
                                            ? 'bg-orange-50 text-orange-600 font-medium'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        whileHover={{ x: 2 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {item.icon}
                                        {!sidebarCollapsed && <span className="flex-1">{item.label}</span>}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* User Profile Footer */}
                <div className="p-4 border-t border-gray-200">
                    <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
                        <Image
                            src={currentUser.image}
                            alt={currentUser.name}
                            width={32}
                            height={32}
                            className="rounded-lg object-cover"
                        />
                        {!sidebarCollapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{currentUser.name}</p>
                                <p className="text-xs text-gray-600 truncate">{currentUser.level} Member</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 capitalize">{activeSection}</h1>
                            <p className="text-gray-600">
                                {activeSection === 'dashboard' && 'Your personal event control center'}
                                {activeSection === 'profile' && 'Manage your public profile and achievements'}
                                {activeSection === 'wallet' && 'Manage your crypto wallet and transactions'}
                                {activeSection === 'friends' && 'Connect with other event enthusiasts'}
                                {activeSection === 'history' && 'View your complete event history'}
                                {activeSection === 'analytics' && 'Insights into your event patterns'}
                                {activeSection === 'collections' && 'Your saved events and wishlists'}
                                {activeSection === 'preferences' && 'Customize your Rovify experience'}
                                {activeSection === 'settings' && 'Account and security settings'}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                                <FiBell className="w-5 h-5" />
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></span>
                            </button>
                            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                                Find Events
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-8 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}