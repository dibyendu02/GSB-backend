const mongoose = require("mongoose");

const UpdateSchema = new mongoose.Schema(
  {
    updateImg: {
      public_id: { type: String },
      secure_url: { type: String },
    },
    title: { type: String, required: true },
    description: { type: String },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Update", UpdateSchema);
