import { Metadata } from 'next';
import { getEventById } from '@/mocks/data/events';
import EventDetailsPage from '@/components/EventDetailsPage';

type Params = {
    id: string;
};

export async function generateMetadata({
    params,
}: {
    params: Params;
}): Promise<Metadata> {
    const eventId = params.id;
    const event = getEventById(eventId);

    if (!event) {
        return { title: 'Event Not Found' };
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

export default function EventPage({
    params,
}: {
    params: { id: string };
}) {
    return <EventDetailsPage id={params.id} />;
}