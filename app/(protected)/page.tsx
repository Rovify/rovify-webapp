'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import ClientWrapper from '@/components/ClientWrapper';

export default function Home() {
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
            <Image
              src="/images/contents/rovi-logo.png"
              alt="Rovify Logo"
              width={32}
              height={32}
              className="object-contain"
            />
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

  return <ClientWrapper />;
}