import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  class: { type: String, required: true },
  date: { type: Date, default: Date.now },
  qrData: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  validFrom: { type: Date },
  validTo: { type: Date },
  status: { type: String, enum: ['active', 'closed'], default: 'active' }
}, { timestamps: true });

export default mongoose.model('Session', sessionSchema); 