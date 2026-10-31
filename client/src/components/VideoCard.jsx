import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Bookmark, ExternalLink, Sparkles, MoreVertical } from 'lucide-react';
import { ScoreGauge } from './ScoreGauge';
import { ProgressBar } from './ProgressBar';
import { useApp } from '../context/AppContext';

export function VideoCard({ video, viewMode = 'list' }) {
  const navigate = useNavigate();
  const { toggleSaveVideo, isVideoSaved } = useApp();

  const videoId = video.videoId || video.id;
  const isSaved = isVideoSaved(videoId);

  const score = video.qualityScore?.overallScore || video.scoreValue || video.targetScore || 85;
  const classification = video.classification || video.qualityScore?.classification || 'Very Good';
  const breakdown = video.qualityScore?.breakdown || {};
  const subscores = video.subscores || {};

  const contentQualityVal = breakdown.contentCoverage?.score || subscores.contentQuality || 92;
  const commentsVal = breakdown.positiveLearningComments?.score || subscores.comments || 86;
  const clarityVal = breakdown.teachingClarity?.score || subscores.teachingClarity || 89;
  const relevanceVal = breakdown.topicRelevance?.score || subscores.relevance || 91;

  function handleCardClick() {
    navigate(`/video/${videoId}`);
  }

  function handleSaveClick(e) {
    e.stopPropagation();
    toggleSaveVideo(video);
  }

  return (
    <div
      onClick={handleCardClick}
      className="group bg-white rounded-xl border border-[#E5E5E5] hover:border-gray-300 hover:shadow-card transition-all duration-200 cursor-pointer overflow-hidden p-4 sm:p-5 flex flex-col md:flex-row gap-5"
    >
      {/* Video Thumbnail (FULL ORIGINAL COLOR) */}
      <div className="relative shrink-0 w-full md:w-64 aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/85 text-white text-xs font-semibold px-2 py-0.5 rounded tracking-wide shadow">
          {video.duration}
        </div>
      </div>

      {/* Main Metadata */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-[#111111] group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
            {video.title}
          </h3>

          {/* Channel info & stats */}
          <div className="flex items-center gap-2 mt-2 text-xs sm:text-sm text-gray-600">
            {video.channelAvatar && (
              <img
                src={video.channelAvatar}
                alt={video.channelTitle}
                className="w-5 h-5 rounded-full object-cover"
              />
            )}
            <span className="font-medium text-gray-800">{video.channelTitle}</span>
            {video.isVerified !== false && (
              <CheckCircle2 className="w-3.5 h-3.5 text-gray-500 fill-gray-100" />
            )}
            <span className="text-gray-400">•</span>
            <span>{video.viewsFormatted || `${video.views} views`}</span>
            <span className="text-gray-400">•</span>
            <span>{video.timeAgo || 'recently'}</span>
          </div>

          {/* Description snippet */}
          <p className="mt-2 text-xs sm:text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {video.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2">
          {video.tags && video.tags.map((tag, idx) => (
            <span
              key={idx}
              className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${
                tag === 'Beginner' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                tag === 'Advanced' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                tag === 'Complete Course' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                'bg-gray-50 text-gray-700 border-gray-200'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Right Quality Score & Breakdown */}
      <div className="shrink-0 w-full md:w-56 pt-3 md:pt-0 border-t md:border-t-0 md:border-l border-gray-100 md:pl-5 flex flex-col justify-between">
        <div>
          {/* Quality score badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-emerald-600 tracking-tight">{score}</span>
              <span className="text-xs text-gray-500 font-semibold">/100</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded ml-1">
                {classification}
              </span>
            </div>
            <button
              onClick={handleSaveClick}
              className={`p-1.5 rounded-md hover:bg-gray-100 transition-colors ${
                isSaved ? 'text-brand-600' : 'text-gray-400 hover:text-gray-600'
              }`}
              title={isSaved ? 'Saved to Watchlist' : 'Save to Watchlist'}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-brand-600 text-brand-600' : ''}`} />
            </button>
          </div>

          {/* Mini Progress bars breakdown */}
          <div className="mt-3 space-y-1.5">
            <ProgressBar label="Content Quality" value={contentQualityVal} height="h-1.5" />
            <ProgressBar label="Comments" value={commentsVal} height="h-1.5" />
            <ProgressBar label="Teaching Clarity" value={clarityVal} height="h-1.5" />
            <ProgressBar label="Relevance" value={relevanceVal} height="h-1.5" />
          </div>
        </div>

        {/* View analysis link */}
        <div className="mt-3 flex items-center justify-between text-xs font-semibold text-brand-600 group-hover:text-brand-700">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            AI Breakdown
          </span>
          <span className="text-gray-400 group-hover:translate-x-0.5 transition-transform">→</span>
        </div>
      </div>
    </div>
  );
}

