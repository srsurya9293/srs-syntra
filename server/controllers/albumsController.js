const albums=require("../data/albums");
const songs=require("../data/songs");

exports.getAlbums=(req,res)=>{
    res.json(albums);
};


exports.getAlbumById=(req,res)=>{

    const album=albums.find(
        a=>a.id==req.params.id
    );


    if(!album){
        return res.status(404).json({
            message:"Album not found"
        });
    }


    const albumSongs=album.songs.map(id=>
        songs.find(song=>song.id==id)
    );


    res.json({
        id:album.id,
        title:album.title,
        artist:album.artist,
        year:album.year,
        cover:album.cover,
        songs:albumSongs
    });

};