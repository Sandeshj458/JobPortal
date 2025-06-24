// utils/generateChatbaseToken.js
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();


export const generateChatbaseToken = (userId) => {
  const secret = process.env.CHATBASE_SECRET_KEY; // from Chatbase dashboard
  return crypto.createHmac('sha256', secret).update(userId).digest('hex');
};

