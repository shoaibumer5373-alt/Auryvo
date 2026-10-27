import QRCode from 'qrcode';

export async function createPairingQr(payload: string): Promise<string> {
  return QRCode.toDataURL(payload, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 320,
    color: {
      dark: '#2b2338',
      light: '#fffdfb',
    },
  });
}
