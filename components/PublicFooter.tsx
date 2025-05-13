'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    FiMapPin,
    FiMail,
    FiGlobe,
    FiInstagram,
    FiTwitter,
    FiLinkedin,
    FiFacebook,
    FiChevronRight,
    FiSend
} from 'react-icons/fi';

export default function PublicFooter() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const currentYear = new Date().getFullYear();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || isSubmitting) return;

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
            setEmail('');

            // Reset success message after 3 seconds
            setTimeout(() => {
                setIsSubmitted(false);
            }, 3000);
        }, 1000);
    };

    return (
        <footer className="bg-white border-t border-gray-100">
            {/* Main Footer Content */}
            <div className="container mx-auto px-5 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
                    {/* Company Info */}
                    <div className="lg:col-span-4">
                        <Link href="/" className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-[#FF5722] flex items-center justify-center shadow-sm">
                                <span className="text-white font-bold text-xl">R</span>
                            </div>
                            <span className="ml-2 text-[#FF5722] text-xl font-bold">rovify</span>
                        </Link>

                        <p className="text-gray-600 text-sm leading-relaxed mt-5 mb-6">
                            Discover and book amazing events with NFT tickets.
                            A premium Web2.5 social-first NFT event discovery platform.
                        </p>

                        <div className="flex items-center space-x-4">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-9 w-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-[#FF5722] hover:bg-gray-100 transition-colors duration-300"
                                aria-label="Instagram"
                            >
                                <FiInstagram size={18} />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-9 w-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-[#FF5722] hover:bg-gray-100 transition-colors duration-300"
                                aria-label="Twitter"
                            >
                                <FiTwitter size={18} />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-9 w-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-[#FF5722] hover:bg-gray-100 transition-colors duration-300"
                                aria-label="LinkedIn"
                            >
                                <FiLinkedin size={18} />
                            </a>
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-9 w-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-[#FF5722] hover:bg-gray-100 transition-colors duration-300"
                                aria-label="Facebook"
                            >
                                <FiFacebook size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="lg:col-span-2">
                        <h3 className="text-gray-900 font-semibold mb-5 text-sm uppercase tracking-wider">Quick Links</h3>

                        <ul className="space-y-3">
                            {[
                                { name: 'Explore Events', href: '/discover' },
                                { name: 'Create Event', href: '/create' },
                                { name: 'My Tickets', href: '/tickets' },
                                { name: 'About Us', href: '/about' },
                                { name: 'How It Works', href: '/how-it-works' }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-600 hover:text-[#FF5722] transition-colors duration-200 text-sm flex items-center group"
                                    >
                                        <FiChevronRight className="w-4 h-4 mr-1.5 text-[#FF5722]/60 group-hover:translate-x-0.5 transition-transform duration-200" />
                                        <span>{link.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="lg:col-span-2">
                        <h3 className="text-gray-900 font-semibold mb-5 text-sm uppercase tracking-wider">Legal</h3>

                        <ul className="space-y-3">
                            {[
                                { name: 'Terms of Service', href: '/terms' },
                                { name: 'Privacy Policy', href: '/privacy' },
                                { name: 'Cookie Policy', href: '/cookies' },
                                { name: 'Refund Policy', href: '/refunds' }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-600 hover:text-[#FF5722] transition-colors duration-200 text-sm flex items-center group"
                                    >
                                        <FiChevronRight className="w-4 h-4 mr-1.5 text-[#FF5722]/60 group-hover:translate-x-0.5 transition-transform duration-200" />
                                        <span>{link.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & Newsletter */}
                    <div className="lg:col-span-4">
                        <h3 className="text-gray-900 font-semibold mb-5 text-sm uppercase tracking-wider">Stay Connected</h3>

                        {/* Contact Info */}
                        <ul className="space-y-3 mb-6">
                            <li className="flex items-start text-sm">
                                <FiMapPin className="text-[#FF5722] w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-600">123 Event Boulevard, Digital City, Web3 Country</span>
                            </li>
                            <li className="flex items-center text-sm">
                                <FiMail className="text-[#FF5722] w-5 h-5 mr-3 flex-shrink-0" />
                                <a
                                    href="mailto:info@rovify.com"
                                    className="text-gray-600 hover:text-[#FF5722] transition-colors duration-300"
                                >
                                    info@rovify.com
                                </a>
                            </li>
                            <li className="flex items-center text-sm">
                                <FiGlobe className="text-[#FF5722] w-5 h-5 mr-3 flex-shrink-0" />
                                <a
                                    href="https://www.rovify.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-[#FF5722] transition-colors duration-300"
                                >
                                    www.rovify.com
                                </a>
                            </li>
                        </ul>

                        {/* Newsletter */}
                        <div>
                            <h4 className="font-medium text-gray-900 mb-3 text-sm">Subscribe to our newsletter</h4>

                            <form onSubmit={handleSubmit} className="relative">
                                <div className="flex">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Your email address"
                                        required
                                        disabled={isSubmitting || isSubmitted}
                                        className="flex-1 px-4 py-2.5 rounded-l-lg border border-gray-200 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5722]/20 focus:border-[#FF5722] disabled:bg-gray-50"
                                    />

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || isSubmitted || !email}
                                        className={`px-4 py-2.5 rounded-r-lg flex items-center justify-center text-sm font-medium transition-colors duration-300 ${isSubmitting || isSubmitted || !email ? 'bg-[#FF5722]/70 cursor-not-allowed' : 'bg-[#FF5722] hover:bg-[#E64A19]'} text-white`}
                                    >
                                        {isSubmitting ? (
                                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                        ) : isSubmitted ? (
                                            <span>Thanks!</span>
                                        ) : (
                                            <FiSend className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>

                                {isSubmitted && (
                                    <p className="absolute left-0 -bottom-6 text-green-600 text-xs font-medium">
                                        Thank you for subscribing! 🎉
                                    </p>
                                )}
                            </form>

                            <p className="text-xs text-gray-500 mt-2">
                                We respect your privacy. Unsubscribe at any time.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-100">
                <div className="container mx-auto px-5 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-500 text-sm mb-4 md:mb-0">
                            © {currentYear} Rovify. All rights reserved.
                        </p>

                        <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
                            {[
                                { name: 'Terms', href: '/terms' },
                                { name: 'Privacy', href: '/privacy' },
                                { name: 'Cookies', href: '/cookies' },
                                { name: 'Help Center', href: '/help' },
                                { name: 'Contact', href: '/contact' }
                            ].map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-sm text-gray-500 hover:text-[#FF5722] transition-colors duration-300"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}