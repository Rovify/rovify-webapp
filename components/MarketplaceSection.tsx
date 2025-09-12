'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiHeart, FiShare2, FiEye, FiShoppingCart, FiStar, FiClock } from 'react-icons/fi';
import { BsFire, BsGem, BsTicket } from 'react-icons/bs';

interface MarketplaceItem {
    id: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    image: string;
    category: string;
    seller: {
        name: string;
        avatar: string;
        verified: boolean;
    };
    isHot?: boolean;
    isFeatured?: boolean;
    isNft?: boolean;
    likes: number;
    views: number;
    timeLeft?: string;
    discount?: number;
}

interface MarketplaceSectionProps {
    className?: string;
    maxItems?: number;
}

const mockItems: MarketplaceItem[] = [
    {
        id: '1',
        title: 'Summer Festival VIP Pass',
        description: 'Exclusive access to all VIP areas and backstage',
        price: 299,
        currency: 'USD',
        image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop',
        category: 'tickets',
        seller: {
            name: 'EventPro',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
            verified: true
        },
        isHot: true,
        isFeatured: true,
        likes: 1247,
        views: 8934,
        timeLeft: '2d 14h',
        discount: 20
    },
    {
        id: '2',
        title: 'Digital Art Collection #001',
        description: 'Unique NFT artwork by renowned digital artist',
        price: 0.5,
        currency: 'ETH',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        category: 'nft',
        seller: {
            name: 'ArtCollective',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=face',
            verified: true
        },
        isNft: true,
        likes: 892,
        views: 4567
    },
    {
        id: '3',
        title: 'Tech Conference Swag Pack',
        description: 'Limited edition merchandise from Tech Summit 2025',
        price: 89,
        currency: 'USD',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
        category: 'merchandise',
        seller: {
            name: 'TechEvents',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
            verified: true
        },
        isFeatured: true,
        likes: 456,
        views: 2341,
        timeLeft: '5d 8h'
    },
    {
        id: '4',
        title: 'Gaming Championship Ticket',
        description: 'Premium seating for the ultimate gaming experience',
        price: 150,
        currency: 'USD',
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
        category: 'tickets',
        seller: {
            name: 'GameMasters',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face',
            verified: true
        },
        isHot: true,
        likes: 678,
        views: 3456,
        timeLeft: '1d 3h'
    },
    {
        id: '5',
        title: 'Exclusive Music NFT',
        description: 'Rare audio NFT from top artist collaboration',
        price: 1.2,
        currency: 'ETH',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
        category: 'nft',
        seller: {
            name: 'MusicNFT',
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=40&h=40&fit=crop&crop=face',
            verified: false
        },
        isNft: true,
        likes: 1234,
        views: 5678
    },
    {
        id: '6',
        title: 'Art Workshop Materials',
        description: 'Professional art supplies for digital art workshop',
        price: 75,
        currency: 'USD',
        image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
        category: 'merchandise',
        seller: {
            name: 'ArtSupplies',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=40&h=40&fit=crop&crop=face',
            verified: true
        },
        likes: 234,
        views: 1234,
        timeLeft: '7d 12h'
    }
];

const MarketplaceItemCard: React.FC<{ item: MarketplaceItem; index: number }> = ({ item, index }) => {
    const [isLiked, setIsLiked] = useState(false);

    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLiked(!isLiked);
    };

    const handleShare = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // Share functionality would go here
        console.log('Share item:', item.id);
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'nft':
                return BsGem;
            case 'tickets':
                return BsTicket;
            case 'merchandise':
                return FiShoppingCart;
            default:
                return BsGem;
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'nft':
                return 'text-emerald-600 bg-emerald-50 border-emerald-200';
            case 'tickets':
                return 'text-indigo-600 bg-indigo-50 border-indigo-200';
            case 'merchandise':
                return 'text-pink-600 bg-pink-50 border-pink-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const CategoryIcon = getCategoryIcon(item.category);
    const categoryColors = getCategoryColor(item.category);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-gray-900/10 hover:-translate-y-1 cursor-pointer"
        >
            <Link href={`/marketplace/item/${item.id}`}>
                {/* Image Section */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                        {item.isHot && (
                            <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                <BsFire size={10} />
                                HOT
                            </div>
                        )}
                        {item.isFeatured && (
                            <div className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                FEATURED
                            </div>
                        )}
                        {item.isNft && (
                            <div className="bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                NFT
                            </div>
                        )}
                        {item.discount && (
                            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                -{item.discount}%
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex gap-2">
                        <button
                            onClick={handleShare}
                            className="w-8 h-8 bg-black/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/30 transition-colors"
                            type="button"
                        >
                            <FiShare2 size={14} />
                        </button>
                        <button
                            onClick={handleLike}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                isLiked
                                    ? 'bg-red-500 text-white'
                                    : 'bg-black/20 backdrop-blur-sm text-white hover:bg-black/30'
                            }`}
                            type="button"
                        >
                            <FiHeart size={14} fill={isLiked ? 'currentColor' : 'none'} />
                        </button>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute bottom-3 left-3">
                        <div className={`${categoryColors} backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1.5 border`}>
                            <CategoryIcon size={12} />
                            {item.category}
                        </div>
                    </div>

                    {/* Time Left */}
                    {item.timeLeft && (
                        <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <FiClock size={10} />
                            {item.timeLeft}
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg group-hover:text-orange-600 transition-colors line-clamp-2 flex-1">
                            {item.title}
                        </h3>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {item.description}
                    </p>

                    {/* Seller Info */}
                    <div className="flex items-center gap-2 mb-3">
                        <Image
                            src={item.seller.avatar}
                            alt={item.seller.name}
                            width={20}
                            height={20}
                            className="rounded-full"
                        />
                        <span className="text-sm text-gray-600 font-medium">{item.seller.name}</span>
                        {item.seller.verified && (
                            <FiStar className="w-3 h-3 text-blue-500 fill-current" />
                        )}
                    </div>

                    {/* Price and Stats */}
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="font-bold text-xl text-gray-900">
                                {item.price} {item.currency}
                            </span>
                            {item.discount && (
                                <span className="text-sm text-gray-500 line-through">
                                    {Math.round(item.price / (1 - item.discount / 100))} {item.currency}
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-3 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                                <FiHeart size={12} />
                                <span>{item.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <FiEye size={12} />
                                <span>{item.views}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

const MarketplaceSection: React.FC<MarketplaceSectionProps> = ({ 
    className = "", 
    maxItems = 6 
}) => {
    const displayItems = mockItems.slice(0, maxItems);

    return (
        <div className={`w-full ${className}`}>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Featured Items</h2>
                <Link 
                    href="/marketplace" 
                    className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-1"
                >
                    View all items
                    <FiEye size={16} />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayItems.map((item, index) => (
                    <MarketplaceItemCard key={item.id} item={item} index={index} />
                ))}
            </div>
        </div>
    );
};

export default MarketplaceSection;
