const storage=require("../services/storage");


const getSongs=async(req,res)=>{

    try{

        const songs=await storage.getMetadata("songs.json");

        const songsWithUrls=await Promise.all(
            songs.map(async(song)=>{

                let coverUrl=null;

                if(song.cover){
                    coverUrl=await storage.getCoverUrl(song.cover);
                    console.log("Generated cover URL:", coverUrl);
                }


                return {
                    ...song,
                    coverUrl
                };

            })
        );


        res.json(songsWithUrls);

    }catch(error){

        console.error("Failed to fetch songs:",error);

        res.status(500).json({
            message:"Failed to fetch songs"
        });

    }

};


const getSongById=async(req,res)=>{

    try{

        const songs=await storage.getMetadata("songs.json");

        const id=Number(req.params.id);


        const song=songs.find((song)=>{
            return song.id===id;
        });


        if(!song){

            return res.status(404).json({
                message:"Song not found"
            });

        }


        const coverUrl=song.cover
            ? await storage.getCoverUrl(song.cover)
            : null;


        res.json({
            ...song,
            coverUrl
        });


    }catch(error){

        console.error("Failed to fetch song:",error);

        res.status(500).json({
            message:"Failed to fetch song"
        });

    }

};


module.exports={
    getSongs,
    getSongById
};