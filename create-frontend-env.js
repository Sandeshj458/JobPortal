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

