import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Auctions from './pages/Auctions';
import AuctionDetail from './pages/AuctionDetail';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuctionList from './components/AuctionList';
import CreateAuction from './components/CreateAuction';
import MyAuctions from './components/MyAuctions';
import Navbar from './pages/Navbar';

function App() {
  return (
    <Router>
       <ToastContainer position="top-right" autoClose={3000} />
         <Navbar />
             <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-auction" element={<CreateAuction />} />
        <Route path="/auctions" element={<Auctions />} />
         <Route path="/auctionlist" element={<AuctionList />} />
        <Route path="/auction/:id" element={<AuctionDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-auctions" element={<MyAuctions />} />
       
      </Routes>
    </Router>
  );
}

export default App;
