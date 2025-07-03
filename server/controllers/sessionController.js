import Session from '../models/Session.js';

// Create a session (admin)
export const createSession = async (req, res) => {
  try {
    const { title, class: className, validFrom, validTo } = req.body;
    const session = await Session.create({
      title,
      class: className,
      validFrom,
      validTo,
      createdBy: req.user.id
    });
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Edit a session (admin)
export const editSession = async (req, res) => {
  try {
    const { title, class: className, validFrom, validTo, status } = req.body;
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { title, class: className, validFrom, validTo, status },
      { new: true }
    );
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a session (admin)
export const deleteSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndDelete(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json({ message: 'Session deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// List all sessions (admin)
export const listSessions = async (req, res) => {
  try {
    const sessions = await Session.find().sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// List sessions for a user (student)
export const listUserSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get session by ID
export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 