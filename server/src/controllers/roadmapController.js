import { RoadmapModel, defaultRoadmaps, memoryRoadmaps } from '../models/Roadmap.js';
import { isDbConnected } from '../models/db.js';

export async function getAllRoadmaps(req, res, next) {
  try {
    if (isDbConnected()) {
      const roadmaps = await RoadmapModel.find({});
      if (roadmaps.length > 0) {
        return res.json({ success: true, data: roadmaps });
      }
    }
    return res.json({ success: true, data: Array.from(memoryRoadmaps.values()) });
  } catch (error) {
    next(error);
  }
}

export async function getRoadmapBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    let roadmap = null;

    if (isDbConnected()) {
      roadmap = await RoadmapModel.findOne({ slug });
    }
    if (!roadmap) {
      roadmap = memoryRoadmaps.get(slug) || defaultRoadmaps[0];
    }

    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found' });
    }

    res.json({ success: true, data: roadmap });
  } catch (error) {
    next(error);
  }
}

export async function toggleVideoCompletion(req, res, next) {
  try {
    const { slug } = req.params;
    const { stageId, videoId, completed } = req.body;

    const roadmap = memoryRoadmaps.get(slug);
    if (roadmap) {
      const stage = roadmap.stages.find(s => s.id === stageId);
      if (stage) {
        const video = stage.videos.find(v => v.videoId === videoId || v.id === videoId);
        if (video) {
          video.completed = completed !== undefined ? completed : !video.completed;
        }
      }
      return res.json({ success: true, data: roadmap });
    }

    res.json({ success: true, message: 'Updated' });
  } catch (error) {
    next(error);
  }
}

