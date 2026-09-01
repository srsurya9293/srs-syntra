# 🎵 Syntra v0.9

> 🟢 **Live • Deployed • Stable**

**Syntra** is a browser-based music streaming platform built by **SRS**, designed to deliver a seamless music listening experience with a modern interface, persistent playback, dynamic music discovery, and cloud-based streaming.

Unlike a traditional local music player, Syntra streams music through a full-stack web architecture powered by **Vercel**, **Render**, and **Supabase**.

---

## 🌐 Live Demo

**Frontend**

https://srs-syntra.vercel.app

**Backend API**

https://srs-syntra.onrender.com

---

# ✨ Features

### 🎵 Music Streaming

* Secure cloud-based audio streaming
* Private music storage
* Dynamic song metadata
* Album artwork support
* Dynamic album and song data

### 💿 Music Library

* Browse Albums
* Browse Singles
* Dynamic album pages
* Album artwork
* Album streaming links
* Album slug-based URLs
* Automatic album/song metadata generation

### ▶️ Music Player

* Persistent player across pages
* Play / Pause
* Previous / Next
* Queue system
* Queue synchronization across Albums and Singles pages
* Queue panel with dynamic queue contents
* Queue item playback
* Automatic queue handling
* Repeat modes
* Volume control
* Mute
* Interactive seek bar
* Click-and-drag seeking
* Click-and-drag volume control
* Volume scroll control
* Expanded player
* Animated song title scrolling
* Responsive player layout
* Synchronized playing state across pages

### 📋 Track Menus

* Album track action menu
* Singles track action menu
* Play Next
* Add to Queue
* Click-outside menu closing
* Responsive menu positioning
* Mobile-friendly menu interaction
* Visual button feedback

### ⌨️ Keyboard Controls

* `Space` — Play / Pause
* `← / →` — Seek ±5 seconds
* `↑ / ↓` — Volume ±5%
* `P` — Previous track
* `N` — Next track
* `R` — Toggle repeat

### 📱 Media Session

* OS-level media controls
* Lock-screen playback information
* Notification / Action Center integration
* Song title and artist information
* Album artwork
* Play / Pause synchronization
* Previous / Next controls

### 🏠 Home Experience

* Hero section
* Welcome section
* Latest release
* Featured albums
* Featured singles
* Music platform links
* About section
* Contact section

### ⚡ Application Experience

* Single Page Application (SPA)
* Client-side routing
* Smooth page transitions
* Scroll-position restoration
* Responsive layout
* Persistent playback between pages
* Startup data preloading
* Loading screen
* Server error handling
* Offline / unavailable server detection

### 🛠️ Music Import System

* Automatic music scanning
* MP3 metadata extraction
* Automatic album detection
* Automatic song IDs
* Automatic album IDs
* Stable existing IDs
* Automatic cover extraction
* Cover conversion using Sharp
* Metadata synchronization with Supabase
* Automatic cleanup of removed songs and albums
* Automatic album slug generation

---

# 🏗 Tech Stack

## Frontend

* HTML5
* CSS3
* Vanilla JavaScript
* Media Session API

## Backend

* Node.js
* Express.js
* REST API

## Music Processing

* `music-metadata`
* `sharp`

## Storage

**Supabase Storage**

* 🎵 Private Music Bucket
* 🖼️ Public Covers Bucket
* 📄 JSON Metadata

## Deployment

* ▲ Vercel — Frontend
* 🚀 Render — Backend
* ☁️ Supabase — Storage
* 🐙 GitHub — Version Control

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
│   └── scanner
│
└── README.md
```

---

# ⚙️ Architecture

```text
                    Browser
                       │
                       ▼
              Vercel (Frontend)
                       │
                 HTTPS Requests
                       │
                       ▼
              Render (Express API)
                       │
                       ▼
              Supabase Storage
             ┌──────────────────┐
             │ Private Music    │
             │ Public Covers    │
             │ JSON Metadata    │
             └──────────────────┘

        Local Music Library
                │
                ▼
        Music Scanner / Importer
                │
        ┌───────┴────────┐
        ▼                ▼
   Metadata           Artwork
        │                │
        └───────┬────────┘
                ▼
         Supabase Storage
```

---

# 🚀 Running Locally

Clone the repository:

```bash
git clone https://github.com/<your-username>/srs-syntra.git
```

Enter the project:

```bash
cd srs-syntra
```

Install backend dependencies:

```bash
cd server
npm install
```

Create a `.env` file:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SECRET_KEY=your_service_role_key
SUPABASE_MUSIC_BUCKET=music
SUPABASE_COVERS_BUCKET=covers
```

Start the server:

```bash
npm start
```

Open:

```text
http://localhost:3000
```

---

# 📌 Roadmap

## 🟢 v0.9 — Live & Stable *(Current)*

* ✅ Cloud music streaming
* ✅ Albums
* ✅ Singles
* ✅ Dynamic album pages
* ✅ Album slug routing
* ✅ Persistent player
* ✅ Queue system
* ✅ Queue synchronization across pages
* ✅ Queue playback
* ✅ Previous / Next
* ✅ Repeat modes
* ✅ Volume controls
* ✅ Interactive seek bar
* ✅ Click-and-drag seeking
* ✅ Click-and-drag volume control
* ✅ Volume scroll control
* ✅ Expanded player
* ✅ Animated song title scrolling
* ✅ Keyboard shortcuts
* ✅ Responsive design
* ✅ Responsive player
* ✅ Responsive queue panel
* ✅ Responsive track menus
* ✅ Home page
* ✅ Dynamic metadata
* ✅ Album artwork
* ✅ Loading screen
* ✅ Startup data preloading
* ✅ Server error handling
* ✅ Scroll restoration
* ✅ Page transitions
* ✅ Music scanner
* ✅ Automatic metadata synchronization
* ✅ Supabase integration
* ✅ Render deployment
* ✅ Vercel deployment
* ✅ Media Session API
* ✅ OS media controls
* ✅ Album track menus
* ✅ Singles track menus
* ✅ Play Next
* ✅ Add to Queue
* ✅ Cross-page queue synchronization

---

## 🎯 v1.0 — Stable Release

* ⬜ Final UI polish
* ⬜ Final UX polish
* ⬜ Favorites
* ⬜ Saves
* ⬜ Local browser storage for Favorites & Saves
* ⬜ Final testing
* ⬜ Release build

> Favorites and Saves will be stored locally in the user's browser and will remain available unless the browser's cache/site data is cleared.

---

## 📱 v2.0 — Android Application

* ⬜ Android application
* ⬜ Mobile-focused Syntra experience
* ⬜ Android-specific player integration
* ⬜ Mobile UI/UX improvements

**Tentative development timeline:** v2.0 development is planned to begin approximately **6–9 months after the v1.0 release**.

---

# 📸 Screenshots

Screenshots and release visuals will be added as Syntra approaches its stable release.

---

# 👨‍💻 Author

**SRS**

Music Producer • Developer • Video Editor

---

# 🤝 Contributing

Syntra is currently under active development.

Suggestions, issues, and pull requests are welcome.

---

# 📄 License

This project is licensed under the **MIT License**.