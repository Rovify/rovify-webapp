'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiStar, FiZap, FiShoppingBag, FiHeart, FiEye } from 'react-icons/fi';
import { BsFire, BsGem, BsTicket } from 'react-icons/bs';

interface MarketplaceNavigationProps {
    className?: string;
}

const MarketplaceNavigation: React.FC<MarketplaceNavigationProps> = ({ className = "" }) => {
    const navigationItems = [
        {
            id: 'trending',
            label: 'Trending',
            icon: BsFire,
            href: '/marketplace/trending',
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200'
        },
        {
            id: 'featured',
            label: 'Featured',
            icon: FiStar,
            href: '/marketplace/featured',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200'
        },
        {
            id: 'new',
            label: 'New',
            icon: FiZap,
            href: '/marketplace/new',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200'
        },
        {
            id: 'nft',
            label: 'NFTs',
            icon: BsGem,
            href: '/marketplace/nft',
            color: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
            borderColor: 'border-emerald-200'
        },
        {
            id: 'tickets',
            label: 'Tickets',
            icon: BsTicket,
            href: '/marketplace/tickets',
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
            borderColor: 'border-indigo-200'
        },
        {
            id: 'merchandise',
            label: 'Merch',
            icon: FiShoppingBag,
            href: '/marketplace/merchandise',
            color: 'text-pink-600',
            bgColor: 'bg-pink-50',
            borderColor: 'border-pink-200'
        }
    ];

    return (
        <div className={`w-full ${className}`}>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Marketplace</h2>
                <Link 
                    href="/marketplace" 
                    className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-1"
                >
                    Explore all
                    <FiEye size={16} />
                </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {navigationItems.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link href={item.href}>
                            <motion.div
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className={`
                                    p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer
                                    ${item.bgColor} ${item.borderColor} hover:shadow-lg hover:shadow-gray-900/10
                                    flex flex-col items-center text-center group
                                `}
                            >
                                <div className={`
                                    w-12 h-12 rounded-xl flex items-center justify-center mb-3
                                    ${item.bgColor} border ${item.borderColor} group-hover:scale-110 transition-transform duration-300
                                `}>
                                    <item.icon className={`w-6 h-6 ${item.color}`} />
                                </div>
                                <span className={`font-semibold text-sm ${item.color} group-hover:text-gray-900 transition-colors duration-300`}>
                                    {item.label}
                                </span>
                            </motion.div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Quick Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <BsFire className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Hot Items</p>
                            <p className="text-xl font-bold text-gray-900">1,247</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <FiHeart className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Favorites</p>
                            <p className="text-xl font-bold text-gray-900">3,891</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FiTrendingUp className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 font-medium">Trending</p>
                            <p className="text-xl font-bold text-gray-900">+24%</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default MarketplaceNavigation;
