# Product Requirements Document (PRD)

## 1. Product Overview
Syntra is a browser-based music streaming experience that lets users discover music, browse albums and singles, and play tracks in a persistent, responsive client. The product combines a static front-end experience with a Node.js + Express API and cloud media storage so users can access releases and stream audio from a catalog managed by the project team.

This PRD defines the core product requirements for the current Syntra application and its expected behavior across browsing, playback, discovery, and administrative metadata ingestion.

## 2. Product Vision
The vision for Syntra is to provide a lightweight, elegant music platform that feels native to the browser while keeping the technical stack simple and maintainable. The product should feel fast, polished, and emotionally engaging, with a strong emphasis on album presentation, track playback, and stable user flows across pages.

## 3. Target Users
### Primary users
- Music listeners who want to browse artist releases and listen without installing an app
- Users who navigate a catalog by album, song, and context-driven recommendations
- Mobile and desktop users who expect a responsive, smooth playback experience

### Secondary users
- Content managers or project maintainers who upload and curate music catalogs
- Developers maintaining metadata, album structures, and streaming links

## 4. Goals
### Business goals
- Deliver a branded, modern music streaming experience that matches the project identity
- Make catalog updates easy without rebuilding the entire client
- Keep deployment simple by splitting front-end hosting and API/media hosting

### User goals
- Browse releases with minimal friction
- Start playback quickly and continue across pages
- Access a clean and responsive UI on desktop and mobile
- Experience persistent player state and media controls

## 5. Non-Goals
- Full social music features such as playlists shared between accounts
- User authentication or personalized account-based libraries
- Real-time collaborative editing or multi-user admin workflows
- A large-scale streaming platform with complex monetization or recommendation systems
- Database-driven catalogs with full relational query layers at this stage

## 6. Core User Flows
### Flow 1: Browse catalog
1. User opens the site.
2. User views the home page, featured albums, singles, and new releases.
3. User selects an album or single.
4. User views track listings and artwork.
5. User begins playback from a track list.

### Flow 2: Listen to album or single
1. User navigates to an album or single page.
2. User sees track metadata, artwork, and album narrative.
3. User clicks play on a track or the album queue.
4. Player updates state and audio begins streaming.
5. User can skip, pause, repeat, set volume, and seek.

### Flow 3: Continue playback across pages
1. User navigates between pages without losing active playback state.
2. Player remains available and synchronized globally.
3. Queue updates follow the user’s selection and navigation context.

### Flow 4: Catalog update pipeline
1. Music files and metadata are scanned locally.
2. Metadata and artwork are extracted and normalized.
3. The importer publishes content to Supabase Storage.
4. The backend reads this metadata and exposes API endpoints to the front-end.

## 7. Functional Requirements
### 7.1 Front-end browsing
- The app shall render a landing page with hero, featured content, and release sections.
- The app shall provide album listing and single listing pages.
- The app shall support page navigation without full reloads using client-side routing.
- The app shall display album cover art and metadata for each release.

### 7.2 Playback
- The app shall support play, pause, previous, next, seek, repeat, and volume controls.
- The app shall maintain a persistent queue across pages.
- The app shall support keyboard shortcuts for common playback actions.
- The app shall show media-session metadata and OS-level playback actions when available.

### 7.3 Catalog and content representation
- The app shall surface album, track, and home-page data from JSON metadata sources.
- The app shall support slug-based album navigation.
- The app shall render story and lyrics metadata when available.

### 7.4 Backend API
- The backend shall expose REST endpoints for albums, singles, home content, lyrics, stories, and stream access.
- The backend shall resolve song and album metadata from stored JSON content.
- The backend shall support stream requests by range to enable seeking.

### 7.5 Importer and metadata pipeline
- The importer shall scan local music and detect album/track metadata.
- The importer shall extract embedded cover art and convert it to a usable format.
- The importer shall push metadata and cover assets to structured storage buckets.
- The importer shall support update and cleanup behavior for removed music and albums.

## 8. Non-Functional Requirements
### Performance
- The front-end should feel fast on first load and during navigation.
- Audio streaming should support range requests without buffering issues for standard desktop/mobile playback.
- The app should avoid unnecessary full-page reloads.

### Reliability
- If the API is unavailable, the app should fail gracefully and indicate server status.
- Playback flows should handle missing metadata and degraded API responses.

### Maintainability
- Front-end logic should remain modular and organized by page/features.
- Backend routes should remain thin and delegate to controllers and services.
- Metadata structures should be easy to inspect and update by maintainers.

### Scalability
- The architecture must support incremental catalog growth without major rework.
- Media storage should be decoupled from front-end hosting so asset and application scaling can evolve separately.

## 9. Data Requirements
The product primarily uses JSON-based metadata stores in Supabase Storage. Catalog objects include:
- albums
- singles
- songs
- home content
- lyrics
- stories
- album links

The app relies on stable IDs and slug references so album pages and related UI can consistently resolve content.

## 10. Acceptance Criteria
The product is accepted when all of the following are true:
- Users can open the landing page and navigate to album and singles sections.
- Users can play tracks and use standard controls.
- Playback persists across navigations within the app.
- Metadata and cover art are loaded from backend-hosted catalog sources.
- The importer can generate or refresh catalog data from a local music library.
- The backend successfully serves stream requests with byte-range support.

## 11. Risks and Constraints
- The architecture depends on separate services and credentials for Vercel, Render, and Supabase.
- Catalog invariants rely on JSON consistency and correct importer outputs.
- Audio proxying can increase bandwidth costs and server load.
- The solution is not designed for multi-user accounts or personalized recommendations.

## 12. Release Scope
### Initial release
- Home page experience
- Album and singles browsing
- Playback controls and queue behavior
- Dynamic API-backed catalog access
- Importer pipeline for metadata and artwork

### Future enhancements
- User accounts and saved collections
- Search and recommendation layers
- Expanded editorial/campaign pages
- Better analytics and catalog management tooling

## 13. Success Metrics
- Users can browse the catalog and listen to content without app installation
- Playback controls remain reliable across page transitions
- Metadata updates can be refreshed with predictable tooling
- The app remains deployable with minimal operational complexity
