import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAuctions,
  selectAllAuctions,
  selectAuctionsStatus,
  selectAuctionsError,
  selectAuctionsTotal,
} from '../redux/slice/auctionSlice';

const AuctionList = () => {
  const dispatch = useDispatch();
  const auctions = useSelector(selectAllAuctions);
  const status = useSelector(selectAuctionsStatus);
  const error = useSelector(selectAuctionsError);
  const total = useSelector(selectAuctionsTotal);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('endTime');
  const [order, setOrder] = useState('asc');
  const limit = 10;

  useEffect(() => {
    dispatch(fetchAuctions({ page, limit, search, sortBy, order }));
  }, [page, search, sortBy, order, dispatch]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Live Auctions</h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search auctions..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="endTime">End Time</option>
          <option value="currentBid">Current Bid</option>
          <option value="title">Title</option>
        </select>
        <select
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {/* Content */}
      {status === 'loading' && (
        <p className="text-blue-500 text-center">Loading auctions...</p>
      )}
      {status === 'failed' && (
        <p className="text-red-500 text-center">Error: {error}</p>
      )}
      {status === 'succeeded' && auctions.length === 0 && (
        <p className="text-gray-500 text-center">No auctions found.</p>
      )}

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {auctions.map((auction) => (
          <li
            key={auction._id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{auction.title}</h3>
            <p className="text-gray-600 mb-1">Current Bid: ${auction.currentBid}</p>
            <p className="text-gray-500 text-sm">
              Ends at: {new Date(auction.endTime).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              disabled={page === i + 1}
              className={`px-4 py-2 border rounded ${
                page === i + 1
                  ? 'bg-blue-600 text-white cursor-default'
                  : 'bg-white text-blue-600 hover:bg-blue-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuctionList;
