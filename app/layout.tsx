// app/layout.tsx
import { type Metadata } from 'next';
import BottomNavigation from '@/components/BottomNavigation';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rovify | NFT Event Ticketing',
  description: 'Discover and book amazing events with NFT tickets',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-rovify-black to-black text-white">
        <header className="sticky top-0 z-50 backdrop-blur-md bg-rovify-black/70 border-b border-white/10">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-rovify-orange to-rovify-lavender flex items-center justify-center">
                <span className="text-white font-bold">R</span>
              </div>
              <span className="text-xl font-bold tracking-tight">Rovify</span>
            </a>

            {/* User Menu - This would normally be client component */}
            <div className="flex items-center gap-4">
              <a href="/create" className="bg-rovify-orange hover:bg-rovify-orange/90 transition-colors text-white rounded-full px-4 py-1.5 text-sm font-medium">
                Create Event
              </a>

              <a href="/tickets" className="relative">
                <div className="h-5 w-5 bg-rovify-lavender rounded-full absolute -top-1 -right-1 flex items-center justify-center text-[10px] font-bold">3</div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </a>

              <a href="/profile" className="h-8 w-8 rounded-full overflow-hidden bg-rovify-lavender flex items-center justify-center">
                <span className="text-white text-xs">A</span>
              </a>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 mb-20">
          {children}
        </main>

        <BottomNavigation />
      </body>
    </html>
  );
}