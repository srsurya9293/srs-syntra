require("dotenv").config();
// const scanMusic=require("./scanner/musicScanner");
const express = require("express");
const path = require("path");
const fs = require("fs");

const cors = require("cors");

const songsRoute = require("./routes/songs");
const streamRoute = require("./routes/stream");

const albumsRoute = require("./routes/albums");
const homeRoute = require("./routes/home");

const lyricsRoutes = require("./routes/lyrics");


const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "../client")));

const PORT = process.env.PORT || 3000;

app.use("/api/albums", albumsRoute);
app.use("/api/songs", songsRoute);
app.use("/stream", streamRoute);
app.use("/api/home", homeRoute);
app.use("/api/stories",require("./routes/stories"));
app.use("/api/album-links",require("./routes/albumLinks"));
app.use("/api/lyrics", require("./routes/lyrics"));

app.get("/ping",(req,res)=>{
    res.json({
        status:"ok"
    });
});

app.get("/stream/test", (req, res) => {
    
});

async function start(){
    //await scanMusic();
    app.listen(PORT,()=>{
        console.log(`Server running on ${PORT}`);
    });
}

start();