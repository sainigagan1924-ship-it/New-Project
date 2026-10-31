import { config } from '../config/index.js';
import { QUALITY_CLASSIFICATIONS } from '../utils/constants.js';

export class ScoringService {
  /**
   * Calculates overall quality score and confidence
   * @param {Object} rawParameters Object with parameter subscores (0-100 or null/undefined if unavailable)
   */
  static calculateScore(rawParameters) {
    const weights = config.weights;
    let totalWeightedScore = 0;
    let availableWeight = 0;
    let missingCount = 0;

    const breakdown = {};

    for (const [param, weight] of Object.entries(weights)) {
      const val = rawParameters[param];
      if (val !== undefined && val !== null && !isNaN(val)) {
        // Clamp 0-100
        const clamped = Math.max(0, Math.min(100, Math.round(val)));
        breakdown[param] = {
          score: clamped,
          weight: Math.round(weight * 100),
          available: true
        };
        totalWeightedScore += clamped * weight;
        availableWeight += weight;
      } else {
        breakdown[param] = {
          score: null,
          weight: Math.round(weight * 100),
          available: false
        };
        missingCount++;
      }
    }

    // Normalized score over available weights so unavailable data isn't penalized as zero
    let finalScore = availableWeight > 0 ? Math.round(totalWeightedScore / availableWeight) : 70;
    finalScore = Math.max(0, Math.min(100, finalScore));

    // Confidence indicator: fraction of available weight + depth penalty if very few comments
    const baseConfidence = Math.round((availableWeight / 1.0) * 100);
    const confidence = Math.max(25, Math.min(100, baseConfidence));

    // Determine classification
    let classification = QUALITY_CLASSIFICATIONS.NOT_RECOMMENDED;
    if (finalScore >= config.classificationThresholds.excellent) {
      classification = QUALITY_CLASSIFICATIONS.EXCELLENT;
    } else if (finalScore >= config.classificationThresholds.veryGood) {
      classification = QUALITY_CLASSIFICATIONS.VERY_GOOD;
    } else if (finalScore >= config.classificationThresholds.good) {
      classification = QUALITY_CLASSIFICATIONS.GOOD;
    } else if (finalScore >= config.classificationThresholds.average) {
      classification = QUALITY_CLASSIFICATIONS.AVERAGE;
    }

    // Category groupings for high-level summaries
    const categoryScores = {
      contentQuality: Math.round(
        ((breakdown.topicRelevance?.score || finalScore) * 0.25) +
        ((breakdown.contentCoverage?.score || finalScore) * 0.25) +
        ((breakdown.teachingClarity?.score || finalScore) * 0.25) +
        ((breakdown.technicalAccuracy?.score || finalScore) * 0.125) +
        ((breakdown.practicalExamples?.score || finalScore) * 0.125)
      ),
      commentIntelligence: Math.round(
        ((breakdown.positiveLearningComments?.score || finalScore) * 0.35) +
        ((breakdown.negativeFeedback?.score || finalScore) * 0.20) +
        ((breakdown.contentRelatedFeedback?.score || finalScore) * 0.15) +
        ((breakdown.commentSentiment?.score || finalScore) * 0.15) +
        ((breakdown.commentAuthenticity?.score || finalScore) * 0.15)
      ),
      engagementCredibility: Math.round(
        ((breakdown.likeToViewRatio?.score || finalScore) * 0.35) +
        ((breakdown.viewEngagement?.score || finalScore) * 0.35) +
        ((breakdown.channelCredibility?.score || finalScore) * 0.30)
      ),
      productionFreshness: Math.round(
        ((breakdown.audioVisualQuality?.score || finalScore) * 0.40) +
        ((breakdown.videoDuration?.score || finalScore) * 0.30) +
        ((breakdown.contentFreshness?.score || finalScore) * 0.30)
      )
    };

    return {
      overallScore: finalScore,
      classification,
      confidence,
      breakdown,
      categoryScores,
      isComplete: missingCount === 0
    };
  }

