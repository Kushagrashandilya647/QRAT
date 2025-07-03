import express from 'express';
import { createSession, getSessionQR } from '../controllers/session.js';
import { auth, isAdmin } from '../middleware/auth.js';
const router = express.Router();

router.post('/', auth, isAdmin, createSession);
router.get('/:id/qr', auth, isAdmin, getSessionQR);

export default router; 