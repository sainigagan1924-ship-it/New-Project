import mongoose from 'mongoose';

const videoAnalysisSchema = new mongoose.Schema({
  videoId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  channelTitle: { type: String },
  channelAvatar: { type: String },
  thumbnail: { type: String },
  duration: { type: String },
  views: { type: Number },
  overallScore: { type: Number, required: true },
  classification: { type: String, required: true },
  confidence: { type: Number, default: 95 },
  breakdown: { type: mongoose.Schema.Types.Mixed },
  categoryScores: { type: mongoose.Schema.Types.Mixed },
  summary: { type: mongoose.Schema.Types.Mixed },
  commentsAnalysis: { type: mongoose.Schema.Types.Mixed },
  transcriptAnalysis: { type: mongoose.Schema.Types.Mixed },
  analyzedAt: { type: Date, default: Date.now }
});

export const VideoAnalysisModel = mongoose.models.VideoAnalysis || mongoose.model('VideoAnalysis', videoAnalysisSchema);

export const memoryAnalyses = new Map();

