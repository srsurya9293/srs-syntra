const express = require("express");
const router = express.Router();

const albumsController = require("../controllers/albumsController");


router.get("/", albumsController.getAlbums);

router.get("/:id", albumsController.getAlbum);


module.exports = router;