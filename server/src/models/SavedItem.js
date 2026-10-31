import mongoose from 'mongoose';

const savedItemSchema = new mongoose.Schema({
  userId: { type: String, default: 'usr_default' },
  videoId: { type: String, required: true },
  title: { type: String, required: true },
  channelTitle: { type: String },
  thumbnail: { type: String },
  duration: { type: String },
  viewsFormatted: { type: String },
  qualityScore: { type: Number, default: 85 },
  classification: { type: String, default: 'Very Good' },
  playlistName: { type: String, default: 'Watch Later' },
  notes: { type: String, default: '' },
  completed: { type: Boolean, default: false },
  progressSeconds: { type: Number, default: 0 },
  totalSeconds: { type: Number, default: 0 },
  savedAt: { type: Date, default: Date.now },
  lastWatchedAt: { type: Date, default: Date.now }
});

export const SavedItemModel = mongoose.models.SavedItem || mongoose.model('SavedItem', savedItemSchema);

export const memorySavedItems = [
  {
    id: 'save_1',
    _id: 'save_1',
    userId: 'usr_default',
    videoId: 'vtPkZShrvXQ',
    title: 'Spring Boot Full Course for Beginners | Learn Spring Boot in 8 Hours',
    channelTitle: 'CodeWithHarry',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=640&auto=format&fit=crop&q=80',
    duration: '8:12:34',
    viewsFormatted: '3.2M views',
    qualityScore: 92,
    classification: 'Excellent',
    playlistName: 'Backend Mastery',
    notes: 'Focus on chapters 4 and 5 for JPA repositories',
    completed: false,
    progressSeconds: 3600,
    totalSeconds: 29554,
    savedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
    lastWatchedAt: new Date(Date.now() - 3600 * 1000)
  },
  {
    id: 'save_2',
    _id: 'save_2',
    userId: 'usr_default',
    videoId: '35EQXmHKZY9',
    title: 'Spring Boot Crash Course | Build Real Projects',
    channelTitle: 'Amigoscode',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=640&auto=format&fit=crop&q=80',
    duration: '3:24:10',
    viewsFormatted: '1.1M views',
    qualityScore: 85,
    classification: 'Very Good',
    playlistName: 'Backend Mastery',
    notes: 'Great project setup tips',
    completed: true,
    progressSeconds: 12250,
    totalSeconds: 12250,
    savedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000),
    lastWatchedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000)
  }
];

