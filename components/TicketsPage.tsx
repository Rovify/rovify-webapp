'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { getUserTickets } from '@/mocks/data/tickets';
import { getEventById } from '@/mocks/data/events';
import { getCurrentUser } from '@/mocks/data/users';
import { Ticket, Event, User } from '@/types';

export default function TicketsPage() {
    // const [tickets, setTickets] = useState<Ticket[]>([]);
    const [ticketsWithEvents, setTicketsWithEvents] = useState<Array<Ticket & { event: Event }>>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
    type TabType = 'upcoming' | 'past' | 'nft';
    const [activeTab, setActiveTab] = useState<TabType>('upcoming');
    const [isLoading, setIsLoading] = useState(true);
    const [isWalletConnected, setIsWalletConnected] = useState(false);

    useEffect(() => {
        // Simulate API fetch delay
        const timer = setTimeout(() => {
            const user = getCurrentUser();
            setCurrentUser(user);

            const userTickets = getUserTickets(user.id);
            // setTickets(userTickets);

            // Enrich tickets with event data
            const enrichedTickets = userTickets.map(ticket => {
                const event = getEventById(ticket.eventId);
                return {
                    ...ticket,
                    event: event!
                };
            });

            setTicketsWithEvents(enrichedTickets);
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    // Filter tickets based on selected tab
    const now = new Date();
    const filteredTickets = ticketsWithEvents.filter(ticket => {
        if (activeTab === 'upcoming') {
            return new Date(ticket.event.date) > now;
        } else if (activeTab === 'past') {
            return new Date(ticket.event.date) <= now;
        } else {
            return ticket.isNft;
        }
    });

    // Sort tickets by date (upcoming first for upcoming tab, most recent first for past tab)
    const sortedTickets = [...filteredTickets].sort((a, b) => {
        const dateA = new Date(a.event.date).getTime();
        const dateB = new Date(b.event.date).getTime();
        return activeTab === 'upcoming' ? dateA - dateB : dateB - dateA;
    });

    const selectedTicketData = selectedTicket
        ? ticketsWithEvents.find(t => t.id === selectedTicket)
        : null;

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

                    {!isLoading && currentUser && (
                        <div className="flex items-center gap-2">
                            <Link href="/profile" className="h-8 w-8 rounded-full overflow-hidden">
                                <Image
                                    src={currentUser.image}
                                    alt={currentUser.name}
                                    width={32}
                                    height={32}
                                    className="object-cover"
                                />
                            </Link>
                        </div>
                    )}
                </div>
            </header>

            <main className="container mx-auto px-4 py-6">
                <h1 className="text-3xl font-bold mb-2">My Tickets</h1>

                {/* Wallet Connection Banner - Show only if not connected */}
                {!isWalletConnected && (
                    <div className="mb-6 bg-gradient-to-r from-rovify-black to-black border border-white/10 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 flex-shrink-0 bg-white/10 rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rovify-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold">Connect Your Web3 Wallet</h3>
                                <p className="text-sm text-white/70">Connect your wallet to view and manage your NFT tickets</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsWalletConnected(true)}
                            className="bg-gradient-to-r from-rovify-orange to-rovify-lavender rounded-full px-5 py-2 text-sm font-medium"
                        >
                            Connect Wallet
                        </button>
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="mb-6 border-b border-white/10">
                    <div className="flex gap-4">
                        {['upcoming', 'past', 'nft'].map((tab, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveTab(tab as TabType)}
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

                {/* Loading State */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 rounded-xl bg-white/10"></div>
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Ticket List */}
                        {sortedTickets.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {sortedTickets.map((ticket) => (
                                    <button
                                        key={ticket.id}
                                        onClick={() => setSelectedTicket(ticket.id)}
                                        className={`text-left rounded-xl overflow-hidden border ${selectedTicket === ticket.id
                                            ? 'border-rovify-orange'
                                            : 'border-white/10 hover:border-white/30'
                                            } transition-colors`}
                                    >
                                        <div className="relative h-32 flex">
                                            {/* Left: Event Image */}
                                            <div className="w-1/3 relative">
                                                <Image
                                                    src={ticket.event.image}
                                                    alt={ticket.event.title}
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
                                                    <h3 className="font-semibold line-clamp-1">{ticket.event.title}</h3>
                                                    <p className="text-xs text-white/70 mb-1">
                                                        {format(new Date(ticket.event.date), 'MMM d, yyyy • h:mm a')}
                                                    </p>
                                                    <div className="flex items-center gap-1 text-xs text-white/90">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-rovify-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        <span className="line-clamp-1">{ticket.event.location.name}</span>
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
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 text-center mb-6">
                                <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rovify-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">No tickets found</h3>
                                <p className="text-white/70 mb-6">You don`&apos;`t have any {activeTab} tickets yet</p>
                                <Link
                                    href="/"
                                    className="bg-gradient-to-r from-rovify-orange to-rovify-lavender rounded-full px-6 py-2 text-white font-medium inline-block"
                                >
                                    Discover Events
                                </Link>
                            </div>
                        )}

                        {/* Selected Ticket Detail */}
                        {selectedTicketData && (
                            <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden">
                                <div className="p-4 border-b border-white/10">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-semibold">Ticket Details</h3>
                                        <button
                                            onClick={() => setSelectedTicket(null)}
                                            className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-10 w-10 rounded overflow-hidden">
                                            <Image
                                                src={selectedTicketData.event.image}
                                                alt={selectedTicketData.event.title}
                                                width={40}
                                                height={40}
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h4 className="font-medium">{selectedTicketData.event.title}</h4>
                                            <p className="text-sm text-white/70">
                                                {format(new Date(selectedTicketData.event.date), 'EEEE, MMMM d, yyyy')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <div className="flex flex-col items-center">
                                        {/* QR Code */}
                                        <div className="bg-white p-2 rounded mb-4">
                                            <Image
                                                src={selectedTicketData.qrCode}
                                                alt="Ticket QR Code"
                                                width={200}
                                                height={200}
                                            />
                                        </div>

                                        <div className="bg-white/10 py-1 px-3 rounded-full text-sm font-medium mb-4">
                                            {selectedTicketData.type} • {selectedTicketData.currency} {selectedTicketData.price}
                                        </div>

                                        {/* Ticket Info */}
                                        <div className="w-full space-y-3 mb-4">
                                            <div className="flex justify-between">
                                                <span className="text-white/70">Ticket ID:</span>
                                                <span className="font-medium">#{selectedTicketData.id}</span>
                                            </div>

                                            {selectedTicketData.isNft && (
                                                <>
                                                    <div className="flex justify-between">
                                                        <span className="text-white/70">Token ID:</span>
                                                        <span className="font-medium">{selectedTicketData.tokenId}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-white/70">Contract:</span>
                                                        <span className="font-medium truncate max-w-[200px]">{selectedTicketData.contractAddress}</span>
                                                    </div>
                                                </>
                                            )}

                                            <div className="flex justify-between">
                                                <span className="text-white/70">Purchase Date:</span>
                                                <span className="font-medium">{format(new Date(selectedTicketData.purchaseDate), 'MMM d, yyyy')}</span>
                                            </div>

                                            {selectedTicketData.seatInfo && (
                                                <div className="flex justify-between">
                                                    <span className="text-white/70">Seat:</span>
                                                    <span className="font-medium">
                                                        {selectedTicketData.seatInfo.section && `Section ${selectedTicketData.seatInfo.section}`}
                                                        {selectedTicketData.seatInfo.row && `, Row ${selectedTicketData.seatInfo.row}`}
                                                        {selectedTicketData.seatInfo.seat && `, Seat ${selectedTicketData.seatInfo.seat}`}
                                                        {selectedTicketData.seatInfo.timeSlot && format(new Date(selectedTicketData.seatInfo.timeSlot), 'h:mm a')}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="flex justify-between">
                                                <span className="text-white/70">Status:</span>
                                                <span className={`font-medium ${selectedTicketData.status === 'ACTIVE' ? 'text-green-400' :
                                                    selectedTicketData.status === 'USED' ? 'text-white/60' :
                                                        selectedTicketData.status === 'EXPIRED' ? 'text-red-400' :
                                                            'text-blue-400'
                                                    }`}>
                                                    {selectedTicketData.status}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Ticket Actions */}
                                        <div className="flex gap-2 w-full">
                                            {selectedTicketData.isNft && (
                                                <button className="bg-white/10 hover:bg-white/20 transition-colors rounded-full px-4 py-2 text-sm font-medium flex-1 flex items-center justify-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 014-4h0a4 4 0 014 4 4 4 0 01-4 4h-0a4 4 0 00-4 4v0a4 4 0 01-4 4h-0a4 4 0 01-4-4v-0a4 4 0 00-4-4h-0a4 4 0 01-4-4v-0a4 4 0 014-4h0a4 4 0 004-4v0a4 4 0 014-4h0a4 4 0 014 4v0z" />
                                                    </svg>
                                                    View on Chain
                                                </button>
                                            )}

                                            {selectedTicketData.transferable && (
                                                <button className="bg-gradient-to-r from-rovify-orange to-rovify-lavender hover:opacity-90 transition-opacity rounded-full px-4 py-2 text-sm font-medium flex-1 flex items-center justify-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                                    </svg>
                                                    Transfer
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Perks */}
                                {selectedTicketData.metadata.perks && selectedTicketData.metadata.perks.length > 0 && (
                                    <div className="p-4 border-t border-white/10">
                                        <h4 className="font-semibold mb-2">Ticket Perks</h4>
                                        <ul className="space-y-2">
                                            {selectedTicketData.metadata.perks.map((perk, index) => (
                                                <li key={index} className="flex items-center gap-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-rovify-orange" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span>{perk}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
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
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rovify-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                            <span className="text-xs">Tickets</span>
                        </Link>

                        <Link href="/profile" className="flex flex-col items-center p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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