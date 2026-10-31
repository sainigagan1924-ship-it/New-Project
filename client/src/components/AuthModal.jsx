import React, { useState } from 'react';
import { X, PlaySquare, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, setUser, showToast } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  if (!isAuthModalOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    const displayName = isLogin ? (email ? email.split('@')[0] : 'Alex Johnson') : (name || 'New Learner');
    setUser({
      name: displayName,
      email: email || 'learner@studytube.io',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`,
      preferredLevel: 'Beginner'
    });
    showToast(`Welcome ${displayName}!`, 'success');
    setIsAuthModalOpen(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full border border-gray-200 shadow-2xl overflow-hidden p-6 relative">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-1 rounded-md text-gray-400 hover:text-black hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
            <PlaySquare className="w-4 h-4 fill-white/20" />
          </div>
          <span className="font-bold text-lg">Study<span className="text-brand-600">Tube</span></span>
        </div>

        <h3 className="text-xl font-bold text-[#111111]">
          {isLogin ? 'Sign in to StudyTube' : 'Create your StudyTube account'}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {isLogin ? 'Access your saved videos, roadmaps, and tracked learning progress.' : 'Track your learning journeys with AI-verified educational video recommendations.'}
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
          {!isLogin && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="Sarah Connor"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="sarah@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              defaultValue="password123"
              className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm rounded-lg shadow-subtle flex items-center justify-center gap-2 transition-colors"
          >
            <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-brand-600 font-semibold hover:underline"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </div>
    </div>
  );
}

