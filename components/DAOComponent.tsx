/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiChevronRight, FiUsers, FiArchive, FiBarChart2,
    FiCheckCircle, FiClock, FiTrendingUp, FiCheck,
    FiX, FiExternalLink, FiCalendar, FiActivity,
    FiThumbsUp, FiThumbsDown, FiAlertCircle, FiInfo,
    FiCopy, FiArrowUpRight, FiShare2, FiEye
} from 'react-icons/fi';
import { IoRocket, IoWallet } from 'react-icons/io5';
import { BsThreeDots } from 'react-icons/bs';

// Mock data types
interface TokenInfo {
    symbol: string;
    name: string;
    totalSupply: number;
    marketCap: string;
    circulatingSupply: number;
    price: string;
    priceChange24h: number;
    logoUrl: string;
}

interface Proposal {
    id: string;
    title: string;
    description: string;
    proposer: string;
    proposerAvatar: string;
    status: 'active' | 'passed' | 'rejected' | 'pending';
    startDate: string;
    endDate: string;
    votesFor: number;
    votesAgainst: number;
    totalVotes: number;
    category: 'governance' | 'treasury' | 'social' | 'event' | 'protocol';
    categoryColor: string;
}

interface TreasuryAsset {
    symbol: string;
    name: string;
    amount: number;
    value: string;
    logoUrl: string;
}

interface ActivityItem {
    id: string;
    type: 'proposal' | 'vote' | 'distribution' | 'treasury';
    title: string;
    description: string;
    date: string;
    user: string;
    userAvatar: string;
}

