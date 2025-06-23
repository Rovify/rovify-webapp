import { Metadata } from 'next';
import TicketsPage from '@/components/TicketsPage';

export const metadata: Metadata = {
    title: 'Tickets Management',
    description: 'Tickets management dashboard for organisers',
};

export default function TicketingCenter() {
    return <TicketsPage />;
}   