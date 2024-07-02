const express = require("express");
const router = express.Router();
const {
  verifyToken,
  verifyTokenandAdmin,
} = require("../middlewares/verifyToken");
const { singleUpload } = require("../middlewares/multer");
const { getDataUri } = require("../utils/features");
const DietPdf = require("../models/DietPdf"); // Create a new Mongoose model for PDFs if you haven't already
const cloudinary = require("cloudinary").v2;

// Upload PDF with text
router.post("/", verifyToken, singleUpload, async (req, res) => {
  const newDietPdf = new DietPdf(req.body);
  try {
    // Check if a file was uploaded
    if (req.file) {
      const file = getDataUri(req.file);

      // Ensure the file is a PDF
      if (req.file.mimetype !== "application/pdf") {
        return res.status(400).json({ error: "Only PDF files are allowed." });
      }

      // Upload the PDF file to Cloudinary
      const result = await cloudinary.uploader.upload(file.content, {
        resource_type: "raw",
      });

      // Add the file URL to the new content PDF object
      newDietPdf.pdfMedia = {
        public_id: result.public_id,
        secure_url: result.secure_url,
        resource_type: "raw",
      };
    }

    // Save the PDF to the database
    const savedDietPdf = await newDietPdf.save();
    res.status(200).json(savedDietPdf);
  } catch (err) {
    res.status(500).json(err);
    console.log("PDF content err ");
    console.log(err);
  }
});

// Route to get all content PDFs
router.get("/", verifyToken, async (req, res) => {
  try {
    const DietPdfs = await DietPdf.find();
    res.status(200).json(DietPdfs);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to delete a PDF by ID
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await DietPdf.findByIdAndDelete(req.params.id);
    res.status(200).json("PDF content has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
