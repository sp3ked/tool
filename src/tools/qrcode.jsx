import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';  // Fixed import
import './tools.css';

const QRCodeGenerator = () => {
  const [url, setUrl] = useState('');
  const [size, setSize] = useState(256);
  const [color, setColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

  const handleDownload = () => {
    const canvas = document.getElementById('qr-code');
    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = 'qrcode.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="tool-page">
      <div className="tool-header">
        <Link to="/" className="back-button">
          <ArrowLeft size={24} />
          <span>Back to Tools</span>
        </Link>
        <h1 className="tool-title">QR Code Generator</h1>
        <p className="tool-subtitle">Create custom QR codes for any URL or text</p>
      </div>

      <div className="tool-content">
        <div className="tool-grid">
          {/* Input Section */}
          <div className="tool-section">
            <div className="input-group">
              <label htmlFor="url">URL or Text</label>
              <input
                type="text"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter URL or text to encode"
                className="tool-input"
              />
            </div>

            <div className="input-row">
              <div className="input-group">
                <label htmlFor="size">Size (px)</label>
                <input
                  type="number"
                  id="size"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  min="128"
                  max="512"
                  step="32"
                  className="tool-input"
                />
              </div>

              <div className="input-group">
                <label htmlFor="color">QR Color</label>
                <input
                  type="color"
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="tool-color-input"
                />
              </div>

              <div className="input-group">
                <label htmlFor="bgcolor">Background</label>
                <input
                  type="color"
                  id="bgcolor"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="tool-color-input"
                />
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="tool-section">
            <div className="qr-preview">
              <QRCodeCanvas
                id="qr-code"
                value={url || 'https://example.com'}
                size={size}
                fgColor={color}
                bgColor={backgroundColor}
                level="H"
                includeMargin={true}
              />
            </div>

            <button
              onClick={handleDownload}
              className="tool-button"
              disabled={!url}
            >
              Download QR Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;