import React from 'react';
import { Link } from 'react-router-dom';

const TheCommandry: React.FC = () => {
  // Outer container: covers the whole page
  const outerContainerStyle: React.CSSProperties = {
    position: 'relative',
    minHeight: '100vh',
  };

  // Grey vale overlay at 40% opacity
  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // 40% opacity
    zIndex: 0,
  };

  // Main content container (on top of overlay)
  const contentContainerStyle: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box',
  };

  // Title style: gold, large, centered (using MedievalSharp)
  const titleStyle: React.CSSProperties = {
    fontFamily: 'MedievalSharp, Arial, sans-serif',
    fontSize: '3rem',
    color: '#D4AF37',
    textAlign: 'center' as const,
    marginBottom: '40px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)', // title shadow
  };

  // Rules container: limits width, white text, justified alignment, and text shadow
  const rulesContainerStyle: React.CSSProperties = {
    fontFamily: 'MedievalSharp, Arial, sans-serif',
    color: '#FFFFFF',
    textAlign: 'justify' as const,
    maxWidth: '800px',
    lineHeight: '1.6',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)', // added text shadow for better legibility
  };

  // Paragraph style: space between each rule
  const paragraphStyle: React.CSSProperties = {
    marginBottom: '20px',
  };

  // Rule title style: gold color for the rule headings
  const ruleTitleStyle: React.CSSProperties = {
    color: '#D4AF37',
  };

  // Button style for "Swear Fealty and Enter"
  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundImage: 'linear-gradient(to right, #8B4513, #FFD700)',
    color: 'white',
    border: '2px solid #FFD700',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-image 0.3s ease-in-out',
    fontFamily: 'MedievalSharp, Arial, sans-serif',
    textShadow: '2px 2px 4px rgb(0, 0, 0)', // increased shadow for button text
    marginTop: '40px',
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
    <div style={outerContainerStyle}>
      {/* Grey vale overlay */}
      <div style={overlayStyle} />

      {/* Main content */}
      <div style={contentContainerStyle}>
        <h1 style={titleStyle}>The Creed of the Chivalric Order of Knightfall</h1>

        <div style={rulesContainerStyle}>
          <p style={paragraphStyle}>
            <strong style={ruleTitleStyle}>I. Loyalty to the Round Table</strong>
            <br />
            A Knight’s allegiance lies first with the Order — its mission, its members, and the truth it upholds. Betrayal of this sacred trust marks the fall of honour. The mission outweighs the man. Pride is the enemy of precision.
          </p>

          <p style={paragraphStyle}>
            <strong style={ruleTitleStyle}>II. Valour in Word and Deed</strong>
            <br />
            Courage is not the absence of fear, but the triumph over it. A Knight speaks with purpose, acts with intent, and defends the weak without hesitation. Though peace is our aim, we are forged for battle. When the code is threatened, our blade answers — swiftly and without mercy.
          </p>

          <p style={paragraphStyle}>
            <strong style={ruleTitleStyle}>III. Discretion as the Shield of Nobility</strong>
            <br />
            What is shared within the Round Table remains sealed. A Knight is a guardian of secrets, and a vault of trust. Legacy is built not through glory, but in the quiet justice we deliver.
          </p>

          <p style={paragraphStyle}>
            <strong style={ruleTitleStyle}>IV. The Truth Lies Beneath</strong>
            <br />
            A Knight is no blind servant. He questions dogma, exposes falsehoods, and treads where cowards dare not. He sees through illusion and breaks the comfort of lies, for clarity is earned — and truth is never given freely.
          </p>

          <p style={paragraphStyle}>
            <strong style={ruleTitleStyle}>V. Wisdom Over Impulse</strong>
            <br />
            Reflection tempers action. A Knight must question, study, and learn — knowing that the sharpest sword is a discerning mind. He observes before he acts, listens before he speaks, and understands before he judges.
          </p>

          <p style={paragraphStyle}>
            <strong style={ruleTitleStyle}>VI. We Train to Be Lethal, So We May Choose Peace</strong>
            <br />
            A Knight who cannot fight has no claim to virtue. We master body and blade — not to seek conflict, but to end it when forced upon us. Perfection is a myth, but relentless refinement is our way.
          </p>

          <p style={paragraphStyle}>
            <strong style={ruleTitleStyle}>VII. Unity Beyond Borders</strong>
            <br />
            A Knight recognises no divisions of race, creed, or nation — only the bond of shared virtue. Brotherhood transcends all. The strength of the Order lies in what unites, never in what divides.
          </p>

          <p style={paragraphStyle}>
            <strong style={ruleTitleStyle}>VIII. Nobility in Conduct</strong>
            <br />
            Whether before kings or commoners, a Knight must embody poise, humility, and grace. Chivalry is not a performance, but a way of being — guided not by ego, but by example.
          </p>

          <p style={paragraphStyle}>
            <strong style={ruleTitleStyle}>IX. Honour Before Glory</strong>
            <br />
            Prestige follows integrity, not the reverse. A Knight does not seek fame but earns respect through silent excellence. We carve no statues, nor seek thrones — for the Order endures through its deeds, not its monuments.
          </p>

          <p style={paragraphStyle}>
            <strong style={ruleTitleStyle}>X. The Oath Eternal</strong>
            <br />
            Upon ascent, each Knight swears to uphold this code. To break it is to exile oneself from the light of the Round Table. In shadow or sunlight, we remain bound by honour.
          </p>
        </div>

        {/* Button to /theinnerkeep */}
        <Link to="/theinnerkeep" style={{ textDecoration: 'none' }}>
          <button
            onMouseEnter={hoverEnter}
            onMouseLeave={hoverLeave}
            style={buttonStyle}
          >
            Swear Fealty and Enter
          </button>
        </Link>
      </div>
    </div>
  );
};

export default TheCommandry;
