import { YouTubeService } from '../services/youtubeService.js';
import { CommentAnalysisService } from '../services/commentAnalysisService.js';
import { TranscriptService } from '../services/transcriptService.js';
import { ScoringService } from '../services/scoringService.js';
import { VideoAnalysisModel, memoryAnalyses } from '../models/VideoAnalysis.js';
import { isDbConnected } from '../models/db.js';

export async function getVideoAnalysis(req, res, next) {
  try {
    const { videoId } = req.params;
    if (!videoId) {
      return res.status(400).json({ success: false, message: 'Video ID is required' });
    }

    // Check DB / Memory cache first
    if (isDbConnected()) {
      try {
        const cachedAnalysis = await VideoAnalysisModel.findOne({ videoId });
        if (cachedAnalysis) {
          return res.json({ success: true, data: cachedAnalysis });
        }
      } catch (e) {
        // Continue to fresh evaluation
      }
    } else if (memoryAnalyses.has(videoId)) {
      return res.json({ success: true, data: memoryAnalyses.get(videoId) });
    }

    // 1. Fetch Video Metadata
    const video = await YouTubeService.getVideoDetails(videoId);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video not found' });
    }

    // 2. Fetch Comments & Run AI Comment Analysis
    const rawComments = await YouTubeService.getVideoComments(videoId);
    const commentsAnalysis = await CommentAnalysisService.analyzeComments(rawComments, video.title);

    // 3. Retrieve Transcript & Chapter Analysis
    const transcriptAnalysis = await TranscriptService.getTranscript(videoId, video);

    // 4. Calculate 16-parameter Quality Score & Confidence
    const qualityScore = ScoringService.evaluateMetrics({
      video,
      commentsAnalysis,
      transcriptAnalysis
    });

    // 5. Generate "Why We Recommend This Video" highlights
    const recommendationReasons = [
      video.tags?.includes('Complete Course') || video.durationSeconds > 14400 
        ? 'Covers all major foundational concepts from ground up' 
        : 'Crisp and focused coverage of critical core modules',
      commentsAnalysis.clarityScore >= 85 
        ? 'Clear and beginner-friendly step-by-step explanations' 
        : 'Comprehensive architectural breakdown with practical context',
      qualityScore.breakdown.practicalExamples?.score >= 85 
        ? 'Includes hands-on projects and real-world code implementation' 
        : 'High proportion of practical code demonstrations',
      commentsAnalysis.positiveLearningScore >= 80 
        ? 'Positive verified learning feedback from over 90% of student commenters' 
        : 'Strong peer approval on community technical forums',
      qualityScore.breakdown.contentFreshness?.score >= 85 
        ? 'Up-to-date content matching modern framework standards' 
        : 'Proven pedagogical longevity with timeless core principles'
    ];

    const resultPayload = {
      videoId,
      video,
      qualityScore,
      recommendationReasons,
      commentsAnalysis,
      transcriptAnalysis,
      evaluationTimestamp: new Date().toISOString()
    };

    // Save to DB or in-memory
    if (isDbConnected()) {
      try {
        await VideoAnalysisModel.findOneAndUpdate(
          { videoId },
          {
            videoId,
            title: video.title,
            channelTitle: video.channelTitle,
            channelAvatar: video.channelAvatar,
            thumbnail: video.thumbnail,
            duration: video.duration,
            views: video.views,
            overallScore: qualityScore.overallScore,
            classification: qualityScore.classification,
            confidence: qualityScore.confidence,
            breakdown: qualityScore.breakdown,
            categoryScores: qualityScore.categoryScores,
            summary: commentsAnalysis.summary,
            commentsAnalysis,
            transcriptAnalysis,
            analyzedAt: new Date()
          },
          { upsert: true, new: true }
        );
      } catch (e) {
        console.warn('Could not persist to MongoDB:', e.message);
      }
    } else {
      memoryAnalyses.set(videoId, resultPayload);
    }

    res.json({
      success: true,
      data: resultPayload
    });
  } catch (error) {
    next(error);
  }
}

