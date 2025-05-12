'use client';

// import { useState, useEffect } from 'react';
import Link from 'next/link';

type SuccessType = 'event' | 'ticket' | 'profile' | 'general';

interface SuccessPageProps {
    type: SuccessType;
}

export default function SuccessPage({ type = 'general' }: SuccessPageProps) {
    // Define content based on success type
    const getContent = () => {
        switch (type) {
            case 'event':
                return {
                    title: 'Event Created Successfully!',
                    message: 'Your event has been published and is now live. Share it with your audience to start selling tickets.',
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-rovify-lavender" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    ),
                    primaryAction: {
                        text: 'View Event',
                        link: '/'
                    },
                    secondaryAction: {
                        text: 'Create Another Event',
                        link: '/create'
                    }
                };
            case 'ticket':
                return {
                    title: 'Ticket Purchased Successfully!',
                    message: 'Your ticket has been added to your wallet. You can view and manage it from your tickets page.',
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-rovify-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                        </svg>
                    ),
                    primaryAction: {
                        text: 'View Ticket',
                        link: '/tickets'
                    },
                    secondaryAction: {
                        text: 'Browse More Events',
                        link: '/'
                    }
                };
            case 'profile':
                return {
                    title: 'Profile Updated!',
                    message: 'Your profile information has been successfully updated.',
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-rovify-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    ),
                    primaryAction: {
                        text: 'View Profile',
                        link: '/profile'
                    },
                    secondaryAction: {
                        text: 'Back to Home',
                        link: '/'
                    }
                };
            default:
                return {
                    title: 'Success!',
                    message: 'Your action has been completed successfully.',
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                    primaryAction: {
                        text: 'Back to Home',
                        link: '/'
                    },
                    secondaryAction: {
                        text: 'My Account',
                        link: '/profile'
                    }
                };
        }
    };

    const content = getContent();

    return (
        <div className="min-h-screen bg-gradient-to-br from-rovify-black to-black text-white flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                <div className="flex flex-col items-center text-center">
                    {/* Success Animation */}
                    <div className="mb-6 relative">
                        <div className="absolute inset-0 rounded-full bg-white/10 animate-ping opacity-25"></div>
                        <div className="relative">
                            {content.icon}
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold mb-3">{content.title}</h1>
                    <p className="text-white/70 mb-8">{content.message}</p>

                    <div className="w-full space-y-3">
                        <Link
                            href={content.primaryAction.link}
                            className="block w-full py-3 bg-gradient-to-r from-rovify-orange to-rovify-lavender hover:opacity-90 rounded-lg font-medium text-center transition-opacity"
                        >
                            {content.primaryAction.text}
                        </Link>

                        <Link
                            href={content.secondaryAction.link}
                            className="block w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg font-medium text-center transition-colors"
                        >
                            {content.secondaryAction.text}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Confetti Effect */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute top-0 w-2 h-2 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            backgroundColor: [
                                '#FF1F00', // Neon Orange
                                '#C281FF', // Lavender
                                '#77A8FF', // Electric Blue
                                '#FFFFFF'  // White
                            ][Math.floor(Math.random() * 4)],
                            animation: `confetti ${3 + Math.random() * 5}s linear infinite`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    ></div>
                ))}

                <style jsx>{`
          @keyframes confetti {
            0% {
              transform: translateY(-10px) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }
        `}</style>
            </div>
        </div>
    );
}