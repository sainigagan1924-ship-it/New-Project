import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PlaySquare, Search, Bookmark, Compass, Map, Settings, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Navbar({ variant = 'light' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setIsAuthModalOpen, setIsSettingsModalOpen, searchQuery, setSearchQuery } = useApp();

  const isDark = variant === 'dark';

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Explore', path: '/explore' },
    { label: 'Roadmaps', path: '/roadmaps' },
    { label: 'Saved', path: '/saved' },
  ];

  return (
    <header className={`sticky top-0 z-40 transition-colors ${
      isDark 
        ? 'bg-[#0B0F19] text-white border-b border-gray-800/80' 
        : 'bg-white text-[#111111] border-b border-[#E5E5E5]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-subtle group-hover:scale-105 transition-transform">
            <PlaySquare className="w-5 h-5 fill-white/20 stroke-[2.2]" />
          </div>
          <span className={`font-bold text-xl tracking-tight ${isDark ? 'text-white' : 'text-[#111111]'}`}>
            Study<span className="text-brand-500">Tube</span>
          </span>
        </Link>

        {/* Center Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? isDark ? 'text-white bg-gray-800' : 'text-[#111111] bg-surface-100 font-semibold'
                    : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black hover:bg-surface-50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Quick Search Shortcut if not on landing/search */}
          {location.pathname !== '/' && location.pathname !== '/search' && (
            <button
              onClick={() => navigate('/search')}
              className={`p-2 rounded-md transition-colors ${
                isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-surface-100 text-gray-600'
              }`}
              title="Search videos"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* API Settings button */}
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className={`p-2 rounded-md transition-colors ${
              isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-surface-100 text-gray-600'
            }`}
            title="API Keys & Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User Auth or Profile */}
          {user ? (
            <div className="flex items-center gap-2.5 pl-2 border-l border-gray-200 dark:border-gray-800">
              <Link to="/saved" className="flex items-center gap-2 group">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent group-hover:ring-brand-500 transition-all"
                />
                <span className={`text-sm font-medium hidden sm:inline ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                  {user.name.split(' ')[0]}
                </span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className={`text-sm font-medium px-3.5 py-1.5 rounded-md transition-colors ${
                  isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-1.5 rounded-md shadow-subtle transition-all"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

