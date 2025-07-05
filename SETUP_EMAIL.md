# Email Configuration Setup

This guide will help you configure email functionality for the QR Attendance System.

## Prerequisites

1. A Gmail account (or other email service)
2. App password for your email service

## Gmail Setup

### 1. Enable 2-Factor Authentication
- Go to your Google Account settings
- Enable 2-Step Verification

### 2. Generate App Password
- Go to Google Account → Security → 2-Step Verification
- Click "App passwords"
- Generate a new app password for "Mail"
- Copy the 16-character password

### 3. Configure Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/qr-attendance
JWT_SECRET=your-secret-key-here
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
FRONTEND_URL=http://localhost:3000
```

### 4. Install Dependencies

```bash
cd server
npm install express-rate-limit nodemailer
```

## Features Enabled

With email configuration, the following features will be available:

### ✅ Email Verification
- Users must verify their email before logging in
- Verification links expire after 24 hours
- Users can request new verification emails

### ✅ Password Reset
- Users can request password reset via email
- Reset links expire after 1 hour
- Secure token-based reset process

### ✅ Rate Limiting
- Prevents brute force attacks
- Limits login attempts per IP
- Account lockout after 5 failed attempts

### ✅ Account Security
- Password strength validation
- Account lockout protection
- Session management

## Testing Email Functionality

1. Start the server: `npm run dev`
2. Register a new user
3. Check your email for verification link
4. Click the verification link
5. Try logging in

## Troubleshooting

### Email Not Sending
- Verify your app password is correct
- Check that 2FA is enabled on your Gmail account
- Ensure EMAIL_USER and EMAIL_PASS are set correctly

### Rate Limiting Issues
- Wait 15 minutes for auth rate limits to reset
- Wait 1 hour for password reset limits to reset

### Verification Issues
- Check that FRONTEND_URL is set correctly
- Ensure the verification link is clicked within 24 hours

## Security Notes

- Never commit your `.env` file to version control
- Use strong JWT secrets in production
- Consider using environment-specific email services for production
- Monitor rate limiting logs for suspicious activity 