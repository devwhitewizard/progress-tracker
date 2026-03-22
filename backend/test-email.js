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

console.log('Testing SMTP connection for:', process.env.EMAIL_USER);

transporter.verify((error, success) => {
  if (error) {
    console.log('\n❌ SMTP ERROR:', error.message);
    console.log('\nFull error details:');
    console.log('  Code:', error.code);
    console.log('  Response:', error.response);
  } else {
    console.log('\n✅ SMTP is working! Sending test email...');

    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself as test
      subject: 'SMTP Test - Progress Tracker',
      text: 'If you received this, Gmail SMTP is working correctly!'
    }, (err, info) => {
      if (err) {
        console.log('\n❌ SEND ERROR:', err.message);
      } else {
        console.log('\n✅ Test email sent! Check your inbox.');
        console.log('Response:', info.response);
      }
    });
  }
});
