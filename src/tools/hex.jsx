import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Copy, ArrowDown, RefreshCw } from 'lucide-react';
import './tools.css';

const RGBtoHEX = () => {
  const [rgb, setRgb] = useState({ r: 0, g: 0, b: 0 });
  const [hex, setHex] = useState('#000000');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState('rgb-to-hex'); // or 'hex-to-rgb'

  // Convert RGB to HEX
  useEffect(() => {
    if (mode === 'rgb-to-hex') {
      const hexValue = '#' + [rgb.r, rgb.g, rgb.b]
        .map(x => {
          const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('');
      setHex(hexValue);
    }
  }, [rgb, mode]);

  // Convert HEX to RGB
  useEffect(() => {
    if (mode === 'hex-to-rgb' && hex.length === 7) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (result) {
        setRgb({
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        });
      }
    }
  }, [hex, mode]);

  const handleHexInput = (value) => {
    if (value[0] !== '#') value = '#' + value;
    if (/^#[\da-f]{0,6}$/i.test(value)) {
      setHex(value.toLowerCase());
    }
  };

  const handleRgbInput = (color, value) => {
    const numValue = Math.min(255, Math.max(0, Number(value)));
    setRgb(prev => ({ ...prev, [color]: numValue }));
  };

  const copyToClipboard = async () => {
    try {
      const textToCopy = mode === 'rgb-to-hex' 
        ? hex 
        : `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const toggleMode = () => {
    setMode(prev => prev === 'rgb-to-hex' ? 'hex-to-rgb' : 'rgb-to-hex');
  };

  return (
    <div className="tool-page">
      <div className="tool-header">
        <Link to="/" className="back-button">
          <ArrowLeft size={24} />
          <span>Back to Tools</span>
        </Link>
        <h1 className="tool-title">Color Converter</h1>
        <p className="tool-subtitle">Convert between RGB and HEX color formats</p>
      </div>

      <div className="tool-content">
        <div className="color-converter-container">
          {/* Color Preview */}
          <div 
            className="color-preview"
            style={{ 
              backgroundColor: hex,
              color: (rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114) > 186 ? '#000000' : '#ffffff'
            }}
          >
            <span>Color Preview</span>
            <div className="color-values">
              <span>RGB: {`${rgb.r}, ${rgb.g}, ${rgb.b}`}</span>
              <span>HEX: {hex}</span>
            </div>
          </div>

          {/* Converter Controls */}
          <div className="converter-controls">
            <button 
              onClick={toggleMode} 
              className="toggle-mode-button"
            >
              <RefreshCw size={20} />
              Switch Mode
            </button>

            {mode === 'rgb-to-hex' ? (
              <div className="rgb-inputs">
                <div className="input-row">
                  <div className="input-group">
                    <label>Red</label>
                    <input
                      type="number"
                      value={rgb.r}
                      onChange={(e) => handleRgbInput('r', e.target.value)}
                      min="0"
                      max="255"
                      className="tool-input"
                    />
                  </div>
                  <div className="input-group">
                    <label>Green</label>
                    <input
                      type="number"
                      value={rgb.g}
                      onChange={(e) => handleRgbInput('g', e.target.value)}
                      min="0"
                      max="255"
                      className="tool-input"
                    />
                  </div>
                  <div className="input-group">
                    <label>Blue</label>
                    <input
                      type="number"
                      value={rgb.b}
                      onChange={(e) => handleRgbInput('b', e.target.value)}
                      min="0"
                      max="255"
                      className="tool-input"
                    />
                  </div>
                </div>
                <ArrowDown className="converter-arrow" size={24} />
                <div className="result-display">
                  <label>HEX Color</label>
                  <input
                    type="text"
                    value={hex}
                    readOnly
                    className="tool-input"
                  />
                </div>
              </div>
            ) : (
              <div className="hex-input">
                <div className="input-group">
                  <label>HEX Color</label>
                  <input
                    type="text"
                    value={hex}
                    onChange={(e) => handleHexInput(e.target.value)}
                    placeholder="#000000"
                    className="tool-input"
                  />
                </div>
                <ArrowDown className="converter-arrow" size={24} />
                <div className="result-display">
                  <label>RGB Values</label>
                  <input
                    type="text"
                    value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
                    readOnly
                    className="tool-input"
                  />
                </div>
              </div>
            )}

            <button 
              onClick={copyToClipboard}
              className="tool-button icon-button"
            >
              <Copy size={20} />
              {copied ? 'Copied!' : 'Copy Value'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RGBtoHEX;