# Sweety – Blood Glucose Tracker

A full-stack blood glucose tracking application built with React, TypeScript, Node.js, Express, PostgreSQL and Prisma.

## Features

- Secure user registration and login.
- JWT authentication and bcrypt password hashing.
- Create, view, update and delete glucose readings.
- Four daily reading slots:
  - Morning (fasting)
  - After breakfast
  - After lunch
  - After dinner
- Glucose validation between 40 and 600 mg/dl.
- Prevention of duplicate readings.
- Maximum four readings per user per day.
- Daily, month-to-date and previous-month reports.
- Highest, lowest, average and total reading statistics.
- Responsive dashboard with glucose trend charts.
- Dedicated glucose reports page.
- User-specific data access and protected API endpoints.

## Application Screenshots

### Authentication

![Login](screenshots/login.png)

![Registration](screenshots/register.png)

### Dashboard and Reading Management

![Dashboard](screenshots/dashboard.png)

![Add Reading](screenshots/add-reading.png)

### Glucose Reports

![Daily Report](screenshots/reports-daily.png)

![Month-to-Date Report](screenshots/reports-month-to-date.png)

![Previous Month Report](screenshots/reports-previous-month.png)

## Technology Stack

- React, TypeScript, Vite and Tailwind CSS.
- Node.js and Express.
- PostgreSQL and Prisma ORM.
- JWT and bcryptjs.
- Zod for validation.
- Recharts for data visualization.
- Vitest for backend validation tests.

## Project Structure

```text
sweety/
├── client/                 # React frontend
├── server/                 # Express backend
│   ├── prisma/             # Database schema and seed script
│   ├── src/                # API routes and application logic
│   └── tests/              # Backend validation tests
├── screenshots/            # Application screenshots
├── work.md                 # Development progress log
├── README.md
└── .gitignore
```

## Prerequisites

- Node.js 20 or later.
- npm.
- PostgreSQL 14 or later.
- Git.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Surya189-ops/sweety-blood-glucose-tracker.git
cd sweety
```

### 2. Create the PostgreSQL database

Create a PostgreSQL database named:

```sql
CREATE DATABASE sweety_db;
```

### 3. Backend setup

Open a terminal from the project root:

```bash
cd server
npm install
```

Copy the environment example:

```bash
cp .env.example .env
```

Configure the variables in `server/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/sweety_db?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
PORT=5000
CLIENT_URL="http://localhost:5173"
NODE_ENV="development"
```

Generate Prisma Client:

```bash
npm run db:generate
```

Apply database migrations:

```bash
npm run db:migrate
```

Create the demo user and sample readings:

```bash
npm run db:seed
```

Start the backend:

```bash
npm run dev
```

The API runs on port 5000.

### 4. Frontend setup

Open a second terminal from the project root:

```bash
cd client
npm install
```

Copy the environment example:

```bash
cp .env.example .env
```

The frontend environment variable is:

```env
VITE_API_URL=/backend
```

Start the frontend:

```bash
npm run dev
```

The Vite development server normally runs on port 5173.

The Vite development proxy forwards `/backend` requests to the Express API.

Open the application at:

```text
http://localhost:5173
```

## Demo Account

Use these credentials to explore the seeded demo account:

| Field | Value |
|---|---|
| Email | demo@sweety.app |
| Password | SweetyDemo123! |

These credentials are provided for demonstration only. Do not use them for real health information.

Running the seed command again resets the demo account's sample readings.

## API Endpoints

All API endpoints use the `/api` prefix.

### Health Check

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check API status |

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Get current authenticated user |

### Glucose Readings

All reading endpoints require authentication.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/readings` | List authenticated user's readings |
| POST | `/api/readings` | Add a reading |
| PUT | `/api/readings/:id` | Update a reading |
| DELETE | `/api/readings/:id` | Delete a reading |

### Reports

All report endpoints require authentication and a date in `YYYY-MM-DD` format.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/reports/daily?date=YYYY-MM-DD` | Daily report |
| GET | `/api/reports/month-to-date?date=YYYY-MM-DD` | Month-to-date report |
| GET | `/api/reports/monthly?date=YYYY-MM-DD` | Previous-month report |

Each report includes:

- Highest glucose reading.
- Lowest glucose reading.
- Average glucose reading, rounded to one decimal place.
- Total number of readings.
- Reading history and an empty state when no readings exist.

### Report Date Ranges

- **Daily:** Readings for the selected date.
- **Month-to-date:** From the first day of the selected month through the selected date.
- **Monthly:** The complete calendar month immediately before the selected date's month.

## Validation Rules

The application implements the following validation rules:

| Rule | Error message |
|---|---|
| Glucose value is required | Please enter a glucose value. |
| Value must be a whole number between 40 and 600 | Value must be between 40 and 600 mg/dl. |
| Duplicate slot on the same date | You already have a reading for this slot and date. |
| Maximum four readings per day | You can add only 4 readings per day. |
| Future dates are not allowed | Date cannot be in the future. |

Additional validations include:

- Invalid calendar dates are rejected.
- Decimal glucose values are rejected.
- Duplicate email registrations are rejected.
- Users can access only their own readings.

## Testing

Run the backend validation tests:

```bash
cd server
npm test
```

Build the backend:

```bash
npm run build
```

Build the frontend:

```bash
cd ../client
npm run build
```

The backend validation test suite currently contains 12 tests.

## Security and Privacy

- Passwords are hashed using bcrypt.
- Protected endpoints require JWT authentication.
- Database queries are scoped to the authenticated user.
- Environment files containing secrets are excluded from Git.
- Example environment files are provided without real secrets.
- Demo credentials are intended for demonstration only.

Sweety is a tracking application, not a substitute for professional medical advice or diagnosis.

## Notes

### Assumptions

- All glucose readings are recorded in mg/dl.
- Each user can record a maximum of one reading per time slot per day.
- A user can record up to four readings per day.
- Dates are validated using the Asia/Kolkata timezone.
- The monthly report represents the complete previous calendar month.
- Each user's glucose readings are private and accessible only after authentication.
- The demo account is provided exclusively for testing and demonstration.

### Improvements With More Time

- Add pagination to reading history.
- Expand automated API integration and frontend tests.
- Add Docker and Docker Compose for easier deployment.
- Improve chart interactions and accessibility.
- Add optional doctor/caregiver access with explicit patient consent.
- Introduce additional reporting and data export capabilities.

## Future Improvements

- Pagination for large reading histories.
- Expanded API integration and frontend tests.
- Docker-based deployment.
- Optional doctor/caregiver access with explicit user consent.
- Additional reporting and accessibility improvements.

---

Developed for the Kenpath Junior Full Stack Developer – JavaScript & AI assignment.