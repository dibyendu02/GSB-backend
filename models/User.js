const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userImg: {
      public_id: { type: String },
      secure_url: { type: String },
    },
    phoneNumber: { type: String, required: true, unique: true },
    verified: { type: Boolean, default: false },
    name: { type: String },
    age: { type: Number },
    weight: { type: String },
    goalWeight: { type: String },
    goalHeight: { type: String },
    address: { type: String },
    email: { type: String },
    goal: { type: String },
    zone: { type: String, default: "blue" },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
