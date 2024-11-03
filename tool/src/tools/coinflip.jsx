import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCw } from 'lucide-react';
import './tools.css';

const CoinFlip = () => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState(null);
  const [totalFlips, setTotalFlips] = useState({ heads: 0, tails: 0 });

  const flipCoin = () => {
    if (isFlipping) return;
    
    setIsFlipping(true);
    setResult(null);
    
    // Random number of rotations between 5 and 8
    const rotations = 10;
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    
    // Add the flip result to statistics after animation
    setTimeout(() => {
      setResult(result);
      setTotalFlips(prev => ({
        ...prev,
        [result]: prev[result] + 1
      }));
      setIsFlipping(false);
    }, rotations * 100); // Animation duration
  };

  return (
    <div className="tool-page">
      <div className="tool-header">
        <Link to="/" className="back-button">
          <ArrowLeft size={24} />
          <span>Back to Tools</span>
        </Link>
        <h1 className="tool-title">Coin Flip</h1>
        <p className="tool-subtitle">Flip a virtual coin for quick decisions</p>
      </div>

      <div className="tool-content">
        <div className="coin-container">
          {/* Coin */}
          <div className={`coin ${isFlipping ? 'flipping' : ''} ${result ? `show-${result}` : ''}`}>
            <div className="coin-sides">
              <div className="heads">
                <div className="content">
                  <span>H</span>
                </div>
              </div>
              <div className="tails">
                <div className="content">
                  <span>T</span>
                </div>
              </div>
            </div>
          </div>

          {/* Result Text */}
          <div className="coin-result">
            {result && (
              <span className="result-text">
                {result.charAt(0).toUpperCase() + result.slice(1)}!
              </span>
            )}
          </div>

          {/* Flip Button */}
          <button
            onClick={flipCoin}
            disabled={isFlipping}
            className="tool-button icon-button flip-button"
          >
            <RotateCw size={20} />
            {isFlipping ? 'Flipping...' : 'Flip Coin'}
          </button>

          {/* Statistics */}
          <div className="coin-stats">
            <div className="stat-item">
              <span className="stat-label">Heads:</span>
              <span className="stat-value">{totalFlips.heads}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Tails:</span>
              <span className="stat-value">{totalFlips.tails}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total:</span>
              <span className="stat-value">{totalFlips.heads + totalFlips.tails}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinFlip;