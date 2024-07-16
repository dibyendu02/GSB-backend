const express = require("express");
const router = express.Router();
const {
  verifyToken,
  verifyTokenandAuthorization,
  verifyTokenandAdmin,
} = require("../middlewares/verifyToken");
const YTContentVideo = require("../models/YTContentVideo");

// Route to create a new YTContentVideo
router.post("/", verifyToken, async (req, res) => {
  const newYTContentVideo = new YTContentVideo(req.body);
  try {
    const savedYTContentVideo = await newYTContentVideo.save();
    res.status(200).json(savedYTContentVideo);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Route to get all YTContentVideos
router.get("/", verifyToken, async (req, res) => {
  try {
    const ytContentVideos = await YTContentVideo.find();
    res.status(200).json(ytContentVideos);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to update a YTContentVideo by ID
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updatedYTContentVideo = await YTContentVideo.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedYTContentVideo);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to delete a YTContentVideo by ID
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await YTContentVideo.findByIdAndDelete(req.params.id);
    res.status(200).json("YTContentVideo has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
