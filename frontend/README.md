# NJ Lottery Tool - Frontend

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (optional, defaults to localhost:3001):
```env
VITE_API_URL=http://localhost:3001/api
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Features

- User authentication (Login/Register)
- Two-shift system (Shift A & B)
- Ticket management and tracking
- Employee management
- Daily report generation
- PDF export
- Summary and analytics
- Automatic backups

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Router
- React Query
- Axios
- jsPDF

## Project Structure

```
src/
├── components/
│   ├── auth/          # Authentication components
│   ├── dashboard/     # Dashboard components
│   ├── shifts/        # Shift-related components
│   ├── tickets/       # Ticket table components
│   ├── reports/       # Reports panel
│   └── settings/      # Settings modal
├── contexts/          # React contexts (Auth)
├── pages/             # Page components
├── services/          # API services
└── utils/            # Utility functions
```

