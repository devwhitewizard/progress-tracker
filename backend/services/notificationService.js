import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Sends a reminder email to a user.
 * @param {string} email - Recipient email.
 * @param {string} subject - Email subject.
 * @param {string} text - Email body text.
 */
export const sendEmail = async (email, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: `"Progress Tracker Coach" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      text
    });
    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("Email Error:", error);
    throw error;
  }
};

/**
 * Sends a streak warning email.
 */
export const sendStreakWarning = async (userEmail, streakCount) => {
  const subject = "🔥 Don't let your streak break!";
  const text = `You're current on a ${streakCount}-day streak! You're only one checkmark away from keeping it alive. Head over to your dashboard and finish your daily habits before midnight!`;
  return sendEmail(userEmail, subject, text);
};

// Simple pseudo-scheduler for demonstration (check every hour)
// In production, use "node-cron"
export const initNotificationScheduler = () => {
  console.log("Notification scheduler initialized...");
  // Example: Check every hour for users who haven't completed habits
  // logic would go here to query the DB and find users at risk
};
