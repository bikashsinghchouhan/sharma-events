import mongoose from 'mongoose';

const GalleryItemSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
  },
  images: {
    type: [String],
    required: [true, 'Please provide at least one image URL.'],
    validate: [arr => arr.length > 0, 'Images list cannot be empty.']
  },
  category: {
    type: String,
    required: [true, 'Please specify a category.'],
    trim: true,
  }
});

// Avoid OverwriteModelError in Next.js hot-reloading
export default mongoose.models.GalleryItem || mongoose.model('GalleryItem', GalleryItemSchema);
