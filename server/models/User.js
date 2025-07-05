import mongoose from 'mongoose';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin', 'teacher', 'super-admin'], default: 'student' },
  avatar: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  verificationExpires: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  lastLogin: { type: Date },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date }
}, { timestamps: true });

// Add methods for email verification
userSchema.methods.generateVerificationToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  this.verificationToken = token;
  this.verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return token;
};

userSchema.methods.verifyEmail = function(token) {
  if (this.verificationToken === token && this.verificationExpires > Date.now()) {
    this.isVerified = true;
    this.verificationToken = undefined;
    this.verificationExpires = undefined;
    return true;
  }
  return false;
};

// Add methods for password reset
userSchema.methods.generatePasswordResetToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = token;
  this.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  return token;
};

userSchema.methods.resetPassword = function(token, newPassword) {
  if (this.resetPasswordToken === token && this.resetPasswordExpires > Date.now()) {
    this.password = bcrypt.hashSync(newPassword, 10);
    this.resetPasswordToken = undefined;
    this.resetPasswordExpires = undefined;
    return true;
  }
  return false;
};

// Add methods for account lockout
userSchema.methods.incLoginAttempts = function() {
  this.loginAttempts += 1;
  if (this.loginAttempts >= 5) {
    this.lockUntil = Date.now() + 15 * 60 * 1000; // Lock for 15 minutes
  }
};

userSchema.methods.resetLoginAttempts = function() {
  this.loginAttempts = 0;
  this.lockUntil = undefined;
  this.lastLogin = new Date();
};

userSchema.methods.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

export default mongoose.model('User', userSchema); 