'use client';

import { useMemo } from 'react';
import { useTargetNetwork } from './useTargetNetwork';

export const useNetworkColor = () => {
  const { targetNetwork } = useTargetNetwork();
  
  const networkColor = useMemo(() => {
    switch (targetNetwork.id) {
      case 8453: // Base Mainnet
        return '#0052ff';
      case 84531: // Base Sepolia
        return '#f97316';
      default:
        return '#6b7280';
    }
  }, [targetNetwork.id]);

  return networkColor;
};
