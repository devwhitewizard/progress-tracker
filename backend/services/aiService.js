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

    let result;
    try {
      result = await model.generateContent(prompt);
    } catch (e1) {
      console.log("gemini-1.5-flash failed, catching and trying gemini-pro...");
      try {
        const fallbackModel = genAI.getGenerativeModel({ model: "gemini-pro" });
        result = await fallbackModel.generateContent(prompt);
      } catch (e2) {
        console.log("gemini-pro failed, catching and trying gemini-1.0-pro...");
        const finalModel = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
        result = await finalModel.generateContent(prompt);
      }
    }
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
    console.error("AI Service Error (Briefing Generator):", error);
    return {
      summary: "Data analyzed successfully. You're maintaining steady momentum.",
      priorityMission: "Focus on your most critical goal today.",
      motivation: "Your streak is proof of your discipline. Keep pushing."
    };
  }
};

/**
 * Generates a refined strategic goal and actionable subtasks based on user input.
 * @param {string} userInput - The raw goal description from the user.
 * @param {Object} goalsData - Existing goals context to avoid duplication.
 * @returns {Promise<Object>} - The AI generated goal title and subtasks.
 */
export const generateStrategicGoal = async (userInput, goalsData, options = {}) => {
  try {
    const { adjustmentType, currentPlan } = options;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt = "";
    if (adjustmentType && currentPlan) {
      prompt = `
        You are an AI Life Coach and Project Manager modifying an existing trackable plan.
        The user's original goal description was: "${userInput}"
        
        They requested a SMART adjustment: "${adjustmentType}".
        Options meaning:
        - "simplify": Make uncompleted days easier, reduce tasks per day, expand the timeline if needed.
        - "upgrade": Make uncompleted days harder, more advanced, or condense the timeline.
        - "catchup": The user skipped days. Re-distribute uncompleted tasks to get back on track reasonably.
        
        Here is their current plan JSON state (including completed/uncompleted days and tasks):
        ${JSON.stringify(currentPlan)}
        
        Generate an updated complete roadmap. Keep completed days EXACTLY as they are. Adjust the remaining uncompleted days/tasks to address the "${adjustmentType}" request.

        Format the response strictly as a JSON object:
        {
          "title": "Goal Title (Adjusted)",
          "duration": 30,
          "days": [
            {
              "day": 1,
              "title": "Day Topic",
              "completed": false,
              "tasks": [ { "name": "Task 1", "done": false } ]
            }
          ]
        }
        
        Return ONLY valid JSON. No markdown formatting.
      `;
    } else {
      prompt = `
        Act as a Senior Project Strategist and AI Daily Planner. 
        The user wants to achieve this goal: "${userInput}".
        
        Create a comprehensive, highly-actionable learning plan/roadmap for this goal, assuming a 30-day duration.
        Break it into specific, bite-sized daily tasks. Each day must be achievable.
        
        Format the response strictly as a JSON object following this exact structure: 
        {
          "title": "Refined Goal Title",
          "duration": 30,
          "days": [
            {
              "day": 1,
              "title": "Day Topic",
              "completed": false,
              "tasks": [
                { "name": "Actionable task 1", "done": false },
                { "name": "Actionable task 2", "done": false }
              ]
            }
          ]
        }
        
        Return ONLY the JSON. No markdown formatting.
      `;
    }

    let result;
    try {
      result = await model.generateContent(prompt);
    } catch (e1) {
      console.log("gemini-1.5-flash failed, catching and trying gemini-pro...");
      try {
        const fallbackModel = genAI.getGenerativeModel({ model: "gemini-pro" });
        result = await fallbackModel.generateContent(prompt);
      } catch (e2) {
        console.log("gemini-pro failed, catching and trying gemini-1.0-pro...");
        const finalModel = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });
        result = await finalModel.generateContent(prompt);
      }
    }
    const response = await result.response;
    const text = response.text().trim();
    
    // Attempt to parse JSON
    try {
      const jsonStr = text.replace(/```json|```/g, '').trim();
      return JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI goal response as JSON:", text);
      return {
        title: userInput,
        duration: 3,
        days: [
          {
            day: 1,
            title: "Initiation",
            completed: false,
            tasks: [
              { name: "Define Core Scope", done: false },
              { name: "Identify primary outcomes", done: false }
            ]
          },
          {
            day: 2,
            title: "Execution",
            completed: false,
            tasks: [
              { name: "Setup environment", done: false },
              { name: "Begin tasks", done: false }
            ]
          },
          {
            day: 3,
            title: "Review",
            completed: false,
            tasks: [
              { name: "Evaluate outcome", done: false },
              { name: "Adjust methodology", done: false }
            ]
          }
        ]
      };
    }
  } catch (error) {
    console.error("AI Service Error (Goal Generator):", error);
    // Safety Fallback: Render static 3-day data instead of blank UI if API fully fails
    return {
      title: userInput,
      duration: 3,
      days: [
        {
          day: 1,
          title: "Initiation",
          completed: false,
          tasks: [
            { name: "Define Core Scope", done: false },
            { name: "Identify primary outcomes", done: false }
          ]
        },
        {
          day: 2,
          title: "Execution",
          completed: false,
          tasks: [
            { name: "Setup environment", done: false },
            { name: "Begin tasks", done: false }
          ]
        },
        {
          day: 3,
          title: "Review",
          completed: false,
          tasks: [
            { name: "Evaluate outcome", done: false },
            { name: "Adjust methodology", done: false }
          ]
        }
      ]
    };
  }
};
