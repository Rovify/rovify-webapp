/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface TicketSectionProps {
    event: Event;
    onTicketSelect: (type: string, quantity: number) => void;
}

export function TicketSection({ event, onTicketSelect }: TicketSectionProps) {
    const [selectedTicketType, setSelectedTicketType] = useState<string | null>(null);
    const [ticketQuantity, setTicketQuantity] = useState(1);
    const [isWaitlisted, setIsWaitlisted] = useState(false);
    const [showDiscount, setShowDiscount] = useState(false);
    const [availableTickets, setAvailableTickets] = useState(event.totalTickets - event.soldTickets);

    // Calculate if tickets are sold out
    const isSoldOut = availableTickets <= 0;

    // For the high volume discount promotion
    const DISCOUNT_THRESHOLD = 5; // 5 or more tickets

    // Handle quantity changes with validation
    const incrementQuantity = () => {
        if (ticketQuantity < availableTickets && ticketQuantity < 10) {
            const newQuantity = ticketQuantity + 1;
            setTicketQuantity(newQuantity);

            // Check if threshold reached for discount/celebration
            if (newQuantity >= DISCOUNT_THRESHOLD && !showDiscount) {
                setShowDiscount(true);
                // Trigger celebration animation
                triggerCelebration();
            }
        } else if (ticketQuantity >= availableTickets) {
            // Show alert that max available tickets reached
            showMaxTicketsAlert();
        }
    };

    const decrementQuantity = () => {
        if (ticketQuantity > 1) {
            const newQuantity = ticketQuantity - 1;
            setTicketQuantity(newQuantity);

            // Hide discount if dropping below threshold
            if (newQuantity < DISCOUNT_THRESHOLD && showDiscount) {
                setShowDiscount(false);
            }
        }
    };

    // Celebration animation
    const triggerCelebration = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    };

    // Alert for max tickets
    const showMaxTicketsAlert = () => {
        // Implementation with toast notification
    };

    // Join waitlist functionality
    const handleJoinWaitlist = () => {
        setIsWaitlisted(true);
        // API call to add user to waitlist
    };

    // Update selected ticket and notify parent
    useEffect(() => {
        if (selectedTicketType) {
            onTicketSelect(selectedTicketType, ticketQuantity);
        }
    }, [selectedTicketType, ticketQuantity, onTicketSelect]);

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Available Tickets</h3>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Available:</span>
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                        <div
                            className="h-full bg-gradient-to-r from-[#FF5722] to-[#FF9800]"
                            style={{ width: `${100 - (availableTickets / event.totalTickets) * 100}%` }}
                        ></div>
                    </div>
                    <span className="text-sm text-gray-700 font-medium">
                        {availableTickets}/{event.totalTickets}
                    </span>
                </div>
            </div>

            {/* Sold Out State */}
            {isSoldOut ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-100 rounded-lg p-6 text-center"
                >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Tickets Sold Out</h4>
                    <p className="text-gray-600 mb-4">This event is currently sold out, but you can join our waitlist to be notified if more tickets become available.</p>

                    {!isWaitlisted ? (
                        <button
                            onClick={handleJoinWaitlist}
                            className="px-6 py-3 bg-[#FF5722] text-white rounded-full font-medium shadow-md hover:bg-[#E64A19] transition-colors"
                        >
                            Join Waitlist
                        </button>
                    ) : (
                        <div className="flex items-center justify-center space-x-2 text-green-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <span>You&apos;re on the waitlist!</span>
                        </div>
                    )}
                </motion.div>
            ) : (
                <>
                    {/* Ticket Types */}
                    <div className="space-y-4">
                        {/* General Admission */}
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            className={`p-4 border rounded-lg transition-all ${selectedTicketType === 'general'
                                ? 'border-[#FF5722] bg-gradient-to-r from-[#FF5722]/10 to-[#FF5722]/5 shadow-md'
                                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                }`}
                        >
                            {/* Ticket content here */}
                            <button
                                onClick={() => setSelectedTicketType('general')}
                                className={`text-sm px-4 py-2 rounded-full font-medium transition-all ${selectedTicketType === 'general'
                                    ? 'bg-[#FF5722] text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Select
                            </button>
                        </motion.div>

                        {/* VIP Ticket similar to above */}
                    </div>

                    {/* Discount Alert */}
                    <AnimatePresence>
                        {showDiscount && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-green-50 border border-green-100 rounded-lg p-4 mt-4"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="bg-green-100 rounded-full p-2">
                                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-green-800">Group discount applied!</p>
                                        <p className="text-sm text-green-600">10% off for booking {DISCOUNT_THRESHOLD}+ tickets</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Quantity selector would be part of the fixed bottom bar */}
                </>
            )}
        </div>
    );
}