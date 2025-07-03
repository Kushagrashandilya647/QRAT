import express from 'express';
import { getProfile, updateProfile, listUsers, requestPasswordReset, resetPassword } from '../controllers/userController.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Profile routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

// List all users (admin only)
router.get('/users', auth, adminOnly, listUsers);

// Password reset
router.post('/auth/reset-password', requestPasswordReset);
router.post('/auth/update-password', resetPassword);

export default router; 