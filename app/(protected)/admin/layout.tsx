'use client';

import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    FiHome, FiUsers, FiCalendar, FiTag, FiDollarSign,
    FiSettings, FiMenu, FiX, FiLogOut, FiBell
} from 'react-icons/fi';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const menuItems = [
        { name: 'Dashboard', href: '/admin', icon: FiHome },
        { name: 'Users', href: '/admin/users', icon: FiUsers },
        { name: 'Events', href: '/admin/events', icon: FiCalendar },
        { name: 'Tickets', href: '/admin/tickets', icon: FiTag },
        { name: 'Transactions', href: '/admin/transactions', icon: FiDollarSign },
        { name: 'Settings', href: '/admin/settings', icon: FiSettings },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Sidebar Toggle */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-lg bg-white shadow-md"
                >
                    {sidebarOpen ? <FiX className="w-6 h-6 text-[#FF5722]" /> : <FiMenu className="w-6 h-6 text-[#FF5722]" />}
                </button>
            </div>

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                } transition-transform duration-300 ease-in-out`}>
                {/* Logo */}
                <div className="flex items-center justify-center h-16 px-6 border-b">
                    <Link href="/admin" className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-gradient-to-r from-[#FF5722] to-[#FF7A50] rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">R</span>
                        </div>
                        <span className="text-lg font-bold text-[#FF5722]">rovify</span>
                        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Admin</span>
                    </Link>
                </div>

                {/* Menu Items */}
                <nav className="px-4 py-6">
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.name}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === item.href
                                        ? 'bg-[#FF5722] text-white shadow-md'
                                        : 'text-gray-700 hover:bg-[#FF5722]/10 hover:text-[#FF5722]'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Admin Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <FiUsers className="text-gray-600" />
                        </div>
                        <div>
                            <h4 className="text-sm font-medium">Admin User</h4>
                            <p className="text-xs text-gray-500">admin@rovify.io</p>
                        </div>
                    </div>

                    <button className="w-full py-2 flex items-center justify-center gap-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                        <FiLogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:ml-64 min-h-screen">
                {/* Header */}
                <header className="bg-white shadow-sm h-16 fixed top-0 right-0 left-0 lg:left-64 z-30 flex items-center justify-between px-4 lg:px-6">
                    <h1 className="text-xl font-bold text-gray-800 hidden lg:block">
                        {menuItems.find(item => item.href === pathname)?.name || 'Dashboard'}
                    </h1>

                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors relative">
                            <FiBell className="w-5 h-5 text-gray-700" />
                            <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#FF5722]"></span>
                        </button>

                        <Link
                            href="/"
                            className="px-4 py-2 bg-[#FF5722]/10 text-[#FF5722] text-sm font-medium rounded-lg hover:bg-[#FF5722]/20 transition-colors"
                        >
                            View Site
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6 pt-24">
                    {children}
                </main>
            </div>
        </div>
    );
}