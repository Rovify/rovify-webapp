// app/success/page.tsx
import SuccessPage from '@/components/SuccessPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Success',
    description: 'Your action has been completed successfully.',
};

function isValidSuccessType(type: string): type is 'event' | 'ticket' | 'profile' | 'general' {
    return ['event', 'ticket', 'profile', 'general'].includes(type);
}

export default function Success({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const typeParam = searchParams.type as string || 'general';

    const type = isValidSuccessType(typeParam) ? typeParam : 'general';

    return <SuccessPage type={type} />;
}