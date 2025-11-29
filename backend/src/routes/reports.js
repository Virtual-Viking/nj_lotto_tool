import express from 'express';
import { getReports, getReport, createReport, updateReport, deleteReport } from '../controllers/reportController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/', getReports);
router.get('/:id', getReport);
router.post('/', createReport);
router.put('/:id', updateReport);
router.delete('/:id', deleteReport);

export default router;

