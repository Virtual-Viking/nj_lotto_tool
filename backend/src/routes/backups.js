import express from 'express';
import { getBackups, createBackup, downloadBackup } from '../controllers/backupController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/', getBackups);
router.post('/create', createBackup);
router.get('/:id/download', downloadBackup);

export default router;

