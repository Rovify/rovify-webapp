/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    FiCalendar, FiChevronLeft, FiChevronRight, FiPlus, FiClock,
    FiUsers, FiMapPin, FiEdit3, FiTrash2, FiEye, FiFilter,
    FiRefreshCw, FiDownload, FiGrid, FiList, FiMoreHorizontal,
    FiArrowLeft, FiArrowRight, FiTarget, FiTrendingUp, FiStar
} from 'react-icons/fi';
import { IoSparkles, IoTicket, IoTrendingUp, IoFlash } from "react-icons/io5";
import { HiOutlineSparkles, HiOutlineCalendarDays, HiOutlineFire } from "react-icons/hi2";
import { BsTicketPerforated, BsCalendar2Event } from "react-icons/bs";

// Mock calendar events data
const mockCalendarEvents = [
    {
        id: '1',
        title: 'AI & Machine Learning Summit 2025',
        date: '2025-07-15',
        startTime: '09:00',
        endTime: '18:00',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
        location: 'Tech Convention Center',
        attendees: 847,
        capacity: 1000,
        status: 'confirmed',
        category: 'Technology',
        color: 'from-blue-500 to-blue-600',
        revenue: 252653,
        description: 'Annual summit bringing together AI researchers and industry leaders'
    },
    {
        id: '2',
        title: 'Electronic Music Festival',
        date: '2025-07-28',
        startTime: '18:00',
        endTime: '23:59',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=300&fit=crop',
        location: 'Downtown Arena',
        attendees: 1247,
        capacity: 2000,
        status: 'confirmed',
        category: 'Music',
        color: 'from-purple-500 to-purple-600',
        revenue: 160863,
        description: 'Three days of electronic music with top international DJs'
    },
    {
        id: '3',
        title: 'Startup Pitch Competition',
        date: '2025-08-05',
        startTime: '14:00',
        endTime: '20:00',
        image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
        location: 'Innovation Hub',
        attendees: 156,
        capacity: 200,
        status: 'draft',
        category: 'Business',
        color: 'from-emerald-500 to-emerald-600',
        revenue: 13884,
        description: 'Early-stage startups compete for $100K in funding'
    },
    {
        id: '4',
        title: 'Digital Marketing Masterclass',
        date: '2025-08-12',
        startTime: '10:00',
        endTime: '17:00',
        image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop',
        location: 'Online Event',
        attendees: 543,
        capacity: 500,
        status: 'confirmed',
        category: 'Education',
        color: 'from-orange-500 to-orange-600',
        revenue: 106971,
        description: 'Learn advanced digital marketing strategies from experts'
    },
    {
        id: '5',
        title: 'Workshop: React Development',
        date: '2025-07-20',
        startTime: '09:00',
        endTime: '16:00',
        image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop',
        location: 'Tech Hub',
        attendees: 45,
        capacity: 50,
        status: 'confirmed',
        category: 'Technology',
        color: 'from-blue-500 to-blue-600',
        revenue: 8955,
        description: 'Intensive React development workshop for developers'
    },
    {
        id: '6',
        title: 'Networking Event',
        date: '2025-07-25',
        startTime: '19:00',
        endTime: '22:00',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop',
        location: 'Rooftop Lounge',
        attendees: 78,
        capacity: 100,
        status: 'confirmed',
        category: 'Networking',
        color: 'from-pink-500 to-rose-600',
        revenue: 3900,
        description: 'Monthly networking event for tech professionals'
    }
];

const statusConfig = {
    confirmed: { label: 'Confirmed', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
    draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700', dot: 'bg-gray-500' },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' }
};

const categoryColors = {
    'Technology': 'from-blue-500 to-blue-600',
    'Music': 'from-purple-500 to-purple-600',
    'Business': 'from-emerald-500 to-emerald-600',
    'Education': 'from-orange-500 to-orange-600',
    'Networking': 'from-pink-500 to-rose-600'
};

