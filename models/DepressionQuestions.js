const mongoose = require("mongoose");

const DepressionQuestionSchema = new mongoose.Schema(
  {
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    // correctAnswers: [{ type: String, required: true }],
    isMultipleChoice: { type: Boolean, default: false }, // Indicates if multiple answers can be correct
  },
  { timestamps: true }
);

module.exports = mongoose.model("DepressionQuestion", DepressionQuestionSchema);
