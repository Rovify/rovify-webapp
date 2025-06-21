/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    FiPlus, FiEdit3, FiTrash2, FiCopy, FiEye, FiSettings,
    FiCalendar, FiClock, FiUsers, FiDollarSign, FiPercent,
    FiTarget, FiBarChart, FiTrendingUp, FiTrendingDown,
    FiFilter, FiSearch, FiDownload, FiRefreshCw, FiMoreHorizontal,
    FiCheckCircle, FiXCircle, FiAlertCircle, FiStar, FiZap
} from 'react-icons/fi';
import { IoSparkles, IoTicket, IoTrendingUp, IoFlash } from "react-icons/io5";
import { HiOutlineSparkles, HiOutlineTicket, HiOutlineFire } from "react-icons/hi2";
import { BsTicketPerforated, BsLightningCharge } from "react-icons/bs";

// Mock ticket types data
const mockTicketTypes = [
    {
        id: 'ticket1',
        name: 'VIP Experience',
        eventTitle: 'AI & Machine Learning Summit 2025',
        eventId: 'event1',
        eventImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
        price: 299,
        originalPrice: 349,
        quantity: 100,
        sold: 87,
        available: 13,
        status: 'active',
        saleStart: '2025-05-01',
        saleEnd: '2025-07-14',
        description: 'Premium access with VIP lounge, priority seating, and exclusive networking session',
        features: ['VIP Lounge Access', 'Priority Seating', 'Welcome Drink', 'Networking Session', 'Certificate'],
        salesVelocity: 8.7,
        revenue: 25963,
        conversionRate: 12.4,
        category: 'premium'
    },
    {
        id: 'ticket2',
        name: 'General Admission',
        eventTitle: 'AI & Machine Learning Summit 2025',
        eventId: 'event1',
        eventImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
        price: 199,
        originalPrice: 199,
        quantity: 700,
        sold: 543,
        available: 157,
        status: 'active',
        saleStart: '2025-05-01',
        saleEnd: '2025-07-14',
        description: 'Standard access to all main sessions and exhibition area',
        features: ['Main Sessions', 'Exhibition Access', 'Lunch Included', 'Digital Resources'],
        salesVelocity: 15.2,
        revenue: 108057,
        conversionRate: 9.8,
        category: 'standard'
    },
    {
        id: 'ticket3',
        name: 'Student Discount',
        eventTitle: 'AI & Machine Learning Summit 2025',
        eventId: 'event1',
        eventImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
        price: 99,
        originalPrice: 199,
        quantity: 100,
        sold: 78,
        available: 22,
        status: 'active',
        saleStart: '2025-05-01',
        saleEnd: '2025-07-14',
        description: 'Special pricing for students with valid ID',
        features: ['Main Sessions', 'Student Networking', 'Digital Resources', 'Career Fair Access'],
        salesVelocity: 12.1,
        revenue: 7722,
        conversionRate: 18.6,
        category: 'discount'
    },
    {
        id: 'ticket4',
        name: 'Festival Pass - 3 Days',
        eventTitle: 'Electronic Music Festival',
        eventId: 'event2',
        eventImage: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=300&fit=crop',
        price: 189,
        originalPrice: 229,
        quantity: 1500,
        sold: 1247,
        available: 253,
        status: 'active',
        saleStart: '2025-06-01',
        saleEnd: '2025-07-27',
        description: 'Full access to all three days of electronic music performances',
        features: ['3-Day Access', 'All Stages', 'VIP Areas', 'Food & Drink Discounts', 'Merchandise Discount'],
        salesVelocity: 23.8,
        revenue: 235683,
        conversionRate: 14.2,
        category: 'standard'
    },
    {
        id: 'ticket5',
        name: 'Single Day Pass',
        eventTitle: 'Electronic Music Festival',
        eventId: 'event2',
        eventImage: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=300&fit=crop',
        price: 79,
        originalPrice: 99,
        quantity: 500,
        sold: 234,
        available: 266,
        status: 'paused',
        saleStart: '2025-06-01',
        saleEnd: '2025-07-27',
        description: 'Access to one day of your choice',
        features: ['Single Day Access', 'Main Stages', 'Food Court Access'],
        salesVelocity: 8.4,
        revenue: 18486,
        conversionRate: 7.2,
        category: 'standard'
    },
    {
        id: 'ticket6',
        name: 'Early Bird Special',
        eventTitle: 'Startup Pitch Competition',
        eventId: 'event3',
        eventImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
        price: 69,
        originalPrice: 89,
        quantity: 50,
        sold: 50,
        available: 0,
        status: 'sold_out',
        saleStart: '2025-05-01',
        saleEnd: '2025-06-30',
        description: 'Limited early bird pricing for the first 50 attendees',
        features: ['Premium Seating', 'Networking Session', 'Pitch Deck Templates', 'Investor Meetup'],
        salesVelocity: 25.0,
        revenue: 3450,
        conversionRate: 22.1,
        category: 'early_bird'
    }
];

