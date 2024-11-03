import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, List, Search } from 'lucide-react';
import './home.css';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isGridView, setIsGridView] = useState(true);
  const [hoveredTool, setHoveredTool] = useState(null);

  const tools = [
    { name: 'QR Code Generator', path: '/qrcode', icon: '🔲' },
    { name: 'Password Generator', path: '/passwordgen', icon: '🔐' },
    { name: 'Unit Converter', path: '/unitconverter', icon: '📊' },
    { name: 'Word Counter', path: '/wordcounter', icon: '📝' },
    { name: 'Lorem Ipsum Generator', path: '/loremipsum', icon: '📃' },
    { name: 'JSON Formatter', path: '/jsonformatter', icon: '{ }' },
    { name: 'Font Pairing Generator', path: '/fontpairing', icon: '🔤' },
  ];

  const FloatingCard = ({ tool, index }) => {
    const [position, setPosition] = useState({
      top: Math.random() * 60 + 20 + '%',
      left: Math.random() * 60 + 20 + '%',
    });
    const [velocity] = useState({
      x: (Math.random() * 2 - 1) * 0.05,
      y: (Math.random() * 2 - 1) * 0.05,
    });

    useEffect(() => {
      const moveCard = () => {
        setPosition((prev) => {
          let newTop = parseFloat(prev.top) + velocity.y;
          let newLeft = parseFloat(prev.left) + velocity.x;

          if (newTop <= 20 || newTop >= 80) {
            velocity.y = -velocity.y;
            newTop = Math.max(20, Math.min(80, newTop));
          }
          if (newLeft <= 20 || newLeft >= 80) {
            velocity.x = -velocity.x;
            newLeft = Math.max(20, Math.min(80, newLeft));
          }

          return { top: newTop + '%', left: newLeft + '%' };
        });
      };

      const intervalId = setInterval(moveCard, 50);
      return () => clearInterval(intervalId);
    }, [velocity]);

    return (
      <Link
        to={tool.path}
        className={`floating-card floating-animation ${hoveredTool === index ? 'hovered' : ''}`}
        style={{ 
          top: position.top, 
          left: position.left,
        }}
        onMouseEnter={() => setHoveredTool(index)}
        onMouseLeave={() => setHoveredTool(null)}
      >
        <div className="floating-card-content">
          <span className="card-icon">{tool.icon}</span>
          <span className="card-title">{tool.name}</span>
        </div>
      </Link>
    );
  };

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home-page">
      {/* Header */}
      <div className="header">
        <h1 className="header-title">Developer Tools</h1>
        <p className="header-subtitle">A collection of handy tools for developers</p>
      </div>

      {/* Search and View Toggle */}
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
        <button
          onClick={() => setIsGridView(!isGridView)}
          className="view-toggle"
        >
          {isGridView ? <List size={20} /> : <Grid size={20} />}
          {isGridView ? 'List View' : 'Grid View'}
        </button>
      </div>

      {/* Tools Display */}
      {isGridView ? (
        <div className="floating-container">
          {filteredTools.map((tool, index) => (
            <FloatingCard key={index} tool={tool} index={index} />
          ))}
        </div>
      ) : (
        <div className="list-container">
          {filteredTools.map((tool, index) => (
            <Link
              key={index}
              to={tool.path}
              className="list-item"
            >
              <span className="card-icon">{tool.icon}</span>
              <span className="card-title">{tool.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;