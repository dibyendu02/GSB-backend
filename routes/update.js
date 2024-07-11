const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/verifyToken");
const Update = require("../models/Update");
const { singleUpload } = require("../middlewares/multer");
const { getDataUri } = require("../utils/features");
const cloudinary = require("cloudinary").v2; // Add this line

//upload image with text
router.post("/", verifyToken, singleUpload, async (req, res) => {
  const newUpdate = new Update(req.body);
  try {
    // Check if a file was uploaded
    if (req.file) {
      const file = getDataUri(req.file);

      // Upload the image to Cloudinary
      const result = await cloudinary.uploader.upload(file.content);

      // Add the image URL to the new update object
      newUpdate.updateImg = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };
    }

    // Save the update to the database
    const savedUpdate = await newUpdate.save();
    return res.status(200).json(savedUpdate);
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const updates = await Update.find();
    return res.status(200).json(updates);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Route to get updates by userId
router.get("/:userId", verifyToken, async (req, res) => {
  const { userId } = req.params;
  try {
    const userUpdates = await Update.find({ userId: userId });
    return res.status(200).json(userUpdates);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Route to update an update by ID
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updatedUpdate = await Update.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(updatedUpdate);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// Route to delete an update by ID
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Update.findByIdAndDelete(req.params.id);
    return res.status(200).json("Update has been deleted...");
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
