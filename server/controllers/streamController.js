const fs=require("fs");
const path=require("path");

const songs=require("../data/songs");


const streamSong=(req,res)=>{

    const id=Number(req.params.id);


    const song=songs.find(song=>song.id===id);


    if(!song){

        return res.status(404).json({
            message:"Song not found"
        });

    }


    const songPath=path.join(
        __dirname,
        "../storage/music",
        song.file
    );


    if(!fs.existsSync(songPath)){

        console.error("Missing file:",songPath);

        return res.status(404).json({
            message:"Audio file missing"
        });

    }


    const stat=fs.statSync(songPath);

    const fileSize=stat.size;

    const range=req.headers.range;


    if(!range){

        return res.status(400).send("Requires Range header");

    }


    const CHUNK_SIZE=1024*1024;


    const start=Number(
        range.replace(/\D/g,"")
    );


    const end=Math.min(
        start+CHUNK_SIZE-1,
        fileSize-1
    );


    const headers={

        "Content-Range":`bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges":"bytes",
        "Content-Length":end-start+1,
        "Content-Type":"audio/mpeg"

    };


    res.writeHead(206,headers);


    fs.createReadStream(songPath,{
        start,
        end
    }).pipe(res);

};


module.exports={
    streamSong
};