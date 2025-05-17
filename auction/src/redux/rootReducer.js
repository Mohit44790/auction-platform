import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import auctionReducer from "./slice/auctionSlice";
import bidReducer from "./slice/bidSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  auctions: auctionReducer,
  bids: bidReducer,
});

export default rootReducer;
