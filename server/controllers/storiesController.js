const storage=require("../services/storage");

exports.getStories=async(req,res)=>{
    try{
        const stories=await storage.getMetadata("songStories.json");
        res.json(stories);

    }catch(error){
        console.error("Failed to fetch song stories:",error);

        res.status(500).json({
            message:"Failed to fetch song stories"
        });
    }
};