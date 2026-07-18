const scanMusic=require("./scanner/musicScanner");
const express = require("express");
const path = require("path");
const fs = require("fs");
const songsRoute = require("./routes/songs");
const streamRoute = require("./routes/stream");
const cors = require("cors");
const albumsRoute = require("./routes/albums");


const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, "../client")));

app.use(express.static(path.join(__dirname,"../client")));

app.use("/covers",express.static(path.join(__dirname,"storage/covers")));

const PORT = 3000;

app.use("/api/albums", albumsRoute);
app.use("/api/songs", songsRoute);
app.use("/stream",streamRoute);

app.get("/stream/test", (req, res) => {
    
});

async function start(){
    await scanMusic();
    app.listen(PORT,()=>{
        console.log(`Server running on ${PORT}`);
    });
}

start();