'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiChevronDown, FiChevronUp, FiArrowLeft } from 'react-icons/fi';
import PublicFooter from '@/components/PublicFooter';
import PublicHeader from '@/components/PublicHeader';

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

            <PublicFooter />
        </div>
    );
}