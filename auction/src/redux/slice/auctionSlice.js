import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { USER_API_END_POINT } from '../constants/userConstants';

// Fetch Auctions
export const fetchAuctions = createAsyncThunk(
  'auctions/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/auctions`, { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch auctions');
    }
  }
);

// Create Auction
export const createAuction = createAsyncThunk(
  'auctions/create',
  async (data, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.post(`${USER_API_END_POINT}/auctions`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create auction');
    }
  }
);

const auctionSlice = createSlice({
  name: 'auctions',
  initialState: {
    auctions: [],
    total: 0,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    setAuction: (state, action) => {
      const updatedAuction = action.payload;
      const index = state.auctions.findIndex(a => a._id === updatedAuction._id);
      if (index !== -1) {
        state.auctions[index] = updatedAuction;
      } else {
        state.auctions.unshift(updatedAuction);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuctions.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAuctions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.auctions = action.payload.auctions;
        state.total = action.payload.total;
      })
      .addCase(fetchAuctions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(createAuction.fulfilled, (state, action) => {
        state.auctions.unshift(action.payload);
      });
  },
});

// Export the new action
export const { setAuction } = auctionSlice.actions;

// Selectors
export const selectAllAuctions = (state) => state.auctions.auctions;
export const selectAuctionsStatus = (state) => state.auctions.status;
export const selectAuctionsError = (state) => state.auctions.error;
export const selectAuctionsTotal = (state) => state.auctions.total;

export default auctionSlice.reducer;
