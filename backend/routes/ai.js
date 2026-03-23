import express from 'express';
import { generateDailyBriefing, generateStrategicGoal } from '../services/aiService.js';
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

// @route   POST /api/ai/goal
// @desc    Generate a refined goal and subtasks based on user input
// @access  Private
router.post('/goal', async (req, res) => {
  try {
    const { userInput, goalsData } = req.body;
    
    if (!userInput) {
      return res.status(400).json({ message: "User input is required." });
    }

    const goalData = await generateStrategicGoal(userInput, goalsData, { adjustmentType: req.body.adjustmentType, currentPlan: req.body.currentPlan });
    res.json(goalData);
  } catch (error) {
    console.error("Route Error (Goal Generator):", error);
    res.status(500).json({ message: "AI service failed to generate goal." });
  }
});

export default router;
