import Attendance from '../models/Attendance.js';
import Session from '../models/Session.js';
import User from '../models/User.js';
import { Parser } from 'json2csv';

// Mark attendance (QR)
export const markAttendance = async (req, res) => {
  try {
    const { qrData } = req.body;
    const session = await Session.findOne({ qrData, status: 'active' });
    if (!session) return res.status(404).json({ message: 'Invalid or expired session' });
    // Prevent duplicate attendance
    const alreadyMarked = await Attendance.findOne({ session: session._id, user: req.user.id });
    if (alreadyMarked) return res.status(400).json({ message: 'Attendance already marked' });
    const attendance = await Attendance.create({ session: session._id, user: req.user.id });
    res.json({ message: 'Attendance marked', attendance });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Attendance history (user or admin)
export const attendanceHistory = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== 'admin') {
      filter.user = req.user.id;
    }
    const records = await Attendance.find(filter)
      .populate('session', 'title class validFrom validTo')
      .populate('user', 'name email');
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Export attendance as CSV (admin only)
export const exportAttendanceCSV = async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate('session', 'title class validFrom validTo')
      .populate('user', 'name email');
    const data = records.map(r => ({
      Name: r.user.name,
      Email: r.user.email,
      Session: r.session.title,
      Class: r.session.class,
      ValidFrom: r.session.validFrom,
      ValidTo: r.session.validTo,
      MarkedAt: r.markedAt
    }));
    const parser = new Parser();
    const csv = parser.parse(data);
    res.header('Content-Type', 'text/csv');
    res.attachment('attendance.csv');
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 