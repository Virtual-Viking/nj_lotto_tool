import express from 'express';
import { getDailySummary, getWeeklySummary, getMonthlySummary, getCustomSummary } from '../controllers/summaryController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/daily', getDailySummary);
router.get('/weekly', getWeeklySummary);
router.get('/monthly', getMonthlySummary);
router.get('/custom', getCustomSummary);

export default router;

