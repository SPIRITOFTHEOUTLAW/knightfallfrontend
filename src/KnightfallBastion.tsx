// frontend/src/KnightfallBastion.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from './WalletContext';

const KnightfallBastion: React.FC = () => {
  const {
    isLoading,
    account,
    totalSupply,
    isMember,
    memberName,
    whitelistAddress,
    setWhitelistAddress,
    handleWhitelist,
    mintName,
    setMintName,
    mintTokenURI,
    setMintTokenURI,
    handleMint,
    status,
  } = useWallet();

  // Common button style
  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundImage: 'linear-gradient(to right, #8B4513, #FFD700)',
    color: 'white',
    border: '2px solid #FFD700',
    borderRadius: '5px',
    cursor: 'pointer',
    position: 'relative' as const,
    transition: 'background-image 0.3s ease-in-out',
    fontFamily: 'Times New Roman, serif',
  };

  const hoverEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundImage =
      'linear-gradient(to right, #8B4513, #FFD700, url("/images/red-cross.jpeg"))';
  };

  const hoverLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundImage =
      'linear-gradient(to right, #8B4513, #FFD700)';
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '20px',
        }}
      >
        <h1>The Chivalric Order of Knightfall</h1>
        {isLoading ? (
          <p>Checking membership...</p>
        ) : account ? (
          <>
            <p>Connected Account: {account}</p>
            <p>Total Supply: {totalSupply !== null ? totalSupply : 'Loading...'}</p>
            <p>Is Member: {isMember !== null ? (isMember ? 'Yes' : 'No') : 'Loading...'}</p>
            {isMember && memberName && <p>Member Name: {memberName}</p>}
            {isMember && (
              <Link to="/commandry">
                <button
                  onMouseEnter={hoverEnter}
                  onMouseLeave={hoverLeave}
                  style={buttonStyle}
                  title="Only those bound by oath may pass."
                >
                  Present Thy Seal
                </button>
              </Link>
            )}
            <div style={{ marginTop: '20px' }}>
              <h2>Whitelist an Address</h2>
              <input
                type="text"
                placeholder="Address to whitelist (0x...)"
                value={whitelistAddress}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWhitelistAddress(e.target.value)}
                style={{ width: '300px', marginRight: '10px' }}
              />
              <button
                onMouseEnter={hoverEnter}
                onMouseLeave={hoverLeave}
                style={buttonStyle}
                onClick={handleWhitelist}
              >
                Whitelist
              </button>
            </div>
            <div style={{ marginTop: '20px' }}>
              <h2>Mint an NFT</h2>
              <input
                type="text"
                placeholder="Declare Sigil (e.g., Lancelot)"
                value={mintName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMintName(e.target.value)}
                style={{ width: '300px', marginRight: '10px', marginBottom: '10px' }}
              />
              <br />
              <input
                type="text"
                placeholder="Token URI (e.g., ipfs://example)"
                value={mintTokenURI}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMintTokenURI(e.target.value)}
                style={{ width: '300px', marginRight: '10px' }}
              />
              <button
                onMouseEnter={hoverEnter}
                onMouseLeave={hoverLeave}
                style={buttonStyle}
                onClick={handleMint}
              >
                Mint
              </button>
            </div>
            {status && <p style={{ marginTop: '20px' }}>{status}</p>}
          </>
        ) : (
          <p>Please connect your wallet (MetaMask).</p>
        )}
      </div>
    </div>
  );
};

export default KnightfallBastion;