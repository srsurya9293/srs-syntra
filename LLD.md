# Low-Level Design (LLD)

## 1. Scope
This document explains the current implementation details of Syntra at the module level, including major client-side JavaScript files, backend route/controller/service layout, and importer behavior. It is written to align with the project structure visible in the repository and the README/backend design notes.

## 2. Repository Structure
```text
client/
  js/
    api.js
    client.js
    home.js
    albums.js
    album.js
    singles.js
    player.js
    router.js
    startup.js
    lyrics.js
    utils.js
    server-status.js
  pages/
  css/
  assets/
server/
  app.js
  controllers/
    albumsController.js
    homeController.js
    lyricsController.js
    songsController.js
    storiesController.js
    albumLinksController.js
    streamController.js
  routes/
    albums.js
    home.js
    lyrics.js
    songs.js
    stories.js
    albumLinks.js
    stream.js
  services/
    storage.js
    supabase.js
  data/
    albums.js
    songs.js
  storage/
    covers/
    music/
importer/
  scanner/
    musicScanner.js
  scripts/
    uploadMetadata.js
jsondatas/
  home.json
  albumLinks.json
  etl.json
  lyrics.json
  songStories.json
```

## 3. Client-Side Runtime Components

### 3.1 startup.js
Purpose:
- Initializes application boot flow
- Loads startup state, config, and global UI state
- Ensures the app is ready before rendering content

Responsibilities:
- Kick off client boot sequence
- Trigger route handling or initial page render
- Prepare shared data structures for player and UI state

### 3.2 router.js
Purpose:
- Manages route transitions and page-specific rendering

Responsibilities:
- Detect current page/URL state
- Load the correct page module
- Reuse persistent player instance when moving between routes
- Restore scroll state and maintain SPA behavior

### 3.3 api.js
Purpose:
- Centralizes API access logic used by client modules

Responsibilities:
- Provide base URL configuration for deployed API endpoints
- Fetch JSON from backend endpoints such as home, albums, singles, lyrics, stories, and songs
- Normalize response payloads and handle failures or unavailable-server states

### 3.4 client.js
Purpose:
- Shared client logic and app-level state coordination

Responsibilities:
- Manage page lifecycle and app state
- Coordinate playback state, queue, and UI updates
- Expose reusable helpers for other modules

### 3.5 player.js
Purpose:
- Core media playback engine for the browser

Responsibilities:
- Manage audio element state
- Handle play/pause, next/previous, seeking, volume, mute, repeat
- Synchronize UI state with media playback events
- Manage queue item selection and progression
- Hook into media session API for OS-level controls
- Support keyboard shortcut handling

### 3.6 home.js
Purpose:
- Render home page sections and discovery blocks

Responsibilities:
- Request home metadata
- Populate hero section, latest release, featured albums, singles, and about/contact content
- Render promotional UI sections

### 3.7 albums.js and album.js
Purpose:
- Handle album collection and detail page behavior

Responsibilities:
- Load albums and single releases
- Build track rows and action menus
- Manage click-to-play behavior and add-to-queue actions
- Render album-specific details and artwork

### 3.8 singles.js
Purpose:
- Render single release pages and track actions

Responsibilities:
- Mirror album browsing logic for singles
- Load details for individual releases
- Keep player queue integration consistent

### 3.9 lyrics.js
Purpose:
- Fetch and display lyric content related to a song

Responsibilities:
- Request lyrics metadata from the API
- Render content into the UI when present
- Safely handle missing data cases

### 3.10 utils.js
Purpose:
- Shared helper functions used across modules

Responsibilities:
- Formatting and parsing helpers
- UI utility functions
- Data transformation and date/slug/metadata utilities

### 3.11 server-status.js
Purpose:
- Surface connection and API availability state

Responsibilities:
- Detect issues with upstream backend APIs
- Provide user-facing status messaging or graceful degradation

## 4. Server-Side Structure

### 4.1 app.js
Purpose:
- Bootstraps the Express server

Responsibilities:
- Load environment variables
- Create Express application
- Enable CORS and serve static client assets
- Mount route modules
- Expose health endpoint at /ping
- Start server on configured port

Important implementation behaviors:
- Uses process.env.PORT or defaults to 3000
- Serves the static client directory from ../client
- Handles both local combined mode and deployed split frontend/API mode

### 4.2 routes/
Each route file exposes HTTP handlers for a domain area.

#### albums.js
- Handles album catalog routes
- Delegates controller work for reading album content

#### home.js
- Handles home page data requests
- Delegates to homeController

#### lyrics.js
- Handles lyrics data requests
- Delegates to lyricsController

#### songs.js
- Manages track-level data requests
- Delegates to songsController

