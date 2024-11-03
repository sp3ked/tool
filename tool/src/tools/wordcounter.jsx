import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Copy, FileText } from 'lucide-react';
import './tools.css';

const WordCounter = () => {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    analyzeText(text);
  }, [text]);

  const analyzeText = (text) => {
    // Basic counts
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    
    // Sentence count (handles multiple punctuation marks)
    const sentences = text === '' ? 0 : text
      .split(/[.!?]+/)
      .filter(sentence => sentence.trim() !== '').length;
    
    // Paragraph count
    const paragraphs = text === '' ? 0 : text
      .split(/\n\s*\n/)
      .filter(para => para.trim() !== '').length;
    
    // Reading time (assuming 200 words per minute)
    const readingTime = Math.ceil(words / 200);

    setStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTime
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const clearText = () => {
    setText('');
  };

  const StatBox = ({ label, value, unit }) => (
    <div className="stat-box">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {unit && <div className="stat-unit">{unit}</div>}
    </div>
  );

  return (
    <div className="tool-page">
      <div className="tool-header">
        <Link to="/" className="back-button">
          <ArrowLeft size={24} />
          <span>Back to Tools</span>
        </Link>
        <h1 className="tool-title">Word Counter</h1>
        <p className="tool-subtitle">Analyze your text with detailed statistics</p>
      </div>

      <div className="tool-content">
        <div className="wordcounter-grid">
          {/* Text Input Section */}
          <div className="wordcounter-input-section">
            <div className="textarea-container">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste your text here..."
                className="wordcounter-textarea"
              />
              <div className="textarea-actions">
                <button 
                  onClick={copyToClipboard} 
                  className="tool-button icon-button"
                >
                  <Copy size={20} />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button 
                  onClick={clearText} 
                  className="tool-button icon-button secondary"
                >
                  <FileText size={20} />
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="wordcounter-stats-section">
            <div className="stats-grid">
              <StatBox 
                label="Words" 
                value={stats.words}
              />
              <StatBox 
                label="Characters" 
                value={stats.characters}
              />
              <StatBox 
                label="Characters (no spaces)" 
                value={stats.charactersNoSpaces}
              />
              <StatBox 
                label="Sentences" 
                value={stats.sentences}
              />
              <StatBox 
                label="Paragraphs" 
                value={stats.paragraphs}
              />
              <StatBox 
                label="Reading Time" 
                value={stats.readingTime}
                unit="minutes"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordCounter;