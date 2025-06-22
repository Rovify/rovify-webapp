/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
    FiPlus, FiEdit3, FiTrash2, FiCopy, FiEye, FiSettings,
    FiCalendar, FiClock, FiUsers, FiDollarSign, FiPercent,
    FiTarget, FiBarChart, FiSearch, FiFilter, FiMoreHorizontal,
    FiCheckCircle, FiXCircle, FiAlertCircle, FiZap, FiX, FiCheck,
    FiTag, FiMapPin, FiGlobe, FiStar, FiAward, FiShield, FiArrowRight,
    FiArrowLeft, FiRefreshCw, FiThumbsUp, FiThumbsDown
} from 'react-icons/fi';
import { MdLightbulbOutline } from 'react-icons/md';
import { HiOutlineTicket, HiOutlineFire, HiSparkles } from "react-icons/hi2";

// Enhanced interfaces
interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    endDate?: string;
    location: string;
    type: 'conference' | 'concert' | 'sports' | 'festival' | 'workshop' | 'networking' | 'fundraising' | 'other';
    capacity: number;
    image: string;
    status: 'draft' | 'published' | 'sold_out' | 'cancelled';
    timezone: string;
    venue: {
        name: string;
        address: string;
        city: string;
        state: string;
        country: string;
    };
    organizer: {
        name: string;
        contact: string;
    };
    priceRange: { min: number; max: number };
}

interface TicketTier {
    id: string;
    name: string;
    description: string;
    capacity: number;
    sold: number;
    available: number;
    pricing: {
        basePrice: number;
        currency: 'USD' | 'EUR' | 'GBP';
        earlyBirdPrice?: number;
        earlyBirdEndDate?: string;
        groupDiscounts?: Array<{
            minQuantity: number;
            discountPercent: number;
        }>;
        dynamicPricing?: boolean;
    };
    access: {
        areas: string[];
        sessions: string[];
        perks: string[];
        priority: number; // 1-5, higher = better access
    };
    restrictions: {
        maxPerPerson: number;
        minAge?: number;
        requiresVerification?: boolean;
        transferable: boolean;
        refundable: boolean;
        refundPolicy?: string;
    };
    availability: {
        saleStart: string;
        saleEnd: string;
        blackoutDates?: string[];
    };
    appearance: {
        color: string;
        icon: string;
        badge?: string;
    };
    status: 'active' | 'paused' | 'sold_out' | 'draft' | 'hidden';
    metrics: {
        revenue: number;
        conversionRate: number;
        salesVelocity: number;
        averageOrderValue: number;
    };
}

interface AITicketSuggestion {
    tierName: string;
    description: string;
    suggestedPrice: number;
    capacity: number;
    perks: string[];
    accessLevel: string;
    reasoning: string;
}

interface TicketTierDraft {
    name: string;
    description: string;
    price: number;
    capacity: number;
    perks: string[];
    accessAreas: string[];
    restrictions: {
        maxPerPerson: number;
        minAge?: number;
        transferable: boolean;
        refundable: boolean;
    };
    appearance: {
        color: string;
        icon: string;
    };
}

// AI Suggestion Engine
const generateAISuggestions = (eventType: string, numTiers: number, totalCapacity: number, priceRange: { min: number; max: number }): AITicketSuggestion[] => {
    const suggestions: Record<string, () => AITicketSuggestion[]> = {
        conference: () => {
            if (numTiers === 2) {
                return [
                    {
                        tierName: "Standard Access",
                        description: "Full conference access with networking opportunities",
                        suggestedPrice: Math.round(priceRange.min + (priceRange.max - priceRange.min) * 0.3),
                        capacity: Math.round(totalCapacity * 0.7),
                        perks: ["All main sessions", "Exhibition access", "Lunch included", "Networking breaks", "Digital resources"],
                        accessLevel: "Main conference areas",
                        reasoning: "Most attendees prefer comprehensive access at reasonable pricing"
                    },
                    {
                        tierName: "VIP Experience",
                        description: "Premium access with exclusive networking and perks",
                        suggestedPrice: priceRange.max,
                        capacity: Math.round(totalCapacity * 0.3),
                        perks: ["Priority seating", "VIP lounge", "Speaker meet & greet", "Premium catering", "Welcome gift", "Dedicated support"],
                        accessLevel: "All areas including VIP zones",
                        reasoning: "Create exclusivity for sponsors and high-value attendees"
                    }
                ];
            } else if (numTiers === 3) {
                return [
                    {
                        tierName: "Early Bird",
                        description: "Limited-time discounted access for early supporters",
                        suggestedPrice: Math.round(priceRange.min + (priceRange.max - priceRange.min) * 0.2),
                        capacity: Math.round(totalCapacity * 0.4),
                        perks: ["All main sessions", "Exhibition access", "Lunch included", "Digital resources"],
                        accessLevel: "Main conference areas",
                        reasoning: "Drive early sales momentum with attractive pricing"
                    },
                    {
                        tierName: "Professional",
                        description: "Standard professional access with networking benefits",
                        suggestedPrice: Math.round(priceRange.min + (priceRange.max - priceRange.min) * 0.5),
                        capacity: Math.round(totalCapacity * 0.4),
                        perks: ["All sessions", "Workshop access", "Premium networking", "Certificate", "Lunch & breaks"],
                        accessLevel: "All standard areas plus workshops",
                        reasoning: "Appeals to corporate attendees seeking professional development"
                    },
                    {
                        tierName: "Executive VIP",
                        description: "Ultimate experience for C-level executives and key stakeholders",
                        suggestedPrice: priceRange.max,
                        capacity: Math.round(totalCapacity * 0.2),
                        perks: ["Private executive lounge", "1-on-1 speaker sessions", "Premium dining", "Concierge service", "Exclusive roundtables"],
                        accessLevel: "All areas including executive facilities",
                        reasoning: "Premium positioning for highest-value prospects"
                    }
                ];
            }
            return [];
        },

        concert: () => {
            if (numTiers === 2) {
                return [
                    {
                        tierName: "General Admission",
                        description: "Standing room access to the main performance area",
                        suggestedPrice: priceRange.min,
                        capacity: Math.round(totalCapacity * 0.8),
                        perks: ["Standing area access", "Full show view", "Merchandise booth access"],
                        accessLevel: "General standing area",
                        reasoning: "Most fans want affordable access to see their favorite artists"
                    },
                    {
                        tierName: "VIP Package",
                        description: "Premium seating with exclusive perks and artist access",
                        suggestedPrice: priceRange.max,
                        capacity: Math.round(totalCapacity * 0.2),
                        perks: ["Reserved seating", "Meet & greet", "Exclusive merchandise", "VIP entrance", "Photo opportunity"],
                        accessLevel: "Premium seating section + backstage access",
                        reasoning: "Create memorable experiences for superfans willing to pay premium"
                    }
                ];
            }
            return [];
        },

        festival: () => {
            if (numTiers === 3) {
                return [
                    {
                        tierName: "Festival Pass",
                        description: "3-day access to all stages and activities",
                        suggestedPrice: Math.round(priceRange.min + (priceRange.max - priceRange.min) * 0.3),
                        capacity: Math.round(totalCapacity * 0.6),
                        perks: ["All stage access", "Food court access", "Free water stations", "Festival map & schedule"],
                        accessLevel: "All public festival areas",
                        reasoning: "Most festival-goers want full access at reasonable pricing"
                    },
                    {
                        tierName: "Comfort Plus",
                        description: "Enhanced experience with upgraded amenities",
                        suggestedPrice: Math.round(priceRange.min + (priceRange.max - priceRange.min) * 0.6),
                        capacity: Math.round(totalCapacity * 0.3),
                        perks: ["Elevated viewing areas", "Express entry lanes", "Dedicated restrooms", "Lounge access", "Preferred parking"],
                        accessLevel: "All areas plus comfort zones",
                        reasoning: "Appeals to attendees wanting convenience and comfort"
                    },
                    {
                        tierName: "VIP Glamping",
                        description: "Ultimate luxury festival experience with exclusive perks",
                        suggestedPrice: priceRange.max,
                        capacity: Math.round(totalCapacity * 0.1),
                        perks: ["Artist viewing platform", "Luxury camping setup", "Gourmet catering", "Private bars", "Artist meet & greets", "Spa services"],
                        accessLevel: "All areas including artist zones",
                        reasoning: "Create Instagram-worthy experiences for influencers and luxury seekers"
                    }
                ];
            }
            return [];
        },

        fundraising: () => {
            if (numTiers === 4) {
                return [
                    {
                        tierName: "Supporter",
                        description: "Show your support for our cause",
                        suggestedPrice: Math.round(priceRange.min),
                        capacity: Math.round(totalCapacity * 0.4),
                        perks: ["Event access", "Thank you card", "Tax receipt", "Program recognition"],
                        accessLevel: "General event access",
                        reasoning: "Accessible entry point for community supporters"
                    },
                    {
                        tierName: "Champion",
                        description: "Make a meaningful impact",
                        suggestedPrice: Math.round(priceRange.min + (priceRange.max - priceRange.min) * 0.4),
                        capacity: Math.round(totalCapacity * 0.3),
                        perks: ["Premium seating", "Gift bag", "Photo with speakers", "Newsletter subscription", "Impact report"],
                        accessLevel: "Premium seating area",
                        reasoning: "Mid-tier giving level for engaged supporters"
                    },
                    {
                        tierName: "Patron",
                        description: "Become a valued patron of our mission",
                        suggestedPrice: Math.round(priceRange.min + (priceRange.max - priceRange.min) * 0.7),
                        capacity: Math.round(totalCapacity * 0.2),
                        perks: ["VIP reception", "Exclusive dinner", "Organization tour", "Board member meet", "Annual recognition"],
                        accessLevel: "All areas plus VIP events",
                        reasoning: "Appeals to major donors seeking recognition and access"
                    },
                    {
                        tierName: "Visionary",
                        description: "Lead our vision for the future",
                        suggestedPrice: priceRange.max,
                        capacity: Math.round(totalCapacity * 0.1),
                        perks: ["Private reception", "Speaking opportunity", "Naming rights consideration", "Executive briefing", "Legacy program enrollment"],
                        accessLevel: "All access plus private events",
                        reasoning: "Transform major donors into organizational ambassadors"
                    }
                ];
            }
            return [];
        }
    };

    return suggestions[eventType]?.() || [];
};