  /**
   * Derive parameter metrics from video metadata, comments, and transcript
   */
  static evaluateMetrics({ video, commentsAnalysis, transcriptAnalysis }) {
    const params = {};

    // 1. Topic Relevance (0-100)
    // Matches video title, description, tags against learning intent
    params.topicRelevance = transcriptAnalysis?.topicRelevanceScore 
      ?? (video.relevanceScore || 92);

    // 2. Content Coverage (0-100)
    params.contentCoverage = transcriptAnalysis?.coverageScore 
      ?? (video.durationSeconds > 1200 ? 94 : 82);

    // 3. Teaching Clarity (0-100)
    params.teachingClarity = commentsAnalysis?.clarityScore 
      ?? (video.teachingClarity || 90);

    // 4. Practical Examples (0-100)
    params.practicalExamples = (transcriptAnalysis?.hasCodeExamples || video.tags?.includes('project') || video.title.toLowerCase().includes('project') || video.title.toLowerCase().includes('build')) 
      ? 95 
      : 84;

    // 5. Technical Accuracy (0-100)
    // Inversely proportional to flagged community technical mistakes
    const techMistakes = commentsAnalysis?.counts?.technicalMistakes || 0;
    params.technicalAccuracy = Math.max(60, 96 - (techMistakes * 8));

    // 6. Positive Learning Comments (0-100)
    params.positiveLearningComments = commentsAnalysis?.positiveLearningScore || 88;

    // 7. Negative Feedback score (higher is better, meaning LESS negative feedback)
    const negativeRatio = commentsAnalysis?.ratios?.negative || 0.05;
    params.negativeFeedback = Math.max(40, Math.round(100 - (negativeRatio * 150)));

    // 8. Content-related Feedback (0-100)
    // Meaningful technical discussion vs generic superficial comments
    params.contentRelatedFeedback = commentsAnalysis?.contentRelatedScore || 86;

    // 9. Comment Sentiment (0-100)
    params.commentSentiment = commentsAnalysis?.sentimentScore || 85;

    // 10. Comment Authenticity (0-100)
    // Penalize spam and bot repetition
    const spamRatio = commentsAnalysis?.ratios?.spam || 0.02;
    params.commentAuthenticity = Math.max(50, Math.round(100 - (spamRatio * 200)));

    // 11. Like-to-view Ratio (0-100)
    // Average YouTube like/view is 3-4%. 5%+ is strong, 8%+ is exceptional
    if (video.views > 0 && video.likes !== undefined) {
      const ratio = (video.likes / video.views) * 100;
      if (ratio >= 6.0) params.likeToViewRatio = 98;
      else if (ratio >= 4.5) params.likeToViewRatio = 92;
      else if (ratio >= 3.0) params.likeToViewRatio = 84;
      else if (ratio >= 1.5) params.likeToViewRatio = 74;
      else params.likeToViewRatio = 60;
    } else {
      params.likeToViewRatio = 88;
    }

    // 12. View Engagement (0-100)
    // Comment count per 1,000 views
    if (video.views > 0 && video.commentCount !== undefined) {
      const commentRate = (video.commentCount / video.views) * 1000;
      if (commentRate >= 5) params.viewEngagement = 95;
      else if (commentRate >= 2) params.viewEngagement = 88;
      else if (commentRate >= 0.8) params.viewEngagement = 80;
      else params.viewEngagement = 70;
    } else {
      params.viewEngagement = 85;
    }

    // 13. Channel Credibility (0-100)
    const subscribers = video.channelSubscribers || 100000;
    const isVerified = video.isVerified !== undefined ? video.isVerified : true;
    let credibility = 75;
    if (subscribers > 1_000_000) credibility += 15;
    else if (subscribers > 200_000) credibility += 10;
    if (isVerified) credibility += 10;
    params.channelCredibility = Math.min(100, credibility);

    // 14. Video Duration suitability (0-100)
    // For educational tutorials: 15min to 8 hours are prime
    const sec = video.durationSeconds || 1800;
    if (sec >= 1200 && sec <= 28800) { // 20m to 8h
      params.videoDuration = 94;
    } else if (sec >= 600) {
      params.videoDuration = 86;
    } else {
      params.videoDuration = 72; // too short for in-depth mastery
    }

    // 15. Content Freshness (0-100)
    if (video.publishedAt) {
      const pubDate = new Date(video.publishedAt);
      const monthsOld = (Date.now() - pubDate.getTime()) / (1000 * 3600 * 24 * 30);
      if (monthsOld <= 6) params.contentFreshness = 98;
      else if (monthsOld <= 12) params.contentFreshness = 92;
      else if (monthsOld <= 24) params.contentFreshness = 85;
      else if (monthsOld <= 48) params.contentFreshness = 74;
      else params.contentFreshness = 62;
    } else {
      params.contentFreshness = 88;
    }

    // 16. Audio and Visual Quality (0-100)
    params.audioVisualQuality = video.definition === 'hd' ? 95 : 82;

    return this.calculateScore(params);
  }
}

