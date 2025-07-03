import express from 'express';
import { markAttendance, getSessionAttendance, getStudentAttendance } from '../controllers/attendance.js';
import { auth } from '../middleware/auth.js';
const router = express.Router();

router.post('/mark', auth, markAttendance);
router.get('/session/:id', auth, getSessionAttendance);
router.get('/student/:id', auth, getStudentAttendance);

export default router; 