import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import KnightfallCodexABI from './abi/KnightfallCodex.json';

// Hardcode the contract address
const CONTRACT_ADDRESS = "0xFcf083f1E6a975B2365315af4Bed2d32FEC262Df";

const CodexVault: React.FC = () => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [totalSupply, setTotalSupply] = useState<number>(0);
  const [userNFTs, setUserNFTs] = useState<any[]>([]);
  const [userCategory, setUserCategory] = useState<string>(''); // State for the user's category
  const [error, setError] = useState<string | null>(null);

  // Connect to MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const signer = await new ethers.BrowserProvider(window.ethereum).getSigner();
        const address = await signer.getAddress();

        setAccount(address);

        const contract = new ethers.Contract(CONTRACT_ADDRESS, KnightfallCodexABI, signer);
        setContract(contract);
      } catch (err) {
        setError('Failed to connect to wallet: ' + (err as Error).message);
      }
    } else {
      setError('Please install MetaMask to use this app.');
    }
  };

  // Fetch contract data
  const fetchContractData = async () => {
    if (!contract || !account) return;

    try {
      // Get total supply (number of pre-approved names)
      const total = await contract.totalSupply();
      setTotalSupply(Number(total));

      // Fetch user's NFTs
      const nfts = [];
      // Check if the user is a member
      const isMember = await contract.isMember(account);
      if (isMember) {
        const name = await contract.memberName(account);
        const category = await contract.memberCategory(account);
        // Set the user's category for the welcome message
        setUserCategory(getCategoryName(Number(category)));
        // Loop through all token IDs to find the one owned by the user
        for (let i = 1; i <= total; i++) {
          try {
            const owner = await contract.ownerOf(i);
            if (owner.toLowerCase() === account.toLowerCase()) {
              const uri = await contract.tokenURI(i);
              nfts.push({ tokenId: i, name, category: Number(category), uri });
              break; // Stop once we find the user's NFT
            }
          } catch (err) {
            // Token doesn't exist or isn't owned by the user
            continue;
          }
        }
      }
      setUserNFTs(nfts);
    } catch (err) {
      setError('Error fetching contract data: ' + (err as Error).message);
    }
  };

  // Convert category number to name
  const getCategoryName = (category: number) => {
    const categories = ['None', 'Knight', 'Commander', 'Captain', 'Oracle', 'Sentinel', 'Warrior'];
    return categories[category] || 'Unknown';
  };

  // Connect wallet on mount
  useEffect(() => {
    if (window.ethereum) {
      connectWallet();
    }
  }, []);

  // Fetch contract data when connected
  useEffect(() => {
    if (contract && account) {
      fetchContractData();
    }
  }, [contract, account]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>The Chivalric Order of Knightfall Vault</h1>
      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <p>Welcome, noble {userCategory || 'member'}! Address: {account}</p>
          <p>Total Pre-approved Names: {totalSupply}</p>

          <h2>Your Knightfall Sigil (KS) NFTs</h2>
          {userNFTs.length > 0 ? (
            <ul>
              {userNFTs.map((nft) => (
                <li key={nft.tokenId}>
                  Token ID: {nft.tokenId} | Name: {nft.name} | Category: {getCategoryName(nft.category)} | URI: {nft.uri}
                </li>
              ))}
            </ul>
          ) : (
            <p>You don’t own any Knightfall Sigil (KS) NFTs yet.</p>
          )}

          {error && <p style={{ color: 'red' }}>{error}</p>}
        </>
      )}
    </div>
  );
};

export default CodexVault;