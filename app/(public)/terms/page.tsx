'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiChevronDown, FiChevronUp, FiArrowLeft } from 'react-icons/fi';
import PublicHeader from '@/components/PublicHeader';
import RoviLogo from '@/public/images/contents/rovi-logo.png';

export default function TermsPage() {
    const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
        'introduction': true,
        'account': false,
        'content': false,
        'payments': false,
        'termination': false,
        'liability': false,
        'changes': false,
    });

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <PublicHeader />

            <main className="container mx-auto px-4 py-6 pt-24 pb-28">
                <div className="max-w-3xl mx-auto">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                        <Link href="/" className="hover:text-[#FF5722] transition-colors">Home</Link>
                        <span>/</span>
                        <span className="font-medium text-gray-700">Terms of Service</span>
                    </div>

                    {/* Page Header */}
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">Terms of Service</h1>
                        <p className="text-gray-600">Last updated: May 13, 2025</p>
                    </div>

                    {/* Table of Contents - Desktop */}
                    <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Contents</h2>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.keys(expandedSections).map((section, index) => (
                                <a
                                    key={section}
                                    href={`#${section}`}
                                    className="flex items-center hover:text-[#FF5722] transition-colors"
                                >
                                    <span className="bg-[#FF5722]/10 text-[#FF5722] w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-2">
                                        {index + 1}
                                    </span>
                                    <span className="capitalize">{section}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Terms Content */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-10">
                        {/* Introduction */}
                        <div id="introduction" className="border-b border-gray-100">
                            <button
                                onClick={() => toggleSection('introduction')}
                                className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                            >
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <span className="bg-[#FF5722]/10 text-[#FF5722] w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                                        1
                                    </span>
                                    Introduction
                                </h2>
                                {expandedSections.introduction ? (
                                    <FiChevronUp className="text-gray-400" />
                                ) : (
                                    <FiChevronDown className="text-gray-400" />
                                )}
                            </button>

                            {expandedSections.introduction && (
                                <div className="px-6 pb-6 prose max-w-none text-gray-600">
                                    <p>
                                        Welcome to Rovify, an NFT event ticketing platform that allows users to discover, create, and attend events using traditional and blockchain-based ticketing.
                                    </p>
                                    <p>
                                        These Terms of Service (&quot;Terms&quot;) govern your access to and use of the Rovify website, mobile application, and services (collectively, the &quot;Service&quot;). Please read these Terms carefully before using the Service.
                                    </p>
                                    <p>
                                        By accessing or using the Service, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you may not access or use the Service.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Account Section */}
                        <div id="account" className="border-b border-gray-100">
                            <button
                                onClick={() => toggleSection('account')}
                                className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                            >
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <span className="bg-[#FF5722]/10 text-[#FF5722] w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                                        2
                                    </span>
                                    Account Registration & Requirements
                                </h2>
                                {expandedSections.account ? (
                                    <FiChevronUp className="text-gray-400" />
                                ) : (
                                    <FiChevronDown className="text-gray-400" />
                                )}
                            </button>

                            {expandedSections.account && (
                                <div className="px-6 pb-6 prose max-w-none text-gray-600">
                                    <p>
                                        To use certain features of the Service, you must register for an account. When you register, you agree to provide accurate, current, and complete information about yourself.
                                    </p>
                                    <h3 className="text-gray-800">Account Eligibility</h3>
                                    <p>
                                        You must be at least 18 years old to create an account. By creating an account, you represent and warrant that:
                                    </p>
                                    <ul>
                                        <li>You are at least 18 years of age</li>
                                        <li>You have the legal capacity to enter into these Terms</li>
                                        <li>You will comply with these Terms and all applicable laws</li>
                                        <li>You will provide accurate information when registering</li>
                                        <li>You will keep your account information up-to-date</li>
                                    </ul>
                                    <h3 className="text-gray-800">Account Security</h3>
                                    <p>
                                        You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to immediately notify Rovify of any unauthorized use of your account or any other breach of security.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Content Section */}
                        <div id="content" className="border-b border-gray-100">
                            <button
                                onClick={() => toggleSection('content')}
                                className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                            >
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <span className="bg-[#FF5722]/10 text-[#FF5722] w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                                        3
                                    </span>
                                    User Content & Conduct
                                </h2>
                                {expandedSections.content ? (
                                    <FiChevronUp className="text-gray-400" />
                                ) : (
                                    <FiChevronDown className="text-gray-400" />
                                )}
                            </button>

                            {expandedSections.content && (
                                <div className="px-6 pb-6 prose max-w-none text-gray-600">
                                    <p>
                                        Our Service allows you to create events, post content, and interact with other users. You are solely responsible for the content you post and your interactions with other users.
                                    </p>
                                    <h3 className="text-gray-800">Content Restrictions</h3>
                                    <p>
                                        You agree not to post content that:
                                    </p>
                                    <ul>
                                        <li>Is unlawful, harmful, threatening, or discriminatory</li>
                                        <li>Infringes on intellectual property rights</li>
                                        <li>Contains malware or harmful code</li>
                                        <li>Is deceptive or misleading</li>
                                        <li>Promotes illegal activities or violates others&apos; rights</li>
                                    </ul>
                                    <h3 className="text-gray-800">Content License</h3>
                                    <p>
                                        By posting content on Rovify, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, publish, distribute, and display such content in connection with the Service.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Payments Section */}
                        <div id="payments" className="border-b border-gray-100">
                            <button
                                onClick={() => toggleSection('payments')}
                                className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                            >
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <span className="bg-[#FF5722]/10 text-[#FF5722] w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                                        4
                                    </span>
                                    Payments & Refunds
                                </h2>
                                {expandedSections.payments ? (
                                    <FiChevronUp className="text-gray-400" />
                                ) : (
                                    <FiChevronDown className="text-gray-400" />
                                )}
                            </button>

                            {expandedSections.payments && (
                                <div className="px-6 pb-6 prose max-w-none text-gray-600">
                                    <p>
                                        Rovify offers both traditional and blockchain-based ticketing options. Payment methods vary depending on the type of ticket you purchase.
                                    </p>
                                    <h3 className="text-gray-800">Pricing & Fees</h3>
                                    <p>
                                        Ticket prices are set by event organizers. Rovify charges service fees for ticket sales, which will be displayed during checkout. All prices and fees are in the currency specified for the event.
                                    </p>
                                    <h3 className="text-gray-800">Refunds & Cancellations</h3>
                                    <p>
                                        Refund policies are set by event organizers and will be displayed at the time of purchase. For NFT tickets, special conditions may apply due to the nature of blockchain transactions.
                                    </p>
                                    <div className="bg-[#FF5722]/5 p-4 rounded-lg border border-[#FF5722]/10 my-4">
                                        <p className="font-medium text-gray-800">
                                            Important: NFT tickets may have limited refundability based on blockchain limitations and smart contract terms. Please review the specific refund policy for each event before purchasing.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Continue with other sections similarly */}
                        <div id="termination" className="border-b border-gray-100">
                            <button
                                onClick={() => toggleSection('termination')}
                                className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                            >
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <span className="bg-[#FF5722]/10 text-[#FF5722] w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                                        5
                                    </span>
                                    Termination
                                </h2>
                                {expandedSections.termination ? (
                                    <FiChevronUp className="text-gray-400" />
                                ) : (
                                    <FiChevronDown className="text-gray-400" />
                                )}
                            </button>

                            {expandedSections.termination && (
                                <div className="px-6 pb-6 prose max-w-none text-gray-600">
                                    <p>
                                        We reserve the right to suspend or terminate your account and access to the Service at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div id="liability" className="border-b border-gray-100">
                            <button
                                onClick={() => toggleSection('liability')}
                                className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                            >
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <span className="bg-[#FF5722]/10 text-[#FF5722] w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                                        6
                                    </span>
                                    Limitation of Liability
                                </h2>
                                {expandedSections.liability ? (
                                    <FiChevronUp className="text-gray-400" />
                                ) : (
                                    <FiChevronDown className="text-gray-400" />
                                )}
                            </button>

                            {expandedSections.liability && (
                                <div className="px-6 pb-6 prose max-w-none text-gray-600">
                                    <p>
                                        To the maximum extent permitted by law, Rovify and its officers, directors, employees, and agents will not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising out of or in connection with these Terms or your use of the Service.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div id="changes" className="border-b border-gray-100">
                            <button
                                onClick={() => toggleSection('changes')}
                                className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                            >
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <span className="bg-[#FF5722]/10 text-[#FF5722] w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                                        7
                                    </span>
                                    Changes to Terms
                                </h2>
                                {expandedSections.changes ? (
                                    <FiChevronUp className="text-gray-400" />
                                ) : (
                                    <FiChevronDown className="text-gray-400" />
                                )}
                            </button>

                            {expandedSections.changes && (
                                <div className="px-6 pb-6 prose max-w-none text-gray-600">
                                    <p>
                                        We may update these Terms from time to time. If we make material changes, we will notify you via the Service or by other means. Your continued use of the Service after the changes are made constitutes your acceptance of the updated Terms.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-10">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h2>
                        <p className="text-gray-600 mb-4">
                            If you have any questions about these Terms of Service, please contact us:
                        </p>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-gray-700">
                                <span className="font-medium">Email:</span>
                                <a href="mailto:legal@rovify.io" className="text-[#FF5722] hover:underline">legal@rovify.io</a>
                            </div>
                            <div className="flex items-center gap-2 text-gray-700">
                                <span className="font-medium">Address:</span>
                                <span>Kigali, Rwanda</span>
                            </div>
                        </div>
                    </div>

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