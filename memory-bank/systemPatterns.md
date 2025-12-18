# 🏗️ Architecture and Pattern Guide

## 1. Tech Stack
* **Runtime:** Node.js 20+ (ES Modules).
* **Language:** TypeScript.
* **Execution Engine:** `tsx` (Native execution, NO build step).
* **Backend Framework:** Express.js.
* **Frontend:** Single HTML file.
* **Styling:** Tailwind CSS via CDN (NO build pipeline).
* **Process Manager:** PM2 (CloudPanel).

## 2. Architecture Patterns
* **Stateless Architecture:** The server acts purely as a logic processor. It accepts inputs, returns a QR data URI, and forgets the data immediately.
* **Monolithic Script:** A single entry point (`app.ts`) handles both serving the static UI and the API logic for QR generation.

## 3. Code Conventions & Rules
* **Security Rule #1 (CRITICAL):** **NO STORAGE.** Do NOT save generated QR code images or logs containing passwords to the disk. All generation must be in-memory.
* **Port Configuration:** Server must listen on `process.env.PORT` || 3000 to function behind the CloudPanel Reverse Proxy.
* **No Docker:** Do not create a Dockerfile. Deployment is bare-metal via `git pull` and `npm install`.
* **Scripts:** `package.json` must contain `"start": "tsx app.ts"`.
