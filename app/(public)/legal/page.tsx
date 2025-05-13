// app/legal/page.tsx
'use client';

import Link from 'next/link';
import { FiArrowLeft, FiFileText, FiShield, FiGlobe } from 'react-icons/fi';
import { FaTrademark } from "react-icons/fa";
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';

export default function LegalPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto px-4 py-6 pt-24 pb-28">
                <div className="max-w-3xl mx-auto">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                        <Link href="/" className="hover:text-[#FF5722] transition-colors">Home</Link>
                        <span>/</span>
                        <span className="font-medium text-gray-700">Legal</span>
                    </div>

                    {/* Page Header */}
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">Legal Information</h1>
                        <p className="text-gray-600">Essential legal details about Rovify and our services</p>
                    </div>

                    {/* Legal Pages Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        <Link href="/terms" className="group">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow h-full">
                                <div className="flex items-start gap-4">
                                    <div className="bg-[#FF5722]/10 p-3 rounded-xl">
                                        <FiFileText className="h-6 w-6 text-[#FF5722]" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#FF5722] transition-colors">Terms of Service</h2>
                                        <p className="text-gray-600 text-sm">
                                            The terms that govern your use of Rovify&apos;s platform and services.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>

                        <Link href="/privacy" className="group">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow h-full">
                                <div className="flex items-start gap-4">
                                    <div className="bg-[#FF5722]/10 p-3 rounded-xl">
                                        <FiShield className="h-6 w-6 text-[#FF5722]" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-[#FF5722] transition-colors">Privacy Policy</h2>
                                        <p className="text-gray-600 text-sm">
                                            How we collect, use, and protect your personal information.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Copyright Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FiFileText className="text-[#FF5722]" />
                            Copyright Information
                        </h2>
                        <div className="prose max-w-none text-gray-600">
                            <p>
                                © {new Date().getFullYear()} Rovify, Inc. All rights reserved.
                            </p>
                            <p>
                                All content on this website, including but not limited to text, graphics, logos, icons, images, audio clips, and software, is the property of Rovify, Inc. and is protected by international copyright laws.
                            </p>
                            <p>
                                The unauthorized reproduction, distribution, modification, or use of any materials on this website is strictly prohibited.
                            </p>
                        </div>
                    </div>

                    {/* Trademark Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FaTrademark className="text-[#FF5722]" />
                            Trademarks
                        </h2>
                        <div className="prose max-w-none text-gray-600">
                            <p>
                                Rovify™, the Rovify logo, and other Rovify marks displayed on this website are trademarks or registered trademarks of Rovify, Inc.
                            </p>
                            <p>
                                All other trademarks, service marks, and logos used on this website are the property of their respective owners.
                            </p>
                            <p>
                                Nothing on this website should be construed as granting any license or right to use any trademark without the prior written permission of Rovify, Inc. or the respective trademark owner.
                            </p>
                        </div>
                    </div>

                    {/* License Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FiGlobe className="text-[#FF5722]" />
                            License to Use Website
                        </h2>
                        <div className="prose max-w-none text-gray-600">
                            <p>
                                Subject to the terms and conditions set forth in our Terms of Service, Rovify grants you a limited, non-exclusive, non-transferable license to access and use the Rovify website and services for personal, non-commercial purposes.
                            </p>
                            <p>
                                This license does not include:
                            </p>
                            <ul>
                                <li>Republication or redistribution of any content from the Rovify platform</li>
                                <li>Use of data mining, robots, or similar data gathering tools</li>
                                <li>Any resale or commercial use of the website or its contents</li>
                                <li>Downloading or copying account information for the benefit of another merchant</li>
                                <li>Any use of the website that could damage, disable, or impair the service</li>
                            </ul>
                            <p>
                                Rovify reserves the right to terminate this license at any time if you violate these restrictions.
                            </p>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-10">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Legal Contact</h2>
                        <p className="text-gray-600 mb-4">
                            For any legal inquiries or notices, please contact our legal department:
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

            <BottomNavigation />
        </div>
    );
}