#### stories.js
- Handles song story or narrative data routes
- Delegates to storiesController

#### albumLinks.js
- Handles album link metadata and related content
- Delegates to albumLinksController

#### stream.js
- Handles audio streaming and range requests
- Delegates to streamController

### 4.3 controllers/
Controller functions receive HTTP requests and shape data for the response.

#### albumsController.js
- Reads album metadata from storage-backed JSON
- Resolves albums and track lists
- Returns structured album data to the front-end

#### homeController.js
- Reads home content metadata from JSON
- Returns featured sections such as latest release and featured albums

#### lyricsController.js
- Reads lyrics JSON data
- Returns matching song lyrics payloads

#### songsController.js
- Reads song-level metadata and references
- Resolves songs by ID or related catalog keys

#### storiesController.js
- Reads story metadata and returns associated song story narratives

#### albumLinksController.js
- Reads album link metadata and returns front-end-friendly link objects

#### streamController.js
- Resolves track ID to storage URL
- Forwards Range headers
- Streams media data back to browser

### 4.4 services/

#### storage.js
Purpose:
- Service layer for Supabase Storage access

Responsibilities:
- Create Supabase client from environment config
- Read metadata JSON from configured buckets
- Build public URLs for media and cover images
- Provide access helpers for music and covers

#### supabase.js
Purpose:
- Additional helper logic for storage interaction and URL generation

Responsibilities:
- Optional or alternate storage helper for signed-URL generation
- Works alongside the main storage layer
- May be used for private object access patterns

## 5. Data Model Notes
The app primarily uses JSON-based metadata documents instead of a relational schema.

### 5.1 Metadata files in jsondatas/
- home.json: home page and featured content
- albumLinks.json: link metadata for album-related navigation
- etl.json: transformation or pipeline metadata
- lyrics.json: lyric text and lookups
- songStories.json: narrative/story content for songs

### 5.2 server/data/
- albums.js: album dataset snapshot used by the server
- songs.js: song dataset snapshot used by the server

These files are likely used as static in-memory definitions or as a source for API controllers in the local/server runtime.

## 6. Importer / Content Pipeline

### 6.1 musicScanner.js
Purpose:
- Scans the local music library and normalizes metadata

Responsibilities:
- Detect files from configured source directories
- Read embedded MP3 metadata using libraries such as music-metadata
- Infer album grouping and track ordering
- Generate stable IDs and slugs
- Extract cover images using Sharp or equivalent tooling

### 6.2 uploadMetadata.js
Purpose:
- Push generated metadata and assets into remote storage

Responsibilities:
- Upload JSON data to Supabase storage
- Publish cover art to covers bucket
- Ensure object paths remain consistent with app expectations

## 7. Request/Response Flow Example
### Home page load
1. Browser loads the SPA entry page.
2. home.js requests /home data from the API.
3. homeController loads home.json and returns structured content.
4. Client renders hero, newest release, and featured albums.

### Album detail request
1. Browser opens album route using slug/id.
2. albums.js route receives the request.
3. albumsController resolves the album data.
4. Client renders track list and metadata.

### Audio stream request
1. Player requests /stream/:id.
2. streamController locates the song by ID.
3. Backend resolves storage URL and streams upstream response.
4. Browser uses Range requests for seekable playback.

## 8. Error Handling and Resilience
The current design includes a few practical resilience patterns:
- Graceful detection of unavailable backend services
- Static fallback behavior when content is missing
- Range-supporting media requests for seeking
- UI-level handling for empty or partially missing metadata

Additional design improvements that would improve resilience:
- Strong validation for request parameters
- Structured logging across controllers and services
- Centralized error response contracts
- Better handling for missing storage objects or expired URLs

## 9. Performance Considerations
- JSON metadata is read in memory and returned directly; this is efficient for a small catalog
- Range streaming keeps audio playback responsive and seekable
- Asset loading is split between cover/media storage and the client to reduce local bundle size
- SPA navigation avoids full reloads, helping perceived performance

## 10. Implementation Notes and Risks
- There is an implicit dependency on environment variables for Supabase configuration
- Storage access is highly sensitive to correct bucket naming and object paths
- The current app relies on a curated catalog model and manually managed JSON metadata
- Audio proxies can become a bandwidth bottleneck if the catalog and concurrent listeners grow significantly

## 11. Summary
Syntra’s low-level design is intentionally small and direct: mostly browser-side rendering, simple Express routes and controllers, storage-backed JSON metadata, and a custom importer pipeline for publishing the catalog. The design is straightforward to understand, easy to extend in narrow areas, and well-suited to a content-driven music streaming product with a manageable scale.
