# New Architecture Design
## NJ Lottery Tool - Full Stack Implementation

## Tech Stack

### Backend
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** PostgreSQL (with Prisma ORM)
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **Validation:** express-validator
- **CORS:** cors middleware

### Frontend
- **Framework:** React 18+ with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** React Context API + React Query
- **HTTP Client:** Axios
- **PDF Generation:** jsPDF + jsPDF-autotable (client-side)
- **Routing:** React Router
- **Form Handling:** React Hook Form

### Database Schema
- **Users Table:** Authentication and user management
- **Tickets Table:** Ticket configurations (per user)
- **TicketStates Table:** Current ticket states (per user)
- **Employees Table:** Employee list (per user)
- **DailyReports Table:** Daily shift reports
- **ShiftData Table:** Individual shift data
- **TicketDetails Table:** Ticket details within shifts
- **Backups Table:** Automatic backup records
- **Summaries Table:** Summary/aggregated data

## Project Structure

```
nj_lotto_tool/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── ticketController.js
│   │   │   ├── reportController.js
│   │   │   ├── employeeController.js
│   │   │   ├── backupController.js
│   │   │   └── summaryController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── validation.js
│   │   ├── models/
│   │   │   └── (Prisma models)
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── tickets.js
│   │   │   ├── reports.js
│   │   │   ├── employees.js
│   │   │   ├── backups.js
│   │   │   └── summaries.js
│   │   ├── services/
│   │   │   ├── backupService.js
│   │   │   └── summaryService.js
│   │   ├── utils/
│   │   │   └── calculations.js
│   │   └── server.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── .env
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── shifts/
│   │   │   ├── tickets/
│   │   │   ├── reports/
│   │   │   └── settings/
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   └── calculations.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── .gitignore
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

### Tickets
- `GET /api/tickets` - Get user's ticket configuration
- `POST /api/tickets` - Create/update ticket configuration
- `GET /api/tickets/state` - Get ticket states
- `PUT /api/tickets/state` - Update ticket states

### Employees
- `GET /api/employees` - Get user's employees
- `POST /api/employees` - Add employee
- `DELETE /api/employees/:id` - Remove employee

### Reports
- `GET /api/reports` - Get all reports (with filters)
- `GET /api/reports/:id` - Get single report
- `POST /api/reports` - Create report
- `PUT /api/reports/:id` - Update report
- `DELETE /api/reports/:id` - Delete report
- `POST /api/reports/generate-pdf` - Generate PDF

### Backups
- `GET /api/backups` - Get backup history
- `POST /api/backups/create` - Manual backup
- `GET /api/backups/:id/download` - Download backup

### Summaries
- `GET /api/summaries/daily` - Daily summaries
- `GET /api/summaries/weekly` - Weekly summaries
- `GET /api/summaries/monthly` - Monthly summaries
- `GET /api/summaries/custom` - Custom date range summaries

## Database Schema

### Users
- id, email, password_hash, name, created_at, updated_at

### Tickets
- id, user_id, name, price, book_size, order_index, created_at, updated_at

### TicketStates
- id, user_id, ticket_id, last_number, updated_at

### Employees
- id, user_id, name, created_at, updated_at

### DailyReports
- id, user_id, date, created_at, updated_at

### ShiftData
- id, report_id, shift_type (A/B), person_name, online_sales, online_cashes, instant_cashes, actual_cash, total_scratch_sales, expected_scratch_cash, total_expected_cash, difference, data_entered

### TicketDetails
- id, shift_data_id, ticket_id, prev_num, current_num, sold_count, total_amount

### Backups
- id, user_id, backup_data (JSON), created_at, backup_type (auto/manual)

### Summaries
- id, user_id, period_type, period_start, period_end, summary_data (JSON), created_at

## Automatic Backup System

- **Frequency:** Daily at 2 AM (configurable)
- **Retention:** 30 days (configurable)
- **Storage:** Database table + optional file system
- **Trigger:** Cron job or scheduled task
- **Content:** Full user data snapshot

## Summary System

- **Daily Summaries:** Per-day aggregations
- **Weekly Summaries:** Monday-Sunday aggregations
- **Monthly Summaries:** Calendar month aggregations
- **Custom Summaries:** User-defined date ranges
- **Metrics:** Total sales, differences, ticket performance, employee performance

