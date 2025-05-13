
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiSearch, FiChevronDown, FiChevronUp, FiArrowLeft, FiMessageSquare, FiMail, FiHelpCircle, FiUser, FiCalendar, FiCreditCard, FiSmartphone } from 'react-icons/fi';
import PublicHeader from '@/components/PublicHeader';
import RoviLogo from '@/public/images/contents/rovi-logo.png';

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
            <PublicHeader />

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

            <footer className="bg-white border-t border-gray-100">
                {/* Main Footer */}
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Brand Column */}
                        <div className="space-y-6">
                            <div className="flex items-center">
                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#FF5722] to-[#FF9800] flex items-center justify-center">
                                    <Image
                                        src={RoviLogo}
                                        alt="Rovify Logo"
                                        width={32}
                                        height={32}
                                        className="object-contain"
                                    />
                                </div>
                                <h2 className="ml-2 text-xl font-bold text-gray-900">Rovify</h2>
                            </div>
                            <p className="text-gray-600 text-sm">
                                The premium Web2.5 social-first NFT event discovery platform connecting creators and enthusiasts through unique experiences.
                            </p>
                            <div className="flex items-center space-x-4">
                                <a href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#FF5722]/10 hover:text-[#FF5722] transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                                    </svg>
                                </a>
                                <a href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#FF5722]/10 hover:text-[#FF5722] transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                    </svg>
                                </a>
                                <a href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#FF5722]/10 hover:text-[#FF5722] transition-all">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                        <rect x="2" y="9" width="4" height="12"></rect>
                                        <circle cx="4" cy="4" r="2"></circle>
                                    </svg>
                                </a>
                                <a href="#" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#FF5722]/10 hover:text-[#FF5722] transition-all">
                                    <svg
                                        className="rotate-45"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Quick Links Column */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Explore</h3>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors">All Events</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors">NFT Collections</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors">Create Event</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors">Sell Tickets</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors">Event Calendar</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors">Featured Creators</a></li>
                            </ul>
                        </div>

                        {/* Resources Column */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Company</h3>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors">About Us</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors">Blog</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors">Careers</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors">Press Kit</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors">Partners</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors">Contact</a></li>
                            </ul>
                        </div>

                        {/* Support Column */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Support</h3>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors">Help Center</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors">FAQs</a></li>
                                <li><a href="/terms" className="text-[#FF5722] font-medium">Terms of Service</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors">Cookie Policy</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-[#FF5722] transition-colors">Trust & Safety</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Newsletter Subscription */}
                    <div className="mt-12 pt-8 border-t border-gray-100">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="max-w-md">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Join our community</h3>
                                <p className="text-gray-600 text-sm">Get exclusive updates on new features, events, and NFT drops.</p>
                            </div>
                            <div className="w-full md:w-auto">
                                <div className="flex rounded-full overflow-hidden shadow-sm border border-gray-200 bg-gray-50 focus-within:ring-2 focus-within:ring-[#FF5722]/30">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#FF5722]/20 focus:border-[#FF5722] w-full md:w-64"
                                    />
                                    <button className="bg-[#FF5722] hover:bg-[#E64A19] text-white px-4 py-2.5 rounded-r-lg transition-colors">
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="bg-gray-50 border-t border-gray-100">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="text-sm text-gray-500 mb-4 md:mb-0">
                                © 2025 Rovify. All rights reserved.
                            </div>
                            <div className="flex items-center space-x-6">
                                <a href="#" className="text-sm text-gray-500 hover:text-[#FF5722] transition-colors flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016a11.955 11.955 0 01-8.618 3.88 11.955 11.955 0 01-8.618-3.88A19.936 19.936 0 0112 2.5c2.3 0 4.4.48 6.254 1.332" />
                                    </svg>
                                    Security
                                </a>
                                <a href="#" className="text-sm text-gray-500 hover:text-[#FF5722] transition-colors flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Status
                                </a>
                                <div className="flex items-center text-sm text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-[#FF5722]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                                    </svg>
                                    Kigali, Rwanda
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}