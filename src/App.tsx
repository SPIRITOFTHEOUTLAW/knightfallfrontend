// frontend/src/App.tsx
import React, { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import KnightfallCodexABI from './abi/KnightfallCodex.json';
import KnightfallBastion from './KnightfallBastion';
import TheCommandry from './TheCommandry';
import TheInnerKeep from './TheInnerKeep';
import YourVault from './YourVault';
import LibraryOfAlexandria from './LibraryOfAlexandria';
import KnightfallCodex from './KnightfallCodex';
import TheGreatHall from './TheGreatHall';
import TheMapRoom from './TheMapRoom';
import TheForgery from './TheForgery';
import TheAlchemistsWing from './TheAlchemistsWing';
import { WalletContext } from './WalletContext';

const App: React.FC = () => {
  const [totalSupply, setTotalSupply] = useState<number | null>(null);
  const [isMember, setIsMember] = useState<boolean | null>(null);
  const [memberName, setMemberName] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [memberCategory, setMemberCategory] = useState<string | null>(null); // Add memberCategory state
  const [account, setAccount] = useState<string | null>(null);
  const [whitelistAddress, setWhitelistAddress] = useState<string>("");
  const [mintName, setMintName] = useState<string>("");
  const [mintTokenURI, setMintTokenURI] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const contractAddress = "0x43Db45EFcb7B28cA004728e74F6Ca880d5F31C39";
  const alchemyUrl = "https://eth-sepolia.g.alchemy.com/v2/K5u9VECWZWJoA5qAXwMwxYeC0Ge-VUwq";

  const readContractRef = useRef<ethers.Contract | null>(null);
  const writeContractRef = useRef<ethers.Contract | null>(null);
  const isMounted = useRef(true);

  // Map numeric enum values to string representations
  const memberCategoryMap: { [key: number]: string } = {
    0: "None",
    1: "Knight",
    2: "Commander",
    3: "Captain",
    4: "Oracle",
    5: "Sentinel",
    6: "Warrior",
  };

  useEffect(() => {
    isMounted.current = true;

    async function connectWallet() {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.send("eth_accounts", []);
          let address: string | null = null;

          if (accounts.length > 0) {
            address = accounts[0];
          } else {
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
              localStorage.setItem('isMember', JSON.stringify(memberStatus));

              if (memberStatus) {
                const name = await readContractRef.current.memberName(address);
                setMemberName(name);

                // Fetch tokenId using getTokenIdForAddress
                try {
                  const id = await readContractRef.current.getTokenIdForAddress(address);
                  const tokenIdStr = id.toString();
                  setTokenId(tokenIdStr);
                  localStorage.setItem(`tokenId_${address}`, tokenIdStr);
                } catch (error) {
                  console.error("Error fetching tokenId:", error);
                  setTokenId(null);
                }

                // Fetch memberCategory
                try {
                  const category = await readContractRef.current.memberCategory(address);
                  const categoryStr = memberCategoryMap[Number(category)] || "None";
                  setMemberCategory(categoryStr);
                  localStorage.setItem(`memberCategory_${address}`, categoryStr);
                } catch (error) {
                  console.error("Error fetching memberCategory:", error);
                  setMemberCategory(null);
                }
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

    const storedIsMember = localStorage.getItem('isMember');
    if (storedIsMember !== null) {
      setIsMember(JSON.parse(storedIsMember));
    }

    // Check for stored tokenId and memberCategory
    const storedAccount = localStorage.getItem('account');
    if (storedAccount) {
      const storedTokenId = localStorage.getItem(`tokenId_${storedAccount}`);
      if (storedTokenId) {
        setTokenId(storedTokenId);
      }
      const storedCategory = localStorage.getItem(`memberCategory_${storedAccount}`);
      if (storedCategory) {
        setMemberCategory(storedCategory);
      }
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
          localStorage.setItem('isMember', JSON.stringify(memberStatus));

          if (memberStatus) {
            const name = await readContractRef.current.memberName(account);
            setMemberName(name);

            // Fetch tokenId after minting
            try {
              const id = await readContractRef.current.getTokenIdForAddress(account);
              const tokenIdStr = id.toString();
              setTokenId(tokenIdStr);
              localStorage.setItem(`tokenId_${account}`, tokenIdStr);
            } catch (error) {
              console.error("Error fetching tokenId after minting:", error);
              setTokenId(null);
            }

            // Fetch memberCategory after minting
            try {
              const category = await readContractRef.current.memberCategory(account);
              const categoryStr = memberCategoryMap[Number(category)] || "None";
              setMemberCategory(categoryStr);
              localStorage.setItem(`memberCategory_${account}`, categoryStr);
            } catch (error) {
              console.error("Error fetching memberCategory after minting:", error);
              setMemberCategory(null);
            }
          }
        }
      }
    } catch (error: any) {
      setStatus("Error minting: " + (error.message || "Unknown error"));
    }
  };

  return (
    <WalletContext.Provider value={{
      isLoading,
      account,
      totalSupply,
      isMember,
      memberName,
      tokenId,
      memberCategory, // Add memberCategory to the context
      whitelistAddress,
      setWhitelistAddress,
      handleWhitelist,
      mintName,
      setMintName,
      mintTokenURI,
      setMintTokenURI,
      handleMint,
      status,
    }}>
      <div style={{
        minHeight: '100vh',
        backgroundImage: 'url("/background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative'
      }}>
        <Router>
          <Routes>
            {/* Top-Level Pages */}
            <Route path="/" element={<KnightfallBastion />} />
            <Route path="/commandry" element={<TheCommandry />} />
            <Route path="/theinnerkeep" element={
              isLoading
                ? <div style={{ color: 'white', textAlign: 'center', zIndex: 2, position: 'relative' }}>Checking membership...</div>
                : (isMember ? <TheInnerKeep /> : <Navigate to="/" />)
            } />

            {/* Chambers Within the Inner Keep */}
            <Route path="/vault" element={
              isLoading
                ? <div style={{ color: 'white', textAlign: 'center', zIndex: 2, position: 'relative' }}>Checking membership...</div>
                : (isMember ? <YourVault /> : <Navigate to="/" />)
            } />
            <Route path="/library" element={
              isLoading
                ? <div style={{ color: 'white', textAlign: 'center', zIndex: 2, position: 'relative' }}>Checking membership...</div>
                : (isMember ? <LibraryOfAlexandria /> : <Navigate to="/" />)
            } />
            <Route path="/codex" element={
              isLoading
                ? <div style={{ color: 'white', textAlign: 'center', zIndex: 2, position: 'relative' }}>Checking membership...</div>
                : (isMember ? <KnightfallCodex /> : <Navigate to="/" />)
            } />
            <Route path="/great-hall" element={
              isLoading
                ? <div style={{ color: 'white', textAlign: 'center', zIndex: 2, position: 'relative' }}>Checking membership...</div>
                : (isMember ? <TheGreatHall /> : <Navigate to="/" />)
            } />
            <Route path="/map-room" element={
              isLoading
                ? <div style={{ color: 'white', textAlign: 'center', zIndex: 2, position: 'relative' }}>Checking membership...</div>
                : (isMember ? <TheMapRoom /> : <Navigate to="/" />)
            } />
            <Route path="/forgery" element={
              isLoading
                ? <div style={{ color: 'white', textAlign: 'center', zIndex: 2, position: 'relative' }}>Checking membership...</div>
                : (isMember ? <TheForgery /> : <Navigate to="/" />)
            } />
            <Route path="/alchemists-wing" element={
              isLoading
                ? <div style={{ color: 'white', textAlign: 'center', zIndex: 2, position: 'relative' }}>Checking membership...</div>
                : (isMember ? <TheAlchemistsWing /> : <Navigate to="/" />)
            } />

            {/* Redirect any unmatched route to the landing page */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </div>
    </WalletContext.Provider>
  );
};

export default App;