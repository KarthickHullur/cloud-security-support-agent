# Cloud Security Support Agent

An AI-powered support agent for cloud security — built with a JavaScript frontend deployed on Cloudflare Pages and a backend API.

## Live Demo

[https://cloud-security-support-agent.pages.dev/](https://cloud-security-support-agent.pages.dev/)

---

## Project Structure

```
cloud-security-support-agent/
├── frontend/       # React-based UI
└── backend/        # Node.js API server
```

---

## Frontend

- Built with **React** (JavaScript, CSS, HTML)
- Deployed on **Cloudflare Pages**
- Provides a chat/query interface for users to interact with the cloud security agent

## Backend

- Built with **Node.js**
- Handles API requests from the frontend
- Integrates with an AI model to answer cloud security questions and provide support

---

## Tech Stack

| Layer     | Technology          |
|-----------|---------------------|
| Frontend  | React, CSS, HTML    |
| Backend   | Node.js             |
| Hosting   | Cloudflare Pages    |
| Language  | JavaScript          |

---

## Getting Started

### Prerequisites

- Node.js installed
- npm or yarn

### Run the Backend

```bash
cd backend
npm install
npm start
```

### Run the Frontend

```bash
cd frontend
npm install
npm start
```

The frontend runs locally at `http://localhost:3000` and communicates with the backend API.

---

## Deployment

The frontend is deployed to **Cloudflare Pages** from the `frontend/` directory.
