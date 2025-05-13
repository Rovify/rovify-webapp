/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiSearch, FiChevronDown, FiChevronUp, FiArrowLeft, FiMessageSquare, FiMail, FiHelpCircle, FiUser, FiCalendar, FiCreditCard, FiSmartphone } from 'react-icons/fi';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';

// FAQ categories and questions
const faqData = {
    account: [
        {
            question: "How do I create an account?",
            answer: "You can create an account by clicking the 'Sign Up' button in the top-right corner of the home page. You'll need to provide your email address, create a password, and verify your email to complete the registration."
        },
        {
            question: "How do I reset my password?",
            answer: "If you've forgotten your password, click on 'Login', then select 'Forgot Password'. Enter your email address and we'll send you a password reset link. Follow the instructions in the email to set a new password."
        },
        {
            question: "How do I connect my crypto wallet?",
            answer: "To connect your crypto wallet, go to your Profile page and click on 'Connect Wallet'. You can then choose to connect with MetaMask, WalletConnect, or other supported wallets. Follow the prompts in your wallet to complete the connection."
        }
    ],
    events: [
        {
            question: "How do I create an event?",
            answer: "To create an event, click the '+' button in the navigation bar and fill out the event details form. You'll need to provide event title, description, date, location, and ticket information. You can also choose to offer NFT tickets for your event."
        },
        {
            question: "Can I edit an event after publishing it?",
            answer: "Yes, you can edit most details of your event after publishing by going to your Profile page, selecting the event, and clicking 'Edit'. However, some changes may be restricted after tickets have been sold."
        },
        {
            question: "How do I find events near me?",
            answer: "You can find events near you by using the Explore tab and allowing location access. You can also search for events by city or use filters to find events by category, date, or price range."
        }
    ],
    tickets: [
        {
            question: "What are NFT tickets?",
            answer: "NFT tickets are blockchain-based digital tickets that provide proof of ownership on the blockchain. They offer benefits like enhanced security against counterfeiting, potential for future resale value, and can serve as digital collectibles after the event."
        },
        {
            question: "How do I purchase tickets?",
            answer: "To purchase tickets, navigate to the event page and click 'Buy Tickets'. Select the ticket type and quantity, then proceed to checkout. You can pay with credit card, PayPal, or cryptocurrency for NFT tickets."
        },
        {
            question: "Can I transfer my tickets to someone else?",
            answer: "Yes, you can transfer tickets to another Rovify user. Go to your Tickets page, select the ticket you want to transfer, and click 'Transfer'. Enter the recipient's email or username to complete the transfer."
        }
    ],
    payments: [
        {
            question: "What payment methods are accepted?",
            answer: "We accept credit/debit cards (Visa, Mastercard, American Express), PayPal, and various cryptocurrencies including ETH, MATIC, and USDC for NFT tickets."
        },
        {
            question: "Are there any fees for purchasing tickets?",
            answer: "Yes, there is a service fee for each ticket purchase. The fee amount will be displayed during checkout before you complete your purchase. For cryptocurrency transactions, network gas fees may also apply."
        },
        {
            question: "What is your refund policy?",
            answer: "Refund policies are set by event organizers and vary by event. The refund policy for each event is displayed on the event page before purchase. For NFT tickets, refunds may be subject to additional blockchain-related limitations."
        }
    ],
    app: [
        {
            question: "Is there a mobile app available?",
            answer: "Yes, Rovify is available as a web app and as a native app for iOS and Android devices. You can download the app from the App Store or Google Play Store."
        },
        {
            question: "How do I download my tickets to my phone?",
            answer: "Your tickets are automatically available in the 'Tickets' section of your account. For easier access, you can add tickets to your phone's wallet app or download them as PDF files for offline access."
        },
        {
            question: "Can I use Rovify without creating an account?",
            answer: "You can browse events without an account, but you'll need to create an account to purchase tickets, create events, or use other personalized features."
        }
    ]
};

