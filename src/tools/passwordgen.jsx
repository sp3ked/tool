import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Copy, RefreshCw } from 'lucide-react';
import './tools.css';

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  });
  const [copied, setCopied] = useState(false);

  const characters = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };

  const generatePassword = () => {
    let charset = '';
    let newPassword = '';
    
    // Build character set based on selected options
    if (options.uppercase) charset += characters.uppercase;
    if (options.lowercase) charset += characters.lowercase;
    if (options.numbers) charset += characters.numbers;
    if (options.symbols) charset += characters.symbols;

    // Ensure at least one option is selected
    if (!charset) {
      setPassword('Please select at least one option');
      return;
    }

    // Generate password
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      newPassword += charset[randomIndex];
    }

    setPassword(newPassword);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Generate password on initial render and when options change
  useEffect(() => {
    generatePassword();
  }, [length, options]);

  const handleOptionChange = (option) => {
    setOptions(prev => {
      // Prevent unchecking if it's the last checked option
      const newOptions = {
        ...prev,
        [option]: !prev[option]
      };
      if (!Object.values(newOptions).includes(true)) {
        return prev;
      }
      return newOptions;
    });
  };

  return (
    <div className="tool-page">
      <div className="tool-header">
        <Link to="/" className="back-button">
          <ArrowLeft size={24} />
          <span>Back to Tools</span>
        </Link>
        <h1 className="tool-title">Password Generator</h1>
        <p className="tool-subtitle">Create strong, secure passwords instantly</p>
      </div>

      <div className="tool-content">
        <div className="password-output">
          <input
            type="text"
            value={password}
            readOnly
            className="password-display"
          />
          <div className="password-actions">
            <button 
              onClick={copyToClipboard} 
              className="tool-button icon-button"
              title="Copy to clipboard"
            >
              <Copy size={20} />
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button 
              onClick={generatePassword} 
              className="tool-button icon-button"
              title="Generate new password"
            >
              <RefreshCw size={20} />
              Regenerate
            </button>
          </div>
        </div>

        <div className="password-options">
          <div className="input-group">
            <label htmlFor="length">Password Length: {length}</label>
            <div className="range-container">
              <input
                type="range"
                id="length"
                min="8"
                max="32"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="range-input"
              />
              <div className="range-labels">
                <span>8</span>
                <span>32</span>
              </div>
            </div>
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={options.uppercase}
                onChange={() => handleOptionChange('uppercase')}
              />
              Uppercase Letters (A-Z)
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={options.lowercase}
                onChange={() => handleOptionChange('lowercase')}
              />
              Lowercase Letters (a-z)
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={options.numbers}
                onChange={() => handleOptionChange('numbers')}
              />
              Numbers (0-9)
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={options.symbols}
                onChange={() => handleOptionChange('symbols')}
              />
              Special Characters (!@#$%^&*)
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;