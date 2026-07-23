const https=require("https");
const storage=require("../services/storage");


const streamSong=async(req,res)=>{

    const id=Number(req.params.id);

    const songs=await storage.getMetadata("songs.json");

    const song=songs.find(song=>song.id===id);

    if(!song){

        return res.status(404).json({
            message:"Song not found"
        });

    }


    const url=await storage.getSongUrl(song.file);
    
    console.log("Streaming from:",url);

    const range=req.headers.range;


    if(!range){

        return res.status(400).send("Requires Range header");

    }


    https.get(url,{
        headers:{
            Range:range
        }
    },response=>{

        res.writeHead(response.statusCode,{
            "Content-Range":response.headers["content-range"],
            "Accept-Ranges":"bytes",
            "Content-Length":response.headers["content-length"],
            "Content-Type":"audio/mpeg"
        });


        response.pipe(res);

    }).on("error",err=>{

        console.error("Stream error:",err);

        res.status(500).json({
            message:"Streaming failed"
        });

    });

};


module.exports={
    streamSong
};