// Mock data with proper event-ticket relationships
const mockEvents: Event[] = [
    {
        id: 'evt_001',
        title: 'AI & Machine Learning Summit 2025',
        description: 'Leading conference on artificial intelligence and machine learning innovations',
        date: '2025-07-15',
        endDate: '2025-07-17',
        location: 'San Francisco, CA',
        type: 'conference',
        capacity: 2000,
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
        status: 'published',
        timezone: 'PST',
        venue: {
            name: 'Moscone Center',
            address: '747 Howard St',
            city: 'San Francisco',
            state: 'CA',
            country: 'USA'
        },
        organizer: {
            name: 'TechEvents Inc.',
            contact: 'info@techevents.com'
        },
        priceRange: { min: 199, max: 599 }
    },
    {
        id: 'evt_002',
        title: 'Summer Music Festival 2025',
        description: 'Three days of amazing music across multiple stages',
        date: '2025-08-20',
        endDate: '2025-08-22',
        location: 'Austin, TX',
        type: 'festival',
        capacity: 15000,
        image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop',
        status: 'published',
        timezone: 'CST',
        venue: {
            name: 'Zilker Park',
            address: 'Zilker Park',
            city: 'Austin',
            state: 'TX',
            country: 'USA'
        },
        organizer: {
            name: 'Music Events LLC',
            contact: 'hello@musicevents.com'
        },
        priceRange: { min: 99, max: 899 }
    },
    {
        id: 'evt_003',
        title: 'Annual Charity Gala',
        description: 'Supporting local education initiatives',
        date: '2025-09-15',
        location: 'New York, NY',
        type: 'fundraising',
        capacity: 500,
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop',
        status: 'draft',
        timezone: 'EST',
        venue: {
            name: 'Plaza Hotel',
            address: '768 5th Ave',
            city: 'New York',
            state: 'NY',
            country: 'USA'
        },
        organizer: {
            name: 'Education Foundation',
            contact: 'events@foundation.org'
        },
        priceRange: { min: 150, max: 2500 }
    }
];

