import React, { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import KnightfallCodexABI from './abi/KnightfallCodex.json';
import CodexVault from './CodexVault';

const App: React.FC = () => {
  const [totalSupply, setTotalSupply] = useState<number | null>(null);
  const [isMember, setIsMember] = useState<boolean | null>(null);
  const [memberName, setMemberName] = useState<string | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [whitelistAddress, setWhitelistAddress] = useState<string>("");
  const [mintName, setMintName] = useState<string>("");
  const [mintTokenURI, setMintTokenURI] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true); // New state for loading
  const contractAddress = "0xFcf083f1E6a975B2365315af4Bed2d32FEC262Df";
  const alchemyUrl = "https://eth-sepolia.g.alchemy.com/v2/K5u9VECWZWJoA5qAXwMwxYeC0Ge-VUwq";

  const readContractRef = useRef<ethers.Contract | null>(null);
  const writeContractRef = useRef<ethers.Contract | null>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    async function connectWallet() {
      if (window.ethereum) {
        try {
          // Check if the user is already connected
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.send("eth_accounts", []);
          let address: string | null = null;

          if (accounts.length > 0) {
            // User is already connected, use the first account
            address = accounts[0];
          } else {
            // Request account access
            await provider.send("eth_requestAccounts", []);
            const signer = await provider.getSigner();
            address = await signer.getAddress();
          }

          if (isMounted.current) setAccount(address);

          const readProvider = new ethers.JsonRpcProvider(alchemyUrl);
          readContractRef.current = new ethers.Contract(contractAddress, KnightfallCodexABI, readProvider);
          writeContractRef.current = new ethers.Contract(contractAddress, KnightfallCodexABI, await provider.getSigner());

          if (readContractRef.current && address) {
            const supply = await readContractRef.current.totalSupply();
            if (isMounted.current) setTotalSupply(Number(supply));
            const memberStatus = await readContractRef.current.isMember(address);
            if (isMounted.current) {
              setIsMember(memberStatus);
              // Persist isMember in localStorage
              localStorage.setItem('isMember', JSON.stringify(memberStatus));
              if (memberStatus) {
                const name = await readContractRef.current.memberName(address);
                setMemberName(name);
              }
            }
          }
        } catch (error: any) {
          if (isMounted.current) setStatus("Error: " + (error.message || "Unknown error"));
        } finally {
          if (isMounted.current) setIsLoading(false);
        }
      } else {
        if (isMounted.current) {
          setStatus("Please install MetaMask!");
          setIsLoading(false);
        }
      }
    }

    // Check if isMember is stored in localStorage
    const storedIsMember = localStorage.getItem('isMember');
    if (storedIsMember !== null) {
      setIsMember(JSON.parse(storedIsMember));
    }

    connectWallet();

    return () => {
      isMounted.current = false;
    };
  }, []);

  const handleWhitelist = async () => {
    if (!writeContractRef.current || !whitelistAddress) return;
    try {
      const tx = await writeContractRef.current.whitelistMember(whitelistAddress);
      setStatus("Whitelisting... Transaction Hash: " + tx.hash);
      await tx.wait();
      setStatus("Successfully whitelisted " + whitelistAddress);
      setWhitelistAddress("");
    } catch (error: any) {
      setStatus("Error whitelisting: " + (error.message || "Unknown error"));
    }
  };

  const handleMint = async () => {
    if (!writeContractRef.current || !mintName || !mintTokenURI) return;
    try {
      const tx = await writeContractRef.current.mintMembership(mintName, mintTokenURI);
      setStatus("Minting... Transaction Hash: " + tx.hash);
      await tx.wait();
      setStatus("Successfully minted NFT for " + mintName);
      setMintName("");
      setMintTokenURI("");
      if (readContractRef.current && account) {
        const supply = await readContractRef.current.totalSupply();
        if (isMounted.current) setTotalSupply(Number(supply));
        const memberStatus = await readContractRef.current.isMember(account);
        if (isMounted.current) {
          setIsMember(memberStatus);
          // Update isMember in localStorage
          localStorage.setItem('isMember', JSON.stringify(memberStatus));
          if (memberStatus) {
            const name = await readContractRef.current.memberName(account);
            setMemberName(name);
          }
        }
      }
    } catch (error: any) {
      setStatus("Error minting: " + (error.message || "Unknown error"));
    }
  };

  return (
    <div>
      <Router>
        <div style={{ padding: '20px' }}>
          <h1>The Chivalric Order of Knightfall</h1>
          {isLoading ? (
            <p>Checking membership...</p>
          ) : account ? (
            <>
              <p>Connected Account: {account}</p>
              <p>Total Supply: {totalSupply !== null ? totalSupply : 'Loading...'}</p>
              <p>Is Member: {isMember !== null ? (isMember ? 'Yes' : 'No') : 'Loading...'}</p>
              {isMember && memberName && (
                <p>Member Name: {memberName}</p>
              )}
              {isMember && (
                <Link to="/vault">
                  <button
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundImage = 'linear-gradient(to right, #8B4513, #FFD700, url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'50\' height=\'50\'><path d=\'M10 10 L40 40 M40 10 L10 40\' stroke=\'red\' stroke-width=\'2\'/></svg>")')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundImage = 'linear-gradient(to right, #8B4513, #FFD700)')}
                    style={{
                      padding: '10px 20px',
                      fontSize: '16px',
                      backgroundImage: 'linear-gradient(to right, #8B4513, #FFD700)',
                      color: 'white',
                      border: '2px solid #FFD700',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'background-image 0.3s ease-in-out'
                    }}
                    title="Only those bound by oath may pass."
                  >
                    Swear Fealty & Enter
                  </button>
                </Link>
              )}
              <div style={{ marginTop: '20px' }}>
                <h2>Whitelist an Address</h2>
                <input
                  type="text"
                  placeholder="Address to whitelist (0x...)"
                  value={whitelistAddress}
                  onChange={(e) => setWhitelistAddress(e.target.value)}
                  style={{ width: '300px', marginRight: '10px' }}
                />
                <button onClick={handleWhitelist}>Whitelist</button>
              </div>
              <div style={{ marginTop: '20px' }}>
                <h2>Mint an NFT</h2>
                <input
                  type="text"
                  placeholder="Declare Sigil (e.g., Lancelot)"
                  value={mintName}
                  onChange={(e) => setMintName(e.target.value)}
                  style={{ width: '300px', marginRight: '10px', marginBottom: '10px' }}
                />
                <br />
                <input
                  type="text"
                  placeholder="Token URI (e.g., ipfs://example)"
                  value={mintTokenURI}
                  onChange={(e) => setMintTokenURI(e.target.value)}
                  style={{ width: '300px', marginRight: '10px' }}
                />
                <button onClick={handleMint}>Mint</button>
              </div>
              {status && <p style={{ marginTop: '20px' }}>{status}</p>}
            </>
          ) : (
            <p>Please connect your wallet (MetaMask).</p>
          )}
        </div>
        <Routes>
          <Route path="/vault" element={isLoading ? <div>Checking membership...</div> : (isMember ? <CodexVault /> : <Navigate to="/" />)} />
          <Route path="/" element={<div />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;