const ticketStatusConfig = {
    active: {
        label: 'Active',
        color: 'bg-emerald-100 text-emerald-700',
        icon: <FiCheckCircle className="w-3 h-3" />,
        dot: 'bg-emerald-500'
    },
    paused: {
        label: 'Paused',
        color: 'bg-yellow-100 text-yellow-700',
        icon: <FiAlertCircle className="w-3 h-3" />,
        dot: 'bg-yellow-500'
    },
    sold_out: {
        label: 'Sold Out',
        color: 'bg-red-100 text-red-700',
        icon: <FiXCircle className="w-3 h-3" />,
        dot: 'bg-red-500'
    },
    draft: {
        label: 'Draft',
        color: 'bg-gray-100 text-gray-700',
        icon: <FiEdit3 className="w-3 h-3" />,
        dot: 'bg-gray-500'
    }
};

const ticketCategoryConfig = {
    premium: { label: 'Premium', color: 'from-purple-500 to-purple-600', icon: '👑' },
    standard: { label: 'Standard', color: 'from-blue-500 to-blue-600', icon: '🎫' },
    discount: { label: 'Discount', color: 'from-emerald-500 to-emerald-600', icon: '🎓' },
    early_bird: { label: 'Early Bird', color: 'from-orange-500 to-orange-600', icon: '🐦' }
};

