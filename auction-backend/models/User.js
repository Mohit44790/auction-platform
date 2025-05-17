import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
  },

  phone: {
    type: String,
  },

  profileImage: {
    type: String, // Cloudinary URL
    default: "https://res.cloudinary.com/default-user-image.png"
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },

  isBlocked: {
    type: Boolean,
    default: false,
  },

  


  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", userSchema); 