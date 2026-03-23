import express from 'express';
import { generateDailyBriefing } from '../services/aiService.js';
// import { authenticateToken } from '../middleware/auth.js'; // Assuming you have auth middleware

const router = express.Router();

// @route   POST /api/ai/briefing
// @desc    Generate a daily briefing for the user
// @access  Private (Currently public for dev ease, but should be private)
router.post('/briefing', async (req, res) => {
  try {
    const { userData } = req.body;
    
    if (!userData) {
      return res.status(400).json({ message: "User data is required for analysis." });
    }

    const briefing = await generateDailyBriefing(userData);
    res.json(briefing);
  } catch (error) {
    console.error("Route Error:", error);
    res.status(500).json({ message: "AI service failed to generate briefing." });
  }
});

export default router;
