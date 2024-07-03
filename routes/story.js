const express = require("express");
const router = express.Router();
const {
  verifyToken,
  verifyTokenandAdmin,
} = require("../middlewares/verifyToken");
const Story = require("../models/Story");
const { singleUpload } = require("../middlewares/multer");
const { getDataUri } = require("../utils/features");
const cloudinary = require("cloudinary").v2; // Add this line

//upload image with text
router.post("/", verifyToken, singleUpload, async (req, res) => {
  const newStory = new Story(req.body);
  try {
    // Check if a file was uploaded
    if (req.file) {
      const file = getDataUri(req.file);

      // Upload the image to Cloudinary
      const result = await cloudinary.uploader.upload(file.content);

      // Add the image URL to the new story object
      newStory.storyImg = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };
    }

    // Save the story to the database
    const savedStory = await newStory.save();
    res.status(200).json(savedStory);
  } catch (err) {
    res.status(500).json(err);
  }
});

// router.post("/", verifyToken, async (req, res) => {
//   const newStory = new Story(req.body);
//   try {
//     const savedStory = await newStory.save();
//     res.status(200).json(savedStory);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// Route to get all stories
router.get("/", verifyToken, async (req, res) => {
  try {
    const stories = await Story.find();
    res.status(200).json(stories);
  } catch (err) {
    res.status(500).json(err);
  }
});

//route to get user specific
// Route to get success stories by userId
router.get("/:userId", verifyToken, async (req, res) => {
  const { userId } = req.params;
  try {
    const userStories = await Story.find({ userId: userId });
    res.status(200).json(userStories);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to update a story by ID
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updatedStory = await Story.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedStory);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to delete a story by ID
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Story.findByIdAndDelete(req.params.id);
    res.status(200).json("Story has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
