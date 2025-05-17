import cron from 'node-cron';
import Auction from '../models/Auction.js';
import { io } from '../index.js'; // Optional: Real-time notify
import User from '../models/User.js';

export const startAuctionExpiryJob = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const expiredAuctions = await Auction.find({
        endTime: { $lte: now },
        isClosed: false,
      }).populate('bidHistory.user');

      for (const auction of expiredAuctions) {
        auction.isClosed = true;

        // Determine winner
        if (auction.bidHistory.length > 0) {
          const highestBid = auction.bidHistory.reduce((max, bid) =>
            bid.amount > max.amount ? bid : max
          );
          auction.winner = highestBid.user._id;

          // ✅ Emit winner notification via Socket.IO
          io.to(auction._id.toString()).emit('auctionClosed', {
            auctionId: auction._id,
            winner: highestBid.user.name,
            amount: highestBid.amount,
          });

          // Optional: send email using nodemailer
          // sendEmail(highestBid.user.email, "You won the auction!", ...)
        }

        await auction.save();
      }

      if (expiredAuctions.length > 0) {
        console.log(`✅ Closed ${expiredAuctions.length} expired auctions`);
      }
    } catch (error) {
      console.error('❌ Error closing auctions:', error.message);
    }
  });
};
