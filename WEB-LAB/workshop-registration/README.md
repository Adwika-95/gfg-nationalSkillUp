# 🚀 Workshop Registration System

A full-stack registration app for college workshops — built with React (frontend) and Node.js (backend), featuring an astronaut space theme.

---

## 📁 Project Structure

```
workshop-registration/
├── backend/
│   ├── server.js          ← Node.js HTTP server (no frameworks)
│   ├── package.json
│   └── participants.txt   ← Auto-created when first registration is made
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── RegistrationForm.js    ← Registration form UI
    │   │   ├── RegistrationForm.css
    │   │   ├── ParticipantsList.js    ← Participants viewer UI
    │   │   └── ParticipantsList.css
    │   ├── App.js         ← Main layout + routing
    │   ├── App.css
    │   ├── index.js       ← React entry point
    │   └── index.css      ← Global styles + CSS variables
    └── package.json
```

---

## ⚙️ Setup & Run

### Step 1 — Start the Backend

```bash
cd backend
node server.js
```

Server starts at: `http://localhost:5000`

### Step 2 — Start the Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm start
```

App opens at: `http://localhost:3000`

---

## 🔌 API Endpoints

| Method | Endpoint        | Description                        |
|--------|-----------------|------------------------------------|
| POST   | `/register`     | Register a new participant         |
| GET    | `/participants` | Get all registered participants    |

### POST `/register`
**Request body:**
```json
{ "name": "Alice", "department": "Computer Science" }
```
**Response:**
```json
{ "message": "Registration successful!" }
```

### GET `/participants`
**Response:**
```json
{
  "participants": [
    { "id": 1, "timestamp": "2025-01-01T10:00:00.000Z", "name": "Alice", "department": "Computer Science" }
  ]
}
```

---

## ⚡ Concurrency (How it works)

Node.js is **single-threaded but non-blocking**. When multiple students submit at the same time:

1. Each request arrives and is processed by the event loop.
2. `fs.appendFile()` is called — this is **asynchronous and non-blocking**.
3. While one file write is in progress, Node.js continues accepting and processing other requests.
4. Callbacks fire when the OS completes each write, sending responses back.

This means **no student is blocked waiting for another student's request to finish** — exactly the event-driven, async architecture Node.js is built for.

---

## 🛠️ Technologies Used

| Layer    | Technology     |
|----------|----------------|
| Frontend | React 18       |
| Backend  | Node.js (core `http` + `fs` modules — no Express) |
| Styling  | Custom CSS (space/astronaut theme) |
| Fonts    | Syne + DM Sans (Google Fonts) |
