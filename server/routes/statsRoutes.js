import express from 'express';
import { getAllUserStats, updateStatsDashboard } from '../controllers/statsController.js';
import { verifyToken } from '../middleware/auth.js';

const statsRouter = express.Router();

// Main unified endpoint for all user statistics
statsRouter.get('/user/all-stats', verifyToken, getAllUserStats);

// Socket update endpoint
statsRouter.post('/user/update-stats', verifyToken, updateStatsDashboard);

export default statsRouter;
