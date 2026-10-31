import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Compass, Map, Bookmark, History, RotateCcw, Settings, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Sidebar({ filters = {}, onFilterChange = () => {}, showFilters = false }) {
  const location = useLocation();
  const { setIsSettingsModalOpen, user } = useApp();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Explore', path: '/explore', icon: Compass },
    { label: 'Roadmaps', path: '/roadmaps', icon: Map },
    { label: 'Watchlist', path: '/saved', icon: Bookmark },
    { label: 'History', path: '/saved?tab=history', icon: History },
  ];

  function handleLevelChange(level) {
    onFilterChange({
      ...filters,
      level: filters.level === level ? 'all' : level
    });
  }

  function handleDurationChange(duration) {
    onFilterChange({
      ...filters,
      duration: filters.duration === duration ? 'all' : duration
    });
  }

  function handleFeatureToggle(feature) {
    const current = filters.features || [];
    const next = current.includes(feature)
      ? current.filter(f => f !== feature)
      : [...current, feature];
    onFilterChange({ ...filters, features: next });
  }

  function resetFilters() {
    onFilterChange({
      level: 'all',
      duration: 'all',
      courseType: 'all',
      features: []
    });
  }

  const hasActiveFilters = (filters.level && filters.level !== 'all') ||
    (filters.duration && filters.duration !== 'all') ||
    (filters.features && filters.features.length > 0);

  return (
    <aside className="w-64 shrink-0 border-r border-[#E5E5E5] bg-white min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between select-none">
      <div className="space-y-6">
        {/* Core Nav list */}
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path.includes('?') && location.search.includes(item.path.split('?')[1]));
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-600 font-semibold'
                    : 'text-gray-600 hover:text-[#111111] hover:bg-surface-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-gray-500'}`} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Filter Section (when on Search page) */}
        {showFilters && (
          <div className="pt-4 border-t border-[#E5E5E5] space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Filters</span>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1 font-medium"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>

            {/* Learning Level */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2.5">
                Learning Level
              </label>
              <div className="space-y-2 text-sm">
                {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => {
                  const isChecked = filters.level === lvl;
                  return (
                    <label
                      key={lvl}
                      onClick={() => handleLevelChange(lvl)}
                      className="flex items-center gap-2.5 cursor-pointer text-gray-700 hover:text-[#111111]"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="w-4 h-4 rounded text-brand-600 border-gray-300 focus:ring-brand-500 cursor-pointer"
                      />
                      <span>{lvl}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2.5">
                Duration
              </label>
              <div className="space-y-2 text-sm">
                {[
                  { id: 'all', label: 'Any duration' },
                  { id: '0-10', label: '0 – 10 minutes' },
                  { id: '10-30', label: '10 – 30 minutes' },
                  { id: '30+', label: '30+ minutes' }
                ].map((dur) => {
                  const isSelected = (filters.duration || 'all') === dur.id;
                  return (
                    <label
                      key={dur.id}
                      onClick={() => handleDurationChange(dur.id)}
                      className="flex items-center gap-2.5 cursor-pointer text-gray-700 hover:text-[#111111]"
                    >
                      <input
                        type="radio"
                        name="duration"
                        checked={isSelected}
                        onChange={() => {}}
                        className="w-4 h-4 text-brand-600 border-gray-300 focus:ring-brand-500 cursor-pointer"
                      />
                      <span>{dur.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Features */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2.5">
                Features
              </label>
              <div className="space-y-2 text-sm">
                {[
                  { id: 'practical', label: 'Practical examples' },
                  { id: 'project', label: 'Includes project' },
                  { id: 'latest', label: 'Latest (last 2 years)' },
                  { id: 'hd', label: 'High quality audio/video' }
                ].map((feat) => {
                  const isChecked = (filters.features || []).includes(feat.id);
                  return (
                    <label
                      key={feat.id}
                      onClick={() => handleFeatureToggle(feat.id)}
                      className="flex items-center gap-2.5 cursor-pointer text-gray-700 hover:text-[#111111]"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="w-4 h-4 rounded text-brand-600 border-gray-300 focus:ring-brand-500 cursor-pointer"
                      />
                      <span>{feat.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* My Learning group if on roadmaps or saved */}
        {!showFilters && (
          <div className="pt-4 border-t border-[#E5E5E5] space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">My Learning</span>
            <div className="space-y-1 text-sm">
              <Link to="/roadmaps" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-black hover:bg-surface-50 rounded-lg">
                <Map className="w-4 h-4 text-gray-400" />
                My Roadmaps
              </Link>
              <Link to="/saved" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-black hover:bg-surface-50 rounded-lg">
                <Bookmark className="w-4 h-4 text-gray-400" />
                Saved Videos
              </Link>
              <Link to="/saved?tab=completed" className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-black hover:bg-surface-50 rounded-lg">
                <span className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-[10px]">✓</span>
                Completed
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Account bottom bar */}
      <div className="pt-4 border-t border-[#E5E5E5] space-y-1">
        <button
          onClick={() => setIsSettingsModalOpen(true)}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:text-black hover:bg-surface-50 rounded-lg transition-colors text-left"
        >
          <Settings className="w-4 h-4 text-gray-400" />
          Settings
        </button>
      </div>
    </aside>
  );
}

