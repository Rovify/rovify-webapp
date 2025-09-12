import { base, baseSepolia } from 'wagmi/chains';

export const getTargetNetworks = () => {
  return [base, baseSepolia];
};

export const getBlockExplorerAddressLink = (network: any, address: string) => {
  if (!network || !address) return undefined;
  
  switch (network.id) {
    case 8453: // Base Mainnet
      return `https://basescan.org/address/${address}`;
    case 84531: // Base Sepolia
      return `https://sepolia.basescan.org/address/${address}`;
    default:
      return undefined;
  }
};
