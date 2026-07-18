const songs = require("../data/songs");

const getSongs = (req,res)=>{
    res.json(songs);
};

const getSongById = (req,res)=>{
    const id = Number(req.params.id);

    const song = songs.find((song)=>{
        return song.id === id;
    });

    if(!song){
        return res.status(404).json({
            message:"Song not found"
        });
    }

    res.json(song);
};

module.exports = {
    getSongs,
    getSongById
};