// app/page.tsx
import { Metadata } from 'next';
import ClientWrapper from '@/components/ClientWrapper';

export const metadata: Metadata = {
  title: 'Rovify | Discover Experiences',
  description: 'Discover and book amazing events with NFT tickets',
};

export default function Home() {
  return <ClientWrapper />;
}