import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this post.'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description.'],
  },
  mediaUrl: {
    type: String,
    required: [true, 'Please provide a media URL.'],
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    default: 'image',
  },
  date: {
    type: String,
    default: () => new Date().toISOString().split('T')[0],
  }
});

// Avoid OverwriteModelError in Next.js hot-reloading
export default mongoose.models.Post || mongoose.model('Post', PostSchema);
