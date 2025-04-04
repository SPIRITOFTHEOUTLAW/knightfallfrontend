// BlackstarLoader.tsx
import React from 'react';

const BlackstarLoader: React.FC = () => {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'monospace',
        color: '#fff',
      }}
    >
      <p style={{ fontSize: '1.5rem', margin: '10px 0' }}>🛡️ Initiating Blackstar Protocol…</p>
      <p style={{ fontSize: '1.5rem', margin: '10px 0' }}>🛰️ Establishing orbital relay uplink…</p>
      <p style={{ fontSize: '1.5rem', margin: '10px 0' }}>🔍 Scanning encrypted coordinates…</p>
    </div>
  );
};

export default BlackstarLoader;
