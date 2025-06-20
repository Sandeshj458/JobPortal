// models/otp.model.js
// import mongoose from "mongoose";

// const otpSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   otp: { type: String, required: true },
//   type: { type: String, required: true, }, // ← remove `required: true`
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   requestCount: {
//     type: Number,
//     default: 1,
//   },
//   lastRequestAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// otpSchema.index({ createdAt }, { expireAfterSeconds: 60 }); // Ensure one OTP per type/email

// export const Otp = mongoose.model("Otp", otpSchema);




// models/Otp.js
// import mongoose from "mongoose";

// const otpSchema = new mongoose.Schema({
//   email: { type: String, required: true },
//   type: { type: String, required: true, enum: ["login", "reset-password"] },
//   otp: { type: String, required: true },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//     index: { expires: 60 } // OTP expires in 60 sec
//   },
//   lastRequestAt: { type: Date, default: Date.now },
//   requestCount: { type: Number, default: 1 },
// });

// // Ensure uniqueness for each email+type combination
// otpSchema.index({ email: 1, type: 1 }, { unique: true });

import mongoose from "mongoose";
const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
 
   // 🟨 Separate OTPs for login and forgot-password
  loginOtp: { type: String },
  loginCreatedAt: { type: Date },

  forgotOtp: { type: String },
  forgotCreatedAt: { type: Date },


  // 🟦 Request rate tracking
  loginRequestCount: { type: Number, default: 0 },
  loginLastRequestAt: { type: Date, default: Date.now },
  forgotRequestCount: { type: Number, default: 0 },
  forgotLastRequestAt: { type: Date, default: Date.now },
});

export const Otp = mongoose.model("Otp", otpSchema);

