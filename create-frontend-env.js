// // scripts/create-frontend-env.js

// import fs from "fs";
// import path from "path";
// import { createRequire } from "module";

// const require = createRequire(import.meta.url);
// const dotenv = require("dotenv");

// // Load root .env
// const rootEnvPath = path.resolve(process.cwd(), ".env");
// const result = dotenv.config({ path: rootEnvPath });

// if (result.error) {
//   console.error("Error loading root .env:", result.error);
//   process.exit(1);
// }

// const { VITE_ADMIN_EMAIL_USER, VITE_CHATBASE_ID } = result.parsed;

// if (!VITE_ADMIN_EMAIL_USER || !VITE_CHATBASE_ID) {
//   console.error("Missing required environment variables in .env");
//   process.exit(1);
// }

// // Create .env content for frontend
// const content = `
// VITE_ADMIN_EMAIL_USER=${VITE_ADMIN_EMAIL_USER}
// VITE_CHATBASE_SECRET_KEY=${VITE_CHATBASE_ID}
// `.trim();

// // Target: frontend/.env
// const frontendEnvPath = path.resolve(process.cwd(), "frontend", ".env");
// fs.writeFileSync(frontendEnvPath, content + "\n");

// console.log("✅ Created frontend/.env with VITE_ADMIN_EMAIL_USER.");

// scripts/create-frontend-env.js

import fs from "fs";
import path from "path";

// Access directly from process.env (Render injects these)
const {
  VITE_ADMIN_EMAIL_USER,
  VITE_CHATBASE_ID
} = process.env;

if (!VITE_ADMIN_EMAIL_USER || !VITE_CHATBASE_ID) {
  console.error("❌ Missing required environment variables (VITE_ADMIN_EMAIL_USER or VITE_CHATBASE_ID).");
  process.exit(1);
}

// Generate frontend .env content
const content = `
VITE_ADMIN_EMAIL_USER=${VITE_ADMIN_EMAIL_USER}
VITE_CHATBASE_ID=${VITE_CHATBASE_ID}
`.trim();

// Write to frontend/.env
const frontendEnvPath = path.resolve("frontend", ".env");
fs.writeFileSync(frontendEnvPath, content + "\n");

console.log("✅ Created frontend/.env for Vite build.");

