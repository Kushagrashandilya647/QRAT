import Attendance from '../models/Attendance.js';
import Session from '../models/Session.js';
import crypto from 'crypto';

export const markAttendance = async (req, res) => {
  const { qrData } = req.body;
  try {
    // Decrypt QR
    const decipher = crypto.createDecipher('aes-256-ctr', process.env.QR_SECRET);
    let decrypted = decipher.update(qrData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    const { sessionId, validTo } = JSON.parse(decrypted);

    // Check session validity
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (new Date() > new Date(session.validTo)) return res.status(400).json({ message: 'Session expired' });

    // Prevent duplicate
    const exists = await Attendance.findOne({ session: sessionId, student: req.user.id });
    if (exists) return res.status(400).json({ message: 'Already marked' });

    await Attendance.create({ session: sessionId, student: req.user.id });
    res.json({ message: 'Attendance marked' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid QR or error', error: err });
  }
};

export const getSessionAttendance = async (req, res) => {
  const { id } = req.params;
  const records = await Attendance.find({ session: id }).populate('student', 'name email');
  res.json(records);
};

export const getStudentAttendance = async (req, res) => {
  const { id } = req.params;
  const records = await Attendance.find({ student: id }).populate('session', 'title class date');
  res.json(records);
}; 