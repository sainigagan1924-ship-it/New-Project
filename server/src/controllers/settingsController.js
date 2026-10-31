import { config } from '../config/index.js';
import { cacheService } from '../services/cacheService.js';

export function getSettings(req, res) {
  res.json({
    success: true,
    data: {
      hasYouTubeKey: Boolean(config.youtubeApiKey),
      youtubeKeyMasked: config.youtubeApiKey ? `${config.youtubeApiKey.substring(0, 4)}...${config.youtubeApiKey.slice(-4)}` : null,
      hasOpenAIKey: Boolean(config.openaiApiKey),
      openaiKeyMasked: config.openaiApiKey ? `${config.openaiApiKey.substring(0, 3)}...${config.openaiApiKey.slice(-4)}` : null,
      nodeEnv: config.nodeEnv,
      weights: config.weights
    }
  });
}

export function updateSettings(req, res) {
  const { youtubeApiKey, openaiApiKey } = req.body;

  if (youtubeApiKey !== undefined) {
    config.youtubeApiKey = youtubeApiKey.trim();
  }
  if (openaiApiKey !== undefined) {
    config.openaiApiKey = openaiApiKey.trim();
  }

  // Clear cache on key changes
  cacheService.clear();

  res.json({
    success: true,
    message: 'Configuration updated successfully',
    data: {
      hasYouTubeKey: Boolean(config.youtubeApiKey),
      hasOpenAIKey: Boolean(config.openaiApiKey)
    }
  });
}

