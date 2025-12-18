import express from 'express';
import QRCode from 'qrcode';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// API: Generate QR Code
app.post('/api/generate', async (req, res) => {
  try {
    const { ssid, encryption, hidden } = req.body;
    // Sanitize: If encryption is 'nopass', force password to be empty string
    const password = encryption === 'nopass' ? '' : req.body.password;

    if (!ssid) {
      return res.status(400).json({ error: 'SSID is required' });
    }

    if (encryption !== 'nopass' && !password) {
      return res.status(400).json({ error: 'Password is required for secured networks' });
    }

    // WiFi String Format: WIFI:T:WPA;S:MyNetwork;P:MyPassword;H:false;;
    // T: Type (WPA, WEP, nopass)
    // S: SSID
    // P: Password
    // H: Hidden (true/false)

    let wifiString = `WIFI:T:${encryption || 'WPA'};S:${ssid};`;
    if (encryption !== 'nopass' && password) {
      wifiString += `P:${password};`;
    }
    if (hidden) {
      wifiString += `H:true;`;
    }
    wifiString += ';';

    // Generate QR Data URL
    const qrCodeDataUrl = await QRCode.toDataURL(wifiString, {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 600,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    });

    res.json({ qrCodeDataUrl });

  } catch (error) {
    console.error('QR Gen Error:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// Fallback to index.html
app.get('/github', (req, res) => {
  res.redirect('/?utm_source=github&utm_medium=about&utm_campaign=repo-link');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
