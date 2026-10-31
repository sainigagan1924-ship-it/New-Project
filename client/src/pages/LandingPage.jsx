import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, BookOpen, Layers, CheckCircle, BarChart3, ArrowRight, ShieldCheck, Play, Award, Compass, HeartHandshake } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useApp } from '../context/AppContext';

export function LandingPage() {
  const navigate = useNavigate();
  const { setSearchQuery } = useApp();
  const [localQuery, setLocalQuery] = useState('');

  const popularTopics = [
    'Java Spring Boot',
    'React.js',
    'Data Structures',
    'Machine Learning',
    'System Design'
  ];

  function handleSearch(e) {
    e.preventDefault();
    const query = localQuery.trim() || 'Java Spring Boot';
    setSearchQuery(query);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  }

  function handleTopicClick(topic) {
    setSearchQuery(topic);
    navigate(`/search?q=${encodeURIComponent(topic)}`);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Dark Hero Section matching Mockup 1 */}
      <div className="bg-[#0B0F19] text-white">
        <Navbar variant="dark" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 lg:pt-20 lg:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Headline & Search */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span>Next-Gen Educational Search</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-400">Best</span> Video to Learn Anything
              </h1>

              <p className="text-base sm:text-lg text-gray-300 max-w-xl font-normal leading-relaxed">
                AI-powered recommendations that analyze content, comments, and real learning value — not just views.
              </p>

              {/* Large Search Bar */}
              <form onSubmit={handleSearch} className="relative max-w-xl flex items-center">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                    placeholder="What do you want to learn?"
                    className="w-full pl-11 pr-32 py-3.5 bg-white text-[#111111] placeholder-gray-400 rounded-xl text-base shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 bottom-2 px-6 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm rounded-lg transition-colors flex items-center gap-1.5 shadow-subtle"
                  >
                    <span>Search</span>
                  </button>
                </div>
              </form>

              {/* Popular Search Topics */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-gray-400 font-medium mr-1">Try these topics:</span>
                {popularTopics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => handleTopicClick(topic)}
                    className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-200 border border-white/10 transition-colors font-medium cursor-pointer"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Hero Visual Card with Floating AI Analysis */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Card with Real Video Thumbnail */}
                <div className="bg-[#151D2F] border border-gray-800 rounded-2xl p-4 shadow-2xl overflow-hidden group">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-900 border border-gray-800">
                    <img
                      src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=640&auto=format&fit=crop&q=80"
                      alt="Complete Java Course"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-between p-4">
                      <span className="self-start text-[11px] font-bold bg-amber-500/90 text-black px-2 py-0.5 rounded shadow">
                        For Beginners
                      </span>
                      <div>
                        <span className="text-xs text-gray-300 font-medium">8 Hours Masterclass</span>
                        <h4 className="text-white text-base font-bold line-clamp-1">Complete Java Course</h4>
                      </div>
                    </div>
                    {/* Play Button Indicator */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/90 text-brand-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating AI Analysis Card (from Mockup) */}
                <div className="absolute -bottom-6 -right-2 sm:-right-6 bg-white text-[#111111] p-4 rounded-xl shadow-2xl border border-gray-200 w-64 animate-fade-in">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-brand-600" />
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-800">AI Analysis</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      92/100
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-gray-700">
                      <span className="text-gray-500">Content Quality</span>
                      <span className="font-semibold text-gray-900">92/100</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }} />
                    </div>

                    <div className="flex justify-between items-center text-gray-700 pt-1">
                      <span className="text-gray-500">Teaching Clarity</span>
                      <span className="font-semibold text-gray-900">89/100</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '89%' }} />
                    </div>

                    <div className="flex justify-between items-center text-gray-700 pt-1">
                      <span className="text-gray-500">Comment Sentiment</span>
                      <span className="font-semibold text-gray-900">85/100</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '85%' }} />
                    </div>

                    <div className="flex justify-between items-center text-gray-700 pt-1">
                      <span className="text-gray-500">Topic Coverage</span>
                      <span className="font-semibold text-gray-900">90/100</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '90%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5 Feature Cards Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-16 pt-8 border-t border-gray-800/80">
            {[
              {
                icon: Sparkles,
                title: 'AI Analysis',
                desc: 'Analyzes content & comments',
                color: 'text-purple-400 bg-purple-500/10'
              },
              {
                icon: Award,
                title: 'Quality Score',
                desc: 'Find truly useful videos',
                color: 'text-amber-400 bg-amber-500/10'
              },
              {
                icon: BookOpen,
                title: 'Personalized',
                desc: 'Based on your learning level',
                color: 'text-blue-400 bg-blue-500/10'
              },
              {
                icon: Layers,
                title: 'Learning Roadmaps',
                desc: 'Get structured playlists',
                color: 'text-emerald-400 bg-emerald-500/10'
              },
              {
                icon: CheckCircle,
                title: 'Save & Track',
                desc: 'Build your watchlist',
                color: 'text-indigo-400 bg-indigo-500/10'
              }
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 hover:border-white/20 p-4 rounded-xl transition-all"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${f.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">{f.title}</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-snug">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* White Section: Why Views & Likes Lie (Problem vs Solution) */}
      <section className="py-20 bg-white border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-2">The Quality Problem</h2>
            <h3 className="text-3xl font-extrabold text-[#111111] sm:text-4xl tracking-tight">
              Why high view counts don't equal high learning value
            </h3>
            <p className="text-gray-600 text-base mt-4">
              YouTube algorithms optimize for clicks, watch time, and clickbait thumbnails. StudyTube reads actual student comments, detects outdated syntax, and evaluates pedagogical depth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Standard YouTube card */}
            <div className="border border-red-200 bg-red-50/20 rounded-2xl p-6 relative">
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-100 px-2.5 py-1 rounded-md">
                Standard YouTube Search
              </span>
              <ul className="mt-5 space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span><strong>Ranked by clickbait:</strong> sensational titles receive top ranking regardless of educational depth.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span><strong>Hidden outdated code:</strong> 3-year-old videos with broken libraries still rank #1.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span><strong>Superficial comments:</strong> "Nice video!" masks unresolved student confusion.</span>
                </li>
              </ul>
            </div>

            {/* StudyTube AI card */}
            <div className="border border-emerald-300 bg-emerald-50/30 rounded-2xl p-6 relative shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md">
                StudyTube AI Engine
              </span>
              <ul className="mt-5 space-y-3 text-sm text-gray-800">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span><strong>16-parameter scoring:</strong> teaching clarity, practical projects, and code accuracy weighted fairly.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span><strong>Comment intelligence:</strong> community bug corrections, confusion flags, and spam filtering.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span><strong>Structured roadmaps:</strong> ordered playlists tailored for beginners, intermediate, and advanced learners.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Structured Roadmaps Section */}
      <section className="py-20 bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-600">Curated Curriculums</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mt-1">
                Explore Structured Learning Roadmaps
              </h3>
              <p className="text-sm text-gray-600 mt-2">
                Don't piece together random videos. Follow quality-ranked milestone playlists.
              </p>
            </div>
            <button
              onClick={() => navigate('/roadmaps')}
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              <span>View All Roadmaps</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                slug: 'java-spring-boot',
                title: 'Java Spring Boot Learning Roadmap',
                desc: 'A structured playlist to take you from beginner to advanced level with enterprise projects.',
                hours: '32 hours',
                videos: '21 videos',
                badge: 'Most Popular',
                tag: 'Backend'
              },
              {
                slug: 'react-fullstack',
                title: 'React 19 & Modern Frontend Architecture',
                desc: 'From core JSX and hooks to TanStack Query, Zustand, Next.js Server Actions, and deployment.',
                hours: '28 hours',
                videos: '18 videos',
                badge: 'Updated 2025',
                tag: 'Frontend'
              },
              {
                slug: 'dsa-leetcode',
                title: 'Data Structures & Algorithmic Patterns',
                desc: 'Visual animations and pattern-based LeetCode mastery covering trees, graphs, and DP.',
                hours: '40 hours',
                videos: '24 videos',
                badge: 'Interview Prep',
                tag: 'Computer Science'
              }
            ].map((rm) => (
              <div
                key={rm.slug}
                onClick={() => navigate(`/roadmaps?slug=${rm.slug}`)}
                className="bg-white rounded-xl border border-[#E5E5E5] p-6 hover:shadow-card hover:border-gray-300 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-100">
                      {rm.tag}
                    </span>
                    <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {rm.badge}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-[#111111] hover:text-brand-600 transition-colors">
                    {rm.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 mt-2 line-clamp-2">
                    {rm.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                  <span>{rm.videos} • {rm.hours}</span>
                  <span className="text-brand-600 font-semibold flex items-center gap-1">
                    Open Roadmap →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5E5E5] py-12 text-sm text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-gray-900">
            <span className="text-brand-600">StudyTube</span> — AI-Powered Video Recommendation Platform
          </div>
          <p className="text-xs text-gray-500">
            Evaluating educational content by actual learning value, technical accuracy, and community feedback.
          </p>
        </div>
      </footer>
    </div>
  );
}

