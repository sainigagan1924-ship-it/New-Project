import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Bookmark,
  Play,
  Trash2,
  CheckCircle2,
  Clock,
  Map,
  FolderPlus,
  Plus,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { useApp } from '../context/AppContext';

export function SavedPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'saved'; // 'saved', 'roadmaps', 'completed'
  const navigate = useNavigate();

  const { savedVideos, toggleSaveVideo, savedRoadmapSlugs, toggleSaveRoadmap, showToast, user } = useApp();
  const [selectedPlaylist, setSelectedPlaylist] = useState('all');
  const [isNewPlaylistModalOpen, setIsNewPlaylistModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [customPlaylists, setCustomPlaylists] = useState(['Backend Mastery', 'Algorithms 2025']);

  const completedVideos = savedVideos.filter(v => v.completed);
  const inProgressVideos = savedVideos.filter(v => !v.completed);

  // Resume item
  const continueVideo = inProgressVideos[0] || savedVideos[0];

  function handleCreatePlaylist(e) {
    e.preventDefault();
    if (newPlaylistName.trim() && !customPlaylists.includes(newPlaylistName.trim())) {
      setCustomPlaylists([...customPlaylists, newPlaylistName.trim()]);
      setSelectedPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setIsNewPlaylistModalOpen(false);
      showToast('Playlist created!');
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar variant="light" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full flex">
        {/* Left Sidebar */}
        <div className="hidden md:block">
          <Sidebar showFilters={false} />
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0 py-6 md:px-8 space-y-8">
          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E5E5E5] gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
                My Learning Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Manage your saved videos, custom playlists, and active learning roadmaps
              </p>
            </div>

            <button
              onClick={() => setIsNewPlaylistModalOpen(true)}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-subtle transition-colors self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>New Playlist</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-gray-200 bg-surface-50">
              <span className="text-xs font-medium text-gray-500">Saved Videos</span>
              <div className="text-2xl font-bold text-gray-900 mt-1">{savedVideos.length}</div>
            </div>
            <div className="p-4 rounded-xl border border-gray-200 bg-surface-50">
              <span className="text-xs font-medium text-gray-500">Active Roadmaps</span>
              <div className="text-2xl font-bold text-gray-900 mt-1">{savedRoadmapSlugs.length}</div>
            </div>
            <div className="p-4 rounded-xl border border-gray-200 bg-surface-50">
              <span className="text-xs font-medium text-gray-500">Completed Modules</span>
              <div className="text-2xl font-bold text-emerald-600 mt-1">{completedVideos.length}</div>
            </div>
            <div className="p-4 rounded-xl border border-gray-200 bg-surface-50">
              <span className="text-xs font-medium text-gray-500">Estimated Study Hours</span>
              <div className="text-2xl font-bold text-brand-600 mt-1">24h</div>
            </div>
          </div>

          {/* Continue Learning Banner */}
          {continueVideo && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-gray-900 via-[#151D2F] to-[#1E1B4B] text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-md">
              <div className="flex items-center gap-4">
                <div className="relative w-28 aspect-video rounded-lg overflow-hidden shrink-0 border border-white/20">
                  <img
                    src={continueVideo.thumbnail}
                    alt={continueVideo.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Play className="w-6 h-6 fill-white text-white opacity-90" />
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    Continue Learning
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-white line-clamp-1 mt-0.5">
                    {continueVideo.title}
                  </h4>
                  <p className="text-xs text-gray-300 mt-0.5">
                    {continueVideo.channelTitle} • {continueVideo.duration}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate(`/video/${continueVideo.videoId || continueVideo.id}`)}
                className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs rounded-xl shadow-subtle shrink-0 transition-colors"
              >
                Resume Video
              </button>
            </div>
          )}

          {/* Tabs */}
          <div className="flex items-center border-b border-[#E5E5E5] gap-6 text-sm font-semibold">
            {[
              { id: 'saved', label: `Saved Videos (${savedVideos.length})` },
              { id: 'roadmaps', label: `Saved Roadmaps (${savedRoadmapSlugs.length})` },
              { id: 'completed', label: `Completed (${completedVideos.length})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSearchParams({ tab: tab.id })}
                className={`pb-3 border-b-2 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-brand-600 text-brand-600 font-bold'
                    : 'border-transparent text-gray-500 hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: Saved Videos */}
          {activeTab === 'saved' && (
            <div className="space-y-4">
              {/* Filter by playlist */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setSelectedPlaylist('all')}
                  className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-colors ${
                    selectedPlaylist === 'all'
                      ? 'bg-[#111111] text-white'
                      : 'bg-surface-100 text-gray-700 hover:bg-surface-200'
                  }`}
                >
                  All Videos
                </button>
                {customPlaylists.map(pl => (
                  <button
                    key={pl}
                    onClick={() => setSelectedPlaylist(pl)}
                    className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-colors ${
                      selectedPlaylist === pl
                        ? 'bg-[#111111] text-white'
                        : 'bg-surface-100 text-gray-700 hover:bg-surface-200'
                    }`}
                  >
                    {pl}
                  </button>
                ))}
              </div>

              {savedVideos.length === 0 ? (
                <div className="p-12 text-center bg-surface-50 rounded-2xl border border-gray-200">
                  <Bookmark className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-gray-900">No saved videos yet</h3>
                  <p className="text-xs text-gray-500 mt-1">Discover top-rated educational videos and click Save.</p>
                  <Link
                    to="/search"
                    className="mt-4 inline-block px-4 py-2 bg-brand-600 text-white text-xs font-semibold rounded-lg hover:bg-brand-700"
                  >
                    Explore Videos
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedVideos
                    .filter(v => selectedPlaylist === 'all' || v.playlistName === selectedPlaylist)
                    .map((item) => (
                      <div
                        key={item.id || item.videoId}
                        className="bg-white rounded-xl border border-[#E5E5E5] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 hover:shadow-subtle transition-all"
                      >
                        <div
                          onClick={() => navigate(`/video/${item.videoId}`)}
                          className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer"
                        >
                          <div className="relative w-36 aspect-video rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                            <img
                              src={item.thumbnail}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
                              {item.duration}
                            </div>
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-[#111111] hover:text-brand-600 transition-colors line-clamp-2">
                              {item.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                              <span>{item.channelTitle}</span>
                              <span>•</span>
                              <span className="text-brand-600 font-semibold">{item.playlistName || 'Watch Later'}</span>
                            </div>
                            {item.notes && (
                              <p className="text-xs text-gray-600 italic mt-1 line-clamp-1 bg-surface-50 px-2 py-0.5 rounded border border-gray-100">
                                Note: {item.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
                            {item.qualityScore || 85}/100 {item.classification || 'Very Good'}
                          </span>
                          <button
                            onClick={() => toggleSaveVideo(item)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="Remove from saved"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Saved Roadmaps */}
          {activeTab === 'roadmaps' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedRoadmapSlugs.map(slug => (
                <div
                  key={slug}
                  onClick={() => navigate(`/roadmaps?slug=${slug}`)}
                  className="bg-white rounded-xl border border-[#E5E5E5] p-5 hover:border-brand-500 hover:shadow-card transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-100">
                        Active Roadmap
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveRoadmap(slug);
                        }}
                        className="text-gray-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="text-lg font-bold text-[#111111] hover:text-brand-600 transition-colors">
                      {slug === 'java-spring-boot' ? 'Java Spring Boot Learning Roadmap' : 'React & Frontend Roadmap'}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      Structured milestone playlist from beginner fundamentals to enterprise projects.
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-semibold">
                    <span>4 Stages • 21 Videos</span>
                    <span className="text-brand-600 flex items-center gap-1">Open Roadmap →</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Completed Videos */}
          {activeTab === 'completed' && (
            <div className="space-y-3">
              {completedVideos.length === 0 ? (
                <div className="p-12 text-center bg-surface-50 rounded-2xl border border-gray-200">
                  <CheckCircle2 className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-gray-900">No completed videos yet</h3>
                  <p className="text-xs text-gray-500 mt-1">Mark videos as watched in your roadmaps to celebrate progress!</p>
                </div>
              ) : (
                completedVideos.map(video => (
                  <div key={video.videoId || video.id} className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">✓</div>
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{video.title}</h4>
                        <span className="text-xs text-gray-500">{video.channelTitle} • Completed</span>
                      </div>
                    </div>
                    <Link to={`/video/${video.videoId || video.id}`} className="text-xs font-bold text-brand-600 hover:underline">
                      Review
                    </Link>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>

      {/* New Playlist Modal */}
      {isNewPlaylistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-gray-200 shadow-2xl">
            <h3 className="text-base font-bold text-gray-900">Create New Playlist</h3>
            <p className="text-xs text-gray-500 mt-1">Organize your saved videos into custom learning collections.</p>
            <form onSubmit={handleCreatePlaylist} className="mt-4 space-y-3">
              <input
                type="text"
                required
                placeholder="e.g. Distributed Systems Masterclass"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewPlaylistModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-gray-600 hover:text-black font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-brand-600 text-white text-xs font-semibold rounded-lg hover:bg-brand-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

