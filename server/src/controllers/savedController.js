import { SavedItemModel, memorySavedItems } from '../models/SavedItem.js';
import { isDbConnected } from '../models/db.js';

export async function getSavedItems(req, res, next) {
  try {
    if (isDbConnected()) {
      const items = await SavedItemModel.find({}).sort({ savedAt: -1 });
      return res.json({ success: true, data: items });
    }
    return res.json({ success: true, data: memorySavedItems });
  } catch (error) {
    next(error);
  }
}

export async function saveItem(req, res, next) {
  try {
    const { videoId, title, channelTitle, thumbnail, duration, viewsFormatted, qualityScore, classification, playlistName, notes } = req.body;

    const existingIndex = memorySavedItems.findIndex(i => i.videoId === videoId);
    if (existingIndex >= 0) {
      return res.json({ success: true, message: 'Already saved', data: memorySavedItems[existingIndex] });
    }

    const newItem = {
      id: `save_${Date.now()}`,
      _id: `save_${Date.now()}`,
      userId: 'usr_default',
      videoId,
      title: title || 'Educational Video',
      channelTitle: channelTitle || 'Channel',
      thumbnail: thumbnail || '',
      duration: duration || '00:00',
      viewsFormatted: viewsFormatted || '100K views',
      qualityScore: qualityScore || 85,
      classification: classification || 'Very Good',
      playlistName: playlistName || 'Watch Later',
      notes: notes || '',
      completed: false,
      progressSeconds: 0,
      totalSeconds: 3600,
      savedAt: new Date(),
      lastWatchedAt: new Date()
    };

    memorySavedItems.unshift(newItem);

    if (isDbConnected()) {
      try {
        await SavedItemModel.create(newItem);
      } catch (e) {
        console.warn('Could not save to MongoDB:', e.message);
      }
    }

    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    next(error);
  }
}

export async function updateSavedItem(req, res, next) {
  try {
    const { id } = req.params;
    const { notes, completed, playlistName, progressSeconds } = req.body;

    const item = memorySavedItems.find(i => i.id === id || i._id === id || i.videoId === id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    if (notes !== undefined) item.notes = notes;
    if (completed !== undefined) item.completed = completed;
    if (playlistName !== undefined) item.playlistName = playlistName;
    if (progressSeconds !== undefined) item.progressSeconds = progressSeconds;

    if (isDbConnected()) {
      try {
        await SavedItemModel.findByIdAndUpdate(item._id, item);
      } catch (e) {
        console.warn('Could not update MongoDB:', e.message);
      }
    }

    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

export async function deleteSavedItem(req, res, next) {
  try {
    const { id } = req.params;
    const index = memorySavedItems.findIndex(i => i.id === id || i._id === id || i.videoId === id);
    if (index >= 0) {
      memorySavedItems.splice(index, 1);
    }

    if (isDbConnected()) {
      try {
        await SavedItemModel.deleteOne({ $or: [{ _id: id }, { videoId: id }] });
      } catch (e) {
        console.warn('Could not delete from MongoDB:', e.message);
      }
    }

    res.json({ success: true, message: 'Item removed' });
  } catch (error) {
    next(error);
  }
}

