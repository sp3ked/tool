// In your App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './tools/home';
import CoinFlip from './tools/coinflip';
import BillSplitter from './tools/billsplit';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coinflip" element={<CoinFlip />} />
        <Route path="/bill-splitter" element={<BillSplitter />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;