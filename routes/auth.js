const express = require("express");
const router = express.Router();
const User = require("../models/User");
const twilio = require("twilio");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const verifyServiceSid = process.env.VERIFY_SERVICE_SID;
const jwtSecret = process.env.JWT_SECRET;

// Route to handle sending OTP
router.post("/phone-login", async (req, res) => {
  const { phone } = req.body;
  try {
    // Find or create user by phone number
    let user = await User.findOne({ phoneNumber: phone });
    if (!user) {
      user = new User({ phoneNumber: phone });
      await user.save();
    }

    // Send OTP to the user's phone using Twilio Verify
    const verification = await twilioClient.verify.v2 // .services(verifyServiceSid)
      .services(verifyServiceSid)
      .verifications.create({ to: phone, channel: "sms" });

    console.log(`Sent verification: '${verification.sid}'`);
    res.status(200).send({ success: true, message: "OTP sent to your phone." });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

// Route to handle OTP verification
router.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;
  try {
    // Find user by phone
    const user = await User.findOne({ phoneNumber: phone });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found." });
    }

    // Verify the OTP using Twilio Verify
    const verificationCheck = await twilioClient.verify
      .services(verifyServiceSid)
      .verificationChecks.create({ to: phone, code: otp });

    if (verificationCheck.status === "approved") {
      // Mark the user as verified
      user.verified = true;
      await user.save();

      // Generate JWT token
      const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "90d" });

      // Spread user data directly into the response object
      // const { _id, phoneNumber, verified, isAdmin } = user._doc;

      res.status(200).send({
        success: true,
        message: "User verified successfully.",
        token,
        user,
      });
    } else {
      res.status(400).send({ success: false, message: "Invalid OTP." });
    }
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

module.exports = router;
