'use client';

import { Address } from 'viem';

interface BlockieAvatarProps {
  address: Address;
  size: number;
  ensImage?: string;
  className?: string;
}

export const BlockieAvatar = ({ address, size, ensImage, className }: BlockieAvatarProps) => {
  // Simple blockie generation - you can replace with a proper blockie library
  const blockieData = `data:image/svg+xml;base64,${btoa(`
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#${address.slice(2, 8)}"/>
      <rect x="${size/4}" y="${size/4}" width="${size/2}" height="${size/2}" fill="#${address.slice(8, 14)}"/>
    </svg>
  `)}`;

  if (ensImage) {
    return (
      <img
        src={ensImage}
        alt={`Avatar for ${address}`}
        width={size}
        height={size}
        className={`rounded-full ${className}`}
      />
    );
  }

  return (
    <img
      src={blockieData}
      alt={`Blockie for ${address}`}
      width={size}
      height={size}
      className={`rounded-full ${className}`}
    />
  );
};
