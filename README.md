# 🎵 Syntra v0.5

> 🚧 **Public Preview**

**Syntra** is a browser-based music streaming platform built by **SRS**, designed to deliver a seamless music listening experience with a modern interface, persistent playback, and secure cloud-based streaming.

Unlike traditional local music players, Syntra streams music directly from the cloud using a modern full-stack architecture powered by **Vercel**, **Render**, and **Supabase**.

---

## 🌐 Live Demo

**Frontend**

https://srs-syntra.vercel.app

**Backend API**

https://srs-syntra.onrender.com

---

# ✨ Features

### 🎵 Music Streaming
- Secure audio streaming
- Cloud-hosted music library
- Dynamic metadata loading

### 💿 Music Library
- Browse Albums
- Browse Singles
- Dynamic album pages
- Album artwork support

### ▶ Music Player
- Persistent player across pages
- Play / Pause
- Previous / Next
- Repeat modes
- Volume control
- Mute
- Interactive seek bar
- Expanded player

### ⚡ Architecture
- Single Page Application (SPA)
- Express REST API
- Supabase Storage integration
- Dynamic metadata delivery

---

# 🏗 Tech Stack

## Frontend
- HTML5
- CSS3
- Vanilla JavaScript

## Backend
- Node.js
- Express.js

## Storage
Supabase Storage

- 🎵 Private Music Bucket
- 🖼 Public Covers Bucket
- 📄 JSON Metadata

## Deployment

- ▲ Vercel (Frontend)
- 🚀 Render (Backend)
- ☁ Supabase (Storage)
- 🐙 GitHub (Version Control)

---

# 📁 Project Structure

```text
srs-syntra
│
├── client
│   ├── assets
│   ├── css
│   ├── js
│   ├── pages
│   └── index.html
│
├── server
│   ├── controllers
│   ├── routes
│   ├── services
│   ├── data
│   └── app.js
│
├── importer
│
└── README.md
```

---

# ⚙ Architecture

```text
                Browser
                  │
                  ▼
      Vercel (Frontend Hosting)
                  │
          HTTPS API Requests
                  │
                  ▼
       Render (Express Backend)
                  │
                  ▼
         Supabase Storage
        ┌───────────────────┐
        │ Private Music      │
        │ Public Covers      │
        │ JSON Metadata      │
        └───────────────────┘
```

---

# 🚀 Running Locally

Clone the repository

```bash
git clone https://github.com/<your-username>/srs-syntra.git
```

Enter the project

```bash
cd srs-syntra
```

Install backend dependencies

```bash
cd server
npm install
```

Create a `.env` file

```env
SUPABASE_URL=your_supabase_url

SUPABASE_SECRET_KEY=your_service_role_key

SUPABASE_MUSIC_BUCKET=music

SUPABASE_COVERS_BUCKET=covers
```

Start the server

```bash
npm start
```

Open

```
http://localhost:3000
```

---

# 📌 Roadmap

## 🚧 v0.5 — Public Preview *(Current)*

- ✅ Cloud music streaming
- ✅ Albums
- ✅ Singles
- ✅ Persistent player
- ✅ Queue
- ✅ Previous / Next
- ✅ Repeat modes
- ✅ Volume controls
- ✅ Interactive seek bar
- ✅ Expanded player
- ✅ Supabase integration
- ✅ Render deployment
- ✅ Vercel deployment

---

## 🎯 v1.0 — Stable Release

- ⬜ UI polish
- ⬜ Mobile-friendly responsive design
- ⬜ Favorites
- ⬜ Queue improvements

---

## 🚀 v2.0 — Personalized Syntra

- ⬜ User accounts
- ⬜ Authentication
- ⬜ Personalized library
- ⬜ Listening history
- ⬜ User playlists

---

# 📸 Screenshots

> Screenshots will be added as development progresses.

---

# 👨‍💻 Author

**SRS**

Music Producer • Developer • Video Editor

---

# 🤝 Contributing

This project is currently under active development.

Suggestions, issues, and pull requests are always welcome.

---

# 📄 License

This project is licensed under the **MIT License**.
