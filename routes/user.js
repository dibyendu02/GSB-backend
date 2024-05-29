const cloudinary = require("cloudinary").v2; // Add this line
const {
  verifyTokenandAuthorization,
  verifyTokenandAdmin,
  verifyToken,
} = require("../middlewares/verifyToken");
const User = require("../models/User");
const { singleUpload } = require("../middlewares/multer");
const { getDataUri } = require("../utils/features");

const router = require("express").Router();

// Upload Profile Image
router.post(
  "/upload-profile-image/:id",
  verifyTokenandAuthorization,
  singleUpload,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const file = getDataUri(req.file);

      // Optional: Delete previous image from Cloudinary
      if (user.userImg?.public_id) {
        await cloudinary.uploader.destroy(user.userImg.public_id);
      }

      const result = await cloudinary.uploader.upload(file.content);
      // console.log(result);

      user.userImg = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };

      const updatedUser = await user.save();
      res.status(200).json(updatedUser);
    } catch (err) {
      console.error("Error during profile image upload:", err); // Additional logging
      res.status(500).json({ message: "Server error", error: err });
    }
  }
);

// Update User Profile
router.put("/:id", verifyTokenandAuthorization, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete User
router.delete("/:id", verifyTokenandAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("Account deleted successfully...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get User
router.get("/find/:id", verifyTokenandAuthorization, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all users
router.get("/", verifyToken, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
