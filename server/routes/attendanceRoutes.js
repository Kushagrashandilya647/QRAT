import express from 'express';
import {
  markAttendance,
  attendanceHistory,
  exportAttendanceCSV
} from '../controllers/attendanceController.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Mark attendance (QR)
router.post('/mark', auth, markAttendance);
// Attendance history (user/admin)
router.get('/history', auth, attendanceHistory);
// Export attendance as CSV (admin only)
router.get('/export', auth, adminOnly, exportAttendanceCSV);

export default router; 