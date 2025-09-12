import { Metadata } from 'next';
import MarketplaceSection from '@/components/MarketplaceSection';

export const metadata: Metadata = {
    title: 'Enhanced Marketplace',
    description: 'Enhanced marketplace with NFT drops and featured collections',
};

export default function EnhancedMarketplacePage() {
    return <MarketplaceSection />;
}
