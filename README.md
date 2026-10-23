# EventEase — Campus Event Management Platform

**Discover campus events. Register for experiences. Bring your community together.**

EventEase is a full-stack web application designed to simplify campus event discovery and registration. It provides students with a central place to explore events and reserve seats, while an authenticated organizer can create and publish events.

**Live Demo:** https://event-ease-eosin.vercel.app/  
**Source Code:** https://github.com/gouse0064-star/EventEase

## Overview

Managing campus events can involve scattered announcements, manual registrations, and difficulty tracking available seats. EventEase brings these activities into one web application with a public event listing, online registration, and protected event creation.

## Features

- **Event discovery:** Browse campus events with descriptions, dates, venues, and seat availability.
- **Organizer authentication:** Sign in through a dedicated organizer login.
- **Protected event creation:** Create events through a backend endpoint secured with JSON Web Tokens (JWT).
- **Student registration:** Submit student details to register for an event.
- **Seat tracking:** Display remaining seats and update availability after registration.
- **Input validation:** Validate event details, dates, capacity, and registration requirements on the backend.
- **Full-stack deployment:** Frontend and backend are deployed separately.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | bcryptjs, JSON Web Tokens (JWT) |
| Deployment | Vercel (frontend), Render (backend) |

## Architecture

```text
Student / Organizer
        |
        v
 React Frontend (Vercel)
        |
        v
 Express REST API (Render)
        |
        +---- Organizer authentication
        |
        +---- Event management
        |
        +---- Student registration
        |
        v
 MongoDB Atlas
```

The React frontend communicates with the Express backend through REST API endpoints. MongoDB stores event and registration data. Organizer credentials are verified on the backend, and a signed JWT is required for protected event creation.

## Main API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/events` | Retrieve the event list |
| GET | `/api/events/:id` | Retrieve a specific event |
| POST | `/api/auth/login` | Authenticate the organizer |
| POST | `/api/events` | Create an event (organizer authentication required) |
| POST | `/api/events/:id/register` | Register for an event |

## Run Locally

### Prerequisites

- Node.js and npm
- A MongoDB database or MongoDB Atlas connection
- Git

### 1. Clone the repository

```bash
git clone https://github.com/gouse0064-star/EventEase.git
cd EventEase
```

### 2. Configure the backend

```bash
cd server
npm install
```

Create `server/.env` using your own local configuration:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
ORGANIZER_USERNAME=your_organizer_username
ORGANIZER_PASSWORD_HASH=your_bcrypt_hash
JWT_SECRET=your_random_secret
```

Generate the bcrypt hash and JWT secret securely. Never commit the actual `.env` file or real credentials.

Start the backend:

```bash
npm start
```

### 3. Configure the frontend

Open another terminal:

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed by Vite.

## Security Considerations

- Organizer credentials are verified on the backend.
- Password verification uses bcrypt.
- Protected event creation requires a valid JWT.
- Sensitive configuration is stored in environment variables.
- Public event browsing and student registration remain accessible without organizer login.

## Future Improvements

- Multiple organizer accounts and role-based permissions
- Student accounts and registration history
- Event editing, cancellation, and organizer dashboards
- Search, filters, and event categories
- Email confirmations and reminders
- Automated tests and CI/CD checks

## What I Learned

Building EventEase provided practical experience with React frontend development, REST API design, MongoDB integration, backend validation, authentication, protected routes, environment configuration, and full-stack deployment.

It also highlighted the importance of testing the deployed application—not just the local version—including authentication, event creation, registration, and access control.

## Project Links

- **Live application:** https://event-ease-eosin.vercel.app/
- **GitHub repository:** https://github.com/gouse0064-star/EventEase

---

*Built as a full-stack campus event management project.*
