const fs = require("fs");
const path = require("path");
const {
    parseFile
} = require("music-metadata");
const sharp = require("sharp");
const storage = require("../services/storage");

const MUSIC_DIR = path.join(__dirname, "../storage/music");
const COVER_DIR = path.join(__dirname, "../storage/covers");
const SONGS_OUT = path.join(__dirname, "../data/songs.js");
const ALBUMS_OUT = path.join(__dirname, "../data/albums.js");

if (!fs.existsSync(COVER_DIR)) fs.mkdirSync(COVER_DIR, {
    recursive: true
});

async function walk(dir) {
    let out = [];
    for (const e of fs.readdirSync(dir, {
            withFileTypes: true
        })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) out.push(...await walk(p));
        else if (/\.(mp3)$/i.test(e.name)) out.push(p);
    }
    return out;
}

async function scan() {
    const files = await walk(MUSIC_DIR);
    const songs = [];
    const albums = new Map();
    let songId = 1,
        albumId = 1;
    for (const file of files) {
        try {
            const meta = await parseFile(file);
            const c = meta.common,
                f = meta.format;
            const artist = c.artist || "Unknown Artist";
            const album = c.album || "Unknown Album";
            const title = c.title || path.parse(file).name;
            const year = c.year || null;
            const track = (c.track && c.track.no) || 0;
            let cover=null;

            if(c.picture&&c.picture.length){

                const name=`${artist}-${album}`
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g,"-")+".jpg";

                const coverPath=path.join(COVER_DIR,name);

                await sharp(c.picture[0].data)
                    .jpeg({quality:90})
                    .toFile(coverPath);

                await storage.uploadCover(coverPath,name);

                cover=name;

            }

            await storage.uploadSong(
                file,
                path.relative(MUSIC_DIR,file).replace(/\\/g,"/")
            );

            const song={
                id: songId++,
                title,
                artist,
                album,
                year,
                duration: Math.round(f.duration || 0),
                track,
                cover,
                file: path.relative(MUSIC_DIR, file).replace(/\\/g, "/")
            };
            songs.push(song);
            const key = `${artist}::${album}`;
            if (!albums.has(key)) {
                albums.set(key, {
                    id: albumId++,
                    title: album,
                    artist,
                    year,
                    cover,
                    songs: []
                });
            }
            const a = albums.get(key);
            if (!a.cover && cover) a.cover = cover;
            a.songs.push(song);
        } catch (e) {
            console.error("Skip", file, e.message);
        }
    }
    songs.sort((a, b) => a.album.localeCompare(b.album) || a.track - b.track);
    songs.forEach((s, i) => s.id = i + 1);
    const idMap = new Map(songs.map((s, i) => [s.title + "|" + s.album + "|" + s.artist, i + 1]));
    const albumArr = [...albums.values()].map(a => ({
        id: a.id,
        title: a.title,
        artist: a.artist,
        year: a.year,
        cover: a.cover,
        songs: a.songs.sort((x, y) => x.track - y.track).map(s => idMap.get(s.title + "|" + s.album + "|" + s.artist))
    }));
    fs.writeFileSync(SONGS_OUT, "module.exports=" + JSON.stringify(songs, null, 4));
    fs.writeFileSync(ALBUMS_OUT, "module.exports=" + JSON.stringify(albumArr, null, 4));
    console.log("Scanner complete.");
}

module.exports = scan;