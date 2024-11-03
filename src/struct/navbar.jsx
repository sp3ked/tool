// struct/navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">My Tools</div>
      <div>
        <Link to="/">Home</Link>
        <Link to="/coinflip">Coin Flip</Link>
        <Link to="/bill-splitter">Bill Splitter</Link>
        {/* Add more links as you create more tools */}
      </div>
    </nav>
  );
}

export default Navbar;
