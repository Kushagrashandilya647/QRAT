import Session from '../models/Session.js';
import QRCode from 'qrcode';
import crypto from 'crypto';

export const createSession = async (req, res) => {
  const { title, class: className, validFrom, validTo } = req.body;
  try {
    const session = await Session.create({
      title,
      class: className,
      validFrom,
      validTo,
      createdBy: req.user.id
    });
    // Encrypt session info for QR
    const qrPayload = JSON.stringify({ sessionId: session._id, validTo });
    const cipher = crypto.createCipher('aes-256-ctr', process.env.QR_SECRET);
    let encrypted = cipher.update(qrPayload, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    session.qrData = encrypted;
    await session.save();
    res.json(session);
  } catch (err) {
    res.status(400).json({ message: 'Error', error: err });
  }
};

export const getSessionQR = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Not found' });
    const qrImage = await QRCode.toDataURL(session.qrData);
    res.json({ qrImage });
  } catch (err) {
    res.status(400).json({ message: 'Error', error: err });
  }
}; 