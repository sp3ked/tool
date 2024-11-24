import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import './home.css';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const toolCategories = {
    'Design & Colors': [
      { id: 1, name: 'Color Palette Generator', path: '/palette', icon: '🎨', description: 'Create beautiful color combinations' },
      { id: 2, name: 'RGB to HEX', path: '/hex', icon: '🔄', description: 'Convert colors between formats' },
      { id: 3, name: 'Font Pairing Generator', path: '/fontpairing', icon: '🔤', description: 'Find perfect font combinations' },
    ],
    'Development': [
      { id: 4, name: 'JSON Formatter', path: '/jsonformatter', icon: '{ }', description: 'Format and validate JSON data' },
      { id: 5, name: 'QR Code Generator', path: '/qrcode', icon: '🔲', description: 'Create custom QR codes' },
    ],
    'Text Tools': [
      { id: 6, name: 'Lorem Ipsum Generator', path: '/loremipsum', icon: '📃', description: 'Generate placeholder text' },
      { id: 7, name: 'Word Counter', path: '/wordcounter', icon: '📝', description: 'Count words and characters' },
    ],
    'Utilities': [
      { id: 8, name: 'Password Generator', path: '/passwordgen', icon: '🔐', description: 'Create secure passwords' },
      { id: 9, name: 'Unit Converter', path: '/unitconverter', icon: '📊', description: 'Convert between units' },
      { id: 10, name: 'Bill Splitter', path: '/bill-splitter', icon: '💵', description: 'Split bills easily' },
    ],
    'Games': [
      { id: 11, name: 'Coin Flip', path: '/coinflip', icon: '🪙', description: 'Flip a virtual coin' },
      { id: 12, name: 'Snake', path: '/snake', icon: '🐍', description: 'Classic snake game' },
    ],
  };

  const filterTools = (tools) => {
    if (!searchTerm) return tools;
    return tools.filter(tool =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="home-page">
      <div className="header">
        <h1 className="header-title">Helpful Tools</h1>
        <p className="header-subtitle">Annoying things done easy</p>
      </div>

      <div className="controls-container">
        <div className="search-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search tools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="categories-container">
        {Object.entries(toolCategories).map(([category, tools]) => {
          const filteredTools = filterTools(tools);
          if (searchTerm && filteredTools.length === 0) return null;

          return (
            <div key={category} className="category-section">
              <h2 className="category-title">{category}</h2>
              <div className="category-grid">
                {filteredTools.map((tool) => (
                  <Link
                    key={tool.id}
                    to={tool.path}
                    className="tool-card"
                  >
                    <div className="tool-icon">{tool.icon}</div>
                    <div className="tool-info">
                      <span className="tool-name">{tool.name}</span>
                      <span className="tool-description">{tool.description}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <footer className="home-footer">
        <p>Made by sp3ked 🔥</p>
      </footer>
    </div>
  );
};

export default Home;