/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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
import { FiEdit2, FiLogOut, FiCheck, FiX, FiCalendar, FiMessageSquare, FiClock, FiAlertCircle, FiRefreshCcw, FiExternalLink, FiCopy, FiArrowRight, FiSettings, FiBell, FiHeart, FiUser, FiLink } from 'react-icons/fi';
import { FaBell, FaEthereum, FaCamera } from "react-icons/fa";
import { IoTicket } from "react-icons/io5";

// Define Ethereum types without modifying global Window interface
interface EthereumProviderEvent {
    accountsChanged: string[];
    chainChanged: string;
    connect: { chainId: string };
    disconnect: object;
    message: { type: string; data: unknown };
}

interface EthereumProvider {
    isMetaMask?: boolean;
    request(request: { method: string; params?: unknown[] }): Promise<unknown>;
    on<K extends keyof EthereumProviderEvent>(event: K, listener: (event: EthereumProviderEvent[K]) => void): void;
    removeListener<K extends keyof EthereumProviderEvent>(event: K, listener: (event: EthereumProviderEvent[K]) => void): void;
}

interface Notification {
    id: string;
    type: 'event' | 'message' | 'system' | 'reminder';
    title: string;
    content: string;
    image?: string;
    time: string;
    read: boolean;
    link: string;
    action?: string;
}

type TabType = 'events' | 'tickets' | 'notifications' | 'settings';
type EventsSubTabType = 'saved' | 'attended';

export default function ProfilePage() {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [savedEvents, setSavedEvents] = useState<Event[]>([]);
    const [tickets, setTickets] = useState<Ticket[]>([]);

    const [activeTab, setActiveTab] = useState<TabType>('events');
    const [activeSubTab, setActiveSubTab] = useState<EventsSubTabType>('saved');
    const [isLoading, setIsLoading] = useState(true);

    const [isWalletConnecting, setIsWalletConnecting] = useState(false);
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [walletBalance, setWalletBalance] = useState<string | null>(null);
    const [chainId, setChainId] = useState<string | null>(null);
    const [walletError, setWalletError] = useState<string | null>(null);
    const [walletCopied, setWalletCopied] = useState(false);

    const [notifications, setNotifications] = useState<Notification[]>([]);

    const tabs: TabType[] = ['events', 'tickets', 'notifications', 'settings'];

    // New state variables to add
    const [uploadingProfile, setUploadingProfile] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);

    // Create mockNotifications with useMemo and explicit type annotation to match Notification[]
    const mockNotifications = useMemo<Notification[]>(() => [
        {
            id: '1',
            type: 'event', // Now explicitly using the literal type
            title: 'Tech Summit 2025 is tomorrow!',
            content: 'Don\'t forget your tickets. The event starts at 10:00 AM.',
            image: '/images/events/tech-summit.jpg',
            time: '2 hours ago',
            read: false,
            link: '/events/tech-summit-2025',
            action: 'View Ticket'
        },
        {
            id: '2',
            type: 'message', // Now explicitly using the literal type
            title: 'New message from Sarah',
            content: 'Hey! Are you going to the Culinary Masterclass next week? I just got my tickets!',
            time: '1 day ago',
            read: true,
            link: '/messages/sarah',
            action: 'Reply'
        },
        {
            id: '3',
            type: 'system', // Now explicitly using the literal type
            title: 'NFT Tickets Confirmed',
            content: 'Your NFT tickets for Neon Nights have been minted and transferred to your wallet.',
            time: '2 days ago',
            read: false,
            link: '/tickets/neon-nights',
            action: 'View in Wallet'
        },
        {
            id: '4',
            type: 'reminder', // Now explicitly using the literal type
            title: 'Mindfulness Retreat starts soon',
            content: 'Your event begins in 48 hours. Don\'t forget to bring your yoga mat!',
            time: '3 days ago',
            read: true,
            link: '/events/mindfulness-retreat',
            action: 'View Details'
        },
        {
            id: '5',
            type: 'event', // Now explicitly using the literal type
            title: 'Price Drop Alert!',
            content: 'Tickets for Urban Art Exhibition have been discounted by 20%.',
            time: '4 days ago',
            read: false,
            link: '/events/urban-art-exhibition',
            action: 'Buy Now'
        },
        {
            id: '6',
            type: 'system', // Now explicitly using the literal type
            title: 'Wallet Connected',
            content: 'Your Ethereum wallet has been successfully connected to your Rovify account.',
            time: '1 week ago',
            read: true,
            link: '/settings',
            action: 'Manage Wallet'
        }
    ], []);

    // Handler for profile image upload
    const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingProfile(true);

            // Here you would typically:
            // 1. Create a FormData object
            // 2. Upload it to your backend using fetch or axios
            // 3. Get back the URL of the uploaded image
            // For demo purposes, we'll simulate this with a timeout

            // Simulate uploading
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Create an object URL for preview (in production, you'd use the URL from your server)
            const previewUrl = URL.createObjectURL(file);

            // Update user data - this is just a simulation
            // In production, you would update this after the server confirms the upload
            setCurrentUser(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    image: previewUrl
                };
            });

            // Success message
            // You might use a toast notification in production
            console.log("Profile image uploaded successfully!");

        } catch (error) {
            console.error("Error uploading profile image:", error);
            // Show error message to user
        } finally {
            setUploadingProfile(false);
        }
    };

    // Handler for cover image upload
    const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingCover(true);

            // Here you would typically:
            // 1. Create a FormData object
            // 2. Upload it to your backend using fetch or axios
            // 3. Get back the URL of the uploaded image
            // For demo purposes, we'll simulate this with a timeout

            // Simulate uploading
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Create an object URL for preview (in production, you'd use the URL from your server)
            const previewUrl = URL.createObjectURL(file);

            // Update user data - this is just a simulation
            // In production, you would update this after the server confirms the upload
            setCurrentUser(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    coverImage: previewUrl
                };
            });

            // Success message
            // You might use a toast notification in production
            console.log("Cover image uploaded successfully!");

        } catch (error) {
            console.error("Error uploading cover image:", error);
            // Show error message to user
        } finally {
            setUploadingCover(false);
        }
    };

    // Wrapped in useCallback to avoid recreations
    const checkWalletConnection = useCallback(async () => {
        if (typeof window !== 'undefined' && window.ethereum) {
            try {
                const ethereum = window.ethereum as EthereumProvider;
                const accounts = await ethereum.request({
                    method: 'eth_accounts'
                }) as string[];

                if (accounts && accounts.length > 0) {
                    setWalletAddress(accounts[0]);
                    setIsWalletConnected(true);

                    const chainId = await ethereum.request({
                        method: 'eth_chainId'
                    }) as string;
                    setChainId(chainId);

                    await updateWalletBalance(accounts[0]);
                }
            } catch (error) {
                console.error("Error checking wallet connection:", error);
            }
        }
    }, []);

    const handleAccountsChanged = useCallback((accounts: string[]) => {
        if (accounts.length === 0) {
            setIsWalletConnected(false);
            setWalletAddress(null);
            setWalletBalance(null);
            setChainId(null);
        } else {
            setWalletAddress(accounts[0]);
            updateWalletBalance(accounts[0]);
        }
    }, []);

    const handleChainChanged = useCallback((chainId: string) => {
        setChainId(chainId);
        if (walletAddress) {
            updateWalletBalance(walletAddress);
        }
    }, [walletAddress]);

    const initEthereumProvider = useCallback(() => {
        if (typeof window !== 'undefined' && window.ethereum) {
            const ethereum = window.ethereum as EthereumProvider;
            ethereum.on('accountsChanged', handleAccountsChanged);
            ethereum.on('chainChanged', handleChainChanged);
            checkWalletConnection();
        }
    }, [handleAccountsChanged, handleChainChanged, checkWalletConnection]);

    const handleConnectWallet = async () => {
        setIsWalletConnecting(true);
        setWalletError(null);

        if (typeof window !== 'undefined' && window.ethereum) {
            try {
                const ethereum = window.ethereum as EthereumProvider;
                const accounts = await ethereum.request({
                    method: 'eth_requestAccounts'
                }) as string[];

                if (accounts && accounts.length > 0) {
                    setIsWalletConnected(true);
                    setWalletAddress(accounts[0]);

                    const chainId = await ethereum.request({
                        method: 'eth_chainId'
                    }) as string;
                    setChainId(chainId);

                    await updateWalletBalance(accounts[0]);
                }
            } catch (error) {
                console.error("Error connecting wallet:", error);
                const errorMessage = error instanceof Error
                    ? error.message
                    : "Could not connect to wallet. Please try again.";
                setWalletError(errorMessage);
            } finally {
                setIsWalletConnecting(false);
            }
        } else {
            setWalletError("Metamask not detected! Please install Metamask extension.");
            setIsWalletConnecting(false);
        }
    };

    const updateWalletBalance = async (address: string) => {
        if (typeof window !== 'undefined' && window.ethereum) {
            try {
                const ethereum = window.ethereum as EthereumProvider;
                const balance = await ethereum.request({
                    method: 'eth_getBalance',
                    params: [address, 'latest']
                }) as string;

                if (balance) {
                    const ethBalance = (parseInt(balance, 16) / 1e18).toFixed(4);
                    setWalletBalance(ethBalance);
                }
            } catch (error) {
                console.error("Error updating balance:", error);
            }
        }
    };

    const disconnectWallet = useCallback(() => {
        setIsWalletConnected(false);
        setWalletAddress(null);
        setWalletBalance(null);
        setChainId(null);
    }, []);

    const copyWalletAddress = () => {
        if (walletAddress) {
            navigator.clipboard.writeText(walletAddress);
            setWalletCopied(true);
            setTimeout(() => setWalletCopied(false), 2000);
        }
    };

    const getChainName = (chainId: string | null) => {
        if (!chainId) return 'Unknown';

        const chainNames: Record<string, string> = {
            '0x1': 'Ethereum Mainnet',
            '0x89': 'Polygon',
            '0x13881': 'Polygon Mumbai',
            '0xaa36a7': 'Sepolia Testnet'
        };

        return chainNames[chainId] || 'Unknown Chain';
    };

    const markAsRead = (notificationId: string) => {
        setNotifications(prevNotifications =>
            prevNotifications.map(notification =>
                notification.id === notificationId
                    ? { ...notification, read: true }
                    : notification
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prevNotifications =>
            prevNotifications.map(notification => ({ ...notification, read: true }))
        );
    };

    useEffect(() => {
        initEthereumProvider();

        const timer = setTimeout(() => {
            const user = getCurrentUser();
            setCurrentUser(user);

            const events = user.savedEvents
                .map(id => getEventById(id))
                .filter(Boolean) as Event[];
            setSavedEvents(events);

            const userTickets = getUserTickets(user.id);
            setTickets(userTickets);

            setNotifications(mockNotifications);

            setIsLoading(false);
        }, 1500);

        return () => {
            if (typeof window !== 'undefined' && window.ethereum) {
                const ethereum = window.ethereum as EthereumProvider;
                ethereum.removeListener('accountsChanged', handleAccountsChanged);
                ethereum.removeListener('chainChanged', handleChainChanged);
            }
            clearTimeout(timer);
        };
    }, [handleAccountsChanged, handleChainChanged, initEthereumProvider, mockNotifications]);

    const unreadNotificationsCount = notifications.filter(n => !n.read).length;

    const renderTabIcon = (tab: TabType) => {
        const isActive = activeTab === tab;
        const baseClass = `w-5 h-5 ${isActive ? 'text-[#FF5722]' : 'text-gray-600'}`;

        switch (tab) {
            case 'events':
                return <FiHeart className={baseClass} />;
            case 'tickets':
                return <IoTicket className={baseClass} />;
            case 'notifications':
                return <FiBell className={baseClass} />;
            case 'settings':
                return <FiSettings className={baseClass} />;
            default:
                return null;
        }
    };

    interface StatCardProps {
        icon: React.ReactNode;
        value: number | string;
        label: string;
    }

    const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => (
        <div className="bg-gray-50 hover:bg-gray-100 transition-all duration-300 rounded-xl p-3 flex items-center gap-3 min-w-32 cursor-pointer group hover:shadow-md hover:-translate-y-1 transform">
            <div className="h-12 w-12 rounded-full bg-[#FF5722]/10 flex items-center justify-center group-hover:bg-[#FF5722]/20 transition-colors">
                {icon}
            </div>
            <div>
                <p className="text-xl font-bold text-gray-800 group-hover:text-[#FF5722] transition-colors">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Header />

            <main className="container mx-auto px-4 py-6 pt-24 pb-28 max-w-6xl">

                {isLoading ? (
                    <ProfileSkeleton />
                ) : (
                    <div className="relative mb-8">
                        {/* Integrated card with consistent border radius */}
                        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
                            {/* Cover Image Section */}
                            <div className="relative h-40 sm:h-48 bg-gray-200 rounded-t-3xl overflow-hidden">
                                {/* Cover Image */}
                                {currentUser?.coverImage ? (
                                    <Image
                                        src={currentUser.coverImage as string}
                                        alt="Cover"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#FF5722]/90 to-[#FF9800]/80">
                                        {/* Background pattern */}
                                        <div className="absolute inset-0 opacity-10">
                                            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                                <defs>
                                                    <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                                                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="1" />
                                                    </pattern>
                                                </defs>
                                                <rect width="100%" height="100%" fill="url(#smallGrid)" />
                                            </svg>
                                        </div>

                                        {/* Decorative elements */}
                                        <div className="absolute right-8 bottom-12 text-white opacity-20 transform rotate-12">
                                            <svg width="56" height="56" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                            </svg>
                                        </div>
                                        <div className="absolute left-12 top-10 text-white opacity-20 transform -rotate-15">
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                                            </svg>
                                        </div>
                                    </div>
                                )}

                                {/* Cover Image Upload Button */}
                                <button
                                    className="absolute top-4 right-4 bg-white/80 hover:bg-white shadow-md rounded-full p-2 backdrop-blur-sm group transition-all"
                                    onClick={() => {
                                        const uploadElement = document.getElementById('cover-image-upload');
                                        if (uploadElement) {
                                            uploadElement.click();
                                        }
                                    }}
                                >
                                    <FaCamera className="w-4 h-4 text-gray-700 group-hover:text-[#FF5722]" />
                                    <span className="sr-only">Upload cover image</span>
                                    <input
                                        type="file"
                                        id="cover-image-upload"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleCoverImageUpload}
                                    />
                                </button>
                            </div>

                            {/* Profile Image with External Status Indicator */}
                            <div className="relative mx-auto sm:mx-0 sm:ml-8 w-28 h-28 -mt-14 z-10">
                                <div className="relative h-full w-full rounded-full overflow-hidden border-4 border-white shadow-lg bg-white group">
                                    <Image
                                        src={currentUser?.image || '/images/placeholder-user.jpg'}
                                        alt={currentUser?.name || 'User'}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />

                                    {/* Profile Image Upload Button */}
                                    <div
                                        className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                                        onClick={() => {
                                            const uploadElement = document.getElementById('profile-image-upload');
                                            if (uploadElement) {
                                                uploadElement.click();
                                            }
                                        }}
                                    >
                                        <FaCamera className="w-6 h-6 text-white" />
                                        <span className="sr-only">Upload profile picture</span>
                                        <input
                                            type="file"
                                            id="profile-image-upload"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleProfileImageUpload}
                                        />
                                    </div>
                                </div>

                                {/* External Status Indicators */}
                                {currentUser?.verified && (
                                    <div className="absolute bottom-1 right-1 bg-[#FF5722] rounded-full h-7 w-7 flex items-center justify-center border-2 border-white shadow-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}

                                {/* Online Status Indicator (separate from verification) */}
                                <div className="absolute top-1 right-1 bg-green-500 rounded-full h-4 w-4 border-2 border-white shadow-sm"></div>
                            </div>

                            {/* User Info - Integrated with cover image - properly respecting parent's border radius */}
                            <div className="p-6 sm:pl-40 sm:-mt-10 rounded-b-3xl">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-800">{currentUser?.name}</h1>
                                        <p className="text-gray-500 flex items-center gap-1.5 mt-1">
                                            <span>@{currentUser?.username}</span>
                                            {walletAddress && (
                                                <>
                                                    <span className="text-gray-300">•</span>
                                                    <div className="inline-flex bg-gray-100 text-gray-700 rounded-full px-2 py-0.5 text-xs font-medium items-center gap-1 cursor-pointer hover:bg-gray-200 transition-all" onClick={copyWalletAddress}>
                                                        <FaEthereum className="text-[#627EEA] text-xs" />
                                                        <span className="truncate max-w-[80px]">
                                                            {walletAddress && `${walletAddress.substring(0, 4)}...${walletAddress.substring(walletAddress.length - 4)}`}
                                                        </span>
                                                        {walletCopied ? (
                                                            <FiCheck className="w-3 h-3 text-green-500" />
                                                        ) : (
                                                            <FiCopy className="w-3 h-3" />
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </p>
                                    </div>

                                    <div className="flex gap-2 mt-4 sm:mt-0">
                                        <button className="bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 flex items-center justify-center gap-1.5 hover:shadow transform hover:-translate-y-0.5">
                                            <FiEdit2 className="w-4 h-4" />
                                            <span>Edit Profile</span>
                                        </button>

                                        {!isWalletConnected ? (
                                            <button
                                                onClick={handleConnectWallet}
                                                disabled={isWalletConnecting}
                                                className={`bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 flex items-center justify-center gap-1.5 hover:shadow transform hover:-translate-y-0.5 ${isWalletConnecting ? 'opacity-75 cursor-not-allowed' : ''}`}
                                            >
                                                {isWalletConnecting ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-gray-400 border-t-[#FF5722] rounded-full animate-spin"></div>
                                                        <span>Connecting...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaEthereum className="text-[#627EEA]" />
                                                        <span>Connect Wallet</span>
                                                    </>
                                                )}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={disconnectWallet}
                                                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 flex items-center justify-center gap-1.5 hover:shadow transform hover:-translate-y-0.5"
                                            >
                                                <FiLogOut className="w-4 h-4" />
                                                <span>Disconnect</span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <p className="text-gray-700 mb-4">{currentUser?.bio}</p>

                                    <div className="flex flex-wrap gap-2 mb-5">
                                        {currentUser?.interests.map((interest, index) => (
                                            <span
                                                key={index}
                                                className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full transition-all hover:bg-[#FF5722]/10 hover:text-[#FF5722] cursor-pointer inline-flex items-center"
                                            >
                                                #{interest}
                                            </span>
                                        ))}
                                    </div>

                                    {/* User Stats Cards */}
                                    <div className="flex flex-wrap justify-start gap-3 mt-6">
                                        <StatCard
                                            icon={<FiUser className="h-6 w-6 text-[#FF5722]" />}
                                            value={currentUser?.followers || 0}
                                            label="Followers"
                                        />

                                        <StatCard
                                            icon={<FiUser className="h-6 w-6 text-[#FF5722]" />}
                                            value={currentUser?.following || 0}
                                            label="Following"
                                        />

                                        <StatCard
                                            icon={<FiCalendar className="h-6 w-6 text-[#FF5722]" />}
                                            value={currentUser?.attendedEvents?.length || 0}
                                            label="Events"
                                        />

                                        {walletBalance && (
                                            <StatCard
                                                icon={<FaEthereum className="h-6 w-6 text-[#627EEA]" />}
                                                value={`${walletBalance} ETH`}
                                                label={getChainName(chainId)}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-full p-1.5 shadow-sm border border-gray-100 flex mb-6 overflow-x-auto hide-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2.5 rounded-full flex-1 text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 relative ${activeTab === tab
                                ? 'bg-[#FF5722] text-white shadow-md'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {renderTabIcon(tab)}
                            <span className="capitalize">{tab}</span>
                            {tab === 'notifications' && unreadNotificationsCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                                    {unreadNotificationsCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="transition-opacity duration-300">
                    {activeTab === 'events' && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="flex border-b border-gray-200 mb-6">
                                <button
                                    onClick={() => setActiveSubTab('saved')}
                                    className={`px-6 py-3 font-medium transition-colors ${activeSubTab === 'saved' ? 'text-[#FF5722] border-b-2 border-[#FF5722]' : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Saved Events
                                </button>
                                <button
                                    onClick={() => setActiveSubTab('attended')}
                                    className={`px-6 py-3 font-medium transition-colors ${activeSubTab === 'attended' ? 'text-[#FF5722] border-b-2 border-[#FF5722]' : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    Attended Events
                                </button>
                            </div>

                            {activeSubTab === 'saved' && (
                                <>
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
                                        <div className="bg-white rounded-xl p-8 text-center border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                                            <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                                <FiHeart className="h-8 w-8 text-[#FF5722]" />
                                            </div>
                                            <h3 className="text-xl font-semibold mb-2 text-gray-800">No saved events</h3>
                                            <p className="text-gray-600 mb-6">Find and save events that interest you.</p>
                                            <Link
                                                href="/"
                                                className="bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-full px-6 py-2 font-medium inline-block shadow-sm transition-colors hover:shadow-md transform hover:translate-y-[-1px]"
                                            >
                                                Discover Events
                                            </Link>
                                        </div>
                                    )}
                                </>
                            )}

                            {activeSubTab === 'attended' && (
                                <>
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
                                        <div className="bg-white rounded-xl p-8 text-center border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                                            <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                                <FiCalendar className="h-8 w-8 text-[#FF5722]" />
                                            </div>
                                            <h3 className="text-xl font-semibold mb-2 text-gray-800">No attended events</h3>
                                            <p className="text-gray-600 mb-6">Purchase tickets to events to see them here.</p>
                                            <Link
                                                href="/"
                                                className="bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-full px-6 py-2 font-medium inline-block shadow-sm transition-colors hover:shadow-md transform hover:translate-y-[-1px]"
                                            >
                                                Find Events
                                            </Link>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === 'tickets' && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-800">Your Tickets</h2>
                                <div className="flex gap-2">
                                    <button className="text-sm text-gray-700 px-4 py-1.5 rounded-full bg-white border border-gray-200 flex items-center gap-1.5 hover:shadow-sm transition-all hover:bg-gray-50">
                                        <FiRefreshCcw className="w-4 h-4" />
                                        <span>Refresh</span>
                                    </button>
                                    <button className="text-sm text-white px-4 py-1.5 rounded-full bg-[#FF5722] flex items-center gap-1.5 hover:bg-[#E64A19] transition-colors shadow-sm hover:shadow hover:-translate-y-0.5 transform">
                                        <FiExternalLink className="w-4 h-4" />
                                        <span>View in Wallet</span>
                                    </button>
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="h-36 rounded-xl bg-gray-200 animate-shimmer"></div>
                                    ))}
                                </div>
                            ) : tickets.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {tickets.map((ticket) => {
                                        const event = getEventById(ticket.eventId);
                                        if (!event) return null;

                                        return (
                                            <Link key={ticket.id} href={`/tickets?selected=${ticket.id}`}>
                                                <div className="relative h-36 flex rounded-xl overflow-hidden border border-gray-200 hover:border-[#FF5722] group transition-all bg-white shadow-sm hover:shadow-md transform hover:-translate-y-1">
                                                    <div className="w-1/3 relative">
                                                        <Image
                                                            src={event.image}
                                                            alt={event.title}
                                                            fill
                                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                        />
                                                        {ticket.isNft && (
                                                            <div className="absolute top-2 left-2 bg-gradient-to-r from-[#FF5722] to-[#FF9800] text-white rounded-full px-2 py-0.5 text-xs font-bold shadow-md">
                                                                NFT
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="w-2/3 bg-white p-3 flex flex-col justify-between">
                                                        <div>
                                                            <h3 className="font-semibold line-clamp-1 text-gray-800 group-hover:text-[#FF5722] transition-colors">{event.title}</h3>
                                                            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                                                <FiCalendar className="h-3 w-3 text-[#FF5722]" />
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
                                                            <div className="bg-gray-100 rounded-full px-3 py-1 text-xs">
                                                                <span className="font-medium">{ticket.type}</span>
                                                            </div>
                                                            <div className="text-[#FF5722] font-bold flex items-center gap-1">
                                                                {ticket.isNft ? (
                                                                    <>
                                                                        <FaEthereum className="text-[#627EEA]" />
                                                                        <span>#{ticket.tokenId?.substring(0, 4) || ticket.id}</span>
                                                                    </>
                                                                ) : (
                                                                    <span>#{ticket.id}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="absolute h-full w-0 left-1/3 flex flex-col justify-between py-2">
                                                        <div className="h-3 w-3 rounded-full bg-white shadow-sm"></div>
                                                        {[...Array(8)].map((_, i) => (
                                                            <div key={i} className="h-1 w-1 rounded-full bg-white shadow-sm"></div>
                                                        ))}
                                                        <div className="h-3 w-3 rounded-full bg-white shadow-sm"></div>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl p-8 text-center border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                                    <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-[#FF5722]/10 flex items-center justify-center">
                                        <IoTicket className="h-8 w-8 text-[#FF5722]" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 text-gray-800">No tickets yet</h3>
                                    <p className="text-gray-600 mb-6">Purchase tickets to events to see them here.</p>
                                    <Link
                                        href="/"
                                        className="bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-full px-6 py-2 font-medium inline-block shadow-sm transition-colors hover:shadow-md transform hover:translate-y-[-1px]"
                                    >
                                        Discover Events
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
                                {notifications.some(n => !n.read) && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-sm text-[#FF5722] hover:text-[#E64A19] transition-colors font-medium"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>

                            {isLoading ? (
                                <div className="space-y-4">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="h-24 bg-gray-200 rounded-xl animate-shimmer" style={{ animationDelay: `${i * 0.1}s` }}></div>
                                    ))}
                                </div>
                            ) : notifications.length > 0 ? (
                                <div className="space-y-3">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`bg-white rounded-xl border transform transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer ${!notification.read ? 'border-[#FF5722]/20 bg-orange-50/30' : 'border-gray-200'}`}
                                            onClick={() => markAsRead(notification.id)}
                                        >
                                            <div className="p-4">
                                                <div className="flex gap-3">
                                                    <div className={`h-12 w-12 rounded-full flex-shrink-0 flex items-center justify-center ${!notification.read ? 'bg-[#FF5722]/10' : 'bg-gray-100'}`}>
                                                        {notification.type === 'event' && <FiCalendar className="h-5 w-5 text-[#FF5722]" />}
                                                        {notification.type === 'message' && <FiMessageSquare className="h-5 w-5 text-[#FF5722]" />}
                                                        {notification.type === 'system' && <FiAlertCircle className="h-5 w-5 text-[#FF5722]" />}
                                                        {notification.type === 'reminder' && <FiClock className="h-5 w-5 text-[#FF5722]" />}
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start">
                                                            <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-800'}`}>
                                                                {notification.title}
                                                            </h3>
                                                            <span className="text-xs text-gray-500 whitespace-nowrap ml-2 bg-gray-100 px-2 py-0.5 rounded-full">{notification.time}</span>
                                                        </div>

                                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.content}</p>

                                                        <div className="flex justify-between items-center mt-2">
                                                            <span className="text-xs font-medium px-2 py-0.5 rounded-full capitalize bg-opacity-10 inline-block"
                                                                style={{
                                                                    backgroundColor:
                                                                        notification.type === 'event' ? 'rgba(255, 87, 34, 0.1)' :
                                                                            notification.type === 'message' ? 'rgba(25, 118, 210, 0.1)' :
                                                                                notification.type === 'system' ? 'rgba(156, 39, 176, 0.1)' :
                                                                                    'rgba(76, 175, 80, 0.1)',
                                                                    color:
                                                                        notification.type === 'event' ? '#FF5722' :
                                                                            notification.type === 'message' ? '#1976D2' :
                                                                                notification.type === 'system' ? '#9C27B0' :
                                                                                    '#4CAF50'
                                                                }}>
                                                                {notification.type}
                                                            </span>

                                                            <Link
                                                                href={notification.link}
                                                                className="text-sm font-medium text-[#FF5722] hover:text-[#E64A19] transition-colors inline-flex items-center gap-1"
                                                            >
                                                                {notification.action}
                                                                <FiArrowRight className="w-3.5 h-3.5" />
                                                            </Link>
                                                        </div>
                                                    </div>

                                                    {!notification.read && (
                                                        <div className="h-3 w-3 rounded-full bg-[#FF5722] flex-shrink-0 mt-2"></div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="text-center py-4">
                                        <button className="text-gray-500 text-sm hover:text-[#FF5722] transition-colors font-medium inline-flex items-center gap-1.5 bg-white px-4 py-2 rounded-full shadow-sm hover:shadow">
                                            <span>Load more notifications</span>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl p-8 text-center border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                                    <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-[#FF5722]/10 flex items-center justify-center">
                                        <FaBell className="h-8 w-8 text-[#FF5722]" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 text-gray-800">No notifications</h3>
                                    <p className="text-gray-600 mb-6">You&apos;re all caught up!</p>
                                    <Link
                                        href="/"
                                        className="bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-full px-6 py-2 font-medium inline-block shadow-sm transition-colors hover:shadow-md transform hover:translate-y-[-1px]"
                                    >
                                        Explore Events
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="space-y-6 animate-fadeIn">
                            {isLoading ? (
                                <>
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="bg-gray-200 rounded-xl h-64 animate-shimmer" style={{ animationDelay: `${i * 0.2}s` }}></div>
                                    ))}
                                </>
                            ) : (
                                <>
                                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-xl font-semibold text-gray-800">Account Settings</h2>
                                            <div className="h-8 w-8 rounded-full bg-[#FF5722]/10 flex items-center justify-center">
                                                <FiUser className="h-4 w-4 text-[#FF5722]" />
                                            </div>
                                        </div>

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
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <span className="text-gray-500 sm:text-sm">@</span>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        id="username"
                                                        defaultValue={currentUser?.username}
                                                        className="w-full bg-white border border-gray-300 rounded-lg p-3 pl-8 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent"
                                                    />
                                                </div>
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

                                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
                                            <div className="h-8 w-8 rounded-full bg-[#FF5722]/10 flex items-center justify-center">
                                                <FiBell className="h-4 w-4 text-[#FF5722]" />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {['Event Reminders', 'When Friends Attend', 'New Events Near You', 'Price Drops'].map((notification, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
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

                                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                                        <div className="flex items-center justify-between mb-4">
                                            <h2 className="text-xl font-semibold text-gray-800">Wallet</h2>
                                            <div className="h-8 w-8 rounded-full bg-[#FF5722]/10 flex items-center justify-center">
                                                <FaEthereum className="h-4 w-4 text-[#627EEA]" />
                                            </div>
                                        </div>

                                        {walletError && (
                                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-red-700 flex items-center gap-2">
                                                <FiAlertCircle className="w-5 h-5 text-red-500" />
                                                <span>{walletError}</span>
                                            </div>
                                        )}

                                        {!isWalletConnected ? (
                                            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
                                                <div className="h-16 w-16 mb-4 rounded-full bg-[#627EEA]/10 flex items-center justify-center">
                                                    <FaEthereum className="h-8 w-8 text-[#627EEA]" />
                                                </div>
                                                <h3 className="text-lg font-semibold mb-2 text-gray-800">Connect Wallet</h3>
                                                <p className="text-gray-600 text-center mb-4 max-w-md">Connect your Web3 wallet to access NFT tickets and blockchain features.</p>
                                                <button
                                                    onClick={handleConnectWallet}
                                                    disabled={isWalletConnecting}
                                                    className={`bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-full px-6 py-2 font-medium shadow-sm transition-all duration-300 hover:shadow-md transform hover:translate-y-[-1px] flex items-center gap-2 ${isWalletConnecting ? 'opacity-75 cursor-not-allowed' : ''}`}
                                                >
                                                    {isWalletConnecting ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                            <span>Connecting...</span>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <FaEthereum />
                                                            <span>Connect Metamask</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
                                                    <div className="flex justify-between items-center py-2">
                                                        <span className="text-gray-600">Connected Wallet</span>
                                                        <div className="bg-white text-gray-700 rounded-full px-3 py-1.5 text-sm flex items-center gap-1 shadow-sm">
                                                            <span className="h-2 w-2 rounded-full bg-green-400"></span>
                                                            <span className="font-medium truncate max-w-xs">
                                                                {`${walletAddress?.substring(0, 6)}...${walletAddress?.substring(walletAddress?.length - 4)}`}
                                                            </span>
                                                            <button onClick={copyWalletAddress} className="ml-1 hover:text-gray-900">
                                                                {walletCopied ? (
                                                                    <FiCheck className="w-4 h-4 text-green-500" />
                                                                ) : (
                                                                    <FiCopy className="w-4 h-4" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between items-center py-2">
                                                        <span className="text-gray-600">Network</span>
                                                        <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm">
                                                            <span className="h-2 w-2 rounded-full bg-green-400"></span>
                                                            <span className="text-gray-700">{getChainName(chainId)}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between items-center py-2">
                                                        <span className="text-gray-600">Balance</span>
                                                        <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm">
                                                            <FaEthereum className="text-[#627EEA] text-sm" />
                                                            <span className="text-gray-700 font-medium">{walletBalance} ETH</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between items-center py-2">
                                                        <span className="text-gray-600">NFT Tickets</span>
                                                        <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm">
                                                            <span className="text-gray-700 font-medium">{tickets.filter(t => t.isNft).length} Tickets</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={disconnectWallet}
                                                    className="w-full bg-white hover:bg-gray-50 border border-gray-300 transition-all duration-300 rounded-full py-2.5 text-sm text-gray-700 flex items-center justify-center gap-2 hover:shadow-sm"
                                                >
                                                    <FiLogOut className="w-4 h-4" />
                                                    Disconnect Wallet
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-end mt-6">
                                        <button className="bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-full px-8 py-3 font-medium shadow-sm transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 flex items-center gap-2">
                                            <FiCheck className="w-5 h-5" />
                                            Save Changes
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <BottomNavigation />

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
                
                .line-clamp-1 {
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }

                .hide-scrollbar {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }
                
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
}