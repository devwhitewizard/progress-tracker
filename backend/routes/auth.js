import express from 'express';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dns from 'dns';
import { promisify } from 'util';
import User from '../models/User.js';
import UserData from '../models/UserData.js';
import { protect } from '../middleware/authMiddleware.js';

const resolveMx = promisify(dns.resolveMx);

// Validate that an email address has a real mail server (MX record)
const isEmailDomainReal = async (email) => {
  try {
    const domain = email.split('@')[1];
    if (!domain) return false;
    const records = await resolveMx(domain);
    return records && records.length > 0;
  } catch {
    return false; // No MX record found = domain is not a real mail server
  }
};

// Basic email format check
const isEmailFormatValid = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Check email format
    if (!isEmailFormatValid(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    // 2. Check the domain has real MX records (a real email server)
    const domainIsReal = await isEmailDomainReal(email);
    if (!domainIsReal) {
      return res.status(400).json({ message: 'This email domain does not exist. Please use a real email address (e.g. Gmail, Outlook, etc.).' });
    }

    // 3. Check if already registered
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await User.create({ name, email, password, verificationCode });
    
    await UserData.create({ userId: user.id });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Send email and await it — if it fails, roll back the user account
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Your Progress Tracker Verification Code',
        text: `Hello ${user.name},\n\nYour 6-digit verification code is: ${verificationCode}\n\nEnter this code in the app to complete your registration.\n\nBest,\nProgress Tracker Team`
      });
      console.log(`Verification email sent to ${email}`);
    } catch (emailError) {
      // Roll back the user creation so they can try again
      await user.destroy();
      return res.status(500).json({ message: 'Failed to send verification email. Please check server email config (EMAIL_USER / EMAIL_PASS in .env).' });
    }

    res.status(201).json({
      message: 'Account created! Check your email for the verification code.',
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error (Is MySQL running?)', error: error.message });
  }
});

router.post('/verify-email', async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (user && user.verificationCode === code) {
      user.isVerified = true;
      user.verificationCode = null;
      await user.save();

      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: 'Invalid verification code' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error (Is MySQL running?)', error: error.message });
  }
});

router.post('/resend-code', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'No account found with this email.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'This account is already verified. Please log in.' });
    }

    // Generate a fresh verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = verificationCode;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Your New Progress Tracker Verification Code',
        text: `Hello ${user.name},\n\nYour new 6-digit verification code is: ${verificationCode}\n\nEnter this code in the app to verify your account.\n\nBest,\nProgress Tracker Team`
      });
      console.log(`Resend verification email sent to ${email}`);
    } catch (emailError) {
      return res.status(500).json({ message: 'Failed to send verification email. Check EMAIL_USER and EMAIL_PASS in the backend .env file.' });
    }

    res.json({ message: 'A new verification code has been sent to your email.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (user && (await user.comparePassword(password))) {
      if (!user.isVerified) {
        return res.status(401).json({ message: 'Please verify your email before logging in.', requiresVerification: true });
      }

      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error (Is MySQL running?)', error: error.message });
  }
});

router.get('/verify', protect, async (req, res) => {
  if (req.user) {
    res.json({
      _id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

export default router;
