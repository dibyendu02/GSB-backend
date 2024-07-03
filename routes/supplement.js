const express = require("express");
const router = express.Router();
const {
  verifyToken,
  verifyTokenandAdmin,
} = require("../middlewares/verifyToken");
const Supplement = require("../models/Supplement");
const { singleUpload } = require("../middlewares/multer");
const { getDataUri } = require("../utils/features");
const cloudinary = require("cloudinary").v2; // Add this line

router.post("/", verifyToken, singleUpload, async (req, res) => {
  const newSupplement = new Supplement(req.body);
  try {
    // Check if a file was uploaded
    if (req.file) {
      const file = getDataUri(req.file);

      // Upload the image to Cloudinary
      const result = await cloudinary.uploader.upload(file.content);

      // Add the image URL to the new supplement object
      newSupplement.productImg = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };
    }

    // Save the supplement to the database
    const savedSupplement = await newSupplement.save();
    res.status(200).json(savedSupplement);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to get all supplements
router.get("/", verifyToken, async (req, res) => {
  try {
    const supplements = await Supplement.find();
    res.status(200).json(supplements);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to update a supplement by ID
router.put("/:id", verifyToken, singleUpload, async (req, res) => {
  console.log(req.body);
  try {
    const updatedSupplement = await Supplement.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedSupplement);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to delete a supplement by ID
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Supplement.findByIdAndDelete(req.params.id);
    res.status(200).json("Supplement has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
