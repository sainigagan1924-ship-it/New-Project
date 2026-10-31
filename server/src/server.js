import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { connectDB, isDbConnected } from './models/db.js';
import searchRoutes from './routes/searchRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';
import savedRoutes from './routes/savedRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'StudyTube API',
    database: isDbConnected() ? 'connected' : 'in-memory-fallback',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/search', searchRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/settings', settingsRoutes);

// Error handling
app.use(errorHandler);

// Start Server
async function start() {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`🚀 StudyTube API server running on http://localhost:${config.port}`);
  });
}

start();

