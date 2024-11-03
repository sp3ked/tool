import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, DollarSign, Users, Percent, RefreshCw } from 'lucide-react';
import './tools.css';

const BillSplitter = () => {
  const [billAmount, setBillAmount] = useState('');
  const [tipPercent, setTipPercent] = useState(15);
  const [numPeople, setNumPeople] = useState(2);
  const [customTip, setCustomTip] = useState(false);
  const [split, setSplit] = useState({
    tipAmount: 0,
    totalWithTip: 0,
    perPerson: 0,
    tipPerPerson: 0
  });

  const tipOptions = [10, 15, 18, 20, 25];

  useEffect(() => {
    calculateSplit();
  }, [billAmount, tipPercent, numPeople]);

  const calculateSplit = () => {
    const bill = parseFloat(billAmount) || 0;
    const tip = (bill * (tipPercent / 100));
    const total = bill + tip;
    
    setSplit({
      tipAmount: tip,
      totalWithTip: total,
      perPerson: total / numPeople,
      tipPerPerson: tip / numPeople
    });
  };

  const resetCalculator = () => {
    setBillAmount('');
    setTipPercent(15);
    setNumPeople(2);
    setCustomTip(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="tool-page">
      <div className="tool-header">
        <Link to="/" className="back-button">
          <ArrowLeft size={24} />
          <span>Back to Tools</span>
        </Link>
        <h1 className="tool-title">Bill Splitter</h1>
        <p className="tool-subtitle">Split bills and calculate tips easily</p>
      </div>

      <div className="tool-content">
        <div className="bill-splitter-container">
          {/* Input Section */}
          <div className="bill-input-section">
            <div className="input-group">
              <label htmlFor="billAmount">Bill Amount</label>
              <div className="currency-input">
                <DollarSign size={20} className="currency-icon" />
                <input
                  type="number"
                  id="billAmount"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="tool-input"
                />
              </div>
            </div>

            {/* Tip Selection */}
            <div className="tip-section">
              <label>Select Tip %</label>
              <div className="tip-grid">
                {tipOptions.map((tip) => (
                  <button
                    key={tip}
                    className={`tip-button ${tipPercent === tip && !customTip ? 'active' : ''}`}
                    onClick={() => {
                      setTipPercent(tip);
                      setCustomTip(false);
                    }}
                  >
                    {tip}%
                  </button>
                ))}
                <div className="custom-tip-input">
                  <input
                    type="number"
                    value={customTip ? tipPercent : ''}
                    onChange={(e) => {
                      setTipPercent(parseFloat(e.target.value) || 0);
                      setCustomTip(true);
                    }}
                    placeholder="Custom"
                    min="0"
                    className="tool-input"
                    onClick={() => setCustomTip(true)}
                  />
                </div>
              </div>
            </div>

            {/* Number of People */}
            <div className="input-group">
              <label htmlFor="numPeople">Number of People</label>
              <div className="number-input">
                <Users size={20} className="input-icon" />
                <input
                  type="number"
                  id="numPeople"
                  value={numPeople}
                  onChange={(e) => setNumPeople(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="tool-input"
                />
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bill-results-section">
            <div className="results-grid">
              <div className="result-item">
                <div className="result-label">
                  <span>Tip Amount</span>
                  <span className="per-person">per person</span>
                </div>
                <div className="result-value">{formatCurrency(split.tipPerPerson)}</div>
              </div>

              <div className="result-item">
                <div className="result-label">
                  <span>Total</span>
                  <span className="per-person">per person</span>
                </div>
                <div className="result-value">{formatCurrency(split.perPerson)}</div>
              </div>
            </div>

            <div className="total-breakdown">
              <div className="breakdown-item">
                <span>Bill Subtotal:</span>
                <span>{formatCurrency(parseFloat(billAmount) || 0)}</span>
              </div>
              <div className="breakdown-item">
                <span>Total Tip ({tipPercent}%):</span>
                <span>{formatCurrency(split.tipAmount)}</span>
              </div>
              <div className="breakdown-item total">
                <span>Total Amount:</span>
                <span>{formatCurrency(split.totalWithTip)}</span>
              </div>
            </div>

            <button 
              onClick={resetCalculator}
              className="tool-button icon-button reset-button"
            >
              <RefreshCw size={20} />
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillSplitter;