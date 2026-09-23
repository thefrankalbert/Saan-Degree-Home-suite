import QRCode from 'qrcode';

export async function generateWifiQrCode(ssid: string, pass: string, security = 'WPA'): Promise<string> {
  // Standard Wi-Fi URI format recognized natively by iOS and Android Camera apps
  const cleanSsid = ssid.replace(/([\\;,:"])/g, '\\$1');
  const cleanPass = pass.replace(/([\\;,:"])/g, '\\$1');
  const wifiString = `WIFI:T:${security};S:${cleanSsid};P:${cleanPass};;`;

  try {
    const dataUrl = await QRCode.toDataURL(wifiString, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 480,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    });
    return dataUrl;
  } catch (err) {
    console.error('Failed to generate Wi-Fi QR code', err);
    return '';
  }
}

export async function generateUrlQrCode(url: string): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(url, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 480,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    });
    return dataUrl;
  } catch (err) {
    console.error('Failed to generate URL QR code', err);
    return '';
  }
}
