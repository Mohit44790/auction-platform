import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuctions, selectAllAuctions, selectAuctionsStatus, selectAuctionsError } from '../redux/slice/auctionSlice';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { selectCurrentUser, selectUserToken } from '../redux/slice/authSlice';
import { USER_API_END_POINT } from '../redux/constants/userConstants';

const Auctions = () => {
  const dispatch = useDispatch();
  const auctions = useSelector(selectAllAuctions);
  const status = useSelector(selectAuctionsStatus);
  const error = useSelector(selectAuctionsError);
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectUserToken);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAuctions());
    }
  }, [dispatch, status]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this auction?')) return;

    try {
      await axios.delete(`${USER_API_END_POINT}/auctions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(fetchAuctions());
    } catch (err) {
      alert('Failed to delete auction: ' + (err.response?.data?.message || err.message));
    }
  };

  if (status === 'loading') return <p>Loading auctions...</p>;
  if (status === 'failed') return <p>Error loading auctions: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Active Auctions</h1>
        {auctions.length > 0 ? (
          <ul className="space-y-4">
            {auctions.map((auction) => (
              <li key={auction._id} className="border p-4 rounded hover:bg-gray-50 transition duration-200 flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <Link to={`/auction/${auction._id}`} className="text-blue-600 hover:underline font-medium text-lg">
                    {auction.title}
                  </Link>
                  <p className="text-sm text-gray-600 mt-1">{auction.description?.slice(0, 100)}...</p>
                  <p className="text-sm text-green-600 mt-1">
                    Current Bid:₹ {auction.currentBid ?? auction.startingBid}
                  </p>
                </div>

                {user && auction.createdBy && user._id === auction.createdBy._id && (
                  <div className="mt-4 md:mt-0 flex space-x-2">
                    <Link
                      to={`/auction/edit/${auction._id}`}
                      className="px-3 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(auction._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No active auctions found.</p>
        )}
      </div>
    </div>
  );
};

export default Auctions;
