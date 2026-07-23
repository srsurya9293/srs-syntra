require("dotenv").config();

const path=require("path");

const {uploadSong}=require("./services/storage");

(async()=>{

    try{

        const result=await uploadSong(
            path.join(__dirname,"storage/music/Galvanized Square Steel.mp3"),
            "Galvanized Square Steel.mp3"
        );

        console.log(result);

    }

    catch(error){

        console.error(error);

    }

})();