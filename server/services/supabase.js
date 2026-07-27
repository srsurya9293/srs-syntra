const fs=require("fs");

const {createClient}=require("@supabase/supabase-js");

const supabase=createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
);

const musicBucket=process.env.SUPABASE_MUSIC_BUCKET;
const coversBucket=process.env.SUPABASE_COVERS_BUCKET;
const contentBucket=process.env.SUPABASE_CONTENT_BUCKET

async function uploadSong(filePath,fileName){

    const file=fs.readFileSync(filePath);

    const {error}=await supabase.storage
        .from(musicBucket)
        .upload(fileName,file,{
            upsert:true,
            contentType:"audio/mpeg"
        });

    if(error) throw error;

    return fileName;

}

async function uploadCover(filePath,fileName){

    const file=fs.readFileSync(filePath);

    const {error}=await supabase.storage
        .from(coversBucket)
        .upload(fileName,file,{
            upsert:true,
            contentType:"image/jpeg"
        });

    if(error) throw error;

    return fileName;

}

async function deleteSong(fileName){

    const {error}=await supabase.storage
        .from(musicBucket)
        .remove([fileName]);

    if(error) throw error;

}

async function deleteCover(fileName){

    const {error}=await supabase.storage
        .from(coversBucket)
        .remove([fileName]);

    if(error) throw error;

}

async function readJson(fileName){

    const {data,error}=await supabase.storage
        .from(contentBucket)
        .download(fileName);


    if(error)
        throw error;


    const text=await data.text();


    return JSON.parse(text);

}

function getSongUrl(fileName){

    const {data}=supabase.storage
        .from(musicBucket)
        .getPublicUrl(fileName);

    return data.publicUrl;

}

function getCoverUrl(fileName){

    const {data}=supabase.storage
        .from(coversBucket)
        .getPublicUrl(fileName);

    return data.publicUrl;

}

module.exports={
    uploadSong,
    uploadCover,
    deleteSong,
    deleteCover,
    getSongUrl,
    getCoverUrl,
    readJson
};