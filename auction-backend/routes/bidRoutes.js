import express from 'express';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { placeBid } from '../controllers/bidController.js';

const router = express.Router();

// POST /api/bids/:id (id = auctionId)
router.post('/:id', isAuthenticated, placeBid);

export default router;
