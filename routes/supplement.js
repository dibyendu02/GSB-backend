const express = require("express");
const router = express.Router();
const {
  verifyToken,
  verifyTokenandAdmin,
} = require("../middlewares/verifyToken");
const Supplement = require("../models/Supplement");
const { singleUpload, multipleUpload } = require("../middlewares/multer");
const { getDataUri } = require("../utils/features");
const cloudinary = require("cloudinary").v2; // Ensure cloudinary is configured

// Route to create a new supplement with multiple images
router.post("/", verifyToken, multipleUpload, async (req, res) => {
  const { name, price, description } = req.body;
  const newSupplement = new Supplement({ name, price, description });

  try {
    // Check if files were uploaded
    if (req.files) {
      newSupplement.productImgs = []; // Initialize the array for product images

      // Loop through the files and upload each one to Cloudinary
      for (const file of req.files) {
        const fileUri = getDataUri(file);
        const result = await cloudinary.uploader.upload(fileUri.content);

        // Add the image URL to the new supplement object
        newSupplement.productImgs.push({
          public_id: result.public_id,
          secure_url: result.secure_url,
        });
      }
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

// Route to get a supplement
router.get("/:id", verifyToken, async (req, res) => {
  const { productId } = req.params;
  try {
    const supplements = await Supplement.find({ _id: productId });
    res.status(200).json(supplements);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to update a supplement by ID
router.put("/:id", verifyToken, multipleUpload, async (req, res) => {
  const { name, price, description } = req.body;
  let updatedFields = { name, price, description };

  try {
    // Check if files were uploaded
    if (req.files && req.files.length > 0) {
      updatedFields.productImgs = []; // Initialize the array for new product images

      // Loop through the files and upload each one to Cloudinary
      for (const file of req.files) {
        const fileUri = getDataUri(file);
        const result = await cloudinary.uploader.upload(fileUri.content);

        // Add the image URL to the updated fields
        updatedFields.productImgs.push({
          public_id: result.public_id,
          secure_url: result.secure_url,
        });
      }
    }

    const updatedSupplement = await Supplement.findByIdAndUpdate(
      req.params.id,
      {
        $set: updatedFields,
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
