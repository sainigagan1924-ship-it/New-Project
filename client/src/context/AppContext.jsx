import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchSavedItems, saveVideoItem, deleteSavedItem } from '../services/api';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('Java Spring Boot');
  const [user, setUser] = useState({
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    preferredLevel: 'Beginner'
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [savedVideos, setSavedVideos] = useState([]);
  const [savedRoadmapSlugs, setSavedRoadmapSlugs] = useState(['java-spring-boot']);
  const [toast, setToast] = useState(null);

  // Load initial saved items
  useEffect(() => {
    loadSaved();
  }, []);

  async function loadSaved() {
    try {
      const res = await fetchSavedItems();
      if (res.success && res.data) {
        setSavedVideos(res.data);
      }
    } catch (e) {
      console.warn('Could not load saved videos:', e);
    }
  }

  function showToast(message, type = 'success') {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  }

  async function toggleSaveVideo(video) {
    const videoId = video.videoId || video.id;
    const isSaved = savedVideos.some(v => v.videoId === videoId);

    if (isSaved) {
      const item = savedVideos.find(v => v.videoId === videoId);
      await deleteSavedItem(item.id || item._id || videoId);
      setSavedVideos(prev => prev.filter(v => v.videoId !== videoId));
      showToast('Removed from Watchlist', 'info');
    } else {
      const newItem = {
        videoId,
        title: video.title,
        channelTitle: video.channelTitle,
        thumbnail: video.thumbnail,
        duration: video.duration,
        viewsFormatted: video.viewsFormatted,
        qualityScore: video.qualityScore?.overallScore || video.targetScore || 88,
        classification: video.classification || 'Very Good',
        playlistName: 'Watchlist'
      };
      await saveVideoItem(newItem);
      setSavedVideos(prev => [newItem, ...prev]);
      showToast('Saved to Watchlist', 'success');
    }
  }

  function isVideoSaved(videoId) {
    return savedVideos.some(v => v.videoId === videoId);
  }

  function toggleSaveRoadmap(slug) {
    if (savedRoadmapSlugs.includes(slug)) {
      setSavedRoadmapSlugs(prev => prev.filter(s => s !== slug));
      showToast('Roadmap removed from saved', 'info');
    } else {
      setSavedRoadmapSlugs(prev => [...prev, slug]);
      showToast('Roadmap saved to profile!', 'success');
    }
  }

  return (
    <AppContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        user,
        setUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isSettingsModalOpen,
        setIsSettingsModalOpen,
        savedVideos,
        savedRoadmapSlugs,
        toggleSaveVideo,
        isVideoSaved,
        toggleSaveRoadmap,
        showToast,
        loadSaved
      }}
    >
      {children}
      {/* Toast notification banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#111111] text-white px-5 py-3 rounded-lg shadow-xl border border-gray-700 animate-slide-up text-sm font-medium">
          <span className={`w-2 h-2 rounded-full ${toast.type === 'info' ? 'bg-blue-400' : 'bg-emerald-400'}`} />
          {toast.message}
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}

