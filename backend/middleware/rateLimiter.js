// middlewares/rateLimiter.js
import rateLimit from 'express-rate-limit';

export const otpSendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 5, // limit each IP to 5 OTP requests per window
  message: {
    success: false,
    message: 'Too many OTP requests. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts for OTP verification
  message: {
    success: false,
    message: 'Too many OTP verification attempts. Try again later.',
  },
});
