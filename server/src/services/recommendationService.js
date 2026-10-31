export class RecommendationService {
  /**
   * Filter and rank videos
   */
  static rankAndFilter(videos, { level, duration, courseType, features = [], sortBy = 'recommended' }) {
    let results = [...videos];

    // Filter by learning level
    if (level && level !== 'all') {
      const targetLevel = level.toLowerCase();
      results = results.filter(v => {
        const vLevel = (v.level || '').toLowerCase();
        const hasTag = v.tags?.some(t => t.toLowerCase() === targetLevel);
        return vLevel === targetLevel || hasTag;
      });
    }

    // Filter by duration
    if (duration && duration !== 'all') {
      results = results.filter(v => {
        const sec = v.durationSeconds || 0;
        if (duration === '0-10') return sec <= 600;
        if (duration === '10-30') return sec > 600 && sec <= 1800;
        if (duration === '30+') return sec > 1800;
        return true;
      });
    }

    // Filter by course type
    if (courseType && courseType !== 'all') {
      const typeLower = courseType.toLowerCase();
      results = results.filter(v => {
        const cType = (v.category || '').toLowerCase();
        const tags = (v.tags || []).map(t => t.toLowerCase());
        return cType.includes(typeLower) || tags.some(t => t.includes(typeLower));
      });
    }

    // Filter by features checkboxes
    if (features && features.length > 0) {
      if (features.includes('practical') || features.includes('project')) {
        results = results.filter(v => v.hasProject || v.tags?.some(t => /project|hands-on|practical/i.test(t)));
      }
      if (features.includes('latest')) {
        const twoYearsAgo = Date.now() - (2 * 365 * 24 * 3600 * 1000);
        results = results.filter(v => !v.publishedAt || new Date(v.publishedAt).getTime() > twoYearsAgo);
      }
      if (features.includes('hd')) {
        results = results.filter(v => v.definition === 'hd');
      }
    }

    // Sorting
    switch (sortBy) {
      case 'quality':
        results.sort((a, b) => (b.qualityScore?.overallScore || b.targetScore || 0) - (a.qualityScore?.overallScore || a.targetScore || 0));
        break;
      case 'popular':
        results.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'recent':
        results.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
        break;
      case 'recommended':
      default:
        // Balanced learning value ranking formula:
        // 70% Quality Score + 20% Relevance + 10% Engagement
        results.sort((a, b) => {
          const scoreA = (a.qualityScore?.overallScore || a.targetScore || 80) * 0.7 + (a.relevanceScore || 90) * 0.2 + (Math.log10(a.views || 1000) * 3);
          const scoreB = (b.qualityScore?.overallScore || b.targetScore || 80) * 0.7 + (b.relevanceScore || 90) * 0.2 + (Math.log10(b.views || 1000) * 3);
          return scoreB - scoreA;
        });
        break;
    }

    return results;
  }
}

