'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistance } from 'date-fns';
import { Event } from '@/types';

interface EventCardProps {
    event: Event;
    variant?: 'default' | 'featured' | 'compact';
}

export default function EventCard({ event, variant = 'default' }: EventCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    const isFeatured = variant === 'featured';
    const isCompact = variant === 'compact';

    // Format date for display
    const formattedDate = formatDistance(new Date(event.date), new Date(), { addSuffix: true });

    // Price display logic
    const priceDisplay = event.price.min === event.price.max
        ? `${event.price.currency} ${event.price.min}`
        : `${event.price.currency} ${event.price.min} - ${event.price.max}`;

    return (
        <Link href={`/events/${event.id}`}>
            <div
                className={`group relative rounded-2xl overflow-hidden transition-all duration-300 ${isFeatured ? 'h-96 w-full' : isCompact ? 'h-36 w-full' : 'h-72 w-full'
                    } ${isHovered ? 'shadow-xl scale-[1.02]' : 'shadow-md'}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Gradient Overlay */}
                <div
                    className={`absolute inset-0 z-10 bg-gradient-to-t from-rovify-black via-transparent ${isHovered ? 'opacity-90' : 'opacity-80'
                        } transition-opacity duration-300`}
                />

                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className={`object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'
                            }`}
                    />
                </div>

                {/* NFT Badge - Show only if event has NFT tickets */}
                {event.hasNftTickets && (
                    <div className="absolute top-3 right-3 z-20 bg-rovify-orange text-white rounded-full px-2 py-1 text-xs font-semibold flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1.5l-1.8-1.8A2 2 0 0012.46 2H7.54a2 2 0 00-1.42.59L4.3 4z" />
                        </svg>
                        NFT
                    </div>
                )}

                {/* Main Content */}
                <div className={`absolute bottom-0 left-0 right-0 z-20 p-4 ${isFeatured ? 'pb-6' : isCompact ? 'pb-3' : 'pb-4'
                    }`}>
                    <div className="space-y-1">
                        {/* Category */}
                        <p className={`text-rovify-lavender ${isFeatured ? 'text-sm' : isCompact ? 'text-xs' : 'text-xs'
                            } font-medium`}>
                            {event.category} · {formattedDate}
                        </p>

                        {/* Title */}
                        <h3 className={`text-white font-bold ${isFeatured ? 'text-2xl' : isCompact ? 'text-lg' : 'text-xl'
                            } line-clamp-2`}>
                            {event.title}
                        </h3>

                        {/* Location & Price - Only show for featured and default */}
                        {!isCompact && (
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-white text-sm opacity-90">
                                    {event.location.city}
                                </p>
                                <p className="text-rovify-orange font-semibold text-sm">
                                    {priceDisplay}
                                </p>
                            </div>
                        )}

                        {/* Social Engagement - Only show for featured */}
                        {isFeatured && (
                            <div className="flex gap-4 mt-3">
                                <div className="flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rovify-blue" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                    </svg>
                                    <span className="text-white text-xs">{event.likes}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rovify-blue" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-white text-xs">{event.comments}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rovify-blue" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                                    </svg>
                                    <span className="text-white text-xs">{event.shares}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Ticket Progress - Display only for featured cards */}
                {isFeatured && (
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-800/50 z-20">
                        <div
                            className="h-full bg-gradient-to-r from-rovify-orange to-rovify-lavender"
                            style={{ width: `${(event.soldTickets / event.totalTickets) * 100}%` }}
                        />
                    </div>
                )}
            </div>
        </Link>
    );
}