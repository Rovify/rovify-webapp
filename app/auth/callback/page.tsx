'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        console.log('OAuth callback handler initialized');

        // Check if all required parameters are present
        if (searchParams) {
            const code = searchParams.get('code');
            const state = searchParams.get('state');

            if (code && state) {
                console.log('OAuth parameters found, redirecting to login with parameters');
                // Redirect to login page with the code and state
                router.push(`/auth/login?code=${code}&state=${state}`);
            } else {
                console.error('Missing OAuth parameters');
                router.push('/auth/login?error=missing_params');
            }
        } else {
            console.error('No search parameters found');
            router.push('/auth/login?error=no_params');
        }
    }, [router, searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="inline-block animate-spin h-8 w-8 border-4 border-[#FF5722] border-t-transparent rounded-full mb-4"></div>
                <h1 className="text-xl font-medium text-gray-700">Authenticating...</h1>
                <p className="text-gray-500 mt-2">Please wait while we complete your sign-in</p>
            </div>
        </div>
    );
}