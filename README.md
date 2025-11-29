# NJ Lottery Tool - Full Stack Application

A comprehensive lottery management system for tracking daily shifts, ticket sales, and generating reports.

## Architecture

This application has been refactored from a single-file client-side application to a full-stack application with:

- **Backend**: Node.js + Express + PostgreSQL + Prisma ORM
- **Frontend**: React + Vite + Tailwind CSS
- **Authentication**: JWT-based authentication
- **Database**: PostgreSQL with automatic backups
- **Summary System**: Daily, weekly, monthly, and custom summaries

## Project Structure

```
nj_lotto_tool/
├── backend/           # Node.js/Express API
│   ├── src/
│   │   ├── config/    # Database configuration
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Auth & validation
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── utils/        # Utility functions
│   └── prisma/        # Database schema & migrations
├── frontend/          # React application
│   └── src/
│       ├── components/   # React components
│       ├── contexts/     # React contexts
│       ├── pages/        # Page components
│       ├── services/     # API clients
│       └── utils/        # Utility functions
└── ARCHITECTURE.md    # Detailed architecture documentation
```

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
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

4. Set up database:
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Start backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create `.env` file:
```env
VITE_API_URL=http://localhost:3001/api
```

4. Start frontend development server:
```bash
npm run dev
```

## Features

### Authentication
- User registration and login
- JWT-based authentication
- Protected routes

### Ticket Management
- Configure ticket types (name, price, book size)
- Track ticket numbers per shift
- Automatic sold count calculation
- NIL (Not In Location) support

### Shift Management
- Two-shift system (Morning/Evening)
- Employee assignment
- Machine report tracking
- Reckoning calculations
- Difference tracking (surplus/shortage)

### Reports
- Daily report generation
- Edit existing reports
- PDF export
- Consolidated reports

### Backups
- Automatic daily backups (configurable schedule)
- Manual backup creation
- Backup download
- Automatic cleanup (configurable retention)

### Summaries
- Daily summaries
- Weekly summaries
- Monthly summaries
- Custom date range summaries
- Ticket performance tracking
- Employee performance tracking

## API Documentation

See `backend/README.md` for detailed API endpoint documentation.

## Database Schema

See `backend/prisma/schema.prisma` for the complete database schema.

## Environment Variables

### Backend
- `PORT` - Server port (default: 3001)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - Token expiration (default: 7d)
- `BACKUP_ENABLED` - Enable automatic backups (true/false)
- `BACKUP_RETENTION_DAYS` - Days to retain backups (default: 30)
- `BACKUP_SCHEDULE` - Cron schedule for backups (default: "0 2 * * *")
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend
- `VITE_API_URL` - Backend API URL (default: http://localhost:3001/api)

## Development

### Backend
- `npm run dev` - Start development server with auto-reload
- `npm run prisma:studio` - Open Prisma Studio to view/edit database
- `npm run prisma:migrate` - Run database migrations

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Deployment

### Backend
1. Set production environment variables
2. Run database migrations: `npm run prisma:migrate`
3. Start server: `npm start`

### Frontend
1. Build: `npm run build`
2. Serve `dist` directory with a web server (nginx, Apache, etc.)

## Migration from Old Version

The old single-file application (`index.html`) stored data in localStorage. To migrate:

1. Export data from old application (if available)
2. Register a new account in the new application
3. Manually enter ticket configurations
4. Import historical data if you have JSON exports

## Support

For issues or questions, refer to:
- `ARCHITECTURE.md` - Architecture documentation
- `TECHNICAL_REQUIREMENTS.md` - Original technical requirements
- `backend/README.md` - Backend API documentation
- `frontend/README.md` - Frontend documentation

## License

ISC

