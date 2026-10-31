import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Code, Server, Cpu, Database, Cloud, Terminal, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useApp } from '../context/AppContext';

export function ExplorePage() {
  const navigate = useNavigate();
  const { setSearchQuery } = useApp();

  const categories = [
    {
      title: 'Backend Engineering',
      icon: Server,
      topics: ['Java Spring Boot', 'Node.js & Express', 'Go Microservices', 'Django REST Framework', 'GraphQL APIs'],
      badge: 'High Demand'
    },
    {
      title: 'Modern Frontend & UI',
      icon: Code,
      topics: ['React 19 & Next.js', 'TypeScript', 'Tailwind CSS', 'Vue 3 & Nuxt', 'Web Performance'],
      badge: 'Popular'
    },
    {
      title: 'Data Structures & Algorithms',
      icon: Terminal,
      topics: ['Dynamic Programming', 'Graph Theory', 'Binary Trees', 'System Design Interview', 'LeetCode Patterns'],
      badge: 'Essential'
    },
    {
      title: 'AI & Machine Learning',
      icon: Cpu,
      topics: ['PyTorch Deep Learning', 'Large Language Models (LLMs)', 'Computer Vision', 'LangChain & RAG', 'Reinforcement Learning'],
      badge: 'Trending'
    },
    {
      title: 'DevOps & Cloud Architecture',
      icon: Cloud,
      topics: ['Docker & Kubernetes', 'AWS Solutions Architecture', 'Terraform CI/CD', 'Kafka Event Streaming', 'Linux Internals'],
      badge: 'Enterprise'
    },
    {
      title: 'Database & Data Engineering',
      icon: Database,
      topics: ['PostgreSQL Optimization', 'MongoDB Masterclass', 'Redis Caching', 'Apache Spark', 'Data Warehousing'],
      badge: 'Core'
    }
  ];

  function handleSelectTopic(topic) {
    setSearchQuery(topic);
    navigate(`/search?q=${encodeURIComponent(topic)}`);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar variant="light" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold mb-2">
            <Compass className="w-3.5 h-3.5" />
            Curated Educational Taxonomy
          </div>
          <h1 className="text-3xl font-extrabold text-[#111111] tracking-tight">
            Explore Quality-Verified Topics
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse structured domains and let StudyTube's 16-parameter scoring engine surface the highest value tutorials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E5E5E5] p-6 hover:shadow-card hover:border-gray-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center text-[#111111]">
                      <Icon className="w-5 h-5 text-brand-600" />
                    </div>
                    <span className="text-[11px] font-bold text-gray-600 bg-surface-100 px-2.5 py-0.5 rounded-full">
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#111111] mb-3">
                    {cat.title}
                  </h3>

                  <div className="space-y-1.5">
                    {cat.topics.map((t) => (
                      <button
                        key={t}
                        onClick={() => handleSelectTopic(t)}
                        className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:text-brand-600 hover:bg-brand-50/60 transition-colors flex items-center justify-between group"
                      >
                        <span>{t}</span>
                        <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

