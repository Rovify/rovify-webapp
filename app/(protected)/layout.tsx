'use client';

import { UIProvider } from '@/context/UIContext';
import FloatingActionManager from '@/components/FloatingActionManager';
import PageLayout from '@/components/PageLayout';
import ScrollToTop from '@/components/ScrollToTop';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        const user = localStorage.getItem('rovify-user');
        setIsAuthenticated(!!user);
    }, []);

    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-white">
                <div className="flex flex-col items-center">
                    <div className="h-12 w-12 bg-gradient-to-br from-[#FF5722] to-[#FF7A50] rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                        <span className="text-white font-bold text-2xl">R</span>
                    </div>
                    <p className="mt-4 text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        router.push('/auth/login');
        return null;
    }

    return (
        <UIProvider>
            <FloatingActionManager>
                <PageLayout>
                    {children}
                    <ScrollToTop />
                </PageLayout>
            </FloatingActionManager>
        </UIProvider>
    );
}