import { Metadata } from 'next';
import EventList from '@/components/EventList';

export const metadata: Metadata = {
  title: 'Events',
  description: 'Discover and browse events',
};

export default function EventsPage() {
  return <EventList />;
}
