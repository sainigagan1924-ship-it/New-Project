import { YouTubeService } from '../services/youtubeService.js';
import { ScoringService } from '../services/scoringService.js';
import { RecommendationService } from '../services/recommendationService.js';

export async function searchVideos(req, res, next) {
  try {
    const { q = 'Java Spring Boot', level, duration, courseType, features, sortBy } = req.query;

    const rawVideos = await YouTubeService.searchVideos(q, { level, duration, courseType });

    // Enrich videos with quick quality evaluation if not already evaluated
    const scoredVideos = rawVideos.map(video => {
      if (video.qualityScore) return video;

      // Calculate score based on available metrics
      const evaluation = ScoringService.evaluateMetrics({
        video,
        commentsAnalysis: {
          positiveLearningScore: video.subscores?.comments || 86,
          sentimentScore: 88,
          clarityScore: video.subscores?.teachingClarity || 90,
          contentRelatedScore: 87,
          ratios: { negative: 0.04, spam: 0.02 }
        },
        transcriptAnalysis: {
          topicRelevanceScore: video.subscores?.relevance || 92,
          coverageScore: video.subscores?.contentQuality || 91,
          hasCodeExamples: true
        }
      });

      return {
        ...video,
        qualityScore: evaluation,
        scoreValue: evaluation.overallScore,
        classification: evaluation.classification
      };
    });

    const featureList = features ? (Array.isArray(features) ? features : features.split(',')) : [];
    const filteredAndRanked = RecommendationService.rankAndFilter(scoredVideos, {
      level,
      duration,
      courseType,
      features: featureList,
      sortBy
    });

    res.json({
      success: true,
      query: q,
      totalCount: filteredAndRanked.length,
      data: filteredAndRanked
    });
  } catch (error) {
    next(error);
  }
}

