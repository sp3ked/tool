import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import './home.css';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const tools = [
    { id: 1, name: 'QR Code Generator', path: '/qrcode', icon: '🔲' },
    { id: 2, name: 'Password Generator', path: '/passwordgen', icon: '🔐' },
    { id: 3, name: 'Unit Converter', path: '/unitconverter', icon: '📊' },
    { id: 4, name: 'Word Counter', path: '/wordcounter', icon: '📝' },
    { id: 5, name: 'Lorem Ipsum Generator', path: '/loremipsum', icon: '📃' },
    { id: 6, name: 'JSON Formatter', path: '/jsonformatter', icon: '{ }' },
    { id: 7, name: 'Font Pairing Generator', path: '/fontpairing', icon: '🔤' },
    { id: 8, name: 'Coin Flip', path: '/coinflip', icon: '🪙' },
    { id: 9, name: 'Bill Splitter', path: '/bill-splitter', icon: '💵' },
  ];

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <div className="list-container">
        {filteredTools.map((tool) => (
          <Link
            key={tool.id}
            to={tool.path}
            className="list-item"
          >
            <span className="card-icon">{tool.icon}</span>
            <span className="card-title">{tool.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;