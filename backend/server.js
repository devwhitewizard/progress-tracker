import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import authRoutes from './routes/auth.js';
import dataRoutes from './routes/data.js';
import aiRoutes from './routes/ai.js';
import { initNotificationScheduler } from './services/notificationService.js';
import sequelize from './config/db.js';

import './models/User.js';
import './models/UserData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/ai', aiRoutes);

// Sync and connect to MySQL using sequelize
sequelize.sync({ alter: true })
  .then(async () => {
    console.log('MySQL Database synced successfully!');

    // Test Gmail SMTP on startup
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    transporter.verify((error) => {
      if (error) {
        console.log('\n⚠️  Gmail SMTP Error:', error.message);
        console.log('Emails will NOT send. Check EMAIL_USER and EMAIL_PASS in .env\n');
      } else {
        console.log(`✅ Gmail SMTP ready! Emails will be sent from: ${process.env.EMAIL_USER}`);
        initNotificationScheduler();
      }
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MySQL connection error:', err);
    // If database connection fails, let user know!
    if (err.name === 'SequelizeConnectionError') {
      console.log('\n=============================================');
      console.log('ERROR: Your physical MySQL running instance could not connect or database `progress_tracker` is missing!');
      console.log('To fix this, log into MySQL (e.g., mysql -u root) and run:');
      console.log('CREATE DATABASE progress_tracker;');
      console.log('=============================================\n');
    }
  });
