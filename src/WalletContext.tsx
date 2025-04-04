// frontend/src/WalletContext.tsx
import { createContext, useContext } from 'react';

interface WalletContextType {
  isLoading: boolean;
  account: string | null;
  totalSupply: number | null;
  isMember: boolean | null;
  memberName: string | null;
  tokenId: string | null;
  memberCategory: string | null; // Add memberCategory to the context
  whitelistAddress: string;
  setWhitelistAddress: (address: string) => void;
  handleWhitelist: () => Promise<void>;
  mintName: string;
  setMintName: (name: string) => void;
  mintTokenURI: string;
  setMintTokenURI: (uri: string) => void;
  handleMint: () => Promise<void>;
  status: string;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletContext.Provider');
  }
  return context;
};

export { WalletContext, useWallet };