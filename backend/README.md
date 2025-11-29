# NJ Lottery Tool - Backend API

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database running
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory (copy from `.env.example`):
```env
PORT=3001
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/nj_lotto_db?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
BACKUP_ENABLED=true
BACKUP_RETENTION_DAYS=30
BACKUP_SCHEDULE="0 2 * * *"
FRONTEND_URL=http://localhost:5173
```

3. Set up the database:
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view data
npm run prisma:studio
```

4. Start the server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Tickets
- `GET /api/tickets` - Get user's ticket configuration
- `POST /api/tickets` - Update ticket configuration
- `GET /api/tickets/state` - Get ticket states
- `PUT /api/tickets/state` - Update ticket states

### Employees
- `GET /api/employees` - Get user's employees
- `POST /api/employees` - Add employee
- `DELETE /api/employees/:id` - Remove employee

### Reports
- `GET /api/reports` - Get all reports (with optional query params: startDate, endDate, limit)
- `GET /api/reports/:id` - Get single report
- `POST /api/reports` - Create report
- `PUT /api/reports/:id` - Update report
- `DELETE /api/reports/:id` - Delete report

### Backups
- `GET /api/backups` - Get backup history
- `POST /api/backups/create` - Create manual backup
- `GET /api/backups/:id/download` - Download backup as JSON

### Summaries
- `GET /api/summaries/daily?date=YYYY-MM-DD` - Daily summary
- `GET /api/summaries/weekly?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - Weekly summary
- `GET /api/summaries/monthly?year=YYYY&month=MM` - Monthly summary
- `GET /api/summaries/custom?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - Custom date range summary

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Automatic Backups

The system automatically creates backups daily at 2 AM (configurable via `BACKUP_SCHEDULE`). Old backups are automatically deleted based on `BACKUP_RETENTION_DAYS` (default: 30 days).

## Database Schema

See `prisma/schema.prisma` for the complete database schema.

## Development

- Use `npm run dev` for development with auto-reload
- Use `npm run prisma:studio` to view/edit database data
- Check logs for errors and debugging information