// Ticket Card Component
const TicketCard = ({ ticket, index, viewMode }: {
    ticket: typeof mockTicketTypes[0],
    index: number,
    viewMode: 'grid' | 'list'
}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const statusStyle = ticketStatusConfig[ticket.status as keyof typeof ticketStatusConfig];
    const categoryConfig = ticketCategoryConfig[ticket.category as keyof typeof ticketCategoryConfig];
    const soldPercentage = (ticket.sold / ticket.quantity) * 100;
    const isNearSoldOut = soldPercentage >= 90;
    const isLowStock = soldPercentage >= 75 && soldPercentage < 90;

    if (viewMode === 'list') {
        return (
            <motion.div
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
            >
                <div className="flex gap-6">
                    <div className="relative flex-shrink-0">
                        <div style={{ width: 100, height: 80, position: 'relative' }}>
                            <Image
                                src={ticket.eventImage}
                                alt={ticket.eventTitle}
                                className="w-full h-full object-cover rounded-xl"
                                fill
                                sizes="100px"
                            />
                        </div>
                        <div className={`absolute -top-2 -right-2 w-4 h-4 ${statusStyle.dot} rounded-full border-2 border-white`}></div>
                        {isNearSoldOut && (
                            <div className="absolute -bottom-2 -left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                                <HiOutlineFire className="w-3 h-3" />
                                Hot
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-orange-600 transition-colors">
                                        {ticket.name}
                                    </h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${categoryConfig.color}`}>
                                        {categoryConfig.icon} {categoryConfig.label}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{ticket.eventTitle}</p>
                                <p className="text-sm text-gray-500 line-clamp-2">{ticket.description}</p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                                <div className={`${statusStyle.color} px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
                                    {statusStyle.icon}
                                    {statusStyle.label}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                            <div className="bg-gray-50 rounded-xl p-3">
                                <div className="flex items-center gap-1">
                                    <div className="text-lg font-bold text-gray-900">
                                        ${ticket.price}
                                    </div>
                                    {ticket.originalPrice > ticket.price && (
                                        <div className="text-sm text-gray-500 line-through">
                                            ${ticket.originalPrice}
                                        </div>
                                    )}
                                </div>
                                <div className="text-xs text-gray-600">Price</div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3">
                                <div className="text-lg font-bold text-gray-900">{ticket.sold}/{ticket.quantity}</div>
                                <div className="text-xs text-gray-600">Sold</div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3">
                                <div className="text-lg font-bold text-emerald-600">${ticket.revenue.toLocaleString()}</div>
                                <div className="text-xs text-gray-600">Revenue</div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3">
                                <div className="text-lg font-bold text-blue-600">{ticket.conversionRate}%</div>
                                <div className="text-xs text-gray-600">Conversion</div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3">
                                <div className="text-lg font-bold text-purple-600">{ticket.salesVelocity}</div>
                                <div className="text-xs text-gray-600">Velocity</div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full rounded-full ${isNearSoldOut ? 'bg-gradient-to-r from-red-500 to-pink-500' :
                                                isLowStock ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                                                    'bg-gradient-to-r from-emerald-500 to-green-500'
                                                }`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${soldPercentage}%` }}
                                            transition={{ delay: index * 0.2, duration: 1 }}
                                        />
                                    </div>
                                    <span className="text-xs text-gray-500">{Math.round(soldPercentage)}%</span>
                                </div>

                                <div className="flex items-center gap-1 text-sm text-gray-600">
                                    <FiCalendar className="w-4 h-4" />
                                    <span>Until {new Date(ticket.saleEnd).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="relative">
                                <motion.button
                                    className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FiMoreHorizontal className="w-5 h-5 text-gray-500" />
                                </motion.button>

                                <AnimatePresence>
                                    {dropdownOpen && (
                                        <motion.div
                                            className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-10"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                        >
                                            {[
                                                { icon: <FiEye className="w-4 h-4" />, label: 'View Details' },
                                                { icon: <FiEdit3 className="w-4 h-4" />, label: 'Edit Ticket' },
                                                { icon: <FiCopy className="w-4 h-4" />, label: 'Duplicate' },
                                                { icon: <FiBarChart className="w-4 h-4" />, label: 'Analytics' },
                                                { icon: <FiSettings className="w-4 h-4" />, label: 'Settings' },
                                                { icon: <FiTrash2 className="w-4 h-4" />, label: 'Delete', danger: true }
                                            ].map((item) => (
                                                <button
                                                    key={item.label}
                                                    className={`w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left ${item.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'}`}
                                                >
                                                    {item.icon}
                                                    {item.label}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Grid view
    return (
        <motion.div
            className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
        >
            <div className="relative mb-4">
                <div style={{ width: '100%', height: 150, position: 'relative' }}>
                    <Image
                        src={ticket.eventImage}
                        alt={ticket.eventTitle}
                        className="w-full h-full object-cover rounded-xl"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
                <div className={`absolute top-3 left-3 ${statusStyle.color} px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
                    {statusStyle.icon}
                    {statusStyle.label}
                </div>
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${categoryConfig.color}`}>
                    {categoryConfig.icon}
                </div>
                {isNearSoldOut && (
                    <div className="absolute bottom-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                        <HiOutlineFire className="w-3 h-3" />
                        Hot
                    </div>
                )}
            </div>

            <div className="mb-4">
                <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-orange-600 transition-colors line-clamp-1">
                    {ticket.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-1">{ticket.eventTitle}</p>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{ticket.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-center gap-1">
                        <div className="text-lg font-bold text-gray-900">
                            ${ticket.price}
                        </div>
                        {ticket.originalPrice > ticket.price && (
                            <div className="text-sm text-gray-500 line-through">
                                ${ticket.originalPrice}
                            </div>
                        )}
                    </div>
                    <div className="text-xs text-gray-600">Price</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-lg font-bold text-emerald-600">{ticket.sold}/{ticket.quantity}</div>
                    <div className="text-xs text-gray-600">Sold</div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-orange-600">${ticket.revenue.toLocaleString()}</div>
                <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                            className={`h-full rounded-full ${isNearSoldOut ? 'bg-gradient-to-r from-red-500 to-pink-500' :
                                isLowStock ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                                    'bg-gradient-to-r from-emerald-500 to-green-500'
                                }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${soldPercentage}%` }}
                            transition={{ delay: index * 0.2, duration: 1 }}
                        />
                    </div>
                    <span className="text-xs text-gray-500">{Math.round(soldPercentage)}%</span>
                </div>
            </div>
        </motion.div>
    );
};

export default function TicketsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedEvent, setSelectedEvent] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

    const filteredTickets = mockTicketTypes.filter(ticket => {
        const matchesSearch = ticket.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.eventTitle.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus;
        const matchesEvent = selectedEvent === 'all' || ticket.eventId === selectedEvent;
        return matchesSearch && matchesStatus && matchesEvent;
    });

    const totalTickets = mockTicketTypes.reduce((sum, ticket) => sum + ticket.quantity, 0);
    const totalSold = mockTicketTypes.reduce((sum, ticket) => sum + ticket.sold, 0);
    const totalRevenue = mockTicketTypes.reduce((sum, ticket) => sum + ticket.revenue, 0);
    const activeTickets = mockTicketTypes.filter(ticket => ticket.status === 'active').length;

    const events = [...new Set(mockTicketTypes.map(ticket => ({ id: ticket.eventId, title: ticket.eventTitle })))];

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <motion.div
                className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

                <div className="relative flex flex-col lg:flex-row lg:items-center justify-between">
                    <div className="mb-6 lg:mb-0">
                        <h1 className="text-4xl lg:text-5xl font-bold mb-3 flex items-center gap-3">
                            <HiOutlineTicket className="w-12 h-12" />
                            Tickets
                        </h1>
                        <p className="text-orange-100 text-lg mb-4">
                            Manage ticket types • {totalTickets} total tickets • {totalSold} sold
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                                <IoSparkles className="w-5 h-5" />
                                <span className="font-semibold">${totalRevenue.toLocaleString()} revenue</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                                <FiTarget className="w-5 h-5" />
                                <span className="font-semibold">{activeTickets} active types</span>
                            </div>
                        </div>
                    </div>

                    <motion.button
                        className="bg-white text-orange-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-50 transition-all shadow-lg flex items-center gap-3"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FiPlus className="w-6 h-6" />
                        Create Ticket Type
                    </motion.button>
                </div>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    {
                        label: 'Total Revenue',
                        value: `$${totalRevenue.toLocaleString()}`,
                        icon: <FiDollarSign className="w-6 h-6" />,
                        color: 'from-emerald-500 to-emerald-600',
                        change: '+23.5%',
                        gradient: true
                    },
                    {
                        label: 'Tickets Sold',
                        value: totalSold.toLocaleString(),
                        icon: <BsTicketPerforated className="w-6 h-6" />,
                        color: 'from-blue-500 to-blue-600',
                        change: '+18.2%'
                    },
                    {
                        label: 'Available',
                        value: (totalTickets - totalSold).toLocaleString(),
                        icon: <IoTicket className="w-6 h-6" />,
                        color: 'from-purple-500 to-purple-600',
                        change: '-5.3%'
                    },
                    {
                        label: 'Active Types',
                        value: activeTickets,
                        icon: <FiZap className="w-6 h-6" />,
                        color: 'from-orange-500 to-orange-600',
                        change: '+2'
                    }
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        className={`${stat.gradient ? `bg-gradient-to-br ${stat.color} text-white` : 'bg-white'} rounded-2xl p-6 border ${stat.gradient ? 'border-emerald-300' : 'border-gray-100'} hover:shadow-xl transition-all duration-300`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -4, scale: 1.02 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.gradient ? 'bg-white/20 text-white' : 'bg-orange-50 text-orange-600'}`}>
                                {stat.icon}
                            </div>
                            <div className={`text-sm font-bold ${stat.gradient ? 'text-white/90' : stat.change.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>
                                {stat.change}
                            </div>
                        </div>
                        <div>
                            <p className={`text-3xl font-bold mb-1 ${stat.gradient ? 'text-white' : 'text-gray-900'}`}>
                                {stat.value}
                            </p>
                            <p className={`text-sm font-medium ${stat.gradient ? 'text-white/80' : 'text-gray-600'}`}>
                                {stat.label}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Controls Section */}
            <motion.div
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
            >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search tickets..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <select
                            value={selectedEvent}
                            onChange={(e) => setSelectedEvent(e.target.value)}
                            className="px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="all">All Events</option>
                            {events.map((event) => (
                                <option key={event.id} value={event.id}>
                                    {event.title}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="paused">Paused</option>
                            <option value="sold_out">Sold Out</option>
                            <option value="draft">Draft</option>
                        </select>

                        <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                            <motion.button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="bg-gray-600 rounded-sm"></div>
                                    ))}
                                </div>
                            </motion.button>
                            <motion.button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className="w-4 h-4 flex flex-col gap-0.5">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="bg-gray-600 h-0.5 rounded-sm"></div>
                                    ))}
                                </div>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Tickets Grid/List */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                {filteredTickets.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-gray-400 text-6xl mb-4">🎫</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No tickets found</h3>
                        <p className="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
                        <motion.button
                            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Create Your First Ticket Type
                        </motion.button>
                    </div>
                ) : (
                    <div className={`${viewMode === 'grid'
                        ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                        : 'space-y-6'
                        }`}>
                        {filteredTickets.map((ticket, index) => (
                            <TicketCard
                                key={ticket.id}
                                ticket={ticket}
                                index={index}
                                viewMode={viewMode}
                            />
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}