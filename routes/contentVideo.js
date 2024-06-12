const express = require("express");
const router = express.Router();
const {
  verifyToken,
  verifyTokenandAdmin,
} = require("../middlewares/verifyToken");
const { singleUpload } = require("../middlewares/multer");
const { getDataUri } = require("../utils/features");
const ContentVideo = require("../models/ContentVideo");
const cloudinary = require("cloudinary").v2;

// Upload video with text
router.post("/", verifyToken, singleUpload, async (req, res) => {
  const newContentVideo = new ContentVideo(req.body);
  try {
    // Check if a file was uploaded
    if (req.file) {
      const file = getDataUri(req.file);

      // Determine the resource type based on the file's MIME type
      const resourceType = req.file.mimetype.startsWith("video")
        ? "video"
        : "image";

      // Upload the file to Cloudinary
      const result = await cloudinary.uploader.upload(file.content, {
        resource_type: resourceType,
      });

      // Add the file URL to the new meditation video object
      newContentVideo.videoMedia = {
        public_id: result.public_id,
        secure_url: result.secure_url,
        resource_type: resourceType,
      };
    }

    // Save the meditation video to the database
    const savedContentVideo = await newContentVideo.save();
    res.status(200).json(savedContentVideo);
  } catch (err) {
    res.status(500).json(err);
    console.log("video content err ");
    console.log(err);
  }
});

// Route to get all content videos
router.get("/", verifyToken, async (req, res) => {
  try {
    const contentVideos = await ContentVideo.find();
    res.status(200).json(contentVideos);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to delete a video by ID
router.delete("/:id", verifyTokenandAdmin, async (req, res) => {
  try {
    await ContentVideo.findByIdAndDelete(req.params.id);
    res.status(200).json("Video content has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
