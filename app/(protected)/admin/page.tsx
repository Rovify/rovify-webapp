/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import {
    FiUsers, FiCalendar, FiTag, FiDollarSign,
    FiArrowUp, FiArrowDown, FiTrendingUp
} from 'react-icons/fi';

export default function AdminDashboard() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate API fetch
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // Mock data
    const stats = [
        {
            title: 'Total Users',
            value: '2,845',
            change: 12.5,
            icon: FiUsers,
            color: '#FF5722'
        },
        {
            title: 'Active Events',
            value: '187',
            change: 8.1,
            icon: FiCalendar,
            color: '#4CAF50'
        },
        {
            title: 'Tickets Sold',
            value: '12,472',
            change: 23.8,
            icon: FiTag,
            color: '#2196F3'
        },
        {
            title: 'Revenue',
            value: '$92,485',
            change: -3.2,
            icon: FiDollarSign,
            color: '#9C27B0'
        },
    ];

    // Recent activity mock data
    const recentActivity = [
        { id: 1, action: 'New event created', user: 'Joe RKND', event: 'Tech Summit 2025', time: '10 minutes ago' },
        { id: 2, action: 'Ticket purchased', user: 'Sophia Chen', event: 'Neon Nights Festival', time: '25 minutes ago' },
        { id: 3, action: 'User registration', user: 'Marcus Johnson', event: '', time: '1 hour ago' },
        { id: 4, action: 'Event updated', user: 'Olivia Martinez', event: 'Urban Art Exhibition', time: '2 hours ago' },
        { id: 5, action: 'Ticket transferred', user: 'Jordan Taylor', event: 'Crypto & DeFi Symposium', time: '3 hours ago' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg text-sm font-medium shadow-sm hover:bg-gray-50">
                        Last 7 Days
                    </button>
                    <button className="px-4 py-2 bg-[#FF5722] text-white rounded-lg text-sm font-medium shadow-sm hover:bg-[#E64A19]">
                        Export
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-gray-500 text-sm">{stat.title}</p>
                                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                            </div>
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `${stat.color}20` }}
                            >
                                <stat.icon style={{ color: stat.color }} className="w-5 h-5" />
                            </div>
                        </div>

                        <div className={`flex items-center gap-1 text-sm ${stat.change >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {stat.change >= 0 ? (
                                <FiArrowUp className="w-4 h-4" />
                            ) : (
                                <FiArrowDown className="w-4 h-4" />
                            )}
                            <span className="font-medium">{Math.abs(stat.change)}%</span>
                            <span className="text-gray-500">vs. last period</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800">Revenue Overview</h3>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 text-xs font-medium rounded-full bg-[#FF5722]/10 text-[#FF5722]">Weekly</button>
                            <button className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">Monthly</button>
                            <button className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">Yearly</button>
                        </div>
                    </div>

                    {/* Placeholder for chart */}
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">Revenue Chart Visualization</p>
                    </div>
                </div>

                {/* Events Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800">Events by Category</h3>
                        <button className="p-2 text-xs font-medium rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                            <FiTrendingUp className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Placeholder for chart */}
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">Events Distribution Visualization</p>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
                    <button className="px-4 py-2 text-sm font-medium text-[#FF5722] hover:bg-[#FF5722]/10 rounded-lg transition-colors">
                        View All
                    </button>
                </div>

                <div className="divide-y">
                    {recentActivity.map((activity) => (
                        <div key={activity.id} className="py-4 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#FF5722]/10 flex items-center justify-center flex-shrink-0">
                                <FiCalendar className="text-[#FF5722]" />
                            </div>

                            <div className="flex-1">
                                <p className="text-sm font-medium">{activity.action}</p>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <span className="font-medium text-[#FF5722]">{activity.user}</span>
                                    {activity.event && (
                                        <>
                                            <span>&middot;</span>
                                            <span>{activity.event}</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}