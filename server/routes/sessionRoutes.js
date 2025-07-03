import express from 'express';
import {
  createSession,
  editSession,
  deleteSession,
  listSessions,
  listUserSessions,
  getSessionById
} from '../controllers/sessionController.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Create session (admin)
router.post('/', auth, adminOnly, createSession);
// Edit session (admin)
router.put('/:id', auth, adminOnly, editSession);
// Delete session (admin)
router.delete('/:id', auth, adminOnly, deleteSession);
// List all sessions (admin)
router.get('/', auth, adminOnly, listSessions);
// List sessions for a user (student)
router.get('/my', auth, listUserSessions);
// Get session by ID
router.get('/:id', auth, getSessionById);

export default router; 