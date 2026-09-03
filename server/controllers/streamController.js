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

    const headers={};

    if(range){
        headers.Range=range;
    }

    https.get(url,{
        headers
    },response=>{

        const responseHeaders={
            "Accept-Ranges":"bytes",
            "Content-Type":"audio/mpeg"
        };

        if(response.headers["content-range"]){
            responseHeaders["Content-Range"]=
                response.headers["content-range"];
        }

        if(response.headers["content-length"]){
            responseHeaders["Content-Length"]=
                response.headers["content-length"];
        }

        res.writeHead(
            response.statusCode || 200,
            responseHeaders
        );

        response.pipe(res);

    }).on("error",err=>{

        console.error("Stream error:",err);

        if(!res.headersSent){

            res.status(500).json({
                message:"Streaming failed"
            });

        }

    });

};


module.exports={
    streamSong
};