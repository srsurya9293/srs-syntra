const storage=require("../services/storage");


exports.getAlbums=async(req,res)=>{

    try{

        const albums=await storage.getMetadata("albums.json");


        const albumsWithUrls=await Promise.all(
            albums.map(async(album)=>{

                let coverUrl=null;

                if(album.cover){
                    coverUrl=await storage.getCoverUrl(album.cover);
                }


                return {
                    ...album,
                    coverUrl
                };

            })
        );


        res.json(albumsWithUrls);


    }catch(error){

        console.error("Failed to fetch albums:",error);

        res.status(500).json({
            message:"Failed to fetch albums"
        });

    }

};


exports.getAlbum=async(req,res)=>{

    try{

        const albums=await storage.getMetadata("albums.json");
        const songs=await storage.getMetadata("songs.json");


        const album=albums.find(
            a=>a.id==req.params.id ||
            a.slug === req.params.id
        );


        if(!album){

            return res.status(404).json({
                message:"Album not found"
            });

        }
        
        const albumSongs=await Promise.all(
            album.songs.map(async(id)=>{

                const song=songs.find(song=>song.id==id);

                if(song?.cover){
                    song.coverUrl=storage.getCoverUrl(song.cover);
                }

                return song;

            })
        );


        const coverUrl=album.cover
    ? await storage.getCoverUrl(album.cover)
    : null;


    res.json({
        id:album.id,
        title:album.title,
        slug:album.slug,
        artist:album.artist,
        year:album.year,
        cover:album.cover,
        coverUrl,
        songs:albumSongs
    });


    }catch(error){

        console.error("Failed to fetch album:",error);

        res.status(500).json({
            message:"Failed to fetch album"
        });

    }

};