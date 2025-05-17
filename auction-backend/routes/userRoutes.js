 import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMyProfile,
  updateProfile,
  updateProfileImage,
  
  getAllUsers,
  blockUser,
  unblockUser,
  
  deleteUser,
  updateUserRole,
 
} from "../controllers/userController.js";
import { isAuthenticated, isAdmin } from "../middlewares/authMiddleware.js";
// import multer from "multer";
import upload from "../middlewares/multerMiddleware.js";

// const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// 🔐 Auth Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/profile", isAuthenticated, getMyProfile);
// router.get('/getall', isAuthenticated, isAdmin, getAllUsers);
router.put("/me/update", isAuthenticated, updateProfile);
router.put("/me/update-image", isAuthenticated, upload.single("profileImage"), updateProfileImage);






// // 👑 Admin: Manage Users
router.get("/admin/all-users", isAuthenticated, isAdmin, getAllUsers);
router.put("/admin/block/:userId", isAuthenticated, isAdmin, blockUser);
router.put("/admin/unblock/:userId", isAuthenticated, isAdmin, unblockUser);
// 👇 Add these new ones
router.delete('/admin/delete-user/:id', isAuthenticated, isAdmin, deleteUser);
router.put('/admin/update-role/:id', isAuthenticated, isAdmin, updateUserRole);

export default router; 