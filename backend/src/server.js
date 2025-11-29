import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import authRoutes from './routes/auth.js';
import ticketRoutes from './routes/tickets.js';
import employeeRoutes from './routes/employees.js';
import reportRoutes from './routes/reports.js';
import backupRoutes from './routes/backups.js';
import summaryRoutes from './routes/summaries.js';
import { createBackupsForAllUsers, cleanupOldBackups } from './services/backupService.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/backups', backupRoutes);
app.use('/api/summaries', summaryRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Setup automatic backup cron job
if (process.env.BACKUP_ENABLED === 'true') {
  const backupSchedule = process.env.BACKUP_SCHEDULE || '0 2 * * *'; // Default: 2 AM daily
  const retentionDays = parseInt(process.env.BACKUP_RETENTION_DAYS) || 30;

  cron.schedule(backupSchedule, async () => {
    console.log('Running scheduled backup...');
    try {
      await createBackupsForAllUsers();
      await cleanupOldBackups(retentionDays);
      console.log('Scheduled backup completed successfully');
    } catch (error) {
      console.error('Scheduled backup failed:', error);
    }
  });

  console.log(`Automatic backup scheduled: ${backupSchedule}`);
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  if (process.env.BACKUP_ENABLED === 'true') {
    console.log('Automatic backups: ENABLED');
  }
});

