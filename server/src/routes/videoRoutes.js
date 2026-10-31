import express from 'express';
import { getVideoAnalysis } from '../controllers/videoController.js';

const router = express.Router();

router.get('/:videoId/analysis', getVideoAnalysis);

export default router;

