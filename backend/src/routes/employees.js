import express from 'express';
import { getEmployees, addEmployee, deleteEmployee } from '../controllers/employeeController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/', getEmployees);
router.post('/', addEmployee);
router.delete('/:id', deleteEmployee);

export default router;

