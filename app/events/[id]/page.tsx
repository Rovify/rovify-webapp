import { Metadata } from 'next';
import { getEventById } from '@/mocks/data/events';
import EventDetailsPage from '@/components/EventDetailsPage';

// Types for TypeScript
interface EventPageProps {
    params: {
        id: string;
    };
}

// Generate metadata dynamically based on the event
export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
    const eventId = params.id;
    const event = getEventById(eventId);

    if (!event) {
        return {
            title: 'Event Not Found',
        };
    }

    return {
        title: event.title,
        description: event.description.substring(0, 160),
        openGraph: {
            title: event.title,
            description: event.description.substring(0, 160),
            images: [event.image],
        },
    };
}

export default function EventPage({ params }: EventPageProps) {
    return <EventDetailsPage id={params.id} />;
}