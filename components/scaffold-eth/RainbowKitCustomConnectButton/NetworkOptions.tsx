'use client';

interface NetworkOptionsProps {
  hidden?: boolean;
}

export const NetworkOptions = ({ hidden = false }: NetworkOptionsProps) => {
  if (hidden) return null;
  
  return (
    <div className="space-y-1">
      {/* Placeholder for network options */}
      <div className="text-sm text-gray-500 p-2">Network Options</div>
    </div>
  );
};
