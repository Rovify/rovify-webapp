'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiHeart, FiShare2, FiUsers, FiStar } from 'react-icons/fi';

interface Event {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    price: string;
    image: string;
    category: string;
    rating?: number;
    attendees?: number;
    isFeatured?: boolean;
    isLiked?: boolean;
    description?: string;
    tags?: string[];
}

interface EventListProps {
    events?: Event[];
    title?: string;
    showFilters?: boolean;
    maxEvents?: number;
}

const mockEvents: Event[] = [
    {
        id: 'e1',
        title: 'Summer Music Festival 2025',
        date: 'Sat, 3rd May',
        time: '12:00 PM - 10:00 PM',
        location: 'Central Park Main Stage',
        price: '$50',
        image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80',
        category: 'music',
        rating: 4.8,
        attendees: 1240,
        isFeatured: true,
        isLiked: false,
        description: 'Join us for the biggest summer music festival featuring international artists.',
        tags: ['Music', 'Festival', 'Outdoor']
    },
    {
        id: 'e2',
        title: 'Tech Startup Conference 2025',
        date: 'Mon, 5th May',
        time: '9:00 AM - 6:00 PM',
        location: 'Innovation Hub Nairobi',
        price: '$75',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
        category: 'tech',
        rating: 4.5,
        attendees: 650,
        isFeatured: false,
        isLiked: true,
        description: 'Network with entrepreneurs and learn from industry leaders.',
        tags: ['Tech', 'Networking', 'Startups']
    },
    {
        id: 'e3',
        title: 'Culinary Masterclass: African Fusion',
        date: 'Tue, 6th May',
        time: '7:00 PM - 9:30 PM',
        location: 'Gourmet Kitchen Studio',
        price: '$120',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
        category: 'food',
        rating: 4.9,
        attendees: 48,
        isFeatured: false,
        isLiked: false,
        description: 'Learn to cook authentic African fusion dishes.',
        tags: ['Cooking', 'Workshop']
    },
    {
        id: 'e4',
        title: 'Digital Art Exhibition: Future Visions',
        date: 'Wed, 7th May',
        time: '10:00 AM - 8:00 PM',
        location: 'Metropolitan Gallery',
        price: '$15',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
        category: 'art',
        rating: 4.3,
        attendees: 320,
        isFeatured: false,
        isLiked: false,
        description: 'Explore contemporary digital art visions.',
        tags: ['Digital Art', 'Exhibition']
    },
    {
        id: 'e5',
        title: 'Morning Yoga in the Park',
        date: 'Thu, 8th May',
        time: '6:30 AM - 8:00 AM',
        location: 'Uhuru Gardens',
        price: '$0',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
        category: 'outdoors',
        rating: 4.7,
        attendees: 85,
        isFeatured: false,
        isLiked: true,
        description: 'Start your day with mindful yoga practice.',
        tags: ['Yoga', 'Wellness', 'Morning']
    },
    {
        id: 'e6',
        title: 'Craft Beer Tasting Festival',
        date: 'Fri, 9th May',
        time: '5:00 PM - 11:00 PM',
        location: 'Riverside Brewery',
        price: '$35',
        image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&q=80',
        category: 'food',
        rating: 4.4,
        attendees: 420,
        isFeatured: true,
        isLiked: false,
        description: 'Sample the finest craft beers from local breweries.',
        tags: ['Beer', 'Tasting', 'Live Music']
    }
];

const EventCard: React.FC<{ event: Event; index: number }> = ({ event, index }) => {
    const [isLiked, setIsLiked] = useState(event.isLiked || false);

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLiked(!isLiked);
    };

    const handleShare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // Share functionality would go here
        console.log('Share event:', event.id);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-gray-900/10 hover:-translate-y-1 shadow-sm h-full flex flex-col cursor-pointer"
        >
            <Link href={`/events/${event.id}`}>
                {/* Image Section */}
                <div className="relative aspect-[4/3] overflow-hidden flex-shrink-0">
                    <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                        {event.isFeatured && (
                            <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                <FiStar size={10} fill="currentColor" />
                                Featured
                            </div>
                        )}
                        <div className="bg-black/20 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                            {event.category}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex gap-2">
                        <button
                            onClick={handleShare}
                            className="w-8 h-8 bg-black/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/30 transition-colors"
                            type="button"
                        >
                            <FiShare2 size={14} />
                        </button>
                        <button
                            onClick={handleLike}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                isLiked
                                    ? 'bg-red-500 text-white'
                                    : 'bg-black/20 backdrop-blur-sm text-white hover:bg-black/30'
                            }`}
                            type="button"
                        >
                            <FiHeart size={14} fill={isLiked ? 'currentColor' : 'none'} />
                        </button>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-4 flex-1 flex flex-col">
                    <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                            {event.title}
                        </h3>

                        <div className="space-y-2 mb-3">
                            <div className="flex items-center text-gray-500 text-sm">
                                <FiCalendar size={14} className="mr-1.5" />
                                {event.date}
                            </div>
                            <div className="flex items-center text-gray-500 text-sm">
                                <FiMapPin size={14} className="mr-1.5" />
                                <span className="line-clamp-1">{event.location}</span>
                            </div>
                        </div>

                        {(event.rating || event.attendees) && (
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                {event.rating && (
                                    <div className="flex items-center gap-1">
                                        <FiStar size={14} className="text-yellow-400" fill="currentColor" />
                                        <span>{event.rating}</span>
                                    </div>
                                )}
                                {event.attendees && (
                                    <div className="flex items-center gap-1">
                                        <FiUsers size={14} />
                                        <span>{event.attendees} going</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-gray-100 mt-auto">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className={`font-bold text-lg ${
                                    event.price === '$0' ? 'text-green-600' : 'text-orange-600'
                                }`}>
                                    {event.price === '$0' ? 'Free' : event.price}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-orange-600">
                                <span className="text-sm font-medium">View Event</span>
                                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                                    <FiCalendar size={16} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

const EventList: React.FC<EventListProps> = ({ 
    events = mockEvents, 
    title = "Featured Events", 
    showFilters = false,
    maxEvents = 6 
}) => {
    const [displayEvents, setDisplayEvents] = useState<Event[]>([]);

    useEffect(() => {
        setDisplayEvents(events.slice(0, maxEvents));
    }, [events, maxEvents]);

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                <Link 
                    href="/events" 
                    className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-1"
                >
                    View all events
                    <FiCalendar size={16} />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayEvents.map((event, index) => (
                    <EventCard key={event.id} event={event} index={index} />
                ))}
            </div>
        </div>
    );
};

export default EventList;
