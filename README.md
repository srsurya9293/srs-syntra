# Syntra 🎧

**Syntra by SRS** is a personal music streaming platform built to provide a custom listening experience.

Inspired by modern music platforms, Syntra focuses on a clean interface, personal music management, and a custom-built audio streaming system.

---

## ✨ Current Features

### Frontend

* Dark-themed music interface
* SPA-style navigation
* Dynamic page loading
* Fixed bottom music player
* Smooth scrolling sections
* Song playback controls:

  * Play / Pause
  * Next
  * Previous
  * Seek control
  * Current time and duration display

### Backend

* Custom Node.js server
* Audio streaming system
* REST API for songs and albums
* Dynamic song loading
* Metadata-based song management

---

## 🎵 Music System

Syntra uses audio file metadata as the source of song information.

Instead of manually entering song details, audio files can contain metadata such as:

* Title
* Artist
* Album
* Year
* Track information

The backend scanner reads this metadata and generates the song data used by Syntra.

Current flow:

```
Audio File
    ↓
Metadata Scanner
    ↓
songs.js Database
    ↓
API
    ↓
Frontend
```

Adding music workflow:

```
1. Add metadata to audio file
2. Place file inside storage/music
3. Run scanner
4. Start Syntra server
5. Song appears automatically
```

---

## 📁 Project Structure

```
Syntra

├── client
│   ├── pages
│   ├── css
│   ├── js
│   └── index.html
│
└── server
    ├── controllers
    │   ├── albumsController.js
    │   ├── songsController.js
    │   └── streamController.js
    │
    ├── routes
    │   ├── albums.js
    │   ├── songs.js
    │   └── stream.js
    │
    ├── data
    │   ├── albums.js
    │   └── songs.js
    │
    ├── scanner
    │   └── musicScanner.js
    │
    ├── storage
    │   ├── artists
    │   ├── covers
    │   └── music
    │
    ├── app.js
    └── package.json
```

---

## 🛠️ Technologies Used

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* Node.js
* Express.js
* REST API
* Audio streaming
* Metadata extraction

### Metadata

* `music-metadata`

---

## 🚧 Current Development Status

Completed:

✅ Frontend structure
✅ SPA navigation
✅ Custom audio player
✅ Backend server
✅ Audio streaming
✅ Song API
✅ Metadata scanner
✅ Automatic song information extraction

---

## 🔮 Future Improvements

Planned:

* Automatic scanner execution during server startup
* Album metadata automation
* Embedded cover art extraction
* Better music library management
* Playlists
* Search system
* Improved UI animations

---

## About

Created by **SRS**

**Sound • Rhythm • Story**

Syntra is a personal experiment in building a custom music platform from the ground up.
