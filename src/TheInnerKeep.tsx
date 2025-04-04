import React from 'react';
import { Link } from 'react-router-dom';

const TheInnerKeep: React.FC = () => {
  // Subheading style
  const subheadingStyle: React.CSSProperties = {
    marginBottom: '6px',
    marginTop: 0,
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#D4AF37',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
    textAlign: 'center' as const
  };

  // Quote style
  const quoteStyle: React.CSSProperties = {
    color: '#FFFFFF',
    fontSize: '1rem',
    textAlign: 'justify' as const,
    width: '320px',
    margin: '0 auto',
    lineHeight: 1.3,
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        backgroundImage: 'url("/background.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        fontFamily: 'MedievalSharp, Arial, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Semi-transparent overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 0
        }}
      />

      {/* Main content wrapper */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '1200px',       // Fixed width container
          margin: '0 auto',      // Centers horizontally
          textAlign: 'center',
          boxSizing: 'border-box',
          padding: '0 20px'
        }}
      >
        {/* Title Section */}
        <div style={{ marginBottom: '40px' }}>
          <h2
            style={{
              marginBottom: '10px',
              fontSize: '2.5rem', // Larger title
              fontWeight: 800,
              color: '#D4AF37',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
              textAlign: 'center'
            }}
          >
            Knightfall – Post-Authentication Structure
          </h2>
          <p
            style={{
              color: '#FFFFFF',
              fontSize: '1.3rem', // Larger subtext
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
              margin: 0
            }}
          >
            The central sanctum of the Order. Only those who bear the Sigil may pass within these halls. From here, members may access all the principal domains of Knightfall:
          </p>
        </div>

        {/*
          3x3 grid with named areas:

            Row 1: "vault library codex"
            Row 2: "greatHall map alchemists"
            Row 3: ". forgery ."

          The 7th item (forgery) is under the 5th (map).
        */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gridTemplateRows: 'auto auto auto',
            gridTemplateAreas: `
              "vault library codex"
              "greatHall map alchemists"
              ". forgery ."
            `,
            gap: '30px',
            justifyItems: 'center',
            margin: '40px auto 0 auto'
          }}
        >
          {/* 1. Your Vault */}
          <Link
            to="/vault"
            style={{
              gridArea: 'vault',
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <h3 style={subheadingStyle}>Your Vault</h3>
            <p style={quoteStyle}>
              “Where your legacy is recorded, your rank sealed, and your Sigil protected.”
            </p>
          </Link>

          {/* 2. Library of Alexandria */}
          <Link
            to="/library"
            style={{
              gridArea: 'library',
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <h3 style={subheadingStyle}>Library of Alexandria</h3>
            <p style={quoteStyle}>
              “A sanctuary of sacred texts and enlightened thought — knowledge bound by fire and ink.”
            </p>
          </Link>

          {/* 3. Knightfall Codex */}
          <Link
            to="/codex"
            style={{
              gridArea: 'codex',
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <h3 style={subheadingStyle}>Knightfall Codex</h3>
            <p style={quoteStyle}>
              “The living ledger of the Order — a network of alliances, names, and whispered histories.”
            </p>
          </Link>

          {/* 4. The Great Hall */}
          <Link
            to="/great-hall"
            style={{
              gridArea: 'greatHall',
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <h3 style={subheadingStyle}>The Great Hall</h3>
            <p style={quoteStyle}>
              “Where voices rise, tales are shared, and the fellowship gathers.”
            </p>
          </Link>

          {/* 5. The Map Room */}
          <Link
            to="/map-room"
            style={{
              gridArea: 'map',
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <h3 style={subheadingStyle}>The Map Room</h3>
            <p style={quoteStyle}>
              “A cartographic web of the realm — trace the presence of knights across the world.”
            </p>
          </Link>

          {/* 6. The Alchemist’s Wing */}
          <Link
            to="/alchemists-wing"
            style={{
              gridArea: 'alchemists',
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <h3 style={subheadingStyle}>The Alchemist’s Wing</h3>
            <p style={quoteStyle}>
              “Where knowledge ferments, chaos brews, and secrets are born in smoke and shimmer.”
            </p>
          </Link>

          {/* 7. The Forgery */}
          <Link
            to="/forgery"
            style={{
              gridArea: 'forgery',
              textDecoration: 'none',
              color: 'inherit'
            }}
          >
            <h3 style={subheadingStyle}>The Forgery</h3>
            <p style={quoteStyle}>
              “Where honour takes form — banners, crests, and tokens are forged in fire and code.”
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TheInnerKeep;
