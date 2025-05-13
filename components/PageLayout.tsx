'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';

export default function PageLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    // Check if current path is an auth path
    const isAuthPath = pathname.startsWith('/auth');

    if (isAuthPath) {
        // For auth pages, render only the content without Header and BottomNavigation
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <main className="flex-1">
                    {children}
                </main>
            </div>
        );
    }

    // For regular app pages, render with Header and BottomNavigation
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />

            <main className="flex-1 container mx-auto px-4 pt-4 pb-24">
                {children}
            </main>

            <BottomNavigation />
        </div>
    );
}