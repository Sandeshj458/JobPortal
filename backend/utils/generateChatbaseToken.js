// utils/generateChatbaseToken.js
import crypto from 'crypto';

export const generateChatbaseToken = (userId) => {
  const secret = 'x9vxlbihpscbmybr6xqnxrzer0exkio2'; // from Chatbase dashboard
  return crypto.createHmac('sha256', secret).update(userId).digest('hex');
};


// const crypto = require('crypto');

// const secret = '•••••••••'; // Your verification secret key
// const userId = current_user.id // A string UUID to identify your user

// const hash = crypto.createHmac('sha256', secret).update(userId).digest('hex');