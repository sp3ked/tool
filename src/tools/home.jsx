import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import './home.css';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const toolCategories = {
    'Design & Colors': [
      { id: 1, name: 'Color Palette Generator', path: '/colorpalette', icon: '🎨' },
      { id: 2, name: 'RGB to HEX', path: '/hex', icon: '🔄' },
      { id: 3, name: 'Font Pairing Generator', path: '/fontpairing', icon: '🔤' },
    ],
    'Development': [
      { id: 4, name: 'JSON Formatter', path: '/jsonformatter', icon: '{ }' },
      { id: 5, name: 'QR Code Generator', path: '/qrcode', icon: '🔲' },
    ],
    'Text Tools': [
      { id: 6, name: 'Lorem Ipsum Generator', path: '/loremipsum', icon: '📃' },
      { id: 7, name: 'Word Counter', path: '/wordcounter', icon: '📝' },
    ],
    'Utilities': [
      { id: 8, name: 'Password Generator', path: '/passwordgen', icon: '🔐' },
      { id: 9, name: 'Unit Converter', path: '/unitconverter', icon: '📊' },
      { id: 10, name: 'Bill Splitter', path: '/bill-splitter', icon: '💵' },
    ],
    'Fun': [
      { id: 11, name: 'Coin Flip', path: '/coinflip', icon: '🪙' },
    ],
  };

  const filterTools = (tools) => {
    if (!searchTerm) return tools;
    return tools.filter(tool =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <span className="tool-icon">{tool.icon}</span>
                    <span className="tool-name">{tool.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;