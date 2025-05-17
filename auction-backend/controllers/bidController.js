import Auction from '../models/Auction.js';

import { io } from '../index.js'; // Import io
// Other imports...

export const placeBid = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    const userId = req.user._id;

    const auction = await Auction.findById(id);
    if (!auction) return res.status(404).json({ message: 'Auction not found' });
    if (auction.isClosed || auction.endTime < new Date()) {
      return res.status(400).json({ message: 'Auction is closed' });
    }

    const minBid = Math.max(auction.startingBid, auction.currentBid + 1);
    if (amount < minBid) {
      return res.status(400).json({ message: `Bid must be at least ${minBid}` });
    }

    auction.bidHistory.push({ user: userId, amount });
    auction.currentBid = amount;

    await auction.save();

    // 🔴 Emit to all clients in this auction room
    io.to(id).emit('bidUpdate', {
      auctionId: id,
      currentBid: auction.currentBid,
      newBid: { user: userId, amount },
    });

    res.status(200).json({ message: 'Bid placed successfully', currentBid: amount });
  } catch (error) {
    res.status(500).json({ message: 'Bid failed', error: error.message });
  }
};
