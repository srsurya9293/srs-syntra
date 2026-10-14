# High-Level Design (HLD)

## 1. Overview
Syntra is a browser-based music platform with a static front-end, an Express API, and a cloud object-storage layer for catalog metadata and media. The application is designed around a simple content model: a music catalog is imported from a local source library, normalized into metadata files, and then exposed to the browser through API endpoints.

The system intentionally separates the responsibilities as follows:
- Client renders pages and manages playback state
- Backend exposes catalog and audio resources
- Supabase Storage stores metadata, music, and covers
- Importer builds and refreshes published catalog content

## 2. Design Goals
- Keep the product visually polished and lightweight
- Use a simple architecture that is easy for a small team to maintain
- Support streaming and playback without a complex database layer
- Separate frontend deployment from backend/media deployment
- Make catalog updates manageable via automation

## 3. Key Architectural Principles
### Simplicity over complexity
The solution favors a small number of production services and a single application language (JavaScript/Node.js) over a larger enterprise stack.

### Storage-first content model
The system treats catalog data as JSON snapshots stored in object storage rather than normalized database rows.

### Thin API layer
The backend is mostly responsible for reading and shaping metadata, forwarding range requests for audio, and serving static client files locally.

### Browser-centric interaction model
The browser owns player state, page transitions, and most UI behaviors; the server mainly provides data and media.

## 4. System Context
The major actors and components are:

- Browser users visiting the front-end experience
- Client-side JavaScript modules that render catalog and player interactions
- Express API hosted on Render
- Supabase Storage buckets for music, covers, and JSON metadata
- Importer scripts scanning local music files and publishing later-used data

## 5. High-Level Architecture

```text
┌──────────────────────┐      HTTPS/API      ┌────────────────────────┐
│                      │ ───────────────────▶ │                        │
│ Browser / Client     │                      │ Vercel Front-end       │
│ (HTML + CSS + JS)    │                      │ static SPA             │
│                      │                      │                        │
└──────────────────────┘                      └────────────┬───────────┘
                                                        │
                                                        │ HTTPS/API
                                                        ▼
                                              ┌──────────────────────┐
                                              │ Express API          │
                                              │ Node.js + Express    │
                                              │ routes/controllers   │
                                              └────────────┬─────────┘
                                                           │
                                                           │ reads metadata / proxies streams
                                                           ▼
                                              ┌──────────────────────┐
                                              │ Supabase Storage     │
                                              │ - metadata JSON      │
                                              │ - music files        │
                                              │ - cover art          │
                                              └──────────────────────┘
                                                           ▲
                                                           │
                                             Local Music Library
                                                           │
                                                           ▼
                                              ┌──────────────────────┐
                                              │ Importer / Scanner   │
                                              │ metadata extraction  │
                                              │ cover/audio publish  │
                                              └──────────────────────┘
```

## 6. Component Responsibilities
### Front-end
Responsibilities:
- Render home, about, album, single, and player views
- Manage route changes and in-page interaction states
- Maintain playback state and queue state in the browser
- Call API endpoints for metadata and audio access
- Provide responsive layout and media-session behaviors

### Backend API
Responsibilities:
- Serve metadata for albums, singles, lyrics, home content, stories, and links
- Convert requests into structured data for the client
- Resolve song identifiers to storage resources
- Proxy streaming requests using byte-range support
- Serve static client assets when running in local combined mode

### Storage layer
Responsibilities:
- Store catalog JSON snapshots and metadata documents
- Store audio files in a private or public configured bucket
- Store album and artist cover assets
- Expose signed or public URLs as needed by the application

### Importer
Responsibilities:
- Scan a local library for audio files
- Extract metadata from MP3 files
- Infer albums, IDs, and slugs
- Process cover art and normalize it for storage
- Publish metadata and cover assets into Supabase

## 7. Data Flow
### Catalog read flow
1. Client requests album or home metadata through the API.
2. Backend loads the relevant JSON metadata document from storage.
3. Controller reads and filters the data.
4. Response is serialized to the client.
5. Client renders track and album information.

### Audio streaming flow
1. Client requests a stream URL with a song ID.
2. Backend identifies the song in the catalog.
3. Backend resolves the storage object URL for the song.
4. Backend forwards the HTTP range header to the upstream media source.
5. Backend streams the response back to the browser to support seeking and playback control.

### Import flow
1. Local music folder is scanned.
2. Metadata is extracted and normalized.
3. Cover images are converted and stored.
4. Catalog JSON is pushed to storage so the API can access it.
5. The application reads refreshed data without a database migration process.

## 8. Deployment View
### Production topology
- Front-end: Vercel-hosted static client
- API: Render-hosted Express service
- Storage: Supabase buckets for metadata, music, and covers
- Source control: GitHub

### Local topology
- A single Node.js process may serve static client files from the project and expose the API on localhost.
- This allows a local developer environment without separate frontend/backend deployment.

## 9. Design Trade-offs
### Advantages
- Low engineering overhead for a small catalog
- Easy inspection and modification of JSON-driven content
- Relatively easy deployment through static hosting + API hosting
- Good match for a small content catalog with limited user accounts

### Trade-offs
- No transactional consistency across multiple JSON files
- No relational query layer for advanced filtering or pagination
- Audio streaming via the backend may use more bandwidth and server resources
- The current model assumes a curated catalog and not a general-purpose music marketplace

## 10. Security and Operational Considerations
- Secrets such as Supabase keys are expected from environment variables.
- Access to private storage should be controlled through secure URL generation and policies.
- The API should validate inputs and boundaries around album and stream requests.
- Server health endpoints and graceful error handling help with reliability.

## 11. Scalability and Future Evolution
This design can evolve in several ways:
- Move from JSON snapshots to a database-backed catalog model
- Add user accounts and personalized playlists
- Introduce search, filters, and recommendation logic
- Improve admin tooling for catalog management and publishing
- Move streaming to a more purpose-built media infrastructure if traffic grows

## 12. Summary
Syntra uses a compact but effective architecture where the browser handles the user experience, the API handles metadata and streaming, and Supabase Storage acts as the system of record for catalog and media content. This design supports a polished front-end experience with simple operational overhead and manageable content maintenance.
