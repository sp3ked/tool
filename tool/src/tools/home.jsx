import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';

function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">Tools</h1>
      <div className="tool-links">
        <Link to="/bill-splitter" className="floating-button">Bill Split</Link>
        <Link to="/coinflip" className="floating-button">Coin Flip</Link>
        {/* Add more tools as needed */}
      </div>
    </div>
  );
}

export default Home;
