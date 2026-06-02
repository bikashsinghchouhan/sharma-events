import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name.'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email address.'],
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  eventDate: {
    type: String,
  },
  message: {
    type: String,
    required: [true, 'Please write your message requirements.'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Avoid OverwriteModelError in Next.js hot-reloading
export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
