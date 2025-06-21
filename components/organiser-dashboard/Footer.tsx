/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FiHeart, FiGithub, FiTwitter, FiMail, FiExternalLink } from 'react-icons/fi';
import RoviLogo from '@/public/images/contents/rovi-logo.png';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: <FiTwitter className="w-4 h-4" />, href: '#', label: 'Twitter' },
        { icon: <FiGithub className="w-4 h-4" />, href: '#', label: 'GitHub' },
        { icon: <FiMail className="w-4 h-4" />, href: '#', label: 'Email' }
    ];

    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-2xl shadow-purple-500/5 z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Compact Footer Content */}
                <div className="py-3 sm:py-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                        {/* Left: Brand + Copyright */}
                        <div className="flex items-center gap-4">
                            <motion.div
                                className="flex items-center gap-2"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-lg flex items-center justify-center shadow-md shadow-orange-500/25 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                                    <Image
                                        src={RoviLogo}
                                        alt="Rovify Logo"
                                        width={16}
                                        height={16}
                                        className="object-contain filter brightness-0 invert relative z-10"
                                    />
                                </div>
                                <div className="hidden sm:block">
                                    <h3 className="font-bold text-gray-900 text-sm">Rovify Pro</h3>
                                </div>
                            </motion.div>

                            <div className="text-xs text-gray-600 flex items-center gap-3">
                                <span>© {currentYear} Rovify Pro</span>
                                <div className="hidden md:flex items-center gap-1">
                                    <span>Made with</span>
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        <FiHeart className="w-3 h-3 text-red-500" />
                                    </motion.div>
                                    <span>in Rwanda</span>
                                </div>
                            </div>
                        </div>

                        {/* Center: Quick Links */}
                        <div className="hidden lg:flex items-center gap-6 text-xs text-gray-600">
                            {['Help Center', 'Privacy', 'Terms', 'Status'].map((link, index) => (
                                <motion.a
                                    key={link}
                                    href="#"
                                    className="hover:text-orange-600 transition-colors duration-200 flex items-center gap-1 group"
                                    whileHover={{ y: -1 }}
                                >
                                    {link}
                                    <FiExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                </motion.a>
                            ))}
                        </div>

                        {/* Right: Status + Social */}
                        <div className="flex items-center gap-4">
                            {/* Status Indicators */}
                            <div className="flex items-center gap-3 text-xs">
                                <div className="flex items-center gap-1.5 text-gray-600">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                    <span className="hidden sm:inline">v2.1.4</span>
                                    <span className="sm:hidden">v2.1</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-600">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                    <span className="hidden md:inline">Operational</span>
                                    <span className="md:hidden">Online</span>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="flex items-center gap-2">
                                {socialLinks.slice(0, 3).map((social, index) => (
                                    <motion.a
                                        key={social.label}
                                        href={social.href}
                                        className="p-1.5 bg-gray-100 hover:bg-orange-50 border border-gray-200 hover:border-orange-200 rounded-lg transition-all duration-200 group"
                                        whileHover={{ scale: 1.05, y: -1 }}
                                        whileTap={{ scale: 0.95 }}
                                        title={social.label}
                                    >
                                        <div className="text-gray-600 group-hover:text-orange-600 text-xs">
                                            {social.icon}
                                        </div>
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}