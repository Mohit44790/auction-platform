import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { placeBid } from '../redux/slice/bidSlice';
import { selectUserToken } from '../redux/slice/authSlice';
import { io } from 'socket.io-client';
import { USER_API_END_POINT } from '../redux/constants/userConstants';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const AuctionDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const token = useSelector(selectUserToken);

  const [auction, setAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  const [socket, setSocket] = useState(null);

  const { placing, error, lastBid } = useSelector((state) => state.bids);

  // Fetch auction details from API
  const fetchAuction = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/auctions/${id}`);
      console.log('Auction fetch response:', res.data);
      // Adjust this if your API wraps the auction in a field like res.data.auction
      setAuction(res.data);
    } catch (err) {
      console.error('Failed to fetch auction:', err);
      setAuction(null);
    }
  };

  // Countdown timer for auction end time
  useEffect(() => {
    if (!auction?.endTime) {
      setTimeLeft('');
      return;
    }

   const interval = setInterval(() => {
  const end = new Date(auction.endTime);
  const now = new Date();
  const diff = Math.max(end - now, 0);

  // Calculate hours, minutes and seconds
  const hours = Math.floor(diff / 3600000); // 1000 * 60 * 60
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  setTimeLeft(`${hours}h ${mins}m ${secs}s`);

  if (diff === 0) clearInterval(interval);
}, 1000);


    return () => clearInterval(interval);
  }, [auction?.endTime]);

  // Setup socket connection and listen for bid updates
  useEffect(() => {
    if (!id) return;

    const newSocket = io(API_URL);
    setSocket(newSocket);

    newSocket.emit('joinAuction', id);

    newSocket.on('bidUpdate', (data) => {
      if (data.auctionId === id) {
        setAuction((prev) => ({
          ...prev,
          currentBid: data.currentBid,
          bidHistory: [...(prev?.bidHistory || []), data.newBid],
        }));
      }
    });

    return () => {
      newSocket.emit('leaveAuction', id);
      newSocket.disconnect();
    };
  }, [id]);

  // Refetch auction when id or lastBid changes (after placing a bid)
  useEffect(() => {
    if (id) fetchAuction();
  }, [id, lastBid]);

  // Handle bid form submit
  const handlePlaceBid = (e) => {
    e.preventDefault();

    if (!token) {
      alert('You must be logged in to place a bid');
      return;
    }

    const current =
      typeof auction?.currentBid === 'number'
        ? auction.currentBid
        : auction?.startingBid ?? 0;

    if (!bidAmount || isNaN(bidAmount) || Number(bidAmount) <= current) {
      alert(`Bid must be higher than current bid (₹${current})`);
      return;
    }

    dispatch(placeBid({ auctionId: id, amount: Number(bidAmount) }));
    setBidAmount('');
  };

  if (auction === null) return <p>Loading auction details...</p>;

  if (!auction) return <p>Auction not found.</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto mt-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">{auction.title ?? 'No Title'}</h2>
      <p className="mb-2 text-gray-700">{auction.description ?? 'No Description'}</p>

      <p className="text-sm text-green-600 mt-1">
        Current Bid: ₹
        {typeof auction.currentBid === 'number' && auction.currentBid > 0
          ? auction.currentBid
          : auction.startingBid ?? 'N/A'}
      </p>

      <p className="mb-4 text-sm text-gray-500">
        Ends at:{' '}
        {auction.endTime
          ? new Date(auction.endTime).toLocaleString()
          : 'N/A'}
      </p>

      <p className="text-red-500 font-semibold">Time Left: {timeLeft || 'Ended'}</p>

      <form onSubmit={handlePlaceBid} className="space-y-3">
        <input
          type="number"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          className="w-full border px-4 py-2 rounded"
          placeholder="Enter your bid amount"
          min={auction.currentBid ? auction.currentBid + 1 : auction.startingBid + 1}
        />
        <button
          type="submit"
          disabled={placing}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {placing ? 'Placing...' : 'Place Bid'}
        </button>
      </form>

      {error && <p className="text-red-600 mt-2">{error}</p>}
      {lastBid && <p className="text-green-600 mt-2">Bid placed successfully!</p>}
    </div>
  );
};

export default AuctionDetail;
