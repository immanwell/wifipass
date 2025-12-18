# CloudPanel Manual Deployment Guide

Since you prefer using the terminal, here are the exact steps to deploy **WifiPass** manually via SSH.

## 1. Prerequisites
*   Ensure you have created the **Node.js Site** in CloudPanel.
*   Note your **Site User** (e.g., `wifipass`) and **Password** from the creation screen.
*   Note your domain directory, creating usually at `/home/wifipass/htdocs/wifipass.pp.ua`.

## 2. Connect via SSH
Open your terminal on your local machine and run:
```bash
ssh wifipass@<YOUR_SERVER_IP>
```
*(Enter the password when prompted)*

## 3. Clean & Clone
Once logged in, run these commands one by one to replace the default CloudPanel files with your app:

```bash
# 1. Go to your site's folder
cd htdocs/wifipass.pp.ua

# 2. Remove default files (be careful!)
rm -rf *

# 3. Clone your repository (since it's public, HTTPS is easiest)
git clone https://github.com/immanwell/wifipass.git .

# 4. Install dependencies
npm install
```

## 4. Start the App
CloudPanel manages Node.js processes automatically based on the **Settings** tab.

1.  Go to your CloudPanel Dashboard -> **Sites** -> **wifipass.pp.ua**.
2.  Click the **Settings** tab.
3.  Ensure the following:
    *   **App Port**: `3000`
    *   **Run Command**: `npm start`
4.  Click **Save**.
5.  If the status isn't "Running", click **Restart** or **Update**.

## 5. Future Updates
To update your site later, just run:

```bash
ssh wifipass@<YOUR_SERVER_IP>
cd htdocs/wifipass.pp.ua
git pull origin main
npm install
# Then restart via CloudPanel UI or 'npm start' if not managed
```
