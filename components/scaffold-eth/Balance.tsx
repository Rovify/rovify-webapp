'use client';

import { Address } from 'viem';

interface BalanceProps {
  address?: Address;
  className?: string;
}

export const Balance = ({ address, className }: BalanceProps) => {
  // Placeholder component - you can implement actual balance fetching here
  return (
    <span className={className}>
      -- ETH
    </span>
  );
};
