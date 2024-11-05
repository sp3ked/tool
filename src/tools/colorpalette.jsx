import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Copy, RefreshCw, Lock, Unlock, Download } from 'lucide-react';
import './tools.css';

const ColorPaletteGenerator = () => {
  const [palette, setPalette] = useState([
    { hex: '#264653', locked: false },
    { hex: '#2A9D8F', locked: false },
    { hex: '#E9C46A', locked: false },
    { hex: '#F4A261', locked: false },
    { hex: '#E76F51', locked: false }
  ]);
  const [paletteType, setPaletteType] = useState('random');
  const [copied, setCopied] = useState(false);

  // Generate random hex color
  const generateRandomColor = useCallback(() => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }, []);

  // Convert hex to HSL
  const hexToHSL = useCallback((hex) => {
    let r = parseInt(hex.substring(1,3), 16) / 255;
    let g = parseInt(hex.substring(3,5), 16) / 255;
    let b = parseInt(hex.substring(5,7), 16) / 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }, []);

  // Convert HSL to hex
  const hslToHex = useCallback((h, s, l) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }, []);

  // Generate monochromatic palette
  const generateMonochromatic = useCallback((baseColor) => {
    const { h, s, l } = hexToHSL(baseColor);
    return [
      hslToHex(h, s, Math.max(0, l - 30)),
      hslToHex(h, s, Math.max(0, l - 15)),
      baseColor,
      hslToHex(h, s, Math.min(100, l + 15)),
      hslToHex(h, s, Math.min(100, l + 30))
    ];
  }, [hexToHSL, hslToHex]);

  // Generate complementary palette
  const generateComplementary = useCallback((baseColor) => {
    const { h, s, l } = hexToHSL(baseColor);
    return [
      baseColor,
      hslToHex(h, s * 0.8, l),
      hslToHex(h, s * 0.6, l),
      hslToHex((h + 180) % 360, s, l),
      hslToHex((h + 180) % 360, s * 0.8, l)
    ];
  }, [hexToHSL, hslToHex]);

  // Generate analogous palette
  const generateAnalogous = useCallback((baseColor) => {
    const { h, s, l } = hexToHSL(baseColor);
    return [
      hslToHex((h - 40 + 360) % 360, s, l),
      hslToHex((h - 20 + 360) % 360, s, l),
      baseColor,
      hslToHex((h + 20) % 360, s, l),
      hslToHex((h + 40) % 360, s, l)
    ];
  }, [hexToHSL, hslToHex]);

  const generateNewPalette = useCallback(() => {
    const baseColor = generateRandomColor();
    let colors;

    switch (paletteType) {
      case 'monochromatic':
        colors = generateMonochromatic(baseColor);
        break;
      case 'complementary':
        colors = generateComplementary(baseColor);
        break;
      case 'analogous':
        colors = generateAnalogous(baseColor);
        break;
      default:
        colors = Array(5).fill().map(() => generateRandomColor());
    }

    setPalette(prevPalette => 
      prevPalette.map((color, index) => 
        color.locked ? color : { ...color, hex: colors[index] }
      )
    );
  }, [paletteType, generateRandomColor, generateMonochromatic, generateComplementary, generateAnalogous]);

  useEffect(() => {
    generateNewPalette();
  }, [paletteType, generateNewPalette]);

  const toggleLock = (index) => {
    setPalette(prev => {
      const newPalette = [...prev];
      newPalette[index] = { ...newPalette[index], locked: !newPalette[index].locked };
      return newPalette;
    });
  };

  const copyColor = async (hex) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(hex);
      setTimeout(() => setCopied(false), 1000);
    } catch (err) {
      console.error('Failed to copy color: ', err);
    }
  };

  const exportPalette = () => {
    const css = `/* Color Palette */
:root {
  --color-1: ${palette[0].hex};
  --color-2: ${palette[1].hex};
  --color-3: ${palette[2].hex};
  --color-4: ${palette[3].hex};
  --color-5: ${palette[4].hex};
}`;

    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'color-palette.css';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="tool-page">
      <div className="tool-header">
        <Link to="/" className="back-button">
          <ArrowLeft size={24} />
          <span>Back to Tools</span>
        </Link>
        <h1 className="tool-title">Color Palette Generator</h1>
        <p className="tool-subtitle">Generate beautiful color combinations</p>
      </div>

      <div className="tool-content">
        <div className="palette-container">
          <div className="palette-controls">
            <select
              value={paletteType}
              onChange={(e) => setPaletteType(e.target.value)}
              className="tool-select"
            >
              <option value="random">Random</option>
              <option value="monochromatic">Monochromatic</option>
              <option value="complementary">Complementary</option>
              <option value="analogous">Analogous</option>
            </select>

            <button
              onClick={generateNewPalette}
              className="tool-button icon-button"
            >
              <RefreshCw size={20} />
              Generate New
            </button>

            <button
              onClick={exportPalette}
              className="tool-button icon-button secondary"
            >
              <Download size={20} />
              Export CSS
            </button>
          </div>

          <div className="color-grid">
            {palette.map((color, index) => (
              <div
                key={index}
                className="color-card"
                style={{ 
                  backgroundColor: color.hex,
                  color: hexToHSL(color.hex).l > 70 ? '#000000' : '#ffffff'
                }}
              >
                <div className="color-actions">
                  <button
                    onClick={() => toggleLock(index)}
                    className="color-action-button"
                    title={color.locked ? 'Unlock color' : 'Lock color'}
                  >
                    {color.locked ? <Lock size={16} /> : <Unlock size={16} />}
                  </button>
                  <button
                    onClick={() => copyColor(color.hex)}
                    className="color-action-button"
                    title="Copy hex code"
                  >
                    <Copy size={16} />
                  </button>
                </div>
                <span className="color-hex">
                  {copied === color.hex ? 'Copied!' : color.hex}
                </span>
              </div>
            ))}
          </div>

          <div className="palette-info">
            <h3>Palette Type: {paletteType.charAt(0).toUpperCase() + paletteType.slice(1)}</h3>
            <p>Click on a color to copy its hex code. Lock colors to keep them in the next generation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPaletteGenerator;