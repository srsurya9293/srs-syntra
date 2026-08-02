const fs = require("fs");
const path = require("path");
const { parseFile } = require("music-metadata");
const sharp = require("sharp");

const COVER_DIR = path.join(
    __dirname,
    "../../server/storage/covers"
);

if (!fs.existsSync(COVER_DIR)) {
    fs.mkdirSync(COVER_DIR, {
        recursive: true
    });
}

require("dotenv").config({
    path: path.join(__dirname, "../../server/.env")
});

const storage = require("../../server/services/storage");

const MUSIC_DIR = path.join(
    __dirname,
    "../../server/storage/music"
);

const SONGS_OUT = path.join(
    __dirname,
    "../../server/data/songs.js"
);

const ALBUMS_OUT = path.join(
    __dirname,
    "../../server/data/albums.js"
);


async function walk(dir) {

    let out = [];

    for (const e of fs.readdirSync(dir, {
        withFileTypes: true
    })) {

        const p = path.join(dir, e.name);

        if (e.isDirectory()) {

            out.push(...await walk(p));

        }

        else if (/\.(mp3)$/i.test(e.name)) {

            out.push(p);

        }

    }

    return out;

}


async function scan() {

    console.log("Scanning local music...");

    const files = await walk(MUSIC_DIR);


    /*
     * Load existing metadata from Supabase
     */

    let existingSongs = [];
    let existingAlbums = [];

    try {

        existingSongs =
            await storage.getMetadata("songs.json");

        existingAlbums =
            await storage.getMetadata("albums.json");

        console.log(
            `Loaded ${existingSongs.length} existing songs.`
        );

    }

    catch (err) {

        console.log(
            "No existing metadata found. Starting fresh."
        );

    }


    /*
     * Convert existing metadata into lookup maps
     */

    const songMap = new Map();

    existingSongs.forEach(song => {

        const key =
            `${song.title}|${song.album}|${song.artist}`
                .toLowerCase();

        songMap.set(key, song);

    });


    const albumMap = new Map();

    existingAlbums.forEach(album => {

        const key =
            `${album.title}|${album.artist}`
                .toLowerCase();

        albumMap.set(key, album);

    });


    /*
     * Keep track of songs that actually exist locally.
     * This will be used to remove stale metadata later.
     */

    const localSongKeys = new Set();


    /*
     * Scan local files
     */

    for (const file of files) {

        try {

            console.log(
                "Reading:",
                path.basename(file)
            );


            const meta = await parseFile(file);

            const c = meta.common;
            const f = meta.format;


            const artist =
                c.artist || "Unknown Artist";

            const album =
                c.album || "Unknown Album";

            const title =
                c.title || path.parse(file).name;

            const year =
                c.year || null;

            const track =
                (c.track && c.track.no) || 0;


            /*
             * Unique metadata identity
             */

            const key =
                `${title}|${album}|${artist}`
                    .toLowerCase();


            /*
             * Mark this song as locally present.
             */

            localSongKeys.add(key);


            /*
             * Artwork
             */

            let cover = null;

            if (c.picture && c.picture.length) {

                const coverName =
                    `${artist}-${album}`
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-") +
                    ".jpg";

                const coverPath =
                    path.join(
                        COVER_DIR,
                        coverName
                    );


                await sharp(c.picture[0].data)
                    .jpeg({
                        quality: 90
                    })
                    .toFile(coverPath);


                await storage.uploadCover(
                    coverPath,
                    coverName
                );


                cover = coverName;


                console.log(
                    "Artwork:",
                    coverName
                );

            }


            /*
             * Preserve existing song ID
             * if this song already exists.
             */

            let song =
                songMap.get(key);


            if (song) {

                console.log(
                    "Updating:",
                    title
                );


                song.artist = artist;
                song.album = album;
                song.year = year;

                song.duration =
                    Math.round(
                        f.duration || 0
                    );

                song.track = track;


                if (cover) {

                    song.cover = cover;

                }

            }

            else {

                /*
                 * Generate the next song ID
                 */

                const maxId =
                    existingSongs.reduce(
                        (max, s) =>
                            Math.max(
                                max,
                                Number(s.id) || 0
                            ),
                        0
                    );


                song = {

                    id: maxId + 1,

                    title,
                    artist,
                    album,
                    year,

                    duration:
                        Math.round(
                            f.duration || 0
                        ),

                    track,

                    cover,

                    /*
                     * Keep the existing
                     * Supabase audio structure.
                     */

                    file:
                        `audio/${path
                            .relative(
                                MUSIC_DIR,
                                file
                            )
                            .replace(/\\/g, "/")}`

                };


                songMap.set(
                    key,
                    song
                );


                existingSongs.push(
                    song
                );


                console.log(
                    "Added:",
                    title
                );

            }


            /*
             * Build/update album metadata
             */

            const albumKey =
                `${album}|${artist}`
                    .toLowerCase();


            let albumData =
                albumMap.get(albumKey);


            if (!albumData) {

                /*
                 * Generate the next album ID
                 */

                const maxAlbumId =
                    existingAlbums.reduce(
                        (max, a) =>
                            Math.max(
                                max,
                                Number(a.id) || 0
                            ),
                        0
                    );


                albumData = {

                    id: maxAlbumId + 1,

                    title:
                        album,

                    artist,

                    year,

                    cover:
                        song.cover || null,

                    songs: []

                };


                albumMap.set(
                    albumKey,
                    albumData
                );


                existingAlbums.push(
                    albumData
                );

            }


            /*
             * Add artwork to an existing
             * album if it doesn't have one.
             */

            if (!albumData.cover && cover) {

                albumData.cover =
                    cover;

            }


            /*
             * Add song to album only
             * if it isn't already there.
             */

            if (
                !albumData.songs.includes(
                    song.id
                )
            ) {

                albumData.songs.push(
                    song.id
                );

            }


            /*
             * Keep album songs
             * in track order.
             */

            albumData.songs.sort(
                (a, b) => {

                    const songA =
                        existingSongs.find(
                            s => s.id === a
                        );

                    const songB =
                        existingSongs.find(
                            s => s.id === b
                        );


                    return (
                        (songA?.track || 0) -
                        (songB?.track || 0)
                    );

                }
            );

        }

        catch (err) {

            console.error(
                "Skip:",
                file,
                err.message
            );

        }

    }


    /*
     * Remove songs that no longer
     * exist in the local music folder.
     */

    const syncedSongs =
        existingSongs.filter(
            song => {

                const key =
                    `${song.title}|${song.album}|${song.artist}`
                        .toLowerCase();

                return localSongKeys.has(
                    key
                );

            }
        );


    /*
     * Get IDs of songs that still exist.
     */

    const validSongIds =
        new Set(
            syncedSongs.map(
                song => song.id
            )
        );


    /*
     * Remove missing songs from albums.
     * Remove albums that have no songs left.
     */

    const syncedAlbums =
        existingAlbums
            .filter(album => {

                album.songs =
                    album.songs.filter(
                        id =>
                            validSongIds.has(
                                id
                            )
                    );


                return (
                    album.songs.length > 0
                );

            });


    /*
     * Write local copies
     */

    fs.writeFileSync(
        SONGS_OUT,
        "module.exports=" +
        JSON.stringify(
            syncedSongs,
            null,
            4
        )
    );


    fs.writeFileSync(
        ALBUMS_OUT,
        "module.exports=" +
        JSON.stringify(
            syncedAlbums,
            null,
            4
        )
    );


    /*
     * Upload synced metadata
     */

    await storage.uploadMetadata(
        JSON.stringify(
            syncedSongs,
            null,
            4
        ),
        "songs.json"
    );


    await storage.uploadMetadata(
        JSON.stringify(
            syncedAlbums,
            null,
            4
        ),
        "albums.json"
    );


    console.log(
        "Metadata successfully synced and uploaded."
    );

}


scan().catch(err => {

    console.error(
        "Scanner failed:",
        err
    );

});