export default function HelpPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('account');
    const [expandedFaqs, setExpandedFaqs] = useState<{ [key: string]: boolean }>({});

    const toggleFaq = (category: string, index: number) => {
        const key = `${category}-${index}`;
        setExpandedFaqs(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Filter FAQs based on search query
    const filteredFaqs = searchQuery
        ? Object.entries(faqData).reduce((acc, [category, questions]) => {
            const filteredQuestions = questions.filter(
                faq =>
                    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (filteredQuestions.length > 0) {
                acc[category as keyof typeof faqData] = filteredQuestions;
            }

            return acc;
        }, {} as Record<keyof typeof faqData, { question: string; answer: string; }[]>)
        : faqData;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto px-4 py-6 pt-24 pb-28">
                <div className="max-w-3xl mx-auto">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                        <Link href="/" className="hover:text-[#FF5722] transition-colors">Home</Link>
                        <span>/</span>
                        <span className="font-medium text-gray-700">Help & Support</span>
                    </div>

                    {/* Page Header */}
                    <div className="mb-6 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">How can we help you?</h1>
                        <p className="text-gray-600 mb-8">Find answers to common questions or contact our support team</p>

                        {/* Search Bar */}
                        <div className="max-w-md mx-auto relative">
                            <input
                                type="text"
                                placeholder="Search for help topics..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-3 pl-10 rounded-xl bg-white shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:border-transparent"
                            />
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    {searchQuery ? (
                        // Search Results
                        <div className="mb-10">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Search Results for &quot;{searchQuery}&quot;
                            </h2>

                            {Object.keys(filteredFaqs).length > 0 ? (
                                Object.entries(filteredFaqs).map(([category, questions]) => (
                                    <div key={category} className="mb-6">
                                        <h3 className="text-md font-medium text-gray-800 capitalize mb-3">
                                            {category}
                                        </h3>
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                            {questions.map((faq, index) => {
                                                const key = `${category}-${index}`;
                                                return (
                                                    <div key={key} className="border-b border-gray-100 last:border-none">
                                                        <button
                                                            onClick={() => toggleFaq(category, index)}
                                                            className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
                                                        >
                                                            <span className="font-medium text-gray-900">
                                                                {faq.question}
                                                            </span>
                                                            {expandedFaqs[key] ? (
                                                                <FiChevronUp className="text-gray-400 flex-shrink-0" />
                                                            ) : (
                                                                <FiChevronDown className="text-gray-400 flex-shrink-0" />
                                                            )}
                                                        </button>

                                                        {expandedFaqs[key] && (
                                                            <div className="px-6 pb-6 prose text-gray-600">
                                                                <p>{faq.answer}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 bg-white rounded-xl shadow-sm border border-gray-100">
                                    <FiHelpCircle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">No results found</h3>
                                    <p className="text-gray-600 mb-4">
                                        We couldn&apos;t find any help articles matching your search.
                                    </p>
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="px-4 py-2 bg-[#FF5722]/10 text-[#FF5722] rounded-lg font-medium hover:bg-[#FF5722]/20 transition-colors"
                                    >
                                        Clear Search
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Regular Help Page Content
                        <>
                            {/* Help Topic Categories */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                                {[
                                    { id: 'account', name: 'Account', icon: FiUser },
                                    { id: 'events', name: 'Events', icon: FiCalendar },
                                    { id: 'tickets', name: 'Tickets', icon: FiMessageSquare },
                                    { id: 'payments', name: 'Payments', icon: FiCreditCard },
                                    { id: 'app', name: 'Mobile App', icon: FiSmartphone },
                                    { id: 'contact', name: 'Contact Us', icon: FiMail }
                                ].map((category) => (
                                    <button
                                        key={category.id}
                                        onClick={() => category.id === 'contact' ? null : setActiveCategory(category.id)}
                                        className={`p-4 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow text-center ${activeCategory === category.id ? 'border-[#FF5722]/50' : 'border-gray-100'
                                            }`}
                                    >
                                        <div className={`h-12 w-12 mx-auto rounded-full flex items-center justify-center mb-2 ${activeCategory === category.id
                                            ? 'bg-[#FF5722]/10 text-[#FF5722]'
                                            : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            <category.icon className="h-6 w-6" />
                                        </div>
                                        <h3 className={`font-medium ${activeCategory === category.id ? 'text-[#FF5722]' : 'text-gray-900'
                                            }`}>
                                            {category.name}
                                        </h3>
                                    </button>
                                ))}
                            </div>

                            {/* FAQ Accordion */}
                            <div className="mb-10">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">
                                    Frequently Asked Questions
                                </h2>

                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    {faqData[activeCategory as keyof typeof faqData].map((faq, index) => {
                                        const key = `${activeCategory}-${index}`;
                                        return (
                                            <div key={key} className="border-b border-gray-100 last:border-none">
                                                <button
                                                    onClick={() => toggleFaq(activeCategory, index)}
                                                    className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
                                                >
                                                    <span className="font-medium text-gray-900">
                                                        {faq.question}
                                                    </span>
                                                    {expandedFaqs[key] ? (
                                                        <FiChevronUp className="text-gray-400 flex-shrink-0" />
                                                    ) : (
                                                        <FiChevronDown className="text-gray-400 flex-shrink-0" />
                                                    )}
                                                </button>

                                                {expandedFaqs[key] && (
                                                    <div className="px-6 pb-6 prose text-gray-600">
                                                        <p>{faq.answer}</p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Contact Support Section */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-10">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Still Need Help?</h2>
                                <p className="text-gray-600 mb-6">
                                    Can&apos;t find what you&apos;re looking for? Our support team is ready to assist you.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-[#FF5722]/5 rounded-xl p-6 border border-[#FF5722]/10">
                                        <div className="flex items-start gap-4">
                                            <div className="bg-[#FF5722]/10 p-3 rounded-full">
                                                <FiMessageSquare className="h-6 w-6 text-[#FF5722]" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 mb-2">Chat Support</h3>
                                                <p className="text-gray-600 text-sm mb-4">
                                                    Get instant help from our support team through live chat.
                                                </p>
                                                <button className="px-4 py-2 bg-[#FF5722] text-white rounded-lg font-medium hover:bg-[#E64A19] transition-colors">
                                                    Start Chat
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                        <div className="flex items-start gap-4">
                                            <div className="bg-gray-200 p-3 rounded-full">
                                                <FiMail className="h-6 w-6 text-gray-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
                                                <p className="text-gray-600 text-sm mb-4">
                                                    Send us an email and we&apos;ll get back to you within 24 hours.
                                                </p>
                                                <a
                                                    href="mailto:support@rovify.io"
                                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium inline-block hover:bg-gray-300 transition-colors"
                                                >
                                                    support@rovify.io
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Self-Help Resources */}
                            <div className="mb-10">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Helpful Resources</h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Link href="/guide/getting-started" className="group">
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow h-full">
                                            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#FF5722] transition-colors">Getting Started Guide</h3>
                                            <p className="text-gray-600 text-sm">
                                                Learn the basics of using Rovify and discover all its features.
                                            </p>
                                        </div>
                                    </Link>

                                    <Link href="/guide/nft-tickets" className="group">
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow h-full">
                                            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#FF5722] transition-colors">NFT Tickets Explained</h3>
                                            <p className="text-gray-600 text-sm">
                                                Everything you need to know about blockchain-based tickets.
                                            </p>
                                        </div>
                                    </Link>

                                    <Link href="/guide/event-creation" className="group">
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow h-full">
                                            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#FF5722] transition-colors">Event Creation Tips</h3>
                                            <p className="text-gray-600 text-sm">
                                                Best practices for creating successful events on Rovify.
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Back to Home */}
                    <div className="text-center mb-10">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-[#FF5722] hover:text-[#E64A19] transition-colors"
                        >
                            <FiArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Link>
                    </div>
                </div>
            </main>

            <BottomNavigation />
        </div>
    );
}