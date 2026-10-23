# EventEase — Campus Event Management Platform

**EventEase** is a full-stack MERN web application designed to simplify campus event management. It enables organizers to create events and allows students to register, while tracking available seats and preventing duplicate registrations.

**Live Demo:** https://event-ease-eosin.vercel.app/  
**GitHub Repository:** https://github.com/gouse0064-star/EventEase

---

## Overview

Managing college events often involves manual registrations, attendance limits, and difficulty tracking participants. EventEase provides a centralized platform for publishing events, collecting student registrations, and managing event capacity.

## Features

- **Event creation:** Create events with descriptions, venues, dates, registration deadlines, and participant limits.
- **Event discovery:** Browse available campus events.
- **Student registration:** Register for events using name, email, and student ID.
- **Duplicate prevention:** Prevent a student from registering for the same event multiple times.
- **Seat management:** Track event capacity and remaining seats.
- **Input validation:** Validate event and registration data.
- **Responsive interface:** Access the application through a modern web interface.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Icons | Lucide React |
| Frontend deployment | Vercel |
| Backend deployment | Render |
| Version control | Git and GitHub |

## Architecture

```text
User
  |
  v
React Frontend (Vite)
  |
  | HTTP / REST API
  v
Express.js + Node.js Backend
  |
  v
MongoDB Atlas
  |
  +-- Events
  +-- Users
  +-- Registrations
```

## Project Structure

```text
EventEase/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── models/
│   │   ├── Event.js
│   │   ├── User.js
│   │   └── Registration.js
│   ├── routes/
│   │   ├── events.js
│   │   └── registrations.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

Install the following:

- Node.js and npm
- Git
- A MongoDB Atlas database, or another compatible MongoDB instance

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

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

Replace the placeholder with your MongoDB connection string. Never commit your real `.env` file or database credentials.

### 3. Start the backend

```bash
npm start
```

The backend should run at `http://localhost:5000`.

### 4. Configure the frontend

Open another terminal:

```bash
cd client
npm install
```

Create a `.env.local` file inside `client`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Start the frontend

```bash
npm run dev
```

Open the local URL displayed by Vite, usually `http://localhost:5173`.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Check backend status |
| GET | `/api/events` | Retrieve events |
| GET | `/api/events/:id` | Retrieve a specific event |
| POST | `/api/events` | Create an event |
| POST | `/api/events/:id/register` | Register a student for an event |

## Deployment

- **Frontend:** [EventEase on Vercel](https://event-ease-eosin.vercel.app/)
- **Backend:** Deployed on Render
- **Database:** MongoDB Atlas

The deployed frontend uses the `VITE_API_URL` environment variable to connect to the backend API.

## Future Improvements

- Authentication and role-based access for organizers and students
- Organizer dashboard and participant management
- Event editing and cancellation
- Waitlists for full events
- Email confirmations and reminders
- Search, filters, and event categories
- Automated testing and improved production monitoring

## Learning Outcomes

This project provided practical experience with:

- Building a full-stack MERN application
- Designing REST APIs
- Modeling data with MongoDB and Mongoose
- Integrating a React frontend with a backend API
- Implementing registration validation and seat tracking
- Deploying a web application using Vercel, Render, and MongoDB Atlas
- Using Git and GitHub for version control

## Author

**MD Gouse**

GitHub: [@gouse0064-star](https://github.com/gouse0064-star)

---

*EventEase — Bringing campus communities together.*
