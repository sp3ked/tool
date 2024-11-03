import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Copy, Shuffle } from 'lucide-react';
import './tools.css';

const FontPairingGenerator = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [headingFont, setHeadingFont] = useState('Quicksand');
  const [bodyFont, setBodyFont] = useState('Karla');
  const [headingSize, setHeadingSize] = useState(57);
  const [bodySize, setBodySize] = useState(16);
  const [copied, setCopied] = useState(false);

  // Curated font pairs
  const fontPairs = [
    { heading: 'Quicksand', body: 'Karla' },
    { heading: 'Playfair Display', body: 'Source Sans Pro' },
    { heading: 'Montserrat', body: 'Open Sans' },
    { heading: 'Roboto Slab', body: 'Roboto' },
    { heading: 'Oswald', body: 'Lato' },
    { heading: 'Lora', body: 'Merriweather Sans' },
    { heading: 'Poppins', body: 'Work Sans' },
    { heading: 'Ubuntu', body: 'PT Sans' },
    { heading: 'Raleway', body: 'Nunito' },
    { heading: 'Inter', body: 'DM Sans' }
  ];

  useEffect(() => {
    // Load fonts
    const loadFonts = async () => {
      await Promise.all([
        document.fonts.load(`${headingSize}px ${headingFont}`),
        document.fonts.load(`${bodySize}px ${bodyFont}`)
      ]);
    };
    loadFonts();
  }, [headingFont, bodyFont, headingSize, bodySize]);

  const generateRandomPair = () => {
    const randomPair = fontPairs[Math.floor(Math.random() * fontPairs.length)];
    setHeadingFont(randomPair.heading);
    setBodyFont(randomPair.body);
  };

  const getCSSCode = () => {
    return `/* Font Pairing CSS */
@import url('https://fonts.googleapis.com/css2?family=${headingFont.replace(' ', '+')}&family=${bodyFont.replace(' ', '+')}&display=swap');

/* Headings */
h1, h2, h3, h4, h5, h6 {
  font-family: '${headingFont}', sans-serif;
  font-size: ${headingSize}px;
}

/* Body Text */
body, p {
  font-family: '${bodyFont}', sans-serif;
  font-size: ${bodySize}px;
}`;
  };

  const copyCSS = async () => {
    try {
      await navigator.clipboard.writeText(getCSSCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy CSS: ', err);
    }
  };

  return (
    <div className={`tool-page ${darkMode ? 'dark-mode' : ''}`}>
      <div className="tool-header">
        <Link to="/" className="back-button">
          <ArrowLeft size={24} />
          <span>Back to Tools</span>
        </Link>
        <h1 className="tool-title">Font Pairing Generator</h1>
        <p className="tool-subtitle">Find the perfect font combination for your design projects</p>
      </div>

      <div className="tool-content">
        <div className="font-pairing-container">
          {/* Controls Header */}
          <div className="font-controls-header">
            <button 
              onClick={generateRandomPair}
              className="tool-button icon-button"
            >
              <Shuffle size={20} />
              Generate Random Pair
            </button>
            <label className="dark-mode-toggle">
              <span>Dark Mode</span>
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {/* Font Selection */}
          <div className="font-selection-grid">
            <div className="font-selection">
              <label htmlFor="headingFont">Heading Font</label>
              <select
                id="headingFont"
                value={headingFont}
                onChange={(e) => setHeadingFont(e.target.value)}
                className="tool-select"
              >
                {fontPairs.map(pair => (
                  <option key={pair.heading} value={pair.heading}>{pair.heading}</option>
                ))}
              </select>
            </div>

            <div className="font-selection">
              <label htmlFor="bodyFont">Body Font</label>
              <select
                id="bodyFont"
                value={bodyFont}
                onChange={(e) => setBodyFont(e.target.value)}
                className="tool-select"
              >
                {fontPairs.map(pair => (
                  <option key={pair.body} value={pair.body}>{pair.body}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Preview */}
          <div className="font-preview">
            <div 
              className="heading-preview"
              style={{ 
                fontFamily: `'${headingFont}', sans-serif`,
                fontSize: `${headingSize}px`
              }}
            >
              {headingFont}
            </div>
            <div 
              className="body-preview"
              style={{ 
                fontFamily: `'${bodyFont}', sans-serif`,
                fontSize: `${bodySize}px`
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
              tempor incididunt ut labore et dolore magna aliqua.
            </div>
          </div>

          {/* Size Controls */}
          <div className="font-size-controls">
            <div className="size-control">
              <label>Heading Font Size: {headingSize}px</label>
              <input
                type="range"
                min="24"
                max="72"
                value={headingSize}
                onChange={(e) => setHeadingSize(Number(e.target.value))}
                className="range-input"
              />
            </div>

            <div className="size-control">
              <label>Body Font Size: {bodySize}px</label>
              <input
                type="range"
                min="12"
                max="24"
                value={bodySize}
                onChange={(e) => setBodySize(Number(e.target.value))}
                className="range-input"
              />
            </div>
          </div>

          {/* CSS Code */}
          <div className="css-code-section">
            <button 
              onClick={copyCSS}
              className="tool-button icon-button"
            >
              <Copy size={20} />
              {copied ? 'Copied!' : 'Copy CSS'}
            </button>
          </div>

          {/* Related Tools */}
          <div className="related-tools">
            <p>Try our other design tools:</p>
            <div className="tool-links">
              <Link to="/color-palette">Color Palette Generator</Link>
              <Link to="/rgb-hex">RGB to HEX</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FontPairingGenerator;