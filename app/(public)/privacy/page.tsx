'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiShield, FiUser, FiGlobe, FiDatabase, FiCreditCard, FiTrash2, FiAlertCircle } from 'react-icons/fi';

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
            <header className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-10 w-10 bg-gradient-to-r from-[#FF5722] to-[#FF7A50] rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-xl">R</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-[#FF5722]">rovify</span>
                    </Link>

                    <div className="flex gap-4">
                        <Link href="/login" className="text-gray-600 hover:text-[#FF5722] transition-colors">
                            Log in
                        </Link>
                        <Link href="/signup" className="px-4 py-2 bg-[#FF5722] text-white rounded-lg font-medium hover:bg-[#E64A19] transition-colors">
                            Sign up
                        </Link>
                    </div>
                </div>
            </header>

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

            <footer className="bg-white border-t border-gray-200 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="h-8 w-8 bg-gradient-to-r from-[#FF5722] to-[#FF7A50] rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">R</span>
                                </div>
                                <span className="text-lg font-bold text-[#FF5722]">rovify</span>
                            </Link>
                        </div>

                        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
                            <Link href="/terms" className="hover:text-[#FF5722] transition-colors font-medium">Terms</Link>
                            <Link href="/privacy" className="hover:text-[#FF5722] transition-colors">Privacy</Link>
                            <Link href="/legal" className="hover:text-[#FF5722] transition-colors">Legal</Link>
                            <Link href="/help" className="hover:text-[#FF5722] transition-colors">Help</Link>
                            <Link href="/contact" className="hover:text-[#FF5722] transition-colors">Contact</Link>
                        </div>

                        <div className="mt-4 md:mt-0 text-sm text-gray-500">
                            © {new Date().getFullYear()} Rovify. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}