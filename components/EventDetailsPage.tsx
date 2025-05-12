'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { getEventById } from '@/mocks/data/events';
import { getUsersByEvent } from '@/mocks/data/users';
import { getTicketsByEvent } from '@/mocks/data/tickets';
import { Event, User, Ticket } from '@/types';

interface EventDetailsPageProps {
    id: string;
}

export default function EventDetailsPage({ id }: EventDetailsPageProps) {
    const router = useRouter();

    const [event, setEvent] = useState<Event | null>(null);
    const [attendees, setAttendees] = useState<User[]>([]);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [activeTab, setActiveTab] = useState<'details' | 'tickets' | 'attendees'>('details');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            // Simulate API fetch delay
            const timer = setTimeout(() => {
                const fetchedEvent = getEventById(id);
                if (fetchedEvent) {
                    setEvent(fetchedEvent);
                    setAttendees(getUsersByEvent(fetchedEvent.id));
                    setTickets(getTicketsByEvent(fetchedEvent.id));
                }
                setIsLoading(false);
            }, 800);

            return () => clearTimeout(timer);
        }
    }, [id]);

    // Early return for loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rovify-black to-black text-white">
                <div className="container mx-auto px-4 py-6">
                    <div className="animate-pulse space-y-6">
                        <div className="h-[30vh] rounded-2xl bg-white/10" />
                        <div className="h-8 w-2/3 rounded-md bg-white/10" />
                        <div className="h-4 w-1/2 rounded-md bg-white/10" />
                        <div className="h-24 rounded-md bg-white/10" />
                    </div>
                </div>
            </div>
        );
    }

    // Early return if event not found
    if (!event) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rovify-black to-black text-white flex flex-col items-center justify-center p-4">
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 max-w-md text-center">
                    <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rovify-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
                    <p className="text-white/70 mb-6">This event may have been removed or the link is incorrect.</p>
                    <Link
                        href="/"
                        className="bg-gradient-to-r from-rovify-orange to-rovify-lavender rounded-full px-6 py-2 text-white font-medium inline-block"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    // Format dates
    const eventDate = format(new Date(event.date), 'EEEE, MMMM d, yyyy');
    const eventTime = format(new Date(event.date), 'h:mm a');
    const eventEndTime = format(new Date(event.endDate), 'h:mm a');

    // Calculate ticket availability percentage
    const ticketAvailabilityPercent = Math.min(100, Math.round((event.soldTickets / event.totalTickets) * 100));

    return (
        <div className="min-h-screen bg-gradient-to-br from-rovify-black to-black text-white">
            {/* Header with back button */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-rovify-black/70 border-b border-white/10">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <button
                        onClick={() => router.back()}
                        className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <div className="flex items-center gap-2">
                        <button className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                        </button>
                        <button className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6">
                {/* Event Cover */}
                <div className="relative h-[30vh] md:h-[40vh] rounded-2xl overflow-hidden mb-6">
                    {/* NFT Badge */}
                    {event.hasNftTickets && (
                        <div className="absolute top-4 right-4 z-20 bg-rovify-orange text-white rounded-full px-3 py-1.5 text-sm font-semibold flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1.5l-1.8-1.8A2 2 0 0012.46 2H7.54a2 2 0 00-1.42.59L4.3 4z" />
                            </svg>
                            NFT Tickets
                        </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-rovify-black via-transparent to-transparent" />

                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* Event Title & Organizer */}
                <div className="mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full overflow-hidden">
                            <Image
                                src={event.organizer.image}
                                alt={event.organizer.name}
                                width={24}
                                height={24}
                                className="object-cover"
                            />
                        </div>
                        <span className="text-white/80">{event.organizer.name}</span>
                        {event.organizer.verified && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rovify-blue" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>
                </div>

                {/* Event Meta Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 flex flex-col">
                        <span className="text-white/60 text-sm mb-1">Date & Time</span>
                        <span className="font-medium">{eventDate}</span>
                        <span className="text-rovify-lavender">{eventTime} - {eventEndTime}</span>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 flex flex-col">
                        <span className="text-white/60 text-sm mb-1">Location</span>
                        <span className="font-medium">{event.location.name}</span>
                        <span className="text-white/80">{event.location.address}, {event.location.city}</span>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 flex flex-col">
                        <span className="text-white/60 text-sm mb-1">Price</span>
                        <span className="font-medium">
                            {event.price.min === event.price.max
                                ? `${event.price.currency} ${event.price.min}`
                                : `${event.price.currency} ${event.price.min} - ${event.price.max}`}
                        </span>
                        <div className="flex items-center gap-2 text-sm">
                            <div className="w-24 h-2 bg-white/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-rovify-orange to-rovify-lavender"
                                    style={{ width: `${ticketAvailabilityPercent}%` }}
                                />
                            </div>
                            <span className="text-white/60">
                                {event.soldTickets} / {event.totalTickets} sold
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="mb-6 border-b border-white/10">
                    <div className="flex gap-4">
                        {['details', 'tickets', 'attendees'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab
                                    ? 'border-rovify-orange text-white'
                                    : 'border-transparent text-white/60 hover:text-white'
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'details' && (
                    <div className="space-y-8">
                        {/* Description */}
                        <section>
                            <h2 className="text-xl font-semibold mb-3">About this event</h2>
                            <p className="text-white/80 leading-relaxed">{event.description}</p>
                        </section>

                        {/* Tags */}
                        <section>
                            <h2 className="text-xl font-semibold mb-3">Tags</h2>
                            <div className="flex flex-wrap gap-2">
                                {event.tags.map((tag) => (
                                    <span key={tag} className="bg-white/10 rounded-full px-3 py-1.5 text-sm">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </section>

                        {/* Location Map */}
                        <section>
                            <h2 className="text-xl font-semibold mb-3">Location</h2>
                            <div className="h-48 bg-white/5 rounded-xl overflow-hidden relative">
                                {/* This would be replaced with actual map integration */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="text-white/60">Map will be integrated here</p>
                                </div>
                                {/* Map placeholder */}
                                <Image
                                    src={`https://via.placeholder.com/800x400/77A8FF/FFFFFF?text=Map+for+${event.location.name}`}
                                    alt={`Map for ${event.location.name}`}
                                    fill
                                    className="object-cover opacity-50"
                                />
                            </div>
                            <p className="mt-2 text-white/80">{event.location.address}, {event.location.city}</p>
                        </section>
                    </div>
                )}

                {activeTab === 'tickets' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold mb-4">Available Tickets</h2>

                        {/* Ticket Types */}
                        <div className="space-y-4">
                            {/* General Admission */}
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-rovify-lavender/50 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-semibold text-lg">General Admission</h3>
                                        <p className="text-white/70 text-sm">Standard entry to the event</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-rovify-orange">{event.price.currency} {event.price.min}</p>
                                        <p className="text-white/60 text-xs">{event.totalTickets - event.soldTickets} remaining</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-1 text-white/80 text-sm">
                                        {event.hasNftTickets && (
                                            <div className="flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rovify-lavender" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1.5l-1.8-1.8A2 2 0 0012.46 2H7.54a2 2 0 00-1.42.59L4.3 4z" />
                                                </svg>
                                                <span>NFT Ticket</span>
                                            </div>
                                        )}
                                    </div>
                                    <button className="bg-gradient-to-r from-rovify-orange to-rovify-lavender rounded-full px-4 py-2 text-sm font-medium">
                                        Buy Ticket
                                    </button>
                                </div>
                            </div>

                            {/* VIP Ticket */}
                            {event.price.min !== event.price.max && (
                                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-rovify-lavender/50 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-semibold text-lg">VIP Experience</h3>
                                            <p className="text-white/70 text-sm">Premium access with exclusive perks</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-rovify-orange">{event.price.currency} {event.price.max}</p>
                                            <p className="text-white/60 text-xs">Limited availability</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-1 text-white/80 text-sm">
                                            {event.hasNftTickets && (
                                                <div className="flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rovify-lavender" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1.5l-1.8-1.8A2 2 0 0012.46 2H7.54a2 2 0 00-1.42.59L4.3 4z" />
                                                    </svg>
                                                    <span>NFT Ticket</span>
                                                </div>
                                            )}
                                        </div>
                                        <button className="bg-gradient-to-r from-rovify-orange to-rovify-lavender rounded-full px-4 py-2 text-sm font-medium">
                                            Buy Ticket
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* NFT Ticket Info */}
                        {event.hasNftTickets && (
                            <div className="mt-8 bg-gradient-to-r from-rovify-black to-rovify-black/50 backdrop-blur-md rounded-xl p-6 border border-white/10">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 flex-shrink-0 bg-gradient-to-br from-rovify-orange to-rovify-lavender rounded-full flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">NFT Ticket Benefits</h3>
                                        <ul className="list-disc list-inside text-white/80 space-y-1">
                                            <li>Proof of attendance as NFT on Polygon blockchain</li>
                                            <li>Tradeable on secondary marketplaces</li>
                                            <li>Access to exclusive content or future events</li>
                                            <li>Digital collectible that never expires</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'attendees' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Who's Going <span className="text-rovify-orange">({attendees.length})</span>
                        </h2>

                        {attendees.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {attendees.map((attendee) => (
                                    <div key={attendee.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-full overflow-hidden">
                                            <Image
                                                src={attendee.image}
                                                alt={attendee.name}
                                                width={48}
                                                height={48}
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium flex items-center gap-1">
                                                {attendee.name}
                                                {attendee.verified && (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rovify-blue" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </h3>
                                            <p className="text-white/70 text-sm">@{attendee.username}</p>
                                        </div>
                                        <button className="bg-white/10 hover:bg-white/20 transition-colors rounded-full px-3 py-1.5 text-xs font-medium">
                                            Follow
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 text-center">
                                <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rovify-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">No attendees yet</h3>
                                <p className="text-white/70 mb-6">Be the first to get a ticket!</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Sticky CTA */}
            <div className="fixed bottom-0 left-0 right-0 bg-rovify-black/90 backdrop-blur-md border-t border-white/10 py-4 z-50">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div>
                        <p className="text-lg font-semibold">
                            {event.price.min === event.price.max
                                ? `${event.price.currency} ${event.price.min}`
                                : `${event.price.currency} ${event.price.min} - ${event.price.max}`}
                        </p>
                        <p className="text-white/60 text-sm">{event.totalTickets - event.soldTickets} tickets left</p>
                    </div>

                    <button className="bg-gradient-to-r from-rovify-orange to-rovify-lavender hover:opacity-90 transition-opacity rounded-full px-8 py-3 text-white font-medium">
                        Buy Tickets
                    </button>
                </div>
            </div>
        </div>
    );
}