// src/redux/slice/bidSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { USER_API_END_POINT } from '../constants/userConstants';

// Place Bid
export const placeBid = createAsyncThunk(
  'bids/place',
  async ({ auctionId, amount }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const res = await axios.post(`${USER_API_END_POINT}/bids/${auctionId}`, { amount }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to place bid');
    }
  }
);

const bidSlice = createSlice({
  name: 'bids',
  initialState: {
    placing: false,
    error: null,
    lastBid: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(placeBid.pending, (state) => {
        state.placing = true;
        state.error = null;
      })
      .addCase(placeBid.fulfilled, (state, action) => {
        state.placing = false;
        state.lastBid = action.payload;
      })
      .addCase(placeBid.rejected, (state, action) => {
        state.placing = false;
        state.error = action.payload;
      });
  },
});

export default bidSlice.reducer;
