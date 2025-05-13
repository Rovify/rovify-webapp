'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCurrentUser } from '@/mocks/data/users';
import { getEventById } from '@/mocks/data/events';
import { getUserTickets } from '@/mocks/data/tickets';
import { User, Event, Ticket } from '@/types';
import EventCard from './EventCard';
import EventCardSkeleton from './skeletons/EventCardSkeleton';
import ProfileSkeleton from './skeletons/ProfileSkeleton';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { FiEdit2, FiLogOut } from 'react-icons/fi';

export default function ProfilePage() {
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
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Header />

            <main className="container mx-auto px-4 py-6 pt-24 pb-28">
                <h1 className="text-2xl font-bold mb-6">My Profile</h1>

                {/* Profile Header */}
                {isLoading ? (
                    <ProfileSkeleton />
                ) : (
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                            <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-[#FF5722]">
                                <Image
                                    src={currentUser?.image || 'https://via.placeholder.com/96'}
                                    alt={currentUser?.name || 'User'}
                                    fill
                                    className="object-cover"
                                />
                                {currentUser?.verified && (
                                    <div className="absolute bottom-0 right-0 bg-[#FF5722] rounded-full h-6 w-6 flex items-center justify-center border-2 border-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 text-center sm:text-left">
                                <h1 className="text-2xl font-bold mb-1 text-gray-800">{currentUser?.name}</h1>
                                <p className="text-gray-500 mb-2">@{currentUser?.username}</p>
                                <p className="text-gray-700 mb-3">{currentUser?.bio}</p>

                                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
                                    {currentUser?.interests.map((interest, index) => (
                                        <span key={index} className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                                            {interest}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex justify-center sm:justify-start gap-6 text-sm">
                                    <div>
                                        <span className="font-bold text-gray-800">{currentUser?.followers}</span>
                                        <span className="text-gray-500 ml-1">Followers</span>
                                    </div>
                                    <div>
                                        <span className="font-bold text-gray-800">{currentUser?.following}</span>
                                        <span className="text-gray-500 ml-1">Following</span>
                                    </div>
                                    <div>
                                        <span className="font-bold text-gray-800">{currentUser?.attendedEvents.length}</span>
                                        <span className="text-gray-500 ml-1">Events</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <button className="bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-full px-4 py-1.5 text-sm font-medium shadow-sm transition-colors flex items-center justify-center gap-1">
                                    <FiEdit2 className="w-4 h-4" />
                                    Edit Profile
                                </button>

                                {!isWalletConnected ? (
                                    <button
                                        onClick={handleConnectWallet}
                                        className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-full px-4 py-1.5 text-sm font-medium transition-colors flex items-center justify-center gap-1"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#FF5722]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        Connect Wallet
                                    </button>
                                ) : (
                                    <div className="bg-gray-100 text-gray-700 rounded-full px-3 py-1.5 text-xs font-medium flex items-center gap-1">
                                        <span className="h-2 w-2 rounded-full bg-green-400"></span>
                                        <span className="truncate max-w-[120px]">
                                            {`${walletAddress?.substring(0, 6)}...${walletAddress?.substring(walletAddress.length - 4)}`}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="mb-6 border-b border-gray-200">
                    <div className="flex gap-4">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab
                                    ? 'border-[#FF5722] text-[#FF5722]'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
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
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Saved Events</h2>

                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(3)].map((_, i) => (
                                    <EventCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : savedEvents.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {savedEvents.map((event) => (
                                    <EventCard key={event.id} event={event} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl p-8 text-center border border-gray-200 shadow-sm">
                                <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FF5722]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-800">No saved events</h3>
                                <p className="text-gray-600 mb-6">Find and save events that interest you.</p>
                                <Link
                                    href="/"
                                    className="bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-full px-6 py-2 font-medium inline-block shadow-sm transition-colors"
                                >
                                    Discover Events
                                </Link>
                            </div>
                        )}

                        <h2 className="text-xl font-semibold mb-4 pt-4 text-gray-800">Attended Events</h2>

                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(3)].map((_, i) => (
                                    <EventCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : currentUser?.attendedEvents.length ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {currentUser.attendedEvents.map((eventId) => {
                                    const event = getEventById(eventId);
                                    if (!event) return null;
                                    return <EventCard key={event.id} event={event} />;
                                })}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl p-8 text-center border border-gray-200 shadow-sm">
                                <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FF5722]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-800">No attended events</h3>
                                <p className="text-gray-600 mb-6">Purchase tickets to events to see them here.</p>
                                <Link
                                    href="/"
                                    className="bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-full px-6 py-2 font-medium inline-block shadow-sm transition-colors"
                                >
                                    Find Events
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'tickets' && (
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Tickets</h2>

                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-32 rounded-xl bg-gray-200 animate-shimmer"></div>
                                ))}
                            </div>
                        ) : tickets.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {tickets.map((ticket) => {
                                    const event = getEventById(ticket.eventId);
                                    if (!event) return null;

                                    return (
                                        <Link key={ticket.id} href={`/tickets?selected=${ticket.id}`}>
                                            <div className="relative h-32 flex rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors bg-white shadow-sm">
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
                                                        <div className="absolute top-2 left-2 bg-[#FF5722] text-white rounded-full px-2 py-0.5 text-xs font-semibold">
                                                            NFT
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Right: Ticket Info */}
                                                <div className="w-2/3 bg-white p-3 flex flex-col justify-between">
                                                    <div>
                                                        <h3 className="font-semibold line-clamp-1 text-gray-800">{event.title}</h3>
                                                        <p className="text-xs text-gray-500 mb-1">
                                                            {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </p>
                                                        <div className="flex items-center gap-1 text-xs text-gray-600">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#FF5722]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            <span className="line-clamp-1">{event.location.name}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between items-end">
                                                        <div>
                                                            <span className="text-xs text-gray-500">Type:</span>
                                                            <span className="text-sm font-medium ml-1 text-gray-700">{ticket.type}</span>
                                                        </div>
                                                        <div className="text-[#FF5722] font-semibold">
                                                            #{ticket.tokenId?.substring(0, 4) || ticket.id}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Dotted separation line */}
                                                <div className="absolute h-full w-0 left-1/3 flex flex-col justify-between py-2">
                                                    <div className="h-3 w-3 rounded-full bg-white"></div>
                                                    {[...Array(8)].map((_, i) => (
                                                        <div key={i} className="h-1 w-1 rounded-full bg-white"></div>
                                                    ))}
                                                    <div className="h-3 w-3 rounded-full bg-white"></div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl p-8 text-center border border-gray-200 shadow-sm">
                                <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FF5722]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-800">No tickets yet</h3>
                                <p className="text-gray-600 mb-6">Purchase tickets to events to see them here.</p>
                                <Link
                                    href="/"
                                    className="bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-full px-6 py-2 font-medium inline-block shadow-sm transition-colors"
                                >
                                    Discover Events
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="space-y-6">
                        {isLoading ? (
                            <>
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="bg-gray-200 rounded-xl h-64 animate-shimmer" style={{ animationDelay: `${i * 0.2}s` }}></div>
                                ))}
                            </>
                        ) : (
                            <>
                                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Account Settings</h2>

                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                defaultValue={currentUser?.name}
                                                className="w-full bg-white border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                                Username
                                            </label>
                                            <input
                                                type="text"
                                                id="username"
                                                defaultValue={currentUser?.username}
                                                className="w-full bg-white border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                defaultValue={currentUser?.email}
                                                className="w-full bg-white border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                                                Bio
                                            </label>
                                            <textarea
                                                id="bio"
                                                rows={3}
                                                defaultValue={currentUser?.bio}
                                                className="w-full bg-white border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Notifications</h2>

                                    <div className="space-y-4">
                                        {['Event Reminders', 'When Friends Attend', 'New Events Near You', 'Price Drops'].map((notification, index) => (
                                            <div key={index} className="flex items-center justify-between">
                                                <span className="text-gray-700">{notification}</span>
                                                <label className="inline-flex relative items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        defaultChecked={index < 2}
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#FF5722] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF5722]"></div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Wallet</h2>

                                    {!isWalletConnected ? (
                                        <div className="flex flex-col items-center justify-center py-6">
                                            <div className="h-16 w-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#FF5722]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-semibold mb-2 text-gray-800">Connect Wallet</h3>
                                            <p className="text-gray-600 text-center mb-4 max-w-md">Connect your Web3 wallet to access NFT tickets and blockchain features.</p>
                                            <button
                                                onClick={handleConnectWallet}
                                                className="bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-full px-6 py-2 font-medium shadow-sm transition-colors"
                                            >
                                                Connect Wallet
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Connected Wallet</span>
                                                <span className="bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-700">
                                                    {`${walletAddress?.substring(0, 6)}...${walletAddress?.substring(walletAddress.length - 4)}`}
                                                </span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">Network</span>
                                                <div className="flex items-center gap-1">
                                                    <span className="h-2 w-2 rounded-full bg-green-400"></span>
                                                    <span className="text-gray-700">Polygon</span>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600">NFT Tickets</span>
                                                <span className="text-gray-700">{tickets.filter(t => t.isNft).length}</span>
                                            </div>

                                            <button className="w-full bg-white hover:bg-gray-50 border border-gray-300 transition-colors rounded-full py-2 text-sm text-gray-700 mt-4 flex items-center justify-center gap-2">
                                                <FiLogOut className="w-4 h-4" />
                                                Disconnect Wallet
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end mt-6">
                                    <button className="bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-full px-8 py-3 font-medium shadow-sm transition-colors">
                                        Save Changes
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </main>

            <BottomNavigation />

            {/* Global Styles */}
            <style jsx global>{`
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                
                .animate-shimmer {
                    background: linear-gradient(
                        90deg,
                        #f0f0f0 25%,
                        #e0e0e0 50%,
                        #f0f0f0 75%
                    );
                    background-size: 200% 100%;
                    animation: shimmer 1.5s infinite;
                }
            `}</style>
        </div>
    );
}