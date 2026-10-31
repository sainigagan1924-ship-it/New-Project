import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Sparkles,
  ThumbsUp,
  Share2,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  FileText,
  ListOrdered,
  HelpCircle,
  Lightbulb,
  ExternalLink,
  ShieldAlert,
  Clock,
  Eye,
  Calendar,
  Check
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { ScoreGauge } from '../components/ScoreGauge';
import { ProgressBar } from '../components/ProgressBar';
import { fetchVideoAnalysis } from '../services/api';
import { useApp } from '../context/AppContext';

export function VideoAnalysisPage() {
  const { videoId } = useParams();
  const { toggleSaveVideo, isVideoSaved, showToast } = useApp();

  const [activeTab, setActiveTab] = useState('analysis'); // 'analysis', 'comments', 'transcript', 'chapters'
  const [commentCategoryFilter, setCommentCategoryFilter] = useState('all');
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadAnalysis();
    window.scrollTo(0, 0);
  }, [videoId]);

  async function loadAnalysis() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchVideoAnalysis(videoId);
      if (res.success) {
        setAnalysisData(res.data);
      } else {
        setError(res.message || 'Could not evaluate video');
      }
    } catch (e) {
      setError('Failed to fetch AI analysis.');
    } finally {
      setLoading(false);
    }
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    showToast('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  }

  const video = analysisData?.video || {};
  const qualityScore = analysisData?.qualityScore || {};
  const breakdown = qualityScore.breakdown || {};
  const commentsAnalysis = analysisData?.commentsAnalysis || {};
  const transcriptAnalysis = analysisData?.transcriptAnalysis || {};
  const recommendationReasons = analysisData?.recommendationReasons || [];

  const isSaved = isVideoSaved(videoId);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar variant="light" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
            <div className="lg:col-span-7 space-y-4">
              <div className="aspect-video bg-gray-200 rounded-xl" />
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
            <div className="lg:col-span-5 space-y-4">
              <div className="h-32 bg-gray-200 rounded-xl" />
              <div className="h-48 bg-gray-200 rounded-xl" />
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="p-8 text-center bg-red-50 border border-red-200 rounded-2xl max-w-lg mx-auto my-12">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <h3 className="text-base font-bold text-red-900">Analysis Error</h3>
            <p className="text-xs text-red-700 mt-1">{error}</p>
            <Link to="/search" className="mt-4 inline-block px-4 py-2 bg-brand-600 text-white text-xs font-semibold rounded-lg">
              Back to Search
            </Link>
          </div>
        )}

        {!loading && !error && analysisData && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: YouTube Player & Metadata */}
            <div className="lg:col-span-7 space-y-5">
              {/* YouTube Player Embed */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-gray-200 shadow-sm">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?rel=0&autoplay=0`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#111111] leading-snug tracking-tight">
                {video.title}
              </h1>

              {/* Channel row & Action buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#E5E5E5]">
                {/* Channel */}
                <div className="flex items-center gap-3">
                  <img
                    src={video.channelAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${video.channelTitle}`}
                    alt={video.channelTitle}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-sm text-[#111111]">
                      <span>{video.channelTitle}</span>
                      <CheckCircle2 className="w-4 h-4 text-gray-500 fill-gray-100" />
                    </div>
                    <span className="text-xs text-gray-500">
                      {(video.channelSubscribers ? (video.channelSubscribers / 1000000).toFixed(1) + 'M' : '1.2M')} subscribers
                    </span>
                  </div>
                  <button className="ml-2 px-4 py-1.5 bg-[#111111] hover:bg-black text-white text-xs font-semibold rounded-full shadow-subtle transition-colors">
                    Subscribe
                  </button>
                </div>

                {/* Actions: Likes, Share, Save */}
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-100 hover:bg-surface-200 text-xs font-semibold text-gray-800 transition-colors">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{video.likesFormatted || '92K'}</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-100 hover:bg-surface-200 text-xs font-semibold text-gray-800 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copied ? 'Copied!' : 'Share'}</span>
                  </button>
                  <button
                    onClick={() => toggleSaveVideo(video)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      isSaved
                        ? 'bg-brand-50 text-brand-600 border border-brand-200'
                        : 'bg-surface-100 hover:bg-surface-200 text-gray-800'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                    <span>{isSaved ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
              </div>

              {/* Video Description Box */}
              <div className="bg-surface-50 rounded-xl p-4 border border-gray-200 text-xs sm:text-sm text-gray-700 space-y-2">
                <div className="flex items-center gap-3 font-semibold text-gray-900 text-xs">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-gray-500" />
                    {video.viewsFormatted || `${video.views} views`}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-500" />
                    {video.timeAgo || 'recently'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-500" />
                    {video.duration}
                  </span>
                </div>

                <p className={`text-gray-700 whitespace-pre-line leading-relaxed ${!showFullDesc ? 'line-clamp-3' : ''}`}>
                  {video.description}
                </p>

                <button
                  onClick={() => setShowFullDesc(!showFullDesc)}
                  className="font-bold text-gray-900 hover:text-brand-600 text-xs mt-1"
                >
                  {showFullDesc ? 'Show less' : '...more'}
                </button>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {(video.tags || ['#SpringBoot', '#Java', '#Backend', '#WebDevelopment']).map((tag, idx) => (
                    <span key={idx} className="text-brand-600 font-semibold text-xs hover:underline cursor-pointer">
                      {tag.startsWith('#') ? tag : `#${tag}`}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Tabbed Evaluation Panel */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E5E5E5] shadow-card overflow-hidden sticky top-20">
              {/* Tab Navigation matching Mockup 3 */}
              <div className="flex items-center border-b border-[#E5E5E5] px-4 bg-surface-50">
                {[
                  { id: 'analysis', label: 'AI Analysis', icon: Sparkles },
                  { id: 'comments', label: 'Comments', icon: MessageSquare },
                  { id: 'transcript', label: 'Transcript', icon: FileText },
                  { id: 'chapters', label: 'Chapters', icon: ListOrdered },
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 py-3.5 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                        isActive
                          ? 'border-brand-600 text-brand-600 font-bold bg-white'
                          : 'border-transparent text-gray-600 hover:text-[#111111]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab 1: AI Analysis */}
              {activeTab === 'analysis' && (
                <div className="p-5 space-y-6 max-h-[calc(100vh-10rem)] overflow-y-auto">
                  {/* Top Circular / Big Score Badge */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-50 border border-gray-200">
                    <ScoreGauge
                      score={qualityScore.overallScore || 92}
                      classification={qualityScore.classification || 'Excellent'}
                      size="lg"
                    />
                    <div className="space-y-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                        Overall Quality Score
                      </span>
                      <p className="text-xs text-gray-700 leading-snug">
                        This video is highly recommended for learners seeking high technical accuracy and hands-on clarity.
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 pt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{qualityScore.confidence || 98}% Confidence Evaluation</span>
                      </div>
                    </div>
                  </div>

                  {/* 16-Parameter Breakdown Progress Bars */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center justify-between">
                      <span>Parameter Scoring Breakdown</span>
                      <span className="text-[11px] text-gray-400 font-normal">Weighted 100%</span>
                    </h4>
                    <div className="space-y-2.5">
                      <ProgressBar label="Content Quality" value={breakdown.contentCoverage?.score || 95} />
                      <ProgressBar label="Comment Analysis" value={breakdown.positiveLearningComments?.score || 88} />
                      <ProgressBar label="Teaching Clarity" value={breakdown.teachingClarity?.score || 90} />
                      <ProgressBar label="Topic Coverage" value={breakdown.topicRelevance?.score || 92} />
                      <ProgressBar label="Practical Examples" value={breakdown.practicalExamples?.score || 90} />
                      <ProgressBar label="Technical Accuracy" value={breakdown.technicalAccuracy?.score || 94} />
                      <ProgressBar label="Content Freshness / Recency" value={breakdown.contentFreshness?.score || 85} />
                      <ProgressBar label="Audio & Video Quality" value={breakdown.audioVisualQuality?.score || 88} />
                      <ProgressBar label="Duration Suitability" value={breakdown.videoDuration?.score || 90} />
                      <ProgressBar label="Channel Credibility" value={breakdown.channelCredibility?.score || 90} />
                    </div>
                  </div>

                  {/* Green Callout: Why We Recommend This Video */}
                  <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2.5">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                      <Lightbulb className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                      <span>Why we recommend this video</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-emerald-900">
                      {recommendationReasons.map((reason, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Tab 2: Comments Intelligence */}
              {activeTab === 'comments' && (
                <div className="p-5 space-y-5 max-h-[calc(100vh-10rem)] overflow-y-auto">
                  {/* Sentiment Summary */}
                  <div className="p-3.5 rounded-xl bg-surface-50 border border-gray-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold text-gray-900">
                      <span>Learner Sentiment Overview</span>
                      <span className="text-emerald-700 font-bold">{commentsAnalysis.summary?.viewerLearningSatisfaction || '94% Very Satisfied'}</span>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {commentsAnalysis.summary?.whatLearnersSay}
                    </p>
                  </div>

                  {/* Category Pills Filter */}
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {[
                      { id: 'all', label: 'All Comments' },
                      { id: 'positive_learning', label: 'Positive Learning' },
                      { id: 'technical_mistakes', label: 'Technical Mistakes / Notes' },
                      { id: 'confusion', label: 'Student Questions' }
                    ].map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setCommentCategoryFilter(cat.id)}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                          commentCategoryFilter === cat.id
                            ? 'bg-brand-600 text-white'
                            : 'bg-surface-100 text-gray-700 hover:bg-surface-200'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Comment List */}
                  <div className="space-y-3 pt-1">
                    {(commentsAnalysis.classifiedComments || []).length === 0 && (
                      <p className="text-xs text-gray-500 text-center py-4">No comments found for this filter.</p>
                    )}
                    {(commentsAnalysis.classifiedComments || [])
                      .filter(c => commentCategoryFilter === 'all' || c.category === commentCategoryFilter)
                      .map((c) => (
                        <div key={c.id} className="p-3 rounded-lg border border-gray-100 bg-white hover:bg-surface-50 text-xs space-y-1.5 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <img
                                src={c.authorProfileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.author}`}
                                alt={c.author}
                                className="w-5 h-5 rounded-full object-cover"
                              />
                              <span className="font-semibold text-gray-900">{c.author}</span>
                            </div>
                            {c.category === 'technical_mistakes' && (
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                                Community Fix
                              </span>
                            )}
                            {c.category === 'confusion' && (
                              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                                Question
                              </span>
                            )}
                            {c.category === 'positive_learning' && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                                Helpful
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 leading-relaxed">{c.text}</p>
                          <div className="flex items-center gap-2 text-[11px] text-gray-400 pt-0.5">
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="w-3 h-3" />
                              {c.likes} likes
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Transcript & Concept Coverage */}
              {activeTab === 'transcript' && (
                <div className="p-5 space-y-4 max-h-[calc(100vh-10rem)] overflow-y-auto text-xs">
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900">
                    <span className="font-bold block">Permitted Transcript & Concept Coverage</span>
                    <span className="text-[11px] text-blue-800">
                      {transcriptAnalysis.notice || 'Transcript indexed and aligned with curriculum checkpoints.'}
                    </span>
                  </div>

                  {/* Topics Covered vs Skipped */}
                  <div className="space-y-2">
                    <span className="font-bold text-gray-900 text-xs block">Topics Covered in Depth:</span>
                    {(transcriptAnalysis.topicsCovered || []).map((t, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <span className="font-bold text-gray-900 text-xs block">Topics Skipped / Optional:</span>
                    {(transcriptAnalysis.topicsSkipped || []).map((t, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-gray-500">
                        <span className="w-3.5 h-3.5 rounded-full border border-gray-300 flex items-center justify-center text-[10px] text-gray-400">−</span>
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>

                  {/* Transcript preview segments */}
                  <div className="pt-3 border-t border-gray-100 space-y-2">
                    <span className="font-bold text-gray-900 text-xs block">Transcript Segments:</span>
                    {(transcriptAnalysis.segments || []).map((seg, i) => (
                      <div key={i} className="p-2 rounded bg-surface-50 border border-gray-100 flex items-start gap-2.5">
                        <span className="font-mono text-brand-600 font-bold text-[11px] shrink-0 bg-white px-1 rounded border border-gray-200">
                          {seg.timestamp}
                        </span>
                        <p className="text-gray-700 leading-normal">{seg.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Chapters */}
              {activeTab === 'chapters' && (
                <div className="p-5 space-y-3 max-h-[calc(100vh-10rem)] overflow-y-auto text-xs">
                  <span className="font-bold text-gray-900 text-xs block mb-1">Video Curriculum Chapters</span>
                  {(transcriptAnalysis.chapters || []).map((chap, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-gray-200 bg-white hover:border-brand-500 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-brand-50 text-brand-700 font-bold flex items-center justify-center text-[11px]">
                          {idx + 1}
                        </span>
                        <div>
                          <h5 className="font-bold text-gray-900 text-xs">{chap.title}</h5>
                          <span className="text-[11px] text-gray-500 font-mono">{chap.timestamp}</span>
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

