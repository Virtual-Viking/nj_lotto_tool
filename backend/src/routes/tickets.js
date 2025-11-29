import express from 'express';
import { getTickets, updateTickets, getTicketStates, updateTicketStates } from '../controllers/ticketController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/', getTickets);
router.post('/', updateTickets);
router.get('/state', getTicketStates);
router.put('/state', updateTicketStates);

export default router;

