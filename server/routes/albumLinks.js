const express=require("express");
const router=express.Router();

const {
    getAlbumLinks
}=require("../controllers/albumLinksController");

router.get("/",getAlbumLinks);

module.exports=router;