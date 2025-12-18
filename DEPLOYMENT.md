# CloudPanel Deployment Guide

Follow these steps to host **WifiPass** on your CloudPanel server.

## 1. Create a New Site
1.  Log in to your **CloudPanel** dashboard.
2.  Click **+ Add Site** -> **Create Node.js Site**.
3.  Fill in the details:
    *   **Domain Name**: `wifipass.pp.ua` (or your chosen domain)
    *   **Node.js Version**: `v20` (or `v18` LTS)
    *   **App Port**: `3000` (matches the default in `app.ts`)

## 2. Configure Git Deployment
1.  Go to your new site's dashboard -> **Settings** (or **VCS** tab depending on version).
2.  Select **Git** as the source.
3.  **Repository URL**: `git@github.com:immanwell/wifipass.git`
4.  **Branch**: `main`
5.  **Copy the "Deployment Key" (SSH Key)** shown in CloudPanel.
6.  Go to your GitHub Repo -> **Settings** -> **Deploy Keys**.
7.  Click **Add deploy key**:
    *   Title: `CloudPanel`
    *   Key: Paste the key you copied.
    *   Allow write access: Unchecked (Read-only is fine).

## 3. Deployment Script
In CloudPanel, you can define a hook to run on deployment. Use this script:

```bash
# Install dependencies (use --omit=dev for production speed)
npm install

# (Optional) Build step if you migrate to a build process later
# npm run build

# Restart the application
npm start
```

*Note: CloudPanel often manages the process via PM2 automatically. Ensure the "Run Command" in settings is set to `npm start`.*

## 4. Environment Variables
If you need to change the port or other settings, go to the **Settings** tab.
But usually, CloudPanel sets the `PORT` automatically. Our app listens on `process.env.PORT || 3000`, so it will adapt.

## 5. SSL & Security
1.  Go to the **SSL/TLS** tab.
2.  Click **Actions** -> **New Let's Encrypt Certificate**.
3.  Click **Create and Install**.

## Troubleshooting
*   **502 Bad Gateway**: This usually means the app didn't start correctly on port 3000. Check the **Logs** tab -> **Node.js Log**.
*   **Update**: Can be done manually by clicking "Update" (Deploy) in the CloudPanel UI.
