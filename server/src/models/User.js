import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String, default: '' },
  preferredLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  learningGoals: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export const UserModel = mongoose.models.User || mongoose.model('User', userSchema);

// In-memory fallback collection
export const memoryUsers = [
  {
    _id: 'usr_default',
    id: 'usr_default',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    preferredLevel: 'Beginner',
    learningGoals: ['Java Spring Boot', 'React', 'Data Structures'],
    createdAt: new Date()
  }
];

