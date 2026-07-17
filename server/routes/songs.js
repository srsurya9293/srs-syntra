const express = require("express");
const router = express.Router();

const {
    getSongs,
    getSongById
} = require("../controllers/songsController");

router.get("/",getSongs);

router.get("/:id",getSongById);

module.exports = router;