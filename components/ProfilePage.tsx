'use client';

import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getCurrentUser } from '@/mocks/data/users';
import { getEventById } from '@/mocks/data/events';
import { getUserTickets } from '@/mocks/data/tickets';
import { User, Event, Ticket } from '@/types';
import EventCard from './EventCard';

export default function ProfilePage() {
    // const router = useRouter();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [savedEvents, setSavedEvents] = useState<Event[]>([]);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [activeTab, setActiveTab] = useState<'events' | 'tickets' | 'settings'>('events');
    const [isLoading, setIsLoading] = useState(true);
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    type TabType = 'events' | 'tickets' | 'settings';
    const tabs: TabType[] = ['events', 'tickets', 'settings'];

    // Mock connect wallet function
    const handleConnectWallet = () => {
        setIsWalletConnected(true);
        setWalletAddress(currentUser?.walletAddress || null);
    };

    useEffect(() => {
        // Simulate API fetch delay
        const timer = setTimeout(() => {
            const user = getCurrentUser();
            setCurrentUser(user);

            // Get saved events
            const events = user.savedEvents.map(id => getEventById(id)).filter(Boolean) as Event[];
            setSavedEvents(events);

            // Get user tickets
            const userTickets = getUserTickets(user.id);
            setTickets(userTickets);

            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rovify-black to-black text-white">
                <div className="container mx-auto px-4 py-6">
                    <div className="animate-pulse space-y-6">
                        <div className="h-36 rounded-2xl bg-white/10"></div>
                        <div className="h-8 w-2/3 rounded-md bg-white/10"></div>
                        <div className="h-4 w-1/2 rounded-md bg-white/10"></div>
                        <div className="h-64 rounded-md bg-white/10"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rovify-black to-black text-white flex flex-col items-center justify-center p-4">
                <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 max-w-md text-center">
                    <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rovify-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
                    <p className="text-white/70 mb-6">Please login to view your profile.</p>
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-rovify-black to-black text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-rovify-black/70 border-b border-white/10">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-rovify-orange to-rovify-lavender flex items-center justify-center">
                            <span className="text-white font-bold">R</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight">Rovify</span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <button className="h-8 w-8 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6">
                {/* Profile Header */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 mb-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                        <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-rovify-lavender">
                            <Image
                                src={currentUser.image}
                                alt={currentUser.name}
                                fill
                                className="object-cover"
                            />
                            {currentUser.verified && (
                                <div className="absolute bottom-0 right-0 bg-rovify-blue rounded-full h-6 w-6 flex items-center justify-center border-2 border-rovify-black">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                            <h1 className="text-2xl font-bold mb-1">{currentUser.name}</h1>
                            <p className="text-white/70 mb-2">@{currentUser.username}</p>
                            <p className="text-white/90 mb-3">{currentUser.bio}</p>

                            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
                                {currentUser.interests.map((interest, index) => (
                                    <span key={index} className="bg-white/10 text-xs px-3 py-1 rounded-full">
                                        {interest}
                                    </span>
                                ))}
                            </div>

                            <div className="flex justify-center sm:justify-start gap-6 text-sm">
                                <div>
                                    <span className="font-bold">{currentUser.followers}</span>
                                    <span className="text-white/70 ml-1">Followers</span>
                                </div>
                                <div>
                                    <span className="font-bold">{currentUser.following}</span>
                                    <span className="text-white/70 ml-1">Following</span>
                                </div>
                                <div>
                                    <span className="font-bold">{currentUser.attendedEvents.length}</span>
                                    <span className="text-white/70 ml-1">Events</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <button className="bg-gradient-to-r from-rovify-orange to-rovify-lavender hover:opacity-90 transition-opacity text-white rounded-full px-4 py-1.5 text-sm font-medium">
                                Edit Profile
                            </button>

                            {!isWalletConnected ? (
                                <button
                                    onClick={handleConnectWallet}
                                    className="bg-white/10 hover:bg-white/20 transition-colors text-white rounded-full px-4 py-1.5 text-sm font-medium flex items-center justify-center gap-1"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rovify-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Connect Wallet
                                </button>
                            ) : (
                                <div className="bg-white/10 text-white rounded-full px-3 py-1.5 text-xs font-medium flex items-center gap-1">
                                    <span className="h-2 w-2 rounded-full bg-green-400"></span>
                                    <span className="truncate max-w-[120px]">
                                        {`${walletAddress?.substring(0, 6)}...${walletAddress?.substring(walletAddress.length - 4)}`}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="mb-6 border-b border-white/10">
                    <div className="flex gap-4">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
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
                {activeTab === 'events' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold mb-4">Saved Events</h2>

                        {savedEvents.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {savedEvents.map((event) => (
                                    <EventCard key={event.id} event={event} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 text-center">
                                <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rovify-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">No saved events</h3>
                                <p className="text-white/70 mb-6">Find and save events that interest you.</p>
                                <Link
                                    href="/"
                                    className="bg-gradient-to-r from-rovify-orange to-rovify-lavender rounded-full px-6 py-2 text-white font-medium inline-block"
                                >
                                    Discover Events
                                </Link>
                            </div>
                        )}

                        <h2 className="text-xl font-semibold mb-4 pt-4">Attended Events</h2>

                        {currentUser.attendedEvents.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {currentUser.attendedEvents.map((eventId) => {
                                    const event = getEventById(eventId);
                                    if (!event) return null;
                                    return <EventCard key={event.id} event={event} />;
                                })}
                            </div>
                        ) : (
                            <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 text-center">
                                <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rovify-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">No attended events</h3>
                                <p className="text-white/70 mb-6">Purchase tickets to events to see them here.</p>
                                <Link
                                    href="/"
                                    className="bg-gradient-to-r from-rovify-orange to-rovify-lavender rounded-full px-6 py-2 text-white font-medium inline-block"
                                >
                                    Find Events
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'tickets' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold mb-4">Your Tickets</h2>

                        {tickets.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {tickets.map((ticket) => {
                                    const event = getEventById(ticket.eventId);
                                    if (!event) return null;

                                    return (
                                        <Link key={ticket.id} href={`/tickets?selected=${ticket.id}`}>
                                            <div className="relative h-32 flex rounded-xl overflow-hidden border border-white/10 hover:border-white/30 transition-colors">
                                                {/* Left: Event Image */}
                                                <div className="w-1/3 relative">
                                                    <Image
                                                        src={event.image}
                                                        alt={event.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    {/* NFT Badge */}
                                                    {ticket.isNft && (
                                                        <div className="absolute top-2 left-2 bg-rovify-orange text-white rounded-full px-2 py-0.5 text-xs font-semibold">
                                                            NFT
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Right: Ticket Info */}
                                                <div className="w-2/3 bg-white/5 backdrop-blur-sm p-3 flex flex-col justify-between">
                                                    <div>
                                                        <h3 className="font-semibold line-clamp-1">{event.title}</h3>
                                                        <p className="text-xs text-white/70 mb-1">
                                                            {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </p>
                                                        <div className="flex items-center gap-1 text-xs text-white/90">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-rovify-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            <span className="line-clamp-1">{event.location.name}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between items-end">
                                                        <div>
                                                            <span className="text-xs text-white/70">Type:</span>
                                                            <span className="text-sm font-medium ml-1">{ticket.type}</span>
                                                        </div>
                                                        <div className="text-rovify-orange font-semibold">
                                                            #{ticket.tokenId?.substring(0, 4) || ticket.id}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Dotted separation line */}
                                                <div className="absolute h-full w-0 left-1/3 flex flex-col justify-between py-2">
                                                    <div className="h-3 w-3 rounded-full bg-rovify-black"></div>
                                                    {[...Array(8)].map((_, i) => (
                                                        <div key={i} className="h-1 w-1 rounded-full bg-rovify-black"></div>
                                                    ))}
                                                    <div className="h-3 w-3 rounded-full bg-rovify-black"></div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 text-center">
                                <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rovify-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">No tickets yet</h3>
                                <p className="text-white/70 mb-6">Purchase tickets to events to see them here.</p>
                                <Link
                                    href="/"
                                    className="bg-gradient-to-r from-rovify-orange to-rovify-lavender rounded-full px-6 py-2 text-white font-medium inline-block"
                                >
                                    Discover Events
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="space-y-6">
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        defaultValue={currentUser.name}
                                        className="w-full bg-white/10 border border-white/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rovify-lavender"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium mb-1">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        defaultValue={currentUser.username}
                                        className="w-full bg-white/10 border border-white/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rovify-lavender"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        defaultValue={currentUser.email}
                                        className="w-full bg-white/10 border border-white/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rovify-lavender"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="bio" className="block text-sm font-medium mb-1">
                                        Bio
                                    </label>
                                    <textarea
                                        id="bio"
                                        rows={3}
                                        defaultValue={currentUser.bio}
                                        className="w-full bg-white/10 border border-white/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rovify-lavender"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <h2 className="text-xl font-semibold mb-4">Notifications</h2>

                            <div className="space-y-4">
                                {['Event Reminders', 'When Friends Attend', 'New Events Near You', 'Price Drops'].map((notification, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <span>{notification}</span>
                                        <label className="inline-flex relative items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                defaultChecked={index < 2}
                                            />
                                            <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-rovify-lavender rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-rovify-orange peer-checked:to-rovify-lavender"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <h2 className="text-xl font-semibold mb-4">Wallet</h2>

                            {!isWalletConnected ? (
                                <div className="flex flex-col items-center justify-center py-6">
                                    <div className="h-16 w-16 mb-4 rounded-full bg-white/10 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rovify-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">Connect Wallet</h3>
                                    <p className="text-white/70 text-center mb-4 max-w-md">Connect your Web3 wallet to access NFT tickets and blockchain features.</p>
                                    <button
                                        onClick={handleConnectWallet}
                                        className="bg-gradient-to-r from-rovify-orange to-rovify-lavender rounded-full px-6 py-2 text-white font-medium"
                                    >
                                        Connect Wallet
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-white/70">Connected Wallet</span>
                                        <span className="bg-white/10 rounded-full px-3 py-1 text-sm">
                                            {`${walletAddress?.substring(0, 6)}...${walletAddress?.substring(walletAddress.length - 4)}`}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-white/70">Network</span>
                                        <div className="flex items-center gap-1">
                                            <span className="h-2 w-2 rounded-full bg-green-400"></span>
                                            <span>Polygon</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-white/70">NFT Tickets</span>
                                        <span>{tickets.filter(t => t.isNft).length}</span>
                                    </div>

                                    <button className="w-full bg-white/10 hover:bg-white/20 transition-colors rounded-full py-2 text-sm mt-4">
                                        Disconnect Wallet
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end mt-6">
                            <button className="bg-gradient-to-r from-rovify-orange to-rovify-lavender hover:opacity-90 transition-opacity rounded-full px-8 py-3 text-white font-medium">
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-rovify-black/90 backdrop-blur-md border-t border-white/10 py-2 z-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-around items-center">
                        <Link href="/" className="flex flex-col items-center p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span className="text-xs">Home</span>
                        </Link>

                        <Link href="/discover" className="flex flex-col items-center p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            <span className="text-xs">Map</span>
                        </Link>

                        <Link href="/create" className="relative">
                            <div className="absolute inset-0 rounded-full bg-white/10 blur-md opacity-80"></div>
                            <div className="relative h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                        </Link>

                        <Link href="/tickets" className="flex flex-col items-center p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                            <span className="text-xs">Tickets</span>
                        </Link>

                        <Link href="/profile" className="flex flex-col items-center p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rovify-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="text-xs">Profile</span>
                        </Link>
                    </div>
                </div>
            </nav>
        </div>
    );
}