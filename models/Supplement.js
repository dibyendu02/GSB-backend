const mongoose = require("mongoose");

const SupplementSchema = new mongoose.Schema(
  {
    productImgs: [
      {
        public_id: { type: String },
        secure_url: { type: String },
      },
    ],
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Supplement", SupplementSchema);
