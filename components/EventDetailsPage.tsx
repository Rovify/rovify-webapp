/* eslint-disable @typescript-eslint/no-unused-vars */
// components/EventDetailsPage.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { getEventById } from '@/mocks/data/events';
import { getUsersByEvent } from '@/mocks/data/users';
import { getTicketsByEvent } from '@/mocks/data/tickets';
import { Event, User, Ticket } from '@/types';
import {
    FiArrowLeft, FiShare2, FiHeart, FiCalendar, FiMapPin, FiInfo, FiTag, FiUser, FiGlobe,
    FiChevronRight, FiPlus, FiUsers, FiClock, FiCheck, FiStar
} from 'react-icons/fi';
import { FaLink } from "react-icons/fa";
import { FaDollarSign } from "react-icons/fa";
import { LuTicketCheck } from "react-icons/lu";
import { IoMdFlash } from "react-icons/io";
import BottomNavigation from './BottomNavigation';

interface EventDetailsPageProps {
    id: string;
}

export default function EventDetailsPage({ id }: EventDetailsPageProps) {
    const router = useRouter();
    const mainContainerRef = useRef<HTMLDivElement>(null);
    const heroImageRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);

    // For parallax and scroll animations
    const { scrollY } = useScroll();
    const parallaxY = useTransform(scrollY, [0, 500], [0, 200]);
    const springParallaxY = useSpring(parallaxY, { stiffness: 100, damping: 30 });
    const opacity = useTransform(scrollY, [0, 200, 300], [1, 0.5, 0]);
    const headerOpacity = useTransform(scrollY, [0, 100], [0, 1]);
    const scale = useTransform(scrollY, [0, 100], [1, 1.1]);

    const [event, setEvent] = useState<Event | null>(null);
    const [attendees, setAttendees] = useState<User[]>([]);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [activeTab, setActiveTab] = useState<'details' | 'tickets' | 'attendees'>('details');
    const [isLoading, setIsLoading] = useState(true);
    const [isHeaderTransparent, setIsHeaderTransparent] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [animatedTicket, setAnimatedTicket] = useState<string | null>(null);
    const [showShareOptions, setShowShareOptions] = useState(false);
    const [activeSocialOption, setActiveSocialOption] = useState<string | null>(null);

    // Add state for interactive elements
    const [selectedTicketType, setSelectedTicketType] = useState<string | null>(null);
    const [ticketCount, setTicketCount] = useState(1);
    const [showConfetti, setShowConfetti] = useState(false);

    // Header transparency based on scroll
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setIsHeaderTransparent(scrollY < 60);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch event data
    useEffect(() => {
        if (id) {
            // Simulate API fetch
            const timer = setTimeout(() => {
                const fetchedEvent = getEventById(id);
                if (fetchedEvent) {
                    setEvent(fetchedEvent);
                    setAttendees(getUsersByEvent(fetchedEvent.id));
                    setTickets(getTicketsByEvent(fetchedEvent.id));
                }
                setIsLoading(false);
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [id]);

    // Handle ticket selection animation
    const handleTicketClick = (ticketId: string) => {
        setSelectedTicketType(ticketId);
        setAnimatedTicket(ticketId);
        setTimeout(() => setAnimatedTicket(null), 700);
    };

    // Handle buying ticket
    const handleBuyTicket = () => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);

        // In a real app, this would initiate the checkout process
        console.log('Buying ticket:', selectedTicketType, 'Quantity:', ticketCount);
    };

    // Calculate ticket availability percentage
    const ticketAvailabilityPercent = event ?
        Math.min(100, Math.round((event.soldTickets / event.totalTickets) * 100)) : 0;

    // Format date and time helper function
    const formatDateTime = (date: Date) => {
        return {
            date: format(new Date(date), 'EEEE, MMMM d, yyyy'),
            time: format(new Date(date), 'h:mm a')
        };
    };

    return (
        <div ref={mainContainerRef} className="min-h-screen bg-gray-50 pb-20 overflow-x-hidden">
            {/* Transparent Header that becomes opaque on scroll */}
            <motion.header
                ref={headerRef}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300`}
                style={{
                    backgroundColor: isHeaderTransparent ? 'transparent' : 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: isHeaderTransparent ? 'none' : 'blur(10px)',
                    boxShadow: isHeaderTransparent ? 'none' : '0 2px 10px rgba(0,0,0,0.05)'
                }}
            >
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <motion.button
                        onClick={() => router.back()}
                        className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${isHeaderTransparent
                            ? 'bg-white/30 backdrop-blur-md text-white'
                            : 'bg-white shadow-neumorph-sm text-gray-700 hover:bg-gray-100'
                            }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FiArrowLeft className="w-5 h-5" />
                    </motion.button>

                    <div className="flex items-center gap-2">
                        <motion.button
                            onClick={() => setIsLiked(!isLiked)}
                            className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${isHeaderTransparent
                                ? 'bg-white/30 backdrop-blur-md text-white'
                                : 'bg-white shadow-neumorph-sm text-gray-700 hover:bg-gray-100'
                                } ${isLiked ? 'text-[#FF5722]' : ''}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FiHeart
                                className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`}
                            />
                            {isLiked && (
                                <motion.div
                                    className="absolute inset-0 rounded-full"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: [1, 1.5, 1] }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="absolute inset-0 bg-[#FF5722]/10 rounded-full animate-ping-short"></div>
                                </motion.div>
                            )}
                        </motion.button>

                        <div className="relative">
                            <motion.button
                                onClick={() => setShowShareOptions(!showShareOptions)}
                                className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${isHeaderTransparent
                                    ? 'bg-white/30 backdrop-blur-md text-white'
                                    : 'bg-white shadow-neumorph-sm text-gray-700 hover:bg-gray-100'
                                    }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FiShare2 className="w-5 h-5" />
                            </motion.button>

                            {/* Share Options Dropdown */}
                            <AnimatePresence>
                                {showShareOptions && (
                                    <motion.div
                                        className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg p-2 w-52"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {[
                                            { id: 'twitter', label: 'Twitter', color: '#1DA1F2' },
                                            { id: 'facebook', label: 'Facebook', color: '#4267B2' },
                                            { id: 'whatsapp', label: 'WhatsApp', color: '#25D366' },
                                            { id: 'email', label: 'Email', color: '#D44638' },
                                            { id: 'copy', label: 'Copy Link', color: '#FF5722' }
                                        ].map((option) => (
                                            <motion.button
                                                key={option.id}
                                                className="flex items-center gap-3 w-full px-3 py-2 text-left text-sm hover:bg-gray-50 rounded-lg"
                                                onClick={() => {
                                                    setActiveSocialOption(option.id);
                                                    setTimeout(() => {
                                                        setActiveSocialOption(null);
                                                        setShowShareOptions(false);
                                                    }, 500);
                                                }}
                                                whileHover={{ x: 5 }}
                                            >
                                                <span
                                                    className="w-6 h-6 rounded-full flex items-center justify-center text-white"
                                                    style={{ backgroundColor: option.color }}
                                                >
                                                    {option.id === 'copy' ?
                                                        (activeSocialOption === 'copy' ? <FiCheck className="w-3 h-3" /> : <FaLink className="w-3 h-3" />) :
                                                        option.label.charAt(0)
                                                    }
                                                </span>
                                                <span className="text-gray-700">
                                                    {activeSocialOption === option.id && option.id === 'copy' ?
                                                        'Copied!' : option.label
                                                    }
                                                </span>
                                            </motion.button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Animated title on scroll - appears when hero title disappears */}
                {event && (
                    <motion.div
                        className="w-full h-10 flex items-center justify-center overflow-hidden"
                        style={{ opacity: headerOpacity }}
                        initial={{ height: 0 }}
                        animate={{ height: isHeaderTransparent ? 0 : 'auto' }}
                        transition={{ duration: 0.3 }}
                    >
                        <h1 className="text-lg font-bold text-gray-900 truncate max-w-xs">
                            {event.title}
                        </h1>
                    </motion.div>
                )}
            </motion.header>

            {/* Loading Skeleton */}
            {isLoading ? (
                <div className="pt-16">
                    {/* Hero Image Skeleton */}
                    <div className="w-full h-[60vh] bg-gray-200 animate-pulse relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/60"></div>

                        {/* Title & Meta Skeleton */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                            <div className="flex gap-2">
                                <div className="h-6 w-24 bg-white/30 rounded-full animate-shimmer backdrop-blur-sm"></div>
                                <div className="h-6 w-20 bg-white/30 rounded-full animate-shimmer backdrop-blur-sm" style={{ animationDelay: '0.1s' }}></div>
                            </div>
                            <div className="h-10 w-3/4 bg-white/30 rounded-lg animate-shimmer backdrop-blur-sm" style={{ animationDelay: '0.2s' }}></div>
                            <div className="h-6 w-1/2 bg-white/30 rounded-lg animate-shimmer backdrop-blur-sm" style={{ animationDelay: '0.3s' }}></div>
                            <div className="flex items-center gap-3 mt-2">
                                <div className="h-8 w-8 rounded-full bg-white/30 animate-shimmer backdrop-blur-sm" style={{ animationDelay: '0.4s' }}></div>
                                <div className="h-5 w-32 bg-white/30 rounded-md animate-shimmer backdrop-blur-sm" style={{ animationDelay: '0.45s' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Event Info Cards */}
                    <div className="container mx-auto px-4 relative">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 -mt-20 mb-8">
                            {[...Array(3)].map((_, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl p-5 shadow-lg animate-fade-in-up relative overflow-hidden"
                                    style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                                >
                                    <div className="flex items-start">
                                        <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse mr-3"></div>
                                        <div className="space-y-2 flex-1">
                                            <div className="h-4 w-20 bg-gray-200 rounded animate-shimmer"></div>
                                            <div className="h-6 w-32 bg-gray-200 rounded animate-shimmer" style={{ animationDelay: '0.1s' }}></div>
                                        </div>
                                    </div>

                                    {/* Shimmer overlay */}
                                    <div className="absolute inset-0 animate-wave-effect"></div>
                                </div>
                            ))}
                        </div>

                        {/* Tab Navigation Skeleton */}
                        <div className="mb-6 border-b border-gray-200">
                            <div className="flex gap-6">
                                {['details', 'tickets', 'attendees'].map((tab, index) => (
                                    <div
                                        key={tab}
                                        className="h-10 w-24 bg-gray-200 rounded animate-shimmer"
                                        style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                                    ></div>
                                ))}
                            </div>
                        </div>

                        {/* Content Skeleton */}
                        <div className="space-y-6">
                            <div className="h-8 w-48 bg-gray-200 rounded-lg animate-shimmer" style={{ animationDelay: '0.9s' }}></div>

                            {/* Text content skeletons with varying widths */}
                            <div className="space-y-2">
                                {[95, 85, 90, 70, 80].map((width, i) => (
                                    <div
                                        key={i}
                                        className="h-4 bg-gray-200 rounded animate-shimmer"
                                        style={{
                                            width: `${width}%`,
                                            animationDelay: `${1 + i * 0.05}s`
                                        }}
                                    ></div>
                                ))}
                            </div>

                            <div className="h-8 w-40 bg-gray-200 rounded-lg animate-shimmer" style={{ animationDelay: '1.3s' }}></div>
                            <div className="flex flex-wrap gap-2">
                                {[...Array(4)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="h-8 w-20 bg-gray-200 rounded-full animate-shimmer"
                                        style={{ animationDelay: `${1.4 + index * 0.05}s` }}
                                    ></div>
                                ))}
                            </div>
                            <div className="h-8 w-40 bg-gray-200 rounded-lg animate-shimmer" style={{ animationDelay: '1.6s' }}></div>
                            <div className="h-64 bg-gray-200 rounded-lg animate-shimmer" style={{ animationDelay: '1.7s' }}></div>
                        </div>
                    </div>
                </div>
            ) : (
                // Event Not Found State
                !event ? (
                    <div className="min-h-screen flex flex-col items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center relative overflow-hidden">
                            {/* Decorative background pattern */}
                            <div className="absolute inset-0 opacity-5">
                                <div className="absolute left-0 right-0 top-0 h-20 bg-[#FF5722]"></div>
                                <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-[#FF5722]"></div>
                                <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-[#FF5722]"></div>
                            </div>

                            <motion.div
                                className="h-20 w-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center relative z-10"
                                initial={{ scale: 0.8, rotate: -10 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ duration: 0.5, type: "spring" }}
                            >
                                <FiInfo className="h-10 w-10 text-gray-400" />
                            </motion.div>

                            <motion.h2
                                className="text-2xl font-bold mb-3 text-gray-800"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                Event Not Found
                            </motion.h2>

                            <motion.p
                                className="text-gray-600 mb-6"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                This event may have been removed or the link is incorrect.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <Link
                                    href="/"
                                    className="inline-flex items-center justify-center px-6 py-3 bg-[#FF5722] text-white rounded-full font-medium shadow-lg hover:bg-[#E64A19] transition-colors"
                                >
                                    Discover Events
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                ) : (
                    // Event Details Content
                    <>
                        {/* Confetti Effect for Ticket Purchase */}
                        {showConfetti && (
                            <div className="fixed inset-0 pointer-events-none z-50">
                                {[...Array(100)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-2 h-2 rounded-full"
                                        style={{
                                            top: "-10px",
                                            left: `${Math.random() * 100}%`,
                                            backgroundColor: [
                                                "#FF5722", "#FF9800", "#FFEB3B",
                                                "#4CAF50", "#2196F3", "#9C27B0"
                                            ][Math.floor(Math.random() * 6)],
                                            scale: Math.random() * 2 + 0.5
                                        }}
                                        animate={{
                                            y: window.innerHeight + 20,
                                            x: (Math.random() - 0.5) * 200,
                                            rotate: Math.random() * 360,
                                            opacity: [1, 1, 0]
                                        }}
                                        transition={{
                                            duration: Math.random() * 2 + 1,
                                            ease: "easeOut",
                                            delay: Math.random() * 0.5
                                        }}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Hero Section with Parallax */}
                        <div className="relative w-full h-[65vh] overflow-hidden">
                            {/* Parallax Background */}
                            <motion.div
                                ref={heroImageRef}
                                className="absolute inset-0 z-0"
                                style={{
                                    y: springParallaxY,
                                    scale: scale
                                }}
                            >
                                <Image
                                    src={event.image}
                                    alt={event.title}
                                    fill
                                    priority
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90"></div>

                                {/* Subtle moving light overlay */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent bg-[length:200%_200%] animate-subtle-movement"></div>
                            </motion.div>

                            {/* Floating category bubbles */}
                            <div className="absolute top-1/3 left-[10%] z-10">
                                <motion.div
                                    className="px-4 py-2 bg-white/20 backdrop-blur-lg text-white rounded-full text-sm font-medium"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    style={{ opacity }}
                                >
                                    {event.subcategory || "Featured"}
                                </motion.div>
                            </div>

                            {/* Event Metadata - Positioned at the bottom */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                                {/* Category & NFT Badge */}
                                <motion.div
                                    className="flex gap-2 mb-3"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-full text-sm font-medium inline-flex items-center">
                                        <FiTag className="mr-1" />
                                        {event.category}
                                    </span>

                                    {event.hasNftTickets && (
                                        <span className="px-3 py-1.5 bg-[#FF5722]/80 backdrop-blur-md text-white rounded-full text-sm font-medium inline-flex items-center relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#FF5722]/80 to-[#FF9800]/80 group-hover:opacity-100 opacity-0 transition-opacity"></div>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 relative z-10" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1.5l-1.8-1.8A2 2 0 0012.46 2H7.54a2 2 0 00-1.42.59L4.3 4z" />
                                            </svg>
                                            <span className="relative z-10">NFT TICKET</span>
                                        </span>
                                    )}
                                </motion.div>

                                {/* Title */}
                                <motion.h1
                                    className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.1 }}
                                    style={{
                                        textShadow: '0 4px 12px rgba(0,0,0,0.2)'
                                    }}
                                >
                                    {event.title}
                                </motion.h1>

                                {/* Organizer */}
                                <motion.div
                                    className="flex items-center gap-2 mb-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.2 }}
                                >
                                    <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-white shadow-lg">
                                        <Image
                                            src={event.organizer.image}
                                            alt={event.organizer.name}
                                            width={32}
                                            height={32}
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-white/90 font-medium text-sm">{event.organizer.name}</span>
                                        {event.organizer.verified && (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#77A8FF] ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Stats row */}
                                <motion.div
                                    className="flex items-center gap-4 text-white/80 text-sm"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.3 }}
                                >
                                    <div className="flex items-center gap-1">
                                        <FiUsers className="text-[#FF5722]" />
                                        <span>{attendees.length} going</span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <FiHeart className={`${isLiked ? 'text-[#FF5722] fill-[#FF5722]' : 'text-[#FF5722]'}`} />
                                        <span>{isLiked ? event.likes + 1 : event.likes} likes</span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <FiCalendar className="text-[#FF5722]" />
                                        <span>{formatDateTime(event.date).date.split(',')[0]}</span>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Content Container */}
                        <div className="container mx-auto px-4 relative">
                            {/* Event Info Cards - Positioned to overlap with the hero */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 -mt-20 mb-8">
                                {/* Date & Time Card */}
                                <motion.div
                                    className="bg-white rounded-xl p-5 shadow-lg overflow-hidden relative group"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
                                >
                                    {/* Card background gradient */}
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF5722] to-[#FF9800] group-hover:h-2 transition-all"></div>

                                    <div className="flex items-start">
                                        <div className="w-10 h-10 rounded-full bg-[#FF5722]/10 flex items-center justify-center mr-3 group-hover:bg-[#FF5722]/20 transition-colors">
                                            <FiCalendar className="text-[#FF5722]" />
                                        </div>
                                        <div>
                                            <h3 className="text-gray-500 text-sm">Date & Time</h3>
                                            <p className="font-medium text-gray-900 group-hover:text-[#FF5722] transition-colors">
                                                {formatDateTime(event.date).date}
                                            </p>
                                            <p className="text-[#FF5722] flex items-center gap-1">
                                                <FiClock className="w-3 h-3" />
                                                {formatDateTime(event.date).time} - {formatDateTime(event.endDate).time}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Add to calendar button */}
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <motion.button
                                            className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600"
                                            whileHover={{ rotate: 15 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <FiPlus className="w-3 h-3" />
                                        </motion.button>
                                    </div>
                                </motion.div>

                                {/* Location Card */}
                                <motion.div
                                    className="bg-white rounded-xl p-5 shadow-lg overflow-hidden relative group"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                    whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
                                >
                                    {/* Card background gradient */}
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9800] to-[#FF5722] group-hover:h-2 transition-all"></div>

                                    <div className="flex items-start">
                                        <div className="w-10 h-10 rounded-full bg-[#FF5722]/10 flex items-center justify-center mr-3 group-hover:bg-[#FF5722]/20 transition-colors">
                                            <FiMapPin className="text-[#FF5722]" />
                                        </div>
                                        <div>
                                            <h3 className="text-gray-500 text-sm">Location</h3>
                                            <p className="font-medium text-gray-900 group-hover:text-[#FF5722] transition-colors">
                                                {event.location.name}
                                            </p>
                                            <p className="text-gray-600 text-sm truncate max-w-[180px]">
                                                {event.location.address}, {event.location.city}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Directions button */}
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <motion.button
                                            className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600"
                                            whileHover={{ rotate: 15 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <FiMapPin className="w-3 h-3" />
                                        </motion.button>
                                    </div>
                                </motion.div>

                                {/* Price Card */}
                                <motion.div
                                    className="bg-white rounded-xl p-5 shadow-lg overflow-hidden relative group"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.2 }}
                                    whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
                                >
                                    {/* Card background gradient */}
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF5722] to-[#FF9800] group-hover:h-2 transition-all"></div>

                                    <div className="flex items-start">
                                        <div className="w-10 h-10 rounded-full bg-[#FF5722]/10 flex items-center justify-center mr-3 group-hover:bg-[#FF5722]/20 transition-colors">
                                            <FaDollarSign className="text-[#FF5722]" />
                                        </div>
                                        <div>
                                            <h3 className="text-gray-500 text-sm">Price</h3>
                                            <p className="font-medium text-gray-900 group-hover:text-[#FF5722] transition-colors">
                                                {event.price.min === event.price.max
                                                    ? `${event.price.currency} ${event.price.min}`
                                                    : `${event.price.currency} ${event.price.min} - ${event.price.max}`}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden relative">
                                                    <motion.div
                                                        className="h-full bg-[#FF5722]"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${ticketAvailabilityPercent}%` }}
                                                        transition={{ duration: 1, delay: 0.5 }}
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-500">
                                                    {event.soldTickets}/{event.totalTickets} sold
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hot deal indicator */}
                                    {ticketAvailabilityPercent > 70 && (
                                        <div className="absolute top-2 right-2">
                                            <div className="bg-[#FF5722]/10 text-[#FF5722] text-xs font-bold py-1 px-2 rounded-full flex items-center gap-1">
                                                <IoMdFlash className="w-3 h-3" />
                                                SELLING FAST
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </div>

                            {/* Tab Navigation */}
                            <div className="mb-8 border-b border-gray-200">
                                <div className="flex gap-6">
                                    {[
                                        { id: 'details', label: 'Details', icon: FiInfo },
                                        { id: 'tickets', label: 'Tickets', icon: LuTicketCheck },
                                        { id: 'attendees', label: 'Attendees', icon: FiUser }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as 'details' | 'tickets' | 'attendees')}
                                            className={`px-1 py-3 flex items-center gap-2 text-base font-medium border-b-2 transition-colors ${activeTab === tab.id
                                                ? 'border-[#FF5722] text-[#FF5722]'
                                                : 'border-transparent text-gray-500 hover:text-gray-900'
                                                }`}
                                        >
                                            <tab.icon className="w-4 h-4" />
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Tab Content */}
                            <div className="mb-20">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'details' && (
                                        <motion.div
                                            key="details"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-8"
                                        >
                                            {/* Description */}
                                            <section>
                                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                                                    <div className="w-6 h-6 rounded-full bg-[#FF5722]/10 flex items-center justify-center">
                                                        <FiInfo className="text-[#FF5722] w-3 h-3" />
                                                    </div>
                                                    About this event
                                                </h2>
                                                <motion.p
                                                    className="text-gray-700 leading-relaxed"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                >
                                                    {event.description}
                                                </motion.p>
                                            </section>

                                            {/* Tags */}
                                            <section>
                                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                                                    <div className="w-6 h-6 rounded-full bg-[#FF5722]/10 flex items-center justify-center">
                                                        <FiTag className="text-[#FF5722] w-3 h-3" />
                                                    </div>
                                                    Tags
                                                </h2>
                                                <div className="flex flex-wrap gap-2">
                                                    {event.tags.map((tag, index) => (
                                                        <motion.span
                                                            key={tag}
                                                            className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-[#FF5722]/10 hover:text-[#FF5722] transition-colors cursor-pointer"
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: 0.1 + (index * 0.05) }}
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            #{tag}
                                                        </motion.span>
                                                    ))}
                                                </div>
                                            </section>

                                            {/* Location Map */}
                                            <section>
                                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                                                    <div className="w-6 h-6 rounded-full bg-[#FF5722]/10 flex items-center justify-center">
                                                        <FiMapPin className="text-[#FF5722] w-3 h-3" />
                                                    </div>
                                                    Location
                                                </h2>
                                                <motion.div
                                                    className="h-64 bg-gray-100 rounded-xl overflow-hidden relative"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.3 }}
                                                    whileHover={{ scale: 1.01 }}
                                                >
                                                    {/* This would be replaced with an actual map component */}
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="text-center">
                                                            <FiGlobe className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                                            <p className="text-gray-600">Interactive map would be integrated here</p>
                                                        </div>
                                                    </div>
                                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10"></div>

                                                    {/* Grid pattern overlay */}
                                                    <div className="absolute inset-0 z-0 opacity-20">
                                                        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                                            <defs>
                                                                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                                                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="0.5" />
                                                                </pattern>
                                                            </defs>
                                                            <rect width="100%" height="100%" fill="url(#grid)" />
                                                        </svg>
                                                    </div>

                                                    {/* Location Pin */}
                                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                        <motion.div
                                                            className="w-10 h-10 bg-[#FF5722] rounded-full flex items-center justify-center shadow-lg relative"
                                                            animate={{
                                                                y: [0, -10, 0],
                                                            }}
                                                            transition={{
                                                                duration: 2,
                                                                repeat: Infinity,
                                                                ease: "easeInOut"
                                                            }}
                                                        >
                                                            <FiMapPin className="w-5 h-5 text-white" />
                                                            {/* Ping Animation */}
                                                            <div className="absolute inset-0 bg-[#FF5722] rounded-full animate-ping opacity-50"></div>
                                                        </motion.div>

                                                        {/* Shadow beneath the pin */}
                                                        <motion.div
                                                            className="w-6 h-1.5 bg-black/20 rounded-full mx-auto mt-1 blur-sm"
                                                            animate={{
                                                                width: [16, 24, 16],
                                                                opacity: [0.2, 0.3, 0.2]
                                                            }}
                                                            transition={{
                                                                duration: 2,
                                                                repeat: Infinity,
                                                                ease: "easeInOut"
                                                            }}
                                                        ></motion.div>
                                                    </div>
                                                </motion.div>
                                                <div className="flex items-center justify-between mt-3">
                                                    <p className="text-gray-700 text-sm">
                                                        {event.location.address}, {event.location.city}
                                                    </p>
                                                    <button className="text-[#FF5722] text-sm font-medium hover:underline flex items-center gap-1">
                                                        Get Directions
                                                        <FiChevronRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </section>

                                            {/* NFT Benefits - Only shown if event has NFT tickets */}
                                            {event.hasNftTickets && (
                                                <motion.section
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.4 }}
                                                >
                                                    <div className="rounded-2xl overflow-hidden">
                                                        {/* Gradient background with subtle animation */}
                                                        <div className="bg-gradient-to-br from-white to-[#FFF5F2] p-6 border border-gray-100 shadow-sm relative">
                                                            {/* Background pattern */}
                                                            <div className="absolute inset-0 opacity-5">
                                                                <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-[#FF5722]"></div>
                                                                <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-[#FF5722]"></div>
                                                            </div>

                                                            <div className="flex items-start gap-4 relative z-10">
                                                                <motion.div
                                                                    className="w-12 h-12 bg-gradient-to-br from-[#FF5722] to-[#FF9800] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
                                                                    whileHover={{ rotate: [0, -5, 5, 0], scale: 1.05 }}
                                                                    transition={{ duration: 0.5 }}
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                                    </svg>
                                                                </motion.div>
                                                                <div>
                                                                    <h3 className="text-xl font-bold text-gray-900 mb-2">NFT Ticket Benefits</h3>
                                                                    <ul className="space-y-2">
                                                                        {[
                                                                            "Digital collectible that lives forever on blockchain",
                                                                            "Tradeable on secondary marketplaces",
                                                                            "Proof of attendance as NFT on Polygon",
                                                                            "Access to exclusive content or future events"
                                                                        ].map((benefit, index) => (
                                                                            <motion.li
                                                                                key={index}
                                                                                className="flex items-start gap-2"
                                                                                initial={{ opacity: 0, x: -10 }}
                                                                                animate={{ opacity: 1, x: 0 }}
                                                                                transition={{ delay: 0.5 + (index * 0.1) }}
                                                                            >
                                                                                <div className="mt-1 h-4 w-4 rounded-full bg-gradient-to-r from-[#FF5722] to-[#FF9800] flex items-center justify-center flex-shrink-0">
                                                                                    <FiCheck className="h-3 w-3 text-white" />
                                                                                </div>
                                                                                <span className="text-gray-700">{benefit}</span>
                                                                            </motion.li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            </div>

                                                            {/* NFT Preview Badge */}
                                                            <div className="absolute top-6 right-6 rotate-12">
                                                                <motion.div
                                                                    className="w-20 h-20 bg-white shadow-xl rounded-lg overflow-hidden border-4 border-white relative"
                                                                    whileHover={{ rotate: [12, 0, -5, 0, 12], scale: 1.1 }}
                                                                    transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
                                                                >
                                                                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF5722] to-[#FF9800] opacity-30"></div>
                                                                    <div className="p-2 relative z-10 flex flex-col items-center">
                                                                        <FiStar className="h-8 w-8 text-[#FF5722] mb-1" />
                                                                        <div className="text-center text-[8px] font-bold text-gray-800">EVENT NFT</div>
                                                                        <div className="text-center text-[6px] text-gray-600">{id}-{event.title.substring(0, 8)}</div>
                                                                    </div>
                                                                </motion.div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.section>
                                            )}
                                        </motion.div>
                                    )}

                                    {activeTab === 'tickets' && (
                                        <motion.div
                                            key="tickets"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-6"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-[#FF5722]/10 flex items-center justify-center">
                                                        <LuTicketCheck className="text-[#FF5722] w-3 h-3" />
                                                    </div>
                                                    Available Tickets
                                                </h2>

                                                {/* Ticket count selector */}
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm text-gray-500">Quantity:</span>
                                                    <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden">
                                                        <button
                                                            className="px-2 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                                                            disabled={ticketCount <= 1}
                                                        >-</button>
                                                        <span className="w-8 text-center text-gray-900">{ticketCount}</span>
                                                        <button
                                                            className="px-2 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            onClick={() => setTicketCount(Math.min(10, ticketCount + 1))}
                                                            disabled={ticketCount >= 10}
                                                        >+</button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Ticket Types */}
                                            <div className="space-y-4">
                                                {/* General Admission */}
                                                <motion.div
                                                    className={`bg-white rounded-xl p-5 border transition-all ${selectedTicketType === 'general'
                                                        ? 'border-[#FF5722] shadow-lg'
                                                        : 'border-gray-100 shadow-md hover:border-[#FF5722]/50 hover:shadow-lg'
                                                        }`}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.1 }}
                                                    whileHover={{ y: -5 }}
                                                    layoutId="generalTicket"
                                                    onClick={() => handleTicketClick('general')}
                                                >
                                                    {animatedTicket === 'general' && (
                                                        <motion.div
                                                            className="absolute inset-0 rounded-xl opacity-50"
                                                            initial={{ boxShadow: "0 0 0 0 rgba(255, 87, 34, 0.7)" }}
                                                            animate={{
                                                                boxShadow: [
                                                                    "0 0 0 0 rgba(255, 87, 34, 0.7)",
                                                                    "0 0 0 20px rgba(255, 87, 34, 0.0)",
                                                                ]
                                                            }}
                                                            transition={{ duration: 0.7 }}
                                                        />
                                                    )}

                                                    <div className="flex justify-between items-start mb-3">
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <h3 className="font-bold text-gray-900 text-lg">General Admission</h3>
                                                                {selectedTicketType === 'general' && (
                                                                    <div className="bg-[#FF5722]/10 text-[#FF5722] text-xs font-medium py-0.5 px-2 rounded-full">
                                                                        Selected
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <p className="text-gray-600 text-sm">Standard entry to the event</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[#FF5722] font-bold text-lg">{event.price.currency} {event.price.min}</p>
                                                            <p className="text-gray-500 text-xs">{event.totalTickets - event.soldTickets} remaining</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-2 text-gray-700 text-sm">
                                                            {event.hasNftTickets && (
                                                                <div className="flex items-center gap-1 bg-[#FF5722]/10 px-2 py-1 rounded-full">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#FF5722]" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1.5l-1.8-1.8A2 2 0 0012.46 2H7.54a2 2 0 00-1.42.59L4.3 4z" />
                                                                    </svg>
                                                                    <span>NFT Ticket</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <button
                                                            className={`px-5 py-2 ${selectedTicketType === 'general'
                                                                ? 'bg-[#FF5722] text-white'
                                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                } rounded-full text-sm font-medium flex items-center gap-1 transition-colors shadow-sm`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleTicketClick('general');
                                                            }}
                                                        >
                                                            {selectedTicketType === 'general' ? (
                                                                <>
                                                                    <FiCheck className="w-4 h-4" />
                                                                    Selected
                                                                </>
                                                            ) : (
                                                                <>
                                                                    Select
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </motion.div>

                                                {/* VIP Ticket - Only show if there's a price range */}
                                                {event.price.min !== event.price.max && (
                                                    <motion.div
                                                        className={`bg-white rounded-xl p-5 border transition-all ${selectedTicketType === 'vip'
                                                            ? 'border-[#FF5722] shadow-lg'
                                                            : 'border-gray-100 shadow-md hover:border-[#FF5722]/50 hover:shadow-lg'
                                                            }`}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.2 }}
                                                        whileHover={{ y: -5 }}
                                                        layoutId="vipTicket"
                                                        onClick={() => handleTicketClick('vip')}
                                                    >
                                                        {animatedTicket === 'vip' && (
                                                            <motion.div
                                                                className="absolute inset-0 rounded-xl opacity-50"
                                                                initial={{ boxShadow: "0 0 0 0 rgba(255, 87, 34, 0.7)" }}
                                                                animate={{
                                                                    boxShadow: [
                                                                        "0 0 0 0 rgba(255, 87, 34, 0.7)",
                                                                        "0 0 0 20px rgba(255, 87, 34, 0.0)",
                                                                    ]
                                                                }}
                                                                transition={{ duration: 0.7 }}
                                                            />
                                                        )}

                                                        <div className="absolute top-3 right-3 bg-[#FF5722]/10 text-[#FF5722] text-xs font-bold py-1 px-2 rounded-full flex items-center gap-1">
                                                            <FiStar className="w-3 h-3" />
                                                            PREMIUM
                                                        </div>

                                                        <div className="flex justify-between items-start mb-3">
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <h3 className="font-bold text-gray-900 text-lg">VIP Experience</h3>
                                                                    {selectedTicketType === 'vip' && (
                                                                        <div className="bg-[#FF5722]/10 text-[#FF5722] text-xs font-medium py-0.5 px-2 rounded-full">
                                                                            Selected
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <p className="text-gray-600 text-sm">Premium access with exclusive perks</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-[#FF5722] font-bold text-lg">{event.price.currency} {event.price.max}</p>
                                                                <p className="text-gray-500 text-xs">Limited availability</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex justify-between items-center">
                                                            <div className="flex items-center gap-2 text-gray-700 text-sm">
                                                                {event.hasNftTickets && (
                                                                    <div className="flex items-center gap-1 bg-[#FF5722]/10 px-2 py-1 rounded-full">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#FF5722]" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1.5l-1.8-1.8A2 2 0 0012.46 2H7.54a2 2 0 00-1.42.59L4.3 4z" />
                                                                        </svg>
                                                                        <span>NFT Ticket</span>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <button
                                                                className={`px-5 py-2 ${selectedTicketType === 'vip'
                                                                    ? 'bg-[#FF5722] text-white'
                                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                    } rounded-full text-sm font-medium flex items-center gap-1 transition-colors shadow-sm`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleTicketClick('vip');
                                                                }}
                                                            >
                                                                {selectedTicketType === 'vip' ? (
                                                                    <>
                                                                        <FiCheck className="w-4 h-4" />
                                                                        Selected
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        Select
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>

                                                        {/* Premium Features */}
                                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                                            <p className="text-sm font-medium text-gray-700 mb-2">Premium Features:</p>
                                                            <div className="grid grid-cols-2 gap-2">
                                                                {[
                                                                    "Early Entry",
                                                                    "Premium Seating",
                                                                    "Exclusive Merchandise",
                                                                    "Meet & Greet"
                                                                ].map((feature, index) => (
                                                                    <motion.div
                                                                        key={index}
                                                                        className="flex items-center gap-1 text-xs text-gray-600"
                                                                        initial={{ opacity: 0, y: 5 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        transition={{ delay: 0.3 + (index * 0.1) }}
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#FF5722]" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                        </svg>
                                                                        {feature}
                                                                    </motion.div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </div>

                                            {/* Order summary */}
                                            {selectedTicketType && (
                                                <motion.div
                                                    className="mt-8 bg-gray-50 rounded-xl p-5 border border-gray-100"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <h3 className="font-bold text-gray-900 mb-3">Order Summary</h3>
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-600">
                                                                {selectedTicketType === 'vip' ? 'VIP Experience' : 'General Admission'} x {ticketCount}
                                                            </span>
                                                            <span className="text-gray-900">
                                                                {event.price.currency} {
                                                                    (selectedTicketType === 'vip' ? event.price.max : event.price.min) * ticketCount
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-600">Service Fee</span>
                                                            <span className="text-gray-900">{event.price.currency} {(selectedTicketType === 'vip' ? 5.99 : 3.99) * ticketCount}</span>
                                                        </div>
                                                        <div className="border-t border-gray-200 pt-2 mt-2">
                                                            <div className="flex justify-between font-medium">
                                                                <span className="text-gray-900">Total</span>
                                                                <span className="text-[#FF5722]">
                                                                    {event.price.currency} {
                                                                        (selectedTicketType === 'vip'
                                                                            ? (event.price.max + 5.99) * ticketCount
                                                                            : (event.price.min + 3.99) * ticketCount
                                                                        ).toFixed(2)
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    )}

                                    {activeTab === 'attendees' && (
                                        <motion.div
                                            key="attendees"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-6"
                                        >
                                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                                                <div className="w-6 h-6 rounded-full bg-[#FF5722]/10 flex items-center justify-center">
                                                    <FiUsers className="text-[#FF5722] w-3 h-3" />
                                                </div>
                                                Who&apos;s Going <span className="text-[#FF5722] ml-1">({attendees.length})</span>
                                            </h2>

                                            {attendees.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {attendees.map((attendee, index) => (
                                                        <motion.div
                                                            key={attendee.id}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                                            whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                                                            className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-3 transition-all"
                                                        >
                                                            <div className="h-12 w-12 rounded-full overflow-hidden border border-gray-100">
                                                                <Image
                                                                    src={attendee.image}
                                                                    alt={attendee.name}
                                                                    width={48}
                                                                    height={48}
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <h3 className="font-medium text-gray-900 flex items-center gap-1">
                                                                    {attendee.name}
                                                                    {attendee.verified && (
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#77A8FF]" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                        </svg>
                                                                    )}
                                                                </h3>
                                                                <p className="text-gray-500 text-sm">@{attendee.username}</p>
                                                            </div>
                                                            <motion.button
                                                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs font-medium transition-colors"
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                            >
                                                                Follow
                                                            </motion.button>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <motion.div
                                                    className="bg-white rounded-xl p-8 text-center border border-gray-100 shadow-sm"
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.2 }}
                                                >
                                                    <motion.div
                                                        className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                                        initial={{ scale: 0.8, rotate: -10 }}
                                                        animate={{ scale: 1, rotate: 0 }}
                                                        transition={{ type: "spring", stiffness: 100 }}
                                                    >
                                                        <FiUsers className="h-8 w-8 text-gray-400" />
                                                    </motion.div>
                                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No attendees yet</h3>
                                                    <p className="text-gray-600 mb-6">Be the first to get a ticket!</p>
                                                    <motion.button
                                                        className="px-6 py-2 bg-[#FF5722] text-white rounded-full font-medium hover:bg-[#E64A19] transition-colors shadow-md"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => {
                                                            setActiveTab('tickets');
                                                            setTimeout(() => handleTicketClick('general'), 300);
                                                        }}
                                                    >
                                                        Buy Tickets Now
                                                    </motion.button>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Sticky CTA */}
                        <motion.div
                            className="fixed bottom-20 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 py-4 shadow-lg z-40"
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8, type: "spring" }}
                        >
                            <div className="container mx-auto px-4 flex justify-between items-center">
                                <div>
                                    <p className="text-lg font-bold text-gray-900">
                                        {event.price.min === event.price.max
                                            ? `${event.price.currency} ${event.price.min}`
                                            : `${event.price.currency} ${event.price.min} - ${event.price.max}`}
                                    </p>
                                    <p className="text-gray-600 text-sm">{event.totalTickets - event.soldTickets} tickets left</p>
                                </div>

                                <motion.button
                                    className={`px-6 py-3 ${selectedTicketType
                                        ? 'bg-[#FF5722] text-white'
                                        : 'bg-gray-100 text-gray-700'
                                        } rounded-full font-medium shadow-lg flex items-center gap-2 transition-colors`}
                                    disabled={!selectedTicketType}
                                    whileHover={selectedTicketType ? { scale: 1.05 } : {}}
                                    whileTap={selectedTicketType ? { scale: 0.95 } : {}}
                                    onClick={handleBuyTicket}
                                >
                                    <LuTicketCheck className="w-5 h-5" />
                                    {selectedTicketType ? (
                                        <>Get {ticketCount} Ticket{ticketCount > 1 ? 's' : ''}</>
                                    ) : (
                                        <>Select Tickets</>
                                    )}
                                    {selectedTicketType && (
                                        <FiChevronRight className="w-5 h-5" />
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    </>
                )
            )}

            {/* Bottom Navigation */}
            <BottomNavigation />

            {/* Global Styles for Custom Animations */}
            <style jsx global>{`
                @keyframes shimmer {
                  0% {
                    background-position: -200% 0;
                  }
                  100% {
                    background-position: 200% 0;
                  }
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
                
                @keyframes fade-in-up {
                  0% {
                    opacity: 0;
                    transform: translateY(10px);
                  }
                  100% {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
                
                .animate-fade-in-up {
                  animation: fade-in-up 0.5s ease-out forwards;
                }
                
                @keyframes ping-short {
                  0% {
                    transform: scale(1);
                    opacity: 1;
                  }
                  75%, 100% {
                    transform: scale(1.5);
                    opacity: 0;
                  }
                }
                
                .animate-ping-short {
                  animation: ping-short 1s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
                
                @keyframes skeleton-wave {
                  0% {
                    transform: translateX(-100%);
                  }
                  50%, 100% {
                    transform: translateX(100%);
                  }
                }
                
                .animate-wave-effect {
                  position: relative;
                  overflow: hidden;
                }
                
                .animate-wave-effect::after {
                  content: '';
                  position: absolute;
                  top: 0;
                  right: 0;
                  bottom: 0;
                  left: 0;
                  background: linear-gradient(
                    90deg,
                    rgba(255, 255, 255, 0) 0%,
                    rgba(255, 255, 255, 0.6) 50%,
                    rgba(255, 255, 255, 0) 100%
                  );
                  animation: skeleton-wave 1.5s infinite;
                }
                
                @keyframes subtle-movement {
                  0% {
                    background-position: 0% 0%;
                  }
                  50% {
                    background-position: 100% 100%;
                  }
                  100% {
                    background-position: 0% 0%;
                  }
                }
                
                .animate-subtle-movement {
                  animation: subtle-movement 15s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}