const storage=require("../services/storage");

exports.getAlbumLinks=async(req,res)=>{
    try{
        const albumLinks=await storage.getMetadata("albumLinks.json");
        res.json(albumLinks);

    }catch(error){
        console.error("Failed to fetch album links:",error);

        res.status(500).json({
            message:"Failed to fetch album links"
        });
    }
};