// Calendar component
const Calendar = ({
    currentDate,
    events,
    onDateClick,
    selectedDate
}: {
    currentDate: Date;
    events: typeof mockCalendarEvents;
    onDateClick: (date: string) => void;
    selectedDate: string | null;
}) => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - startOfMonth.getDay());

    const days = [];
    const currentDateObj = new Date(startDate);

    for (let i = 0; i < 42; i++) {
        days.push(new Date(currentDateObj));
        currentDateObj.setDate(currentDateObj.getDate() + 1);
    }

    const getEventsForDate = (date: Date) => {
        const dateString = date.toISOString().split('T')[0];
        return events.filter(event => event.date === dateString);
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isCurrentMonth = (date: Date) => {
        return date.getMonth() === currentDate.getMonth();
    };

    const isSelected = (date: Date) => {
        return selectedDate === date.toISOString().split('T')[0];
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100">
            {/* Calendar Header */}
            <div className="p-4 border-b border-gray-100">
                <div className="grid grid-cols-7 gap-1">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div key={day} className="p-2 text-center text-sm font-semibold text-gray-600">
                            {day}
                        </div>
                    ))}
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-4">
                <div className="grid grid-cols-7 gap-1">
                    {days.map((date, index) => {
                        const dayEvents = getEventsForDate(date);
                        const dateString = date.toISOString().split('T')[0];

                        return (
                            <motion.div
                                key={index}
                                className={`min-h-24 p-2 rounded-lg cursor-pointer transition-all border ${isSelected(date)
                                    ? 'bg-orange-500 text-white border-orange-500'
                                    : isToday(date)
                                        ? 'bg-orange-50 border-orange-200 text-orange-900'
                                        : isCurrentMonth(date)
                                            ? 'hover:bg-gray-50 border-transparent'
                                            : 'text-gray-400 border-transparent'
                                    }`}
                                onClick={() => onDateClick(dateString)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className={`text-sm font-semibold mb-1 ${isSelected(date) ? 'text-white' : ''
                                    }`}>
                                    {date.getDate()}
                                </div>

                                <div className="space-y-1">
                                    {dayEvents.slice(0, 2).map((event) => (
                                        <div
                                            key={event.id}
                                            className={`text-xs px-1 py-0.5 rounded truncate ${isSelected(date)
                                                ? 'bg-white/20 text-white'
                                                : 'bg-orange-100 text-orange-700'
                                                }`}
                                        >
                                            {event.title}
                                        </div>
                                    ))}
                                    {dayEvents.length > 2 && (
                                        <div className={`text-xs px-1 ${isSelected(date) ? 'text-white/80' : 'text-gray-500'
                                            }`}>
                                            +{dayEvents.length - 2} more
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// Event List Component
const EventList = ({
    events,
    selectedDate
}: {
    events: typeof mockCalendarEvents;
    selectedDate: string | null;
}) => {
    const filteredEvents = selectedDate
        ? events.filter(event => event.date === selectedDate)
        : events.filter(event => new Date(event.date) >= new Date());

    const formatTime = (time: string) => {
        const [hour, minute] = time.split(':');
        const hourNum = parseInt(hour);
        const ampm = hourNum >= 12 ? 'PM' : 'AM';
        const displayHour = hourNum % 12 || 12;
        return `${displayHour}:${minute} ${ampm}`;
    };

    if (filteredEvents.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 text-4xl mb-4">📅</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {selectedDate ? 'No events on this date' : 'No upcoming events'}
                </h3>
                <p className="text-gray-600 mb-6">
                    {selectedDate ? 'Select a different date or create a new event' : 'Create your first event to get started'}
                </p>
                <motion.button
                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FiPlus className="w-5 h-5" />
                    Create Event
                </motion.button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {filteredEvents.map((event, index) => (
                <motion.div
                    key={event.id}
                    className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -2, scale: 1.01 }}
                >
                    <div className="flex gap-4">
                        <div className="relative flex-shrink-0">
                            <div style={{ width: 80, height: 80, position: 'relative' }}>
                                <Image
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-full object-cover rounded-xl"
                                    fill
                                    sizes="80px"
                                />
                            </div>
                            <div className={`absolute -top-2 -right-2 w-4 h-4 ${statusConfig[event.status as keyof typeof statusConfig].dot} rounded-full border-2 border-white`}></div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-orange-600 transition-colors">
                                        {event.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-1">{event.description}</p>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    <div className={`${statusConfig[event.status as keyof typeof statusConfig].color} px-3 py-1 rounded-full text-xs font-bold`}>
                                        {statusConfig[event.status as keyof typeof statusConfig].label}
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${categoryColors[event.category as keyof typeof categoryColors]} text-white`}>
                                        {event.category}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <FiClock className="w-4 h-4" />
                                    <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <FiMapPin className="w-4 h-4" />
                                    <span className="truncate">{event.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <FiUsers className="w-4 h-4" />
                                    <span>{event.attendees}/{event.capacity}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <IoTicket className="w-4 h-4" />
                                    <span>${event.revenue.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(event.attendees / event.capacity) * 100}%` }}
                                            transition={{ delay: index * 0.2, duration: 1 }}
                                        />
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {Math.round((event.attendees / event.capacity) * 100)}% full
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <motion.button
                                        className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FiEye className="w-4 h-4 text-gray-600" />
                                    </motion.button>
                                    <motion.button
                                        className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FiEdit3 className="w-4 h-4 text-gray-600" />
                                    </motion.button>
                                    <motion.button
                                        className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FiMoreHorizontal className="w-4 h-4 text-gray-600" />
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            if (direction === 'prev') {
                newDate.setMonth(newDate.getMonth() - 1);
            } else {
                newDate.setMonth(newDate.getMonth() + 1);
            }
            return newDate;
        });
    };

    const formatMonthYear = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const getUpcomingEventsCount = () => {
        const today = new Date();
        return mockCalendarEvents.filter(event => new Date(event.date) >= today).length;
    };

    const getTodayEventsCount = () => {
        const today = new Date().toISOString().split('T')[0];
        return mockCalendarEvents.filter(event => event.date === today).length;
    };

    const getSelectedDateEvents = () => {
        if (!selectedDate) return [];
        return mockCalendarEvents.filter(event => event.date === selectedDate);
    };

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
                            <HiOutlineCalendarDays className="w-12 h-12" />
                            Calendar
                        </h1>
                        <p className="text-orange-100 text-lg mb-4">
                            Schedule & timeline • {getUpcomingEventsCount()} upcoming events
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                                <IoFlash className="w-5 h-5" />
                                <span className="font-semibold">{getTodayEventsCount()} events today</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2">
                                <IoSparkles className="w-5 h-5" />
                                <span className="font-semibold">{formatMonthYear(currentDate)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <motion.button
                            className="bg-white text-orange-600 px-6 py-3 rounded-xl font-bold hover:bg-orange-50 transition-all shadow-lg flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FiPlus className="w-5 h-5" />
                            Schedule Event
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Controls */}
            <motion.div
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <motion.button
                                onClick={() => navigateMonth('prev')}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiChevronLeft className="w-5 h-5" />
                            </motion.button>

                            <h2 className="text-xl font-bold text-gray-900 min-w-48 text-center">
                                {formatMonthYear(currentDate)}
                            </h2>

                            <motion.button
                                onClick={() => navigateMonth('next')}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiChevronRight className="w-5 h-5" />
                            </motion.button>
                        </div>

                        {selectedDate && (
                            <motion.button
                                onClick={() => setSelectedDate(null)}
                                className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-200 transition-colors"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Clear selection ({new Date(selectedDate).toLocaleDateString()})
                            </motion.button>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                            <motion.button
                                onClick={() => setViewMode('calendar')}
                                className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${viewMode === 'calendar' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiCalendar className="w-4 h-4 inline mr-2" />
                                Calendar
                            </motion.button>
                            <motion.button
                                onClick={() => setViewMode('list')}
                                className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600'
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiList className="w-4 h-4 inline mr-2" />
                                List
                            </motion.button>
                        </div>

                        <motion.button
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FiDownload className="w-4 h-4" />
                            Export
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                {viewMode === 'calendar' ? (
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        <div className="xl:col-span-2">
                            <Calendar
                                currentDate={currentDate}
                                events={mockCalendarEvents}
                                onDateClick={setSelectedDate}
                                selectedDate={selectedDate}
                            />
                        </div>

                        <div>
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <BsCalendar2Event className="w-6 h-6 text-orange-500" />
                                    {selectedDate ? `Events for ${new Date(selectedDate).toLocaleDateString()}` : 'Upcoming Events'}
                                </h3>

                                <EventList
                                    events={mockCalendarEvents}
                                    selectedDate={selectedDate}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <EventList
                            events={mockCalendarEvents}
                            selectedDate={selectedDate}
                        />
                    </div>
                )}
            </motion.div>
        </div>
    );
}