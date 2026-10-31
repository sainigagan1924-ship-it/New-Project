import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Map,
  CheckCircle2,
  Bookmark,
  Share2,
  ArrowRight,
  Sparkles,
  Play,
  Layers,
  ChevronRight,
  Check
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { fetchRoadmaps, fetchRoadmapBySlug, toggleRoadmapCompletion } from '../services/api';
import { useApp } from '../context/AppContext';

export function RoadmapsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeSlug = searchParams.get('slug') || 'java-spring-boot';

  const { savedRoadmapSlugs, toggleSaveRoadmap, showToast } = useApp();

  const [allRoadmaps, setAllRoadmaps] = useState([]);
  const [currentRoadmap, setCurrentRoadmap] = useState(null);
  const [activeStageId, setActiveStageId] = useState('stage-beginner');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoadmaps();
  }, [activeSlug]);

  async function loadRoadmaps() {
    setLoading(true);
    try {
      const [listRes, detailRes] = await Promise.all([
        fetchRoadmaps(),
        fetchRoadmapBySlug(activeSlug)
      ]);

      if (listRes.success) setAllRoadmaps(listRes.data);
      if (detailRes.success && detailRes.data) {
        setCurrentRoadmap(detailRes.data);
        if (detailRes.data.stages && detailRes.data.stages.length > 0) {
          setActiveStageId(detailRes.data.stages[0].id);
        }
      }
    } catch (e) {
      console.warn('Failed to load roadmap:', e);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleVideo(stageId, videoId, currentStatus) {
    if (!currentRoadmap) return;
    const newStatus = !currentStatus;

    // Optimistic UI update
    setCurrentRoadmap(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const stage = copy.stages.find(s => s.id === stageId);
      if (stage) {
        const video = stage.videos.find(v => v.videoId === videoId || v.id === videoId);
        if (video) video.completed = newStatus;
      }
      return copy;
    });

    try {
      await toggleRoadmapCompletion(activeSlug, stageId, videoId, newStatus);
      showToast(newStatus ? 'Video marked completed! 🎉' : 'Video marked incomplete');
    } catch (e) {
      console.warn('Failed to save completion:', e);
    }
  }

  const isSaved = savedRoadmapSlugs.includes(activeSlug);

  // Calculate total completed videos in roadmap
  const allVideos = (currentRoadmap?.stages || []).flatMap(s => s.videos || []);
  const completedCount = allVideos.filter(v => v.completed).length;
  const progressPct = allVideos.length > 0 ? Math.round((completedCount / allVideos.length) * 100) : 0;

  const currentStage = (currentRoadmap?.stages || []).find(s => s.id === activeStageId) || (currentRoadmap?.stages || [])[0];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar variant="light" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full flex">
        {/* Left Sidebar */}
        <div className="hidden md:block">
          <Sidebar showFilters={false} />
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0 py-6 md:px-8">
          {loading && (
            <div className="space-y-6 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-16 bg-gray-200 rounded-xl" />
              <div className="h-48 bg-gray-200 rounded-xl" />
            </div>
          )}

          {!loading && currentRoadmap && (
            <div className="space-y-8">
              {/* Roadmap Switcher Tabs if multiple roadmaps exist */}
              {allRoadmaps.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                  {allRoadmaps.map(rm => (
                    <button
                      key={rm.slug}
                      onClick={() => setSearchParams({ slug: rm.slug })}
                      className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-colors ${
                        rm.slug === activeSlug
                          ? 'bg-brand-600 text-white shadow-subtle'
                          : 'bg-surface-100 text-gray-700 hover:bg-surface-200'
                      }`}
                    >
                      {rm.title}
                    </button>
                  ))}
                </div>
              )}

              {/* Roadmap Header matching Mockup 4 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E5E5E5] gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
                    {currentRoadmap.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {currentRoadmap.description}
                  </p>
                  {/* Progress Indicator */}
                  <div className="flex items-center gap-3 mt-3 text-xs font-semibold text-gray-600">
                    <span>{completedCount} of {allVideos.length} completed ({progressPct}%)</span>
                    <div className="w-32 bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSaveRoadmap(activeSlug)}
                    className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 shadow-subtle ${
                      isSaved
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-brand-600 hover:bg-brand-700 text-white'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
                    <span>{isSaved ? 'Saved to Profile' : 'Save Roadmap'}</span>
                  </button>
                </div>
              </div>

              {/* Stepper / Stage selector matching Mockup 4 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-surface-50 p-2 rounded-2xl border border-gray-200">
                {(currentRoadmap.stages || []).map((stage, idx) => {
                  const isActive = stage.id === (currentStage?.id || activeStageId);
                  const completedInStage = (stage.videos || []).filter(v => v.completed).length;
                  const isStageComplete = completedInStage > 0 && completedInStage === (stage.videos || []).length;

                  return (
                    <button
                      key={stage.id}
                      onClick={() => setActiveStageId(stage.id)}
                      className={`p-3 rounded-xl transition-all text-left flex items-center gap-3 ${
                        isActive
                          ? 'bg-white shadow-subtle border border-gray-200'
                          : 'hover:bg-white/60 text-gray-600'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        isStageComplete ? 'bg-emerald-600 text-white' :
                        isActive ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {isStageComplete ? '✓' : idx + 1}
                      </div>
                      <div className="min-w-0">
                        <span className={`block text-xs font-bold truncate ${isActive ? 'text-[#111111]' : 'text-gray-700'}`}>
                          {stage.level || stage.name}
                        </span>
                        <span className="text-[11px] text-gray-500">
                          {stage.videoCount || (stage.videos || []).length} videos
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Current Stage Section */}
              {currentStage && (
                <div className="space-y-4">
                  {/* Stage Headline & info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-gray-100 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-brand-50 text-brand-600 font-bold flex items-center justify-center text-xs">
                          {currentStage.order || 1}
                        </span>
                        <h2 className="text-lg font-bold text-[#111111]">
                          {currentStage.name}
                        </h2>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {currentStage.description}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full self-start sm:self-auto">
                      {currentStage.estimatedTime}
                    </span>
                  </div>

                  {/* Stage Video List */}
                  <div className="space-y-3">
                    {(currentStage.videos || []).map((video, idx) => {
                      const isComplete = Boolean(video.completed);
                      const videoId = video.videoId || video.id;

                      return (
                        <div
                          key={video.id || idx}
                          className={`group rounded-xl border p-4 flex flex-col sm:flex-row items-center gap-4 transition-all ${
                            isComplete
                              ? 'bg-emerald-50/20 border-emerald-200'
                              : 'bg-white border-[#E5E5E5] hover:border-gray-300 hover:shadow-subtle'
                          }`}
                        >
                          {/* Left Number / Checkbox */}
                          <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                            <span className="text-xs font-bold text-gray-400 w-4 text-center">
                              {idx + 1}
                            </span>
                            <button
                              onClick={() => handleToggleVideo(currentStage.id, videoId, isComplete)}
                              className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${
                                isComplete
                                  ? 'bg-emerald-600 border-emerald-600 text-white'
                                  : 'border-gray-300 hover:border-brand-500 bg-white'
                              }`}
                              title={isComplete ? 'Mark incomplete' : 'Mark completed'}
                            >
                              {isComplete && <Check className="w-4 h-4 stroke-[2.5]" />}
                            </button>
                          </div>

                          {/* Full Color Thumbnail */}
                          <div
                            onClick={() => navigate(`/video/${videoId}`)}
                            className="relative w-full sm:w-36 aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0 cursor-pointer"
                          >
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                              {video.duration}
                            </div>
                          </div>

                          {/* Video Info */}
                          <div
                            onClick={() => navigate(`/video/${videoId}`)}
                            className="flex-1 min-w-0 cursor-pointer"
                          >
                            <h4 className={`text-sm sm:text-base font-bold group-hover:text-brand-600 transition-colors line-clamp-2 ${
                              isComplete ? 'line-through text-gray-500' : 'text-[#111111]'
                            }`}>
                              {video.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                              <span className="font-medium text-gray-700">{video.channelTitle}</span>
                              <span>•</span>
                              <span>{video.viewsFormatted}</span>
                              <span>•</span>
                              <span>{video.timeAgo}</span>
                            </div>
                          </div>

                          {/* Quality Score & Must Watch Badge matching Mockup */}
                          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                            <div className="text-right">
                              <div className="text-base font-black text-emerald-600">
                                {video.qualityScore}/100
                              </div>
                            </div>
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                              video.badge === 'Must Watch'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-gray-100 text-gray-700 border-gray-200'
                            }`}>
                              {video.badge || 'Recommended'}
                            </span>
                            <button
                              onClick={() => navigate(`/video/${videoId}`)}
                              className="p-2 rounded-lg bg-surface-100 hover:bg-brand-50 text-gray-600 hover:text-brand-600 transition-colors"
                              title="Watch & Analyze"
                            >
                              <Play className="w-4 h-4 fill-current" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

