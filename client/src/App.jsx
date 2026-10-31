import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { LandingPage } from './pages/LandingPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { VideoAnalysisPage } from './pages/VideoAnalysisPage';
import { RoadmapsPage } from './pages/RoadmapsPage';
import { SavedPage } from './pages/SavedPage';
import { ExplorePage } from './pages/ExplorePage';
import { SettingsModal } from './components/SettingsModal';
import { AuthModal } from './components/AuthModal';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/video/:videoId" element={<VideoAnalysisPage />} />
          <Route path="/roadmaps" element={<RoadmapsPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/explore" element={<ExplorePage />} />
        </Routes>
        <SettingsModal />
        <AuthModal />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;