export default function DAOComponent() {
    // State management
    const [activeTab, setActiveTab] = useState('overview');
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [selectedProposal, setSelectedProposal] = useState<string | null>(null);
    const [showVoteConfirmation, setShowVoteConfirmation] = useState(false);
    const [voteType, setVoteType] = useState<'for' | 'against' | null>(null);
    const [treasuryValue, setTreasuryValue] = useState('$1,245,678');
    const [isLoadingWallet, setIsLoadingWallet] = useState(false);
    const [copiedToClipboard, setCopiedToClipboard] = useState(false);

    const modalRef = useRef<HTMLDivElement>(null);

    // Mock token data
    const tokenInfo: TokenInfo = {
        symbol: 'ROVI',
        name: 'Rovify Token',
        totalSupply: 100000000,
        marketCap: '$24,580,000',
        circulatingSupply: 45000000,
        price: '$0.546',
        priceChange24h: 3.2,
        logoUrl: '/images/contents/rovi-logo.png',
    };

    // Mock treasury assets
    const treasuryAssets: TreasuryAsset[] = [
        {
            symbol: 'ETH',
            name: 'Ethereum',
            amount: 120.45,
            value: '$256,780',
            logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
        },
        {
            symbol: 'USDC',
            name: 'USD Coin',
            amount: 450000,
            value: '$450,000',
            logoUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
        },
        {
            symbol: 'ROVI',
            name: 'Rovify Token',
            amount: 980000,
            value: '$538,898',
            logoUrl: '/images/contents/rovi-logo.png',
        },
    ];

    // Mock proposals
    const proposals: Proposal[] = [
        {
            id: 'prop-001',
            title: 'Increase Event Creator Rewards',
            description: 'Proposal to increase the reward allocation for event creators from 2% to 3.5% of platform revenue to incentivize more high-quality events.',
            proposer: '0x7Fc66...1D2a',
            proposerAvatar: '/images/avatars/avatar-1.jpg',
            status: 'active',
            startDate: '2025-05-10',
            endDate: '2025-05-17',
            votesFor: 1250000,
            votesAgainst: 450000,
            totalVotes: 1700000,
            category: 'governance',
            categoryColor: 'bg-purple-500',
        },
        {
            id: 'prop-002',
            title: 'Add Support for Solana Chain',
            description: 'Expanding our platform to support Solana blockchain for events and NFT tickets to reduce gas fees and increase transaction speed.',
            proposer: '0x3Ab55...F78c',
            proposerAvatar: '/images/avatars/avatar-2.jpg',
            status: 'passed',
            startDate: '2025-04-28',
            endDate: '2025-05-05',
            votesFor: 2100000,
            votesAgainst: 350000,
            totalVotes: 2450000,
            category: 'protocol',
            categoryColor: 'bg-blue-500',
        },
        {
            id: 'prop-003',
            title: 'Fund Berlin NFT Conference',
            description: 'Allocate 15,000 USDC from treasury to sponsor the upcoming Berlin NFT Conference to increase platform visibility.',
            proposer: '0x9Dc33...A1e5',
            proposerAvatar: '/images/avatars/avatar-3.jpg',
            status: 'active',
            startDate: '2025-05-12',
            endDate: '2025-05-19',
            votesFor: 890000,
            votesAgainst: 910000,
            totalVotes: 1800000,
            category: 'treasury',
            categoryColor: 'bg-green-500',
        },
        {
            id: 'prop-004',
            title: 'Community Creator Grant Program',
            description: 'Establish a quarterly grant program of 50,000 ROVI tokens to fund innovative community-led event concepts.',
            proposer: '0x5Fa88...B3c7',
            proposerAvatar: '/images/avatars/avatar-4.jpg',
            status: 'pending',
            startDate: '2025-05-20',
            endDate: '2025-05-27',
            votesFor: 0,
            votesAgainst: 0,
            totalVotes: 0,
            category: 'social',
            categoryColor: 'bg-yellow-500',
        },
        {
            id: 'prop-005',
            title: 'Exclusive NFT Series for DAO Members',
            description: 'Create a limited edition NFT series available only to DAO members who have staked at least 1000 ROVI tokens.',
            proposer: '0x2Bd99...E4f8',
            proposerAvatar: '/images/avatars/avatar-5.jpg',
            status: 'rejected',
            startDate: '2025-04-15',
            endDate: '2025-04-22',
            votesFor: 780000,
            votesAgainst: 1320000,
            totalVotes: 2100000,
            category: 'event',
            categoryColor: 'bg-red-500',
        },
    ];

    // Mock activity feed
    const activityFeed: ActivityItem[] = [
        {
            id: 'act-001',
            type: 'proposal',
            title: 'New Proposal Created',
            description: 'Proposal "Exclusive NFT Series for DAO Members" has been submitted for voting.',
            date: '1 day ago',
            user: '0x2Bd99...E4f8',
            userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974&auto=format&fit=crop',
        },
        {
            id: 'act-002',
            type: 'vote',
            title: 'Proposal Passed',
            description: 'Proposal "Add Support for Solana Chain" has been approved with 85.7% of votes.',
            date: '2 days ago',
            user: 'Governance Bot',
            userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974&auto=format&fit=crop',
        },
        {
            id: 'act-003',
            type: 'treasury',
            title: 'Treasury Transaction',
            description: '15,000 USDC allocated for sponsoring ETHGlobal hackathon.',
            date: '3 days ago',
            user: 'Treasury Multisig',
            userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974&auto=format&fit=crop',
        },
        {
            id: 'act-004',
            type: 'distribution',
            title: 'Token Distribution',
            description: '250,000 ROVI tokens distributed to event creators as rewards.',
            date: '5 days ago',
            user: 'Distribution Bot',
            userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1974&auto=format&fit=crop',
        },
    ];

    // Find the currently selected proposal
    const currentProposal = proposals.find(p => p.id === selectedProposal);

    // Handle clicking outside of modal
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setSelectedProposal(null);
                setShowVoteConfirmation(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Handle copy to clipboard
    const handleCopyAddress = () => {
        // Mock wallet address
        navigator.clipboard.writeText("0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9");
        setCopiedToClipboard(true);
        setTimeout(() => setCopiedToClipboard(false), 2000);
    };

    // Handle connect wallet
    const handleConnectWallet = async () => {
        setIsLoadingWallet(true);
        // Simulate wallet connection delay
        setTimeout(() => {
            setIsWalletConnected(true);
            setIsLoadingWallet(false);
        }, 1500);
    };

    // Handle disconnect wallet
    const handleDisconnectWallet = () => {
        setIsWalletConnected(false);
    };

    // Handle vote submission
    const handleVoteSubmit = () => {
        // Here you would submit the vote to the blockchain
        console.log(`Voted ${voteType} on proposal ${selectedProposal}`);
        setShowVoteConfirmation(true);
    };

    // Format large numbers with commas
    const formatNumber = (num: number): string => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    // Calculate vote percentage
    const calculateVotePercentage = (proposal: Proposal, type: 'for' | 'against'): number => {
        if (proposal.totalVotes === 0) return 0;
        return type === 'for'
            ? (proposal.votesFor / proposal.totalVotes) * 100
            : (proposal.votesAgainst / proposal.totalVotes) * 100;
    };

    // Get status color
    const getStatusColor = (status: Proposal['status']): string => {
        switch (status) {
            case 'active': return 'bg-blue-500';
            case 'passed': return 'bg-green-500';
            case 'rejected': return 'bg-red-500';
            case 'pending': return 'bg-gray-500';
            default: return 'bg-gray-500';
        }
    };

    // Get status text
    const getStatusText = (status: Proposal['status']): string => {
        switch (status) {
            case 'active': return 'Active';
            case 'passed': return 'Passed';
            case 'rejected': return 'Rejected';
            case 'pending': return 'Pending';
            default: return 'Unknown';
        }
    };

    // Format date
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Calculate days remaining
    const getDaysRemaining = (endDate: string): number => {
        const end = new Date(endDate);
        const now = new Date();
        const diffTime = end.getTime() - now.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            {/* DAO Header */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Rovify DAO</h1>
                        <p className="text-gray-600 mt-1">Decentralized governance for the future of events</p>
                    </div>

                    {/* Connect Wallet Button */}
                    {/* {!isWalletConnected ? (
                        <motion.button
                            onClick={handleConnectWallet}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-[#FF5722] text-white font-medium py-3 px-5 rounded-xl shadow-sm flex items-center justify-center gap-2 w-full md:w-auto"
                            disabled={isLoadingWallet}
                        >
                            {isLoadingWallet ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Connecting...</span>
                                </>
                            ) : (
                                <>
                                    <IoWallet className="w-5 h-5" />
                                    <span>Connect Wallet</span>
                                </>
                            )}
                        </motion.button>
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="bg-white border border-gray-200 rounded-xl py-2 px-4 flex items-center shadow-sm">
                                <div className="flex items-center">
                                    <div className="w-6 h-6 rounded-full bg-[#FF5722]/20 flex items-center justify-center mr-2">
                                        <Image
                                            src="/images/contents/rovi-logo.png"
                                            alt="ROVI"
                                            width={16}
                                            height={16}
                                            className="rounded-full"
                                        />
                                    </div>
                                    <span className="font-medium text-gray-900">35,450 ROVI</span>
                                </div>
                            </div>
                            <div className="relative group">
                                <div className="bg-white border border-gray-200 rounded-xl py-2 px-4 flex items-center shadow-sm hover:bg-gray-50 transition-colors">
                                    <span className="text-gray-700 font-medium truncate max-w-[120px]">0x7Fc6...DDaE9</span>
                                    <span
                                        onClick={handleCopyAddress}
                                        className="ml-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                        role="button"
                                        tabIndex={0}
                                        onKeyPress={e => { if (e.key === 'Enter') handleCopyAddress(); }}
                                    >
                                        {copiedToClipboard ? (
                                            <FiCheck className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <FiCopy className="w-4 h-4" />
                                        )}
                                    </span>
                                    <span
                                        onClick={handleDisconnectWallet}
                                        className="ml-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                        role="button"
                                        tabIndex={0}
                                        onKeyPress={e => { if (e.key === 'Enter') handleDisconnectWallet(); }}
                                    >
                                        <FiX className="w-4 h-4" />
                                    </span>
                                </div>
                                {copiedToClipboard && (
                                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                                        Copied!
                                    </div>
                                )}
                            </div>
                        </div>
                    )} */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="bg-white border border-gray-200 rounded-xl py-2 px-4 flex items-center shadow-sm">
                            <div className="flex items-center">
                                <div className="w-6 h-6 rounded-full bg-[#FF5722]/20 flex items-center justify-center mr-2">
                                    <Image
                                        src="/images/contents/rovi-logo.png"
                                        alt="ROVI"
                                        width={16}
                                        height={16}
                                        className="rounded-full"
                                    />
                                </div>
                                <span className="font-medium text-gray-900">35,450 ROVI</span>
                            </div>
                        </div>
                        <div className="relative group">
                            <button className="bg-white border border-gray-200 rounded-xl py-2 px-4 flex items-center shadow-sm hover:bg-gray-50 transition-colors">
                                <span className="text-gray-700 font-medium truncate max-w-[120px]">0x7Fc6...DDaE9</span>
                                <button
                                    onClick={handleCopyAddress}
                                    className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {copiedToClipboard ? (
                                        <FiCheck className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <FiCopy className="w-4 h-4" />
                                    )}
                                </button>
                                <button
                                    onClick={handleDisconnectWallet}
                                    className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <FiX className="w-4 h-4" />
                                </button>
                            </button>
                            {copiedToClipboard && (
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                                    Copied!
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* DAO Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Treasury Value</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">{treasuryValue}</h3>
                                <p className="text-green-500 text-xs font-medium mt-1 flex items-center">
                                    <FiTrendingUp className="w-3 h-3 mr-1" />
                                    +5.3% this month
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <FiBarChart2 className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Members</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">3,782</h3>
                                <p className="text-green-500 text-xs font-medium mt-1 flex items-center">
                                    <FiTrendingUp className="w-3 h-3 mr-1" />
                                    +124 new this week
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <FiUsers className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Active Proposals</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">2</h3>
                                <p className="text-gray-500 text-xs font-medium mt-1 flex items-center">
                                    <FiClock className="w-3 h-3 mr-1" />
                                    1 ending soon
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                <FiArchive className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">ROVI Price</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">{tokenInfo.price}</h3>
                                <p className={`${tokenInfo.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'} text-xs font-medium mt-1 flex items-center`}>
                                    <FiTrendingUp className="w-3 h-3 mr-1" />
                                    {tokenInfo.priceChange24h >= 0 ? '+' : ''}{tokenInfo.priceChange24h}% (24h)
                                </p>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                                <Image
                                    src="/images/contents/rovi-logo.png"
                                    alt="ROVI"
                                    width={20}
                                    height={20}
                                    className="rounded-full"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* DAO Navigation Tabs */}
            <div className="mb-6 border-b border-gray-200">
                <div className="flex overflow-x-auto hide-scrollbar">
                    {['overview', 'proposals', 'treasury', 'activity'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-3 font-medium text-sm border-b-2 whitespace-nowrap ${activeTab === tab
                                ? 'border-[#FF5722] text-[#FF5722]'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                } transition-colors`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Overview Tab Content */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Active Proposals */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                <h3 className="font-semibold text-gray-900">Active Proposals</h3>
                                <Link href="#" onClick={() => setActiveTab('proposals')} className="text-[#FF5722] text-sm font-medium hover:underline">
                                    View All
                                </Link>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {proposals.filter(p => p.status === 'active').map((proposal) => (
                                    <div key={proposal.id} className="p-5 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start">
                                            <div className="flex-grow">
                                                <div className="flex items-center mb-1">
                                                    <span className={`inline-block w-2 h-2 rounded-full ${proposal.categoryColor} mr-2`}></span>
                                                    <span className="text-xs text-gray-500">{proposal.category.charAt(0).toUpperCase() + proposal.category.slice(1)}</span>
                                                    <span className="text-xs text-gray-400 mx-2">•</span>
                                                    <span className="text-xs text-gray-500">Ends in {getDaysRemaining(proposal.endDate)} days</span>
                                                </div>
                                                <h4 className="font-medium text-gray-900">{proposal.title}</h4>
                                                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{proposal.description}</p>

                                                {/* Vote Progress */}
                                                <div className="mt-3">
                                                    <div className="flex items-center justify-between text-xs mb-1">
                                                        <span className="text-green-600 font-medium">{formatNumber(proposal.votesFor)} For ({calculateVotePercentage(proposal, 'for').toFixed(1)}%)</span>
                                                        <span className="text-red-600 font-medium">{formatNumber(proposal.votesAgainst)} Against ({calculateVotePercentage(proposal, 'against').toFixed(1)}%)</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-green-500 rounded-full"
                                                            style={{ width: `${calculateVotePercentage(proposal, 'for')}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setSelectedProposal(proposal.id)}
                                                className="ml-4 px-3 py-1 text-xs font-medium text-[#FF5722] bg-[#FF5722]/10 rounded-full hover:bg-[#FF5722]/20 transition-colors"
                                            >
                                                Vote
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {proposals.filter(p => p.status === 'active').length === 0 && (
                                    <div className="p-6 text-center">
                                        <p className="text-gray-500">No active proposals at the moment</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                                <Link href="#" onClick={() => setActiveTab('activity')} className="text-[#FF5722] text-sm font-medium hover:underline">
                                    View All
                                </Link>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {activityFeed.slice(0, 3).map((activity) => (
                                    <div key={activity.id} className="p-5 hover:bg-gray-50 transition-colors">
                                        <div className="flex">
                                            <div className="flex-shrink-0 mr-4">
                                                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                                                    {activity.userAvatar ? (
                                                        <Image
                                                            src={activity.userAvatar}
                                                            alt={activity.user}
                                                            width={40}
                                                            height={40}
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                                            <span className="text-xs text-gray-600">{activity.user.charAt(0)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">{activity.title}</h4>
                                                <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
                                                <div className="flex items-center mt-2 text-xs text-gray-500">
                                                    <span>{activity.user}</span>
                                                    <span className="mx-2">•</span>
                                                    <span>{activity.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Token Info */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h3 className="font-semibold text-gray-900">Token Info</h3>
                            </div>
                            <div className="p-5">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 rounded-full bg-[#FF5722]/10 flex items-center justify-center mr-3">
                                        <Image
                                            src="/images/contents/rovi-logo.png"
                                            alt="ROVI"
                                            width={32}
                                            height={32}
                                            className="rounded-full"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">{tokenInfo.name}</h4>
                                        <p className="text-gray-500 text-sm">{tokenInfo.symbol}</p>
                                    </div>
                                    <div className="ml-auto">
                                        <Link href="#" className="text-[#FF5722] text-sm flex items-center hover:underline">
                                            <span>View</span>
                                            <FiExternalLink className="w-3 h-3 ml-1" />
                                        </Link>
                                    </div>
                                </div>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Price</span>
                                        <span className="font-medium text-gray-900">{tokenInfo.price}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Market Cap</span>
                                        <span className="font-medium text-gray-900">{tokenInfo.marketCap}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Circulating Supply</span>
                                        <span className="font-medium text-gray-900">{formatNumber(tokenInfo.circulatingSupply)} {tokenInfo.symbol}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Total Supply</span>
                                        <span className="font-medium text-gray-900">{formatNumber(tokenInfo.totalSupply)} {tokenInfo.symbol}</span>
                                    </div>
                                </div>

                                <div className="mt-5 pt-5 border-t border-gray-100">
                                    <h4 className="font-medium text-gray-900 mb-3">Utilities</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <FiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                            <span className="text-sm text-gray-600">Governance voting</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                            <span className="text-sm text-gray-600">Event creator rewards</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                            <span className="text-sm text-gray-600">Premium platform features</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                            <span className="text-sm text-gray-600">NFT ticket discounts</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* How to Participate */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h3 className="font-semibold text-gray-900">How to Participate</h3>
                            </div>
                            <div className="p-5">
                                <div className="space-y-4">
                                    <div className="flex">
                                        <div className="w-8 h-8 rounded-full bg-[#FF5722]/10 flex items-center justify-center mr-3 flex-shrink-0">
                                            <span className="text-[#FF5722] font-medium">1</span>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">Connect Wallet</h4>
                                            <p className="text-gray-600 text-sm mt-1">Connect your Web3 wallet to interact with the DAO</p>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className="w-8 h-8 rounded-full bg-[#FF5722]/10 flex items-center justify-center mr-3 flex-shrink-0">
                                            <span className="text-[#FF5722] font-medium">2</span>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">Acquire ROVI Tokens</h4>
                                            <p className="text-gray-600 text-sm mt-1">Get ROVI tokens through events, creator rewards, or exchanges</p>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className="w-8 h-8 rounded-full bg-[#FF5722]/10 flex items-center justify-center mr-3 flex-shrink-0">
                                            <span className="text-[#FF5722] font-medium">3</span>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">Vote on Proposals</h4>
                                            <p className="text-gray-600 text-sm mt-1">Cast your votes on active governance proposals</p>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className="w-8 h-8 rounded-full bg-[#FF5722]/10 flex items-center justify-center mr-3 flex-shrink-0">
                                            <span className="text-[#FF5722] font-medium">4</span>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">Submit Your Own Proposals</h4>
                                            <p className="text-gray-600 text-sm mt-1">Create proposals with 10,000+ ROVI tokens staked</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className="w-full mt-5 py-2.5 text-sm font-medium text-[#FF5722] border border-[#FF5722] rounded-lg hover:bg-[#FF5722]/5 transition-colors"
                                >
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Proposals Tab Content */}
            {activeTab === 'proposals' && (
                <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div className="flex items-center space-x-2">
                            <button className="bg-[#FF5722] text-white px-3 py-1.5 rounded-lg text-sm font-medium">All</button>
                            <button className="text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">Active</button>
                            <button className="text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">Passed</button>
                            <button className="text-gray-700 hover:bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">Rejected</button>
                        </div>

                        <button className="flex items-center gap-2 bg-[#FF5722] text-white px-4 py-2 rounded-lg text-sm font-medium">
                            <IoRocket className="w-4 h-4" />
                            <span>Create Proposal</span>
                        </button>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="divide-y divide-gray-100">
                            {proposals.map((proposal) => (
                                <div key={proposal.id} className="p-5 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start">
                                        <div className="flex-grow">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)} text-white`}>
                                                    {getStatusText(proposal.status)}
                                                </span>
                                                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${proposal.categoryColor} text-white`}>
                                                    {proposal.category.charAt(0).toUpperCase() + proposal.category.slice(1)}
                                                </span>
                                                {proposal.status === 'active' && (
                                                    <span className="text-xs text-gray-500 flex items-center">
                                                        <FiClock className="w-3 h-3 mr-1" />
                                                        Ends in {getDaysRemaining(proposal.endDate)} days
                                                    </span>
                                                )}
                                            </div>
                                            <h4 className="font-medium text-gray-900">{proposal.title}</h4>
                                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{proposal.description}</p>

                                            <div className="flex flex-wrap items-center text-xs text-gray-500 mt-3 gap-3">
                                                <span className="flex items-center">
                                                    <FiCalendar className="w-3 h-3 mr-1" />
                                                    {formatDate(proposal.startDate)} - {formatDate(proposal.endDate)}
                                                </span>
                                                <span className="flex items-center">
                                                    <FiUsers className="w-3 h-3 mr-1" />
                                                    {formatNumber(proposal.totalVotes)} votes
                                                </span>
                                                <span className="flex items-center">
                                                    <Image
                                                        src={proposal.proposerAvatar || '/images/avatars/avatar-default.jpg'}
                                                        alt={proposal.proposer}
                                                        width={16}
                                                        height={16}
                                                        className="rounded-full mr-1"
                                                    />
                                                    {proposal.proposer}
                                                </span>
                                            </div>

                                            {/* Vote Progress */}
                                            {proposal.totalVotes > 0 && (
                                                <div className="mt-3">
                                                    <div className="flex items-center justify-between text-xs mb-1">
                                                        <span className="text-green-600 font-medium">{formatNumber(proposal.votesFor)} For ({calculateVotePercentage(proposal, 'for').toFixed(1)}%)</span>
                                                        <span className="text-red-600 font-medium">{formatNumber(proposal.votesAgainst)} Against ({calculateVotePercentage(proposal, 'against').toFixed(1)}%)</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-green-500 rounded-full"
                                                            style={{ width: `${calculateVotePercentage(proposal, 'for')}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="ml-4 flex flex-col items-end">
                                            <button
                                                onClick={() => setSelectedProposal(proposal.id)}
                                                className={`px-4 py-2 text-sm font-medium rounded-lg ${proposal.status === 'active'
                                                    ? 'text-[#FF5722] bg-[#FF5722]/10 hover:bg-[#FF5722]/20'
                                                    : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                                                    } transition-colors min-w-[80px] text-center`}
                                            >
                                                {proposal.status === 'active' ? 'Vote' : 'View'}
                                            </button>

                                            {proposal.status === 'active' && (
                                                <span className="text-xs text-gray-500 mt-2">
                                                    {formatNumber(proposal.totalVotes)} votes cast
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Treasury Tab Content */}
            {activeTab === 'treasury' && (
                <div className="space-y-6">
                    {/* Treasury Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Value</h3>
                            <p className="text-3xl font-bold text-gray-900">{treasuryValue}</p>
                            <div className="flex items-center mt-2 text-sm">
                                <span className="text-green-500 flex items-center font-medium">
                                    <FiTrendingUp className="w-4 h-4 mr-1" />
                                    +5.3%
                                </span>
                                <span className="text-gray-500 ml-2">this month</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Assets</h3>
                            <p className="text-3xl font-bold text-gray-900">{treasuryAssets.length}</p>
                            <p className="text-gray-500 text-sm mt-2 flex items-center">
                                <FiInfo className="w-4 h-4 mr-1" />
                                Last transaction 2 days ago
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Multisig Signers</h3>
                            <p className="text-3xl font-bold text-gray-900">5/9</p>
                            <p className="text-gray-500 text-sm mt-2 flex items-center">
                                <FiInfo className="w-4 h-4 mr-1" />
                                5 confirmations required
                            </p>
                        </div>
                    </div>

                    {/* Treasury Assets */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-900">Treasury Assets</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Asset
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Value
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {treasuryAssets.map((asset) => (
                                        <tr key={asset.symbol} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden mr-3">
                                                        <Image
                                                            src={asset.logoUrl}
                                                            alt={asset.symbol}
                                                            width={32}
                                                            height={32}
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                                                        <div className="text-xs text-gray-500">{asset.symbol}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{asset.amount.toLocaleString()}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 font-medium">{asset.value}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                <button className="text-[#FF5722] hover:underline mr-3 items-center inline-flex">
                                                    <FiEye className="w-4 h-4 mr-1" />
                                                    <span>View</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
                            <button className="text-[#FF5722] text-sm font-medium hover:underline">
                                View All
                            </button>
                        </div>
                        <div className="divide-y divide-gray-100">
                            <div className="p-5 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-4">
                                        <FiArrowUpRight className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="font-medium text-gray-900">Treasury Distribution</h4>
                                        <p className="text-gray-600 text-sm mt-1">15,000 USDC allocated for sponsoring ETHGlobal hackathon</p>
                                        <div className="flex items-center mt-1 text-xs text-gray-500">
                                            <span>3 days ago</span>
                                            <span className="mx-2">•</span>
                                            <span className="flex items-center">
                                                <FiCheckCircle className="w-3 h-3 mr-1 text-green-500" />
                                                Confirmed
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-red-600 font-medium">-15,000 USDC</p>
                                        <Link href="#" className="text-xs text-[#FF5722] hover:underline mt-1 inline-block">
                                            View Transaction
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mr-4">
                                        <FiArrowUpRight className="w-5 h-5 text-green-600 transform rotate-180" />
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="font-medium text-gray-900">Platform Revenue</h4>
                                        <p className="text-gray-600 text-sm mt-1">Monthly platform revenue added to treasury</p>
                                        <div className="flex items-center mt-1 text-xs text-gray-500">
                                            <span>7 days ago</span>
                                            <span className="mx-2">•</span>
                                            <span className="flex items-center">
                                                <FiCheckCircle className="w-3 h-3 mr-1 text-green-500" />
                                                Confirmed
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-green-600 font-medium">+45,230 USDC</p>
                                        <Link href="#" className="text-xs text-[#FF5722] hover:underline mt-1 inline-block">
                                            View Transaction
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mr-4">
                                        <FiActivity className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="font-medium text-gray-900">Token Swap</h4>
                                        <p className="text-gray-600 text-sm mt-1">Converted ETH to USDC for operational expenses</p>
                                        <div className="flex items-center mt-1 text-xs text-gray-500">
                                            <span>10 days ago</span>
                                            <span className="mx-2">•</span>
                                            <span className="flex items-center">
                                                <FiCheckCircle className="w-3 h-3 mr-1 text-green-500" />
                                                Confirmed
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div>
                                            <p className="text-red-600 font-medium">-12.5 ETH</p>
                                            <p className="text-green-600 font-medium">+26,750 USDC</p>
                                        </div>
                                        <Link href="#" className="text-xs text-[#FF5722] hover:underline mt-1 inline-block">
                                            View Transaction
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Activity Tab Content */}
            {activeTab === 'activity' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900">Activity Feed</h3>
                        <div className="flex items-center gap-2">
                            <select className="text-sm border border-gray-200 rounded-lg py-2 px-3 bg-white">
                                <option>All Activities</option>
                                <option>Proposals</option>
                                <option>Votes</option>
                                <option>Treasury</option>
                            </select>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {[...activityFeed, ...activityFeed].map((activity, index) => (
                            <div key={`${activity.id}-${index}`} className="p-5 hover:bg-gray-50 transition-colors">
                                <div className="flex">
                                    <div className="flex-shrink-0 mr-4">
                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                                            {activity.userAvatar ? (
                                                <Image
                                                    src={activity.userAvatar}
                                                    alt={activity.user}
                                                    width={40}
                                                    height={40}
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                                    <span className="text-xs text-gray-600">{activity.user.charAt(0)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${activity.type === 'proposal' ? 'bg-purple-100 text-purple-800' :
                                                activity.type === 'vote' ? 'bg-blue-100 text-blue-800' :
                                                    activity.type === 'treasury' ? 'bg-green-100 text-green-800' :
                                                        'bg-orange-100 text-orange-800'
                                                }`}>
                                                {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                                            </span>
                                        </div>
                                        <h4 className="font-medium text-gray-900">{activity.title}</h4>
                                        <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
                                        <div className="flex items-center mt-2 text-xs text-gray-500">
                                            <span>{activity.user}</span>
                                            <span className="mx-2">•</span>
                                            <span>{activity.date}</span>
                                            <div className="ml-auto flex items-center">
                                                <button className="text-gray-400 hover:text-gray-600 p-1 transition-colors">
                                                    <FiShare2 className="w-4 h-4" />
                                                </button>
                                                <button className="text-gray-400 hover:text-gray-600 p-1 transition-colors ml-1">
                                                    <BsThreeDots className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Proposal Detail Modal */}
            <AnimatePresence>
                {selectedProposal && currentProposal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            ref={modalRef}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto"
                        >
                            {!showVoteConfirmation ? (
                                <>
                                    <div className="p-6 border-b border-gray-100">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(currentProposal.status)} text-white`}>
                                                        {getStatusText(currentProposal.status)}
                                                    </span>
                                                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${currentProposal.categoryColor} text-white`}>
                                                        {currentProposal.category.charAt(0).toUpperCase() + currentProposal.category.slice(1)}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-semibold text-gray-900">{currentProposal.title}</h3>
                                            </div>
                                            <button
                                                onClick={() => setSelectedProposal(null)}
                                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                <FiX className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-center mb-6">
                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                                                <Image
                                                    src={currentProposal.proposerAvatar}
                                                    alt={currentProposal.proposer}
                                                    width={40}
                                                    height={40}
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-gray-700 text-sm">Proposed by</p>
                                                <p className="font-medium text-gray-900">{currentProposal.proposer}</p>
                                            </div>
                                            <div className="ml-auto text-right">
                                                <p className="text-gray-700 text-sm">Voting Period</p>
                                                <p className="font-medium text-gray-900">
                                                    {formatDate(currentProposal.startDate)} - {formatDate(currentProposal.endDate)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                                            <p className="text-gray-700">{currentProposal.description}</p>
                                        </div>

                                        {/* Vote Progress */}
                                        <div className="mb-6">
                                            <h4 className="font-medium text-gray-900 mb-2">Current Results</h4>
                                            <div className="bg-gray-50 rounded-xl p-4">
                                                <div className="flex justify-between mb-2">
                                                    <div>
                                                        <p className="text-sm text-gray-500">For</p>
                                                        <p className="font-medium text-gray-900">{formatNumber(currentProposal.votesFor)} ROVI</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-500">Against</p>
                                                        <p className="font-medium text-gray-900">{formatNumber(currentProposal.votesAgainst)} ROVI</p>
                                                    </div>
                                                </div>

                                                <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden mb-2">
                                                    <div
                                                        className="h-full bg-green-500 rounded-full"
                                                        style={{ width: `${calculateVotePercentage(currentProposal, 'for')}%` }}
                                                    ></div>
                                                </div>

                                                <div className="flex justify-between text-sm">
                                                    <p className="text-green-600 font-medium">{calculateVotePercentage(currentProposal, 'for').toFixed(1)}%</p>
                                                    <p className="text-red-600 font-medium">{calculateVotePercentage(currentProposal, 'against').toFixed(1)}%</p>
                                                </div>

                                                <div className="mt-3 text-center">
                                                    <p className="text-sm text-gray-500">
                                                        {formatNumber(currentProposal.totalVotes)} votes cast • {getDaysRemaining(currentProposal.endDate)} days remaining
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Voting Actions */}
                                        {currentProposal.status === 'active' && isWalletConnected ? (
                                            <div className="mt-6 grid grid-cols-2 gap-4">
                                                <motion.button
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    onClick={() => setVoteType('for')}
                                                    className={`py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 ${voteType === 'for'
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                                                        } transition-colors`}
                                                >
                                                    <FiThumbsUp className="w-4 h-4" />
                                                    <span>Vote For</span>
                                                </motion.button>

                                                <motion.button
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    onClick={() => setVoteType('against')}
                                                    className={`py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 ${voteType === 'against'
                                                        ? 'bg-red-500 text-white'
                                                        : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                                                        } transition-colors`}
                                                >
                                                    <FiThumbsDown className="w-4 h-4" />
                                                    <span>Vote Against</span>
                                                </motion.button>
                                            </div>
                                        ) : currentProposal.status === 'active' ? (
                                            <div className="mt-6">
                                                <button
                                                    onClick={handleConnectWallet}
                                                    className="w-full py-3 bg-[#FF5722] text-white font-medium rounded-xl flex items-center justify-center gap-2"
                                                >
                                                    <IoWallet className="w-4 h-4" />
                                                    <span>Connect Wallet to Vote</span>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="mt-6">
                                                <div className={`w-full py-3 ${currentProposal.status === 'passed' ? 'bg-green-50 text-green-700' :
                                                    currentProposal.status === 'rejected' ? 'bg-red-50 text-red-700' :
                                                        'bg-gray-50 text-gray-700'
                                                    } font-medium rounded-xl flex items-center justify-center gap-2`}>
                                                    {currentProposal.status === 'passed' ? (
                                                        <>
                                                            <FiCheckCircle className="w-4 h-4" />
                                                            <span>Proposal Passed</span>
                                                        </>
                                                    ) : currentProposal.status === 'rejected' ? (
                                                        <>
                                                            <FiX className="w-4 h-4" />
                                                            <span>Proposal Rejected</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FiClock className="w-4 h-4" />
                                                            <span>Voting Not Started</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {voteType && currentProposal.status === 'active' && (
                                            <div className="mt-6">
                                                <button
                                                    onClick={handleVoteSubmit}
                                                    className="w-full py-3 bg-[#FF5722] text-white font-medium rounded-xl hover:bg-[#E64A19] transition-colors"
                                                >
                                                    Submit Vote
                                                </button>
                                                <p className="text-xs text-gray-500 text-center mt-2">
                                                    You are voting with 35,450 ROVI tokens
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="p-6 text-center">
                                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                        <FiCheck className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Vote Submitted!</h3>
                                    <p className="text-gray-600 mb-6">
                                        Your vote has been successfully submitted to the blockchain.
                                    </p>
                                    <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-sm text-gray-500">Proposal</p>
                                            <p className="text-sm font-medium text-gray-900">{currentProposal.title}</p>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-sm text-gray-500">Vote</p>
                                            <p className={`text-sm font-medium ${voteType === 'for' ? 'text-green-600' : 'text-red-600'}`}>
                                                {voteType === 'for' ? 'For' : 'Against'}
                                            </p>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm text-gray-500">Voting Power</p>
                                            <p className="text-sm font-medium text-gray-900">35,450 ROVI</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelectedProposal(null);
                                            setShowVoteConfirmation(false);
                                            setVoteType(null);
                                        }}
                                        className="w-full py-3 bg-[#FF5722] text-white font-medium rounded-xl hover:bg-[#E64A19] transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Global Styles */}
            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
}