import React, { useState } from 'react';

function CoinFlip() {
  const [result, setResult] = useState(null);

  const flipCoin = () => {
    const outcomes = ['Heads', 'Tails'];
    const randomIndex = Math.floor(Math.random() * outcomes.length);
    setResult(outcomes[randomIndex]);
  };

  return (
    <div>
      <h1>Coin Flip</h1>
      <button onClick={flipCoin}>Flip Coin</button>
      {result && <p>Result: {result}</p>}
    </div>
  );
}

export default CoinFlip;
