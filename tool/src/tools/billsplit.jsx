import React, { useState } from 'react';
import './billsplit.css';

function BillSplitter() {
  const [total, setTotal] = useState('');
  const [people, setPeople] = useState('');
  const [tip, setTip] = useState('');
  const [tax, setTax] = useState('');
  const [perPerson, setPerPerson] = useState(null);

  const calculateSplit = () => {
    const totalAmount = parseFloat(total);
    const numPeople = parseInt(people, 10);
    const tipPercentage = parseFloat(tip) || 0;
    const taxPercentage = parseFloat(tax) || 0;

    if (totalAmount && numPeople) {
      // Calculate the tip and tax amounts
      const tipAmount = (totalAmount * tipPercentage) / 100;
      const taxAmount = (totalAmount * taxPercentage) / 100;
      const finalAmount = totalAmount + tipAmount + taxAmount;
      const amountPerPerson = finalAmount / numPeople;

      setPerPerson(amountPerPerson.toFixed(2));
    }
  };

  return (
    <div className="bill-splitter-container">
      <h1>Bill Splitter</h1>
      <div className="input-group">
        <label>Total Amount ($)</label>
        <input
          type="number"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
          placeholder="Enter total bill amount"
        />
      </div>
      
      <div className="input-group">
        <label>Number of People</label>
        <input
          type="number"
          value={people}
          onChange={(e) => setPeople(e.target.value)}
          placeholder="Enter number of people"
        />
      </div>
      
      <div className="input-group">
        <label>Tip Percentage (%)</label>
        <input
          type="number"
          value={tip}
          onChange={(e) => setTip(e.target.value)}
          placeholder="Optional tip percentage"
        />
      </div>
      
      <div className="input-group">
        <label>Tax Percentage (%)</label>
        <input
          type="number"
          value={tax}
          onChange={(e) => setTax(e.target.value)}
          placeholder="Optional tax percentage"
        />
      </div>

      <button onClick={calculateSplit}>Calculate</button>

      {perPerson && (
        <div className="result">
          <p>Each Person Pays: <strong>${perPerson}</strong></p>
        </div>
      )}
    </div>
  );
}

export default BillSplitter;
