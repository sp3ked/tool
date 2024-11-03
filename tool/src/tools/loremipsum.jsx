import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Copy, RefreshCw } from 'lucide-react';
import './tools.css';

const LoremIpsumGenerator = () => {
  const [copied, setCopied] = useState(false);
  const [type, setType] = useState('paragraphs');
  const [count, setCount] = useState(3);
  const [includeHTML, setIncludeHTML] = useState(false);
  const [generatedText, setGeneratedText] = useState('');

  // Word bank for more varied Lorem Ipsum
  const words = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
    'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
    'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
    'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
    'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit', 'voluptate',
    'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla', 'pariatur',
    'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa',
    'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
  ];

  const generateWord = () => {
    return words[Math.floor(Math.random() * words.length)];
  };

  const generateSentence = () => {
    const length = Math.floor(Math.random() * 10) + 8; // 8-18 words
    let sentence = generateWord().charAt(0).toUpperCase() + generateWord().slice(1);
    
    for (let i = 1; i < length; i++) {
      sentence += ' ' + generateWord();
    }
    
    return sentence + '.';
  };

  const generateParagraph = () => {
    const length = Math.floor(Math.random() * 3) + 3; // 3-6 sentences
    let paragraph = '';
    
    for (let i = 0; i < length; i++) {
      paragraph += generateSentence() + ' ';
    }
    
    return paragraph.trim();
  };

  const generateText = () => {
    let text = [];
    const numItems = Math.max(1, Math.min(count, 10)); // Limit between 1 and 10

    for (let i = 0; i < numItems; i++) {
      if (type === 'words') {
        const words = [];
        for (let j = 0; j < count; j++) {
          words.push(generateWord());
        }
        text.push(words.join(' '));
      } else if (type === 'sentences') {
        text.push(generateSentence());
      } else {
        text.push(generateParagraph());
      }
    }

    if (includeHTML) {
      if (type === 'paragraphs') {
        text = text.map(p => `<p>${p}</p>`);
      }
      setGeneratedText(text.join('\n\n'));
    } else {
      setGeneratedText(text.join('\n\n'));
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="tool-page">
      <div className="tool-header">
        <Link to="/" className="back-button">
          <ArrowLeft size={24} />
          <span>Back to Tools</span>
        </Link>
        <h1 className="tool-title">Lorem Ipsum Generator</h1>
        <p className="tool-subtitle">Generate placeholder text for your designs</p>
      </div>

      <div className="tool-content">
        <div className="lorem-container">
          {/* Controls */}
          <div className="lorem-controls">
            <div className="input-group">
              <label htmlFor="type">Type</label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="tool-select"
              >
                <option value="paragraphs">Paragraphs</option>
                <option value="sentences">Sentences</option>
                <option value="words">Words</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="count">Count</label>
              <input
                type="number"
                id="count"
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                min="1"
                max="10"
                className="tool-input"
              />
            </div>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={includeHTML}
                  onChange={(e) => setIncludeHTML(e.target.checked)}
                />
                Include HTML tags
              </label>
            </div>

            <button 
              onClick={generateText}
              className="tool-button icon-button"
            >
              <RefreshCw size={20} />
              Generate
            </button>
          </div>

          {/* Output */}
          <div className="lorem-output">
            <textarea
              value={generatedText}
              readOnly
              className="lorem-textarea"
              placeholder="Generated text will appear here..."
            />
            <button 
              onClick={copyToClipboard}
              className="tool-button icon-button"
              disabled={!generatedText}
            >
              <Copy size={20} />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoremIpsumGenerator;