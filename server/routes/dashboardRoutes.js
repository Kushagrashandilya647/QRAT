import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Dashboard stats (admin only)
router.get('/stats', auth, adminOnly, getDashboardStats);

export default router; 