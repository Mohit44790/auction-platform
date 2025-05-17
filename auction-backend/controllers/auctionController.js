import Auction from "../models/Auction.js";

// Create Auction
export const createAuction = async (req, res) => {
  try {
    const auction = await Auction.create({
      ...req.body,
      createdBy: req.user._id
    });
    res.status(201).json(auction);
  } catch (error) {
    res.status(500).json({ message: "Create failed", error: error.message });
  }
};

// Get Auctions with Pagination, Search & Sort
export const getAuctions = async (req, res) => {
  try {
    const { page = 1, limit = 15, search = '', sortBy = 'endTime', order = 'asc', createdByMe } = req.query;

    let query = {
      title: { $regex: search, $options: 'i' },
      isClosed: false,
    };

    // Filter by current user auctions if requested
    if (createdByMe === 'true' && req.user) {
      query.createdBy = req.user._id;
    }

    const total = await Auction.countDocuments(query);
    const auctions = await Auction.find(query)
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('createdBy', 'name');

    res.json({ total, auctions });
  } catch (error) {
    res.status(500).json({ message: "Fetch failed", error: error.message });
  }
};


// Get Single Auction
export const getAuctionById = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id).populate('bidHistory.user', 'name');
    if (!auction) return res.status(404).json({ message: "Not found" });
    res.json(auction);
  } catch (error) {
    res.status(500).json({ message: "Fetch failed", error: error.message });
  }
};

// Update Auction (Owner Only)
export const updateAuction = async (req, res) => {
  try {
    const auction = await Auction.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true }
    );
    if (!auction) return res.status(403).json({ message: "Unauthorized or not found" });
    res.json(auction);
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

// Delete Auction (Owner Only)
export const deleteAuction = async (req, res) => {
  try {
    const auction = await Auction.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });
    if (!auction) return res.status(403).json({ message: "Unauthorized or not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
};
