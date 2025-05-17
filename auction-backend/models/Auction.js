import mongoose from 'mongoose';

const auctionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String },
  startingBid: { type: Number, required: true },
  currentBid: { type: Number, default: 0 },
  image: { type: String },
  endTime: { type: Date, required: true },
  isClosed: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bidHistory: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: Number,
    time: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model("Auction", auctionSchema);
