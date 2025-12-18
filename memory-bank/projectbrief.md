# 🎯 Project Goals and Definition

## 1. Project Goal (The "North Star")
To build **GuestPass**, a secure, production-ready, self-hosted web application (hosted at `wifipass.pp.ua`) that generates printable Wi-Fi QR codes. The system must prioritize security by ensuring sensitive credentials are never stored on disk.

## 2. Core Features (The "What")
* **Input Interface:** Secure form for SSID, Password, and Encryption type (WPA/WPA2, WEP, None).
* **Secure Generation:** In-memory generation of Wi-Fi QR codes (Server-side via `qrcode` lib or Client-side).
* **Print-Optimized View:** A dedicated CSS print layout that hides input fields and formats the QR code as a beautiful physical card.
* **Zero-Build Runtime:** Execution via `tsx` without a build step.

## 3. Success Metrics
* **Security Compliance:** 0% of generated QR codes or passwords saved to disk/server.
* **Deployment Compatibility:** Successful startup on CloudPanel via PM2 using `process.env.PORT`.
* **Usability:** QR codes must be scannable by standard iOS and Android camera apps.
