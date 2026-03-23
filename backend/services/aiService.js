import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generates a Daily Briefing based on user's habit history and goals.
 * @param {Object} userData - Contains habits, goals, and recent history.
 * @returns {Promise<Object>} - The AI generated briefing.
 */
export const generateDailyBriefing = async (userData) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are a high-performance productivity coach. 
      Analyze the following user data from a progress tracker and provide a "Daily Briefing."
      
      User Data:
      - Active Habits: ${JSON.stringify(userData.habits.map(h => ({ name: h.name, category: h.category, completedCount: h.completedDates.length })))}
      - Recent Missions: ${JSON.stringify(userData.goals)}
      - Current Streak: ${userData.streak} days.
      
      Requirements for the response:
      1. A short, punchy "Success Summary" of yesterday's performance.
      2. One specific "Priority Mission" for today based on their goals/habits.
      3. A "Dynamic Motivation" sentence tailored to their ${userData.streak}-day streak.
      
      Format the response as a JSON object with keys: "summary", "priorityMission", "motivation".
      Return ONLY the JSON. No markdown formatting.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    // Attempt to parse JSON
    try {
      // Remove potential markdown code blocks if AI included them
      const jsonStr = text.replace(/```json|```/g, '').trim();
      return JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", text);
      return {
        summary: "Data analyzed successfully. You're maintaining steady momentum.",
        priorityMission: "Focus on your most critical goal today.",
        motivation: `Your ${userData.streak}-day streak is proof of your discipline. Keep pushing.`
      };
    }
  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
};
