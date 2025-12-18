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

## 4. Start the App (via PM2)
Since CloudPanel doesn't auto-start Node apps, we use **PM2** (Process Manager).
*If you already installed PM2 globally for another site, you don't need to install it again.*

Run these commands in the site directory (`htdocs/wifipass.pp.ua`):

```bash
# 1. Start the app named "wifipass"
pm2 start npm --name "wifipass" -- start

# 2. Save the list so it restarts on reboot
pm2 save
```

*Note: The command `npm start` inside `package.json` runs `tsx app.ts`, so PM2 will handle the TypeScript execution automatically.*

## 5. Reverse Proxy Setup (CloudPanel)
Now tell CloudPanel to point to your running app:
1.  Go to CloudPanel Dashboard -> **Sites** -> **wifipass.pp.ua** -> **Settings**.
2.  **App Port**: `3000`
3.  Click **Save**.


## 5. Future Updates & Restarts
To update your site later, run:

```bash
ssh wifipass@<YOUR_SERVER_IP>
cd htdocs/wifipass.pp.ua
git pull origin main
npm install
# Restart the app to apply changes (Required for backend changes)
pm2 restart wifipass
```

### Useful PM2 Commands
*   `pm2 list`: See all running apps and their status.
*   `pm2 logs wifipass`: See the live console output/errors.
*   `pm2 restart wifipass`: Restart the application.

