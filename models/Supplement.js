const mongoose = require("mongoose");

const SupplementSchema = new mongoose.Schema(
  {
    productImg: {
      public_id: { type: String },
      secure_url: { type: String },
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Supplement", SupplementSchema);
