# Tidal Power Fitness

A modern fitness training platform with integrated scheduling and payment processing.

## Project Structure

```
TidalPowerFitness/
├── frontend/          # Next.js frontend application
├── backend/           # Node.js/Express backend API
└── README.md
```

## Tech Stack

### Frontend
- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with modern design
- **State Management**: React hooks

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT-based auth with role-based access control
- **APIs**: 
  - Acuity Scheduling API for calendar management
  - Square API for payment processing

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

```bash
cd backend
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your configuration

# Run in development mode
npm run dev
```

The backend API will be available at `http://localhost:5000`

## Environment Variables

### Backend (.env)
- `PORT`: Server port (default: 5000)
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`: PostgreSQL connection details
- `JWT_SECRET`: Secret key for JWT token generation
- `ACUITY_USER_ID`, `ACUITY_API_KEY`: Acuity Scheduling API credentials
- `SQUARE_ACCESS_TOKEN`, `SQUARE_LOCATION_ID`, `SQUARE_ENVIRONMENT`: Square payment API credentials

## Features

- User authentication with role-based access
- Trainer profiles and bios
- Appointment scheduling via Acuity
- Payment processing via Square
- Responsive modern design

## Development

- Frontend runs on port 3000
- Backend API runs on port 5000
- PostgreSQL database on port 5432

## License

ISC