const EnhancedTicketManagement = () => {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(mockEvents[0]);
    const [tickets, setTickets] = useState<TicketTier[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Modal states
    const [showEventSelector, setShowEventSelector] = useState(false);
    const [showTicketCreator, setShowTicketCreator] = useState(false);
    const [showAIWizard, setShowAIWizard] = useState(false);

    // AI Wizard states
    const [wizardStep, setWizardStep] = useState(1);
    const [numTiers, setNumTiers] = useState<number>(2);
    const [aiSuggestions, setAiSuggestions] = useState<AITicketSuggestion[]>([]);
    const [acceptedSuggestions, setAcceptedSuggestions] = useState<boolean[]>([]);
    const [ticketTiers, setTicketTiers] = useState<TicketTierDraft[]>([]);

    // Fixed: Added proper dependencies and error handling
    useEffect(() => {
        if (selectedEvent && numTiers > 0) {
            try {
                const suggestions = generateAISuggestions(
                    selectedEvent.type,
                    numTiers,
                    selectedEvent.capacity,
                    selectedEvent.priceRange
                );
                setAiSuggestions(suggestions);
                setAcceptedSuggestions(new Array(suggestions.length).fill(false));
            } catch (error) {
                console.error('Error generating AI suggestions:', error);
                setAiSuggestions([]);
                setAcceptedSuggestions([]);
            }
        }
    }, [selectedEvent, numTiers]);

    // Fixed: Improved state synchronization and error handling
    const acceptSuggestion = useCallback((index: number) => {
        if (index < 0 || index >= aiSuggestions.length) return;

        const suggestion = aiSuggestions[index];
        const tierColors = [
            'from-blue-500 to-blue-600',
            'from-purple-500 to-purple-600',
            'from-emerald-500 to-emerald-600',
            'from-orange-500 to-orange-600'
        ];
        const tierIcons = ['🎫', '👑', '🏆', '💎'];

        const newTier: TicketTierDraft = {
            name: suggestion.tierName,
            description: suggestion.description,
            price: suggestion.suggestedPrice,
            capacity: suggestion.capacity,
            perks: [...suggestion.perks], // Create a copy to avoid mutation
            accessAreas: [suggestion.accessLevel],
            restrictions: {
                maxPerPerson: 10,
                transferable: true,
                refundable: true
            },
            appearance: {
                color: tierColors[index % tierColors.length],
                icon: tierIcons[index % tierIcons.length]
            }
        };

        // Fixed: Proper state updates to avoid race conditions
        setTicketTiers(prevTiers => {
            const newTiers = [...prevTiers];
            newTiers[index] = newTier;
            return newTiers;
        });

        setAcceptedSuggestions(prevAccepted => {
            const newAccepted = [...prevAccepted];
            newAccepted[index] = true;
            return newAccepted;
        });
    }, [aiSuggestions]);

    const regenerateSuggestions = useCallback(() => {
        if (selectedEvent) {
            try {
                const suggestions = generateAISuggestions(
                    selectedEvent.type,
                    numTiers,
                    selectedEvent.capacity,
                    selectedEvent.priceRange
                );
                setAiSuggestions(suggestions);
                setAcceptedSuggestions(new Array(suggestions.length).fill(false));
                setTicketTiers([]);
            } catch (error) {
                console.error('Error regenerating suggestions:', error);
            }
        }
    }, [selectedEvent, numTiers]);

    // Fixed: Better state reset when closing wizard
    const resetWizard = useCallback(() => {
        setShowAIWizard(false);
        setWizardStep(1);
        setNumTiers(2);
        setAcceptedSuggestions([]);
        setTicketTiers([]);
    }, []);

    // Event Selection Modal
    const EventSelector = () => (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-[90vh] overflow-hidden"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
            >
                <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-orange-50">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">Select Event</h2>
                        <button
                            onClick={() => setShowEventSelector(false)}
                            className="p-2 rounded-xl hover:bg-white transition-all"
                            aria-label="Close modal"
                        >
                            <FiX className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {mockEvents.map((event) => (
                            <motion.div
                                key={event.id}
                                className={`border-2 rounded-2xl p-6 cursor-pointer transition-all ${selectedEvent?.id === event.id
                                    ? 'border-orange-500 bg-orange-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                onClick={() => setSelectedEvent(event)}
                                whileHover={{ scale: 1.02 }}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        setSelectedEvent(event);
                                    }
                                }}
                                aria-label={`Select ${event.title}`}
                            >
                                <div className="aspect-video rounded-xl overflow-hidden mb-4">
                                    <Image
                                        src={event.image}
                                        alt={`${event.title} event image`}
                                        width={400}
                                        height={300}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <FiCalendar className="w-4 h-4" />
                                        {new Date(event.date).toLocaleDateString()}
                                        {event.endDate && ` - ${new Date(event.endDate).toLocaleDateString()}`}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <FiMapPin className="w-4 h-4" />
                                        {event.location}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <FiUsers className="w-4 h-4" />
                                        Capacity: {event.capacity.toLocaleString()}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-6 pt-6 border-t">
                        <motion.button
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-blue-600 hover:to-blue-700 transition-all"
                            whileHover={{ scale: 1.02 }}
                        >
                            <FiPlus className="w-5 h-5" />
                            Create New Event
                        </motion.button>
                    </div>
                </div>

                <div className="p-6 border-t flex justify-end gap-4">
                    <button
                        onClick={() => setShowEventSelector(false)}
                        className="px-6 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => setShowEventSelector(false)}
                        className="px-6 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        disabled={!selectedEvent}
                    >
                        Continue
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );

    // AI Wizard Modal
    const AIWizardModal = () => {
        // Step 1: Tier Planning
        const TierPlanningStep = () => (
            <div className="space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Let&apos;s design your ticket tiers</h2>
                    <p className="text-gray-600 text-lg">How many different ticket types do you want to offer?</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                    {[1, 2, 3, 4].map((num) => (
                        <motion.button
                            key={num}
                            onClick={() => setNumTiers(num)}
                            className={`p-6 rounded-2xl border-2 transition-all ${numTiers === num
                                ? 'border-orange-500 bg-orange-50 text-orange-700'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label={`Select ${num} tier${num > 1 ? 's' : ''}`}
                        >
                            <div className="text-3xl font-bold mb-2">{num}</div>
                            <div className="text-sm">
                                {num === 1 ? 'Single tier' :
                                    num === 2 ? 'Basic + Premium' :
                                        num === 3 ? 'Good, Better, Best' :
                                            'Maximum variety'}
                            </div>
                        </motion.button>
                    ))}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-3xl mx-auto">
                    <div className="flex items-start gap-3">
                        <MdLightbulbOutline className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-blue-900 mb-2">AI Recommendation</h3>
                            <p className="text-blue-800">
                                {selectedEvent?.type === 'conference' ?
                                    "For conferences, 2-3 tiers work best: one affordable option for broader reach, and premium tiers for sponsors and VIPs." :
                                    selectedEvent?.type === 'festival' ?
                                        "Festivals benefit from 3+ tiers: general admission for volume, comfort upgrades for convenience seekers, and VIP for luxury experiences." :
                                        selectedEvent?.type === 'fundraising' ?
                                            "Fundraising events often use 3-4 tiers to maximize donation potential while providing meaningful recognition at each level." :
                                            "Consider your audience's willingness to pay and create clear value distinction between tiers."
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {numTiers > 0 && (
                    <div className="flex justify-center">
                        <motion.button
                            onClick={() => setWizardStep(2)}
                            className="bg-orange-500 text-white px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-3 hover:bg-orange-600 transition-colors"
                            whileHover={{ scale: 1.05 }}
                        >
                            Generate AI Suggestions
                            <FiArrowRight className="w-5 h-5" />
                        </motion.button>
                    </div>
                )}
            </div>
        );

        // Step 2: AI Suggestions
        const AISuggestionsStep = () => (
            <div className="space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        <HiSparkles className="inline w-8 h-8 text-orange-500 mr-2" />
                        AI-Generated Suggestions
                    </h2>
                    <p className="text-gray-600 text-lg">Based on your {selectedEvent?.type} event, here are optimized ticket tiers</p>
                    <button
                        onClick={regenerateSuggestions}
                        className="mt-3 text-orange-600 hover:text-orange-700 flex items-center gap-2 mx-auto transition-colors"
                    >
                        <FiRefreshCw className="w-4 h-4" />
                        Generate new suggestions
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {aiSuggestions.slice(0, numTiers).map((suggestion, index) => (
                        <motion.div
                            key={`${suggestion.tierName}-${index}`}
                            className={`border-2 rounded-2xl p-6 transition-all ${acceptedSuggestions[index]
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-orange-300'
                                }`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{suggestion.tierName}</h3>
                                    <p className="text-2xl font-bold text-orange-600">${suggestion.suggestedPrice}</p>
                                </div>
                                <div className="text-right text-sm text-gray-500">
                                    <div>{suggestion.capacity} tickets</div>
                                    <div>{Math.round((suggestion.capacity / (selectedEvent?.capacity || 1)) * 100)}% of total</div>
                                </div>
                            </div>

                            <p className="text-gray-600 mb-4">{suggestion.description}</p>

                            <div className="mb-4">
                                <h4 className="font-semibold text-gray-800 mb-2">Included Benefits:</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    {suggestion.perks.slice(0, 4).map((perk, perkIndex) => (
                                        <li key={`perk-${index}-${perkIndex}`} className="flex items-center gap-2">
                                            <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                                            {perk}
                                        </li>
                                    ))}
                                    {suggestion.perks.length > 4 && (
                                        <li className="text-gray-500">+{suggestion.perks.length - 4} more benefits</li>
                                    )}
                                </ul>
                            </div>

                            {/* Fixed: Added proper flex layout for icon + text */}
                            <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                <div className="flex items-start gap-2">
                                    <MdLightbulbOutline className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-gray-700">{suggestion.reasoning}</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                {acceptedSuggestions[index] ? (
                                    <button
                                        className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                                        disabled
                                    >
                                        <FiCheck className="w-5 h-5" />
                                        Accepted
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => acceptSuggestion(index)}
                                            className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <FiThumbsUp className="w-4 h-4" />
                                            Use This
                                        </button>
                                        <button
                                            className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                                            aria-label="Edit suggestion"
                                        >
                                            <FiEdit3 className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Fixed: Added safety check for selectedEvent */}
                {selectedEvent && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                        <div className="flex items-start gap-3">
                            <FiTarget className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                            <div className="flex-1">
                                <h3 className="font-semibold text-yellow-900 mb-2">Capacity Distribution</h3>
                                <p className="text-yellow-800 mb-3">
                                    Total capacity: {selectedEvent.capacity.toLocaleString()} |
                                    Allocated: {aiSuggestions.slice(0, numTiers).reduce((sum, s) => sum + s.capacity, 0).toLocaleString()} |
                                    Remaining: {selectedEvent.capacity - aiSuggestions.slice(0, numTiers).reduce((sum, s) => sum + s.capacity, 0)} tickets
                                </p>
                                <div className="flex gap-2">
                                    {aiSuggestions.slice(0, numTiers).map((suggestion, index) => (
                                        <div
                                            key={`capacity-${index}`}
                                            className="flex-1 bg-yellow-200 rounded-lg p-2 text-center text-sm"
                                        >
                                            <div className="font-semibold">{suggestion.tierName}</div>
                                            <div>{Math.round((suggestion.capacity / selectedEvent.capacity) * 100)}%</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-between">
                    <motion.button
                        onClick={() => setWizardStep(1)}
                        className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-300 transition-colors"
                        whileHover={{ scale: 1.05 }}
                    >
                        <FiArrowLeft className="w-5 h-5" />
                        Back
                    </motion.button>

                    {acceptedSuggestions.some(accepted => accepted) && (
                        <motion.button
                            onClick={() => setWizardStep(3)}
                            className="bg-orange-500 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-orange-600 transition-colors"
                            whileHover={{ scale: 1.05 }}
                        >
                            Customize Details
                            <FiArrowRight className="w-5 h-5" />
                        </motion.button>
                    )}
                </div>
            </div>
        );

        // Step 3: Customization
        const CustomizationStep = () => (
            <div className="space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Fine-tune your ticket tiers</h2>
                    <p className="text-gray-600 text-lg">Customize the details for each accepted tier</p>
                </div>

                <div className="space-y-8">
                    {ticketTiers.map((tier, index) => (
                        <motion.div
                            key={`tier-${index}`}
                            className="bg-white border border-gray-200 rounded-2xl p-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Basic Info */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                        <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${tier.appearance.color}`}></span>
                                        Tier {index + 1} Details
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor={`tier-name-${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                                                Tier Name
                                            </label>
                                            <input
                                                id={`tier-name-${index}`}
                                                type="text"
                                                value={tier.name}
                                                onChange={(e) => {
                                                    const newTiers = [...ticketTiers];
                                                    newTiers[index].name = e.target.value;
                                                    setTicketTiers(newTiers);
                                                }}
                                                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor={`tier-description-${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                                                Description
                                            </label>
                                            <textarea
                                                id={`tier-description-${index}`}
                                                value={tier.description}
                                                onChange={(e) => {
                                                    const newTiers = [...ticketTiers];
                                                    newTiers[index].description = e.target.value;
                                                    setTicketTiers(newTiers);
                                                }}
                                                rows={3}
                                                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 outline-none resize-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Pricing & Capacity */}
                                <div>
                                    <h4 className="text-lg font-semibold mb-4">Pricing & Availability</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor={`tier-price-${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                                                Price
                                            </label>
                                            <div className="relative">
                                                <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    id={`tier-price-${index}`}
                                                    type="number"
                                                    min="0"
                                                    value={tier.price}
                                                    onChange={(e) => {
                                                        const newTiers = [...ticketTiers];
                                                        newTiers[index].price = Math.max(0, parseInt(e.target.value) || 0);
                                                        setTicketTiers(newTiers);
                                                    }}
                                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor={`tier-capacity-${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                                                Capacity
                                            </label>
                                            <div className="relative">
                                                <FiUsers className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    id={`tier-capacity-${index}`}
                                                    type="number"
                                                    min="1"
                                                    value={tier.capacity}
                                                    onChange={(e) => {
                                                        const newTiers = [...ticketTiers];
                                                        newTiers[index].capacity = Math.max(1, parseInt(e.target.value) || 1);
                                                        setTicketTiers(newTiers);
                                                    }}
                                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor={`tier-max-person-${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                                                Max per person
                                            </label>
                                            <input
                                                id={`tier-max-person-${index}`}
                                                type="number"
                                                min="1"
                                                value={tier.restrictions.maxPerPerson}
                                                onChange={(e) => {
                                                    const newTiers = [...ticketTiers];
                                                    newTiers[index].restrictions.maxPerPerson = Math.max(1, parseInt(e.target.value) || 1);
                                                    setTicketTiers(newTiers);
                                                }}
                                                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Perks & Benefits */}
                                <div>
                                    <h4 className="text-lg font-semibold mb-4">Benefits & Perks</h4>
                                    <div className="space-y-3">
                                        {tier.perks.map((perk, perkIndex) => (
                                            <div key={`perk-${index}-${perkIndex}`} className="flex items-center gap-3">
                                                <input
                                                    type="text"
                                                    value={perk}
                                                    onChange={(e) => {
                                                        const newTiers = [...ticketTiers];
                                                        newTiers[index].perks[perkIndex] = e.target.value;
                                                        setTicketTiers(newTiers);
                                                    }}
                                                    className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                                    placeholder="Enter benefit..."
                                                />
                                                <button
                                                    onClick={() => {
                                                        const newTiers = [...ticketTiers];
                                                        newTiers[index].perks.splice(perkIndex, 1);
                                                        setTicketTiers(newTiers);
                                                    }}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    aria-label="Remove perk"
                                                >
                                                    <FiX className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => {
                                                const newTiers = [...ticketTiers];
                                                newTiers[index].perks.push('');
                                                setTicketTiers(newTiers);
                                            }}
                                            className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-orange-400 hover:text-orange-600 transition-all flex items-center justify-center"
                                        >
                                            <FiPlus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="flex justify-between">
                    <motion.button
                        onClick={() => setWizardStep(2)}
                        className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-300 transition-colors"
                        whileHover={{ scale: 1.05 }}
                    >
                        <FiArrowLeft className="w-5 h-5" />
                        Back to Suggestions
                    </motion.button>

                    <motion.button
                        onClick={() => {
                            // TODO: Save and create tickets
                            resetWizard();
                            // Convert TicketTierDraft to TicketTier and save
                        }}
                        className="bg-orange-500 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-orange-600 transition-colors"
                        whileHover={{ scale: 1.05 }}
                    >
                        <FiCheck className="w-5 h-5" />
                        Create Ticket Tiers
                    </motion.button>
                </div>
            </div>
        );

        return (
            <AnimatePresence>
                {showAIWizard && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="w-full max-w-7xl bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-[95vh] overflow-hidden"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                        >
                            {/* Progress Header */}
                            <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-orange-50">
                                <div className="flex items-center justify-between mb-4">
                                    <h1 className="text-2xl font-bold text-gray-900">AI Ticket Tier Setup</h1>
                                    <button
                                        onClick={resetWizard}
                                        className="p-2 rounded-xl hover:bg-white transition-all"
                                        aria-label="Close wizard"
                                    >
                                        <FiX className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Progress Steps */}
                                <div className="flex items-center gap-4">
                                    {[
                                        { step: 1, label: 'Plan Tiers' },
                                        { step: 2, label: 'AI Suggestions' },
                                        { step: 3, label: 'Customize' }
                                    ].map((item) => (
                                        <div key={item.step} className="flex items-center gap-2">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${wizardStep >= item.step
                                                ? 'bg-orange-500 text-white'
                                                : 'bg-gray-200 text-gray-600'
                                                }`}>
                                                {wizardStep > item.step ? <FiCheck className="w-4 h-4" /> : item.step}
                                            </div>
                                            <span className={`text-sm font-medium transition-all ${wizardStep >= item.step ? 'text-gray-900' : 'text-gray-500'
                                                }`}>
                                                {item.label}
                                            </span>
                                            {item.step < 3 && <FiArrowRight className="w-4 h-4 text-gray-400 ml-2" />}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 max-h-[80vh] overflow-y-auto">
                                {wizardStep === 1 && <TierPlanningStep />}
                                {wizardStep === 2 && <AISuggestionsStep />}
                                {wizardStep === 3 && <CustomizationStep />}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    };

    return (
        <div className="space-y-8 p-8">
            {/* Header with Event Context */}
            <motion.div
                className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <h1 className="text-5xl font-bold flex items-center gap-3">
                                    <HiOutlineTicket className="w-12 h-12" />
                                    Ticket Builder
                                </h1>
                            </div>
                            {selectedEvent ? (
                                <div>
                                    <h2 className="text-2xl font-semibold mb-2">{selectedEvent.title}</h2>
                                    <div className="flex flex-wrap gap-4 text-orange-100">
                                        <span className="flex items-center gap-1">
                                            <FiCalendar className="w-4 h-4" />
                                            {new Date(selectedEvent.date).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FiMapPin className="w-4 h-4" />
                                            {selectedEvent.location}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FiUsers className="w-4 h-4" />
                                            {selectedEvent.capacity.toLocaleString()} capacity
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-orange-100 text-lg">AI-powered ticket creation for any event type</p>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <motion.button
                                onClick={() => setShowEventSelector(true)}
                                className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-2xl font-semibold hover:bg-white/30 transition-all flex items-center gap-2"
                                whileHover={{ scale: 1.05 }}
                            >
                                <FiGlobe className="w-5 h-5" />
                                Switch Event
                            </motion.button>

                            {selectedEvent && (
                                <>
                                    <motion.button
                                        onClick={() => setShowAIWizard(true)}
                                        className="bg-white text-orange-600 px-8 py-3 rounded-2xl font-bold text-lg hover:bg-orange-50 transition-all shadow-lg flex items-center gap-3"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <HiSparkles className="w-6 h-6" />
                                        AI  Setup
                                    </motion.button>

                                    <motion.button
                                        onClick={() => setShowTicketCreator(true)}
                                        className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-2xl font-semibold hover:bg-white/30 transition-all flex items-center gap-2"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <FiPlus className="w-5 h-5" />
                                        Manual Create
                                    </motion.button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Quick Start Options */}
            {selectedEvent && tickets.length === 0 && (
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <motion.div
                        className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all"
                        onClick={() => setShowAIWizard(true)}
                        whileHover={{ scale: 1.02, y: -4 }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                setShowAIWizard(true);
                            }
                        }}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                                <HiSparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">AI-Powered Setup</h3>
                                <p className="text-orange-700">Recommended</p>
                            </div>
                        </div>
                        <p className="text-gray-700 mb-4">
                            Let AI analyze your {selectedEvent.type} event and suggest optimized ticket tiers based on industry best practices.
                        </p>
                        <div className="flex items-center text-orange-600 font-semibold">
                            <span>Get started</span>
                            <FiArrowRight className="w-4 h-4 ml-2" />
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-white border border-gray-200 rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all"
                        onClick={() => setShowTicketCreator(true)}
                        whileHover={{ scale: 1.02, y: -4 }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                setShowTicketCreator(true);
                            }
                        }}
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-gray-500 rounded-xl flex items-center justify-center">
                                <FiSettings className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Manual Setup</h3>
                                <p className="text-gray-600">Full control</p>
                            </div>
                        </div>
                        <p className="text-gray-700 mb-4">
                            Create ticket tiers from scratch with complete control over every detail and configuration.
                        </p>
                        <div className="flex items-center text-gray-600 font-semibold">
                            <span>Build manually</span>
                            <FiArrowRight className="w-4 h-4 ml-2" />
                        </div>
                    </motion.div>
                </motion.div>
            )}

            {/* Existing tickets would go here */}
            {selectedEvent && tickets.length > 0 && (
                <div className="space-y-6">
                    {/* Ticket management interface would go here */}
                    <p className="text-gray-500 text-center py-8">Ticket tiers will be displayed here...</p>
                </div>
            )}

            {/* Modals */}
            <AnimatePresence>
                {showEventSelector && <EventSelector />}
                {showTicketCreator && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-[95vh] overflow-hidden"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                        >
                            <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-orange-50">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold text-gray-900">Create Ticket Tier (Manual)</h2>
                                    <button
                                        onClick={() => setShowTicketCreator(false)}
                                        className="p-2 rounded-xl hover:bg-white transition-all"
                                        aria-label="Close modal"
                                    >
                                        <FiX className="w-5 h-5" />
                                    </button>
                                </div>
                                <p className="text-gray-600 mt-2">For: {selectedEvent?.title}</p>
                            </div>
                            <div className="p-6 text-center py-20">
                                <p className="text-gray-500">Manual ticket creation form would go here...</p>
                                <p className="text-sm text-gray-400 mt-2">This would include all the detailed form fields from your original component</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AIWizardModal />
        </div>
    );
};

export default EnhancedTicketManagement;