import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5001,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/studytube',
  youtubeApiKey: process.env.YOUTUBE_API_KEY || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  nodeEnv: process.env.NODE_ENV || 'development',
  cacheTTL: 3600 * 1000, // 1 hour cache

  // 16-parameter scoring weights (Total = 100%)
  weights: {
    topicRelevance: 0.10,
    contentCoverage: 0.10,
    teachingClarity: 0.10,
    practicalExamples: 0.05,
    technicalAccuracy: 0.05,
    positiveLearningComments: 0.10,
    negativeFeedback: 0.05,
    contentRelatedFeedback: 0.05,
    commentSentiment: 0.05,
    commentAuthenticity: 0.05,
    likeToViewRatio: 0.05,
    viewEngagement: 0.05,
    channelCredibility: 0.05,
    videoDuration: 0.05,
    contentFreshness: 0.05,
    audioVisualQuality: 0.05,
  },

  classificationThresholds: {
    excellent: 90,
    veryGood: 80,
    good: 70,
    average: 50,
    // below 50: Not Recommended
  }
};

