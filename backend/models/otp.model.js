import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },

  // 🟨 Separate OTPs
  loginOtp: { type: String },
  loginCreatedAt: { type: Date },

  forgotOtp: { type: String },
  forgotCreatedAt: { type: Date },

  // ✅ FIXED: Use deleteOtp instead of accountDelOtp
  deleteOtp: { type: String },
  deleteCreatedAt: { type: Date },

  // 🟦 Request tracking
  loginRequestCount: { type: Number, default: 0 },
  loginLastRequestAt: { type: Date, default: Date.now },

  forgotRequestCount: { type: Number, default: 0 },
  forgotLastRequestAt: { type: Date, default: Date.now },

  // ✅ FIXED: Rename these for consistency
  deleteRequestCount: { type: Number, default: 0 },
  deleteLastRequestAt: { type: Date, default: Date.now },
});

export const Otp = mongoose.model("Otp", otpSchema);
