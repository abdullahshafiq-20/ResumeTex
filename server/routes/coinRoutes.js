import express from 'express'
import { coinLogController, requestCoin, approveRequest, rejectRequest } from '../controllers/coinLogController.js';
import { verifyToken } from '../middleware/auth.js';
import { coinRequestLimiter } from '../config/rateLimitter.js';

export const coinLogRouter = express.Router();

coinLogRouter.get('/coin-log', verifyToken, coinLogController);
coinLogRouter.post('/coin-request', verifyToken, coinRequestLimiter, requestCoin);
coinLogRouter.post('/approve/:requestId', verifyToken, approveRequest);
coinLogRouter.post('/reject/:requestId', verifyToken, rejectRequest);

export default coinLogRouter;
