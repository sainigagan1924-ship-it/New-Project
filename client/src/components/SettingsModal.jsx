import React, { useState, useEffect } from 'react';
import { X, Key, Database, Sparkles, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fetchSettings, saveSettings } from '../services/api';

export function SettingsModal() {
  const { isSettingsModalOpen, setIsSettingsModalOpen, showToast } = useApp();
  const [settings, setSettings] = useState(null);
  const [youtubeKey, setYoutubeKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isSettingsModalOpen) {
      loadSettings();
    }
  }, [isSettingsModalOpen]);

  async function loadSettings() {
    try {
      const res = await fetchSettings();
      if (res.success) {
        setSettings(res.data);
      }
    } catch (e) {
      console.warn('Could not load settings:', e);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {};
      if (youtubeKey) payload.youtubeApiKey = youtubeKey;
      if (openaiKey) payload.openaiApiKey = openaiKey;

      const res = await saveSettings(payload);
      if (res.success) {
        showToast('Settings saved successfully!');
        setYoutubeKey('');
        setOpenaiKey('');
        loadSettings();
      }
    } catch (e) {
      showToast('Failed to update settings', 'info');
    } finally {
      setSaving(false);
    }
  }

  if (!isSettingsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-gray-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-surface-50">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-brand-600" />
            <h2 className="text-lg font-bold text-[#111111]">Platform & API Settings</h2>
          </div>
          <button
            onClick={() => setIsSettingsModalOpen(false)}
            className="p-1 rounded-md text-gray-400 hover:text-black hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Status Indicators */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-gray-100 bg-surface-50 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">YouTube Data API</span>
                <span className={`w-2 h-2 rounded-full ${settings?.hasYouTubeKey ? 'bg-emerald-500' : 'bg-blue-500'}`} />
              </div>
              <span className="text-xs text-gray-500">
                {settings?.hasYouTubeKey ? `Active (${settings.youtubeKeyMasked})` : 'Curated Fallback Engine Active'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-gray-100 bg-surface-50 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">OpenAI Engine</span>
                <span className={`w-2 h-2 rounded-full ${settings?.hasOpenAIKey ? 'bg-emerald-500' : 'bg-blue-500'}`} />
              </div>
              <span className="text-xs text-gray-500">
                {settings?.hasOpenAIKey ? `Active (${settings.openaiKeyMasked})` : 'Built-in Heuristic NLP Active'}
              </span>
            </div>
          </div>

          {/* Explanation note */}
          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs leading-relaxed flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
            <span>
              <strong>Zero-friction ready:</strong> StudyTube includes full real-time query engines and curated educational datasets so you can test all features right away even without API keys!
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                YouTube Data API v3 Key (Optional)
              </label>
              <input
                type="password"
                placeholder={settings?.hasYouTubeKey ? 'Replace existing key...' : 'AIzaSy...'}
                value={youtubeKey}
                onChange={(e) => setYoutubeKey(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <p className="text-[11px] text-gray-500 mt-1">Used to query live YouTube search, video metrics & comments</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                OpenAI API Key (Optional)
              </label>
              <input
                type="password"
                placeholder={settings?.hasOpenAIKey ? 'Replace existing key...' : 'sk-...'}
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <p className="text-[11px] text-gray-500 mt-1">Used for deep GPT-4o-mini comment categorization & summaries</p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={saving || (!youtubeKey && !openaiKey)}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors shadow-subtle"
              >
                {saving ? 'Updating...' : 'Save Keys'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

