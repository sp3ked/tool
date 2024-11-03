import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './tools/home';
import QRCode from './tools/qrcode';
import PasswordGenerator from './tools/passwordgen';
import UnitConverter from './tools/unitconverter';
import WordCounter from './tools/wordcounter';
import LoremIpsum from './tools/loremipsum';
import JSONFormatter from './tools/jsonformatter';
import FontPairing from './tools/fontpairing';
import CoinFlip from './tools/coinflip';
import BillSplitter from './tools/billsplit';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/qrcode" element={<QRCode />} />
        <Route path="/passwordgen" element={<PasswordGenerator />} />
        <Route path="/unitconverter" element={<UnitConverter />} />
        <Route path="/wordcounter" element={<WordCounter />} />
        <Route path="/loremipsum" element={<LoremIpsum />} />
        <Route path="/jsonformatter" element={<JSONFormatter />} />
        <Route path="/fontpairing" element={<FontPairing />} />
        <Route path="/coinflip" element={<CoinFlip />} />
        <Route path="/bill-splitter" element={<BillSplitter />} />
      </Routes>
    </Router>
  );
}

export default App;