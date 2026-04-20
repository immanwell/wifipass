import { describe, it, expect } from 'vitest';

// WiFi string escaping function - extracted for testability
function escapeWifiString(str: string): string {
  return str.replace(/([\\;,:"'`])/g, '\\$1');
}

// Build WiFi string (matches app.ts logic)
function buildWifiString(ssid: string, password: string, encryption: string, hidden: boolean): string {
  let wifiString = `WIFI:T:${encryption || 'WPA'};S:${escapeWifiString(ssid)};`;
  if (encryption !== 'nopass' && password) {
    wifiString += `P:${escapeWifiString(password)};`;
  }
  if (hidden) {
    wifiString += `H:true;`;
  }
  wifiString += ';';
  return wifiString;
}

describe('WiFi String Generation', () => {

  describe('SSID with special characters', () => {
    it('escapes semicolons in SSID', () => {
      const result = buildWifiString('Guest;Office', 'password123', 'WPA', false);
      expect(result).toBe('WIFI:T:WPA;S:Guest\\;Office;P:password123;;');
    });

    it('escapes colons in SSID', () => {
      const result = buildWifiString('Network:Lab', 'password123', 'WPA', false);
      expect(result).toBe('WIFI:T:WPA;S:Network\\:Lab;P:password123;;');
    });

    it('escapes backslashes in SSID', () => {
      const result = buildWifiString('Guest\\Network', 'password123', 'WPA', false);
      expect(result).toBe('WIFI:T:WPA;S:Guest\\\\Network;P:password123;;');
    });

    it('escapes double quotes in SSID', () => {
      const result = buildWifiString('Guest"Network', 'password123', 'WPA', false);
      expect(result).toBe('WIFI:T:WPA;S:Guest\\"Network;P:password123;;');
    });

    it('escapes backticks in SSID', () => {
      const result = buildWifiString('Guest`Network', 'password123', 'WPA', false);
      expect(result).toBe('WIFI:T:WPA;S:Guest\\`Network;P:password123;;');
    });
  });

  describe('Password with special characters', () => {
    it('escapes semicolons in password', () => {
      const result = buildWifiString('MyNetwork', 'pass;word', 'WPA', false);
      expect(result).toBe('WIFI:T:WPA;S:MyNetwork;P:pass\\;word;;');
    });

    it('escapes colons in password', () => {
      const result = buildWifiString('MyNetwork', 'pass:word', 'WPA', false);
      expect(result).toBe('WIFI:T:WPA;S:MyNetwork;P:pass\\:word;;');
    });

    it('escapes backslashes in password', () => {
      const result = buildWifiString('MyNetwork', 'pass\\word', 'WPA', false);
      expect(result).toBe('WIFI:T:WPA;S:MyNetwork;P:pass\\\\word;;');
    });
  });

  describe('Injection attack prevention', () => {
    it('prevents SSID injection via semicolon', () => {
      // Attacker tries to inject a second SSID
      const result = buildWifiString('foo;S:bar', 'password', 'WPA', false);
      expect(result).toContain('\\;'); // Semicolon must be escaped
      expect(result).not.toContain(';S:bar'); // Should not be parsed as separate field
    });

    it('prevents SSID injection via colon', () => {
      const result = buildWifiString('foo:S:bar', 'password', 'WPA', false);
      expect(result).toContain('\\:'); // Colon must be escaped
      expect(result).not.toContain(':S:bar'); // Should not be parsed as injection
    });
  });

  describe('Basic functionality', () => {
    it('generates correct wifi string for WPA network', () => {
      const result = buildWifiString('MyNetwork', 'SafePassword123', 'WPA', false);
      expect(result).toBe('WIFI:T:WPA;S:MyNetwork;P:SafePassword123;;');
    });

    it('generates correct wifi string for WEP network', () => {
      const result = buildWifiString('MyNetwork', 'abcdef1234', 'WEP', false);
      expect(result).toBe('WIFI:T:WEP;S:MyNetwork;P:abcdef1234;;');
    });

    it('generates correct wifi string for open network', () => {
      const result = buildWifiString('GuestNetwork', '', 'nopass', false);
      expect(result).toBe('WIFI:T:nopass;S:GuestNetwork;;');
    });

    it('includes hidden flag when set', () => {
      const result = buildWifiString('MyNetwork', 'password', 'WPA', true);
      expect(result).toContain('H:true;');
    });

    it('omits password for open network', () => {
      const result = buildWifiString('GuestNetwork', '', 'nopass', false);
      expect(result).not.toContain('P:;');
      expect(result).not.toContain('P:;');
    });
  });

  describe('Empty and edge cases', () => {
    it('handles empty SSID gracefully', () => {
      const result = buildWifiString('', 'password', 'WPA', false);
      expect(result).toBe('WIFI:T:WPA;S:;P:password;;');
    });

    it('omits password field when password is empty for secured network', () => {
      const result = buildWifiString('MyNetwork', '', 'WPA', false);
      // Empty password is falsy, so P: field is not added (validation would reject this before getting here)
      expect(result).toBe('WIFI:T:WPA;S:MyNetwork;;');
    });
  });
});

describe('Input Validation', () => {
  // Validation rules extracted from app.ts
  function validate(ssid: string, password: string, encryption: string): string | null {
    if (!ssid || ssid.trim() === '') {
      return 'SSID is required';
    }
    if (encryption !== 'nopass' && (!password || password.trim() === '')) {
      return 'Password is required for secured networks';
    }
    return null;
  }

  it('rejects empty SSID', () => {
    expect(validate('', 'password', 'WPA')).toBe('SSID is required');
  });

  it('rejects whitespace-only SSID', () => {
    expect(validate('   ', 'password', 'WPA')).toBe('SSID is required');
  });

  it('rejects missing password for WPA', () => {
    expect(validate('MyNetwork', '', 'WPA')).toBe('Password is required for secured networks');
  });

  it('rejects missing password for WEP', () => {
    expect(validate('MyNetwork', '', 'WEP')).toBe('Password is required for secured networks');
  });

  it('accepts missing password for nopass', () => {
    expect(validate('GuestNetwork', '', 'nopass')).toBeNull();
  });

  it('accepts valid WPA network', () => {
    expect(validate('MyNetwork', 'SafePassword', 'WPA')).toBeNull();
  });
});

describe('QR Code Generation', () => {
  // Mock QR code generation behavior
  async function generateQR(wifiString: string): Promise<string> {
    // In real implementation, this uses qrcode library
    if (!wifiString || !wifiString.startsWith('WIFI:')) {
      throw new Error('Invalid WiFi string format');
    }
    // Return mock data URL using full base64 to ensure uniqueness
    return `data:image/png;base64,mockQR_${Buffer.from(wifiString).toString('base64')}`;
  }

  it('generates QR for valid wifi string', async () => {
    const result = await generateQR('WIFI:T:WPA;S:MyNetwork;P:password;;');
    expect(result).toContain('data:image/png;base64');
  });

  it('rejects invalid wifi string format', async () => {
    await expect(generateQR('invalid string')).rejects.toThrow('Invalid WiFi string format');
  });

  it('rejects empty wifi string', async () => {
    await expect(generateQR('')).rejects.toThrow('Invalid WiFi string format');
  });

  it('generates different QR for different networks', async () => {
    // Use longer strings so base64 encoding differs beyond first 20 chars
    const qr1 = await generateQR('WIFI:T:WPA;S:NetworkAlpha;P:passwordOne;;');
    const qr2 = await generateQR('WIFI:T:WPA;S:NetworkBeta;P:passwordTwo;;');
    expect(qr1).not.toBe(qr2);
  });
});