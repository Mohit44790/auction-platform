// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// // import http from 'http';
// // import { Server } from 'socket.io';

// import ConnectDB from './config/db.js';
// import userRoutes from './routes/userRoutes.js';
// import auctionRoutes from './routes/auctionRoutes.js';
// import bidsRoutes from './routes/bidRoutes.js';
// // import { startAuctionExpiryJob } from './jobs/closeExpiredAuctions.js';

// // Load env variables
// dotenv.config();

// // Connect to DB
// ConnectDB();

// // Initialize app
// const app = express();

// // Middleware
// app.use(cors({
//   origin: process.env.FRONTEND_URL,
//   credentials: true,
// }));
// app.use(express.json());
// app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));

// // Routes
// app.use('/api/user', userRoutes);
// app.use('/api/auctions', auctionRoutes);
// app.use('/api/bids', bidsRoutes);

// // Create HTTP server and attach socket.io
// // const server = http.createServer(app);
// // const io = new Server(server, {
// //   cors: {
// //     origin: '*', // Change in production to your frontend origin
// //     methods: ['GET', 'POST'],
// //   },
// // });

// // Export io for use in other modules
// // export { io };

// // // Socket.io events
// // io.on('connection', (socket) => {
// //   console.log('✅ A user connected:', socket.id);

// //   socket.on('joinAuction', (auctionId) => {
// //     socket.join(auctionId);
// //     console.log(`📦 User joined room: ${auctionId}`);
// //   });

// //   socket.on('disconnect', () => {
// //     console.log('❌ User disconnected');
// //   });
// // });

// // Start auction expiry job
// // startAuctionExpiryJob();

// // Start the server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// export default app;
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import ConnectDB from './config/db.js';
import auctionRoutes from './routes/auctionRoutes.js';
import bidsRoutes from './routes/bidRoutes.js';
import userRoutes from './routes/userRoutes.js';


const app = express();
dotenv.config();
ConnectDB();

// ✅ CORS Configuration
app.use(cors({
    origin: "https://auction-platform-opal.vercel.app", // Make sure this URL is set correctly in Vercel environment variables
    credentials: true, // Enable if you're using cookies or auth headers
}));

app.use(express.json()); // Only use once
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/user', userRoutes);
app.use('/api/auctions', auctionRoutes);
app.use('/api/bids', bidsRoutes);

// Start the server (for local)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
