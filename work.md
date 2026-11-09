# Sweety – Blood Glucose Tracker

## Assignment
Kenpath – Junior Full Stack Developer, JavaScript & AI

## Technology
- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express, TypeScript
- Database: PostgreSQL, Prisma
- Authentication: JWT, bcrypt
- Charts: Recharts

## Progress

### Foundation
- [x] React + TypeScript + Vite initialized
- [x] Tailwind CSS configured
- [x] Frontend production build verified
- [x] Express backend initialized
- [x] PostgreSQL database configured
- [x] Prisma schema and migration created

### Authentication
- [x] User registration and password hashing
- [x] Duplicate email prevention
- [x] User login and JWT authentication
- [x] Current-user endpoint
- [x] Manual authentication tests passed

### Glucose Reading APIs
- [x] Create, retrieve, update and delete readings
- [x] Glucose range and whole-number validation
- [x] Future-date prevention
- [x] Duplicate slot prevention
- [x] Four-reading daily limit
- [x] Manual CRUD tests passed

### Reports
- [x] Daily report
- [x] Month-to-date report
- [x] Previous calendar month report
- [x] Highest and lowest values
- [x] Average rounded to one decimal
- [x] Total reading count
- [x] Empty-state handling
- [x] Manual report tests passed

### Remaining
- [ ] Frontend authentication screens
- [ ] Glucose tracker dashboard
- [ ] Reading management UI
- [ ] Reports and charts UI
- [ ] Automated tests
- [ ] README and demo data
- [ ] Screenshots and submission

## Environment
- Node.js: 24.22.1
- npm: 11.19.1

### Frontend Authentication
- [x] Axios API client with JWT token handling
- [x] Authentication context and session restoration
- [x] Login and registration screens
- [x] Protected dashboard route
- [x] Vite API proxy configured
- [x] Frontend production build passed


### Glucose Tracker Dashboard
- [x] Responsive dashboard layout
- [x] Average, highest, lowest and total reading cards
- [x] Daily, month-to-date and previous-month reports
- [x] Glucose trend chart using Recharts
- [x] Readings table
- [x] Add, edit and delete reading interface
- [x] Empty states and validation error display
- [x] Cloud Shell API proxy compatibility
- [x] Manual create, update and delete tests passed
- [x] Frontend production build passed


## 2026-11-09 — Documentation and Final Verification

- Added comprehensive project README with installation, database setup, environment configuration, demo credentials, API endpoints, validation rules, testing and security notes.
- Updated client/.env.example to use the working /backend development proxy.
- Added 12 automated validation tests covering registration, login and glucose reading validation.
- Backend tests: 12/12 passed.
- Backend TypeScript production build: passed.
- Frontend TypeScript and Vite production build: passed.
- Demo account and sample glucose readings created using the Prisma seed script.
- Manual frontend verification completed for login, dashboard, reading creation, editing, deletion and empty states.

## 2026-11-09 — Dedicated Glucose Reports Page
- Added a protected /reports route.
- Created a dedicated Glucose Reports page.
- Added daily, month-to-date, and previous-month report filters.
- Added average, highest, lowest, and total reading summaries.
- Added glucose trend chart and reading history.
- Updated sidebar navigation with working Overview and Glucose reports links.
- Added responsive report page styling.
- Frontend TypeScript and production build passed.
- Manually verified the Reports page in the browser.
