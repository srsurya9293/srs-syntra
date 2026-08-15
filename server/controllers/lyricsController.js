const storage = require("../services/storage");

exports.getLyrics = async (req, res) => {
    try {
        const lyrics =
            await storage.getMetadata("lyrics.json");

        res.json(lyrics);

    } catch (error) {
        console.error(
            "Failed to fetch lyrics:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch lyrics"
        });
    }
};