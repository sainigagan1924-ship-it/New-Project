import express from 'express';
import { getAllRoadmaps, getRoadmapBySlug, toggleVideoCompletion } from '../controllers/roadmapController.js';

const router = express.Router();

router.get('/', getAllRoadmaps);
router.get('/:slug', getRoadmapBySlug);
router.post('/:slug/toggle', toggleVideoCompletion);

export default router;

