const express = require("express");
const router = express.Router();
const Question = require("../models/DiabetesQuestions");
const { verifyToken } = require("../middlewares/verifyToken");

// Create a new question
router.post("/", verifyToken, async (req, res) => {
  try {
    const newQuestion = new Question(req.body);
    const savedQuestion = await newQuestion.save();
    res.status(200).json(savedQuestion);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all questions
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get a question by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    res.status(200).json(question);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update a question by ID
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedQuestion);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a question by ID
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.status(200).json("Question deleted successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
