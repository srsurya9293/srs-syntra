const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, "../../server/.env")
});

const storage = require("../../server/services/storage");

const songs=require("../../server/data/songs");
const albums=require("../../server/data/albums");


async function uploadMetadata(){

    const updatedSongs=songs.map(song=>({
        ...song,
        file:`audio/${song.file}`
    }));


    const updatedAlbums=albums.map(album=>({
        ...album,
        cover:`${album.cover}`
    }));


    await storage.uploadMetadata(
        JSON.stringify(updatedSongs,null,4),
        "songs.json"
    );


    await storage.uploadMetadata(
        JSON.stringify(updatedAlbums,null,4),
        "albums.json"
    );


    console.log("Metadata uploaded successfully.");

}


uploadMetadata()
.catch(err=>{

    console.error("Metadata upload failed:",err);

});