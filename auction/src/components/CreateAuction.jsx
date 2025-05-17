import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createAuction } from '../redux/slice/auctionSlice';
import { useNavigate } from 'react-router-dom';

const CreateAuction = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector((state) => state.auctions.loading);
  const error = useSelector((state) => state.auctions.error);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startingBid, setStartingBid] = useState('');
  const [currentBid, setCurrentBid] = useState('');
  const [endTime, setEndTime] = useState('');
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!title.trim() || !description.trim() || !startingBid || !currentBid || !endTime) {
      setFormError('Please fill in all fields.');
      return;
    }

    const starting = parseFloat(startingBid);
    const current = parseFloat(currentBid);

    if (isNaN(starting) || starting < 0) {
      setFormError('Starting bid must be a positive number or zero.');
      return;
    }

    if (isNaN(current) || current < starting) {
      setFormError('Current bid must be greater than or equal to the starting bid.');
      return;
    }

    const end = new Date(endTime);
    if (end <= new Date()) {
      setFormError('End time must be in the future.');
      return;
    }

    setFormError(null);

    const auctionData = {
      title: title.trim(),
      description: description.trim(),
      startingBid: starting,
      currentBid: current,
      endTime: end.toISOString(),
    };

    try {
      await dispatch(createAuction(auctionData)).unwrap();
      navigate('/auctions');
    } catch (err) {
      // Optional error handling
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-8 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Create New Auction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1 font-medium">Title</label>
          <input
            id="title"
            type="text"
            className="w-full border rounded px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={100}
          />
        </div>

        <div>
          <label htmlFor="description" className="block mb-1 font-medium">Description</label>
          <textarea
            id="description"
            className="w-full border rounded px-3 py-2"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            maxLength={500}
          />
        </div>

        <div>
          <label htmlFor="startingBid" className="block mb-1 font-medium">Starting Bid ($)</label>
          <input
            id="startingBid"
            type="number"
            min="0"
            step="0.01"
            className="w-full border rounded px-3 py-2"
            value={startingBid}
            onChange={(e) => setStartingBid(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="currentBid" className="block mb-1 font-medium">Current Bid ($)</label>
          <input
            id="currentBid"
            type="number"
            min="0"
            step="0.01"
            className="w-full border rounded px-3 py-2"
            value={currentBid}
            onChange={(e) => setCurrentBid(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="endTime" className="block mb-1 font-medium">End Time</label>
          <input
            id="endTime"
            type="datetime-local"
            className="w-full border rounded px-3 py-2"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>

        {formError && <p className="text-red-600 text-sm">{formError}</p>}
        {error && <p className="text-red-700 text-sm">Server Error: {error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Creating...' : 'Create Auction'}
        </button>
      </form>
    </div>
  );
};

export default CreateAuction;
