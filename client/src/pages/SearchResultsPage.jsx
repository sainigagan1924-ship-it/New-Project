import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, LayoutGrid, List, SlidersHorizontal, AlertCircle, RefreshCw } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { VideoCard } from '../components/VideoCard';
import { fetchSearchResults } from '../services/api';
import { useApp } from '../context/AppContext';

export function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryParam = searchParams.get('q') || 'Java Spring Boot';

  const { searchQuery, setSearchQuery } = useApp();
  const [localSearch, setLocalSearch] = useState(queryParam);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  // Filter state
  const [filters, setFilters] = useState({
    level: searchParams.get('level') || 'all',
    duration: searchParams.get('duration') || 'all',
    courseType: 'all',
    sortBy: searchParams.get('sortBy') || 'recommended',
    features: []
  });

  useEffect(() => {
    setLocalSearch(queryParam);
    loadResults(queryParam, filters);
  }, [queryParam, filters.level, filters.duration, filters.sortBy, JSON.stringify(filters.features)]);

  async function loadResults(query, currentFilters) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchSearchResults(query, currentFilters);
      if (res.success) {
        setVideos(res.data);
      } else {
        setError(res.message || 'Failed to load results');
      }
    } catch (err) {
      setError('Could not connect to StudyTube API. Please verify the server is running.');
    } finally {
      setLoading(false);
    }
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchParams({ q: localSearch.trim() });
      setSearchQuery(localSearch.trim());
    }
  }

  function handleFilterChange(newFilters) {
    setFilters(newFilters);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar variant="light" />

      {/* Main search header on top */}
      <div className="border-b border-[#E5E5E5] bg-white sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl relative flex items-center">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search topics, frameworks, algorithms..."
                className="w-full pl-10 pr-24 py-2 bg-surface-50 border border-gray-200 rounded-lg text-sm text-[#111111] focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-medium text-xs rounded-md transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Stats or status */}
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>AI Quality Engine Active</span>
          </div>
        </div>
      </div>

      {/* Page Body with Sidebar & Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full flex">
        {/* Left Sidebar Filters */}
        <div className="hidden md:block">
          <Sidebar
            showFilters={true}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Center / Right Results List */}
        <main className="flex-1 min-w-0 py-6 md:px-8">
          {/* Header Row: Title, Subtitle, Sort by, View toggles */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#E5E5E5] gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-tight">
                Top Videos for &ldquo;{queryParam}&rdquo;
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Based on AI analysis of content, comments, and learning value
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort by dropdown */}
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span className="text-gray-500 font-medium shrink-0">Sort by:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="bg-surface-50 border border-gray-200 text-gray-800 text-xs sm:text-sm font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                >
                  <option value="recommended">Recommended</option>
                  <option value="quality">Highest Quality</option>
                  <option value="popular">Most Popular</option>
                  <option value="recent">Recently Uploaded</option>
                </select>
              </div>

              {/* View toggle (Grid / List) */}
              <div className="flex items-center border border-gray-200 rounded-lg p-0.5 bg-surface-50">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-subtle text-gray-900 font-bold' : 'text-gray-400 hover:text-gray-700'
                  }`}
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-subtle text-gray-900 font-bold' : 'text-gray-400 hover:text-gray-700'
                  }`}
                  title="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse flex flex-col md:flex-row gap-5">
                  <div className="w-full md:w-64 aspect-video bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="w-full md:w-48 space-y-2 pt-2">
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-2 bg-gray-200 rounded"></div>
                    <div className="h-2 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="p-8 text-center bg-red-50 rounded-xl border border-red-200 max-w-lg mx-auto my-8">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <h3 className="text-base font-bold text-red-900">Search Error</h3>
              <p className="text-xs text-red-700 mt-1">{error}</p>
              <button
                onClick={() => loadResults(queryParam, filters)}
                className="mt-4 px-4 py-2 bg-white text-xs font-semibold text-red-700 border border-red-300 rounded-lg hover:bg-red-50 inline-flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && videos.length === 0 && (
            <div className="p-12 text-center bg-surface-50 rounded-2xl border border-gray-200 my-8">
              <Search className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-900">No videos match your filters</h3>
              <p className="text-xs text-gray-500 mt-1">Try resetting the learning level or duration filters</p>
              <button
                onClick={() => setFilters({ level: 'all', duration: 'all', courseType: 'all', features: [], sortBy: 'recommended' })}
                className="mt-4 px-4 py-2 bg-brand-600 text-white text-xs font-semibold rounded-lg hover:bg-brand-700"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Video Results List */}
          {!loading && !error && videos.length > 0 && (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
              {videos.map((video) => (
                <VideoCard key={video.videoId || video.id} video={video} viewMode={viewMode} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

