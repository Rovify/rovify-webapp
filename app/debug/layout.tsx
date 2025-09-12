import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Debug Smart Contracts',
  description: 'Debug and interact with deployed smart contracts',
};

export default function DebugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-base-200">
      {children}
    </div>
  );
}
