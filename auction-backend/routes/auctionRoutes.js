import express from "express";
import {
  createAuction,
  getAuctions,
  getAuctionById,
  updateAuction,
  deleteAuction
} from "../controllers/auctionController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", isAuthenticated, createAuction);
router.get("/", getAuctions);
router.get("/:id", getAuctionById);
router.put("/:id", isAuthenticated, updateAuction);
router.delete("/:id", isAuthenticated, deleteAuction);

export default router;
