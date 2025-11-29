# Complete Setup Guide

## Prerequisites

1. **Node.js 18+** - [Download](https://nodejs.org/)
2. **PostgreSQL** - [Download](https://www.postgresql.org/download/)
3. **npm or yarn** - Comes with Node.js

## Step 1: Database Setup

1. Install PostgreSQL and start the service
2. Create a new database:
```sql
CREATE DATABASE nj_lotto_db;
```
3. Note your database credentials (username, password, port - usually 5432)

## Step 2: Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
# Copy the example (if available) or create new
cp .env.example .env
```

4. Edit `.env` with your database credentials:
```env
PORT=3001
NODE_ENV=development
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/nj_lotto_db?schema=public"
JWT_SECRET=change-this-to-a-random-secret-key-in-production
JWT_EXPIRES_IN=7d
BACKUP_ENABLED=true
BACKUP_RETENTION_DAYS=30
BACKUP_SCHEDULE="0 2 * * *"
FRONTEND_URL=http://localhost:5173
```

5. Generate Prisma client:
```bash
npm run prisma:generate
```

6. Run database migrations:
```bash
npm run prisma:migrate
```
   - When prompted, name your migration (e.g., "init")

7. Start the backend server:
```bash
npm run dev
```

The backend should now be running on `http://localhost:3001`

## Step 3: Frontend Setup

1. Open a new terminal and navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create `.env` file if you need to change API URL:
```env
VITE_API_URL=http://localhost:3001/api
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend should now be running on `http://localhost:5173`

## Step 4: First Use

1. Open your browser and go to `http://localhost:5173`
2. Click "Register" to create a new account
3. Fill in:
   - Email
   - Password (minimum 6 characters)
   - Name (optional)
4. After registration, you'll be logged in automatically
5. The system will initialize with default ticket configurations

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running: `pg_isready` or check service status
- Verify database exists: `psql -l` should show `nj_lotto_db`
- Check connection string format in `.env`
- Ensure username and password are correct

### Backend Issues

- Check if port 3001 is available: `lsof -i :3001`
- Verify all environment variables are set
- Check backend logs for error messages
- Ensure Prisma migrations ran successfully

### Frontend Issues

- Clear browser cache
- Check browser console for errors
- Verify backend is running and accessible
- Check CORS settings in backend if API calls fail

### Common Errors

**"Prisma Client not generated"**
```bash
cd backend
npm run prisma:generate
```

**"Migration failed"**
- Check database connection
- Verify database user has CREATE privileges
- Try: `npm run prisma:migrate reset` (WARNING: deletes all data)

**"Cannot connect to API"**
- Verify backend is running on port 3001
- Check `VITE_API_URL` in frontend `.env`
- Verify CORS settings in backend

## Next Steps

- Configure automatic backups (already enabled by default)
- Customize ticket configurations in Settings
- Add employees in Settings
- Start entering daily reports

## Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure production database
4. Use process manager (PM2, systemd, etc.)
5. Set up SSL/HTTPS

### Frontend
1. Build: `npm run build`
2. Serve `dist` directory with nginx/Apache
3. Configure reverse proxy to backend API
4. Set up SSL/HTTPS

## Support

For detailed documentation:
- `README.md` - Main project overview
- `ARCHITECTURE.md` - Architecture details
- `backend/README.md` - Backend API documentation
- `frontend/README.md` - Frontend documentation

