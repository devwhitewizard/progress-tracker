import express from 'express';
import UserData from '../models/UserData.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    let userData = await UserData.findOne({ where: { userId: req.user.id } });
    
    if (!userData) {
      userData = await UserData.create({ userId: req.user.id });
    }

    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/', async (req, res) => {
  const { goals, habits, history, isDarkMode } = req.body;

  try {
    let userData = await UserData.findOne({ where: { userId: req.user.id } });

    if (!userData) {
       userData = await UserData.create({ userId: req.user.id });
    }

    if (goals !== undefined) userData.goals = goals;
    if (habits !== undefined) userData.habits = habits;
    if (history !== undefined) userData.history = history;
    if (isDarkMode !== undefined) userData.isDarkMode = isDarkMode;

    const updatedData = await userData.save();
    res.json(updatedData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
