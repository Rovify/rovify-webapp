'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowLeft, FiShield, FiUser, FiGlobe, FiDatabase, FiCreditCard, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import PublicHeader from '@/components/PublicHeader';
import RoviLogo from '@/public/images/contents/rovi-logo.png';

export default function PrivacyPolicy() {
    const [activeTopic, setActiveTopic] = useState<string>('information');

    const scrollToSection = (id: string) => {
        setActiveTopic(id);
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -100; // Header offset
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
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
                        <span className="font-medium text-gray-700">Privacy Policy</span>
                    </div>

                    {/* Page Header */}
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">Privacy Policy</h1>
                        <p className="text-gray-600">Last updated: May 13, 2025</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Navigation */}
                        <aside className="lg:w-64 flex-shrink-0">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-24">
                                <h2 className="font-semibold text-gray-800 mb-4">Contents</h2>
                                <nav className="space-y-1">
                                    <button
                                        onClick={() => scrollToSection('information')}
                                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-sm ${activeTopic === 'information'
                                            ? 'bg-[#FF5722]/10 text-[#FF5722] font-medium'
                                            : 'hover:bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        <FiDatabase className="h-4 w-4 flex-shrink-0" />
                                        <span>Information We Collect</span>
                                    </button>

                                    <button
                                        onClick={() => scrollToSection('use')}
                                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-sm ${activeTopic === 'use'
                                            ? 'bg-[#FF5722]/10 text-[#FF5722] font-medium'
                                            : 'hover:bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        <FiUser className="h-4 w-4 flex-shrink-0" />
                                        <span>How We Use Information</span>
                                    </button>

                                    <button
                                        onClick={() => scrollToSection('sharing')}
                                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-sm ${activeTopic === 'sharing'
                                            ? 'bg-[#FF5722]/10 text-[#FF5722] font-medium'
                                            : 'hover:bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        <FiGlobe className="h-4 w-4 flex-shrink-0" />
                                        <span>Information Sharing</span>
                                    </button>

                                    <button
                                        onClick={() => scrollToSection('blockchain')}
                                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-sm ${activeTopic === 'blockchain'
                                            ? 'bg-[#FF5722]/10 text-[#FF5722] font-medium'
                                            : 'hover:bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        <FiShield className="h-4 w-4 flex-shrink-0" />
                                        <span>Blockchain Data</span>
                                    </button>

                                    <button
                                        onClick={() => scrollToSection('payments')}
                                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-sm ${activeTopic === 'payments'
                                            ? 'bg-[#FF5722]/10 text-[#FF5722] font-medium'
                                            : 'hover:bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        <FiCreditCard className="h-4 w-4 flex-shrink-0" />
                                        <span>Payment Information</span>
                                    </button>

                                    <button
                                        onClick={() => scrollToSection('deletion')}
                                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-sm ${activeTopic === 'deletion'
                                            ? 'bg-[#FF5722]/10 text-[#FF5722] font-medium'
                                            : 'hover:bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        <FiTrash2 className="h-4 w-4 flex-shrink-0" />
                                        <span>Data Deletion</span>
                                    </button>

                                    <button
                                        onClick={() => scrollToSection('changes')}
                                        className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-sm ${activeTopic === 'changes'
                                            ? 'bg-[#FF5722]/10 text-[#FF5722] font-medium'
                                            : 'hover:bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        <FiAlertCircle className="h-4 w-4 flex-shrink-0" />
                                        <span>Changes to Policy</span>
                                    </button>
                                </nav>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <div className="flex-1">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                                <div className="prose max-w-none text-gray-600">
                                    <p>
                                        At Rovify, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
                                    </p>
                                    <p>
                                        Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                                    </p>

                                    <div className="my-8 p-4 bg-[#FF5722]/5 rounded-lg border border-[#FF5722]/10">
                                        <h3 className="text-gray-900 flex items-center gap-2 mt-0">
                                            <FiShield className="h-5 w-5 text-[#FF5722]" />
                                            Important Privacy Notice
                                        </h3>
                                        <p className="mb-0">
                                            Rovify operates on both traditional databases and blockchain technology. Information recorded on a blockchain is immutable and cannot be deleted. Please carefully consider this when interacting with our NFT ticketing features.
                                        </p>
                                    </div>
                                </div>

                                {/* Information We Collect */}
                                <section id="information" className="mb-12 scroll-mt-24">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <FiDatabase className="text-[#FF5722]" />
                                        Information We Collect
                                    </h2>
                                    <div className="prose max-w-none text-gray-600">
                                        <p>We collect several types of information from and about users of our platform:</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose my-4">
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h3 className="text-gray-800 font-medium mb-2">Personal Information</h3>
                                                <ul className="text-sm space-y-1">
                                                    <li className="flex items-center gap-2">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#FF5722]"></span>
                                                        Full Name
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#FF5722]"></span>
                                                        Email Address
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#FF5722]"></span>
                                                        Phone Number (optional)
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#FF5722]"></span>
                                                        Profile Image
                                                    </li>
                                                </ul>
                                            </div>

                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <h3 className="text-gray-800 font-medium mb-2">Account Information</h3>
                                                <ul className="text-sm space-y-1">
                                                    <li className="flex items-center gap-2">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#FF5722]"></span>
                                                        Username
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#FF5722]"></span>
                                                        Password (encrypted)
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-[#FF5722]"></span>
                                                        Wallet Address (for NFT features)
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        <h3>Usage Information</h3>
                                        <p>
                                            We also collect information about how you interact with our service, including:
                                        </p>
                                        <ul>
                                            <li>Event browsing history</li>
                                            <li>Ticket purchases</li>
                                            <li>Events you&apos;ve created</li>
                                            <li>Device information (browser type, IP address, device type)</li>
                                            <li>Usage patterns and preferences</li>
                                        </ul>
                                    </div>
                                </section>

                                {/* How We Use Information */}
                                <section id="use" className="mb-12 scroll-mt-24">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <FiUser className="text-[#FF5722]" />
                                        How We Use Information
                                    </h2>
                                    <div className="prose max-w-none text-gray-600">
                                        <p>We use the information we collect to:</p>
                                        <ul>
                                            <li>Provide, maintain, and improve our services</li>
                                            <li>Process transactions and send related information</li>
                                            <li>Send administrative notifications, such as updates or security alerts</li>
                                            <li>Personalize your experience and deliver content relevant to your interests</li>
                                            <li>Facilitate event creation, discovery, and ticket sales</li>
                                            <li>Process and deliver NFT tickets</li>
                                            <li>Respond to your comments, questions, and requests</li>
                                            <li>Prevent fraudulent transactions and enhance security</li>
                                        </ul>
                                    </div>
                                </section>

                                {/* Information Sharing */}
                                <section id="sharing" className="mb-12 scroll-mt-24">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <FiGlobe className="text-[#FF5722]" />
                                        Information Sharing
                                    </h2>
                                    <div className="prose max-w-none text-gray-600">
                                        <p>We may share your information in the following circumstances:</p>
                                        <ul>
                                            <li>With event organizers when you purchase tickets to their events</li>
                                            <li>With service providers who perform services on our behalf</li>
                                            <li>To comply with legal obligations</li>
                                            <li>To protect the rights, property, or safety of Rovify, our users, or others</li>
                                            <li>In connection with a business transaction such as a merger or acquisition</li>
                                        </ul>

                                        <p>
                                            We do not sell your personal information to third parties for marketing purposes.
                                        </p>
                                    </div>
                                </section>

                                {/* Blockchain Data */}
                                <section id="blockchain" className="mb-12 scroll-mt-24">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <FiShield className="text-[#FF5722]" />
                                        Blockchain Data
                                    </h2>
                                    <div className="prose max-w-none text-gray-600">
                                        <p>
                                            For NFT tickets, certain information is recorded on public blockchains, which are inherently public and transparent. This includes:
                                        </p>
                                        <ul>
                                            <li>Wallet addresses associated with ticket purchases</li>
                                            <li>Transaction data (timestamps, contract interactions)</li>
                                            <li>Ticket metadata (event information, ticket type, etc.)</li>
                                        </ul>

                                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 my-4">
                                            <p className="font-medium text-yellow-800 mb-0">
                                                <FiAlertCircle className="inline-block mr-2" />
                                                Important: Data written to a blockchain cannot be modified or deleted. Please be aware that NFT ticket transactions will create a permanent record on the blockchain.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Payment Information */}
                                <section id="payments" className="mb-12 scroll-mt-24">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <FiCreditCard className="text-[#FF5722]" />
                                        Payment Information
                                    </h2>
                                    <div className="prose max-w-none text-gray-600">
                                        <p>
                                            Rovify uses industry-standard security measures to protect your payment information. We do not store complete payment card details on our servers.
                                        </p>
                                        <ul>
                                            <li>Credit card information is processed by our payment processors (e.g., Stripe, PayPal)</li>
                                            <li>Cryptocurrency transactions are processed through secure wallet connections</li>
                                            <li>We maintain appropriate administrative, technical, and physical safeguards to protect payment data</li>
                                        </ul>
                                    </div>
                                </section>

                                {/* Data Deletion */}
                                <section id="deletion" className="mb-12 scroll-mt-24">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <FiTrash2 className="text-[#FF5722]" />
                                        Data Deletion & Your Rights
                                    </h2>
                                    <div className="prose max-w-none text-gray-600">
                                        <p>
                                            You can request access to, correction of, or deletion of your personal information by contacting us at privacy@rovify.io.
                                        </p>
                                        <p>
                                            Important limitations:
                                        </p>
                                        <ul>
                                            <li>Information recorded on public blockchains cannot be deleted due to the nature of blockchain technology</li>
                                            <li>We may retain certain information as required by law or for legitimate business purposes</li>
                                            <li>We may also retain cached or archived copies of information for a certain period</li>
                                        </ul>
                                    </div>
                                </section>

                                {/* Changes to Policy */}
                                <section id="changes" className="scroll-mt-24">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <FiAlertCircle className="text-[#FF5722]" />
                                        Changes to Our Privacy Policy
                                    </h2>
                                    <div className="prose max-w-none text-gray-600">
                                        <p>
                                            We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the &quot;Last Updated&quot; date at the top of this policy.
                                        </p>
                                        <p>
                                            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                                        </p>
                                    </div>
                                </section>
                            </div>

                            {/* Contact Information */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h2>
                                <p className="text-gray-600 mb-4">
                                    If you have any questions about this Privacy Policy, please contact us:
                                </p>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <span className="font-medium">Email:</span>
                                        <a href="mailto:privacy@rovify.io" className="text-[#FF5722] hover:underline">privacy@rovify.io</a>
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