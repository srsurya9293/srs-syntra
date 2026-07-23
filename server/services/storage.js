const {createClient}=require("@supabase/supabase-js");
const fs=require("fs");


const supabase=createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
);


async function uploadSong(localPath,fileName){

    const buffer=fs.readFileSync(localPath);


    const {data,error}=await supabase
    .storage
    .from(process.env.SUPABASE_MUSIC_BUCKET)
    .upload(
        `audio/${fileName}`,
        buffer,
        {
            contentType:"audio/mpeg",
            upsert:true
        }
    );


    if(error) throw error;

    return data;

}


async function uploadCover(localPath,fileName){

    const buffer=fs.readFileSync(localPath);


    const {data,error}=await supabase
    .storage
    .from(process.env.SUPABASE_COVERS_BUCKET)
    .upload(
        fileName,
        buffer,
        {
            contentType:"image/jpeg",
            upsert:true
        }
    );


    if(error) throw error;

    return data;

}


async function uploadMetadata(content,fileName){

    const buffer=Buffer.from(content);


    const {data,error}=await supabase
    .storage
    .from(process.env.SUPABASE_MUSIC_BUCKET)
    .upload(
        `metadata/${fileName}`,
        buffer,
        {
            contentType:"application/json",
            upsert:true
        }
    );


    if(error) throw error;

    return data;

}

async function getMetadata(fileName){

    const {data,error}=await supabase
    .storage
    .from(process.env.SUPABASE_MUSIC_BUCKET)
    .download(`metadata/${fileName}`);


    if(error) throw error;


    const text=await data.text();

    return JSON.parse(text);

}

async function getAudioFile(fileName){

    const {data,error}=await supabase
    .storage
    .from(process.env.SUPABASE_MUSIC_BUCKET)
    .download(fileName);


    if(error) throw error;

    return data;

}

async function getSongUrl(fileName){

    const {data,error}=await supabase
    .storage
    .from(process.env.SUPABASE_MUSIC_BUCKET)
    .createSignedUrl(
        fileName,
        60*60
    );


    if(error) throw error;


    return data.signedUrl;

}

async function getCoverUrl(fileName){

    const {data,error}=await supabase
    .storage
    .from(process.env.SUPABASE_COVERS_BUCKET)
    .createSignedUrl(
        fileName,
        3600
    );


    if(error) throw error;


    return data.signedUrl;

}

module.exports={
    uploadSong,
    uploadCover,
    uploadMetadata,
    getMetadata,
    getAudioFile,
    getSongUrl,
    getCoverUrl
};