import express from 'express';
import { getUserStats, getUserActivityTimeline, getComparisonStats, getUserPreferences } from '../controllers/statsController.js';
import { verifyToken } from '../middleware/auth.js';

const statsRouter = express.Router();

statsRouter.get('/user/stats', verifyToken, getUserStats);
statsRouter.get('/user/activity', verifyToken, getUserActivityTimeline);
statsRouter.get('/user/comparison', verifyToken, getComparisonStats);
statsRouter.get('/user/preferences', verifyToken, getUserPreferences);

export default statsRouter;
