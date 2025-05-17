import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUserToken } from '../redux/slice/authSlice';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const MyAuctions = () => {
  const token = useSelector(selectUserToken);
  const navigate = useNavigate();

  const [auctions, setAuctions] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const limit = 15;

  const fetchMyAuctions = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_URL}/api/auctions?createdByMe=true&page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAuctions(res.data?.auctions || []);
      setTotal(res.data?.total || 0);
    } catch (err) {
      console.error(err);
      setError('Failed to load your auctions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyAuctions();
  }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this auction?')) return;
    try {
      await axios.delete(`${API_URL}/api/auctions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchMyAuctions();
    } catch (err) {
      alert('Delete failed');
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">My Auctions</h2>
        <Link
          to="/create-auction"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Create New Auction
        </Link>
      </div>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && auctions.length === 0 && (
        <p className="text-gray-600">No auctions found.</p>
      )}

      <ul className="space-y-4">
        {auctions.map((auction) => (
          <li
            key={auction._id}
            className="p-4 bg-white shadow rounded flex items-center justify-between"
          >
            <div>
              <Link
                to={`/auction/${auction._id}`}
                className="text-lg font-medium text-blue-700 hover:underline"
              >
                {auction.title}
              </Link>
              <p className="text-gray-600 text-sm">
                Ends: {new Date(auction.endTime).toLocaleString()}
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => navigate(`/auctions/edit/${auction._id}`)}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(auction._id)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center gap-2">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page <= 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MyAuctions;
