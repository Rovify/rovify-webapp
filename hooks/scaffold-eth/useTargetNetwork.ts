'use client';

import { useMemo } from 'react';
import { base, baseSepolia } from 'wagmi/chains';

export const useTargetNetwork = () => {
  const targetNetwork = useMemo(() => {
    // Default to Base Sepolia for development
    return baseSepolia;
  }, []);

  return { targetNetwork };
};
