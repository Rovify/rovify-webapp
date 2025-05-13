/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface AuthWrapperProps {
    children: ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        const authPaths = ['/auth/login', '/auth/register', '/auth/forgot-password'];
        if (authPaths.includes(pathname)) {
            setIsInitializing(false);
            return;
        }

        // a small delay to avoid flicker on initial load
        const timer = setTimeout(() => {
            setIsInitializing(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [pathname]);

    // Show loading state during initial load
    if (isInitializing || isLoading) {
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

    return <>{children}</>;
}