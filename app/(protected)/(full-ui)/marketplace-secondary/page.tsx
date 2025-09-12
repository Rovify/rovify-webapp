import { Metadata } from 'next';
import MarketplaceSection from '@/components/MarketplaceSection';

export const metadata: Metadata = {
    title: 'Secondary Marketplace',
    description: 'Enhanced marketplace with NFT drops, featured collections, and community items',
};

export default function SecondaryMarketplacePage() {
    return <MarketplaceSection />;
}
