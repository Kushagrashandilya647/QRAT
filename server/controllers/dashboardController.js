import User from '../models/User.js';
import Session from '../models/Session.js';
import Attendance from '../models/Attendance.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalSessions = await Session.countDocuments();
    const totalAttendance = await Attendance.countDocuments();
    const attendancePercent = totalSessions && totalStudents
      ? ((totalAttendance / (totalSessions * totalStudents)) * 100).toFixed(2)
      : 0;
    res.json({
      totalStudents,
      totalSessions,
      totalAttendance,
      attendancePercent
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 