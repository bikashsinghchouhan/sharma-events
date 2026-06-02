import mongoose from 'mongoose';

const HeroSlideSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image URL.'],
  },
  caption: {
    type: String,
    trim: true,
  },
  order: {
    type: Number,
    default: 0,
  }
});

// Avoid OverwriteModelError in Next.js hot-reloading
export default mongoose.models.HeroSlide || mongoose.model('HeroSlide', HeroSlideSchema);
